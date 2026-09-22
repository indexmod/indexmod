export function fixtureEnv(extra = {}) {
  const article = (title, body, fields = "") => `---\ntitle: ${title}\n${fields}\n---\n\n${body}`;
  const files = new Map(Object.entries({
    "sample.md": article("Sample", "A complete public article with useful text.\n\n[Edit](/edit/sample) [Home](/home) [Draft](/new-page)"),
    "empty.md": article("Empty topic", "Write here…"),
    "empty-ascii.md": article("Empty ASCII", "Write here..."),
    "empty-editor.md": article("Empty editor", "Write text here..."),
    "blank.md": article("Blank topic", ""),
    "hidden.md": article("Hidden", "This is private editorial content.", "robots: noindex,follow"),
    "draft.md": article("Draft", "A draft article with content.", "draft: true"),
    "new-page.md": article("Migration", "Write here..."),
    "home.md": article("Old home", "Old home content."),
    "index.md": article("Old index", "Old index content."),
    "old-slug.md": article("Renamed article", "A published article with a new permalink.", "slug: new-slug"),
    "тема.md": article("Русский", "Содержательная статья на русском языке."),
    "edit/rogue.md": article("Service storage", "Must never be included in sitemap."),
    "index.html": '<a href="/edit/index">Edit</a><a href="/empty">Old stale index</a>',
    "index.pages.json": JSON.stringify([{slug:"empty", title:"Old cache"}, {slug:"missing",title:"Deleted"}]),
    ...extra
  }));
  const dates = new Map([...files.keys()].map(key => [key, new Date("2026-09-01T12:00:00Z")]));
  return {PAGES: {
    files,
    async get(key) {
      if (!files.has(key)) return null;
      return {text:async () => files.get(key), arrayBuffer:async () => new TextEncoder().encode(files.get(key)).buffer};
    },
    async put(key, value) { files.set(key, value); dates.set(key, new Date()); },
    async delete(key) {files.delete(key);},
    async head(key) {return files.has(key) ? {uploaded:dates.get(key)} : null;},
    async list() {return {objects:[...files.keys()].map(key => ({key, uploaded:dates.get(key)})), truncated:false};}
  }};
}
