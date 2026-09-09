#!/usr/bin/env python3
"""
make_ab1.py  —  Generate synthetic Sanger .ab1 (ABIF) files for practice.

Produces spec-compliant ABIF binaries with the four trace channels (DATA9-12),
the base order (FWO_1), called bases (PBAS1) and peak locations (PLOC1) that
sangerseqR / sangeranalyseR need to read, trim, base-call and plot a trace.

Usage:
    python make_ab1.py                       # writes demo_F.ab1 + demo_R.ab1
    python make_ab1.py ATGCGTACGTTAGC out.ab1
    python make_ab1.py --pair MYSEQ...       # writes a matched _1_F / _2_R pair

The generated files are synthetic (idealized Gaussian peaks + light noise), not
real capillary data, but they parse correctly and are ideal for learning the
sangeranalyseR pipeline without lab data.
"""

import struct, sys, math, random

BASES = "ACGT"

def revcomp(seq):
    return seq.translate(str.maketrans("ACGT", "TGCA"))[::-1]

def build_traces(seq, spacing=12, peak_sd=3.2, noise=18, amp=1400):
    """Return (channels dict A/C/G/T -> list[int], peak_locations list[int])."""
    n = len(seq)
    length = spacing * (n + 2)
    chans = {b: [0]*length for b in BASES}
    plocs = []
    for i, base in enumerate(seq):
        center = spacing * (i + 1)
        plocs.append(center)
        for x in range(length):
            g = math.exp(-((x-center)**2)/(2*peak_sd**2)) * amp
            if g > 1:
                chans[base][x] += int(g)
    # add a little baseline noise to every channel so it looks real
    for b in BASES:
        for x in range(length):
            chans[b][x] = max(0, chans[b][x] + random.randint(0, noise))
    return chans, plocs

# ---- ABIF binary writer -----------------------------------------------------
# ABIF = header + directory of entries. Each entry: name(4s) num(i) elttype(h)
# eltsize(h) numelts(i) datasize(i) dataoffset(i) datahandle(i).  Data <=4 bytes
# is inlined in the dataoffset field; larger data is appended after the directory.

class ABIFWriter:
    def __init__(self):
        self.entries = []   # (name, num, elttype, eltsize, numelts, raw_bytes)

    def add(self, name, num, elttype, eltsize, numelts, raw):
        self.entries.append([name, num, elttype, eltsize, numelts, raw])

    def add_short_array(self, name, num, values):           # type 4 = short
        raw = b"".join(struct.pack(">h", v) for v in values)
        self.add(name, num, 4, 2, len(values), raw)

    def add_long(self, name, num, value):                   # type 7 = long/int32
        self.add(name, num, 7, 4, 1, struct.pack(">i", value))

    def add_pstring(self, name, num, text):                 # type 18 = pString
        b = text.encode("latin-1")
        raw = bytes([len(b)]) + b
        self.add(name, num, 18, 1, len(raw), raw)

    def add_char(self, name, num, text):                    # type 2 = char array
        raw = text.encode("latin-1")
        self.add(name, num, 2, 1, len(raw), raw)

    def write(self, path):
        HEADER = 128
        DIR_ENTRY = 28
        ndir = len(self.entries)
        # Layout: [128 header][directory entries][appended data blobs]
        dir_offset = HEADER
        data_start = HEADER + ndir * DIR_ENTRY
        blobs = bytearray()
        dir_bytes = bytearray()
        cursor = data_start
        for name, num, elttype, eltsize, numelts, raw in self.entries:
            datasize = len(raw)
            if datasize <= 4:
                # inline, left-justified in the offset field
                offset_field = raw + b"\x00"*(4-datasize)
                offset_val = struct.unpack(">i", offset_field)[0]
            else:
                offset_val = cursor
                blobs += raw
                cursor += datasize
                if len(blobs) % 2:            # keep things tidy (even align)
                    blobs += b"\x00"; cursor += 1
            dir_bytes += struct.pack(">4sihhiiii",
                                     name.encode("ascii"), num, elttype,
                                     eltsize, numelts, datasize, offset_val, 0)
        # header: "ABIF" + version(101) + a directory entry describing the dir
        header = bytearray(HEADER)
        struct.pack_into(">4sh", header, 0, b"ABIF", 101)
        struct.pack_into(">4sihhiiii", header, 6,
                         b"tdir", 1, 1023, DIR_ENTRY, ndir,
                         ndir*DIR_ENTRY, dir_offset, 0)
        with open(path, "wb") as fh:
            fh.write(header)
            fh.write(dir_bytes)
            fh.write(blobs)

def make_ab1(seq, path, sample_name="synthetic"):
    seq = seq.upper().strip()
    assert seq and all(c in BASES for c in seq), "sequence must be non-empty A/C/G/T"
    chans, plocs = build_traces(seq)
    w = ABIFWriter()
    # trace channels: analyzed data lives in DATA 9,10,11,12 for G,A,T,C order.
    # FWO_1 declares the channel-to-base order; we use G A T C (ABI convention).
    order = "GATC"
    w.add_short_array("DATA", 9,  chans["G"])
    w.add_short_array("DATA", 10, chans["A"])
    w.add_short_array("DATA", 11, chans["T"])
    w.add_short_array("DATA", 12, chans["C"])
    w.add_char("FWO_", 1, order)                 # base order for the 4 channels
    w.add_pstring("PBAS", 1, seq)                # primary called bases
    w.add_pstring("PBAS", 2, seq)                # secondary (same here)
    w.add_short_array("PLOC", 1, plocs)          # peak x-locations
    w.add_short_array("PLOC", 2, plocs)
    w.add_short_array("PCON", 1, [40]*len(seq))  # per-base quality (Phred ~40)
    w.add_pstring("SMPL", 1, sample_name)        # sample name
    w.add_long("SCAN", 1, len(chans["A"]))       # number of scan points
    w.write(path)
    return path

def main(argv):
    if "--pair" in argv:
        argv.remove("--pair")
        seq = argv[0] if argv else "ATGCGTACGTTAGCCTGACGTTAGCATTACGGATCCA"
        make_ab1(seq, "specimen01_1_F.ab1", "specimen01_F")
        make_ab1(revcomp(seq), "specimen01_2_R.ab1", "specimen01_R")
        print("Wrote matched pair: specimen01_1_F.ab1  specimen01_2_R.ab1")
        print("Point sangeranalyseR SangerContig() at this folder to assemble them.")
        return
    seq = argv[0] if len(argv) >= 1 else "ATGCGTACGTTAGCCTGACGTTAGCATTACGGATCCA"
    out = argv[1] if len(argv) >= 2 else "demo_F.ab1"
    make_ab1(seq, out)
    print(f"Wrote {out}  ({len(seq)} bases)")
    if len(argv) < 1:
        make_ab1(revcomp(seq), "demo_R.ab1", "demo_R")
        print("Wrote demo_R.ab1 (reverse complement)")

if __name__ == "__main__":
    main(sys.argv[1:])
