# Indexmod

**Indexmod** is an independent fashion and art encyclopedia published at [indexmod.press](https://indexmod.press).

The project collects and organizes articles about fashion weeks, designers, artists, brands, institutions, exhibitions, publications, cities, countries, and related cultural contexts. Articles are stored as Markdown with frontmatter and are rendered by a Cloudflare Worker using R2 object storage.

## Repository

- `src/` — Cloudflare Worker, routing, rendering, metadata, sitemap, and storage logic
- `styles/` — public site styles
- `scripts/` — maintenance and asset synchronization tools
- `wrangler.toml` — Cloudflare Worker and R2 configuration

## Time capsule

This repository contains [`TIME_CAPSULE.md`](./TIME_CAPSULE.md), a dormant long-term stewardship document for the future of Indexmod.

It describes how the project should be preserved and, only after verified death or permanent incapacity of its owner, may gradually evolve into an open, self-extending knowledge system with anonymous contribution proposals, machine-assisted fact checking, transparent claim provenance, reversible moderation, and public content analytics.

The time capsule is not executable code and must not be activated merely because the repository, domain, or owner appears inactive.
