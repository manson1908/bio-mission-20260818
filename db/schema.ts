import { integer, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  name: text("name").notNull(),
  score: integer("score").notNull().default(0),
  combo: integer("combo").notNull().default(0),
  completedModules: text("completed_modules").notNull().default("[]"),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  uniqueIndex("idx_groups_code").on(table.code),
  index("idx_groups_score").on(table.score),
]);

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: integer("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  missionId: text("mission_id").notNull(),
  missionTitle: text("mission_title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"),
  teacherScore: integer("teacher_score").notNull().default(0),
  feedback: text("feedback").notNull().default(""),
  createdAt: integer("created_at").notNull(),
  gradedAt: integer("graded_at"),
}, (table) => [
  index("idx_submissions_status_created").on(table.status, table.createdAt),
  index("idx_submissions_group_id").on(table.groupId),
]);
