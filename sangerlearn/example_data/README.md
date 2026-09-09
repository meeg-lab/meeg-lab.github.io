# SangerLearn — example data & scripts

Three ways to get data to practice a Sanger analysis, from easiest to most hands-on.

## Option 1 — use the data already inside sangeranalyseR (nothing to download)

`sangeranalyseR` ships with 8 real `.ab1` files from the earthworm
*Allolobophora chlorotica* (COI gene). The companion script **`sanger_example.R`**
uses them directly — just run it in R:

```r
source("sanger_example.R")
```

It walks the whole pipeline: a single read (`sangerseqR`) → one contig →
the full 4-contig alignment (`sangeranalyseR`), and writes a chromatogram PDF
and consensus FASTA into your working directory.

## Option 2 — use the ready-made synthetic files in `example_data/`

These are already generated and valid — point R at them right away:

| File | Role |
|------|------|
| `specimen01_1_F.ab1` | Forward read of a specimen |
| `specimen01_2_R.ab1` | Reverse read (reverse-complement) of the same specimen |
| `gattaca_F.ab1` | A short standalone read |
| `sample_clean_F.ab1` | Another short standalone read |

Assemble the matched pair into a contig:

```r
library(sangeranalyseR)
myContig <- SangerContig(
  inputSource         = "ABIF",
  processMethod       = "REGEX",
  ABIF_Directory      = "example_data",
  contigName          = "specimen01",
  REGEX_SuffixForward = "_[0-9]*_F.ab1$",
  REGEX_SuffixReverse = "_[0-9]*_R.ab1$"
)
myContig@contigSeq
```

Or inspect a single file with the lower-level package:

```r
library(sangerseqR)
sq <- readsangerseq("example_data/gattaca_F.ab1")
primarySeq(sq)
chromatogram(sq, showcalls = "primary")
```

## Option 3 — make your own from any sequence

**`make_ab1.py`** generates spec-compliant `.ab1` files from a sequence you type.
Requires only Python 3 (no libraries).

```bash
# a single file from a sequence
python make_ab1.py ATGCGTACGTTAGC my_read_F.ab1

# a matched forward/reverse pair ready for SangerContig()
python make_ab1.py --pair ATGCGTACGTTAGCCTGACGTTAGC

# no arguments -> writes demo_F.ab1 and demo_R.ab1
python make_ab1.py
```

The files contain the four trace channels, base order, called bases, peak
locations and per-base quality — everything `sangerseqR` needs to read, trim,
base-call and plot them.

### A note on realism

The synthetic files use idealized Gaussian peaks with light baseline noise.
They parse identically to real capillary data (verified against BioPython's
ABIF reader) and are perfect for learning the workflow — but they won't show
the messy starts, double peaks, or end-of-read broadening you get from a real
sequencer. For that, use Option 1's real earthworm data.
