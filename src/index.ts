#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as response from "./response.js";
import { JsonRpcErrorCode } from "./response.js";
import { api } from "./utils.js";
import packageJson from "../package.json" with { type: "json" };

const NAME = "staruml-mcp-server";
const VERSION = packageJson.version;

// port number for the StarUML's API server (default: 58321)
let apiPort: number = 58321;

// command line argument parsing
const args = process.argv.slice(2);
const apiPortArg = args.find((arg) => arg.startsWith("--api-port="));
if (apiPortArg) {
  const port = apiPortArg.split("=")[1];
  try {
    apiPort = parseInt(port, 10);
    if (isNaN(apiPort) || apiPort < 0 || apiPort > 65535) {
      throw new Error(`Invalid port number: ${port}`);
    }
  } catch (error) {
    console.error(`Invalid port number: ${port}`);
    process.exit(1);
  }
}

// Create an MCP server
const server = new McpServer({
  name: NAME,
  version: VERSION,
});

server.tool(
  "generate_diagram",
  "Generate a diagram in StarUML.",
  {
    code: z
      .string()
      .describe(
        "Mermaid code to generate the diagram. Supported diagrams are classDiagram, sequenceDiagram, flowchart, erDiagram, mindmap, requirementDiagram and stateDiagram. Other diagrams are not supported."
      ),
  },
  async ({ code }) => {
    try {
      await api(apiPort, "/generate_diagram", { code });
      return response.text("Diagram is successfully generated.");
    } catch (error) {
      console.error(error);
      return response.error(
        JsonRpcErrorCode.InternalError,
        `Failed to generate diagram: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("StarUML MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
