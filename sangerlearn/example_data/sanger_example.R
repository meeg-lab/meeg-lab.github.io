###############################################################################
#  SangerLearn — companion R script
#  Simulate a full Sanger analysis using REAL example data.
#
#  You do NOT need to download anything. sangeranalyseR ships with a bundled
#  dataset of 8 ABIF (.ab1) files from the earthworm Allolobophora chlorotica
#  (COI gene). This script walks the same pipeline taught in the app:
#     one read  ->  a contig  ->  a full alignment.
#
#  Run it top to bottom, or step through section by section.
###############################################################################

## ---------------------------------------------------------------------------
## 0.  Install (once).  Bioconductor packages go through BiocManager.
## ---------------------------------------------------------------------------
if (!requireNamespace("BiocManager", quietly = TRUE))
  install.packages("BiocManager")

for (pkg in c("sangerseqR", "sangeranalyseR")) {
  if (!requireNamespace(pkg, quietly = TRUE))
    BiocManager::install(pkg, update = FALSE, ask = FALSE)
}

library(sangerseqR)
library(sangeranalyseR)

## ---------------------------------------------------------------------------
## 1.  Locate the bundled example data (no download needed)
## ---------------------------------------------------------------------------
# The files live inside the installed package. system.file() finds them.
rawDataDir <- system.file("extdata", package = "sangeranalyseR")

# One forward read we'll use for the single-read demo:
oneReadFN <- file.path(rawDataDir, "Allolobophora_chlorotica", "ACHLO",
                       "Achl_ACHLO006-09_1_F.ab1")

cat("Example data folder:\n", rawDataDir, "\n\n")
cat("Files available:\n")
print(list.files(file.path(rawDataDir, "Allolobophora_chlorotica"),
                 recursive = TRUE, pattern = "\\.ab1$"))

## ---------------------------------------------------------------------------
## 2.  PATH A — inspect a SINGLE read with sangerseqR
##     (the low-level package: read trace, call bases, plot chromatogram)
## ---------------------------------------------------------------------------
sq <- readsangerseq(oneReadFN)

cat("\nPrimary base calls (first 60):\n")
print(substr(as.character(primarySeq(sq)), 1, 60))

# Re-call bases so secondary peaks (possible heterozygotes) are exposed.
sq <- makeBaseCalls(sq, ratio = 0.33)

# Plot the four-channel chromatogram to a PDF you can open.
# trim5 skips the noisy first bases; one page per ~100 bases.
chromatogram(sq, width = 100, height = 2, trim5 = 50,
             showcalls = "primary",
             filename = "example_chromatogram.pdf")
cat("\nWrote example_chromatogram.pdf  (open it to see the trace)\n")

## ---------------------------------------------------------------------------
## 3.  PATH B, step 1 — build ONE SangerRead with sangeranalyseR
##     (adds quality trimming on top of sangerseqR)
## ---------------------------------------------------------------------------
sangerReadF <- SangerRead(
  inputSource      = "ABIF",
  readFeature      = "Forward Read",
  readFileName     = oneReadFN,
  TrimmingMethod   = "M1",        # modified Mott algorithm
  M1TrimmingCutoff = 0.0001,      # default M1 cutoff
  signalRatioCutoff = 0.33        # secondary-peak annotation threshold
)

## ---------------------------------------------------------------------------
## 4.  PATH B, step 2 — assemble a CONTIG from forward + reverse reads
##     RBNII sub-folder holds a matched F/R pair for one specimen.
## ---------------------------------------------------------------------------
contigDir <- file.path(rawDataDir, "Allolobophora_chlorotica", "RBNII")

myContig <- SangerContig(
  inputSource         = "ABIF",
  processMethod       = "REGEX",
  ABIF_Directory      = contigDir,
  contigName          = "Achl_RBNII384-13",
  REGEX_SuffixForward = "_[0-9]*_F.ab1$",   # files ending _1_F.ab1
  REGEX_SuffixReverse = "_[0-9]*_R.ab1$",   # files ending _2_R.ab1
  TrimmingMethod      = "M1",
  M1TrimmingCutoff    = 0.0001
)

cat("\nContig consensus sequence:\n")
print(myContig@contigSeq)

## ---------------------------------------------------------------------------
## 5.  PATH B, step 3 — the full end-to-end ALIGNMENT (all 8 files, 4 contigs)
## ---------------------------------------------------------------------------
parentDir <- file.path(rawDataDir, "Allolobophora_chlorotica", "ACHLO")

sa <- SangerAlignment(
  inputSource         = "ABIF",
  processMethod       = "REGEX",
  ABIF_Directory      = parentDir,
  REGEX_SuffixForward = "_[0-9]*_F.ab1$",
  REGEX_SuffixReverse = "_[0-9]*_R.ab1$",
  TrimmingMethod      = "M1",
  M1TrimmingCutoff    = 0.0001
)

cat("\nAlignment built successfully:", sa@objectResults@creationResult, "\n")
cat("Number of contigs:", length(sa@contigList), "\n")

## ---------------------------------------------------------------------------
## 6.  Explore interactively (optional — needs a GUI / browser)
## ---------------------------------------------------------------------------
# launchApp(sa)          # sliders for M1/M2 trimming with live trace preview
# generateReport(sa)     # writes a shareable static HTML report

## ---------------------------------------------------------------------------
## 7.  Export results
## ---------------------------------------------------------------------------
writeFasta(sa, outputDir = getwd())   # aligned + consensus FASTA in this folder
cat("\nDone. FASTA output written to:", getwd(), "\n")
