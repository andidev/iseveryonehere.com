# Is Everyone Here?

A lightweight web app for **roll call and attendance** at meetings, classes, or events: add names, run a **check-in** round, then **checkout** when people leave. State lives in the **URL hash** in your browser (no server-side account storage for the list itself), so you can share a link and work offline in the tab.

## Issues and feature requests

- **Bug reports:** [Open a bug report](https://github.com/andidev/iseveryonehere.com/issues/new?template=bug_report.yml)
- **Feature requests:** [Request a feature](https://github.com/andidev/iseveryonehere.com/issues/new?template=feature_request.yml)

All issues are tracked in the [GitHub issue tracker](https://github.com/andidev/iseveryonehere.com/issues).

## Development on Replit

This project was developed with [Replit](https://replit.com).

To **run your own copy** on another Replit account:

1. **Fork** this repository on GitHub to your account (or duplicate the Repl if the project is published on Replit and duplication is available).
2. In Replit, **create a new Repl** and choose **Import from GitHub**, then select **your fork** (sign in to GitHub and authorize Replit if asked).
3. Open **Tools → Secrets** or your Repl’s **Git** panel and connect **your** GitHub account so pushes and pulls use your fork, not the upstream repo.
4. Develop in the Repl; **commit and push** to your fork when you want to save work. For release, use your **fork’s** GitHub repo as the source of truth.

Replit’s UI can change; if import options differ, use **“Import from GitHub”** with your fork URL and ensure the Repl is linked to **your** GitHub user.

## Host your own fork on GitHub Pages

1. **Fork** [this repository](https://github.com/andidev/iseveryonehere.com) on GitHub (your fork will be under `https://github.com/<you>/<repo>`).
2. In the fork: **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (this repo includes a workflow that builds the Vite app and deploys the static site).
3. Push to **`main`** (or adjust the branch in `.github/workflows/deploy-github-pages.yml` if your default branch differs).  
   For a **project site** (`https://<user>.github.io/<repo>/`), the workflow sets `BASE_PATH` from the repository name so assets load correctly.
4. If deployment is blocked by **environment** rules, in **Settings → Environments → `github-pages`**, allow **`main`** (or **All branches**) for deployments.

## License

Open source under the **[MIT License](LICENSE)**.
