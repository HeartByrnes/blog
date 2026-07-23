# Blog

Built with [Quartz](https://quartz.jzhao.xyz), publishing directly from an Obsidian vault.

## Writing

`content/` **is** the Obsidian vault — open this folder directly in Obsidian and write normally:
`[[wikilinks]]`, `#tags`, `> [!note]` callouts, `![[embeds]]` all work unmodified.

Blog posts live in `content/posts/`. Frontmatter convention:

```yaml
---
title: Post Title
created: 2026-07-24
tags:
  - some-tag
description: One-line summary for previews/RSS
---
```

## Publishing

```bash
npx quartz sync
```

This commits, pulls, and pushes in one step. GitHub Actions rebuilds and redeploys the site automatically on every push to `v5`.

## First-time setup

1. Create a new **empty** repo on GitHub (no README/license — this project already has them), e.g. `heartbyrnes/blog`.
2. `git remote add origin git@github.com:heartbyrnes/blog.git`
3. `git add -A && git commit -m "Initial commit" && git push -u origin v5`
4. Repo **Settings → Pages → Source: GitHub Actions**
5. Repo **Settings → Pages → Custom domain**: `blog.joshuabyrnes.au` → Save
6. At your DNS provider, add: `CNAME` record, host `blog`, value `heartbyrnes.github.io`
7. Wait for the DNS check to pass, then tick **Enforce HTTPS**

## Local preview

```bash
npm i
npx quartz build --serve
```

## Customising the look

- `quartz.config.yaml` — site title, colours, fonts, enabled plugins (`configuration.theme` for colours/fonts)
- Comments (giscus) and analytics (Plausible) are present in the config but disabled/unconfigured by default — see the `comments` and `analytics` blocks in `quartz.config.yaml` if you want to turn them on later.
