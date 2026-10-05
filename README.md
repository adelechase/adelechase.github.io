# Adele Chase — professional portfolio

A custom Jekyll portfolio for https://adelechase.github.io, with warm neutrals, deep teal, and responsive layouts. This is a new site. The separate MLIS portfolio remains at /mlis-portfolio/.

## Publish without installing anything

1. Create a **public** repository named exactly `adelechase.github.io`. Initialize it with a README so it has a `main` branch.
2. Upload the contents of this folder to the root of that repository, preserving `_layouts`, `_includes`, `_data`, `_projects`, `assets`, and `.github/workflows`. Do not upload the enclosing `adelechase.github.io` folder or the ZIP itself. If using GitHub's browser upload, make sure the hidden `.github` folder is included; alternatively create `.github/workflows/pages.yml` in the web editor and paste the supplied workflow.
3. Under **Settings → Pages**, select **GitHub Actions** as Source.
4. Under **Actions → Build and publish portfolio**, run the workflow if necessary. Once it succeeds, open https://adelechase.github.io.

The workflow builds pull requests without publishing them. Pushes to `main` publish the site.

## Edit content in GitHub

- Main bio, contact details, optional portrait and résumé: `_data/profile.yml`.
- Homepage structure: `index.html`.
- About page: `about.md`.
- Projects: Markdown files in `_projects/`. Duplicate one, change its title, category, order, summary, link, and body. It automatically appears on Work; the first three by order appear on Home.
- Navigation: `_data/navigation.yml`.
- Colors and layout: `assets/css/style.css`.

Keep strings with punctuation in YAML inside quotes. After an edit, commit it and GitHub automatically rebuilds the site.

## Optional personalization

Upload a portrait under `assets/images/`, then set `portrait: /assets/images/your-photo.jpg`. Update `portrait_alt` to a useful description. Upload a résumé PDF and set `resume: /assets/adele-chase-resume.pdf`. Set `email` only to an address you want public. Blank optional fields are hidden.

## Local development

Install Ruby and Bundler, then run `bundle install` and `bundle exec jekyll serve`. Open http://localhost:4000. Run `JEKYLL_ENV=production bundle exec jekyll build` before publishing.

## Draft status

The initial bio and three project descriptions are starter copy for Adele to review. The sensory spaces project is explicitly described as a research proposal, not a completed study. No email address or résumé has been assumed.

Configuration, templates, links, and responsive CSS have been inspected. This environment did not have Ruby/Jekyll available, so a real Jekyll build and browser rendering still need verification in GitHub Actions and on the published site.
