# Web Awesome notes

*(ChatGPT kutatása, a felhasználó mentette; a linkek és a számok az első UI-szelet elején ellenőrzendők.)*

**Checked 18 October 2026.** Web Awesome is a framework-agnostic web component library. The current site advertises 90+ components; the homepage's older summary says 50+, so use the component browser as the current inventory. The core library is free/open source. Pro adds selected Pro-only components, design patterns, Pro CDN/download/npm packages, and related Pro services; the component browser marks individual entries. Check the chosen components individually because the free/Pro boundary varies.

Themes are CSS stylesheets, with theme tokens and component CSS custom properties available for overrides. Include a built-in theme such as `default.css` and override variables in app CSS; component docs expose component-specific custom properties. The library supports npm, CDN and self-hosted distributions. `dist-cdn` bundles dependencies for direct use without a build tool; standard `dist` keeps dependencies separate.

**Single-HTML size:** there is no meaningful fixed size for “Web Awesome embedded in one HTML.” It depends on whether the file includes the whole library or only selected components, styles, icons, fonts and assets, and on minification/compression. The docs recommend component imports or the autoloader, which loads components on demand. Measure the exact production artifact with the intended features before deciding; the upstream docs do not publish a single universal one-file bundle size.

**`file://`:** do not assume the CDN setup works from a local file. It requires network access, and browser module/CORS/security rules can restrict local-file imports. Self-hosted relative assets may also resolve differently. Test the target browser; for reliable offline preview, run a local HTTP server or bundle dependencies into the deliverable.

**Specialized controls:** Web Awesome provides general-purpose controls, not a purpose-built curve editor or circular direction picker. Build those as Vel-specific controls (SVG/canvas or a custom element) and use Web Awesome for surrounding form controls, buttons, labels and tooltips.

## Sources

- [Web Awesome component browser](https://webawesome.com/docs/components/)
- [Installation and distribution (`dist` vs `dist-cdn`)](https://webawesome.com/docs/)
- [Themes](https://webawesome.com/docs/themes/)
- [Theming overview](https://webawesome.com/docs/theming-overview)
- [Pro comparison](https://webawesome.com/pro)
