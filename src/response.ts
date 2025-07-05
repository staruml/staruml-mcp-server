import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

// Standard JSON-RPC Error Codes
export enum JsonRpcErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  // -32000 to -32099 are reserved for implementation-defined server-errors.
  ServerError = -32000,
}

export interface JsonRpcError {
  code: number; // JsonRpcErrorCode or a custom server error code
  message: string;
  data?: unknown;
}

type MimeType = "image/png" | "image/jpeg" | "image/webp" | "image/svg+xml";

export function text(text: string): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

export function error(
  code: number,
  message: string,
  data?: unknown
): CallToolResult {
  return {
    isError: true,
    error: {
      code,
      message,
      data,
    } as JsonRpcError,
    content: [
      {
        type: "text", // Provide a textual representation of the error in content
        text: message,
      },
    ],
  };
}

export function image(mimeType: MimeType, data: string): CallToolResult {
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
