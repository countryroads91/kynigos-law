import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getPaper } from "@/content/papers";
import { recordEvent } from "@/lib/leads";
import { verifyPaperToken } from "@/lib/paper-token";
import { checkRateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

// The PDFs live outside public/ so this route is the only way to fetch them.
// `outputFileTracingIncludes` in next.config.ts bundles the directory into
// this function's deployment.
const PAPERS_DIR = path.join(process.cwd(), "src", "content", "white-papers");

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;

  // Unauthenticated GET that does a DB write and serves megabytes—rate limit
  // it like the form endpoints.
  if (!(await checkRateLimit(req, "paper"))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  // Only slugs defined in papers.ts resolve—`slug` never touches the
  // filesystem path un-validated.
  const paper = getPaper(slug);
  if (!paper) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  const url = new URL(req.url);
  if (!verifyPaperToken(paper.slug, url.searchParams.get("e"), url.searchParams.get("s"))) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "This download link has expired. Please request the paper again at kynigos.law/white-papers.",
      },
      { status: 403 },
    );
  }

  let file: Buffer;
  try {
    file = await readFile(path.join(PAPERS_DIR, `${paper.slug}.pdf`));
  } catch (err) {
    console.error(`[paper] file missing for slug="${paper.slug}"`, err);
    return NextResponse.json(
      { ok: false, error: "Download unavailable. Please try again later." },
      { status: 500 },
    );
  }

  // Awaited: serverless platforms may kill unawaited work after the response.
  await recordEvent("paper_downloaded", { paperSlug: paper.slug });

  // Zero-copy view over the Buffer—new Uint8Array(buffer-as-arraylike) would
  // duplicate the whole PDF in memory. readFile buffers are always plain
  // ArrayBuffer-backed; the cast only narrows away SharedArrayBuffer.
  const bytes = new Uint8Array(
    file.buffer as ArrayBuffer,
    file.byteOffset,
    file.byteLength,
  );
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${paper.fileName}"`,
      "Content-Length": String(file.byteLength),
      // Signed URLs expire; never let a shared cache serve the file beyond them.
      "Cache-Control": "private, no-store",
    },
  });
}
