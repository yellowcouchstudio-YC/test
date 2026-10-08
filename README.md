# FRAME — Animation Studio Website Demo

A real React + Vite website prototype with CSS-driven motion artwork, responsive layout, and sample project content.

## Run locally

Install Node.js 20.19+ or 22.12+ from https://nodejs.org then in this folder:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually http://localhost:5173).

## Publish on Vercel

1. Create a free account at https://vercel.com.
2. Upload this project to a GitHub repository (https://github.com/new).
3. In Vercel, choose **Add New → Project**, import the GitHub repository, and click Deploy.
4. Vercel should detect Vite. Build command: `npm run build`; output directory: `dist`.
5. Test the generated `*.vercel.app` URL.
6. In the Vercel project, go to **Settings → Domains** and enter your domain.
7. Vercel will show the DNS records required. Add those records at the registrar where you bought the domain. Follow the exact records Vercel provides, rather than guessing values.

## Customize before using publicly

- Change FRAME studio name in `src/main.jsx` and `index.html`.
- Replace all sample project names/descriptions with real projects.
- Replace `hello@example.com` in `src/main.jsx` with your email.
- Add your real showreel and project media. The artwork currently uses CSS shapes, not uploaded videos.
- Update the description/title, favicon, privacy information, and any required legal pages.

No domain credentials are needed or should be shared in chat. A custom domain can be connected after initial deployment.
