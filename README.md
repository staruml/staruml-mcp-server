# StarUML MCP Server

[StarUML](https://staruml.io) is a sophisticated modeler for agile and concise modeling. **StarUML MCP Server** enables you to create diagrams or generate codes from diagrams in StarUML via prompts.

## Setup

Prerequisite:

- [StarUML](https://staruml.io/) `v7.0.0` or higher
- [Node.js](https://nodejs.org/) `v22` or higher

Use the version of StarUML MCP Server matching your StarUML:

| StarUML | StarUML MCP Server |
| ------- | ------------------ |
| `v8`    | `0.2.0`            |
| `v7`    | `0.1.0`            |

Set up `claude_desktop_config.json` in Claude Desktop as follows:

```json
{
  "mcpServers": {
    "staruml-mcp-server": {
      "command": "npx",
      "args": ["-y", "staruml-mcp-server@0.2.0"]
    }
  }
}
```

For StarUML `v7`, use `staruml-mcp-server@0.1.0` instead.

You can use the `--api-port=<port>` option to change the API server port for StarUML.

With StarUML `v8`, when the MCP server calls StarUML for the first time, StarUML asks you to allow API access for "StarUML MCP Server". Click **Allow** to continue. The access is kept until StarUML is restarted, and StarUML asks again after a restart.

## Example Prompts

- _"Create a class diagram for book store in StarUML"_
- _"Create a sequence diagram for OAuth authentication in StarUML"_
- _"Generate SQL DDL from the current ERD diagram in StarUML"_

## Tools

- `generate_diagram`
- `get_current_diagram_info`
- `get_all_diagrams_info`
- `get_diagram_image_by_id`

## Dev

1. Clone this repository.
2. Build with `npm run build`.
3. Update `claude_desktop_config.json` in Claude Desktop as below.
4. Restart Claude Desktop.

```json
{
  "mcpServers": {
    "staruml-mcp-server": {
      "command": "node",
      "args": ["<full-path-to>/staruml-mcp-server/build/index.js"]
    }
  }
}
```
