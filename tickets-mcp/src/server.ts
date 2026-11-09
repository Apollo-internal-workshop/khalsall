import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { TICKETS } from "./data.js";

const ticketShape = {
  id: z.string(),
  email: z.string().describe("Requester email address"),
  subject: z.string(),
  status: z.enum(["new", "open", "pending", "hold", "solved", "closed"]),
  priority: z.enum(["low", "normal", "high", "urgent"]).nullable(),
  orderId: z.string().nullable().describe("Related order id, if any"),
};

function buildServer(): McpServer {
  const server = new McpServer({ name: "tickets-mcp", version: "1.0.0" });

  server.registerTool(
    "search_tickets",
    {
      title: "Search tickets",
      description: "Find support tickets by requester email, optionally filtered by status.",
      inputSchema: {
        email: z.string().describe("Requester email address"),
        status: z.enum(["new", "open", "pending", "hold", "solved", "closed"]).optional(),
      },
      outputSchema: { tickets: z.array(z.object(ticketShape)) },
    },
    async ({ email, status }) => {
      const tickets = TICKETS.filter(
        (t) => t.email.toLowerCase() === email.toLowerCase() && (!status || t.status === status),
      );
      return {
        structuredContent: { tickets },
        content: [{ type: "text", text: JSON.stringify({ tickets }) }],
      };
    },
  );

  server.registerTool(
    "get_ticket",
    {
      title: "Get ticket",
      description: "Fetch one support ticket by id.",
      inputSchema: { id: z.string() },
      outputSchema: { ticket: z.object(ticketShape) },
    },
    async ({ id }) => {
      const ticket = TICKETS.find((t) => t.id === id);
      if (!ticket) {
        return { isError: true, content: [{ type: "text", text: `Ticket ${id} not found` }] };
      }
      return {
        structuredContent: { ticket },
        content: [{ type: "text", text: JSON.stringify({ ticket }) }],
      };
    },
  );

  return server;
}

const app = express();
app.use(express.json());

// Stateless Streamable HTTP: a fresh server + transport per request, no session ids.
app.post("/mcp", async (req, res) => {
  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const methodNotAllowed = (_req: express.Request, res: express.Response) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed (stateless server)" },
    id: null,
  });
};
app.get("/mcp", methodNotAllowed);
app.delete("/mcp", methodNotAllowed);

app.get("/health", (_req, res) => {
  res.json({ status: "UP" });
});

const port = Number(process.env.PORT ?? 8081);
app.listen(port, () => console.log(`tickets-mcp listening on :${port}/mcp`));
