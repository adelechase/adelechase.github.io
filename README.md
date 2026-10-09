# Adele Chase | Pottery + Librarian Portfolio

A Jekyll site published at https://adelechase.github.io.

- **Landing page:** `/` — two-panel choice between art and library portfolios, with the pottery/book logo.
- **Pottery portfolio:** `/pottery/` — its own navigation, layout, typography, slideshow, Shows, and Contact pages.
- **Librarian portfolio:** `/librarian/` — independently styled and navigated, with About, Work, Contact, and project pages.
- **Previous MLIS portfolio:** https://adelechase.github.io/mlis-portfolio/ (separate GitHub Pages project).

## Editing the pottery portfolio

| Part | Files |
|---|---|
| Pottery gallery, slideshow ordering and alt text | `pottery/index.html` |
| Slideshow images | `assets/images/pottery/placeholder-01.svg` through `placeholder-06.svg` |
| Shows | `pottery/shows/index.html` |
| Contact paragraph and external links | `pottery/contact/index.html` |
| Pottery-only header and navigation | `_layouts/pottery.html` |
| Pottery typography, colors, mobile layouts | `assets/css/pottery.css` |
| Slideshow controls, autoplay, pause, swipe, responsive sizing | `assets/js/pottery.js` |

The first six images are deliberately illustrated **placeholders**, not photographs of finished pottery. Once photos are ready, upload them (e.g. to `assets/images/pottery/`), update the six `<img src>` paths and descriptive alt text in `pottery/index.html`. The carousel retains its square format and crops non-square photos with `object-fit: cover`.

The pottery site's palette is rose-charcoal `#383338`, blue-gray `#303e50`, forest-gray `#304940`, light cream `#f7eee7`, and coordinating rose, blue and sage accents. It uses Outfit throughout. Pottery menu items are defined in its dedicated layout, not in `_data/navigation.yml`. The library's menu remains separate.

The supplied 2 Story Studios link (`https://stateoftheartsc.com/?page_id=1621`) is retained in the contact text as requested, but appeared to return a 404 when checked on October 9, 2026. Replace it with the new venue page when available.

## Editing the librarian portfolio

- Library biography, optional portrait, résumé, and external links: `_data/profile.yml`.
- Library homepage: `librarian/index.html`.
- About, Work, and Contact pages: `about.md`, `work.html`, `contact.html` (their permalinks start with `/librarian/`).
- Projects: `_projects/`.
- Library-only navigation: `_data/navigation.yml`.
- Library layout and visual styles: `_layouts/default.html`, `assets/css/style.css`.
- Split landing page and center logo: `index.html`, `assets/images/pottery-book-logo.svg`.

## Build and publication

The repository uses Jekyll 4 and a workflow in `.github/workflows/pages.yml`. GitHub Pages should use **GitHub Actions** as its publishing source. Pushes to `main` build and deploy automatically; pull requests build without deployment.

To build locally, install Ruby and Bundler, then run `bundle install` and `bundle exec jekyll serve`. Run `JEKYLL_ENV=production bundle exec jekyll build` before publishing significant changes.
