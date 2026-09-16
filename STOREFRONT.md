# Live World storefront

The public electronics website lives on the `live-world-site` branch. The `main` branch contains the older, unrelated Discord dashboard. Do not use that dashboard as the storefront source.

## Edit and preview

The canonical source is `official/index.html`, `official/styles.css` and `official/script.js`. Product photography extracted from the previous site is served from `official/assets/`.

With Node.js 18 or newer, no dependency installation is needed for the storefront:

```sh
npm run build
npm test
npm run dev
```

Open http://localhost:4173. Run the build again after editing to refresh the generated preview. `npm run build:dashboard` and `npm run dev:dashboard` retain the legacy Next.js commands if that separate application is needed.

The build generates the repository-root `index.html` from the canonical document, adjusting asset and policy paths. Commit that generated file alongside source changes so both existing GitHub Pages routes work. `dist/` is the isolated static deployment output and is not committed. The existing GitHub Pages branch deployment can serve the root or `/official/` directly without Next.js or an API server.

## Customer interactions

- Product filters work locally; product cards preselect a category in the enquiry form.
- Quote and repair modes preserve entered details. Repair descriptions are required. Tabs support arrow keys, Home and End.
- Form submission opens a native accessible dialog containing an escaped text preview. Only the customer following the WhatsApp link and pressing Send transmits the enquiry. A request is not a confirmed booking.
- All five existing branch names and addresses are preserved. Selecting a branch updates directions, address, optional map and the preferred branch in the form.
- Google Maps loads only when requested. If loading times out, directions remain available. Embedded third-party errors cannot always be detected across origins.
- The navigation collapses on small screens, closes on selection/Escape/outside click, and exposes expanded state. Reduced-motion preferences are respected.
- Google reviews link to Google; the page does not invent a rating or testimonials. Product prices, inventory and branch hours are confirmed by the store.

## Validation

`npm test` checks local assets and links across both entry points and all four policy pages, duplicate IDs, anchor targets, root/source parity and accessible local product images. A separate jsdom interaction check exercised navigation, filters, enquiry prefill, repair and quote modes, keyboard tabs, all branch directions, escaped WhatsApp previews, phone validation and map reset. Browser checks should cover desktop and mobile rendering, dialogs, focus, image loading and third-party map availability.

Business contact: +971 55 966 7648. WhatsApp: +971 55 995 6683. Email: liveworldmuhaisinah@gmail.com. The redesign preserves these values from the original site.
