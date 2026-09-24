import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/status-pill";
import { Badge } from "@/components/ui/badge";
import { CLIP_FORMATS, FORMAT_LABELS, RIGHTS_STATUSES, type ClipFormat, type RightsStatus } from "@/lib/engine/types";
import { rightsHelp, rightsLabel } from "@/lib/engine/rights";
import { formatDuration } from "@/lib/format";
import { ingestSource, getSourceAnalysis, createClipsFromCandidates, createSeriesFromSource, listSources } from "@/lib/server/content";
import { tickFactory } from "@/lib/server/factory";

export const Route = createFileRoute("/_studio/create")({ component: CreatePage });

type Candidate = {
  id: string;
  start_seconds: number;
  end_seconds: number;
  title_suggestion: string | null;
  hook: string | null;
  moment_kind: string | null;
  confidence: number | null;
};

async function readVideoMeta(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Could not read this file."));
    });
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    video.currentTime = Math.min(1, duration * 0.12 || 0);
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      window.setTimeout(() => resolve(), 800);
    });
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = Math.max(1, Math.round((480 * (video.videoHeight || 9)) / (video.videoWidth || 16)));
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const thumb = canvas.toDataURL("image/jpeg", 0.72);
    return {
      duration,
      width: video.videoWidth,
      height: video.videoHeight,
      thumb: thumb.length < 160000 ? thumb : undefined,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function CreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"clips" | "series">("clips");
  const [rights, setRights] = useState<RightsStatus>("owned");
  const [confirmed, setConfirmed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Array<{ stage: string; status: string; progress: number }>>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [format, setFormat] = useState<ClipFormat>("short");
  const [seriesName, setSeriesName] = useState("");
  const [busy, setBusy] = useState(false);
  const [library, setLibrary] = useState<Array<{ id: string; title: string | null }>>([]);
  const [captions, setCaptions] = useState(true);

  useEffect(() => {
    void listSources().then((rows) => setLibrary(rows as Array<{ id: string; title: string | null }>));
  }, []);

  useEffect(() => {
    if (!sourceId || step !== 2) return;
    let stop = false;
    const poll = async () => {
      await tickFactory();
      const res = await getSourceAnalysis({ data: sourceId });
      if (!res.ok || stop) return;
      setJobs(res.jobs as typeof jobs);
      setCandidates(res.candidates as Candidate[]);
      if (res.ready) setStep(3);
    };
    void poll();
    const t = window.setInterval(() => void poll(), 900);
    return () => {
      stop = true;
      window.clearInterval(t);
    };
  }, [sourceId, step]);

  const progress = useMemo(() => {
    if (!jobs.length) return 8;
    const sum = jobs.reduce((a, j) => a + Number(j.progress || 0), 0);
    return Math.round(sum / jobs.length);
  }, [jobs]);

  async function submitSource(kind: "upload" | "url" | "library", libraryId?: string) {
    setError(null);
    if (!confirmed) {
      setError("Confirm that you own this content or have permission to use it.");
      return;
    }
    setBusy(true);
    try {
      if (kind === "library" && libraryId) {
        setSourceId(libraryId);
        setStep(2);
        return;
      }
      let meta: { duration?: number; width?: number; height?: number; thumb?: string } = {};
      if (kind === "upload" && file) meta = await readVideoMeta(file);
      const res = await ingestSource({
        data: {
          kind,
          title: title || file?.name,
          originalFilename: file?.name,
          mimeType: file?.type,
          durationSeconds: meta.duration,
          width: meta.width,
          height: meta.height,
          fileSizeBytes: file?.size,
          sourceUrl: kind === "url" ? url : undefined,
          thumbnailDataUrl: meta.thumb,
          rightsStatus: rights,
          ownershipConfirmed: confirmed,
        },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSourceId(res.sourceId);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not ingest this source.");
    } finally {
      setBusy(false);
    }
  }

  async function finishClips() {
    if (!sourceId) return;
    setBusy(true);
    const res = await createClipsFromCandidates({
      data: {
        sourceId,
        candidateIds: selected,
        format,
        aiAssistedCaptions: captions,
        aiGeneratedVisuals: false,
        aiGeneratedVoice: false,
        commercialIntent: false,
        transformative: { substantialEditing: true, commentary: mode === "series", context: true },
      },
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await navigate({ to: "/content" });
  }

  async function finishSeries() {
    if (!sourceId || !seriesName.trim()) {
      setError("Name the series.");
      return;
    }
    setBusy(true);
    const res = await createSeriesFromSource({
      data: { sourceId, name: seriesName.trim(), format: "episode" },
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await navigate({ to: "/series/$id", params: { id: res.seriesId } });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone">Create</p>
        <h1 className="display mt-1 text-4xl">Put work on the line</h1>
      </div>

      <ol className="flex gap-2 text-[11px] uppercase tracking-wide text-stone">
        {["Source", "Analyze", "Select", "Format", "Package"].map((label, i) => (
          <li key={label} className={i + 1 <= step ? "text-forest" : ""}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="space-y-6 rounded-xl border border-line bg-paper p-5 shadow-soft">
          <div className="space-y-2">
            <Label>Rights status</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {RIGHTS_STATUSES.filter((s) => s !== "blocked" && s !== "review_required").map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRights(s)}
                  className={`rounded-lg border px-3 py-3 text-left ${rights === s ? "border-forest bg-forest/5" : "border-line"}`}
                >
                  <div className="text-sm font-medium">{rightsLabel(s)}</div>
                  <div className="mt-1 text-xs text-stone">{rightsHelp(s)}</div>
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            <span>I own this content or have permission or a license to use it. Oracle’s Clip will not treat this as legal clearance.</span>
          </label>
          <div className="space-y-1.5">
            <Label htmlFor="title">Working title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Harbor morning" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-line p-4">
              <div className="text-sm font-medium">Upload video</div>
              <Input type="file" accept="video/*,audio/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              <Button disabled={busy || !file} onClick={() => void submitSource("upload")}>
                {busy ? "Ingesting…" : "Use this file"}
              </Button>
            </div>
            <div className="space-y-2 rounded-lg border border-line p-4">
              <div className="text-sm font-medium">Paste a source URL</div>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
              <p className="text-xs text-stone">YouTube and Vimeo titles can be fetched. Publishing still needs a connected destination.</p>
              <Button disabled={busy || !url} variant="outline" onClick={() => void submitSource("url")}>
                Import URL
              </Button>
            </div>
          </div>
          {library.length > 0 ? (
            <div>
              <div className="mb-2 text-sm font-medium">Existing sources</div>
              <div className="flex flex-wrap gap-2">
                {library.map((s) => (
                  <Button key={s.id} variant="secondary" size="sm" onClick={() => void submitSource("library", s.id)}>
                    {s.title || "Untitled"}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
          {error ? <p className="text-sm text-rose">{error}</p> : null}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-xl border border-line bg-paper p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <h2 className="display text-2xl">Finding moments</h2>
          </div>
          <Progress value={progress} />
          <ul className="space-y-2">
            {jobs.map((j) => (
              <li key={j.stage} className="flex items-center justify-between text-sm">
                <span className="capitalize">{j.stage}</span>
                <StatusPill value={j.status} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-ink-soft">Select the moments worth keeping. Similarity across many cuts will be flagged before publish.</p>
          <div className="space-y-3">
            {candidates.map((c) => {
              const on = selected.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected((cur) => (on ? cur.filter((id) => id !== c.id) : [...cur, c.id]))}
                  className={`w-full rounded-xl border p-4 text-left ${on ? "border-forest bg-forest/5" : "border-line bg-paper"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{c.title_suggestion}</div>
                    <Badge tone="stone">{formatDuration(Number(c.end_seconds) - Number(c.start_seconds))}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{c.hook}</p>
                  <div className="mt-2 flex gap-2 text-xs text-stone">
                    <span>{c.moment_kind?.replaceAll("_", " ")}</span>
                    <span>confidence {Math.round(Number(c.confidence || 0) * 100)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
          <Button disabled={!selected.length} onClick={() => setStep(4)}>
            Continue with {selected.length || 0}
          </Button>
        </div>
      )}

      {step >= 4 && (
        <div className="space-y-5 rounded-xl border border-line bg-paper p-5 shadow-soft">
          <div className="flex gap-2">
            <Button variant={mode === "clips" ? "default" : "outline"} onClick={() => setMode("clips")}>
              Individual clips
            </Button>
            <Button variant={mode === "series" ? "default" : "outline"} onClick={() => setMode("series")}>
              Series
            </Button>
          </div>
          {mode === "clips" ? (
            <>
              <div>
                <Label>Format</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CLIP_FORMATS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={`rounded-full border px-3 py-1.5 text-sm ${format === f ? "border-forest bg-forest text-forest-fg" : "border-line"}`}
                    >
                      {FORMAT_LABELS[f]}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={captions} onChange={(e) => setCaptions(e.target.checked)} />
                Auto captions (transcription aid — not an automatic AI disclosure)
              </label>
              {error ? <p className="text-sm text-rose">{error}</p> : null}
              <Button disabled={busy} onClick={() => void finishClips()}>
                {busy ? "Packaging…" : "Package clips"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="series">Series name</Label>
                <Input id="series" value={seriesName} onChange={(e) => setSeriesName(e.target.value)} placeholder="Harbor Lights" />
              </div>
              <p className="text-sm text-stone">
                Episodes follow the source’s natural length. Titles describe continuity — they are not generated as bait.
              </p>
              {error ? <p className="text-sm text-rose">{error}</p> : null}
              <Button disabled={busy} onClick={() => void finishSeries()}>
                {busy ? "Building…" : "Build series"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
