export interface Ticket {
  id: string;
  email: string; // requester email: the join key
  subject: string;
  status: "new" | "open" | "pending" | "hold" | "solved" | "closed";
  priority: "low" | "normal" | "high" | "urgent" | null;
  orderId: string | null;
}

// Seed data. Emails must match the Customers subgraph byte for byte, including
// its literal " (customers subgraph)" suffix; order ids are from the orders REST API.
// Demo persona: Kris Marrier (user 10, orders 1-3).
export const TICKETS: Ticket[] = [
  {
    id: "T-1001",
    email: "kris@gmail.com (customers subgraph)",
    subject: "Package arrived damaged, requesting replacement",
    status: "open",
    priority: "high",
    orderId: "2", // order 2 belongs to customer 10 in the REST API
  },
  {
    id: "T-1002",
    email: "kris@gmail.com (customers subgraph)",
    subject: "Question about loyalty points",
    status: "solved",
    priority: "low",
    orderId: null,
  },
  {
    id: "T-2001",
    email: "minna_amigon@yahoo.com (customers subgraph)",
    subject: "Wrong size shipped",
    status: "pending",
    priority: "normal",
    orderId: null,
  },
];
