import { prepareHtmlAppMessage } from './rich-message-utils.js';
import { generateWAMessageFromContent } from './messages.js';
export const HTML_APP_MESSAGE_CEILING = 1024 * 1024;
export const HTML_APP_BYTE_BUDGET = 960 * 1024;
export const HTML_APP_BYTE_LIMIT = HTML_APP_BYTE_BUDGET;

export const wireBytes = (html) => Buffer.byteLength(
    JSON.stringify(String(html)).replace(/[\u007f-\uffff]/g, c =>
        '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
    ),
    'utf-8'
);

const STORAGE_APIS = [
    'localStorage',
    'sessionStorage',
    'indexedDB',
    'document.cookie',
    'caches'
];

const strip = html => html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/data:[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]*;base64,[A-Za-z0-9+/=]+/gi, 'data:');

const hasVisibilityGuard = source =>
    /document\.(hidden|visibilityState)|visibilitychange|IntersectionObserver|cancelAnimationFrame|clearInterval/.test(source);

export const checkHtmlApp = (html, { height, maxBytes = HTML_APP_BYTE_BUDGET } = {}) => {
    if (typeof html !== 'string') {
        throw new TypeError('checkHtmlApp requires an HTML string');
    }

    const bytes = Buffer.byteLength(html, 'utf-8');
    const wire = wireBytes(html);
    const source = strip(html);
    const problems = [];
    const warnings = [];

    if (wire > maxBytes) {
        problems.push(`HTML melebihi batas ukuran ${Math.round(maxBytes / 1024)}KB`);
    }

    if (wire > bytes * 1.15) {
        warnings.push('Karakter Unicode meningkatkan ukuran pesan setelah encoding');
    }

    const remote = [...source.matchAll(/\b(?:src|href)\s*=\s*["']?(https?:)?\/\//gi)];
    if (remote.length) {
        problems.push(`${remote.length} resource eksternal ditemukan; gunakan data URI`);
    }

    if (/\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new\s+EventSource/.test(source)) {
        problems.push('HTTP request tidak didukung pada HTML App opaque origin');
    }

    const socket = /new\s+WebSocket/.test(source);
    const peer = /RTCPeerConnection/.test(source);

    if (socket && !/wss:\/\//.test(source)) {
        problems.push('WebSocket harus menggunakan wss://');
    }

    if ((socket || peer) && !hasVisibilityGuard(source)) {
        warnings.push('Koneksi aktif perlu dihentikan saat halaman tidak terlihat');
    }

    const storage = STORAGE_APIS.filter(api => source.includes(api));
    if (storage.length) {
        problems.push(`Storage API tidak tersedia: ${storage.join(', ')}`);
    }

    if (/crypto\.subtle/.test(source)) {
        problems.push('crypto.subtle membutuhkan secure context');
    }

    const rafLoop = /requestAnimationFrame/.test(source);
    const interval = /setInterval\s*\(/.test(source);

    if ((rafLoop || interval) && !hasVisibilityGuard(source)) {
        problems.push('Loop animasi atau timer perlu visibility guard');
    }

    const reportsHeight = /AndroidBridge\s*\.\s*updateSize/.test(source);
    if (height === undefined && !reportsHeight) {
        const pinned = /(?:html|body)[^{}]*\{[^{}]*height\s*:\s*\d/i.test(source);
        if (!pinned) warnings.push('Tinggi HTML belum ditentukan');
    }

    if (/aspect-ratio\s*:/i.test(source)) {
        warnings.push('aspect-ratio dapat membuat tinggi tampilan tidak stabil');
    }

    if (/<canvas[^>]*style\s*=\s*["'][^"']*height\s*:\s*auto/i.test(source)) {
        warnings.push('Canvas sebaiknya menggunakan tinggi tetap');
    }

    const dataUris = [...html.matchAll(/data:[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]*;base64,([A-Za-z0-9+/=]+)/gi)];
    const embedded = dataUris.reduce((total, match) => total + match[1].length, 0);

    if (embedded > bytes * 0.6 && dataUris.length) {
        warnings.push('Ukuran media tertanam cukup besar');
    }

    return {
        ok: problems.length === 0,
        bytes,
        wireBytes: wire,
        embeddedBytes: embedded,
        problems,
        warnings
    };
};

export const HTML_MIME_TYPE = 'text/html';

export const sendHtmlDocument = async (sock, jid, html, {
    fileName = 'app.html',
    caption,
    ...options
} = {}) => {
    if (!sock) throw new TypeError('Socket is required');
    if (!jid) throw new TypeError('JID is required');
    if (typeof html !== 'string' || !html.trim()) {
        throw new TypeError('HTML must be a non-empty string');
    }

    const name = String(fileName);

    if (!/\.html?$/i.test(name)) {
        throw new TypeError('File name must end with .html or .htm');
    }

    return sock.sendMessage(jid, {
        document: Buffer.from(html, 'utf-8'),
        mimetype: HTML_MIME_TYPE,
        fileName: name,
        ...(caption ? { caption: String(caption) } : {}),
        ...options
    });
};


export const sendHtmlApp = async (sock, jid, html, {
    title = '',
    label,
    trustedSources = [],
    height,
    autoHeight: auto,
    scrollButtons,
    typename,
    id,
    bypassDownload = false,
    guard = 'warn',
    ...sendOptions
} = {}) => {
    if (!sock || typeof sock.sendMessage !== 'function') {
        throw new TypeError('A valid socket is required');
    }
    if (!jid) throw new TypeError('JID is required');
    if (typeof html !== 'string' || !html.trim()) {
        throw new TypeError('HTML App requires a non-empty HTML string');
    }
    if (auto && height !== undefined) {
        throw new TypeError('Use either height or autoHeight, not both');
    }
    if (!Array.isArray(trustedSources)) {
        throw new TypeError('trustedSources must be an array');
    }

    const report = checkHtmlApp(html, { height });

    if (!report.ok && (guard === true || guard === 'throw')) {
        throw new Error(report.problems.join('\\n'));
    }

    if (guard === 'warn') {
        for (const problem of report.problems) {
            sock.logger?.warn({ jid }, 'html app: ' + problem);
        }
        for (const warning of report.warnings) {
            sock.logger?.warn({ jid }, 'html app: ' + warning);
        }
    }

    const message = prepareHtmlAppMessage({
        html,
        title,
        label,
        trustedSources,
        height,
        autoHeight: auto,
        scrollButtons,
        typename,
        id
    });

    const messageId = sendOptions.messageId;
    const fullMsg = generateWAMessageFromContent(jid, message, {
        ...sendOptions,
        messageId
    });

    await sock.relayMessage(jid, fullMsg.message, {
        messageId: fullMsg.key.id,
        ...sendOptions
    });

    return fullMsg;
};
