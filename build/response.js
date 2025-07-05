// Standard JSON-RPC Error Codes
export var JsonRpcErrorCode;
(function (JsonRpcErrorCode) {
    JsonRpcErrorCode[JsonRpcErrorCode["ParseError"] = -32700] = "ParseError";
    JsonRpcErrorCode[JsonRpcErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
    JsonRpcErrorCode[JsonRpcErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
    JsonRpcErrorCode[JsonRpcErrorCode["InvalidParams"] = -32602] = "InvalidParams";
    JsonRpcErrorCode[JsonRpcErrorCode["InternalError"] = -32603] = "InternalError";
    // -32000 to -32099 are reserved for implementation-defined server-errors.
    JsonRpcErrorCode[JsonRpcErrorCode["ServerError"] = -32000] = "ServerError";
})(JsonRpcErrorCode || (JsonRpcErrorCode = {}));
export function text(text) {
    return {
        content: [
            {
                type: "text",
                text,
            },
        ],
    };
}
export function error(code, message, data) {
    return {
        isError: true,
        error: {
            code,
            message,
            data,
        },
        content: [
            {
                type: "text", // Provide a textual representation of the error in content
                text: message,
            },
        ],
    };
}
export function image(mimeType, data) {
    return {
        content: [
            {
                type: "image",
                data,
                mimeType,
            },
        ],
    };
}
