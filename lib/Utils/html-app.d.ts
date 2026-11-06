export declare const HTML_APP_MESSAGE_CEILING: number;
export declare const HTML_APP_BYTE_BUDGET: number;
export declare const HTML_APP_BYTE_LIMIT: number;

export declare function wireBytes(html: string): number;

export declare function checkHtmlApp(
    html: string,
    options?: {
        height?: number;
        maxBytes?: number;
    }
): {
    ok: boolean;
    bytes: number;
    wireBytes: number;
    embeddedBytes: number;
    problems: string[];
    warnings: string[];
};

export declare const HTML_MIME_TYPE: 'text/html';

export declare function sendHtmlDocument(
    sock: any,
    jid: string,
    html: string,
    options?: {
        fileName?: string;
        caption?: string;
        [key: string]: any;
    }
): Promise<any>;


export declare function sendHtmlApp(
    sock: any,
    jid: string,
    html: string,
    options?: {
        title?: string;
        label?: string;
        trustedSources?: string[];
        height?: number;
        autoHeight?: boolean | {
            min?: number;
            max?: number;
            settleMs?: number;
            maxReports?: number;
        };
        scrollButtons?: boolean | {
            target?: string;
            step?: number;
            holdMs?: number;
            size?: number;
            side?: 'right' | 'left';
            inset?: number;
        };
        typename?: string;
        id?: string;
        bypassDownload?: boolean;
        guard?: boolean | 'warn' | 'throw';
        [key: string]: any;
    }
): Promise<any>;
