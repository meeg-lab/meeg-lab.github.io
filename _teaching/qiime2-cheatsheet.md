---
title: "QIIME 2 commands cheat sheet"
kind: "Resources"
subkind: "Cheat sheets"
level: "Quick reference"
lede: "The QIIME 2 commands we use most often in 16S amplicon analysis, in one printable page."
order: 1
---

A one-page reference for the QIIME 2 commands you will run most often when doing 16S amplicon analysis. Print it, pin it next to your monitor, and stop opening five browser tabs every time you forget a flag.

## Import

```bash
qiime tools import \
  --type 'SampleData[PairedEndSequencesWithQuality]' \
  --input-path manifest.csv \
  --output-path demux.qza \
  --input-format PairedEndFastqManifestPhred33V2
```

## Quality control summary

```bash
qiime demux summarize \
  --i-data demux.qza \
  --o-visualization demux.qzv
```

## Denoise with DADA2

```bash
qiime dada2 denoise-paired \
  --i-demultiplexed-seqs demux.qza \
  --p-trim-left-f 0 --p-trim-left-r 0 \
  --p-trunc-len-f 240 --p-trunc-len-r 200 \
  --o-table table.qza \
  --o-representative-sequences rep-seqs.qza \
  --o-denoising-stats denoising-stats.qza
```

## Taxonomy assignment

```bash
qiime feature-classifier classify-sklearn \
  --i-classifier silva-138-classifier.qza \
  --i-reads rep-seqs.qza \
  --o-classification taxonomy.qza
```

## Diversity metrics

```bash
qiime diversity core-metrics-phylogenetic \
  --i-phylogeny rooted-tree.qza \
  --i-table table.qza \
  --p-sampling-depth 10000 \
  --m-metadata-file sample-metadata.tsv \
  --output-dir core-metrics-results
```
