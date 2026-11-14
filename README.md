# Adele Chase | Librarian and Pottery Portfolios

This is the repository for [my website](https://adelechase.github.io/). It brings together two parts of my life: my work as a librarian and my pottery. The landing page lets visitors choose between the two portfolios. Each has its own style and navigation, with a book-and-vase logo connecting them.

## Librarian portfolio

My [librarian portfolio](https://adelechase.github.io/librarian/) covers readers’ advisory, research support, technology instruction, library tools, and academic research. The homepage features five projects, which are also collected on the [Work page](https://adelechase.github.io/librarian/work/):

1. [**iPage Quick Links**](https://adelechase.github.io/librarian/work/ipage-quick-links/) — a Firefox extension that brings Goodreads information and useful links into Ingram iPage.
2. [**NoveList Result Sorter**](https://adelechase.github.io/librarian/work/novelist-sorter/) — a bookmarklet that puts NoveList search results into a sortable table.
3. [**Richland Library on Goodreads**](https://adelechase.github.io/librarian/work/richland-library-on-goodreads/) — a Firefox extension for checking Richland Library, Libby, and Hoopla availability from Goodreads.
4. [**Sensory Spaces in Libraries**](https://adelechase.github.io/librarian/work/sensory-spaces/) — my graduate research proposal about autistic students’ experiences of sensory spaces in academic libraries.
5. [**University Library Use in Health Sciences and STEM Fields**](https://adelechase.github.io/librarian/work/ncds-data-internship/) — research from my 2024 National Center for Data Services internship, including an interactive slide viewer and downloadable report and presentation.

The [About page](https://adelechase.github.io/librarian/about/) says more about my work at Richland Library, my approach to librarianship, and my interests outside work. The [Contact page](https://adelechase.github.io/librarian/contact/) links to my GitHub, LinkedIn, and Instagram.

My earlier [MLIS portfolio](https://adelechase.github.io/mlis-portfolio/) is a separate GitHub Pages site. It's still linked from the librarian homepage for anyone interested in my coursework and earlier projects.

## Pottery portfolio

The [pottery portfolio](https://adelechase.github.io/pottery/) has a slideshow of five photographs of my ceramic work, followed by my artist's statement. There are also [Shows](https://adelechase.github.io/pottery/shows/) and [Contact](https://adelechase.github.io/pottery/contact/) pages. The Shows page currently says "Stay tuned!" until I have an exhibition to announce.

## Where things live

These are the files I’m most likely to need when updating the site:

| What I'm changing | Where to find it |
| --- | --- |
| Split landing page and its central illustration | `index.html`, `assets/images/pottery-book-logo-home-shaded.svg` |
| Shared favicon | `favicon.png` |
| Librarian homepage | `librarian/index.html` |
| Librarian About, Work, and Contact pages | `about.md`, `work.html`, `contact.html` |
| Librarian project descriptions and their display order | `_projects/*.md` (the `order` field controls the order) |
| Librarian profile text and links | `_data/profile.yml` |
| Librarian navigation, layout, and styling | `_data/navigation.yml`, `_layouts/default.html`, `assets/css/style.css` |
| Pottery slideshow, image order, alt text, and artist's statement | `pottery/index.html` |
| Pottery photographs | `assets/images/pottery/1.png`, `2.png`, `3.png`, `4.jpg`, `5.jpg` |
| Pottery Shows and Contact pages | `pottery/shows/index.html`, `pottery/contact/index.html` |
| Pottery navigation, styling, and slideshow behavior | `_layouts/pottery.html`, `assets/css/pottery.css`, `assets/js/pottery.js` |
| NCDS internship report and presentation downloads | `assets/files/ncds-data-internship/` |
| NCDS presentation viewer | `assets/js/ncds-slide-viewer.js` |

The librarian and pottery sections have separate menus. The links between them are intentional, but changes to one menu won't automatically change the other.

## Building and publishing

The site uses Jekyll 4.4 and is hosted on GitHub Pages. The GitHub Actions workflow in `.github/workflows/pages.yml` builds and publishes the site when changes are pushed to `main`. Pull requests run the build without publishing. GitHub Pages needs to be set to **GitHub Actions** as the deployment source.

For local changes, with Ruby and Bundler installed:

```bash
bundle install
bundle exec jekyll serve
```

For a production build:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

GitHub keeps earlier versions of this README and the other files in the repository's commit history, so I can go back to a previous version if I need to.
