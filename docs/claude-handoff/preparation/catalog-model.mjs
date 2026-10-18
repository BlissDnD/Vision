/** Pure preparation model, not wired into Vel. Human-curated metadata; no LLM/network/GPU. */
export const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
export const available = (e) =>
  e.availability === "builtin-source" || e.availability === "integrated";
export function prepareIndex(records) {
  return records.map((entry) => ({
    entry,
    title: normalizeText(entry.title),
    aliases: (entry.keywords || []).map(normalizeText),
    topics: (entry.topics || []).map(normalizeText),
    description: normalizeText(entry.description),
  }));
}
export function search(
  index,
  query,
  { role, topics = [], showUnavailable = false } = {},
) {
  const q = normalizeText(query),
    tokens = q.split(" ").filter(Boolean),
    needed = topics.map(normalizeText),
    hits = [];
  for (const row of index) {
    const e = row.entry;
    if (!showUnavailable && !available(e)) continue;
    if (role && e.role !== role) continue;
    if (needed.some((t) => !row.topics.includes(t))) continue;
    const fields = [row.title, ...row.aliases, ...row.topics, row.description],
      haystack = fields.join(" ");
    if (tokens.some((t) => !haystack.includes(t))) continue;
    let score = !q
      ? 0
      : row.title === q
        ? 1000
        : row.title.startsWith(q)
          ? 800
          : row.title.includes(q)
            ? 600
            : row.aliases.includes(q)
              ? 500
              : row.aliases.some((a) => a.includes(q))
                ? 400
                : row.topics.includes(q)
                  ? 300
                  : 100;
    hits.push({ entry: e, score });
  }
  return hits
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.entry.title.localeCompare(b.entry.title, "hu") ||
        a.entry.proposedId.localeCompare(b.entry.proposedId),
    )
    .map((h) => h.entry);
}
export function groupFamilies(entries) {
  const map = new Map();
  for (const e of entries) {
    const k = e.familyId || e.proposedId;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(e);
  }
  return [...map].map(([familyId, variants]) => ({ familyId, variants }));
}
export function suggestedCompatibility(entry, target) {
  if (!available(entry)) return { ok: false, reason: "Még nincs beépítve." };
  if (!["appearance", "motion"].includes(entry.role))
    return { ok: true, reason: "Új tartalomként hozzáadható." };
  if (!target) return { ok: false, reason: "Jelölj ki egy elemet." };
  if (entry.accepts?.length && !entry.accepts.includes(target.type))
    return {
      ok: false,
      reason: `Csak ezen használható: ${entry.accepts.join(", ")}.`,
    };
  return {
    ok: null,
    reason: "A tényleges műveleti adapter ellenőrzése szükséges.",
  };
}
