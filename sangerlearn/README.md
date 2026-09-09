# SangerLearn

An interactive, browser-based course on **Sanger (chain-termination) DNA sequencing** —
from the chemistry of a single ddNTP through reading an electropherogram to analysing
real `.ab1` files in R with `sangerseqR` and `sangeranalyseR`.

Runs entirely in the browser. No server, no accounts, no data leaving the page.

## What's inside

- **`index.html`** + **`app.js`** — the workbench (8 steps: chemistry, reaction, separation, reading, simulator, R analysis, quiz).
- **`example_data/`** — practice files and scripts, served with in-page download links:
  - `sanger_example.R` — end-to-end pipeline on sangeranalyseR's bundled real earthworm data
  - `make_ab1.py` — generate your own synthetic `.ab1` files from any sequence
  - four ready-made `.ab1` files (a matched forward/reverse pair + two standalone reads)
- **`.nojekyll`** — tells GitHub Pages to serve the folder as-is (needed for the
  `example_data` files to resolve).

## Deploy to GitHub Pages (same as AmpliLearn)

1. Create a new repository under the `meeg-lab` org named **`sangerlearn`**.
2. Copy the contents of this folder into the repo root and push to `main`:
   ```bash
   git init
   git add .
   git commit -m "SangerLearn: interactive Sanger sequencing course"
   git branch -M main
   git remote add origin git@github.com:meeg-lab/sangerlearn.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch **`main`**, folder **`/ (root)`**. Save.
4. It publishes at **`https://meeg-lab.github.io/sangerlearn/`**.

The download links in the app use relative paths (`example_data/…`), so they work
automatically once deployed — no edits needed.

## Credit

Built for the meeg-lab teaching collection, alongside
[AmpliLearn](https://meeg-lab.github.io/amplilearn/).
