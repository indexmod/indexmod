# Indexmod

**Indexmod** is an independent fashion and art encyclopedia published at [indexmod.press](https://indexmod.press).

The project collects and organizes articles about fashion weeks, designers, artists, brands, institutions, exhibitions, publications, cities, countries, and related cultural contexts. Articles are stored as Markdown with frontmatter and are rendered by a Cloudflare Worker using R2 object storage.

## Repository

- `src/` — Cloudflare Worker, routing, rendering, metadata, sitemap, and storage logic
- `styles/` — public site styles
- `scripts/` — maintenance and asset synchronization tools
- `wrangler.toml` — Cloudflare Worker and R2 configuration

## Continuity documents

This repository contains two long-term continuity documents:

- [`DOMAIN_CONTINUITY.md`](./DOMAIN_CONTINUITY.md) — instructions for preserving public access if `indexmod.press` expires or becomes unavailable, including a `workers.dev` fallback, a static GitHub Pages mirror, independent hosting, archival exports, canonical migration, and domain-takeover protection.
- [`TIME_CAPSULE.md`](./TIME_CAPSULE.md) — a dormant future-stewardship document describing how Indexmod may eventually become an open, self-extending knowledge system with anonymous contribution proposals, machine-assisted fact checking, transparent claim provenance, reversible moderation, and public content analytics.

Domain expiration alone does not activate the time capsule and must not be interpreted as proof that the owner has died, become incapacitated, or abandoned the project.

The continuity documents are not executable code. They contain no credentials and do not grant ownership or authority over accounts, infrastructure, or project assets.
