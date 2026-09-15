# Rao Rizwan Portfolio

Personal portfolio website for Rao Rizwan, a backend engineer working with
Python, Django, REST APIs, Celery, PostgreSQL, and cloud infrastructure.

**Live site:** [devraorizwan.online](https://devraorizwan.online)

## Built With

- React
- Vite
- Tailwind CSS
- Vercel

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Available Commands

```bash
npm run dev      # Start the development server
npm run build    # Create the production build
npm run preview  # Preview the production build
```

## Project Structure

```text
public/       Public images, logos, icons, and documents
private/      Local source files, ignored by Git
src/          React components, styles, and portfolio content
index.html    SEO metadata and application entry point
vercel.json   Vercel deployment configuration
```

## Updating Content

Most portfolio content is managed in [`src/content.js`](src/content.js).
Images and other public assets belong in `public/`.

For example:

```text
public/images/example.webp -> /images/example.webp
```

## Deployment

The site can be deployed to Vercel with the default Vite settings:

1. Import the repository into Vercel.
2. Use `npm run build` as the build command.
3. Set `dist` as the output directory.

## Privacy

Private source files and local environment files are excluded through
`.gitignore`. No API keys or environment variables are required to run this
project.
