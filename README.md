# Rabbit Game

Static-friendly build of the rabbit digging game. Runs on **GitHub Pages**.

## Play

After the first successful GitHub Actions deploy:

**https://yeepingy88-source.github.io/rabbit/**

## Enable GitHub Pages (one-time)

1. Open **https://github.com/yeepingy88-source/rabbit/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Save

Then open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish (or click **Run workflow**).

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173/rabbit/).

## Build

```bash
npm run build
npm run preview
```

Output is in `dist/` with base path `/rabbit/`.
