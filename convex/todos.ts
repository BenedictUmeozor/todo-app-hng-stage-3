import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all todos ordered by order field
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

// Mutation to add a new todo
export const add = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, { text }) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new Error("Todo text cannot be empty");
    }
    
    // Get the highest order value and add 1
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_order")
      .order("desc")
      .take(1);
    const maxOrder = todos.length > 0 ? todos[0].order : -1;
    
    await ctx.db.insert("todos", {
      text: trimmedText,
      completed: false,
      order: maxOrder + 1,
    });
  },
});

// Mutation to toggle todo completion status
export const toggle = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    await ctx.db.patch(id, {
      completed: !todo.completed,
    });
  },
});

// Mutation to update todo text
export const update = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, { id, text }) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new Error("Todo text cannot be empty");
    }
    const todo = await ctx.db.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    await ctx.db.patch(id, {
      text: trimmedText,
    });
  },
});

// Mutation to delete a todo
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Mutation to clear all completed todos
export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .withIndex("by_completed", (q) => q.eq("completed", true))
      .collect();
    
    await Promise.all(
      completedTodos.map((todo) => ctx.db.delete(todo._id))
    );
  },
});

// Mutation to reorder todos
export const reorder = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("todos"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, { updates }) => {
    await Promise.all(
      updates.map(({ id, order }) =>
        ctx.db.patch(id, { order })
      )
    );
  },
});
