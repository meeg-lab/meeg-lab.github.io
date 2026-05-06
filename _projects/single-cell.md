---
title: "Latent variable models for single-cell biology"
area: "Genomics"
featured: true
lede: "How can we summarize the variation in millions of single cells without losing biologically meaningful structure?"
order: 1
---

Single-cell sequencing now routinely produces measurements of tens of thousands of features across millions of cells. Standard dimensionality reduction methods often distort biologically meaningful structure — rare cell types, gradual differentiation trajectories, and batch effects all challenge off-the-shelf approaches.

We develop **structured latent variable models** that build domain knowledge — known cell type hierarchies, lineage relationships, batch design — directly into the model. Our methods combine Bayesian priors over latent structure with scalable variational inference, so they run on full atlas-scale datasets.

## Recent threads

- **Hierarchical priors** that share information across related cell types
- **Disentangled representations** for separating biological from technical variation
- **Trajectory inference** under mis-specified developmental graphs

## Collaborators

This work is in close collaboration with the [Collaborator Lab](#) at Other University, and is supported by NIH grant R01-XXXXXX.

## Code

All released methods are available at our [GitHub organization](https://github.com/{{ site.github_username }}).
