# NeatContext documentation

Docusaurus 3 site (docs-only mode) for **NeatContext**, deployed to
docs.neatcontext.com via GitHub Pages. Docs live in `docs/` as `.md` files;
config is `docusaurus.config.ts`.

## Admonitions: always use bracket titles

This site runs the **faster build pipeline** (`future.v4: true` +
`@docusaurus/faster`), which parses MDX with the Rust `mdx-rs` engine. That
parser only recognizes the canonical directive-label syntax for admonition
titles:

```md
:::tip[Quick hands-on demo]
Content here.
:::
```

The legacy space-separated form `:::tip Quick hands-on demo` is **not**
recognized — it silently renders as a literal `:::` paragraph instead of a
callout box. Title-less admonitions (`:::note`) are fine either way.

So: **when an admonition has a title, wrap it in `[...]`.** CI enforces this
(see the "Lint admonition syntax" step in `.github/workflows/ci.yml`).

## Local commands

- `npm run start` — dev server with hot reload.
- `npm run build` — production build into `build/` (what CI and deploy run).
