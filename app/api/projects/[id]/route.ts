import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteProject,
  listProjects,
  reorderProject,
  sanitise,
  updateProject,
  validate,
} from "@/lib/store";

type Params = { params: Promise<{ id: string }> };

const unauthorised = () =>
  NextResponse.json({ error: "Not authenticated." }, { status: 401 });

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) return unauthorised();

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // "up"/"down" nudges reuse this endpoint
  if (body.move === "up" || body.move === "down") {
    const moved = await reorderProject(id, body.move);
    if (!moved) {
      return NextResponse.json({ error: "Cannot move any further." }, { status: 409 });
    }
    revalidatePath("/");
    return NextResponse.json({ projects: await listProjects() });
  }

  const existing = (await listProjects()).find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const data = sanitise(body, existing);
  const errors = validate(data);
  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 422 });
  }

  const project = await updateProject(id, data);
  revalidatePath("/");

  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) return unauthorised();

  const { id } = await params;
  const removed = await deleteProject(id);

  if (!removed) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
