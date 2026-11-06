/**
 * Lia@Changes 09-04-26 [WIP]
 * Adds support for tables and code blocks with richResponseMessage (wrapped inside botForwardedMessage).
 *
 * If you use or copy this code, please credit my name or project. AND DO NOT CHANGE THIS NOTE
 */
import { getRandomValues, randomUUID } from 'node:crypto';
import { DONATE_URL, LEXER_REGEX, TEXT_ENCODER } from '../Defaults/index.js';
import { LANGUAGE_KEYWORDS } from '../WABinary/constants.js';
import { CodeHighlightType, RichSubMessageType } from '../Types/RichType.js';
import { proto } from '../../WAProto/index.js';
import { unixTimestampSeconds } from './generics.js';
const NOOP = new Set([]);
export const tokenizeCode = (code, language = 'javascript') => {
    const keywords = LANGUAGE_KEYWORDS[language] || NOOP;
    const blocks = [];
    LEXER_REGEX.lastIndex = 0;
    let match;
    while ((match = LEXER_REGEX.exec(code)) !== null) {
        if (match[1]) {
            blocks.push({ highlightType: CodeHighlightType.COMMENT, codeContent: match[1] });
        }
        else if (match[2]) {
            blocks.push({ highlightType: CodeHighlightType.STRING, codeContent: match[2] });
        }
        else if (match[3]) {
            blocks.push({
                highlightType: keywords.has(match[3]) ? CodeHighlightType.KEYWORD : CodeHighlightType.METHOD,
                codeContent: match[3],
            });
        }
        else if (match[4]) {
            blocks.push({
                highlightType: keywords.has(match[4]) ? CodeHighlightType.KEYWORD : CodeHighlightType.DEFAULT,
                codeContent: match[4],
            });
        }
        else if (match[5]) {
            blocks.push({ highlightType: CodeHighlightType.NUMBER, codeContent: match[5] });
        }
        else {
            blocks.push({ highlightType: CodeHighlightType.DEFAULT, codeContent: match[6] });
        }
    }
    return blocks;
};
// Lia@Changes 09-04-26 --- Inject buffer into unifiedResponse.data to support proper rendering of rich messages (ex: tables and code blocks)
export const toUnified = (submessages, uuid) => ({
    response_id: uuid || randomUUID(),
    sections: submessages.map((submessage, index) => {
        switch (submessage.messageType) {
            case RichSubMessageType.CODE:
                const codeMetadata = submessage.codeMetadata;
                return {
                    view_model: {
                        primitive: {
                            language: codeMetadata.codeLanguage,
                            code_blocks: codeMetadata.codeBlocks.map((block) => ({ content: block.codeContent, type: CodeHighlightType[block.highlightType] })),
                            __typename: 'GenAICodeUXPrimitive'
                        },
                        __typename: 'GenAISingleLayoutViewModel'
                    }
                };
            case RichSubMessageType.CONTENT_ITEMS:
                return {};
            case RichSubMessageType.INLINE_IMAGE:
                return {};
            case RichSubMessageType.LATEX:
                return {};
            case RichSubMessageType.TABLE:
                const tableMetadata = submessage.tableMetadata;
                return {
                    view_model: {
                        primitive: {
                            title: tableMetadata.title,
                            rows: tableMetadata.rows.map((row) => ({
                                is_header: row.isHeading,
                                cells: row.items,
                                markdown_cells: row.items.map((item) => ({ text: item }))
                            })),
                            __typename: 'GenATableUXPrimitive'
                        },
                        __typename: 'GenAISingleLayoutViewModel'
                    }
                };
            case RichSubMessageType.TEXT:
                return {
                    view_model: {
                        primitive: {
                            text: submessage.messageText,
                            inline_entities: submessage.inlineEntities || [],
                            __typename: 'GenAIMarkdownTextUXPrimitive'
                        },
                        __typename: 'GenAISingleLayoutViewModel'
                    }
                };
        }
        return submessage;
    })
});
export const prepareRichResponseMessage = (content) => {
    let { alignment, code, contentText, disclaimerText, footerText, headerText, imageText, inlineImage, inlineVideo, items, language, latex, links, noHeading, posts, products, suggested, richResponse, table, tapLinkUrl, title } = content;
    let submessages = [];
    if (Array.isArray(richResponse)) {
        submessages = richResponse.map((submessage) => {
            if (submessage.text) {
                return {
                    messageType: RichSubMessageType.TEXT,
                    messageText: submessage.text,
                    inlineEntities: submessage.inlineEntities
                };
            }
            else if (submessage.code) {
                return {
                    messageType: RichSubMessageType.CODE,
                    codeMetadata: {
                        codeLanguage: submessage.language,
                        codeBlocks: submessage.code
                    }
                };
            }
            else if (submessage.items) {
                return {
                    messageType: RichSubMessageType.CONTENT_ITEMS,
                    contentItemsMetadata: {
                        itemsMetadata: submessage.items,
                        contentType: proto.AIRichResponseContentItemsMetadata.ContentType.CAROUSEL
                    }
                };
            }
            else if (submessage.inlineImage) {
                return {
                    messageType: RichSubMessageType.INLINE_IMAGE,
                    imageMetadata: {
                        imageUrl: submessage.inlineImage,
                        imageText: submessage.imageText,
                        alignment: submessage.alignment,
                        tapLinkUrl: submessage.tapLinkUrl
                    }
                };
            }
            else if (submessage.inlineVideo) {
                return {
                    messageType: RichSubMessageType.TEXT,
                    messageText: 'INLINE_VIDEO'
                };
            }
            else if (submessage.latex) {
                return {
                    messageType: RichSubMessageType.LATEX,
                    latexMetadata: {
                        text: submessage.text,
                        expressions: submessage.latex
                    }
                };
            }
            else if (submessage.posts) {
                return {
                    messageType: RichSubMessageType.TEXT,
                    messageText: 'POSTS'
                };
            }
            else if (submessage.products) {
                return {
                    messageType: RichSubMessageType.TEXT,
                    messageText: 'PRODUCTS'
                };
            }
            else if (submessage.suggested) {
                return {
                    messageType: RichSubMessageType.TEXT,
                    messageText: 'SUGGESTED_PROMPT'
                };
            }
            else if (submessage.table) {
                return {
                    messageType: RichSubMessageType.TABLE,
                    tableMetadata: {
                        title: submessage.title,
                        rows: submessage.table
                    }
                };
            }
            return submessage;
        });
    }
    else {
        if (headerText) {
            submessages.push({
                messageType: RichSubMessageType.TEXT,
                messageText: headerText
            });
        }
        if (contentText) {
            submessages.push({
                messageType: RichSubMessageType.TEXT,
                messageText: contentText
            });
        }
        if (code) {
            language || (language = 'javascript');
            submessages.push({
                messageType: RichSubMessageType.CODE,
                codeMetadata: {
                    codeLanguage: language,
                    codeBlocks: tokenizeCode(code, language)
                }
            });
        }
        if (items) {
            submessages.push({
                messageType: RichSubMessageType.CONTENT_ITEMS,
                contentItemsMetadata: {
                    itemsMetadata: items,
                    contentType: proto.AIRichResponseContentItemsMetadata.ContentType.CAROUSEL
                }
            });
        }
        if (inlineImage) {
            submessages.push({
                messageType: RichSubMessageType.INLINE_IMAGE,
                imageMetadata: {
                    imageUrl: inlineImage,
                    imageText,
                    alignment,
                    tapLinkUrl
                }
            });
        }
        if (inlineVideo) {
            submessages.push({
                messageType: RichSubMessageType.TEXT,
                messageText: 'INLINE_VIDEO'
            });
        }
        if (latex) {
            submessages.push({
                messageType: RichSubMessageType.LATEX,
                latexMetadata: {
                    text,
                    expressions: latex
                }
            });
        }
        if (links) {
            links.forEach((linkField, index) => {
                const prefix = 'SS_' + index;
                const url = linkField.url || DONATE_URL;
                const sources = linkField.sources?.map((sourceField) => ({
                    source_type: 'THIRD_PARTY',
                    source_display_name: sourceField.displayName || 'Donate',
                    source_subtitle: sourceField.subtitle || 'Saweria',
                    source_url: sourceField.url || url
                }));
                submessages.push({
                    messageType: RichSubMessageType.TEXT,
                    messageText: linkField.text + ` {{${prefix}}}¹{{/${prefix}}} `,
                    inlineEntities: [{
                            key: prefix,
                            metadata: {
                                reference_id: index + 1,
                                reference_url: url,
                                reference_title: linkField.title || 'For Donation via Saweria',
                                reference_display_name: linkField.displayName || 'Donation',
                                sources: sources || [],
                                __typename: 'GenAISearchCitationItem'
                            }
                        }]
                });
            });
        }
        if (posts) {
            submessages.push({
                messageType: RichSubMessageType.TEXT,
                messageText: 'POSTS'
            });
        }
        if (products) {
            submessages.push({
                messageType: RichSubMessageType.TEXT,
                messageText: 'PRODUCTS'
            });
        }
        if (suggested) {
            submessages.push({
                messageType: RichSubMessageType.TEXT,
                messageText: 'SUGGESTED_PROMPT'
            });
        }
        if (table) {
            submessages.push({
                messageType: RichSubMessageType.TABLE,
                tableMetadata: {
                    title,
                    rows: table.map((items, index) => ({
                        isHeading: !noHeading && index == 0,
                        items
                    }))
                }
            });
        }
        if (footerText) {
            submessages.push({
                messageType: RichSubMessageType.TEXT,
                messageText: footerText
            });
        }
    }
    const uuid = randomUUID();
    const unified = toUnified(submessages, uuid);
    const richResponseMessage = proto.AIRichResponseMessage.create({
        submessages,
        messageType: proto.AIRichResponseMessageType.AI_RICH_RESPONSE_TYPE_STANDARD,
        unifiedResponse: {
            data: TEXT_ENCODER.encode(JSON.stringify(unified)) // Lia@Note 25-04-26 --- Expects "ArrayBufferLike"
        },
        contextInfo: {
            isForwarded: true,
            forwardingScore: 1,
            forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
            forwardOrigin: 4,
            botMessageSharingInfo: {
                botEntryPointOrigin: 31,
                forwardScore: 1
            }
        }
    });
    const message = wrapToBotForwardedMessage(richResponseMessage);
    const botMetadata = message.messageContextInfo.botMetadata;
    // Lia@Note 13-05-26 --- Add disclaimer text on richResponseMessage
    if (disclaimerText) {
        botMetadata.messageDisclaimerText = disclaimerText;
    }
    // Lia@Note 15-05-26 --- Add responseId from unified directly to botMetadata
    botMetadata.botResponseId = uuid;
    return message;
};
// Lia@Note 17-04-26 --- signature and certificateChain for proofs[] field
export const wrapToBotForwardedMessage = (richResponseMessage) => ({
    messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: {}
    },
    botForwardedMessage: {
        message: { richResponseMessage }
    }
});



const htmlAppLockHeight = (height) => {
    const value = Number(height);
    if (!Number.isFinite(value) || value <= 0) {
        throw new TypeError('HTML App height must be a positive number');
    }

    return '<style>html,body{height:' + value + 'px!important;overflow:hidden!important;margin:0}</style>'
        + '<script>(function(){var b=document.body;if(!b)return;var w=document.createElement("div");w.id="__wrap";w.style.cssText="height:100%;overflow:auto;overscroll-behavior:contain";while(b.firstChild)w.appendChild(b.firstChild);b.appendChild(w)})()</script>';
};

const htmlAppAutoHeight = ({ min = 60, max = 900, settleMs = 120, maxReports = 24 } = {}) => {
    const low = Number(min);
    const high = Number(max);
    const wait = Number(settleMs);
    const cap = Number(maxReports);

    if (!Number.isFinite(low) || low <= 0) throw new TypeError('autoHeight min must be positive');
    if (!Number.isFinite(high) || high <= low) throw new TypeError('autoHeight max must be greater than min');
    if (!Number.isFinite(wait) || wait < 0) throw new TypeError('autoHeight settleMs must not be negative');
    if (!Number.isFinite(cap) || cap < 1) throw new TypeError('autoHeight maxReports must be at least 1');

    return '<style>html,body{margin:0;padding:0}</style>'
        + '<script>(function(){var LOW=' + low + ',HIGH=' + high + ',WAIT=' + wait + ',CAP=' + cap + ';'
        + 'var sent=[],timer=null,stopped=false;'
        + 'function measure(){var d=document.documentElement,b=document.body;return Math.min(HIGH,Math.max(LOW,Math.ceil(Math.max(d?d.scrollHeight:0,b?b.scrollHeight:0,b?b.offsetHeight:0))))}'
        + 'function report(){if(stopped)return;var h=measure();if(sent.length&&sent[sent.length-1]===h)return;if(sent.length>=2&&sent[sent.length-2]===h){stopped=true;return}sent.push(h);if(sent.length>=CAP)stopped=true;try{window.AndroidBridge.updateSize(h)}catch(e){stopped=true}}'
        + 'function schedule(){if(stopped)return;if(timer!==null)clearTimeout(timer);timer=setTimeout(function(){timer=null;report()},WAIT)}'
        + 'function start(){report();if(typeof ResizeObserver==="function"&&document.body){try{new ResizeObserver(schedule).observe(document.body)}catch(e){}}addEventListener("load",schedule)}'
        + 'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start()})();<' + '/script>';
};

const htmlAppScrollControls = ({ target = '#__wrap', step = 140, holdMs = 70, size = 36, side = 'right', inset = 6 } = {}) => {
    const px = Number(step);
    const hold = Number(holdMs);
    const box = Number(size);
    const edge = Number(inset);

    if (typeof target !== 'string' || !target.trim()) throw new TypeError('scrollControls target must be a CSS selector');
    if (!Number.isFinite(px) || px <= 0) throw new TypeError('scrollControls step must be positive');
    if (!Number.isFinite(hold) || hold < 16) throw new TypeError('scrollControls holdMs must be at least 16');
    if (!Number.isFinite(box) || box < 24) throw new TypeError('scrollControls size must be at least 24');
    if (side !== 'right' && side !== 'left') throw new TypeError('scrollControls side must be right or left');
    if (!Number.isFinite(edge) || edge < 0) throw new TypeError('scrollControls inset must not be negative');

    return '<style>#__sc{position:fixed;' + side + ':' + edge + 'px;bottom:' + edge + 'px;z-index:2147483647;display:none;flex-direction:column;gap:' + Math.round(box / 6) + 'px}'
        + '#__sc button{width:' + box + 'px;height:' + box + 'px;padding:0;border:0;border-radius:' + Math.round(box / 4) + 'px;background:rgba(0,0,0,.6);color:#fff;font:' + Math.round(box / 2) + 'px/1 system-ui;touch-action:none}'
        + '</style><script>(function(){var STEP=' + px + ',HOLD=' + hold + ',SEL=' + JSON.stringify(target) + ';'
        + 'var box,up,down,timer=null;function pane(){return document.querySelector(SEL)||document.scrollingElement||document.body}'
        + 'function room(){var p=pane();return p?p.scrollHeight-p.clientHeight:0}'
        + 'function sync(){if(!box)return;var p=pane(),r=room();box.style.display=r>4?"flex":"none";if(r<=4)return;up.disabled=p.scrollTop<=0;down.disabled=p.scrollTop>=r-1}'
        + 'function move(by){var p=pane();if(!p)return;p.scrollTop+=by;sync()}function stop(){if(timer!==null){clearInterval(timer);timer=null}}'
        + 'function press(e,by){e.preventDefault();e.stopPropagation();stop();move(by);timer=setInterval(function(){move(by)},HOLD)}'
        + 'function make(label,by){var b=document.createElement("button");b.type="button";b.textContent=label;b.addEventListener("touchstart",function(e){press(e,by)},{passive:false});b.addEventListener("touchend",stop);b.addEventListener("touchcancel",stop);b.addEventListener("mousedown",function(e){press(e,by)});b.addEventListener("mouseup",stop);b.addEventListener("mouseleave",stop);return b}'
        + 'function start(){if(box)return;box=document.createElement("div");box.id="__sc";up=make("▲",-STEP);down=make("▼",STEP);box.appendChild(up);box.appendChild(down);document.body.appendChild(box);var p=pane();if(p&&p.addEventListener)p.addEventListener("scroll",sync,{passive:true});if(typeof ResizeObserver==="function"){try{new ResizeObserver(sync).observe(document.body)}catch(e){}}addEventListener("load",sync);sync()}'
        + 'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start()})();<' + '/script>';
};

export const prepareHtmlAppMessage = (content) => {
    const {
        html,
        trustedSources = [],
        height,
        autoHeight: auto,
        scrollButtons,
        title = '',
        label,
        typename = 'GenAIaeacdsnwHtmlPrimitive',
        id
    } = typeof content === 'string' ? { html: content } : content || {};

    if (typeof html !== 'string' || !html.trim()) {
        throw new TypeError('HTML App requires a non-empty HTML string');
    }
    if (!Array.isArray(trustedSources)) {
        throw new TypeError('trustedSources must be an array');
    }
    if (auto && height !== undefined) {
        throw new TypeError('Use either height or autoHeight, not both');
    }

    let payload = html;

    if (auto) {
        payload = htmlAppAutoHeight(auto === true ? undefined : auto) + payload;
    }
    if (height !== undefined) {
        payload = htmlAppLockHeight(height) + payload;
    }
    if (scrollButtons) {
        payload += htmlAppScrollControls(scrollButtons === true ? undefined : scrollButtons);
    }

    const responseId = randomUUID();
    const botResponseId = randomUUID();
    const unified = {
        response_id: responseId,
        sections: [{
            __typename: 'GenAIUnifiedResponseSection',
            ...(id ? { id: String(id) } : {}),
            view_model: {
                primitive: {
                    payload,
                    trusted_sources: trustedSources.map(String),
                    __typename: String(typename)
                },
                __typename: 'GenAISingleLayoutViewModel'
            }
        }]
    };

    const richResponseMessage = proto.AIRichResponseMessage.create({
        submessages: label ? [{ messageType: 2, messageText: String(label) }] : [],
        messageType: proto.AIRichResponseMessageType.AI_RICH_RESPONSE_TYPE_STANDARD,
        unifiedResponse: {
            data: Buffer.from(
                JSON.stringify(unified).replace(/[\u007f-\uffff]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
            ).toString('base64')
        },
        contextInfo: {
            isForwarded: true,
            forwardingScore: 1,
            forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
            forwardOrigin: 4
        }
    });

    const message = wrapToBotForwardedMessage(richResponseMessage);
    const botMetadata = message.messageContextInfo.botMetadata;

    if (title) botMetadata.messageDisclaimerText = String(title);
    botMetadata.botResponseId = botResponseId;

    return message;
};
