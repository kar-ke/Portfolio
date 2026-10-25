# Portfolio

A plain HTML, CSS and JavaScript portfolio. No framework and no build step: every page is a real `.html` file you edit directly.

## Folder structure

```
portfolio/
├── index.html                  Home: hero and selected work
├── about.html
├── playground.html
├── 404.html                    Shown for any address that doesn't exist
├── work/
│   ├── project-one.html        Case studies
│   ├── project-two.html
│   └── project-three.html
├── blog/
│   ├── index.html              List of posts
│   └── post-template.html      Copy this to write a new post
├── Styles/
│   ├── font.css                The font file and weight tokens
│   ├── colors.css              Colour tokens — change the palette here
│   ├── global.css              Reset, layout and spacing tokens
│   ├── typography.css          Type scale (.display-xl, .title-lg, .lead, .prose…)
│   ├── flex.css                Flex helpers (.flex, .g24, .justify-between…)
│   ├── style-bits.css          Margin and section spacing helpers
│   ├── button.css
│   ├── animation.css           Timing tokens and reduced-motion rules
│   ├── responsive.css          12-column grid (.row, .col-6, .col-lg-12…)
│   └── Components/             One file per part of the site
├── Scripts/
│   ├── analytics.js            Microsoft Clarity
│   ├── Script.js               Menu, header, current page
│   ├── Motion.js               All GSAP animation
│   └── vendor/                 GSAP and ScrollTrigger (self-hosted)
├── Assets/
│   ├── Fonts/                  Bricolage Grotesque (variable, woff2)
│   ├── images/  icons/
│   ├── projects/<project>/     Case study images
│   └── playground/
└── _headers                    Caching rules for Cloudflare Pages
```

Each page links only the stylesheets it needs: shared ones first, then its page components, then `responsive.css` last.

## Run it on your computer

Paths start with `/` (for example `/Styles/colors.css`), so open the site through a small local server rather than double-clicking the file:

```
npx serve .
```

Then open http://localhost:3000. The VS Code "Live Server" extension also works.

## Replace the placeholders

1. **Your name and email:** search the whole project for `Your Name`, `hello@yourname.com` and `yourname` and replace them.
2. **Case studies:** in `work/`, rename the files (for example `project-one.html` → `payments-onboarding.html`), then update the links in `index.html` and the "Next case study" links at the bottom of each case study.
3. **Images:** replace the `.svg` placeholders in `Assets/projects/` and `Assets/playground/` with your own. Export as `.webp` or `.jpg` at about 1600 px wide, keep each under 300 KB, and update the `src`, `width` and `height` in the HTML.
4. **Portrait:** replace `Assets/images/portrait.svg`.
5. **Resume:** add `Assets/resume.pdf`.
6. **Social preview:** add `Assets/images/og-image.png` (1200 × 630). This is the image shown when your link is shared on LinkedIn or WhatsApp.
7. **Domain:** replace `https://yourname.com` in the `<head>` of each page.
8. **Favicon:** edit the letter in `Assets/icons/favicon.svg`.

## Add Microsoft Clarity

1. Create a project at https://clarity.microsoft.com.
2. Copy the project ID from Settings → Setup.
3. Paste it into `CLARITY_PROJECT_ID` in `Scripts/analytics.js`.

That one file is loaded on every page. Tracking is skipped on `localhost`, so your own testing doesn't show up in the data.

## Add a blog post

1. Copy `blog/post-template.html` and give it a short name, such as `blog/designing-with-engineers.html`.
2. Change the title, `<meta name="description">`, date and text.
3. Add a row for it to the list in `blog/index.html`.

## Motion

All animation is in `Scripts/Motion.js`:

- the name in the hero stretches open on load, settles condensed, then widens again as you scroll
- if your name is long, lower the `16.5vw` in `.display-xl` (`Styles/typography.css`) so it fits on one line
- project covers open up as they scroll into view
- a "View case study" label follows the cursor over covers
- a curtain covers the screen between pages
- text marked with `data-reveal` fades up into place

Anyone with "reduce motion" turned on in their system settings gets the site with no animation. Without JavaScript, everything is still visible.

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub repository.
2. In the Cloudflare dashboard, go to Workers & Pages → Create → Pages → Connect to Git, and pick the repository.
3. Leave the build command empty and set the build output directory to `/`.
4. Deploy. Every push to `main` deploys again automatically.
5. To use your own domain, open the project → Custom domains → Set up a custom domain.

Cloudflare Pages serves `about.html` at `/about`, shows `404.html` for missing pages, and applies the caching rules in `_headers`.

## Licences

- Bricolage Grotesque: SIL Open Font License (`Assets/Fonts/OFL.txt`)
- GSAP: free to use under GreenSock's standard licence
