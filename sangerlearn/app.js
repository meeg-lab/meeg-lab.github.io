/* ============================================================
   SangerLearn — MetaLearn-style workbench
   ============================================================ */
let currentStep = 0, unlockedUpTo = 0;   // steps unlock as you advance

/* ---------- shared: electropherogram renderer ---------- */
const PHCOL = {A:'#1d9e75',C:'#378add',G:'#8f9aa6',T:'#e24b4a'};
function chip(s){return s.replace(/([ACGT])/g,m=>'<span class="base b-'+m+'">'+m+'</span>');}
function pherogramSVG(seq,h){
  h=h||140; const step=26,x0=26,base=h-28,peakH=h-64;
  const w=Math.max(seq.length*step+x0*2,280);
  let out='';
  ['G','A','T','C'].forEach(b=>{
    let d='M'+x0+' '+base;
    seq.split('').forEach((bb,i)=>{
      const cx=x0+i*step+step/2;
      if(bb===b){ d+=' L'+(cx-13)+' '+base;
        for(let x=-12;x<=12;x++){const y=Math.exp(-(x*x)/34)*peakH;d+=' L'+(cx+x)+' '+(base-y).toFixed(1);}
        d+=' L'+(cx+13)+' '+base; }
    });
    d+=' L'+(x0+seq.length*step)+' '+base;
    out+='<path d="'+d+'" fill="none" stroke="'+PHCOL[b]+'" stroke-width="2"/>';
  });
  seq.split('').forEach((b,i)=>{
    const cx=x0+i*step+step/2;
    out+='<text x="'+cx+'" y="'+(h-8)+'" text-anchor="middle" font-family="ui-monospace,monospace" font-size="13" font-weight="700" fill="'+PHCOL[b]+'">'+b+'</text>';
  });
  return '<svg viewBox="0 0 '+w+' '+h+'" style="min-width:'+w+'px;width:'+w+'px;height:auto">'+out+'</svg>';
}
function termDots(){return '<div class="term-dot" style="background:#ff5f57"></div><div class="term-dot" style="background:#febc2e"></div><div class="term-dot" style="background:#28c840"></div>';}

/* ============================================================
   STEP PANES
   ============================================================ */
const PANES = [];

/* ---- STEP 1: INTRO ---- */
PANES[0] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 1 of 14</div>
  <h1 class="step-title">What is Sanger sequencing?</h1>
  <p class="step-desc">Sanger sequencing turns an invisible strand of DNA into a string of coloured peaks you can read like text. It works by making many copies of a template and <b>randomly stopping</b> each copy at a different base, then sorting those fragments by length. This workbench walks the whole path — from a single terminator nucleotide to analysing real <code>.ab1</code> files in R.</p>

  <div class="diagram-card">
    <svg width="100%" viewBox="0 0 680 190" role="img">
      <title>Sanger sequencing pipeline overview</title>
      <desc>Flow from template through terminated fragments, capillary separation, electropherogram, and R analysis</desc>
      <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
      <g>
        <rect x="8" y="70" width="120" height="56" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
        <text font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#085041" x="68" y="93" text-anchor="middle" dominant-baseline="central">Template + ddNTPs</text>
        <text font-family="system-ui,sans-serif" font-size="10" fill="#0f6e56" x="68" y="110" text-anchor="middle" dominant-baseline="central">reaction</text>
      </g>
      <line x1="128" y1="98" x2="140" y2="98" stroke="#0f6e56" stroke-width="1" marker-end="url(#a)"/>
      <g>
        <rect x="142" y="70" width="120" height="56" rx="8" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
        <text font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#3c3489" x="202" y="93" text-anchor="middle" dominant-baseline="central">Fragments</text>
        <text font-family="system-ui,sans-serif" font-size="10" fill="#534ab7" x="202" y="110" text-anchor="middle" dominant-baseline="central">every length</text>
      </g>
      <line x1="262" y1="98" x2="274" y2="98" stroke="#534ab7" stroke-width="1" marker-end="url(#a)"/>
      <g>
        <rect x="276" y="70" width="120" height="56" rx="8" fill="#faeeda" stroke="#854f0b" stroke-width="0.5"/>
        <text font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#633806" x="336" y="93" text-anchor="middle" dominant-baseline="central">Capillary</text>
        <text font-family="system-ui,sans-serif" font-size="10" fill="#854f0b" x="336" y="110" text-anchor="middle" dominant-baseline="central">sort by size</text>
      </g>
      <line x1="396" y1="98" x2="408" y2="98" stroke="#854f0b" stroke-width="1" marker-end="url(#a)"/>
      <g>
        <rect x="410" y="70" width="120" height="56" rx="8" fill="#e6f1fb" stroke="#185fa5" stroke-width="0.5"/>
        <text font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#042c53" x="470" y="93" text-anchor="middle" dominant-baseline="central">Electropherogram</text>
        <text font-family="system-ui,sans-serif" font-size="10" fill="#185fa5" x="470" y="110" text-anchor="middle" dominant-baseline="central">read peaks</text>
      </g>
      <line x1="530" y1="98" x2="542" y2="98" stroke="#185fa5" stroke-width="1" marker-end="url(#a)"/>
      <g>
        <rect x="544" y="70" width="120" height="56" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
        <text font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#085041" x="604" y="93" text-anchor="middle" dominant-baseline="central">Analyse in R</text>
        <text font-family="system-ui,sans-serif" font-size="10" fill="#0f6e56" x="604" y="110" text-anchor="middle" dominant-baseline="central">sangeranalyseR</text>
      </g>
      <text font-family="system-ui,sans-serif" font-size="11" fill="#a09d94" x="340" y="22" text-anchor="middle">The Sanger workflow — click any unlocked step in the rail above to jump there</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#a09d94" x="340" y="160" text-anchor="middle">Live electropherogram below is generated in your browser from the sequence ATGCAAGCTTGG</text>
    </svg>
  </div>

  <div class="pherobox">${pherogramSVG('ATGCAAGCTTGG',150)}</div>
  <div class="legend">
    <span><i style="background:#1d9e75"></i>A adenine</span>
    <span><i style="background:#378add"></i>C cytosine</span>
    <span><i style="background:#8f9aa6"></i>G guanine</span>
    <span><i style="background:#e24b4a"></i>T thymine</span>
  </div>

  <div class="two-col" style="margin-top:20px">
    <div class="card">
      <div class="card-title">Why it still matters</div>
      <div class="card-desc">Developed by Frederick Sanger in 1977 — his second Nobel Prize.</div>
      <div style="font-size:13px;color:var(--muted)">Still the <b style="color:var(--ink)">gold standard</b> for verifying single genes, plasmids, and CRISPR edits: one run gives long, highly accurate, unambiguous reads.</div>
    </div>
    <div class="card">
      <div class="card-title">What you'll do</div>
      <div style="font-size:13px;color:var(--muted)">
        <div style="margin-bottom:3px">&#10022; See how a ddNTP terminates the chain</div>
        <div style="margin-bottom:3px">&#10022; Build a fragment ladder cycle by cycle</div>
        <div style="margin-bottom:3px">&#10022; Watch a capillary sort fragments</div>
        <div style="margin-bottom:3px">&#10022; Read and simulate an electropherogram</div>
        <div>&#10022; Analyse real .ab1 files in R</div>
      </div>
    </div>
  </div>

  <div class="section-label">Example data &#8212; grab it now or in step 7</div>
  <p style="font-size:13px;color:var(--muted);margin:-2px 0 12px">Practice files you can download to run through <code>sangerseqR</code> / <code>sangeranalyseR</code>. Load them into R directly, or open the R analysis step for the full walkthrough.</p>
  <div class="two-col">
    <div class="card">
      <div class="card-title">Synthetic reads <span class="badge badge-info">.ab1</span></div>
      <div class="card-desc">A matched forward/reverse pair plus two standalone reads. Clean idealised peaks &#8212; ready to load immediately.</div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:12px">
        <div><a class="dl" href="example_data/specimen01_1_F.ab1" download>specimen01_1_F.ab1 &#8595;</a> &nbsp; <a class="dl" href="example_data/specimen01_2_R.ab1" download>specimen01_2_R.ab1 &#8595;</a></div>
        <div><a class="dl" href="example_data/gattaca_F.ab1" download>gattaca_F.ab1 &#8595;</a> &nbsp; <a class="dl" href="example_data/sample_clean_F.ab1" download>sample_clean_F.ab1 &#8595;</a></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Scripts <span class="badge badge-pass">R</span> <span class="badge badge-warn">Python</span></div>
      <div class="card-desc">Run the full pipeline on sangeranalyseR's bundled real earthworm data, or generate your own .ab1 files from any sequence.</div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:12px">
        <div><a class="dl" href="example_data/sanger_example.R" download>sanger_example.R &#8595;</a> &#8212; end-to-end analysis</div>
        <div><a class="dl" href="example_data/make_ab1.py" download>make_ab1.py &#8595;</a> &#8212; generate .ab1 from a sequence</div>
      </div>
    </div>
  </div>
  <p class="tip">The synthetic reads use clean peaks (great for learning the commands); the R script uses real capillary data with the messy starts and quality drop-off you meet in practice. All verified to parse correctly.</p>

  <div class="step-nav">
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(1)">Start: the chemistry &#8594;</button>
  </div>
</div>`;

/* ---- STEP 2: CHEMISTRY ---- */
PANES[1] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 2 of 14</div>
  <h1 class="step-title">The chemistry: dNTPs vs ddNTPs</h1>
  <p class="step-desc">Everything hinges on a single missing oxygen. DNA polymerase adds nucleotides to the <b>3&#8242;-OH</b> of the previous base — that hydroxyl is the hook the next base grabs. A <b>ddNTP</b> (dideoxynucleotide) has no 3&#8242;-OH, so once it's added the chain <b>cannot extend</b>. Toggle the two below.</p>

  <div class="card">
    <div class="toggle-row">
      <button class="tg-btn on" id="tg-d" onclick="setChem('d')">dNTP (normal)</button>
      <button class="tg-btn" id="tg-dd" onclick="setChem('dd')">ddNTP (terminator)</button>
    </div>
    <div class="diagram-card" style="margin:0" id="chemDiagram"></div>
    <p style="font-size:13px;color:var(--muted);margin-top:12px" id="chemNote"></p>
  </div>

  <div class="viz-card">
    <div class="viz-title">Dye-terminator chemistry</div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:10px">Modern Sanger gives each of the four ddNTPs a different fluorescent dye, so the base a fragment ends on is encoded by the colour at its tip.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <span class="base b-A">ddA</span><span class="base b-C">ddC</span><span class="base b-G">ddG</span><span class="base b-T">ddT</span>
    </div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(0)">&#8592; Back</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(2)">Continue to the reaction &#8594;</button>
  </div>
</div>`;

/* ---- STEP 3: REACTION ---- */
PANES[2] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 3 of 14</div>
  <h1 class="step-title">The sequencing reaction</h1>
  <p class="step-desc">One tube holds the <b>template</b>, a single <b>primer</b>, <b>polymerase</b>, plenty of normal <b>dNTPs</b>, and a small spike of dye-labelled <b>ddNTPs</b>. With one primer, copying is linear. Each new strand grows until a terminator lands by chance — so across many cycles you collect a fragment ending at every position.</p>

  <div class="card">
    <div class="card-title">Watch fragments accumulate</div>
    <div class="card-desc">Template read 3&#8242;&#8594;5&#8242;. Each cycle extends from the primer and drops in a terminator at a random position.</div>
    <p style="font-family:var(--mono);font-size:13px;margin-bottom:10px">Template: <span id="rxTemplate"></span></p>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button class="mini-btn primary" onclick="rxStep()">Run one cycle &#9654;</button>
      <button class="mini-btn" onclick="rxReset()">Reset</button>
      <span style="font-size:12.5px;color:var(--muted);align-self:center" id="rxCount">0 fragments</span>
    </div>
    <div class="ladder" id="rxFrags"></div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(1)">&#8592; Back</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(3)">Continue to separation &#8594;</button>
  </div>
</div>`;

/* ---- STEP 4: SEPARATION ---- */
PANES[3] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 4 of 14</div>
  <h1 class="step-title">Separation &amp; detection</h1>
  <p class="step-desc">The fragment mixture is pushed through a gel-filled <b>capillary</b> by an electric field. DNA is negatively charged, so it migrates toward the positive electrode — and <b>shorter fragments move faster</b>. As each fragment exits, a <b>laser</b> excites its terminal dye and a detector records the colour. Fragments arrive shortest-first, so the colour order is the base order.</p>

  <div class="diagram-card">
    <svg width="100%" viewBox="0 0 680 120" role="img">
      <title>Capillary electrophoresis reading fragment dyes</title>
      <desc>Fragments of increasing length pass a laser detector at the end of a capillary</desc>
      <rect x="20" y="52" width="520" height="16" rx="8" fill="#12181d"/>
      <circle cx="70" cy="60" r="9" fill="#1d9e75"/><circle cx="120" cy="60" r="9" fill="#378add"/>
      <circle cx="170" cy="60" r="9" fill="#e24b4a"/><circle cx="220" cy="60" r="9" fill="#8f9aa6"/>
      <circle cx="270" cy="60" r="9" fill="#1d9e75"/>
      <path d="M560 40v40M560 40l-7 7M560 40l7 7" stroke="#ba7517" stroke-width="2.5" fill="none"/>
      <text font-family="system-ui,sans-serif" font-size="11" fill="#6b6860" x="560" y="98" text-anchor="middle">laser + detector</text>
      <text font-family="system-ui,sans-serif" font-size="11" fill="#a09d94" x="60" y="34" text-anchor="middle">&#8592; longer (slower)</text>
      <text font-family="system-ui,sans-serif" font-size="11" fill="#a09d94" x="300" y="34" text-anchor="middle">shorter (faster) &#8594;</text>
    </svg>
  </div>

  <div class="card">
    <div class="card-title">Run the capillary</div>
    <div class="card-desc">Fragments exit one at a time, shortest first. The highlighted base is the terminal dye being read.</div>
    <button class="mini-btn primary" onclick="runLadder()" style="margin-bottom:12px">Run separation &#9654;</button>
    <div class="ladder" id="ladderAnim">Press run to load the capillary&#8230;</div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(2)">&#8592; Back</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(4)">Continue to reading &#8594;</button>
  </div>
</div>`;

/* ---- STEP 5: READ ---- */
PANES[4] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 5 of 14</div>
  <h1 class="step-title">Reading the electropherogram</h1>
  <p class="step-desc">The detector output is plotted as four coloured peak channels over time. Each peak is one base call — read left to right and you're reading DNA. A good trace has <b>sharp, evenly spaced peaks</b>, a <b>clean baseline</b>, and <b>consistent heights</b>.</p>

  <div class="pherobox">${pherogramSVG('GATTACAGCC',150)}</div>
  <div class="legend">
    <span><i style="background:#1d9e75"></i>A</span><span><i style="background:#378add"></i>C</span>
    <span><i style="background:#8f9aa6"></i>G</span><span><i style="background:#e24b4a"></i>T</span>
    <span style="margin-left:auto;color:var(--muted)">reads: ${chip('GATTACAGCC')}</span>
  </div>

  <div class="two-col" style="margin-top:20px">
    <div class="card">
      <div class="card-title">Double peaks <span class="badge badge-warn">watch</span></div>
      <div style="font-size:12.5px;color:var(--muted)">Two colours at one position: a heterozygous site or mixed template. Base callers mark it with an ambiguity code (N, R, Y).</div>
    </div>
    <div class="card">
      <div class="card-title">Messy start &amp; broadening end <span class="badge badge-warn">watch</span></div>
      <div style="font-size:12.5px;color:var(--muted)">The first ~20&#8211;40 bases are noisy; peaks broaden past ~700&#8211;900 bases as long fragments separate poorly. That's the usable read-length limit.</div>
    </div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(3)">&#8592; Back</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(5)">Open the simulator &#8594;</button>
  </div>
</div>`;

/* ---- STEP 6: SIMULATOR ---- */
PANES[5] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 6 of 14</div>
  <h1 class="step-title">Build your own read</h1>
  <p class="step-desc">Type any A/C/G/T sequence. The simulator builds the terminated-fragment ladder and the electropherogram it would produce — the same logic as the real thing, in your browser.</p>

  <div class="card">
    <div class="card-title">Template sequence</div>
    <input class="seqin" id="simIn" maxlength="24" value="ATGCGTAC" placeholder="e.g. ATGCGTAC" oninput="simRender()">
    <div class="err" id="simErr"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="mini-btn" onclick="simSet('GATTACA')">GATTACA</button>
      <button class="mini-btn" onclick="simSet('ATGCAAGCTTGG')">Longer read</button>
      <button class="mini-btn" onclick="simRandom()">&#127922; Random</button>
    </div>
  </div>

  <div class="section-label">Terminated fragments (the ladder)</div>
  <div class="ladder" id="simLadder"></div>

  <div class="section-label">Resulting electropherogram</div>
  <div class="pherobox" id="simPhero"></div>
  <p style="text-align:center;font-size:13px;color:var(--muted);margin-top:10px" id="simCall"></p>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(4)">&#8592; Back</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(6)">Analyse in R &#8594;</button>
  </div>
</div>`;


/* ============================================================
   R ANALYSIS STAGES (steps 7-13) — sangerseqR + sangeranalyseR
   Signatures/defaults verified against Bioconductor + ReadTheDocs.
   ============================================================ */

/* ---- STEP 7: LOAD THE READ ---- */
PANES[6] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 7 of 14 &middot; R analysis</div>
  <h1 class="step-title">Load the read</h1>
  <p class="step-desc">A sequencer writes each read as an <code>.ab1</code> (ABIF) file &#8212; a binary container holding the four raw trace channels, the called bases, per-base quality, and peak locations. In R, <b>sangerseqR</b> reads that file into a <code>sangerseq</code> object; <b>sangeranalyseR</b> wraps it as a <code>SangerRead</code>, the bottom of its three-level class hierarchy.</p>

  <div class="diagram-card">
    <svg width="100%" viewBox="0 0 680 170" role="img">
      <title>ABIF file loaded into R objects</title>
      <desc>An .ab1 file becomes a sangerseq object, wrapped as a SangerRead</desc>
      <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
      <rect x="30" y="55" width="150" height="70" rx="8" fill="#f0efe9" stroke="#a09d94" stroke-width="0.5"/>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="600" fill="#1a1a18" x="105" y="82" text-anchor="middle" dominant-baseline="central">read_F.ab1</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#6b6860" x="105" y="100" text-anchor="middle" dominant-baseline="central">traces + calls + quality</text>
      <line x1="180" y1="90" x2="220" y2="90" stroke="#0f6e56" stroke-width="1" marker-end="url(#a)"/>
      <rect x="222" y="55" width="150" height="70" rx="8" fill="#e6f1fb" stroke="#185fa5" stroke-width="0.5"/>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="600" fill="#042c53" x="297" y="82" text-anchor="middle" dominant-baseline="central">sangerseq</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#185fa5" x="297" y="100" text-anchor="middle" dominant-baseline="central">sangerseqR object</text>
      <line x1="372" y1="90" x2="412" y2="90" stroke="#0f6e56" stroke-width="1" marker-end="url(#a)"/>
      <rect x="414" y="55" width="160" height="70" rx="8" fill="#e1f5ee" stroke="#0f6e56" stroke-width="0.5"/>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="600" fill="#085041" x="494" y="82" text-anchor="middle" dominant-baseline="central">SangerRead</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#0f6e56" x="494" y="100" text-anchor="middle" dominant-baseline="central">sangeranalyseR object</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#a09d94" x="300" y="30" text-anchor="middle">One .ab1 file = one read = the bottom level of the class hierarchy</text>
    </svg>
  </div>

  <div class="section-label">Read the file with sangerseqR</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}<span style="font-size:11px;color:#59656f;margin-left:8px">R console</span></div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_load1','b_load1')">library(sangerseqR)
sq <- readsangerseq("gattaca_F.ab1")
sq</span></div>
    <button class="run-btn" id="b_load1" onclick="runTerm('r_load1','b_load1')">&#9654; Run</button>
    <div class="term-output" id="r_load1">  <span class="val">Number of datapoints: 4520</span>
  <span class="val">Number of basecalls: 37</span>

  Primary Basecalls: <span class="hi">GATTACAGGCTAGCTAGGCTTAAGGCCAATTGGCCAA</span>
  Secondary Basecalls: GATTACAGGCTAGCTAGGCTTAAGGCCAATTGGCCAA

  <span class="val">Channel A: 4520 values   Channel C: 4520 values</span>
  <span class="val">Channel G: 4520 values   Channel T: 4520 values</span></div>
  </div>

  <div class="section-label">Wrap it as a SangerRead (sangeranalyseR)</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_load2','b_load2')">library(sangeranalyseR)
sr <- SangerRead(inputSource = "ABIF", readFeature = "Forward Read",
                 readFileName = "gattaca_F.ab1")</span></div>
    <button class="run-btn" id="b_load2" onclick="runTerm('r_load2','b_load2')">&#9654; Run</button>
    <div class="term-output" id="r_load2">INFO [] ------------------------------------------------
INFO [] -------- Creating 'SangerRead' instance --------
INFO [] ------------------------------------------------
INFO [] <span class="val">Forward Read</span>: gattaca_F.ab1
INFO [] Applying default trimming (Method M1, cutoff 0.0001) &#8230;
<span class="hi">SangerRead instance created successfully.</span></div>
  </div>

  <div class="viz-card">
    <div class="viz-title">What a SangerRead holds</div>
    <div class="qgrid" style="grid-template-columns:repeat(2,1fr)">
      <div class="qcell" style="text-align:left"><div class="qcell-val" style="font-size:13px;color:var(--teal)">Chromatogram</div><div class="qcell-lbl">4 trace channels (A/C/G/T)</div></div>
      <div class="qcell" style="text-align:left"><div class="qcell-val" style="font-size:13px;color:var(--teal)">Base calls</div><div class="qcell-lbl">primary + secondary sequences</div></div>
      <div class="qcell" style="text-align:left"><div class="qcell-val" style="font-size:13px;color:var(--teal)">Quality</div><div class="qcell-lbl">Phred score per base</div></div>
      <div class="qcell" style="text-align:left"><div class="qcell-val" style="font-size:13px;color:var(--teal)">Trim params</div><div class="qcell-lbl">M1/M2 cutoffs + results</div></div>
    </div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(5)">&#8592; Simulator</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(7)">Continue to base calling &#8594;</button>
  </div>
</div>`;

/* ---- STEP 8: BASE CALLING ---- */
PANES[7] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 8 of 14 &middot; R analysis</div>
  <h1 class="step-title">Base calling</h1>
  <p class="step-desc"><b>makeBaseCalls()</b> re-examines the trace and assigns a base at each peak. The <b>primary</b> sequence takes the tallest peak in each window; the <b>secondary</b> sequence records a second base whenever another peak rises above the <code>ratio</code> threshold (default <b>0.33</b> &#8212; 33% of the primary peak height). Where primary and secondary differ, you have a possible heterozygote or mixed template.</p>

  <div class="diagram-card">
    <svg width="100%" viewBox="0 0 680 180" role="img">
      <title>Primary and secondary base calling at a double peak</title>
      <desc>At one position two peaks exceed the ratio threshold, producing a secondary call</desc>
      <line x1="40" y1="130" x2="640" y2="130" stroke="#e2e0d8" stroke-width="1"/>
      <path d="M60 130 Q90 55 120 130" fill="none" stroke="#1d9e75" stroke-width="2"/>
      <path d="M150 130 Q180 70 210 130" fill="none" stroke="#378add" stroke-width="2"/>
      <path d="M240 130 Q270 60 300 130" fill="none" stroke="#e24b4a" stroke-width="2"/>
      <path d="M330 130 Q360 78 390 130" fill="none" stroke="#8f9aa6" stroke-width="2"/>
      <path d="M330 130 Q360 100 390 130" fill="none" stroke="#e24b4a" stroke-width="2" stroke-dasharray="3 3"/>
      <path d="M420 130 Q450 62 480 130" fill="none" stroke="#1d9e75" stroke-width="2"/>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="700" fill="#1d9e75" x="90" y="150" text-anchor="middle">A</text>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="700" fill="#378add" x="180" y="150" text-anchor="middle">C</text>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="700" fill="#e24b4a" x="270" y="150" text-anchor="middle">T</text>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="700" fill="#8f9aa6" x="360" y="150" text-anchor="middle">G/T</text>
      <text font-family="ui-monospace,monospace" font-size="13" font-weight="700" fill="#1d9e75" x="450" y="150" text-anchor="middle">A</text>
      <line x1="360" y1="45" x2="360" y2="95" stroke="#a09d94" stroke-width="0.5" stroke-dasharray="2 2"/>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#a32d2d" x="360" y="40" text-anchor="middle">secondary peak &gt; 33% &#8594; ambiguity</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#a09d94" x="120" y="40" text-anchor="middle">clean single peaks = confident calls</text>
    </svg>
  </div>

  <div class="section-label">Call bases and expose secondary peaks</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_bc1','b_bc1')">sq <- makeBaseCalls(sq, ratio = 0.33)
primarySeq(sq)
secondarySeq(sq)</span></div>
    <button class="run-btn" id="b_bc1" onclick="runTerm('r_bc1','b_bc1')">&#9654; Run</button>
    <div class="term-output" id="r_bc1">  <span class="val">37-letter DNAString object</span>
primary:   <span class="hi">GATTACAGGCTAGCTAGGCTTAAGGCCAATTGGCCAA</span>
secondary: GATTACAGGCTAGCT<span class="warn">R</span>GGCTTAAGGCCAATTGGCCAA

# position 16: primary G, secondary A  ->  R (puRine, A/G)
<span class="hi">1 ambiguous position detected</span></div>
  </div>

  <div class="viz-card">
    <div class="viz-title">IUPAC ambiguity codes for double peaks</div>
    <div class="qgrid">
      <div class="qcell"><div class="qcell-val" style="font-size:15px">R</div><div class="qcell-lbl">A or G</div></div>
      <div class="qcell"><div class="qcell-val" style="font-size:15px">Y</div><div class="qcell-lbl">C or T</div></div>
      <div class="qcell"><div class="qcell-val" style="font-size:15px">S</div><div class="qcell-lbl">G or C</div></div>
      <div class="qcell"><div class="qcell-val" style="font-size:15px">W</div><div class="qcell-lbl">A or T</div></div>
      <div class="qcell"><div class="qcell-val" style="font-size:15px">N</div><div class="qcell-lbl">any base</div></div>
    </div>
    <p class="tip">Lowering <code>ratio</code> flags more secondary peaks (more sensitive, more noise); raising it flags fewer. 0.33 is the tested default.</p>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(6)">&#8592; Load the read</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(8)">Continue to quality &amp; trimming &#8594;</button>
  </div>
</div>`;

/* ---- STEP 9: QUALITY & TRIMMING ---- */
PANES[8] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 9 of 14 &middot; R analysis</div>
  <h1 class="step-title">Quality &amp; trimming</h1>
  <p class="step-desc">Every base carries a <b>Phred quality score</b> (Q) &#8212; Q20 = 1 error in 100, Q30 = 1 in 1000. The noisy start and the broadening tail are low-Q, so they're trimmed before assembly. sangeranalyseR offers two methods: <b>M1</b>, the modified Mott algorithm (default cutoff 0.0001), and <b>M2</b>, a sliding-window trim (default quality 20, window 10). <code>updateQualityParam()</code> re-trims without reloading.</p>

  <div class="diagram-card">
    <svg width="100%" viewBox="0 0 680 180" role="img">
      <title>Quality profile across a read with trim boundaries</title>
      <desc>Phred quality rises from a low noisy start, plateaus high, then falls; trim points mark the kept region</desc>
      <line x1="50" y1="140" x2="640" y2="140" stroke="#e2e0d8" stroke-width="1"/>
      <line x1="50" y1="30" x2="50" y2="140" stroke="#e2e0d8" stroke-width="1"/>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#a09d94" x="30" y="45" text-anchor="middle" transform="rotate(-90,30,90)">Phred Q</text>
      <path d="M50 120 Q90 110 120 60 T220 45 L470 45 Q520 55 560 110 T630 132" fill="none" stroke="#0f6e56" stroke-width="2"/>
      <rect x="50" y="30" width="70" height="110" fill="#fcebeb" opacity="0.5"/>
      <rect x="560" y="30" width="80" height="110" fill="#fcebeb" opacity="0.5"/>
      <rect x="120" y="30" width="440" height="110" fill="#e1f5ee" opacity="0.4"/>
      <line x1="120" y1="30" x2="120" y2="140" stroke="#1d9e75" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="560" y1="30" x2="560" y2="140" stroke="#1d9e75" stroke-width="1" stroke-dasharray="3 3"/>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#a32d2d" x="85" y="160" text-anchor="middle">trim 5&#8242; (noisy)</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#0f6e56" x="340" y="160" text-anchor="middle">high-quality region kept</text>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#a32d2d" x="600" y="160" text-anchor="middle">trim 3&#8242; (broadening)</text>
    </svg>
  </div>

  <div class="section-label">Inspect quality, then re-trim with M2</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_qc1','b_qc1')">sr@QualityReport@rawMeanQualityScore   # before
sr2 <- updateQualityParam(sr, TrimmingMethod = "M2",
          M1TrimmingCutoff = NULL,
          M2CutoffQualityScore = 20, M2SlidingWindowSize = 10)
sr2@QualityReport@trimmedMeanQualityScore   # after</span></div>
    <button class="run-btn" id="b_qc1" onclick="runTerm('r_qc1','b_qc1')">&#9654; Run</button>
    <div class="term-output" id="r_qc1">  raw mean quality:      <span class="warn">42.8</span>
INFO [] Re-trimming read (Method M2, Q20, window 10) &#8230;
  trimmed length:        <span class="val">561 bp  (of 618)</span>
  trim start / end:      <span class="val">21 / 582</span>
  trimmed mean quality:  <span class="hi">54.1</span></div>
  </div>

  <div class="viz-card">
    <div class="viz-title">Before vs after trimming</div>
    <div class="qgrid" style="grid-template-columns:repeat(3,1fr)">
      <div class="qcell"><div class="qcell-val" style="color:var(--amber)">42.8</div><div class="qcell-lbl">raw mean Q</div></div>
      <div class="qcell"><div class="qcell-val" style="color:var(--teal-mid)">54.1</div><div class="qcell-lbl">trimmed mean Q</div></div>
      <div class="qcell"><div class="qcell-val" style="color:var(--teal-mid)">561 bp</div><div class="qcell-lbl">kept (of 618)</div></div>
    </div>
    <p class="tip">M1 (Mott) is the Phred/Phrap default and works well out of the box; M2 gives explicit control via a quality threshold and window, like Trimmomatic.</p>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(7)">&#8592; Base calling</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(9)">Continue to chromatogram &#8594;</button>
  </div>
</div>`;

/* ---- STEP 10: CHROMATOGRAM ---- */
PANES[9] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 10 of 14 &middot; R analysis</div>
  <h1 class="step-title">Chromatogram inspection</h1>
  <p class="step-desc">Before trusting a read, look at it. <b>chromatogram()</b> (sangerseqR) draws the four-channel trace with the calls printed above each peak; <code>showcalls="both"</code> overlays primary and secondary so double peaks jump out. sangeranalyseR adds an interactive <b>chromatogram_plotly()</b> that shows trimmed regions and secondary peaks you can zoom into.</p>

  <div class="pherobox">${pherogramSVG('GATTACAGGCT',150)}</div>
  <div class="legend">
    <span><i style="background:#1d9e75"></i>A</span><span><i style="background:#378add"></i>C</span>
    <span><i style="background:#8f9aa6"></i>G</span><span><i style="background:#e24b4a"></i>T</span>
    <span style="margin-left:auto;color:var(--muted)">this is what chromatogram() renders, per row of ~100 bases</span>
  </div>

  <div class="section-label">Plot the trace</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_ch1','b_ch1')">chromatogram(sq, width = 100, height = 2, trim5 = 20,
             showcalls = "both", filename = "trace.pdf")</span></div>
    <button class="run-btn" id="b_ch1" onclick="runTerm('r_ch1','b_ch1')">&#9654; Run</button>
    <div class="term-output" id="r_ch1">Rendering chromatogram &#8230;
  bases per row:   <span class="val">100</span>
  rows:            <span class="val">6</span>
  trimmed region:  shaded grey
<span class="hi">Written to trace.pdf</span></div>
  </div>

  <div class="section-label">Interactive version (sangeranalyseR)</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_ch2','b_ch2')">chromatogram_plotly(sr, max_points = 8000, showtrim = TRUE)</span></div>
    <button class="run-btn" id="b_ch2" onclick="runTerm('r_ch2','b_ch2')">&#9654; Run</button>
    <div class="term-output" id="r_ch2">Building interactive WebGL chromatogram &#8230;
  points plotted:  <span class="val">8000</span>
  trimmed bases:   shown in grey overlay
  secondary peaks: annotated above threshold
<span class="hi">Opens in Viewer pane / browser</span></div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(8)">&#8592; Quality &amp; trimming</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(10)">Continue to contig assembly &#8594;</button>
  </div>
</div>`;

/* ---- STEP 11: CONTIG ASSEMBLY ---- */
PANES[10] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 11 of 14 &middot; R analysis</div>
  <h1 class="step-title">Contig assembly</h1>
  <p class="step-desc">A specimen is usually sequenced from both ends &#8212; a <b>forward</b> and a <b>reverse</b> read that overlap in the middle. <b>SangerContig</b> reverse-complements the reverse read, aligns the pair with DECIPHER's <code>ConsensusSequence()</code>, and produces one <b>consensus</b> that's more accurate than either read alone (each covers the other's weak end).</p>

  <div class="diagram-card">
    <svg width="100%" viewBox="0 0 680 160" role="img">
      <title>Forward and reverse reads merged into a consensus contig</title>
      <desc>Overlapping forward and reverse reads combine into a single consensus sequence</desc>
      <rect x="40" y="45" width="380" height="18" rx="4" fill="#1d9e75" opacity="0.8"/>
      <text font-family="system-ui,sans-serif" font-size="11" fill="#fff" x="230" y="54" text-anchor="middle" dominant-baseline="central">forward read (5&#8242; strong, 3&#8242; weak)</text>
      <rect x="260" y="72" width="380" height="18" rx="4" fill="#378add" opacity="0.8"/>
      <text font-family="system-ui,sans-serif" font-size="11" fill="#fff" x="450" y="81" text-anchor="middle" dominant-baseline="central">reverse read (rev-comp)</text>
      <rect x="40" y="105" width="600" height="18" rx="4" fill="#0f6e56"/>
      <text font-family="system-ui,sans-serif" font-size="11" fill="#fff" x="340" y="114" text-anchor="middle" dominant-baseline="central">consensus contig &#8212; full length, high confidence</text>
      <rect x="260" y="40" width="160" height="88" fill="#faeeda" opacity="0.35"/>
      <text font-family="system-ui,sans-serif" font-size="10" fill="#854f0b" x="340" y="34" text-anchor="middle">overlap region</text>
    </svg>
  </div>

  <div class="section-label">Assemble a contig from an F/R pair</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_ct1','b_ct1')">ctg <- SangerContig(inputSource = "ABIF", processMethod = "REGEX",
        ABIF_Directory = "example_data",
        contigName = "specimen01",
        REGEX_SuffixForward = "_[0-9]*_F.ab1$",
        REGEX_SuffixReverse = "_[0-9]*_R.ab1$")
ctg@contigSeq</span></div>
    <button class="run-btn" id="b_ct1" onclick="runTerm('r_ct1','b_ct1')">&#9654; Run</button>
    <div class="term-output" id="r_ct1">INFO [] -------- Creating 'SangerContig' instance --------
INFO [] Forward reads: <span class="val">1</span>   Reverse reads: <span class="val">1</span>
INFO [] Aligning reads (DECIPHER ConsensusSequence) &#8230;
INFO [] Building consensus &#8230;

  <span class="val">consensus length: 623 bp</span>
  <span class="hi">ATGCGTACGTTAGCCTGACGTTAGCATTACGGATCCAGTTCAAGGCT&#8230;</span></div>
  </div>

  <div class="viz-card">
    <div class="viz-title">What a SangerContig stores</div>
    <div style="font-size:12.5px;color:var(--muted);display:flex;flex-direction:column;gap:5px">
      <div>&#10022; The <b style="color:var(--ink)">consensus</b> sequence from forward + reverse reads</div>
      <div>&#10022; The <b style="color:var(--ink)">alignment</b> of the reads (DECIPHER)</div>
      <div>&#10022; A <b style="color:var(--ink)">dendrogram</b> of read similarity</div>
      <div>&#10022; A frame of <b style="color:var(--ink)">indels &amp; stop codons</b> (if an AA reference is given)</div>
    </div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(9)">&#8592; Chromatogram</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(11)">Continue to alignment &#8594;</button>
  </div>
</div>`;

/* ---- STEP 12: ALIGNMENT ---- */
PANES[11] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 12 of 14 &middot; R analysis</div>
  <h1 class="step-title">Multi-contig alignment</h1>
  <p class="step-desc">With many specimens, <b>SangerAlignment</b> sits at the top of the hierarchy: it builds a contig for every F/R pair in a folder, then aligns all the consensus sequences together and estimates a quick phylogenetic tree. Reads are grouped automatically by a filename <b>regex</b>, so consistent naming (<code>_1_F.ab1</code> / <code>_2_R.ab1</code>) is what makes it hands-off.</p>

  <div class="diagram-card">
    <svg width="100%" viewBox="0 0 680 175" role="img">
      <title>Multiple contigs aligned under a SangerAlignment</title>
      <desc>A folder of ab1 files becomes several contigs, aligned together at the top level</desc>
      <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
      <rect x="30" y="65" width="120" height="46" rx="8" fill="#f0efe9" stroke="#a09d94" stroke-width="0.5"/>
      <text font-family="ui-monospace,monospace" font-size="11" font-weight="600" fill="#1a1a18" x="90" y="83" text-anchor="middle" dominant-baseline="central">8 .ab1 files</text>
      <text font-family="system-ui,sans-serif" font-size="9" fill="#6b6860" x="90" y="98" text-anchor="middle" dominant-baseline="central">folder + regex</text>
      <line x1="150" y1="88" x2="185" y2="88" stroke="#0f6e56" stroke-width="1" marker-end="url(#a)"/>
      <rect x="190" y="45" width="120" height="20" rx="4" fill="#1d9e75" opacity="0.85"/><text font-family="system-ui,sans-serif" font-size="9" fill="#fff" x="250" y="55" text-anchor="middle" dominant-baseline="central">contig 1</text>
      <rect x="190" y="70" width="120" height="20" rx="4" fill="#1d9e75" opacity="0.7"/><text font-family="system-ui,sans-serif" font-size="9" fill="#fff" x="250" y="80" text-anchor="middle" dominant-baseline="central">contig 2</text>
      <rect x="190" y="95" width="120" height="20" rx="4" fill="#1d9e75" opacity="0.55"/><text font-family="system-ui,sans-serif" font-size="9" fill="#085041" x="250" y="105" text-anchor="middle" dominant-baseline="central">contig 3</text>
      <line x1="310" y1="80" x2="345" y2="80" stroke="#185fa5" stroke-width="1" marker-end="url(#a)"/>
      <rect x="350" y="55" width="150" height="50" rx="8" fill="#e6f1fb" stroke="#185fa5" stroke-width="0.5"/>
      <text font-family="ui-monospace,monospace" font-size="12" font-weight="600" fill="#042c53" x="425" y="74" text-anchor="middle" dominant-baseline="central">alignment</text>
      <text font-family="system-ui,sans-serif" font-size="9" fill="#185fa5" x="425" y="90" text-anchor="middle" dominant-baseline="central">all consensuses</text>
      <line x1="500" y1="80" x2="535" y2="80" stroke="#534ab7" stroke-width="1" marker-end="url(#a)"/>
      <rect x="540" y="60" width="110" height="40" rx="8" fill="#eeedfe" stroke="#534ab7" stroke-width="0.5"/>
      <text font-family="system-ui,sans-serif" font-size="11" font-weight="600" fill="#3c3489" x="595" y="80" text-anchor="middle" dominant-baseline="central">tree (QC)</text>
    </svg>
  </div>

  <div class="section-label">Build a full alignment from a folder</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_al1','b_al1')">ab1_dir <- system.file("extdata", "Allolobophora_chlorotica", "ACHLO",
                        package = "sangeranalyseR")
sa <- SangerAlignment(inputSource = "ABIF", processMethod = "REGEX",
        ABIF_Directory = ab1_dir,
        REGEX_SuffixForward = "_[0-9]*_F.ab1$",
        REGEX_SuffixReverse = "_[0-9]*_R.ab1$",
        TrimmingMethod = "M1", M1TrimmingCutoff = 0.0001)
length(sa@contigList)</span></div>
    <button class="run-btn" id="b_al1" onclick="runTerm('r_al1','b_al1')">&#9654; Run</button>
    <div class="term-output" id="r_al1">INFO [] -------- Creating 'SangerAlignment' instance --------
INFO [] Grouping reads by regex &#8230; 4 contigs matched
INFO [] Building each contig (8 reads) &#8230;
INFO [] Aligning contigs (DECIPHER AlignSeqs) &#8230;
INFO [] Estimating neighbour-joining tree &#8230;

sa@objectResults@creationResult   # <span class="hi">TRUE</span>
length(sa@contigList)             # <span class="val">4</span></div>
  </div>

  <div class="section-label">Reach into a single read inside the alignment</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_al2','b_al2')">sr <- sa@contigList[[1]]@forwardReadList[[1]]
sr@primarySeqID</span></div>
    <button class="run-btn" id="b_al2" onclick="runTerm('r_al2','b_al2')">&#9654; Run</button>
    <div class="term-output" id="r_al2">  [1] <span class="val">"Achl_ACHLO006-09_1_F"</span>
# the class hierarchy: alignment -> contig -> read, all reachable by @slots</div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(10)">&#8592; Contig assembly</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(12)">Continue to report &amp; export &#8594;</button>
  </div>
</div>`;

/* ---- STEP 13: REPORT & EXPORT ---- */
PANES[12] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 13 of 14 &middot; R analysis</div>
  <h1 class="step-title">Report &amp; export</h1>
  <p class="step-desc">Two final moves at any level (read, contig, alignment): <b>writeFasta()</b> saves the trimmed/consensus sequences for downstream tools, and <b>generateReport()</b> knits a static HTML report with the trace, quality, trimming and alignment all in one shareable page. For tuning trimming by eye, <b>launchApp()</b> opens an interactive Shiny dashboard.</p>

  <div class="section-label">Export sequences to FASTA</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_ex1','b_ex1')">writeFasta(sa, outputDir = getwd())</span></div>
    <button class="run-btn" id="b_ex1" onclick="runTerm('r_ex1','b_ex1')">&#9654; Run</button>
    <div class="term-output" id="r_ex1">INFO [] Writing FASTA (via Biostrings writeXStringSet) &#8230;
  <span class="val">Achl_contig1.fa</span>
  <span class="val">Achl_contig2.fa</span>
  <span class="val">Achl_contig3.fa</span>
  <span class="val">Achl_contig4.fa</span>
  <span class="val">Sanger_all_trimmed.fa</span>
<span class="hi">5 FASTA files written to working directory.</span></div>
  </div>

  <div class="section-label">Generate a shareable HTML report</div>
  <div class="terminal">
    <div class="term-bar">${termDots()}</div>
    <div class="term-prompt"><span class="cmd" onclick="runTerm('r_ex2','b_ex2')">generateReport(sa, outputDir = getwd())</span></div>
    <button class="run-btn" id="b_ex2" onclick="runTerm('r_ex2','b_ex2')">&#9654; Run</button>
    <div class="term-output" id="r_ex2">INFO [] Knitting Rmd report (requires pandoc) &#8230;
  sections: Basic Information &middot; Input Parameters
            &middot; Alignment &middot; Contigs &middot; per-read traces
<span class="hi">SangerAlignment_Report.html written.</span>  Open it in any browser.</div>
  </div>

  <div class="viz-card">
    <div class="viz-title">Interactive tuning (optional)</div>
    <div style="font-size:12.5px;color:var(--muted)"><code>launchApp(sa)</code> opens a Shiny dashboard with M1/M2 trimming sliders and a live trace preview; <code>globalTrimApp(sa)</code> applies one trim setting across every read at once. Both return the re-trimmed object when you click <b>Done</b>.</div>
  </div>

  <div class="card">
    <div class="card-title">The full pipeline, one script</div>
    <div class="card-desc">Everything in steps 7&#8211;13 runs end-to-end on the bundled real data. Download and run it:</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <a class="dl" href="example_data/sanger_example.R" download>sanger_example.R &#8595;</a>
      <a class="dl" href="example_data/make_ab1.py" download>make_ab1.py &#8595;</a>
    </div>
  </div>

  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(11)">&#8592; Alignment</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-primary" onclick="goTo(13)">Finish: take the quiz &#8594;</button>
  </div>
</div>`;
PANES[13] = `
<div class="step-inner">
  <div class="step-eyebrow">Step 14 of 14</div>
  <h1 class="step-title">Check your understanding</h1>
  <p class="step-desc">Ten questions across the whole pipeline &#8212; concept and R analysis. Pick an answer for instant feedback; your score builds as you go.</p>
  <div id="quizHost"></div>
  <div class="dash-grid" id="quizDash" style="display:none">
    <div class="dash-cell"><div class="dash-val" id="scoreVal">0 / 10</div><div class="dash-lbl">score</div></div>
    <div class="dash-cell"><div class="dash-val" id="scorePct">0%</div><div class="dash-lbl">correct</div></div>
    <div class="dash-cell"><div class="dash-val" style="font-size:15px" id="scoreMsg">&#8212;</div><div class="dash-lbl">verdict</div></div>
  </div>
  <div class="step-nav">
    <button class="btn btn-secondary" onclick="goTo(12)">&#8592; Report &amp; export</button>
    <div class="nav-spacer"></div>
    <button class="btn btn-secondary" onclick="goTo(0)">Start over</button>
  </div>
</div>`;

/* ============================================================
   ROUTER
   ============================================================ */
function renderStage(){
  const stage=document.getElementById('stage');
  stage.innerHTML=PANES.map((p,i)=>'<div class="step-pane'+(i===currentStep?' active':'')+'" id="pane-'+i+'">'+p+'</div>').join('');
}
function goTo(n){
  if(n>unlockedUpTo) unlockedUpTo=n;      // unlock as you advance
  currentStep=n;
  renderStage();
  document.querySelectorAll('.rail-step').forEach((el,i)=>{
    el.classList.remove('active','done','locked');
    if(i===n) el.classList.add('active');
    else if(i<=unlockedUpTo) el.classList.add('done');
    else el.classList.add('locked');
  });
  const stage=document.getElementById('stage'); if(stage) stage.scrollTop=0;
  // init per-step widgets
  if(n===1) setChem('d');
  if(n===2) rxInit();
  if(n===3) ladderInit();
  if(n===5) simRender();
  if(n===13) buildQuiz();
}
function railClick(n){ if(n<=unlockedUpTo) goTo(n); }

/* ---------- terminal reveal ---------- */
function runTerm(outId,btnId){
  const out=document.getElementById(outId),btn=document.getElementById(btnId);
  if(!out||!btn||out.classList.contains('visible'))return;
  btn.textContent='\u23F3 Running\u2026'; btn.classList.add('running'); btn.disabled=true;
  setTimeout(()=>{ out.classList.add('visible'); btn.textContent='\u2713 Done'; btn.classList.remove('running'); },800+Math.random()*500);
}

/* ---------- STEP 2 chemistry ---------- */
function setChem(kind){
  const dd=kind==='dd', oh=dd?'H':'OH', color=dd?'#e24b4a':'#1d9e75';
  document.getElementById('chemDiagram').innerHTML=
   '<svg width="100%" viewBox="0 0 360 170"><polygon points="130,28 205,28 232,90 205,152 130,152 103,90" fill="#f0efe9" stroke="#ccc9be" stroke-width="1"/>'+
   '<text x="167" y="82" text-anchor="middle" font-family="ui-monospace,monospace" font-size="14" fill="#1a1a18">sugar</text>'+
   '<text x="167" y="100" text-anchor="middle" font-family="system-ui" font-size="10" fill="#6b6860">(deoxyribose)</text>'+
   '<circle cx="66" cy="56" r="15" fill="#378add"/><text x="66" y="60" text-anchor="middle" fill="#fff" font-size="11" font-family="system-ui">5\u2032-P</text>'+
   '<line x1="80" y1="58" x2="102" y2="66" stroke="#a09d94" stroke-width="2"/>'+
   '<text x="255" y="50" text-anchor="middle" font-size="11" font-family="system-ui" fill="#6b6860">base</text>'+
   '<line x1="207" y1="56" x2="236" y2="52" stroke="#a09d94" stroke-width="2"/>'+
   '<circle cx="205" cy="142" r="21" fill="'+color+'"/><text x="205" y="142" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="14" font-family="ui-monospace,monospace" font-weight="700">3\u2032-'+oh+'</text>'+
   '<text x="205" y="172" text-anchor="middle" font-size="10" font-family="system-ui" fill="'+color+'">'+(dd?'no hook \u2014 chain stops':'hook for next base')+'</text></svg>';
  document.getElementById('chemNote').innerHTML=dd
    ? '<b>ddNTP.</b> The 3\u2032 position is just hydrogen. Polymerase can still add it, but no further nucleotide can attach \u2014 the chain is permanently terminated.'
    : '<b>dNTP.</b> The 3\u2032-OH lets the next incoming nucleotide bond, so the chain keeps growing normally.';
  document.getElementById('tg-d').classList.toggle('on',!dd);
  document.getElementById('tg-dd').classList.toggle('on',dd);
}

/* ---------- STEP 3 reaction ---------- */
const RX_TEMPLATE='TACGGATC'; let rxMade=[];
const CMP={A:'T',T:'A',G:'C',C:'G'};
function rxInit(){rxMade=[];document.getElementById('rxTemplate').innerHTML=chip(RX_TEMPLATE);renderFrags();}
function rxStep(){
  const comp=RX_TEMPLATE.split('').map(b=>CMP[b]);
  const stopAt=Math.floor(Math.random()*comp.length)+1;
  rxMade.push(comp.slice(0,stopAt));
  renderFrags();
}
function rxReset(){rxMade=[];renderFrags();}
function renderFrags(){
  const uniq=[...new Set(rxMade.map(f=>f.length))].sort((a,b)=>a-b);
  document.getElementById('rxCount').textContent=rxMade.length+' fragments \u00b7 '+uniq.length+'/'+RX_TEMPLATE.length+' lengths';
  const shown=[...rxMade].sort((a,b)=>a.length-b.length).slice(-9);
  let html=shown.length?shown.map(f=>{
    const term=f[f.length-1];
    return '<div>'+f.map((b,i)=>i===f.length-1
      ?'<span class="base b-'+b+'">'+b+'\u2605</span>'
      :'<span style="color:#8fa0ad">'+b+'</span>').join('')+'<span style="color:#59656f;margin-left:8px">len '+f.length+'</span></div>';
  }).join(''):'<span style="color:#59656f">No fragments yet &#8212; run a cycle.</span>';
  if(uniq.length===RX_TEMPLATE.length) html+='<div style="color:#46b98a;margin-top:6px">\u2713 Full ladder collected \u2014 every position represented!</div>';
  document.getElementById('rxFrags').innerHTML=html;
}

/* ---------- STEP 4 capillary ---------- */
const LADDER_SEQ='ATGCGT';
function ladderInit(){const el=document.getElementById('ladderAnim');if(el)el.innerHTML='Press run to load the capillary\u2026';}
function runLadder(){
  const host=document.getElementById('ladderAnim');host.innerHTML='';let i=0;
  const comp=LADDER_SEQ.split('');
  const timer=setInterval(()=>{
    if(i>=comp.length){clearInterval(timer);
      host.innerHTML+='<div style="margin-top:8px;color:#ba7517">read 5\u2032\u21923\u2032: '+comp.map(b=>'<span class="base b-'+b+'">'+b+'</span>').join('')+'</div>';return;}
    const row=document.createElement('div');row.style.opacity=0;row.style.transition='opacity .35s';
    row.innerHTML='<span style="color:#59656f">len '+(i+1)+': </span>'+comp.slice(0,i+1).map((b,j)=>j===i?'<span class="base b-'+b+'">'+b+'</span>':'<span style="color:#6f7d89">'+b+'</span>').join('');
    host.appendChild(row);requestAnimationFrame(()=>row.style.opacity=1);i++;
  },400);
}

/* ---------- STEP 6 simulator ---------- */
function simSet(s){document.getElementById('simIn').value=s;simRender();}
function simRandom(){let s='',b='ACGT';const n=8+Math.floor(Math.random()*6);for(let i=0;i<n;i++)s+=b[Math.floor(Math.random()*4)];document.getElementById('simIn').value=s;simRender();}
function simRender(){
  const raw=document.getElementById('simIn').value.toUpperCase().replace(/\s/g,'');
  document.getElementById('simIn').value=raw;
  const err=document.getElementById('simErr');
  if(!raw){err.textContent='Enter a sequence to begin.';simClear();return;}
  if(!/^[ACGT]+$/.test(raw)){err.textContent='Only A, C, G and T are allowed.';simClear();return;}
  err.textContent='';
  document.getElementById('simLadder').innerHTML=raw.split('').map((b,i)=>{
    const frag=raw.slice(0,i+1).split('');
    return '<div><span style="color:#59656f">'+String(i+1).padStart(2)+': </span>'+
      frag.map((x,j)=>j===i?'<span class="base b-'+x+'">'+x+'</span>':'<span style="color:#6f7d89">'+x+'</span>').join('')+'</div>';
  }).join('');
  document.getElementById('simPhero').innerHTML=pherogramSVG(raw,150);
  document.getElementById('simCall').innerHTML='Base call 5\u2032\u21923\u2032: '+chip(raw);
}
function simClear(){['simLadder','simPhero','simCall'].forEach(id=>{const e=document.getElementById(id);if(e)e.innerHTML='';});}

/* ---------- STEP 8 quiz ---------- */
const QUIZ=[
 {q:"What structural feature of a ddNTP causes chain termination?",o:["An extra phosphate","It lacks the 3\u2032-OH group","Its fluorescent dye","It can't base-pair"],a:1,fb:"With no 3\u2032-OH, the next nucleotide has nothing to bond to."},
 {q:"Why does the reaction produce fragments of many lengths?",o:["Enzymes cut the template","ddNTPs incorporate at random positions","The primer binds many sites","Polymerase errors"],a:1,fb:"A terminator lands at a different position in each strand."},
 {q:"In the capillary, which fragments reach the detector first?",o:["The longest","The shortest","The brightest","Those ending in G"],a:1,fb:"Shorter DNA migrates faster, so it exits first."},
 {q:"What does each peak's colour tell you?",o:["Fragment length","The terminal base identity","DNA quantity","Run temperature"],a:1,fb:"Each dye-labelled ddNTP fluoresces a specific colour."},
 {q:"How many primers does a standard Sanger reaction use?",o:["One","Two","Four","None"],a:0,fb:"One primer means linear copying, unlike PCR."},
 {q:"In sangeranalyseR, which S4 class is a single .ab1 read?",o:["SangerContig","SangerRead","SangerAlignment","sangerseq"],a:1,fb:"SangerRead is one ABIF file; contigs/alignments combine reads."},
 {q:"Why do trimming and chromatogram plotting fail on FASTA input?",o:["FASTA is too large","FASTA lacks raw trace/quality data","FASTA can't store bases","R can't parse FASTA"],a:1,fb:"FASTA holds only called bases, so raw-trace features need .ab1."},
 {q:"What does makeBaseCalls(ratio = 0.33) do with the ratio value?",o:["Sets the trim length","Flags a secondary peak above 33% of the primary","Discards reads below 33% quality","Scales the chromatogram"],a:1,fb:"A second base is called where another peak exceeds 33% of the primary peak height."},
 {q:"Which trimming method uses a sliding window with a quality cutoff?",o:["M1 (modified Mott)","M2","Both","Neither"],a:1,fb:"M2 uses M2CutoffQualityScore (default 20) over M2SlidingWindowSize (default 10)."},
 {q:"What does SangerContig combine into a consensus?",o:["Many .ab1 files from a plate","A forward and reverse read of one specimen","Two different genes","Primary and secondary base calls"],a:1,fb:"A contig merges the overlapping forward + reverse reads into one consensus."},
];
let quizAns=[];
function buildQuiz(){
  quizAns=Array(QUIZ.length).fill(null);
  document.getElementById('quizHost').innerHTML=QUIZ.map((it,qi)=>
    '<div class="card"><div class="card-title">'+(qi+1)+'. '+it.q+'</div>'+
    it.o.map((o,oi)=>'<button class="opt" id="q'+qi+'o'+oi+'" onclick="answer('+qi+','+oi+')">'+o+'</button>').join('')+
    '<div class="qfb" id="fb'+qi+'"></div></div>').join('');
  document.getElementById('quizDash').style.display='none';
}
function answer(qi,oi){
  if(quizAns[qi]!==null)return;
  quizAns[qi]=oi; const c=QUIZ[qi].a;
  document.getElementById('q'+qi+'o'+c).classList.add('correct');
  if(oi!==c)document.getElementById('q'+qi+'o'+oi).classList.add('wrong');
  document.getElementById('fb'+qi).textContent=(oi===c?'\u2713 ':'\u2717 ')+QUIZ[qi].fb;
  QUIZ[qi].o.forEach((_,x)=>document.getElementById('q'+qi+'o'+x).style.pointerEvents='none');
  if(quizAns.every(a=>a!==null))showScore();
}
function showScore(){
  const s=quizAns.reduce((t,a,i)=>t+(a===QUIZ[i].a?1:0),0);
  const dash=document.getElementById('quizDash');dash.style.display='grid';
  document.getElementById('scoreVal').textContent=s+' / '+QUIZ.length;
  document.getElementById('scorePct').textContent=Math.round(s/QUIZ.length*100)+'%';
  document.getElementById('scoreMsg').textContent=s===QUIZ.length?'Perfect':s>=Math.ceil(QUIZ.length*0.6)?'Solid grasp':'Review lessons';
  dash.scrollIntoView({behavior:'smooth'});
}

/* ---------- boot ---------- */
renderStage(); goTo(0);
