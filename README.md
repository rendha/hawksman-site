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

When a customer presses **Send on WhatsApp**, WhatsApp opens with their booking typed out, addressed to +91 81389 19157. To change the number, edit `WHATSAPP_NUMBER` in `index.html` (country code, no `+` or spaces).

### Save bookings to a Google Sheet

This keeps a row for every booking, even if the customer never taps send in WhatsApp.

1. Create a new Google Sheet (sheets.new), named for example *Hawksman bookings*.
2. In the sheet, open **Extensions → Apps Script**. Delete what is there and paste in the whole of `google-sheet-script.gs`.
   - To get an email for each booking, put your address in `NOTIFY_EMAIL`.
3. Click **Save**, then **Deploy → New deployment**. Click the gear icon, choose **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then **Authorize access** and allow it with your Google account.
5. Copy the **Web app URL** (it ends in `/exec`).
6. In `index.html`, paste it between the quotes of `const BOOKING_SHEET_URL = '';`, then push the change to GitHub.

New bookings appear in the *Bookings* tab with a *Status* column you can change to Confirmed or Done.
