import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createProject, listProjects, sanitise, validate } from "@/lib/store";

const unauthorised = () =>
  NextResponse.json({ error: "Not authenticated." }, { status: 401 });

export async function GET() {
  if (!(await isAuthenticated())) return unauthorised();
  return NextResponse.json({ projects: await listProjects() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return unauthorised();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const data = sanitise(body);
  const errors = validate(data);
  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 422 });
  }

  const project = await createProject(data);

  // Push the change to the statically-rendered public page
  revalidatePath("/");

  return NextResponse.json({ project }, { status: 201 });
}
