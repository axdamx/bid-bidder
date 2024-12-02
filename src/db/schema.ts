import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { AdapterAccountType } from "next-auth/adapters";
import { z } from "zod";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  phone: text("phone"),
  gender: text("gender"),
  birthday: text("birthday"),
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
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const items = pgTable("bb_item", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  currentBid: integer("currentBid").notNull().default(0),
  startingPrice: integer("startingPrice").notNull().default(0),
  binPrice: integer("binPrice"), // Buy It Now price - optional
  imageId: text("imageId"), // New column for storing the image ID
  bidInterval: integer("bidInterval").notNull().default(0),
  endDate: timestamp("endDate", { mode: "date" }).notNull(),
  description: text("description"),
  status: text("status"),
  winnerId: text("winnerId"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const bids = pgTable("bb_bids", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  itemId: serial("itemId")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});

export const usersRelations = relations(bids, ({ one }) => ({
  user: one(users, {
    fields: [bids.userId],
    references: [users.id],
  }),
}));

export const follows = pgTable(
  "follows",
  {
    followerId: text("followerId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("followingId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (follow) => ({
    // Make followerId + followingId combination unique
    compoundKey: primaryKey({
      columns: [follow.followerId, follow.followingId],
    }),
  })
);

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").references(() => items.id, { onDelete: "cascade" }),
  publicId: text("public_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startingPrice: z.number().min(0, "Price must be positive"),
  bidInterval: z.number().min(0, "Bid interval must be positive"),
  binPrice: z.number().min(0, "BIN price must be positive").optional(),
  endDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "End date must be in the future",
  }),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
});

// Define relations
export const itemsRelations = relations(items, ({ many }) => ({
  images: many(images),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  item: one(items, {
    fields: [images.itemId],
    references: [items.id],
  }),
}));

export const bidAcknowledgments = pgTable("bid_acknowledgments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Added reference
  itemId: text("itemId")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }), // Added reference
  acknowledgedAt: timestamp("acknowledgedAt").notNull().defaultNow(),
});

// Add relations
export const bidAcknowledgmentsRelations = relations(bidAcknowledgments, ({ one }) => ({
  user: one(users, {
    fields: [bidAcknowledgments.userId],
    references: [users.id],
  }),
  item: one(items, {
    fields: [bidAcknowledgments.itemId],
    references: [items.id],
  }),
}));

// Types
export type NewItem = typeof items.$inferInsert;
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type CreateItemFormData = z.infer<typeof createItemSchema>;
export type Item = typeof items.$inferSelect;
