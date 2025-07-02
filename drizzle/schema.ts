import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { pgTable, varchar, integer, index, timestamp, primaryKey, text } from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";

const connectionString = process.env.DATABASE_URL!;
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const Board = pgTable(
  "board",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    // userId: text("userId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    backgroundColor: text("backgroundColor").notNull(),
    order: integer("order").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => [
    index("userId_board").on(table.userId),
  ],
);

export const List = pgTable(
  "list",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    title: text("title").notNull(),
    order: integer("order").notNull(),
    color: text("color").notNull(),
    boardId: text("boardId")
      .notNull()
      .references(() => Board.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => [
    index("boardId").on(table.boardId),
  ],
);

export const Item = pgTable(
  "item",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    content: text("content").notNull(),
    order: integer("order").notNull(),
    color: text("color").notNull(),
    listId: text("listId")
      .notNull()
      .references(() => List.id, { onDelete: "cascade" }),
    boardId: text("boardId")
      .notNull()
      .references(() => Board.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => [
    index("listId").on(table.listId),
  ],
);

export const FreeTierLimit = pgTable(
  "free_tier_limit",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    // userId: text("userId").notNull().unique(),
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    boardsCount: integer("boardsCount").default(0).notNull(),
    listsCount: integer("listsCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => [
    index("userId_free_tier_limit").on(table.userId),
  ],
);

export const PremiumSubscription = pgTable(
  "premium_subscription",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),
    // userId: text("userId").notNull().unique(),
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripeCustomerId").unique(),
    stripeSubscriptionId: text("stripeSubscriptionId").unique(),
    stripePriceId: text("stripePriceId").unique(),
    stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => [
    index("userId_premium_subscription").on(table.userId),
  ],
);

export const proxies = pgTable("proxies", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(() => createId()),
  address: text("address").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ListRelations = relations(List, ({ one, many }) => ({
  board: one(Board, { fields: [List.boardId], references: [Board.id] }),
  items: many(Item),
}));

export const ItemRelations = relations(Item, ({ one }) => ({
  list: one(List, { fields: [Item.listId], references: [List.id] }),
}));

export const BoardRelations = relations(Board, ({ many, one }) => ({
  lists: many(List),
  users: one(users, { fields: [Board.userId], references: [users.id] }),
}));

export const UserRelations = relations(users, ({ one, many }) => ({
  boards: many(Board),
  freeTierLimit: one(FreeTierLimit, { fields: [users.id], references: [FreeTierLimit.userId] }),
  premiumSubscription: one(PremiumSubscription, { fields: [users.id], references: [PremiumSubscription.userId] }),
}));

export const proxiesRelations = relations(proxies, ({}) => ({}));
