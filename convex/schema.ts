import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    order: v.number(),
  })
    .index("by_completed", ["completed"])
    .index("by_order", ["order"]),
});
