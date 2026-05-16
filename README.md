# find-a-sesion

Astro + Tailwind + PagesCMS site for tracking Irish sessions around New York City.

## Features

- Three session views: ongoing list, calendar, and map
- Recurrence support: single date, explicit date list, and RRULE
- Required session fields: title, location, recurrence dates, alerts, general info
- Content managed in `src/content/sessions` and editable through PagesCMS via `.pages.yml`

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Times are rendered for `America/New_York`.
- Map uses Leaflet + OpenStreetMap.
- GitHub Pages base path is currently set to `/find-a-sesion` in `astro.config.mjs`.
