---
title: "RNA-seq from FASTQ to figures"
kind: "Tutorials"
level: "Self-paced, ~6 hours"
lede: "An end-to-end RNA-seq tutorial walking through quality control, quantification, differential expression, and pathway analysis."
order: 1
---

A standalone tutorial we developed for our group's onboarding and have since released openly. Designed to take a beginner from raw FASTQ files to publication-style figures in a single afternoon.

## What you'll do

- Run FastQC and MultiQC on raw reads
- Quantify transcripts with Salmon
- Import quantifications with `tximport` and run `DESeq2`
- Make MA plots, volcano plots, and a heatmap of top differentially expressed genes
- Run a simple pathway enrichment analysis with `clusterProfiler`

## Format

The tutorial is a Quarto book with executable code. Everything runs locally in a single Conda environment we provide.

[Open the tutorial →](https://github.com/)
