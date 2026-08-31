import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteEnquiry, listEnquiries, markEnquiry } from "@/lib/enquiries";

type Params = { params: Promise<{ id: string }> };

const unauthorised = () =>
  NextResponse.json({ error: "Not authenticated." }, { status: 401 });

/** Toggle read/unread: { read: boolean } */
export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) return unauthorised();

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.read !== "boolean") {
    return NextResponse.json({ error: "Expected a boolean 'read'." }, { status: 400 });
  }

  const updated = await markEnquiry(id, body.read);
  if (!updated) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ enquiries: await listEnquiries() });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) return unauthorised();

  const { id } = await params;
  const removed = await deleteEnquiry(id);

  if (!removed) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
