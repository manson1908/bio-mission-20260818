import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { groups, submissions } from "../../../db/schema";

const TEACHER_CODE = "2580";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const db = getDb();
  const leaderboard = await db.select().from(groups).orderBy(desc(groups.score), desc(groups.updatedAt)).limit(30);
  const response: Record<string, unknown> = { groups: leaderboard };
  if (url.searchParams.get("teacherCode") === TEACHER_CODE) {
    response.submissions = await db.select({
      id: submissions.id, groupId: submissions.groupId, groupName: groups.name,
      missionId: submissions.missionId, missionTitle: submissions.missionTitle,
      content: submissions.content, status: submissions.status,
      teacherScore: submissions.teacherScore, feedback: submissions.feedback,
      createdAt: submissions.createdAt,
    }).from(submissions).innerJoin(groups, eq(submissions.groupId, groups.id)).orderBy(desc(submissions.createdAt)).limit(50);
  }
  return Response.json(response);
}

export async function POST(request: Request) {
  const payload = await request.json() as Record<string, unknown>;
  const action = String(payload.action || "");
  const db = getDb();
  const now = Date.now();

  if (action === "join") {
    const name = String(payload.name || "").trim().slice(0, 20);
    const requestedCode = String(payload.code || "").trim().toUpperCase().slice(0, 8);
    if (!name) return Response.json({ error: "請輸入小隊名稱" }, { status: 400 });
    if (requestedCode) {
      const [existing] = await db.select().from(groups).where(eq(groups.code, requestedCode)).limit(1);
      if (existing) return Response.json({ group: existing });
    }
    const code = Math.random().toString(36).slice(2, 7).toUpperCase();
    const [group] = await db.insert(groups).values({ code, name, updatedAt: now }).returning();
    return Response.json({ group }, { status: 201 });
  }

  if (action === "sync") {
    const id = Number(payload.groupId);
    const score = Math.max(0, Number(payload.score) || 0);
    const combo = Math.max(0, Number(payload.combo) || 0);
    const completedModules = JSON.stringify(Array.isArray(payload.completedModules) ? payload.completedModules : []);
    const [group] = await db.update(groups).set({ score, combo, completedModules, updatedAt: now }).where(eq(groups.id, id)).returning();
    return Response.json({ group });
  }

  if (action === "submit") {
    const groupId = Number(payload.groupId);
    const content = String(payload.content || "").trim().slice(0, 1200);
    if (!groupId || content.length < 5) return Response.json({ error: "回答至少需要 5 個字" }, { status: 400 });
    const [submission] = await db.insert(submissions).values({
      groupId, missionId: String(payload.missionId || ""), missionTitle: String(payload.missionTitle || "課堂挑戰"), content, createdAt: now,
    }).returning();
    return Response.json({ submission }, { status: 201 });
  }

  if (action === "grade") {
    if (String(payload.teacherCode || "") !== TEACHER_CODE) return Response.json({ error: "教師碼錯誤" }, { status: 403 });
    const submissionId = Number(payload.submissionId);
    const teacherScore = Math.min(200, Math.max(0, Number(payload.teacherScore) || 0));
    const feedback = String(payload.feedback || "").trim().slice(0, 300);
    const [submission] = await db.update(submissions).set({ status: "graded", teacherScore, feedback, gradedAt: now }).where(eq(submissions.id, submissionId)).returning();
    if (!submission) return Response.json({ error: "找不到提交內容" }, { status: 404 });
    await db.update(groups).set({ score: sql`${groups.score} + ${teacherScore}`, updatedAt: now }).where(eq(groups.id, submission.groupId));
    return Response.json({ submission });
  }

  return Response.json({ error: "不支援的操作" }, { status: 400 });
}
