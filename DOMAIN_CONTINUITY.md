---
document_type: indexmod_domain_continuity
version: 1.0
created: 2026-07-31
status: active
project: Indexmod
primary_domain: https://indexmod.press
repository: indexmod/indexmod
preferred_fallback_order:
  - cloudflare_workers_dev
  - github_pages_static_mirror
  - independent_static_mirror
  - archival_snapshot
---

# Indexmod Domain Continuity Plan

## Назначение

Эта инструкция описывает, как сохранить доступ к **Indexmod**, если домен `indexmod.press` истечёт, будет утрачен, заблокирован, передан другому владельцу или перестанет разрешаться через DNS.

Истечение домена само по себе **не активирует** [`TIME_CAPSULE.md`](./TIME_CAPSULE.md) и не является доказательством смерти, недееспособности или отказа владельца от проекта. Это событие непрерывности инфраструктуры. До отдельного подтверждения необходимо только сохранить данные и восстановить публичный доступ.

The remainder of this document is written in English for future maintainers and machine systems.

## Current architecture

Indexmod currently consists of:

- source code in `indexmod/indexmod` on GitHub;
- a Cloudflare Worker that handles routing and rendering;
- article and generated data stored in Cloudflare R2;
- the public canonical origin `https://indexmod.press/`.

The custom domain is an access layer, not the complete project. Loss of the domain must not be treated as permission to delete, replace, rewrite, or claim ownership of the repository or stored corpus.

## Continuity priorities

If the primary domain becomes unavailable, act in this order:

1. Preserve the repository, R2 objects, article Markdown, generated HTML, images, credits, redirects, and configuration.
2. Determine whether `indexmod.press` can be renewed or recovered by the legitimate owner, heirs, executor, or authorized steward.
3. Keep the existing Cloudflare Worker available on a verified `workers.dev` address when possible.
4. Publish a static read-only mirror through GitHub Pages.
5. Publish an additional portable static mirror if both the custom domain and Cloudflare account are unavailable.
6. Preserve an immutable archival snapshot even when no interactive hosting can be maintained.

Do not delay preservation while domain ownership is being resolved.

## Scenario A: the domain expires but Cloudflare remains accessible

This is the preferred emergency path because the Worker and R2 architecture can continue operating without an immediate migration.

### Required actions

1. Open the Worker configuration in the Cloudflare dashboard.
2. Verify that a public `workers.dev` route is enabled for the Worker.
3. Record the exact fallback hostname in this document and in `README.md`.
4. Test at minimum:

   - `/`;
   - `/robots.txt`;
   - `/sitemap.xml`;
   - one existing article;
   - one missing article;
   - images and `/_media`;
   - authenticated administration routes.

5. Change the public origin used for canonical URLs, sitemap URLs, Open Graph URLs, JSON-LD, and redirects from the lost domain to the verified fallback origin.
6. Keep editor, admin, and API protection enabled. A domain failure must not make private routes public.
7. Put the site into read-only mode if ownership, credentials, billing, or storage integrity is uncertain.

### Preferred fallback form

```text
https://<worker-name>.<cloudflare-account-subdomain>.workers.dev/
```

The exact address must be verified from the Cloudflare dashboard. Never invent or guess it.

Cloudflare recommends custom domains for normal production use, but `workers.dev` can serve as an emergency continuity address when it is enabled. The fallback must be tested before it is announced.

## Scenario B: Cloudflare is unavailable but GitHub remains accessible

GitHub Pages may host a static copy of Indexmod. It cannot run the current Cloudflare Worker or provide R2-backed editing by itself.

### Possible GitHub Pages addresses

For the existing repository as a project site:

```text
https://indexmod.github.io/indexmod/
```

For a dedicated user site created in a repository named `indexmod.github.io`:

```text
https://indexmod.github.io/
```

Neither address should be described as active until GitHub Pages has been configured and the site has been successfully tested.

### Static export requirements

Before publishing to GitHub Pages:

1. Export every published canonical article from R2 or another trusted backup.
2. Generate plain HTML, CSS, JavaScript, sitemap, robots file, images, and a minimal 404 page.
3. Preserve canonical slugs and create directory-style output where practical:

```text
/article-slug/index.html
```

4. Rewrite root-relative links when publishing under `/indexmod/`, or use the dedicated `indexmod.github.io` repository to preserve root-level paths.
5. Exclude editor, admin, save, rebuild, prompt, and private API routes from the static mirror.
6. Remove forms and controls that imply editing is still available.
7. Add a visible notice that the mirror is read-only and identify the date of the snapshot.
8. Validate internal links, images, language attributes, canonical URLs, sitemap XML, and JSON-LD before publication.
9. Publish through GitHub Actions or another documented GitHub Pages source.
10. Store the export procedure in the repository so a future maintainer or AI can reproduce it.

### Canonical policy for the mirror

Do not keep canonical tags pointing to a domain that has been lost or acquired by another party.

- If `indexmod.press` is temporarily unavailable but recovery is credible and imminent, the mirror may remain `noindex` for a short preservation period.
- If the domain cannot be recovered, the fallback origin becomes canonical.
- If the original domain is later recovered, restore it as canonical and use permanent redirects from any controlled fallback where possible.

## Scenario C: GitHub Pages is unsuitable or unavailable

Publish the same static export on another provider that can serve plain files over HTTPS. Suitable categories include:

- another static-site host;
- public object storage with website delivery;
- a new Cloudflare account or successor edge platform;
- an institutional or library mirror;
- a community-maintained read-only mirror.

Choose a host that permits full export, stable paths, HTTPS, custom headers, and migration without lock-in. Do not make a proprietary database the only surviving copy.

The repository must contain enough information to rebuild the site on a different provider without access to undocumented services.

## Scenario D: no live host can be maintained

Create a complete archival release containing:

- repository history;
- article Markdown;
- generated static HTML;
- frontmatter and metadata;
- image files where redistribution is permitted;
- image credit records when files cannot be redistributed;
- sitemap and URL mapping;
- deployment and restoration instructions;
- checksums for exported files;
- a dated inventory of missing or inaccessible objects.

Publish copies through more than one independent archive when legally and technically possible. An archive must preserve provenance and must not silently replace missing files with AI-generated substitutes.

## First-response checklist

When the domain stops working:

1. Confirm whether the problem is expiration, DNS, registrar lock, Cloudflare routing, certificate issuance, account suspension, or a temporary outage.
2. Record the exact date, observed errors, DNS results, and responsible accounts.
3. Export the GitHub repository and R2 contents before making structural changes.
4. Freeze destructive operations and mass edits.
5. Remove the lost domain from password-reset email flows, OAuth callbacks, trusted-origin lists, and administrative security assumptions.
6. Do not trust email received from an address at a domain that is no longer controlled.
7. Enable and test the safest available fallback origin.
8. Update `README.md` with the current verified public address.
9. Update canonical, sitemap, Open Graph, JSON-LD, and redirect origins.
10. Notify search engines only after the fallback returns valid pages and correct HTTP status codes.
11. Keep a dated migration log in the repository.

## Domain takeover protection

If `indexmod.press` is no longer controlled:

- never continue sending authentication links or secrets to email addresses on that domain;
- remove obsolete DNS and custom-domain bindings from services still under control;
- do not leave a CNAME pointing to an unclaimed deployment;
- do not use wildcard DNS records as a shortcut;
- do not redirect users to a newly registered copy of the expired domain unless ownership has been independently verified;
- treat content served by an unknown new owner of the domain as unrelated to Indexmod.

## Search and URL continuity

Maintain a machine-readable mapping from every historical canonical URL to its current location.

The mapping should include:

```text
old_url
current_url
status
redirect_type
verified_at
notes
```

Preserve article slugs whenever possible. Avoid changing both domain and path at the same time. When redirects cannot be created because the old domain is lost, publish the URL map in the repository and expose it from the fallback site.

A fallback deployment must provide:

- one canonical origin;
- one valid sitemap containing only published pages;
- a robots file matching the deployment mode;
- real 404 responses for missing pages;
- no canonical references to an uncontrolled domain;
- no editor or administrative URLs in public navigation.

## Recommended work to complete in advance

Future maintainers should implement these safeguards before an emergency:

1. Replace hard-coded public origins with a documented `PUBLIC_ORIGIN` configuration value.
2. Record and test the exact `workers.dev` hostname.
3. Add a reproducible command such as `npm run export:static`.
4. Add a disabled-by-default GitHub Actions workflow capable of publishing the static export to GitHub Pages.
5. Generate periodic checksummed backups of R2 and repository data.
6. Store an inventory file that records object counts, article counts, export date, and software version.
7. Test restoration to a temporary host without changing the production domain.
8. Document who can renew the domain and access Cloudflare, GitHub, billing, and backups through lawful succession procedures outside the public repository.

Do not place passwords, recovery codes, private keys, registrar tokens, personal documents, or billing credentials in this repository.

## Restoration of the original domain

If `indexmod.press` is legitimately recovered:

1. verify ownership through the registrar and Cloudflare;
2. restore HTTPS and Worker routing;
3. test public and protected routes;
4. restore `https://indexmod.press/` as `PUBLIC_ORIGIN`;
5. regenerate canonical tags, sitemap, Open Graph, and JSON-LD;
6. redirect controlled fallback URLs to the restored canonical origin where technically appropriate;
7. keep the static mirror as a documented backup rather than deleting it immediately;
8. record the restoration date and responsible maintainer.

## Final principle

The domain may change. The identity of Indexmod is defined by its corpus, history, credits, editorial principles, repository, and documented chain of custody—not by possession of a particular hostname alone.
