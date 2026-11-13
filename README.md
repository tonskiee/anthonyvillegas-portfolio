# Portfolio Website

A one-page portfolio with Home, About, Skills, Projects and Contact sections.

## Folder structure

```
portfolio/
├── index.html        → page structure and content (all the text lives here)
├── css/
│   └── style.css     → colors, fonts, layout, animations, mobile styles
├── js/
│   └── script.js     → mobile menu, active nav link, project filter,
│                       scroll animations, contact form
├── images/
│   ├── profile.jpg   → photo on the Home card
│   └── about.jpg     → photo in the About section
└── README.md
```

## How to open it

Double-click `index.html` to open it in your browser. No installation needed.
For live reloading while you edit, open the folder in VS Code and use the
"Live Server" extension.

## What to change

| What | Where |
|---|---|
| Your name, bio, handle, stats | `index.html` — search for `[` to find every placeholder |
| Accent color | `css/style.css` → `--accent` at the top |
| Photos | Replace the files in `images/` (keep the same names) |
| Project images | In `index.html`, replace `<span>[Project image]</span>` with `<img src="images/your-file.jpg" alt="...">` |
| Social links | `index.html` → the `href` of each icon in `.socials` and `.contact-links` |
| Contact email | `index.html` (mailto links) and `js/script.js` → `YOUR_EMAIL` |

## Publishing for free

Upload the whole folder to GitHub Pages, Netlify (drag and drop) or Vercel.
