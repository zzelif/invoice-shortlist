import {
  pgTable,
  serial,
  text,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

import { AVAILABLE_STATUSES } from "@/data/invoices";

export type AvailableStatuses = (typeof AVAILABLE_STATUSES)[number]["id"];

const statuses = AVAILABLE_STATUSES.map(
  ({ id }) => id
) as Array<AvailableStatuses>;

export const statusEnum = pgEnum(
  "invoice_status",
  statuses as [AvailableStatuses, ...Array<AvailableStatuses>]
);

export type InvoiceStatus = (typeof statusEnum.enumValues)[number];

export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  client: text("client").notNull(),
  clientId: text("clientId").notNull(),
  items: text("items").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: statusEnum("status").default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
