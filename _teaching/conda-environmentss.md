---
title: "Setting up Conda environments for genomics"
kind: "Resources"
subkind: "Setup guides"
level: "Beginner · 15 minutes"
lede: "How to install Conda, create a clean environment for each project, and avoid version-conflict headaches."
order: 1
---

If you only learn one habit in computational biology, make it this one: **never install scientific tools globally**. Every project gets its own Conda environment. This guide walks you through setting up Conda on your machine and creating environments you can reproduce anywhere.

## Step 1 — Install Miniconda

Miniconda is a minimal version of Anaconda. It gives you the `conda` command without bloating your system.

On Mac:

```bash
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
bash Miniconda3-latest-MacOSX-arm64.sh
```

On Linux:

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

Restart your terminal after installation.

## Step 2 — Configure channels

Most bioinformatics tools live on the `bioconda` channel. Add it once and you never need to type it again:

```bash
conda config --add channels defaults
conda config --add channels bioconda
conda config --add channels conda-forge
conda config --set channel_priority strict
```

## Step 3 — Create your first environment

Make a project-specific environment with the tools you need:

```bash
conda create -n rnaseq -c bioconda \
    fastqc multiqc salmon samtools
conda activate rnaseq
```

> **Tip**: Always use `-n project-name` to give your environment a meaningful name. You will have many of these — `env1`, `env2`, `env3` is useless three months later.

## Step 4 — Save your environment for reproducibility

Once your pipeline works, export the environment so collaborators (or future you) can reproduce it:

```bash
conda env export --from-history > environment.yml
```

The `--from-history` flag is important — it captures only the packages you explicitly installed, not every dependency. Cleaner and more portable across operating systems.

To recreate the environment on another machine:

```bash
conda env create -f environment.yml
```

## Common pitfalls

- **Slow installs?** Use `mamba` instead of `conda`. It's a drop-in replacement that's 10× faster: `conda install -n base -c conda-forge mamba`
- **Conflicts?** Most version conflicts come from mixing channels. The `channel_priority strict` setting from Step 2 prevents almost all of these.
- **Disk full?** Conda environments add up. Run `conda env list` to see them all, then `conda env remove -n unused-env` to clean up.
