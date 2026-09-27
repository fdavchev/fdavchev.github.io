# Portfolio v2

Filip Davchev's portfolio, rebuilt with Astro. It is staged at
<https://fdavchev.github.io/v2> (marked `noindex`) while the current site, v1 (`index.html` at the
repo root), stays live at <https://fdavchev.github.io/>.

## Run it locally

Needs Node 22.12 or newer.

```sh
cd v2
npm install
npm run dev
```

Then open <http://localhost:4321/v2>. Every page lives under `/v2`, locally too.

Other commands:

- `npm run build` builds the static site into `v2/dist/`.
- `npm run preview` serves that build, to check it the way it will be deployed.
- `npm run check` type-checks the project.

## Where things are

- `src/content/projects/*.md`: the four case studies. The frontmatter holds the stamped state,
  stack, links, proof ledger and screenshots; the body is the case-study text.
- `src/pages/index.astro`: the home page. `src/pages/work/[slug].astro`: one page per case study.
- `src/components/`: the pieces of the proof sheet (stamps, registration marks, the proof ledger,
  figures, the contact form).
- `src/styles/global.css`: colours, type scale and spacing for both themes.
- `public/`: the two CV PDFs and the favicon, copied as they are.

Internal links always go through `src/lib/paths.ts` (built on `import.meta.env.BASE_URL`), never a
hard-coded `/v2`, so the base path lives in one place: `astro.config.mjs`.

## How it deploys

`.github/workflows/deploy-pages.yml` runs on every push to `main`. It builds this folder, then
assembles one GitHub Pages artifact: v1's root files (`index.html`, `og-image.png`, `README.md`) at
the top level and this build under `/v2`.

## Moving it to the root later

That is a separate, later step, written up in `docs/BACKLOG.md` ("Swap v2 to the live root"). On the
Astro side it starts with deleting `base: '/v2'` from `astro.config.mjs` and removing the `noindex`
tag in `src/layouts/Base.astro`.
