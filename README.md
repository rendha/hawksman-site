# Hawksman Bespoke website

A static website for Hawksman Bespoke, Kozhikode. It is plain HTML, CSS and JavaScript, so it needs no server, build step or hosting service such as Render.

## Files

- `index.html` — the whole site
- `img/` — photos from @hawksmanbespoke

## Publish on GitHub Pages (free)

1. Create a new public repository on GitHub, for example `hawksman-site`.
2. Upload `index.html` and the `img` folder (Add file → Upload files), then commit.
3. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, and save.
4. After a minute the site is live at `https://<your-username>.github.io/hawksman-site/`.

To use your own domain (for example `hawksman.in`), add it under **Settings → Pages → Custom domain** and point your domain's DNS to GitHub as GitHub's instructions describe.

## Run it on your computer

Double-click `index.html`, or open it in any browser. An internet connection is needed for the fonts and animation libraries.

## Booking form

The appointment form does not send anything yet. To receive requests, connect it to a form service such as Formspree, or keep customers on the WhatsApp button.
