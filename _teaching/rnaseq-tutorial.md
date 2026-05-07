---
title: "RNA-seq from FASTQ to differential expression"
kind: "Tutorials"
level: "Beginner-friendly · ~2 hours"
lede: "An end-to-end walkthrough from raw reads to a list of differentially expressed genes, with every command explained."
order: 1
---

This tutorial assumes you have a Linux/Mac terminal and basic familiarity with the command line. We will go from raw FASTQ files to a final table of differentially expressed genes, using a reproducible pipeline that scales to any number of samples.

By the end you will have:
- Quality-checked your reads
- Quantified gene expression with Salmon
- Identified differentially expressed genes with DESeq2
- Visualized results with a volcano plot

> **What you need before starting**: a terminal with `conda` installed, the example dataset (link below), and roughly 8 GB of free disk space.

## Step 1 — Set up the environment

We use Conda to manage all the tools so you can reproduce this exactly:

```bash
conda create -n rnaseq -c bioconda \
    fastqc multiqc salmon samtools r-base bioconductor-deseq2
conda activate rnaseq
```

Verify the tools installed:

```bash
fastqc --version
salmon --version
samtools --version
```

You should see version numbers for each. If any fail, the install did not complete — try again with a fresh environment.

## Step 2 — Quality control with FastQC

Before doing anything with raw reads, always check their quality. Bad reads at the start of a pipeline propagate errors all the way downstream.

```bash
mkdir -p qc_results
fastqc -t 4 -o qc_results/ raw_reads/*.fastq.gz
```

What this does:
- `-t 4` runs 4 threads in parallel — faster on a multi-core machine
- `-o qc_results/` puts results in a dedicated folder
- The wildcard `*.fastq.gz` processes every FASTQ at once

If you have many samples, combine the reports into one dashboard:

```bash
multiqc qc_results/ -o qc_results/
```

> **Tip**: Look for warning flags in the per-base sequence quality, adapter content, and overrepresented sequences sections. Most modern Illumina data passes everything; if it doesn't, you may need to trim adapters before continuing.

## Step 3 — Build a Salmon index

Salmon needs a transcriptome index to map reads against. Build it once per organism:

```bash
salmon index -t reference/transcriptome.fa.gz \
             -i salmon_index \
             -k 31
```

The `-k 31` flag is the k-mer length; 31 is the recommended default for reads of 75 bp or longer.

## Step 4 — Quantify expression

Now run Salmon on each sample:

```bash
for sample in raw_reads/*_R1.fastq.gz; do
    name=$(basename "$sample" _R1.fastq.gz)
    salmon quant -i salmon_index \
                 -l A \
                 -1 raw_reads/${name}_R1.fastq.gz \
                 -2 raw_reads/${name}_R2.fastq.gz \
                 -o quants/${name} \
                 -p 4 \
                 --validateMappings
done
```

This loops over all samples, picks the matching R1/R2 pair, and writes per-sample quantification to `quants/<sample_name>/`.

> **Tip**: `-l A` lets Salmon auto-detect the library type. If you know it (e.g. ISR for stranded TruSeq), specify it explicitly for a small speedup.

## Step 5 — Differential expression in R

Switch to R for the statistics. The key piece is loading the Salmon outputs with `tximport` and running `DESeq2`:

```r
library(tximport)
library(DESeq2)

# Load sample metadata
samples <- read.csv("samples.csv")
files <- file.path("quants", samples$name, "quant.sf")
names(files) <- samples$name

# Import and build DESeq2 dataset
txi <- tximport(files, type = "salmon", tx2gene = tx2gene)
dds <- DESeqDataSetFromTximport(txi, colData = samples, design = ~ condition)

# Run the analysis
dds <- DESeq(dds)
res <- results(dds, contrast = c("condition", "treated", "control"))

# How many genes are significantly different?
summary(res)
```

The `summary()` output tells you how many genes are up- and down-regulated at the default 10% FDR threshold.

## Step 6 — Make a volcano plot

A volcano plot is the classic visualization for DE results — log fold change on x, statistical significance on y:

```r
library(ggplot2)

df <- as.data.frame(res)
df$significant <- df$padj < 0.05 & abs(df$log2FoldChange) > 1

ggplot(df, aes(log2FoldChange, -log10(padj), color = significant)) +
    geom_point(alpha = 0.6) +
    scale_color_manual(values = c("grey70", "#a04a28")) +
    geom_vline(xintercept = c(-1, 1), linetype = "dashed") +
    geom_hline(yintercept = -log10(0.05), linetype = "dashed") +
    theme_minimal()
```

You should now have a clean volcano plot showing significantly differentially expressed genes in terracotta.

## Where to go next

This is the simplest possible pipeline. Real-world projects often add:

- **Adapter trimming** with `trimmomatic` or `fastp` before alignment
- **Batch effect correction** if samples were processed on multiple sequencing runs
- **Pathway analysis** (e.g. with `clusterProfiler`) to interpret the gene list biologically

Each of these will get its own tutorial — check back later, or [email Sunil](mailto:sunilmundra@uaeu.ac.ae) if you want to suggest a topic.
