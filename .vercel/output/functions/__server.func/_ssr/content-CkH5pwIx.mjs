import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-tn7jHlGd.mjs";
import { a as notify, i as newId, o as sql, r as event, t as audit } from "./helpers-CmjLoKEF.mjs";
import { n as ensureCallerProfile } from "./profile-nag8fwPl.mjs";
import { n as segmentEpisodes } from "./clip-detect-goKREYyv.mjs";
import { n as rightsAllowsProcessing, t as normalizeRightsStatus } from "./rights-Blc7xP7N.mjs";
import { t as evaluateCompliance } from "./compliance-D2kiZY5r.mjs";
import { t as enqueueStages } from "./factory-iVnNnG1d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-CkH5pwIx.js
function normalize(text) {
	return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function tokens(text) {
	return new Set(normalize(text).split(" ").filter((t) => t.length > 2));
}
function jaccard(a, b) {
	if (a.size === 0 && b.size === 0) return 1;
	let inter = 0;
	for (const t of a) if (b.has(t)) inter += 1;
	const union = a.size + b.size - inter;
	return union === 0 ? 0 : inter / union;
}
function assessRepetition(input) {
	if (input.previous.length === 0) return {
		risk: "LOW",
		score: 0,
		similarCount: 0,
		rationale: "No prior titles to compare."
	};
	const title = tokens(input.title);
	const hook = tokens(input.hook);
	const desc = tokens(input.description || "");
	let similar = 0;
	let max = 0;
	for (const prev of input.previous) {
		const t = jaccard(title, tokens(prev.title));
		const h = jaccard(hook, tokens(prev.hook));
		const d = jaccard(desc, tokens(prev.description));
		const score = Math.max(t, h, d * .8);
		max = Math.max(max, score);
		if (score >= .72) similar += 1;
	}
	if (max >= .92 || similar >= 6) return {
		risk: "BLOCK",
		score: max,
		similarCount: similar,
		rationale: "These pieces are materially similar. Publishing at this volume creates account and monetization risk."
	};
	if (max >= .8 || similar >= 3) return {
		risk: "HIGH",
		score: max,
		similarCount: similar,
		rationale: "Several recent pieces share the same template, hook, or caption. Vary the work before scaling."
	};
	if (max >= .58 || similar >= 1) return {
		risk: "MEDIUM",
		score: max,
		similarCount: similar,
		rationale: "There is overlap with recent work. A little more original contribution will lower the risk."
	};
	return {
		risk: "LOW",
		score: max,
		similarCount: similar,
		rationale: "Variation against recent work looks healthy."
	};
}
var DEFAULT_TRANSFORM = {
	commentary: false,
	analysis: false,
	narration: false,
	substantialEditing: true,
	reaction: false,
	education: false,
	context: false
};
async function fetchOEmbed(url) {
	const endpoints = [`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`];
	for (const ep of endpoints) try {
		const res = await fetch(ep, { signal: AbortSignal.timeout(4e3) });
		if (!res.ok) continue;
		const data = await res.json();
		return {
			title: data.title,
			thumbnail: data.thumbnail_url
		};
	} catch {}
	return null;
}
var ingestSource_createServerFn_handler = createServerRpc({
	id: "4ab3b371d983ac7d40dfbdb86c7babc1b38b35807aa7a810da14ef9617277da2",
	name: "ingestSource",
	filename: "src/lib/server/content.ts"
}, (opts) => ingestSource.__executeServer(opts));
var ingestSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(ingestSource_createServerFn_handler, async ({ context, data }) => {
	if (!data.ownershipConfirmed) return {
		ok: false,
		error: "Confirm that you own this content or have permission to use it."
	};
	const rights = normalizeRightsStatus(data.rightsStatus);
	if (!rightsAllowsProcessing(rights, data.ownershipConfirmed)) return {
		ok: false,
		error: "This source cannot be processed with the current rights status."
	};
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	let title = data.title?.trim() || data.originalFilename || "Untitled source";
	let thumbnail = data.thumbnailDataUrl ?? null;
	if (data.kind === "url" && data.sourceUrl) {
		const embed = await fetchOEmbed(data.sourceUrl);
		if (embed?.title && !data.title) title = embed.title;
		if (embed?.thumbnail && !thumbnail) thumbnail = embed.thumbnail;
	}
	if (thumbnail && thumbnail.length > 18e4) thumbnail = null;
	const id = newId("src");
	await db`insert into content_sources (
      id, user_id, kind, title, original_filename, mime_type, duration_seconds, width, height,
      file_size_bytes, source_url, thumbnail_data_url, rights_status, ownership_confirmed, notes, is_demo
    ) values (
      ${id}, ${context.userId}, ${data.kind}, ${title}, ${data.originalFilename ?? null}, ${data.mimeType ?? null},
      ${data.durationSeconds ?? null}, ${data.width ?? null}, ${data.height ?? null}, ${data.fileSizeBytes ?? null},
      ${data.sourceUrl ?? null}, ${thumbnail}, ${rights}, ${true}, ${data.notes ?? null}, ${false}
    )`;
	await enqueueStages({
		userId: context.userId,
		sourceId: id,
		stages: [
			"ingest",
			"understand",
			"clip"
		],
		type: "source.analyze",
		isDemo: false
	});
	await audit(db, {
		userId: context.userId,
		actorId: context.userId,
		action: "source.ingested",
		entityType: "source",
		entityId: id,
		detail: rights
	});
	await notify(db, {
		userId: context.userId,
		title: "Source accepted",
		body: `${title} is on the line. The factory is finding moments now.`,
		kind: "factory",
		href: "/create"
	});
	return {
		ok: true,
		sourceId: id,
		demoMode: profile.demo_mode
	};
});
var listSources_createServerFn_handler = createServerRpc({
	id: "f2b03bb4302609c130b1eaebff6a4960cb4400f74952dead62ffba9a043f91d4",
	name: "listSources",
	filename: "src/lib/server/content.ts"
}, (opts) => listSources.__executeServer(opts));
var listSources = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSources_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	return db`
      select id, kind, title, duration_seconds, rights_status, thumbnail_data_url, created_at
      from content_sources
      where user_id = ${context.userId} and is_demo = ${profile.demo_mode}
      order by created_at desc
      limit 50`;
});
var getSourceAnalysis_createServerFn_handler = createServerRpc({
	id: "09631b65e4173bf5d8e674bad759e5e1df68f2d44740219d2a6895c8f3881f6d",
	name: "getSourceAnalysis",
	filename: "src/lib/server/content.ts"
}, (opts) => getSourceAnalysis.__executeServer(opts));
var getSourceAnalysis = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((sourceId) => String(sourceId)).handler(getSourceAnalysis_createServerFn_handler, async ({ context, data: sourceId }) => {
	const db = await sql();
	const source = (await db`
      select * from content_sources where id = ${sourceId} and user_id = ${context.userId} limit 1`)[0];
	if (!source) return {
		ok: false,
		error: "Source not found."
	};
	const jobs = await db`
      select id, stage, status, progress, detail from engine_jobs
      where source_id = ${sourceId} and user_id = ${context.userId}
      order by created_at asc`;
	const candidates = await db`
      select * from clip_candidates where source_id = ${sourceId} and user_id = ${context.userId}
      order by start_seconds asc`;
	const pending = jobs.filter((j) => j.status === "queued" || j.status === "running");
	if (jobs.length === 0) await enqueueStages({
		userId: context.userId,
		sourceId,
		stages: [
			"ingest",
			"understand",
			"clip"
		],
		type: "source.analyze",
		isDemo: false
	});
	return {
		ok: true,
		source,
		jobs,
		candidates,
		ready: pending.length === 0 && candidates.length > 0
	};
});
var createClipsFromCandidates_createServerFn_handler = createServerRpc({
	id: "2995a149738752b7cdc4a2c246f1ba621e8a55dd8a8152c922c382db9c226610",
	name: "createClipsFromCandidates",
	filename: "src/lib/server/content.ts"
}, (opts) => createClipsFromCandidates.__executeServer(opts));
var createClipsFromCandidates = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createClipsFromCandidates_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const source = (await db`
      select * from content_sources where id = ${data.sourceId} and user_id = ${context.userId} limit 1`)[0];
	if (!source) return {
		ok: false,
		error: "Source not found."
	};
	if (data.candidateIds.length === 0) return {
		ok: false,
		error: "Select at least one moment."
	};
	const prior = await db`
      select title, hook, description from clips where user_id = ${context.userId} and is_demo = false
      order by created_at desc limit 40`;
	const created = [];
	for (const candidateId of data.candidateIds) {
		const cand = (await db`
        select * from clip_candidates where id = ${candidateId} and user_id = ${context.userId} and source_id = ${data.sourceId} limit 1`)[0];
		if (!cand) continue;
		const edit = data.edits?.[candidateId] ?? {};
		const title = (edit.title || cand.title_suggestion || source.title || "Untitled clip").trim();
		const hook = (edit.hook || cand.hook || "").trim();
		const description = (edit.description || "").trim();
		const start = edit.start ?? Number(cand.start_seconds);
		const end = edit.end ?? Number(cand.end_seconds);
		const repetition = assessRepetition({
			title,
			hook,
			description,
			previous: prior.map((p) => ({
				title: p.title,
				hook: p.hook || "",
				description: p.description || ""
			}))
		});
		const id = newId("clp");
		await db`insert into clips (
        id, user_id, source_id, title, description, hook, hashtags, format, aspect_ratio, status,
        start_seconds, end_seconds, duration_seconds, thumbnail_data_url, caption_style, branding_enabled,
        confidence, is_demo
      ) values (
        ${id}, ${context.userId}, ${source.id}, ${title}, ${description}, ${hook}, ${edit.hashtags ?? null},
        ${data.format}, ${data.aspectRatio ?? "9:16"}, ${"processing"},
        ${start}, ${end}, ${Math.max(0, end - start)}, ${source.thumbnail_data_url},
        ${data.captionStyle ?? "clean"}, ${Boolean(data.brandingEnabled)}, ${cand.confidence}, ${false}
      )`;
		await db`update clip_candidates set selected = true where id = ${cand.id}`;
		const decision = evaluateCompliance({
			rightsStatus: normalizeRightsStatus(source.rights_status),
			ownershipConfirmed: Boolean(source.ownership_confirmed),
			format: data.format,
			aiAssistedCaptions: Boolean(data.aiAssistedCaptions),
			aiGeneratedVisuals: Boolean(data.aiGeneratedVisuals),
			aiGeneratedVoice: Boolean(data.aiGeneratedVoice),
			commercialIntent: Boolean(data.commercialIntent),
			transformative: {
				...DEFAULT_TRANSFORM,
				...data.transformative
			},
			repetitionRisk: repetition.risk,
			durationSeconds: Math.max(0, end - start),
			title
		});
		await db`insert into compliance_decisions (
        id, clip_id, user_id, publishable, ai_disclosure, commercial_disclosure, copyright_risk,
        monetization, account_risk, content_repetition_risk, rights_status, rationale, policy_version, is_demo
      ) values (
        ${newId("cmp")}, ${id}, ${context.userId}, ${decision.publishable}, ${decision.aiDisclosure},
        ${decision.commercialDisclosure}, ${decision.copyrightRisk}, ${decision.monetization},
        ${decision.accountRisk}, ${decision.contentRepetitionRisk}, ${decision.rightsStatus},
        ${decision.rationale.join("\n")}, ${decision.policyVersion}, ${false}
      )`;
		await enqueueStages({
			userId: context.userId,
			clipId: id,
			sourceId: source.id,
			stages: [
				"edit",
				"ai",
				"render",
				"quality",
				"rights",
				"policy",
				"monetization",
				"package"
			],
			type: "clip.package",
			isDemo: false
		});
		await db`update clips set status = ${decision.publishable === "no" ? "blocked" : decision.publishable === "review" ? "review" : "ready"}, updated_at = now() where id = ${id}`;
		created.push(id);
		prior.unshift({
			title,
			hook,
			description
		});
	}
	if (created.length === 0) return {
		ok: false,
		error: "No clips could be created."
	};
	await notify(db, {
		userId: context.userId,
		title: created.length === 1 ? "Clip packaged" : `${created.length} clips packaged`,
		body: "Open Content to review compliance, then publish only what you are willing to stand behind.",
		kind: "content",
		href: "/content"
	});
	return {
		ok: true,
		clipIds: created,
		demoMode: profile.demo_mode
	};
});
var createSeriesFromSource_createServerFn_handler = createServerRpc({
	id: "420b839e7359ae43581b4803d5182597342e5dae319d637fba5e3e6ac4c480da",
	name: "createSeriesFromSource",
	filename: "src/lib/server/content.ts"
}, (opts) => createSeriesFromSource.__executeServer(opts));
var createSeriesFromSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSeriesFromSource_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await ensureCallerProfile(context.userId);
	const source = (await db`
      select * from content_sources where id = ${data.sourceId} and user_id = ${context.userId} limit 1`)[0];
	if (!source) return {
		ok: false,
		error: "Source not found."
	};
	const name = data.name.trim();
	if (!name) return {
		ok: false,
		error: "Name the series."
	};
	const episodes = segmentEpisodes({
		durationSeconds: Number(source.duration_seconds || 0),
		seriesName: name,
		targetSeconds: data.targetSeconds
	});
	const seriesId = newId("ser");
	await db`insert into series (id, user_id, source_id, name, description, genre, rights_status, status, is_demo)
      values (${seriesId}, ${context.userId}, ${source.id}, ${name}, ${data.description ?? null}, ${data.genre ?? null}, ${source.rights_status}, ${"ready"}, ${false})`;
	const clipIds = [];
	for (const ep of episodes) {
		const id = newId("clp");
		clipIds.push(id);
		await db`insert into clips (
        id, user_id, source_id, series_id, episode_number, title, hook, format, status,
        start_seconds, end_seconds, duration_seconds, thumbnail_data_url, is_demo
      ) values (
        ${id}, ${context.userId}, ${source.id}, ${seriesId}, ${ep.episodeNumber}, ${ep.title}, ${ep.hook},
        ${data.format ?? "episode"}, ${"ready"}, ${ep.startSeconds}, ${ep.endSeconds},
        ${ep.endSeconds - ep.startSeconds}, ${source.thumbnail_data_url}, ${false}
      )`;
		const decision = evaluateCompliance({
			rightsStatus: normalizeRightsStatus(source.rights_status),
			ownershipConfirmed: Boolean(source.ownership_confirmed),
			format: data.format ?? "episode",
			aiAssistedCaptions: false,
			aiGeneratedVisuals: false,
			aiGeneratedVoice: false,
			commercialIntent: false,
			transformative: {
				...DEFAULT_TRANSFORM,
				commentary: true,
				context: true
			},
			repetitionRisk: "LOW",
			durationSeconds: ep.endSeconds - ep.startSeconds,
			title: ep.title
		});
		await db`insert into compliance_decisions (
        id, clip_id, user_id, publishable, ai_disclosure, commercial_disclosure, copyright_risk,
        monetization, account_risk, content_repetition_risk, rights_status, rationale, policy_version, is_demo
      ) values (
        ${newId("cmp")}, ${id}, ${context.userId}, ${decision.publishable}, ${decision.aiDisclosure},
        ${decision.commercialDisclosure}, ${decision.copyrightRisk}, ${decision.monetization},
        ${decision.accountRisk}, ${decision.contentRepetitionRisk}, ${decision.rightsStatus},
        ${decision.rationale.join("\n")}, ${decision.policyVersion}, ${false}
      )`;
	}
	await enqueueStages({
		userId: context.userId,
		sourceId: source.id,
		seriesId,
		stages: [
			"understand",
			"clip",
			"package"
		],
		type: "series.build",
		isDemo: false
	});
	await event(db, {
		userId: context.userId,
		kind: "series",
		message: `Series “${name}” created with ${episodes.length} episode${episodes.length === 1 ? "" : "s"}`
	});
	return {
		ok: true,
		seriesId,
		clipIds,
		episodeCount: episodes.length
	};
});
var listContent_createServerFn_handler = createServerRpc({
	id: "9095e1f6f996d234e74071b08b71af9856ed4c753c583a43d95bcb267d75146c",
	name: "listContent",
	filename: "src/lib/server/content.ts"
}, (opts) => listContent.__executeServer(opts));
var listContent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(listContent_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	const status = data.status && data.status !== "all" ? data.status : null;
	const q = data.query?.trim() ? `%${data.query.trim().toLowerCase()}%` : null;
	const rows = await db`
      select c.*, s.name as series_name,
        (select p.platform from publications p where p.clip_id = c.id order by p.created_at desc limit 1) as last_platform,
        (select p.status from publications p where p.clip_id = c.id order by p.created_at desc limit 1) as last_publish_status,
        (select d.copyright_risk from compliance_decisions d where d.clip_id = c.id order by d.created_at desc limit 1) as copyright_risk,
        (select d.monetization from compliance_decisions d where d.clip_id = c.id order by d.created_at desc limit 1) as monetization,
        (select d.publishable from compliance_decisions d where d.clip_id = c.id order by d.created_at desc limit 1) as publishable,
        coalesce((select sum(a.views)::int from analytics_snapshots a where a.clip_id = c.id), 0) as views,
        coalesce((select sum(e.amount_cents)::int from earnings_ledger e where e.clip_id = c.id and e.kind = 'confirmed'), 0) as confirmed_cents,
        coalesce((select sum(e.amount_cents)::int from earnings_ledger e where e.clip_id = c.id and e.kind = 'estimated'), 0) as estimated_cents
      from clips c
      left join series s on s.id = c.series_id
      where c.user_id = ${context.userId}
        and c.is_demo = ${profile.demo_mode}
        and (${status}::text is null or c.status = ${status})
        and (${q}::text is null or lower(c.title) like ${q})
      order by c.created_at desc
      limit 80`;
	return {
		demoMode: profile.demo_mode,
		clips: rows
	};
});
var getClip_createServerFn_handler = createServerRpc({
	id: "1e4dceeba5268d18fbf8d09db29be11805392bdc0cf62d2f6b930954a752bbe4",
	name: "getClip",
	filename: "src/lib/server/content.ts"
}, (opts) => getClip.__executeServer(opts));
var getClip = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => String(id)).handler(getClip_createServerFn_handler, async ({ context, data: id }) => {
	const db = await sql();
	const clip = (await db`select * from clips where id = ${id} and user_id = ${context.userId} limit 1`)[0];
	if (!clip) return {
		ok: false,
		error: "Clip not found."
	};
	const compliance = await db`select * from compliance_decisions where clip_id = ${id} order by created_at desc limit 1`;
	const publications = await db`select * from publications where clip_id = ${id} order by created_at desc`;
	const jobs = await db`select * from engine_jobs where clip_id = ${id} order by created_at asc`;
	const events = await db`select * from engine_events where clip_id = ${id} order by created_at desc limit 30`;
	const analytics = await db`select * from analytics_snapshots where clip_id = ${id} order by collected_at desc`;
	const ledger = await db`select * from earnings_ledger where clip_id = ${id} order by created_at desc`;
	return {
		ok: true,
		clip,
		series: clip.series_id ? (await db`select * from series where id = ${String(clip.series_id)} and user_id = ${context.userId} limit 1`)[0] ?? null : null,
		compliance: compliance[0] ?? null,
		publications,
		jobs,
		events,
		analytics,
		ledger
	};
});
var updateClip_createServerFn_handler = createServerRpc({
	id: "296a979429682dd0f200841b1edb6a33e80085e5fd7031662b4b738372cf7a64",
	name: "updateClip",
	filename: "src/lib/server/content.ts"
}, (opts) => updateClip.__executeServer(opts));
var updateClip = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateClip_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const clips = await db`select * from clips where id = ${data.id} and user_id = ${context.userId} limit 1`;
	if (!clips[0]) return {
		ok: false,
		error: "Clip not found."
	};
	const start = data.startSeconds ?? Number(clips[0].start_seconds);
	const end = data.endSeconds ?? Number(clips[0].end_seconds);
	await db`update clips set
      title = coalesce(${data.title ?? null}, title),
      description = coalesce(${data.description ?? null}, description),
      hook = coalesce(${data.hook ?? null}, hook),
      hashtags = coalesce(${data.hashtags ?? null}, hashtags),
      format = coalesce(${data.format ?? null}, format),
      aspect_ratio = coalesce(${data.aspectRatio ?? null}, aspect_ratio),
      caption_style = coalesce(${data.captionStyle ?? null}, caption_style),
      start_seconds = ${start},
      end_seconds = ${end},
      duration_seconds = ${Math.max(0, end - start)},
      updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}`;
	await db`insert into clip_versions (id, clip_id, user_id, version_number, spec_json)
      values (${newId("ver")}, ${data.id}, ${context.userId},
        (select coalesce(max(version_number), 0) + 1 from clip_versions where clip_id = ${data.id}),
        ${JSON.stringify(data)})`;
	return { ok: true };
});
var listSeries_createServerFn_handler = createServerRpc({
	id: "d6553e1753db4045946c9b758adb2866c16c45e6f7e4913a89a7614b4ee1fb6c",
	name: "listSeries",
	filename: "src/lib/server/content.ts"
}, (opts) => listSeries.__executeServer(opts));
var listSeries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSeries_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const profile = await ensureCallerProfile(context.userId);
	return db`
      select s.*,
        (select count(*)::int from clips c where c.series_id = s.id) as episode_count,
        coalesce((select sum(a.views)::int from analytics_snapshots a where a.series_id = s.id), 0) as views,
        coalesce((select sum(e.amount_cents)::int from earnings_ledger e where e.series_id = s.id and e.kind = 'confirmed'), 0) as confirmed_cents
      from series s
      where s.user_id = ${context.userId} and s.is_demo = ${profile.demo_mode}
      order by s.created_at desc`;
});
var getSeries_createServerFn_handler = createServerRpc({
	id: "bff499585f550a121ba9560d564093a50ff9eab33d935f34e98bfce894c22e39",
	name: "getSeries",
	filename: "src/lib/server/content.ts"
}, (opts) => getSeries.__executeServer(opts));
var getSeries = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => String(id)).handler(getSeries_createServerFn_handler, async ({ context, data: id }) => {
	const db = await sql();
	const rows = await db`select * from series where id = ${id} and user_id = ${context.userId} limit 1`;
	if (!rows[0]) return {
		ok: false,
		error: "Series not found."
	};
	const episodes = await db`select * from clips where series_id = ${id} and user_id = ${context.userId} order by episode_number asc`;
	return {
		ok: true,
		series: rows[0],
		episodes
	};
});
//#endregion
export { createClipsFromCandidates_createServerFn_handler, createSeriesFromSource_createServerFn_handler, getClip_createServerFn_handler, getSeries_createServerFn_handler, getSourceAnalysis_createServerFn_handler, ingestSource_createServerFn_handler, listContent_createServerFn_handler, listSeries_createServerFn_handler, listSources_createServerFn_handler, updateClip_createServerFn_handler };
