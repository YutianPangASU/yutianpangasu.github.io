/* Learning route: LLM training and world models.
   Interactive study map for /blog/learning-route-llm-world-models/.
   Plain ES5 in one IIFE; the page markup lives in _posts/2026-11-24-learning-route-llm-world-models.html
   and the styles in assets/css/llm-guide.css (every selector scoped under #guide). */
(function(){
"use strict";
if(!document.getElementById("guide")){return;}
var NS="http://www.w3.org/2000/svg";
var RM=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function S(tag,attrs,parent){var e=document.createElementNS(NS,tag);if(attrs){for(var k in attrs){e.setAttribute(k,attrs[k]);}}if(parent){parent.appendChild(e);}return e;}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function A(t,u){return '<a href="'+u+'" target="_blank" rel="noopener">'+t+'</a>';}
function clock(){var ids=[];return{
  int:function(ms,fn){var id=setInterval(fn,ms);ids.push(["i",id]);return id;},
  out:function(ms,fn){var id=setTimeout(fn,ms);ids.push(["t",id]);return id;},
  clear:function(){ids.forEach(function(p){if(p[0]==="i"){clearInterval(p[1]);}else{clearTimeout(p[1]);}});ids=[];}
};}
var SUPM={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"};
function sup(n){return String(n).split("").map(function(c){return SUPM[c]||c;}).join("");}
function sci(x){var s=x.toExponential(1).split("e");return s[0]+"×10"+sup(parseInt(s[1],10));}
function fmtGB(x){return x<10?x.toFixed(1):Math.round(x).toLocaleString("en-US");}
function fmtN(n){return n>=1e12?(n/1e12).toFixed(1)+"T":(n>=1e9?(n/1e9).toFixed(n<1e10?1:0)+"B":(n/1e6).toFixed(0)+"M");}
function setPressed(group,attr,val){$$("button",group).forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute(attr)===String(val)));});}
function segBtns(id,label,items,cur){return '<div class="seg" id="'+id+'" role="group" aria-label="'+label+'">'+items.map(function(it){return '<button type="button" data-v="'+it[0]+'" aria-pressed="'+(String(it[0])===String(cur))+'">'+it[1]+'</button>';}).join("")+'</div>';}
function onSeg(el,fn){el.addEventListener("click",function(e){var b=e.target.closest("button");if(!b){return;}setPressed(el,"data-v",b.getAttribute("data-v"));fn(b.getAttribute("data-v"));});}
function mkSvg(parent,W,H,label){return S("svg",{viewBox:"0 0 "+W+" "+H,"class":"sv",role:"img","aria-label":label},parent);}
function txt(svg,x,y,s,cls,anchor){var t=S("text",{x:x,y:y,"class":cls||"axt"},svg);if(anchor){t.setAttribute("text-anchor",anchor);}t.textContent=s;return t;}
function ln(svg,x1,y1,x2,y2,cls){return S("line",{x1:x1,y1:y1,x2:x2,y2:y2,"class":cls},svg);}
function pathOf(f,x0,x1,n,X,Y){var d="";for(var i=0;i<=n;i++){var x=x0+(x1-x0)*i/n;d+=(i?"L":"M")+X(x).toFixed(1)+" "+Y(f(x)).toFixed(1);}return d;}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function drawIn(paths,c,after){
  if(RM){return;}
  paths.forEach(function(p){var len=p.getTotalLength();p.style.transition="none";p.style.strokeDasharray=len;p.style.strokeDashoffset=len;});
  if(paths.length){void paths[0].getBoundingClientRect();}
  paths.forEach(function(p,k){p.style.transition="stroke-dashoffset 1.5s ease "+(k*0.25)+"s";p.style.strokeDashoffset="0";});
  if(after){c.out(1700+paths.length*250,after);}
}

var U={
  conv1:"https://rlhfbook.com/teach/course/conversation-01/",rlhfbook:"https://rlhfbook.com",rlhfcourse:"https://rlhfbook.com/course",
  jiaxin:"https://jxzhangjhu.github.io/blog/2026/how-frontier-labs-train-llms/",ic:"https://www.interconnects.ai",
  tulu3:"https://arxiv.org/abs/2411.15124",olmo3:"https://arxiv.org/abs/2512.13961",olmo2:"https://arxiv.org/abs/2501.00656",r1:"https://arxiv.org/abs/2501.12948",mimo:"https://arxiv.org/abs/2601.02780",
  cs336:"https://cs336.stanford.edu",nanochat:"https://github.com/karpathy/nanochat",karpathy:"https://www.youtube.com/@AndrejKarpathy",
  ultra:"https://huggingface.co/spaces/nanotron/ultrascale-playbook",smol:"https://huggingface.co/spaces/HuggingFaceTB/smol-training-playbook",
  llama3:"https://arxiv.org/abs/2407.21783",qwen3:"https://arxiv.org/abs/2505.09388",marin:"https://opensource.googleblog.com/2025/12/training-marin-32b-what-an-open-lab-can-build-with-tpus-jax-and-a-little-persistence.html",
  fineweb:"https://arxiv.org/abs/2406.17557",fineweb2:"https://arxiv.org/abs/2506.20920",dclm:"https://arxiv.org/abs/2406.11794",datatrove:"https://github.com/huggingface/datatrove",
  raschka:"https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison",gallery:"https://sebastianraschka.com/blog/2026/llm-architecture-gallery.html",
  dsv3:"https://arxiv.org/abs/2412.19437",nemo3u:"https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf",kimik2:"https://arxiv.org/abs/2507.20534",
  chinchilla:"https://arxiv.org/abs/2203.15556",kaplan:"https://arxiv.org/abs/2001.08361",mup:"https://arxiv.org/abs/2203.03466",minicpm:"https://arxiv.org/abs/2404.06395",yarn:"https://arxiv.org/abs/2309.00071",
  spurious:"https://arxiv.org/abs/2506.10947",yue:"https://arxiv.org/abs/2504.13837",prorl:"https://arxiv.org/abs/2505.24864",
  oi:"https://github.com/allenai/open-instruct",lighteval:"https://github.com/huggingface/lighteval",lmeval:"https://github.com/EleutherAI/lm-evaluation-harness",evalguide:"https://github.com/huggingface/evaluation-guidebook",
  gao:"https://arxiv.org/abs/2210.10760",weng:"https://lilianweng.github.io/posts/2024-11-28-reward-hacking/",dpo:"https://arxiv.org/abs/2305.18290",
  spinup:"https://spinningup.openai.com",kl:"http://joschu.net/blog/kl-approx.html",dsmath:"https://arxiv.org/abs/2402.03300",dapo:"https://arxiv.org/abs/2503.14476",drgrpo:"https://arxiv.org/abs/2503.20783",gspo:"https://arxiv.org/abs/2507.18071",
  verl:"https://github.com/volcengine/verl",nemorl:"https://docs.nvidia.com/nemo/rl/0.5.0/guides/grpo.html",trllog:"https://huggingface.co/docs/trl/main/en/logging",
  mismatch:"https://neurips.cc/virtual/2025/126728",nondet:"https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/",
  oaijd:"https://openai.com/careers/research-engineer-frontier-evals-and-environments-san-francisco/",verifiers:"https://github.com/PrimeIntellect-ai/verifiers",
  onetoken:"https://arxiv.org/abs/2507.08794",testsuite:"https://github.com/taoyds/test-suite-sql-eval",bird:"https://bird-bench.github.io",
  opd:"https://thinkingmachines.ai/blog/on-policy-distillation/",tinker:"https://github.com/thinking-machines-lab/tinker-cookbook",lora:"https://thinkingmachines.ai/blog/lora/",
  razor:"https://arxiv.org/abs/2509.04259",gkd:"https://arxiv.org/abs/2306.13649",
  scalebook:"https://jax-ml.github.io/scaling-book",brrr:"https://horace.io/brrr_intro.html",gpumode:"https://github.com/gpu-mode/lectures",flash:"https://arxiv.org/abs/2205.14135",
  zero:"https://arxiv.org/abs/1910.02054",titan:"https://github.com/pytorch/torchtitan",megatron:"https://github.com/NVIDIA/Megatron-LM",
  vllm:"https://arxiv.org/abs/2309.06180",sglang:"https://arxiv.org/abs/2312.07104",disagg:"https://arxiv.org/abs/2506.05508",
  asyncrl:"https://huggingface.co/blog/async-rl-training-landscape",slime:"https://github.com/THUDM/slime",r3:"https://arxiv.org/abs/2510.11370",april:"https://arxiv.org/abs/2509.18521",glm45:"https://arxiv.org/abs/2508.06471",
  stas:"https://github.com/stas00/ml-engineering"
};
var NODES=[];
NODES.push(
{id:"m1",code:"M1",track:"m",region:"Overview",short:"Big picture",title:"The big picture: a model from data to deployment",depth:"Understand the principles",
 goal:"Draw the full training pipeline: data → tokenizer → pretraining → mid-training → SFT → preferences and RL → distillation → evaluation → deployment. For each stage, name its inputs, outputs, rough scale and main risks, and the infra it depends on.",
 boss:"Missing the forest for the trees: knowing one stage but not how upstream and downstream constrain each other",loot:"A full pipeline diagram with inputs, outputs, scale and risks for each stage",adv:"",d:"lifecycle",
 cap:"Cycles through the stages automatically; click any stage to see it. “Go to this stage” jumps to the matching stage.",
 find:["Start with "+A("Karpathy",U.karpathy)+"'s “Deep Dive into LLMs like ChatGPT” for the big picture, then use "+A("nanochat",U.nanochat)+" to run tokenizer → pretraining → SFT → RL → evaluation end to end in a single repo.",
  A("Stanford CS336",U.cs336)+"'s 2026 syllabus is itself a map of the full pipeline: tokenization → architecture → GPUs and kernels → parallelism → scaling laws → inference → evaluation → data → SFT/RLHF → RLVR.",
  "Hugging Face's "+A("Smol Training Playbook",U.smol)+": a complete record of one real model (SmolLM3), from planning, ablations, architecture and data through the training marathon, post-training and infra.",
  "Write-ups of open models are more useful than closed reports because they include the failures: "+A("OLMo 2",U.olmo2)+", "+A("Marin 32B",U.marin)+"."],
 ex:["Read the "+A("Llama 3 tech report",U.llama3)+" and map each chapter onto the pipeline on this page. Mark which early decisions have to be “paid back” in later stages.",
  "Follow a real training run through Marin 32B's public log: how the loss spikes appeared; how gradient clipping, skipping steps, rebuilding optimizer state and switching to Muon all failed; and how moving to an architecture with QK-Norm finally fixed it."],
 quiz:["Which pretraining data decisions cap what post-training can reach?","Why does inference cost change the pretraining tradeoff between parameter count and token count?","When an RL run slows down, where in the pipeline could the bottleneck be?"],
 src:[["Stanford CS336 (2026)",U.cs336],["karpathy/nanochat",U.nanochat],["Andrej Karpathy's YouTube channel",U.karpathy],["Smol Training Playbook",U.smol],["The Llama 3 Herd of Models",U.llama3],["Training Marin 32B",U.marin],["OLMo 2",U.olmo2]]},

{id:"m2",code:"M2",track:"m",region:"Pretraining",short:"Pretraining data",title:"Pretraining data",depth:"Understand it; build one at small scale",
 goal:"Know every step of a web data pipeline: text extraction → language ID → heuristic filtering → deduplication → quality classifier → mixing. Know why data is often called the biggest lever, and how to make data decisions with small-model ablations.",
 boss:"Picking data by gut feeling: setting the mix without ablations",loot:"A small working pipeline from Common Crawl to training data",adv:"",d:"funnel",
 cap:"<span class=\"tag-illu\">Illustrative</span>The fraction left after each step is illustrative and does not match any real dataset. Click a step to see what it does and where it goes wrong.",
 find:[A("FineWeb",U.fineweb)+": 96 Common Crawl snapshots, 15T tokens; small-model ablations on “early signal” benchmarks; global MinHash dedup across snapshots made results worse.",
  A("DCLM",U.dclm)+": a 240T-token candidate pool plus a fastText quality classifier; classifier details moved a 7B model's MMLU anywhere from 35% to 44%.",
  "The data chapter of the "+A("Smol Playbook",U.smol)+": the counterintuitive parts of mixing, multi-stage curricula, and how to design ablations for a data mix.",
  "CS336 2026 Assignment 4: turn raw Common Crawl into pretraining data (filtering plus dedup). For tooling, use "+A("datatrove",U.datatrove)+" directly."],
 ex:["Do CS336 A4, or use datatrove on a subset of one Common Crawl snapshot and run the whole thing: extraction, language ID, heuristic filtering, MinHash dedup, quality classification.",
  "Train one sub-1B-parameter model on each of two filtering strategies and compare them on early-signal benchmarks."],
 quiz:["Why does global deduplication sometimes make results worse?","What makes a benchmark a good “early signal” benchmark?","A quality classifier that favors “textbook-like” text: what side effects might it have?"],
 src:[["The FineWeb Datasets",U.fineweb],["FineWeb2",U.fineweb2],["DataComp-LM (DCLM)",U.dclm],["huggingface/datatrove",U.datatrove],["Smol Training Playbook",U.smol],["Stanford CS336",U.cs336]]},

{id:"m3",code:"M3",track:"m",region:"Pretraining",short:"Tokenizer & architecture",title:"Tokenizers and model architecture",depth:"Write it from scratch",
 goal:"Understand BPE. Explain how a modern decoder differs from GPT-2 (RMSNorm, SwiGLU, RoPE, GQA/MLA, QK-Norm). Understand MoE routing and load balancing. Know why hybrid attention (sliding window, linear attention and Mamba mixed with full attention) appeared.",
 boss:"Knowing the names but not the tradeoffs",loot:"A table of architecture differences from GPT-2 to 2026 open models",adv:"",d:[["Architecture comparison","arch"],["MoE routing","moe"]],
 cap:"“Architecture comparison” steps row by row through the changes from GPT-2 to modern open models; “MoE routing” compares expert load with and without load balancing.",
 find:["Raschka's "+A("The Big LLM Architecture Comparison",U.raschka)+" (still being updated as of April 2026) and "+A("LLM Architecture Gallery",U.gallery)+": the architectures of dozens of open models side by side.",
  "CS336 lectures 3 and 4: architectures and hyperparameters, attention alternatives and MoE.",
  "Primary sources, architecture chapters: "+A("DeepSeek-V3",U.dsv3)+" (MLA, MoE, auxiliary-loss-free load balancing), "+A("Kimi K2",U.kimik2)+" (MuonClip), "+A("Nemotron 3 Ultra",U.nemo3u)+" (a hybrid Mamba-attention MoE).",
  "For tokenizers, watch Karpathy's tokenizer video and read the tokenizer code in nanochat."],
 ex:["On the CS336 A1 model, swap components one at a time (LayerNorm → RMSNorm, GELU → SwiGLU, absolute positions → RoPE), train at small scale and compare loss.",
  "Write a top-k MoE layer by hand. Train it without load balancing and watch the experts collapse; then add a load-balancing loss and compare.",
  "Train a BPE tokenizer and compare compression rates on Chinese text and on code for different vocabulary sizes."],
 quiz:["What do GQA and MLA each save, and at what cost?","In an MoE, what do total parameters and active parameters each determine?","Why does Kimi K2 use QK-Clip instead of QK-Norm? (Hint: MLA does not explicitly build the full K at inference time.)"],
 src:[["The Big LLM Architecture Comparison",U.raschka],["LLM Architecture Gallery",U.gallery],["DeepSeek-V3",U.dsv3],["Kimi K2",U.kimik2],["Nemotron 3 Ultra",U.nemo3u],["Stanford CS336",U.cs336]]},

{id:"m4",code:"M4",track:"m",region:"Pretraining",short:"Pretraining & scaling",title:"Pretraining and scaling",depth:"Understand it; run it at small scale",
 goal:"Use scaling laws for budget decisions (C ≈ 6ND; Chinchilla's roughly 20 tokens per parameter; why modern small models go far beyond that ratio). Understand hyperparameter transfer (μP), optimizers (AdamW, Muon), learning-rate schedules (cosine and WSD) and training stability (loss spikes, QK-Norm), and know how to read training dashboards.",
 boss:"Loss spikes and silent throughput drops",loot:"A scaling law you fit yourself",adv:"",d:[["Splitting compute","chin"],["Learning-rate schedules","lr"]],
 cap:"“Splitting compute” estimates the Chinchilla-optimal parameter count and marks where a few real models sit; “Learning-rate schedules” <span class=\"tag-illu\">Illustrative</span> compares cosine and WSD.",
 find:[A("Chinchilla",U.chinchilla)+" and "+A("Kaplan et al.",U.kaplan)+". CS336 2026 Assignment 3 has you fit a scaling law yourself through a training API.",
  A("Smol Playbook",U.smol)+": “every big model starts with a small ablation”, optimizers and hyperparameters, and the three throughput mysteries and the loss-noise debugging in the “training marathon”.",
  "First-hand stability records: "+A("Kimi K2",U.kimik2)+" trained on 15.5T tokens with MuonClip without a single loss spike; "+A("Marin 32B",U.marin)+"'s spikes resisted every standard fix and were finally solved by adding QK-Norm.",
  "The WSD schedule from "+A("MiniCPM",U.minicpm)+": no need to fix the total step count in advance, and the decay phase can switch to high-quality data. For hyperparameter transfer, see "+A("μP",U.mup)+"."],
 ex:["Do CS336 A3, or train a set of runs at each of 3 to 4 model sizes, fit loss against compute, and predict the loss at the next size.",
  "Train the same small model with cosine and with WSD and compare how loss moves in the decay phase; then branch off a decay run from the middle of the WSD stable phase."],
 quiz:["Given a compute budget, how do you compute the Chinchilla-optimal parameter and token counts? Llama 3 8B was trained on 15T tokens: why “overtrain”?","When a loss spike appears, in what order do you deal with it?","Training throughput quietly dropped 20%. What could cause it?"],
 src:[["Chinchilla",U.chinchilla],["Scaling Laws for Neural Language Models (Kaplan)",U.kaplan],["μP (Tensor Programs V)",U.mup],["MiniCPM (WSD)",U.minicpm],["Kimi K2",U.kimik2],["Training Marin 32B",U.marin],["Smol Training Playbook",U.smol],["Stanford CS336",U.cs336]]},

{id:"m5",code:"M5",track:"m",region:"Mid-training",short:"Mid-training",title:"Mid-training and long context",depth:"Understand the principles",
 goal:"Understand “annealing” late in pretraining: raising the share of high-quality data (math, code, reasoning, instruction-style) while the learning rate decays. Understand long-context extension (RoPE frequency scaling, YaRN, staged lengthening). Know that the line between mid-training and post-training keeps blurring, and that mid-training sets the ceiling for later RL.",
 boss:"Annealing data that contaminates the eval sets",loot:"An annealing ablation: one checkpoint, two annealing mixes",adv:"",d:"midtrain",
 cap:"<span class=\"tag-illu\">Illustrative</span>The mixes and stage boundaries are illustrative, shaped after multi-stage curricula like SmolLM3's. The cursor sweeps across and shows the current mix.",
 find:["The mid-training section of the "+A("Smol Playbook",U.smol)+": the stage 2 and 3 mixes, and long-context extension from 4k to 128k.",
  "The mid-training chapters of "+A("OLMo 2",U.olmo2)+" and "+A("Olmo 3",U.olmo3)+": data, mixes and intermediate checkpoints are all public.",
  A("YaRN",U.yarn)+": a widely used method for extending RoPE to long contexts.",
  "Lessons from Marin 32B: cached math data mixed in during annealing contaminated the evaluations, and the shuffle implementation caused a phase shift in the training loss."],
 ex:["Take a public intermediate OLMo checkpoint, run a short anneal with each of two mixes, and compare how math and general abilities change.",
  "Use YaRN to extend a small model's context from 4k to 16k and test retrieval with “needle in a haystack”."],
 quiz:["Why does adding high-quality data work best during learning-rate decay?","Spurious Rewards found that Qwen2.5-Math improves under RL even with random rewards. What does that have to do with its mid-training?","Why can short-context ability drop after long-context extension?"],
 src:[["Smol Training Playbook",U.smol],["OLMo 2",U.olmo2],["Olmo 3",U.olmo3],["YaRN",U.yarn],["Training Marin 32B",U.marin],["Spurious Rewards",U.spurious]]},

{id:"m6",code:"M6",track:"m",region:"Post-training",short:"SFT & preferences",title:"SFT and preference optimization",depth:"Hands-on",
 goal:"Run a trustworthy SFT on your own: correct chat template, loss only on assistant tokens, packing, data mixing, decontamination, and evals fixed before training. Understand Bradley-Terry reward models, derive DPO, and understand overoptimization: the harder you optimize a proxy reward, the worse the true quality gets.",
 boss:"Silent chat-template and EOS bugs; reward overoptimization",loot:"One trustworthy SFT run, plus a “proxy reward vs. true metric” curve",adv:"",d:[["Loss mask","chat"],["Overoptimization","overopt"]],
 cap:"“Loss mask” cycles through three setups; “Overoptimization” <span class=\"tag-illu\">Illustrative</span> follows the shape of Gao et al. 2022's best-of-n fit, and the length numbers are only illustrative.",
 find:["The data ablations in "+A("Tülu 3",U.tulu3)+", plus the source and configs in "+A("open-instruct",U.oi)+": the real hyperparameters live in the configs, not in the blog posts.",
  "The post-training part of the "+A("Smol Playbook",U.smol)+": why almost every pipeline starts with SFT, chat templates, and evals first.",
  "Chapters 5, 8 and 14 of "+A("rlhfbook",U.rlhfbook)+", matching Lectures 2, 6 and 9 of the "+A("course",U.rlhfcourse)+". Work through the derivation in the "+A("original DPO paper",U.dpo)+" yourself.",
  A("Gao et al. 2022",U.gao)+" (a quantitative account of reward model overoptimization) and "+A("Lilian Weng's long post on reward hacking",U.weng)+".",
  "For DPO, IPO, KTO, ORPO, SimPO and online DPO side by side, see <a href=\"#a2\">atlas A2</a>."],
 ex:["Train Qwen3-1.7B or SmolLM3-3B on a subset of the Tülu 3 SFT mix, with the eval set fixed before training. Then plant a chat-template or EOS bug on purpose and watch it quietly ruin the evals without raising a single error.",
  "Train a BT reward model, run both DPO and best-of-n on the same model, and plot the proxy reward against the true metric."],
 quiz:["Why does overdoing SFT hurt the RL that follows?","Why does DPO tend to make responses longer?","When should you generate your own data with rejection sampling (STaR, ReST-EM)?"],
 src:[["Tülu 3",U.tulu3],["allenai/open-instruct",U.oi],["Smol Training Playbook",U.smol],["RLHF and Post-Training Book",U.rlhfbook],["Direct Preference Optimization",U.dpo],["Scaling Laws for Reward Model Overoptimization",U.gao],["Reward Hacking in RL (Lilian Weng)",U.weng]]},

{id:"m7",code:"M7",track:"m",region:"Post-training",short:"RL algorithms",title:"RL algorithms for LLMs",depth:"Core focus",
 goal:"Derive the path from policy gradient to PPO to GRPO, and explain the GRPO loss line by line (group baseline, advantage normalization, importance ratio, clip, KL estimator, token-level vs. sequence-level averaging). Know what DAPO, Dr. GRPO and GSPO each fix, and what RL can and cannot teach a model.",
 boss:"Entropy collapse, and groups with identical scores that give no gradient",loot:"A hand-written GRPO in about 300 lines",adv:"★ RL post-training in the world model track builds on this stage",d:[["GRPO advantage & clip","grpo"],["Limits of RL","passk"]],
 cap:"“GRPO advantage & clip”: drag the number of correct answers to see how advantage is assigned, and switch the clip upper bound to see when the gradient goes to zero. “Limits of RL” <span class=\"tag-illu\">Illustrative</span> follows the shape in Yue et al. 2025; the two rows below are the qualitative findings of Spurious Rewards.",
 find:["Foundations: "+A("OpenAI Spinning Up",U.spinup)+"; "+A("Schulman's short note on approximating KL",U.kl)+" (the k1, k2 and k3 estimators).",
  "Papers: "+A("DeepSeekMath",U.dsmath)+" (where GRPO comes from), "+A("DAPO",U.dapo)+", "+A("Dr. GRPO",U.drgrpo)+", "+A("GSPO",U.gspo)+". After reading the equations, find the matching lines of code in TRL or verl.",
  "What RL can learn: "+A("Yue et al. 2025",U.yue)+" (at large k, the base model's pass@k overtakes), "+A("ProRL",U.prorl)+" (long enough RL can push the boundary), "+A("Spurious Rewards",U.spurious)+" (findings that hold only on Qwen).",
  "Assignment: CS336 2026 Assignment 5, training a model to solve math problems with SFT and RL.",
  "For which term of the loss each post-PPO variant changes, see the loss anatomy in <a href=\"#a3\">atlas A3</a>."],
 ex:["Without a framework, write GRPO yourself in about 300 lines and run it on GSM8K or MATH.","Add clip-higher (DAPO) and compare the entropy curves of the two runs.","Switch loss averaging between token-level and sequence-level and watch how response length changes; then rerun the same experiment on a different model family."],
 quiz:["By dropping the value model, what does GRPO save and what does it lose?","Why does long-CoT RL often drop the KL term, while RLHF for alignment keeps it?","Why do prompts with pass rates near 0 or 1 give no gradient?","An RL paper only runs experiments on Qwen2.5-Math-7B. How do you read it?"],
 src:[["OpenAI Spinning Up",U.spinup],["Approximating KL Divergence",U.kl],["DeepSeekMath (GRPO)",U.dsmath],["DAPO",U.dapo],["Dr. GRPO",U.drgrpo],["GSPO",U.gspo],["Yue et al. 2025",U.yue],["ProRL",U.prorl],["Spurious Rewards",U.spurious]]},

{id:"m8",code:"M8",track:"m",region:"Post-training",short:"Rewards & environments",title:"Rewards, verifiers and environments",depth:"Core focus",
 goal:"Design verifiable rewards (answer checking, unit tests, execution matching) and hack-resistant rubric or judge rewards. Gate on safety instead of averaging it in. Filter by difficulty. Build multi-turn tool-calling environments.",
 boss:"Reward hacking",loot:"A public text-to-SQL verifier environment and a catalog of hacks",adv:"★ Reward design in the world model track starts here",d:[["Verifier loop","verify"],["Gating vs. weighting","gate"]],
 cap:"“Verifier loop” cycles through four grading cases; the last two are reward hacking. “Gating vs. weighting”: drag the quality and toggle the violation to see how the two ways of combining rewards differ.",
 find:["Frontier teams now treat building environments and verifiers as core work; see job descriptions like "+A("OpenAI Frontier Evals & Environments",U.oaijd)+".",
  A("PrimeIntellect-ai/verifiers",U.verifiers)+" and the Environments Hub: see how others write environments.",
  A("One Token to Fool LLM-as-a-Judge",U.onetoken)+": how fragile judge rewards are.",
  "Spider's "+A("test-suite evaluation",U.testsuite)+": how execution matching guards against “matching by coincidence”."],
 ex:["Build a text-to-SQL environment on "+A("BIRD",U.bird)+" or Spider, use execution-result matching as the verifier, run RLVR, and catalog every reward hack you hit.",
  "Difficulty filtering: drop problems with pass rates near 0 or 1 and compare training efficiency."],
 quiz:["When do you use a rule-based verifier, and when an LLM judge?","Why should safety be a gate rather than averaged with the quality score?","Before a reward function goes live, how do you test whether it can be hacked?"],
 src:[["OpenAI: Frontier Evals & Environments",U.oaijd],["PrimeIntellect-ai/verifiers",U.verifiers],["One Token to Fool LLM-as-a-Judge",U.onetoken],["Spider test-suite SQL eval",U.testsuite],["BIRD benchmark",U.bird]]},

{id:"m9",code:"M9",track:"m",region:"Post-training",short:"Distillation & recipes",title:"Distillation and how recipes evolved",depth:"Hands-on",
 goal:"Explain how post-training recipes evolved from 2022 to 2026. Tell offline, on-policy and self-distillation apart. Understand the per-token reverse KL of on-policy distillation, multi-teacher MOPD, and the patterns of forgetting.",
 boss:"Catastrophic forgetting",loot:"A recipe comparison table, plus one reproduction of on-policy distillation",adv:"",d:[["Recipe evolution","recipes"],["Distillation modes","distill"]],
 cap:"“Recipe evolution”: click a year or autoplay. “Distillation modes” cycles through three kinds of distillation; the forgetting comparison below is a qualitative sketch.",
 find:["Use Lambert and Finbarr Timbers' "+A("rlhfbook Conversation 1",U.conv1)+" (June 2026) as an index; it links every original paper. Treat secondhand surveys (such as "+A("Jiaxin Zhang's 2026 long post",U.jiaxin)+") as tables of contents only.",
  "Thinking Machines' "+A("On-Policy Distillation",U.opd)+", paired with the "+A("Tinker cookbook",U.tinker)+" for direct reproduction; "+A("LoRA Without Regret",U.lora)+".",
  A("MiMo-V2-Flash",U.mimo)+" (where MOPD comes from); "+A("RL's Razor",U.razor)+" (forgetting tracks the KL from the base model); "+A("GKD",U.gkd)+".",
  "For offline distillation, OPD, multi-teacher OPD, self-distillation and the rejection-sampling family side by side, see <a href=\"#a4\">atlas A4</a>."],
 ex:["Build a comparison table: one row per model; columns for SFT data, preference or RL algorithm, reward source, whether KL is kept, whether there is distillation, and number of stages. Read "+A("Tülu 3",U.tulu3)+" → "+A("Olmo 3",U.olmo3)+" closely.",
  "Reproduce on-policy distillation with the Tinker cookbook (the docs report about 76.7% on AIME'24 with LoRA rank 128), then compare how much SFT and on-policy distillation each forget."],
 quiz:["Why does Llama 3 skip online RL, while DeepSeek-R1 is built around RL?","Why did 2026 shift to “several specialist teachers plus on-policy distillation”?","When should a model inherit abilities through distillation, and when must it learn them itself through RL?"],
 src:[["rlhfbook Conversation 1",U.conv1],["How frontier labs train LLMs (2026)",U.jiaxin],["On-Policy Distillation",U.opd],["tinker-cookbook",U.tinker],["LoRA Without Regret",U.lora],["MiMo-V2-Flash",U.mimo],["RL's Razor",U.razor],["DeepSeek-R1",U.r1]]},

{id:"m10",code:"M10",track:"m",region:"Evaluation",short:"Evaluation",title:"Evaluation",depth:"Core focus",
 goal:"Pick the right evals for each stage: loss and “early signal” benchmarks for pretraining; capability evals (instruction following, math, code, agents) for post-training; real usage after launch. Check for contamination, judge significance, and know the biases of LLM judges.",
 boss:"Making decisions on noise",loot:"A stage-by-stage eval plan, with a confidence interval on every conclusion",adv:"★ Telling whether an improvement is real",d:[["Early signal","evalsig"],["Is this gain real?","ci"]],
 cap:"“Early signal” <span class=\"tag-illu\">Illustrative</span> shows how different benchmarks behave in small-scale training; “Is this gain real?” estimates eval noise with a binomial approximation.",
 find:["Hugging Face's "+A("LLM Evaluation Guidebook",U.evalguide)+" (lessons from the Open LLM Leaderboard and lighteval), plus "+A("lighteval",U.lighteval)+" and "+A("lm-evaluation-harness",U.lmeval)+".",
  "How "+A("FineWeb",U.fineweb)+" picks early-signal benchmarks: they rise monotonically even at small scale, have low noise, and sit above chance.",
  "CS336 2026 lecture 12 (evaluation); “evals before everything” in the Smol Playbook.",
  A("One Token to Fool LLM-as-a-Judge",U.onetoken)+": judges need evaluating too."],
 ex:["During the small-model runs from M4, evaluate 6 benchmarks at regular intervals and sort out which give signal at small scale and which stay at chance.","For a post-training change, compute a confidence interval with a bootstrap or a paired test before deciding whether to believe it."],
 quiz:["Why does MMLU often sit near chance on small models? What do you use instead?","AIME has only 30 problems. Is a 3-point gain real?","How do you check whether a benchmark has leaked into the training data?"],
 src:[["LLM Evaluation Guidebook",U.evalguide],["huggingface/lighteval",U.lighteval],["lm-evaluation-harness",U.lmeval],["The FineWeb Datasets",U.fineweb],["One Token to Fool LLM-as-a-Judge",U.onetoken],["Stanford CS336",U.cs336]]},

{id:"i1",code:"I1",track:"i",region:"Infra",short:"GPUs & performance",title:"GPUs and performance",depth:"Hands-on",
 goal:"Understand GPU internals (SMs, Tensor Cores, the HBM and SRAM hierarchy), the roofline model, arithmetic intensity and MFU. Know why FlashAttention is fast (fewer HBM reads and writes, not fewer FLOPs). Find bottlenecks with a profiler, and write at least one Triton kernel.",
 boss:"Blaming slowness on compute when memory bandwidth is the bottleneck",loot:"A profile of one training step, with the MFU worked out",adv:"",d:"roofline",
 cap:"Drag the batch size to see which side of the roofline an 8192×8192 bf16 matmul lands on. Assumes an H100 SXM: 989 TFLOPS dense bf16 peak, 3.35 TB/s HBM bandwidth.",
 find:["Google DeepMind's "+A("How to Scale Your Model",U.scalebook)+": rooflines, Transformer compute and memory, profiling (TPU examples, but the principles carry over).",
  "Horace He's "+A("Making Deep Learning Go Brrrr From First Principles",U.brrr)+": the three kinds of bottleneck, namely compute, memory bandwidth and overhead.",
  "The "+A("GPU MODE lectures",U.gpumode)+" (Triton in practice, FlashAttention 3, a CUDA performance checklist) and the PMPP textbook; the original "+A("FlashAttention",U.flash)+" paper.",
  "CS336 2026 lectures 5 and 6 (GPUs, kernels and Triton) and Assignment 2; the infra chapter of the Smol Playbook (GPU internals, the memory hierarchy, rooflines)."],
 ex:["Do CS336 A2: profile your own model and write FlashAttention2 in Triton.","Use the PyTorch profiler on one training step to find the three slowest ops, and compute the MFU."],
 quiz:["Why is decoding bound by memory bandwidth? How large must the batch be before it becomes compute-bound?","FlashAttention does not reduce FLOPs. Why is it faster?","MFU is only 25%. What do you check first?"],
 src:[["How to Scale Your Model",U.scalebook],["Making Deep Learning Go Brrrr",U.brrr],["GPU MODE lectures",U.gpumode],["FlashAttention",U.flash],["Stanford CS336",U.cs336],["Smol Training Playbook",U.smol]]},

{id:"i2",code:"I2",track:"i",region:"Infra",short:"Distributed training",title:"Distributed training and memory",depth:"Hands-on",
 goal:"Compute training memory (16 bytes per parameter for mixed-precision Adam, plus activations). Know what DP, ZeRO-1/2/3 (FSDP), TP, PP, CP and EP each shard and where their communication cost lies. Choose a parallelism setup in three steps: make it fit → reach the target batch → optimize throughput.",
 boss:"Choosing a parallelism setup by feel",loot:"Throughput and memory compared across several parallelism setups for one model",adv:"",d:"zero",
 cap:"Drag the model size and switch the GPU count and sharding scheme to see how much each GPU holds (only the first 8 GPUs are drawn; activations excluded). The formula is from the ZeRO paper: 2 bytes of weights + 2 bytes of gradients + 12 bytes of optimizer state.",
 find:["Hugging Face's "+A("Ultra-Scale Playbook",U.ultra)+": explains each kind of parallelism, based on more than 4,000 scaling experiments on up to 512 GPUs.",
  "The training-parallelism chapter of "+A("How to Scale Your Model",U.scalebook)+"; the original "+A("ZeRO",U.zero)+" paper.",
  "Code: "+A("torchtitan",U.titan)+" (PyTorch-native FSDP2, TP, PP) and "+A("Megatron-LM",U.megatron)+" (TP, PP, EP).",
  "The “three steps to a parallelism setup” in the "+A("Smol Playbook",U.smol)+"; CS336 2026 lectures 7 and 8 and the distributed part of A2."],
 ex:["On 8 GPUs, run the same 1B–3B model with DDP, FSDP and FSDP+TP, and record memory, throughput and the share of time spent communicating.","Reproduce the training throughput baseline for an 8B model with a torchtitan config."],
 quiz:["ZeRO-3 and TP both shard parameters. How do they differ, and when does each fit?","Why does MoE need expert parallelism? Where does the cost of all-to-all communication come from?","Why is TP usually kept within a single 8-GPU node?"],
 src:[["The Ultra-Scale Playbook",U.ultra],["How to Scale Your Model",U.scalebook],["ZeRO",U.zero],["pytorch/torchtitan",U.titan],["NVIDIA/Megatron-LM",U.megatron],["Smol Training Playbook",U.smol]]},

{id:"i3",code:"I3",track:"i",region:"Infra",short:"Inference & serving",title:"Inference and serving",depth:"Hands-on",
 goal:"Understand prefill vs. decode (the first is compute-bound, the second bandwidth-bound), KV cache size, PagedAttention, continuous batching, prefix caching, speculative decoding, quantization and prefill/decode disaggregation. Know what sets time to first token and time per output token. This is also the ceiling on RL rollout speed.",
 boss:"KV cache running out of GPU memory",loot:"A throughput benchmark for vLLM or SGLang",adv:"",d:[["KV cache math","kv"],["Continuous batching","batching"]],
 cap:"“KV cache math”: switch the model, context length and concurrency. “Continuous batching” compares how many requests static batching and continuous batching finish in the same time.",
 find:["The "+A("vLLM paper",U.vllm)+" (PagedAttention) and the "+A("SGLang paper",U.sglang)+" (RadixAttention, reusing shared prefixes); the scheduler in each codebase.",
  "The inference chapter of "+A("How to Scale Your Model",U.scalebook)+" (worked example: serving LLaMA 3-70B); CS336 2026 lecture 10.",
  "On prefill/decode disaggregation, read practical analyses like "+A("Beyond the Buzz",U.disagg)+": disaggregation is not a cure-all."],
 ex:["Serve an 8B model with vLLM and plot throughput against concurrency and output length. On a GRPO-style load (8 samples per prompt), compare with prefix caching on and off.","Work out how many concurrent sequences fit in the KV cache under your rollout setup, then compare with measurements."],
 quiz:["How large is Llama 3 8B's KV cache per token? How much memory do 64 concurrent sequences at 8k context need?","Why does continuous batching raise throughput so much?","When does speculative decoding make things slower?"],
 src:[["vLLM (PagedAttention)",U.vllm],["SGLang (RadixAttention)",U.sglang],["How to Scale Your Model",U.scalebook],["Beyond the Buzz: inference disaggregation",U.disagg],["Stanford CS336",U.cs336]]},

{id:"i4",code:"I4",track:"i",region:"Infra",short:"RL systems",title:"RL systems and stability",depth:"Hands-on",
 goal:"Understand the split between rollout engine and training engine, colocated vs. disaggregated deployment, sync vs. async (and staleness control), long tails and partial rollouts, weight sync, training-inference mismatch and TIS, and routing replay for MoE.",
 boss:"Training collapse caused by training-inference mismatch",loot:"An RL monitoring dashboard, plus comparisons with TIS on and off and sync vs. async",adv:"",d:[["Training-inference mismatch","system"],["Sync vs. async","async"]],
 cap:"“Training-inference mismatch” <span class=\"tag-illu\">Simulated data</span> only sketches what the collapse looks like and its earliest signal; “Sync vs. async” <span class=\"tag-illu\">Illustrative</span> shows idle GPU time under the two schedules.",
 find:["Hugging Face's "+A("Keep the Tokens Flowing",U.asyncrl)+" (March 2026): compares 16 open-source RL libraries along seven dimensions, including orchestration, buffers, weight sync, staleness and partial rollouts. Its conclusion: put inference and training on separate GPU pools, connect them with a buffer, and run both at once.",
  "Framework source: "+A("verl",U.verl)+", "+A("slime",U.slime)+" (Megatron plus SGLang, used for the GLM series), "+A("NeMo RL",U.nemorl)+"; for metric definitions, see "+A("TRL logging",U.trllog)+".",
  "Stability: "+A("On the Rollout-Training Mismatch",U.mismatch)+" (TIS), "+A("R3 routing replay",U.r3)+" (routing mismatch in MoE RL), "+A("Defeating Nondeterminism",U.nondet)+"; for long tails, "+A("APRIL",U.april)+"."],
 ex:["Run GRPO on one node with verl and fix a dashboard: reward and eval accuracy, entropy, clip fraction (split by advantage sign), truncation rate and length, and the logprob gap between the two engines. Compare runs with TIS on and off.","Run the same task synchronously and one-step asynchronously, and compare throughput and stability."],
 quiz:["Reward is rising but evals are falling. In what order do you debug?","How do you control the staleness that async introduces?","Why does RL on MoE models need routing replay?"],
 src:[["Keep the Tokens Flowing (Hugging Face)",U.asyncrl],["volcengine/verl",U.verl],["THUDM/slime",U.slime],["On the Rollout-Training Mismatch",U.mismatch],["Rollout Routing Replay (R3)",U.r3],["APRIL",U.april],["Defeating Nondeterminism in LLM Inference",U.nondet]]},

{id:"i5",code:"I5",track:"i",region:"Infra",short:"Environments & sandboxes",title:"Environments and sandboxes",depth:"Hands-on",
 goal:"Understand environment infra for agentic RL: one isolated sandbox per trajectory, high-concurrency scheduling, tool-call timeouts and retries, verifier latency, state reset and reproducibility. Know that environment throughput can directly stall the GPUs.",
 boss:"GPUs waiting on sandboxes",loot:"The text-to-SQL environment, sandboxed and load-tested for concurrency",adv:"",d:"sandbox",
 cap:"<span class=\"tag-illu\">Simplified model</span>Assumes each generation step takes 1 second and the GPU can interleave many trajectories without slowing down.",
 find:["The "+A("GLM-4.5",U.glm45)+" tech report: a high-concurrency Docker runtime that gives every task an isolated environment, and the slime training framework.",
  A("PrimeIntellect-ai/verifiers",U.verifiers)+" and the Environments Hub: how environments are packaged and reused.",
  "The agent module and fully async examples in "+A("slime",U.slime)+": how to schedule long-tail agent trajectories."],
 ex:["Containerize the text-to-SQL environment from M8 and load-test execution latency and failure rate at 32, 128 and 512 concurrent trajectories.","Add timeouts and retries to tool calls and watch the effect on the reward distribution; skip resetting sandbox state on purpose and see what reward problems show up."],
 quiz:["A trajectory makes 10 tool calls of 2 seconds each. What happens to GPU utilization, and how do you mitigate it?","What reward problems come from sandbox state that is not fully reset?"],
 src:[["GLM-4.5",U.glm45],["PrimeIntellect-ai/verifiers",U.verifiers],["THUDM/slime",U.slime],["Keep the Tokens Flowing",U.asyncrl]]},

{id:"i6",code:"I6",track:"i",region:"Infra",short:"Clusters & experiments",title:"Cluster reliability and experiment management",depth:"Understand it; rehearse it",
 goal:"Understand day-to-day large-scale training: hardware failure is the norm (Llama 3 trained for 54 days on 16,384 H100s with 466 interruptions, about one every 3 hours, and still kept effective training time above 90%). Checkpoint frequency and async saving; node health checks; scheduling; data loading; experiment tracking and reproducibility.",
 boss:"One failure costing hours of training",loot:"A drill: kill the job → resume from checkpoint → curves line up",adv:"",d:"goodput",
 cap:"<span class=\"tag-illu\">Simplified model</span>The failure rate scales linearly with GPU count from the Llama 3 numbers, and a restart is assumed to take 10 minutes. You can redraw the random failures.",
 find:["The reliability chapter of the "+A("Llama 3 tech report",U.llama3)+": failure categories and effective training time.",
  "Stas Bekman's "+A("Machine Learning Engineering Open Book",U.stas)+": storage, networking, Slurm, fault tolerance, checkpointing, and the companion debugging guides.",
  "The infra chapter of the "+A("Smol Playbook",U.smol)+": node health monitoring, checkpoint management, automated evals.",
  "How "+A("Marin",U.marin)+" works: hyperparameters, code version, data and metrics are logged for every step, and failed experiments are logged too."],
 ex:["Kill a multi-GPU run midway, resume from checkpoint, and check that the loss curve, data order and RNG state all line up (Marin once got a phase shift in its loss from its shuffle implementation).","Set rules for your own experiments: every run records the code commit, config, data version and random seed."],
 quiz:["On a 10,000-GPU cluster, how should you set the checkpoint interval?","After resuming, the loss curve shows a step. What could cause it?"],
 src:[["The Llama 3 Herd of Models",U.llama3],["Machine Learning Engineering Open Book",U.stas],["Smol Training Playbook",U.smol],["Training Marin 32B",U.marin]]}
);
var UW={roadmap:"https://arxiv.org/abs/2607.06401",wam:"https://arxiv.org/abs/2607.00836",cvprtut:"https://wangywust.github.io/cvpr-tutorial-world-model/",nvwam:"https://developer.nvidia.com/blog/pretrained-to-imagine-fine-tuned-to-act-the-rise-of-world-action-models/",
  genie3:"https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/",genie4:"https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/",waymo:"https://waymo.com/blog/2026/02/the-waymo-world-model-a-new-frontier-for-autonomous-driving-simulation",cosmos3:"https://arxiv.org/abs/2606.02800",cookbook:"https://github.com/nvidia-cosmos/cosmos-cookbook",cosmosac:"https://docs.nvidia.com/cosmos/2.2.0/predict2.5/post-training/video2world_action-conditioned.html",matrix:"https://arxiv.org/abs/2508.13009",
  vjepa2:"https://arxiv.org/abs/2506.09985",vjepa21:"https://arxiv.org/abs/2603.14482",vjrepo:"https://github.com/facebookresearch/vjepa2",lewm:"https://arxiv.org/abs/2603.19312",lewmcode:"https://github.com/lucas-maes/le-wm",
  dreamer4:"https://arxiv.org/abs/2509.24527",dreamer4p:"https://danijar.com/project/dreamer4/",dreamerv3:"https://github.com/danijar/dreamerv3",selfforcing:"https://arxiv.org/abs/2506.08009",ssm:"https://arxiv.org/abs/2505.20171",
  dreamzero:"https://arxiv.org/abs/2602.15922",gr00t2:"https://research.nvidia.com/labs/gear/gr00t-2",veoeval:"https://arxiv.org/abs/2512.10675",
  gencast:"https://doi.org/10.1038/s41586-024-08252-9",wn2:"https://arxiv.org/abs/2506.14285",wnrepo:"https://github.com/google-deepmind/weathernext",wn3:"https://arxiv.org/abs/2609.03582",aurora:"https://github.com/microsoft/aurora",earth2:"https://huggingface.co/blog/nvidia/earth-2-open-models",e2studio:"https://github.com/NVIDIA/earth2studio",wb2:"https://arxiv.org/abs/2308.15560",spreadskill:"https://arxiv.org/abs/2205.00865",rmmd:"https://arxiv.org/abs/2606.30414",
  rlvrw:"https://arxiv.org/abs/2505.13934",grnd:"https://arxiv.org/abs/2512.01952",compass:"https://arxiv.org/abs/2602.09022",smartr1:"https://arxiv.org/abs/2509.23993",flowgrpo:"https://arxiv.org/abs/2505.05470",omnidreams:"https://arxiv.org/abs/2606.03159",
  piqv:"https://arxiv.org/abs/2606.18943",wmbench:"https://arxiv.org/abs/2502.20694",wiw:"https://arxiv.org/abs/2510.18135",whatif:"https://arxiv.org/abs/2605.27589",
  genie:"https://arxiv.org/abs/2402.15391",vpt:"https://arxiv.org/abs/2206.11795",lapa:"https://arxiv.org/abs/2410.11758",
  womd:"https://arxiv.org/abs/2104.10133",nuplan:"https://arxiv.org/abs/2106.11810",waymax:"https://arxiv.org/abs/2310.08710",wosac:"https://arxiv.org/abs/2305.12032",
  oxe:"https://arxiv.org/abs/2310.08864",droid:"https://arxiv.org/abs/2403.12945",bridge:"https://arxiv.org/abs/2308.12952",
  era5:"https://github.com/google-research/arco-era5"};

NODES.push(
{id:"w1",code:"W1",track:"w",region:"World model",short:"Five routes",title:"The world model landscape: five routes",depth:"Understand the principles",
 goal:"Explain the five main world model routes in 2026: interactive video generation, latent-space prediction (JEPA), model-based RL, world-action models, and physical-field models such as weather. For each one: what it predicts, what controls it, the flagship systems, and whether the weights are open.",
 boss:"Taking good-looking video as proof that the model understands physics",loot:"A comparison table of the five routes",adv:"",d:"wroutes",
 cap:"The routes cycle on their own; click any route to stop on it. Routes marked “used in this track” are the ones the later stages build on.",
 find:["Start with the survey "+A("A Definition and Roadmap for World Models",UW.roadmap)+" (July 2026), then the tutorials "+A("From World Models to World Action Models",UW.wam)+" and the "+A("CVPR 2026 world model tutorial",UW.cvprtut)+".",
  "Read one flagship per route: the interactive simulators "+A("Genie 3",UW.genie3)+" and "+A("Genie 4",UW.genie4)+" (October 2026) and the open-weight "+A("Cosmos 3",UW.cosmos3)+"; latent space, "+A("V-JEPA 2",UW.vjepa2)+"; model-based RL, "+A("Dreamer 4",UW.dreamer4)+"; world-action models, "+A("DreamZero",UW.dreamzero)+"; weather, "+A("GenCast",UW.gencast)+".",
  "NVIDIA's "+A("essay on world-action models",UW.nvwam)+" (June 2026) lays out the “learn to imagine first, then learn to act” line of work.",
  "Discount company blog posts: the "+A("Genie 4",UW.genie4)+" and "+A("Waymo World Model",UW.waymo)+" posts give no quantitative evaluation."],
 ex:["Fill in a table with one row per route and columns for what it predicts, action conditioning, architecture family, training data scale, open weights, and what you would use it for.",
  "Read "+A("World-in-World",UW.wiw)+" (ICLR 2026 oral): in closed-loop tests, visual quality does not predict task success, and post-training on action-observation data helps more than switching to a bigger generator."],
 quiz:["Why does JEPA not reconstruct pixels? What does that cost?","When would you use an interactive simulator like Genie, and when an open model like Cosmos?","Why does a more realistic picture not mean a better grasp of physics?"],
 src:[["A Definition and Roadmap for World Models",UW.roadmap],["From World Models to World Action Models",UW.wam],["Genie 3",UW.genie3],["Genie 4",UW.genie4],["Cosmos 3",UW.cosmos3],["V-JEPA 2",UW.vjepa2],["Dreamer 4",UW.dreamer4],["DreamZero",UW.dreamzero],["GenCast",UW.gencast],["World-in-World",UW.wiw]]},
{id:"w2",code:"W2",track:"w",region:"World model",short:"Architecture & pretraining",title:"Architecture and pretraining: the generative and latent families",depth:"Hands-on (small scale)",
 goal:"Know how generative world models (diffusion or flow matching, autoregressive tokens, block-causal transformers) and latent predictive models (JEPA, which predicts representations instead of pixels) are trained, and how action conditioning enters the model. Know why long rollouts drift and what counters it: Self Forcing, shortcut forcing, and state-space memory.",
 boss:"Error that compounds over long rollouts",loot:"A small world model trained on one GPU, with a plot of error against rollout length",adv:"",d:"werr",
 cap:"<span class=\"tag-illu\">Illustrative</span>The curves only show the shape of exposure bias; they do not come from a specific model.",
 find:[A("LeWorldModel",UW.lewm)+" (LeCun, Balestriero, March 2026): about 15M parameters, trains on one GPU in a few hours, and plans 48× faster than world models built on large foundation models. The "+A("code",UW.lewmcode)+" is public, which makes it the best first hands-on project.",
  A("Dreamer 4",UW.dreamer4)+" ("+A("project page",UW.dreamer4p)+"): a block-causal transformer with shortcut forcing, real time on one GPU. To get started, run the official "+A("DreamerV3",UW.dreamerv3)+" code first.",
  A("V-JEPA 2",UW.vjepa2)+" and "+A("V-JEPA 2.1",UW.vjepa21)+": "+A("code and weights (MIT)",UW.vjrepo)+".",
  "Long-horizon consistency: "+A("Self Forcing",UW.selfforcing)+" (feeds the model its own predictions during training; 17 fps on an H100) and "+A("state-space world models",UW.ssm)+". An open real-time video model: "+A("Matrix-Game 2.0",UW.matrix)+"."],
 ex:["Run LeWorldModel or DreamerV3, measure rollout error at 1, 10, and 50 steps, and compare training with teacher forcing against self forcing.","Map the architecture ideas from M3 onto world models: how action tokens enter the sequence, and what a block-causal mask looks like."],
 quiz:["What is exposure bias, and how does Self Forcing reduce it?","How does JEPA avoid representation collapse?","How does Dreamer train a policy “in imagination” inside its world model?"],
 src:[["LeWorldModel",UW.lewm],["Dreamer 4",UW.dreamer4],["DreamerV3 code",UW.dreamerv3],["V-JEPA 2",UW.vjepa2],["V-JEPA 2.1",UW.vjepa21],["Self Forcing",UW.selfforcing],["State-space world models",UW.ssm],["Matrix-Game 2.0",UW.matrix]]},
{id:"w3",code:"W3",track:"w",region:"World model",short:"Post-training",title:"Post-training world models",depth:"Core focus",
 goal:"Know the main ways to post-train a world model: action-conditioned fine-tuning, domain adaptation, RL with verifiable rewards, GRPO on flow and diffusion models, keeping several rewards separate so they are harder to hack, and distillation for real-time use.",
 boss:"Reward hacking: the frames get prettier while the actions stop being followed",loot:"One experiment that post-trains a world model with verifiable rewards",adv:"★ Reuses the RL and reward design from M7 and M8",d:"wpost",
 cap:"<span class=\"tag-illu\">Illustrative</span>The curves only show how the two ways of combining rewards differ; the idea comes from WorldCompass and SMART-R1.",
 find:["Action conditioning and domain adaptation: the "+A("Cosmos Cookbook",UW.cookbook)+" and the "+A("Predict 2.5 action-conditioned post-training guide",UW.cosmosac)+" (the example runs on one GPU). "+A("OmniDreams",UW.omnidreams)+" post-trains Cosmos into a real-time closed-loop simulator with 21,000 hours of driving data.",
  "RL with verifiable rewards: "+A("RLVR-World",UW.rlvrw)+" (NeurIPS 2025; prediction metrics as rewards), "+A("GrndCtrl",UW.grnd)+", "+A("WorldCompass",UW.compass)+" (separate interaction and visual-quality rewards), and "+A("SMART-R1",UW.smartr1)+" (traffic simulation that alternates SFT → RFT → SFT; ICLR 2026, first on the Waymo Sim Agents leaderboard at submission with 0.7858).",
  "GRPO on flow and diffusion models: "+A("Flow-GRPO",UW.flowgrpo)+" turns the deterministic ODE sampler into an SDE, so the samples in a group actually differ and can be compared.",
  "Distillation: "+A("RMMD",UW.rmmd)+" distills GenCast with CRPS as the reward. It is 7.5× faster, beats the teacher on 93% of variables, and is better calibrated: the closest precedent for a probabilistic reward."],
 ex:["Follow the Cosmos action-conditioning guide and run one post-training job on the Bridge data.","Implement Flow-GRPO on a small trajectory world model. Use prediction error and physical constraints as rewards, and compute and monitor each one separately."],
 quiz:["Why can't GRPO be applied directly to flow and diffusion models?","Why constrain several rewards separately instead of summing them with weights?","Why does SMART-R1 alternate SFT and RFT?"],
 src:[["Cosmos Cookbook",UW.cookbook],["Cosmos Predict 2.5 action-conditioned post-training",UW.cosmosac],["OmniDreams",UW.omnidreams],["RLVR-World",UW.rlvrw],["GrndCtrl",UW.grnd],["WorldCompass",UW.compass],["SMART-R1",UW.smartr1],["Flow-GRPO",UW.flowgrpo],["RMMD",UW.rmmd]]},
{id:"w4",code:"W4",track:"w",region:"World model",short:"Probabilistic forecasting",title:"Weather and probabilistic forecasting: physical-field world models",depth:"Hands-on",
 goal:"Know the weather foundation models: GenCast's diffusion ensembles, WeatherNext 2 (trained with CRPS, 64 members in one pass), Aurora, and NVIDIA Earth-2's Atlas and StormScope. Evaluate probabilistic forecasts with CRPS and spread-skill, and know how a forecast field can serve as a conditioning input to another world model.",
 boss:"Looking only at mean error and ignoring uncertainty",loot:"One ensemble forecast, scored with CRPS and spread-skill",adv:"★ Calibrated uncertainty is what makes a world model useful for planning",d:"wcrps",
 cap:"Drag the width σ of the predicted distribution to see how CRPS rewards being “just calibrated”. Observations are drawn from a standard normal, and CRPS uses the closed form for a Gaussian.",
 find:[A("GenCast",UW.gencast)+" (Nature, December 2024): a conditional diffusion model producing 0.25°, 15-day ensembles that beat ECMWF ENS.",
  A("WeatherNext 2",UW.wn2)+" is trained with CRPS. Its "+A("code and weights are open",UW.wnrepo)+", including a 1° Mini version that runs on free Colab. "+A("WeatherNext 3",UW.wn3)+" (September 2026) is only offered as a service.",
  A("Aurora",UW.aurora)+" (MIT license, open code and weights) and NVIDIA's "+A("Earth-2 open models",UW.earth2)+": Atlas (15 days) and StormScope (satellite-based, 0–6 hour, km-scale nowcasting), run with "+A("Earth2Studio",UW.e2studio)+".",
  "Evaluation: "+A("WeatherBench 2",UW.wb2)+" (CRPS). A reliable ensemble has a "+A("spread-skill",UW.spreadskill)+" ratio close to 1."],
 ex:["Run an ensemble forecast with WeatherNext 2 Mini on Colab, pick a day with strong convection, and compute CRPS and spread-skill.","Run a StormScope nowcast with Earth2Studio and compare it with what was observed over the same hours. Where is the ensemble overconfident?"],
 quiz:["Why is CRPS a proper scoring rule? How does it differ from log-likelihood?","What does a spread-skill ratio far below 1 tell you?","How do ensemble forecasts relate to a Bayesian posterior?"],
 src:[["GenCast",UW.gencast],["WeatherNext 2",UW.wn2],["google-deepmind/weathernext",UW.wnrepo],["WeatherNext 3",UW.wn3],["microsoft/aurora",UW.aurora],["Earth-2 open models",UW.earth2],["Earth2Studio",UW.e2studio],["WeatherBench 2",UW.wb2],["Spread-skill",UW.spreadskill]]},
{id:"w5",code:"W5",track:"w",region:"World model",short:"Data, state & action",title:"Data, state, and action: building a world model dataset",depth:"Hands-on",
 goal:"Turn a domain into a world model dataset. Choose the state representation (pixels, a learned latent, or one token per agent or object), the time step, the conditioning inputs (maps, forecasts, goals), and the actions. Most logged data has no action labels, so know the substitutes: an inverse dynamics model trained on a small labeled set, latent actions learned from video, or observable intent signals.",
 boss:"Missing action labels and unclear data licenses",loot:"A versioned dataset with three baselines",adv:"★ The data decides whether the capstone works",d:"wscene",
 cap:"<span class=\"tag-illu\">Illustrative</span>Click any agent to see its state token. Toggle the context map to see whether the predicted ensemble avoids the blocked zone.",
 find:["Action labels for unlabeled data: "+A("VPT",UW.vpt)+" trains an inverse dynamics model on a small labeled set and uses it to label a large corpus of online video; "+A("Genie",UW.genie)+" and "+A("LAPA",UW.lapa)+" learn latent actions directly from video.",
  "Multi-agent driving data and simulators: the "+A("Waymo Open Motion Dataset",UW.womd)+", "+A("nuPlan",UW.nuplan)+" (a closed-loop planning benchmark), "+A("Waymax",UW.waymax)+" (an accelerated simulator built on Waymo data), and the "+A("Waymo Open Sim Agents Challenge",UW.wosac)+", which scores how realistic simulated agents are.",
  "Robot data with actions: "+A("Open X-Embodiment",UW.oxe)+", "+A("DROID",UW.droid)+", and "+A("BridgeData V2",UW.bridge)+". Bridge is the dataset in the Cosmos action-conditioning guide (W3).",
  "Physical fields as context: "+A("ERA5 (ARCO cloud copy)",UW.era5)+" (CC-BY 4.0 since July 2025) and the W4 models. Check every source's license before you use it; some datasets are free only for non-commercial research."],
 ex:["Pick one domain with public data (driving, robot manipulation, or a physical system you know). Clean it, align the context inputs in time, and freeze a versioned dataset with documented splits.",
  "Three baselines: constant-velocity extrapolation, an LSTM, and flow matching. Metrics: minADE@k, CRPS, spread-skill, physical-constraint violation rate, and collision or near-miss rate. Report hard regimes (dense scenes, unusual conditions) separately from easy ones."],
 quiz:["If the logs contain no actions, where do the “actions” come from?","Why report hard and easy regimes separately?","One token per agent, or the whole scene rendered as an image: what does each gain and lose?"],
 src:[["VPT",UW.vpt],["Genie",UW.genie],["LAPA",UW.lapa],["Waymo Open Motion Dataset",UW.womd],["nuPlan",UW.nuplan],["Waymax",UW.waymax],["Waymo Open Sim Agents Challenge",UW.wosac],["Open X-Embodiment",UW.oxe],["DROID",UW.droid],["BridgeData V2",UW.bridge],["ARCO-ERA5",UW.era5]]},
{id:"w6",code:"W6",track:"w",region:"World model",short:"Capstone",title:"Capstone: an action-conditioned world model with RL post-training",depth:"Capstone",
 goal:"Build a context-conditioned, action-controllable multi-agent world model on public data, post-train it with RL on separate verifiable rewards, and validate it in closed loop in a simulator.",
 boss:"Open-loop metrics look good, and closed loop falls apart",loot:"A public project: dataset, model, evaluation, and write-up",adv:"★ The end of this track",d:"wproj",
 cap:"Click a milestone for details. Checked items are saved only in this browser, on this device.",
 find:[A("World-in-World",UW.wiw)+": closed-loop evaluation, and why action-observation data matters more than a bigger generator.",A("What-If World",UW.whatif)+": paired intervention tests that change one physical variable at a time; so far no model scores above 52%.",A("SMART-R1",UW.smartr1)+" and "+A("WorldCompass",UW.compass)+": alternating SFT and RFT, with rewards kept separate.",A("RMMD",UW.rmmd)+": CRPS as a reward.",
  "A minimal stack you build yourself: the versioned dataset from W5; PyTorch with DDP or FSDP2, following torchtitan (I2); Flow-GRPO-style group sampling for post-training, with a simulator such as "+A("Waymax",UW.waymax)+" as the closed-loop environment (W3, I5); and for every run, the code version, config, data version, and random seed, with regular checkpoints (I6). Models like this are usually small: one multi-GPU node is enough to start, and you do not need an LLM inference engine."],
 ex:["Milestone 1: dataset and baselines (see W5).","Milestone 2: add context and action conditioning, and run paired What-If tests.","Milestone 3: RL post-training in the style of Flow-GRPO or SMART-R1, then closed-loop replay in a simulator."],
 quiz:["If the world model simulates real agents, why should a near-miss reward match the real near-miss rate instead of pushing it to zero?","Why do open-loop metrics and closed-loop behavior come apart?"],
 src:[["World-in-World",UW.wiw],["What-If World",UW.whatif],["SMART-R1",UW.smartr1],["WorldCompass",UW.compass],["RMMD",UW.rmmd],["Waymax",UW.waymax],["Waymo Open Sim Agents Challenge",UW.wosac]]}
);
var UA={interconnects:"https://interconnects.ai/p/frontier-post-training-recipe-review",survey:"https://arxiv.org/abs/2610.28027",verl:"https://verl.readthedocs.io/en/latest/",trl:"https://huggingface.co/docs/trl/index",rollcorr:"https://verl.readthedocs.io/en/latest/algo/rollout_corr_math.html",trldist:"https://huggingface.co/docs/trl/main/en/distillation_trainer",verlopd:"https://verl.readthedocs.io/en/latest/algo/opd.html"};
function AX(id){return "https://arxiv.org/abs/"+id;}
NODES.push(
{id:"a1",code:"A1",track:"a",region:"Atlas",short:"Lineage & choosing",title:"Algorithm lineage: one objective, four families",depth:"Explain it clearly",
 goal:"Draw the lineage of post-training algorithms on a whiteboard. They all optimize “reward minus KL to a reference model”; they differ only in where the samples come from (fixed data, the current policy, a teacher), what the signal is (preference pairs, verifiable rewards, teacher logits), and how many models must be loaded. Given a new problem, pick a route based on the signal you have.",
 boss:"Too many names; unclear which method is a variant of which",loot:"A lineage chart you can draw from memory, plus a “signal → algorithm” selection table",adv:"",d:[["Lineage","atree"],["How to choose","apick"]],
 cap:"“Lineage” cycles through the filters automatically; click any algorithm to see its card. “How to choose” suggests a route and real examples based on the training signal you have.",
 find:[A("rlhfbook",U.rlhfbook)+" was published in July 2026; chapter 12 adds on-policy distillation and self-distillation. It is the best single index.",
  A("Interconnects’ 2026 review of frontier post-training recipes",UA.interconnects)+" (2026-06-16, a conversation with Finbarr Timbers); "+A("Pan 2026",UA.survey)+" cross-checks the tech reports of 13 large open models against the code of 7 RL frameworks, so you can look up “who uses what” directly.",
  "To decide whether a new algorithm is worth your time, check which term of the loss it changes (the anatomy chart in A3), then check whether any large-model tech report actually adopts it. If it has been validated on only one model family, file it under “to be verified”.",
  "Frameworks are the most honest list: "+A("verl",UA.verl)+", "+A("TRL",UA.trl)+". An algorithm has been tested in practice only once it lands in a mainstream framework and people discuss its hyperparameters in the issues."],
 ex:["Draw the lineage chart from memory: two or three representatives for each of the four families, marking which models each one loads and whether it is online or offline.",
  "Pick three 2026 tech reports (for example DeepSeek-V4, Kimi K3, Olmo 3) and draw each one’s post-training pipeline: the algorithm in each stage, the reward source, and whether distillation is used."],
 quiz:["Which models do PPO, GRPO, DPO, and on-policy distillation each need to load?","Why can DPO, rejection sampling, and on-policy distillation all be seen as solving the same KL-regularized reward maximization problem?","If all you have is a stronger teacher and a pile of prompts without reference answers, what would you do?","Why did frontier models in 2026 shift to “train several experts first, then do multi-teacher on-policy distillation”?"],
 src:[["RLHF and Post-Training Book",U.rlhfbook],["Interconnects: Frontier post-training recipe review",UA.interconnects],["Pan 2026: From RL Papers to Framework Code",UA.survey],["verl",UA.verl],["TRL",UA.trl]]},
{id:"a2",code:"A2",track:"a",region:"Atlas",short:"Preference optimization",title:"Preference optimization: DPO and its variants",depth:"Hands-on",
 goal:"Derive DPO from the RLHF objective; explain what IPO, KTO, ORPO, and SimPO each change and what data they need; know the problems that come from DPO being offline (no exploration, likelihood displacement, length bias) and how online DPO fixes them; hold an evidence-based view on “DPO or PPO”.",
 boss:"Distribution gap between the preference data and the current policy",loot:"A hand derivation of DPO, plus a comparison of offline and online DPO",adv:"",d:[["DPO derivation","adpo"],["Atlas cards","cards_pref"]],
 cap:"“DPO derivation” plays step by step; click any step. The curve below is <span class=\"tag-illu\">Illustrative</span>; the effect comes from Razin et al. In “Atlas cards”, click an algorithm for details.",
 find:["Work through the derivation in the appendix of the "+A("original DPO paper",U.dpo)+" yourself; the direct alignment chapter of "+A("rlhfbook",U.rlhfbook)+" covers IPO, KTO, ORPO, and SimPO together.",
  "For conclusions, look at controlled comparisons: "+A("Xu et al. 2024",AX("2404.10719"))+" (well-tuned PPO beats DPO on every task), "+A("Ivison et al. 2024",AX("2406.09279"))+" (data matters more than the algorithm), "+A("Tülu 3",U.tulu3)+" (length-normalized DPO actually beat PPO).",
  "DPO failure modes: "+A("Razin et al.",AX("2410.08847"))+" (the probability of the chosen response also falls), "+A("Park et al.",AX("2403.19159"))+" (length gets exploited)."],
 ex:["Run DPO, SimPO, and KTO (splitting the pairs into single examples) on the same preference data; compare quality and response length.","Run online DPO: each round, sample from the current model and have an RM or a judge label preference pairs. Compare against offline DPO, and plot the log-probability curves of chosen and rejected."],
 quiz:["Derive DPO: why does Z(x) cancel?","Why is DPO offline? What problems does that cause?","Why can SimPO drop the reference model? What does that cost?","What kind of data is KTO suited for?","Someone says “DPO is obsolete.” How do you respond?"],
 src:[["DPO",U.dpo],["IPO",AX("2310.12036")],["KTO",AX("2402.01306")],["ORPO",AX("2403.07691")],["SimPO",AX("2405.14734")],["OAIF (online DPO)",AX("2402.04792")],["Is DPO Superior to PPO?",AX("2404.10719")],["Unpacking DPO and PPO",AX("2406.09279")],["Likelihood Displacement",AX("2410.08847")],["Disentangling Length from Quality",AX("2403.19159")]]},
{id:"a3",code:"A3",track:"a",region:"Atlas",short:"Policy gradient",title:"The policy gradient family: every variant after PPO",depth:"Core focus",
 goal:"On a single GRPO formula, point to the term each variant changes: the advantage (critic, group, leave-one-out, global), the ratio (per token, per sequence, truncated weight), the clip (symmetric, clip-higher, soft gate, masking), the aggregation, the KL, and data filtering. Know the 2026 default backbone and the patches for training-inference mismatch and entropy collapse.",
 boss:"Training collapses midway and you cannot tell which term caused it",loot:"A “variant × loss component” table, plus two variants you implement yourself",adv:"★ The core of post-training algorithms",d:[["Loss anatomy","aloss"],["Atlas cards","cards_pg"]],
 cap:"“Loss anatomy” cycles through eight algorithms; red marks what changes relative to GRPO, and you can click any algorithm. “Atlas cards” also cover patches such as training-inference mismatch correction, entropy control, and async RL.",
 find:["When reading each variant, ask one question: which term of the formula does it change, and why. Originals: "+A("PPO",AX("1707.06347"))+", "+A("RLOO",AX("2402.14740"))+", "+A("GRPO",U.dsmath)+", "+A("Dr. GRPO",U.drgrpo)+", "+A("DAPO",U.dapo)+", "+A("VAPO",AX("2504.05118"))+", "+A("GSPO",U.gspo)+", "+A("CISPO (MiniMax-M1)",AX("2506.13585"))+".",
  A("ScaleRL",AX("2510.13786"))+" (Meta) compares these choices under a single setup: most affect efficiency, not the ceiling; CISPO and GSPO reach a higher ceiling than DAPO.",
  "Training-inference mismatch: "+A("verl’s rollout correction docs",UA.rollcorr)+", "+A("IcePop",AX("2510.18855"))+". Entropy: "+A("Clip-Cov / KL-Cov",AX("2505.22617"))+", "+A("ProRL",U.prorl)+".",
  "For real hyperparameters, read the RL sections of the DeepSeek-V3.2 and Kimi K2 tech reports, then find the matching configs in verl."],
 ex:["On the GRPO you wrote by hand in M7, toggle one term at a time: dividing by std or not, token-level or sequence-level averaging, clip-higher, CISPO-style weights. Change one thing per run and record entropy, response length, and accuracy.","Create a training-inference mismatch on purpose (bf16 for rollout, fp32 for training), look at the gap between the two sides’ log probabilities, then add the TIS correction."],
 quiz:["Why can GRPO drop the critic? Why does VAPO bring it back?","Why does PPO’s clip lead to entropy collapse? How do clip-higher and CISPO each address it?","Why does GSPO compute the ratio per sequence? What does this have to do with MoE?","If the rollout engine and the training engine compute different probabilities, what goes wrong, and how do you fix it?","What is the difference between putting the KL in the reward and putting it in the loss? Why do many reasoning RL setups drop the KL entirely?"],
 src:[["PPO",AX("1707.06347")],["RLOO",AX("2402.14740")],["DeepSeekMath (GRPO)",U.dsmath],["Dr. GRPO",U.drgrpo],["DAPO",U.dapo],["VAPO",AX("2504.05118")],["GSPO",U.gspo],["MiniMax-M1 (CISPO)",AX("2506.13585")],["ScaleRL",AX("2510.13786")],["IcePop",AX("2510.18855")],["Clip-Cov / KL-Cov",AX("2505.22617")],["AReaL",AX("2505.24298")]]},
{id:"a4",code:"A4",track:"a",region:"Atlas",short:"Distillation & self-training",title:"Distillation and self-training: learning from a teacher, learning from yourself",depth:"Hands-on",
 goal:"Tell apart offline distillation, on-policy distillation (OPD), multi-teacher on-policy distillation, and self-distillation. Explain the difference between forward and reverse KL, and why on-policy distillation gives a denser signal than RL. Know that rejection sampling (STaR, RFT, ReST-EM) is EM using only positive samples. Know when to distill and when you must do RL.",
 boss:"The teacher is confidently wrong, and the student follows",loot:"An OPD reproduction, plus a cost and quality comparison of SFT, OPD, and RL",adv:"★ Reverse KL is the variational inference objective",d:[["Signal density","adense"],["Forward vs reverse KL","akl"],["Atlas cards","cards_dist"]],
 cap:"“Signal density” <span class=\"tag-illu\">Illustrative</span> shows what signal the same wrong answer gets under RL and under on-policy distillation. “Forward vs reverse KL” fits one Gaussian to a bimodal distribution; the fits are computed numerically. “Atlas cards” include the rejection sampling family.",
 find:[A("Thinking Machines’ On-Policy Distillation",U.opd)+" is the clearest introduction, and you can reproduce it with the "+A("Tinker cookbook",U.tinker)+". The "+A("Qwen3 tech report",AX("2505.09388"))+" compares the cost of OPD and RL on the same base model.",
  "For multi-teacher on-policy distillation, read the post-training sections of "+A("MiMo-V2-Flash",U.mimo)+", "+A("DeepSeek-V4",AX("2606.19348"))+" (more than ten teachers, full-vocabulary logit distillation), and "+A("Kimi K3",AX("2607.24653"))+" (nine experts). Interconnects calls this the common pattern at the 2026 frontier, but also notes that some labs do not use it.",
  "When OPD fails: "+A("Rethinking OPD",AX("2604.13016"))+" (the teacher must actually have new abilities, and the two must reason in similar ways), "+A("TGOPD",AX("2609.02998"))+" (verify the teacher before distilling). Self-distillation: "+A("OPSD",AX("2601.18734"))+", "+A("SDFT",AX("2601.19897"))+", "+A("SDPO",AX("2601.20802"))+", and a "+A("counterexample",AX("2607.05184"))+" where it fails on thinking models.",
  "Tools: "+A("TRL’s distillation trainer",UA.trldist)+" (GKD, GOLD, and experimental self-distillation); "+A("verl’s OPD docs",UA.verlopd)+"."],
 ex:["Reproduce OPD with the Tinker cookbook or verl: train the same student with SFT distillation, OPD, and RL, and record GPU hours, AIME score, and pass@k.","Run three rounds of STaR or RFT on GSM8K and see in which round the gains start to diminish."],
 quiz:["Which of forward and reverse KL is mode-covering and which is mode-seeking? Which one do SFT and OPD each correspond to?","Why is OPD’s signal denser than RL’s? How does it relate to a PRM?","Why can rejection sampling fine-tuning be viewed as EM? What is its biggest difference from GRPO?","When is OPD worse than RL?","Where does the teacher come from in self-distillation? Why does it tend to fail on thinking models?"],
 src:[["On-Policy Distillation",U.opd],["Qwen3",AX("2505.09388")],["GKD",AX("2306.13649")],["MiniLLM",AX("2306.08543")],["MiMo-V2-Flash",U.mimo],["DeepSeek-V4",AX("2606.19348")],["Kimi K3",AX("2607.24653")],["Rethinking OPD",AX("2604.13016")],["OPSD",AX("2601.18734")],["SDFT",AX("2601.19897")],["SDPO",AX("2601.20802")],["STaR",AX("2203.14465")],["ReST-EM",AX("2312.06585")]]},
{id:"a5",code:"A5",track:"a",region:"Atlas",short:"Reward models",title:"Reward model atlas: where the signal comes from",depth:"Explain it clearly",
 goal:"Explain when to use a Bradley-Terry RM, a PRM, a generative RM, a rubric, RLAIF, and a programmatic verifier, and why each one gets hacked. Know how frontier models in 2026 combine them (rule-based verifiers, rubrics, and generative RMs used together).",
 boss:"The policy exploits the reward model",loot:"The same set of answers scored by an ORM, a PRM, and a generative judge, side by side",adv:"",d:[["ORM vs PRM","aprm"],["Atlas cards","cards_rm"]],
 cap:"“ORM vs PRM” <span class=\"tag-illu\">Illustrative</span> shows how the same wrong solution scores under three scoring methods; the scores are illustrative. Real PRM vs ORM numbers are in the cards.",
 find:["The RM section of "+A("InstructGPT",AX("2203.02155"))+", plus "+A("Gao et al. 2022",U.gao)+": how an RM is trained and why it gets overoptimized.",
  A("Let’s Verify Step by Step",AX("2305.20050"))+" and "+A("Math-Shepherd",AX("2312.08935"))+": two ways to label a PRM. Then see why "+A("DeepSeek-R1",U.r1)+" abandoned PRMs for large-scale RL.",
  "Generative RMs and rubrics: "+A("GenRM",AX("2408.15240"))+", "+A("DeepSeek-GRM",AX("2504.02495"))+", "+A("Rubrics as Rewards",AX("2507.17746"))+". For hacking cases, see "+A("CHERRL",AX("2606.04923"))+" and One Token to Fool in M8.",
  "How the frontier combines them: the reward sections of the DeepSeek-V3.2 and V4, GLM-5, and Kimi K3 tech reports."],
 ex:["Train an ORM and a Math-Shepherd-style PRM on the same set of math answers and compare their best-of-n reranking.","Write a rubric for an open-ended task, run RL with an LLM judge scoring against it, and log every hack the model finds."],
 quiz:["Why does a Bradley-Terry RM learn only score differences? How does that relate to it being hacked?","Where does a PRM beat an ORM? Why did DeepSeek-R1 still drop it?","A generative RM costs more than a scalar RM. What do you get in return?","When do you use a rule-based verifier, and when a rubric judge?"],
 src:[["InstructGPT",AX("2203.02155")],["Gao et al. 2022",U.gao],["Let's Verify Step by Step",AX("2305.20050")],["Math-Shepherd",AX("2312.08935")],["GenRM",AX("2408.15240")],["DeepSeek-GRM",AX("2504.02495")],["Rubrics as Rewards",AX("2507.17746")],["Constitutional AI",AX("2212.08073")],["Tülu 3",U.tulu3]]}
);
var AORD=["a1","a2","a3","a4","a5"];
var BY={};NODES.forEach(function(n){BY[n.id]=n;});
var ORDER=["m1","m2","m3","i1","m4","i2","m5","m6","i3","m7","i4","m8","i5","m9","m10","i6"];
var WORD=["w1","w2","w3","w4","w5","w6"],FORD=[];
var PRE={w:["m3","m4","m7","m10","i1","i2"]};
var PHASES=[["①","Big picture","How a model gets from raw data to deployment",["m1"]],["②","Foundations","Where capability comes from, and where compute and memory go",["m2","m3","i1","m4","i2","m5"]],["③","Post-training","Go deep on post-training, plus the infra RL depends on",["m6","i3","m7","i4","m8","i5","m9"]],["④","Evaluation & clusters","Tell whether a gain is real; keep runs stable and resumable",["m10","i6"]]];

/* ---------- state ---------- */
var KEY="yp-learning-route-v1";
function load(){try{var s=JSON.parse(localStorage.getItem(KEY)||"{}");return{done:Array.isArray(s.done)?s.done:[],kit:Array.isArray(s.kit)?s.kit:[]};}catch(e){return{done:[],kit:[]};}}
var state=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function isDone(id){return state.done.indexOf(id)>=0;}
function firstUndone(){for(var i=0;i<ORDER.length;i++){if(!isDone(ORDER[i])){return ORDER[i];}}return "";}

/* ---------- map ---------- */
var REG=[["Overview",["m1"],"--r5",[104,142]],["Pretraining",["m2","m3","m4"],"--r1",[285,80]],["Mid-training",["m5"],"--r4",[462,128]],["Post-training",["m6","m7","m8","m9"],"--r2",[685,68]],["Evaluation",["m10"],"--r3",[900,72]],["Infra track",["i1","i2","i3","i4","i5","i6"],"--r6",[300,392]]];
function layout(narrow){
  if(!narrow){
    return{w:1000,h:575,sx:1.35,sy:.85,
      P:{S:[40,330],G:[962,300],m1:[112,205],m2:[198,122],m3:[285,196],m4:[372,112],m5:[462,190],m6:[552,112],m7:[642,186],m8:[732,108],m9:[818,182],m10:[900,112],i1:[232,468],i2:[372,408],i3:[512,490],i4:[642,420],i5:[762,495],i6:[872,430]},
      trails:[["S","m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","G"],["S","i1","i2","i3","i4","i5","i6","G"]],
      links:[["i1","m3"],["i2","m4"],["i3","m7"],["i4","m7"],["i5","m8"],["i6","m10"]],
      gl:{x:950,y:268,"text-anchor":"end"},hills:[[700,300,6,40],[240,330,4,34]]};
  }
  var P={S:[180,44]},xs=[110,250,120,245,115,250,120,245,115,240],k;
  for(k=0;k<10;k++){P["m"+(k+1)]=[xs[k],124+k*86];}
  P.S2=[180,985];
  for(k=0;k<6;k++){P["i"+(k+1)]=[xs[k],1060+k*86];}
  P.G=[180,1600];
  return{w:360,h:1660,sx:1,sy:1.3,P:P,trails:[["S","m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","S2","i1","i2","i3","i4","i5","i6","G"]],links:[],gl:{x:180,y:1638,"text-anchor":"middle"},hills:[[180,420,4,40],[180,1250,4,36]]};
}
function segs(pts){
  var out=[];
  for(var i=0;i<pts.length-1;i++){
    var p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
    var c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    out.push(" C"+c1[0].toFixed(1)+" "+c1[1].toFixed(1)+" "+c2[0].toFixed(1)+" "+c2[1].toFixed(1)+" "+p2[0]+" "+p2[1]);
  }
  return out;
}
function renderMap(){
  var host=$("#map-host");if(!host){return;}
  var w=host.clientWidth||1000,narrow=w<640,L=layout(narrow),P=L.P;
  host.innerHTML="";
  var svg=S("svg",{viewBox:"0 0 "+L.w+" "+L.h,role:"group","aria-label":"Map of the stages on the two main tracks"},host);
  L.hills.forEach(function(h){
    for(var k=1;k<=h[2];k++){
      var d="";
      for(var i=0;i<=72;i++){var th=i/72*Math.PI*2,R=k*h[3]*(1+0.13*Math.sin(3*th+k*0.7)+0.06*Math.sin(5*th+1.3));d+=(i?"L":"M")+(h[0]+R*Math.cos(th)*L.sx).toFixed(1)+" "+(h[1]+R*Math.sin(th)*L.sy).toFixed(1);}
      S("path",{d:d+"Z","class":"m-contour"},svg);
    }
  });
  var rlabs=[];
  REG.forEach(function(r){
    var pts=r[1].map(function(id){return P[id];}),xs=pts.map(function(p){return p[0];}),ys=pts.map(function(p){return p[1];});
    var x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys);
    var rx=narrow?170:(x1-x0)/2+58,ry=(y1-y0)/2+(narrow?50:52),cx=narrow?180:(x0+x1)/2,cy=(y0+y1)/2;
    S("ellipse",{cx:cx,cy:cy,rx:rx,ry:ry,"class":"m-region",style:"fill:var("+r[2]+")"},svg);
    var lp=narrow?[24,cy-ry+24]:r[3];
    rlabs.push([lp[0],lp[1],r[0].toUpperCase()]);
  });
  rlabs.forEach(function(l){txt(svg,l[0],l[1],l[2],"m-rlab",narrow?"start":"middle");});
  L.links.forEach(function(l){var a=P[l[0]],b=P[l[1]];S("path",{d:"M"+a[0]+" "+(a[1]-20)+" L"+b[0]+" "+(b[1]+22),"class":"m-link"},svg);});
  L.trails.forEach(function(tr){
    var pts=tr.map(function(id){return P[id];}),sg=segs(pts);
    S("path",{d:"M"+pts[0][0]+" "+pts[0][1]+sg.join(""),"class":"m-trail"+(RM?"":" anim")},svg);
    sg.forEach(function(s,k){var a=tr[k],b=tr[k+1],won=(BY[a]&&isDone(a))||((a==="S"||a==="S2")&&BY[b]&&isDone(b));if(won){S("path",{d:"M"+pts[k][0]+" "+pts[k][1]+s,"class":"m-won"},svg);}});
  });
  S("circle",{cx:P.S[0],cy:P.S[1],r:9,"class":"m-startring"},svg);S("circle",{cx:P.S[0],cy:P.S[1],r:4.5,"class":"m-start"},svg);
  txt(svg,narrow?P.S[0]+16:P.S[0]-6,narrow?P.S[1]+4:P.S[1]+30,"You are here","m-startlab","start");
  if(P.S2){S("rect",{x:P.S2[0]-6,y:P.S2[1]-6,width:12,height:12,transform:"rotate(45 "+P.S2[0]+" "+P.S2[1]+")","class":"m-s2"},svg);txt(svg,P.S2[0]+16,P.S2[1]+4,"Infra track","m-startlab","start");}
  var gx=P.G[0],gy=P.G[1];
  ln(svg,gx,gy+14,gx,gy-16,"m-pole");S("path",{d:"M"+gx+" "+(gy-16)+" L"+(gx+18)+" "+(gy-10)+" L"+gx+" "+(gy-4)+" Z","class":"m-flag"},svg);
  var gl=S("a",{href:"#w1","aria-label":"Next: the World model track"},svg);var gt=S("text",L.gl,gl);gt.setAttribute("class","m-goallab");gt.textContent="Next: World model track";
  var cur=firstUndone();
  NODES.forEach(function(s){
    if(s.track!=="m"&&s.track!=="i"){return;}
    var id=s.id,x=P[id][0],y=P[id][1],done=isDone(id),sq=s.track==="i";
    var a=S("a",{href:"#"+id,"class":"node"+(done?" done":"")+(id===cur?" cur":""),"aria-label":s.code+" "+s.title+(done?" (done)":"")},svg);
    if(id===cur){if(sq){S("rect",{x:x-24,y:y-24,width:48,height:48,rx:10,"class":"halo"+(RM?"":" anim")},a);}else{S("circle",{cx:x,cy:y,r:24,"class":"halo"+(RM?"":" anim")},a);}}
    if(sq){S("rect",{x:x-19,y:y-19,width:38,height:38,rx:8,"class":"disc"},a);}else{S("circle",{cx:x,cy:y,r:19,"class":"disc"},a);}
    var tn=S("text",{x:x,y:y,"class":"num"},a);tn.textContent=done?"✓":s.code;
    if(s.adv){S("circle",{cx:x+16,cy:y-16,r:8,"class":"starbg"},a);var ts=S("text",{x:x+16,y:y-16,"class":"star"},a);ts.textContent="★";}
    var lb=narrow?(x<180?{x:x+30,y:y+5,"text-anchor":"start"}:{x:x-30,y:y+5,"text-anchor":"end"}):{x:x,y:y+40,"text-anchor":"middle"};
    var tl=S("text",lb,a);tl.setAttribute("class","lab");tl.textContent=s.short;
  });
  renderPhases();renderMini("w");
}
function codeLinks(ids){return ids.map(function(id){var n=BY[id];return '<a href="#'+id+'" class="'+({i:"i",w:"w",f:"f",a:"a"}[n.track]||"")+(isDone(id)?" done":"")+'" title="'+esc(n.title)+'">'+n.code+'</a>';}).join("");}
function renderPhases(){
  $("#phases").innerHTML=PHASES.map(function(p){return '<div class="phase"><div class="ph-h"><span class="ph-n">'+p[0]+'</span><span class="ph-t">'+p[1]+'</span></div><div class="ph-d">'+p[2]+'</div><div class="codes">'+codeLinks(p[3])+'</div></div>';}).join("")+
    '<div class="phase spec"><div class="ph-h"><span class="ph-n">⑤</span><span class="ph-t">World model track: start after ③</span></div><span class="ph-d">Five routes → architecture → post-training → probabilistic forecasting → data → capstone</span><div class="codes">'+codeLinks(WORD)+'</div></div>'+
    '<div class="phase spec"><div class="ph-h"><span class="ph-n">◇</span><span class="ph-t">Build it yourself: the Infra track in order</span></div><span class="ph-d">Fast on one GPU → fits on many → rollouts fast enough → stable RL → environments at scale → resumes after failure</span><div class="codes">'+codeLinks(["i1","i2","i3","i4","i5","i6"])+'</div></div>'+
    '<div class="phase spec"><div class="ph-h"><span class="ph-n">◎</span><span class="ph-t">Algorithm atlas: open it any time during ③</span></div><span class="ph-d">PPO, DPO, GRPO and its variants, on-policy distillation, and reward models, side by side</span><div class="codes">'+codeLinks(AORD)+'</div></div>';
  $("#pre-w").innerHTML=codeLinks(PRE.w);
}
function renderMini(tr){
  var host=$("#mini-"+tr);if(!host){return;}
  var ids=tr==="w"?WORD:FORD,nar=miniNarrow(),W=nar?320:480,H=nar?372:196,P=nar?[[70,52],[250,108],[70,164],[250,220],[70,276],[250,332]]:[[46,128],[124,68],[202,128],[280,68],[358,128],[434,68]];
  host.innerHTML="";
  var svg=S("svg",{viewBox:"0 0 "+W+" "+H,role:"group","aria-label":"Stages of the World model track"},host);
  S("rect",{x:6,y:24,width:W-12,height:H-30,rx:18,"class":"m-region",style:"fill:var("+(tr==="w"?"--r3":"--r1")+")"},svg);
  var sg=segs(P);
  S("path",{d:"M"+P[0][0]+" "+P[0][1]+sg.join(""),"class":"m-trail"+(RM?"":" anim")},svg);
  sg.forEach(function(s,k){if(isDone(ids[k])){S("path",{d:"M"+P[k][0]+" "+P[k][1]+s,"class":"m-won"},svg);}});
  var cur="";for(var i=0;i<ids.length;i++){if(!isDone(ids[i])){cur=ids[i];break;}}
  ids.forEach(function(id,k){
    var s=BY[id],x=P[k][0],y=P[k][1],done=isDone(id);
    var a=S("a",{href:"#"+id,"class":"node t"+tr+(done?" done":"")+(id===cur?" cur":""),"aria-label":s.code+" "+s.title+(done?" (done)":"")},svg);
    if(id===cur){S("circle",{cx:x,cy:y,r:24,"class":"halo"+(RM?"":" anim")},a);}
    S("circle",{cx:x,cy:y,r:19,"class":"disc"},a);
    var tn=S("text",{x:x,y:y,"class":"num"},a);tn.textContent=done?"✓":s.code;
    if(k===ids.length-1){ln(svg,x+16,y-14,x+16,y-38,"m-pole");S("path",{d:"M"+(x+16)+" "+(y-38)+" l14 5 l-14 5 Z","class":"m-flag"},svg);}
    else if(s.adv){S("circle",{cx:x+16,cy:y-16,r:8,"class":"starbg"},a);txt(a,x+16,y-16,"★","star");}
    var tl=S("text",nar?(x<160?{x:x+28,y:y+5,"text-anchor":"start"}:{x:x-28,y:y+5,"text-anchor":"end"}):{x:x,y:y+38,"text-anchor":"middle"},a);tl.setAttribute("class","lab");tl.textContent=s.short;
  });
}
function miniNarrow(){var h=$("#mini-w");return !!h&&h.clientWidth>0&&h.clientWidth<420;}

/* ---------- header + tabs ---------- */
function renderMeter(){
  function cnt(a){return a.filter(isDone).length;}
  function pips(a){return a.map(function(id){return '<span class="pip'+(BY[id].track==="i"?" i":"")+(isDone(id)?" on":"")+'"></span>';}).join("");}
  $("#meter").innerHTML='<span>Main <b>'+cnt(ORDER)+'</b>/'+ORDER.length+' · World model <b>'+cnt(WORD)+'</b>/6 · Atlas <b>'+cnt(AORD)+'</b>/'+AORD.length+'</span><span class="pips" aria-hidden="true">'+pips(ORDER)+'<span class="pipgap"></span>'+pips(WORD)+'<span class="pipgap"></span>'+pips(AORD)+'</span>';
}
function tabBtn(id,label,code,active){var n=BY[id];return '<button type="button" class="tab" role="tab" data-go="'+id+'" aria-selected="'+(active===id)+'"><span class="n">'+code+'</span>'+label+(n&&n.adv?'<span class="st" aria-label="core stage">★</span>':'')+(isDone(id)?'<span class="ok" aria-label="done">✓</span>':'')+'</button>';}
var TABN={m1:"Overview",m2:"Data",m3:"Architecture",m4:"Pretraining",m5:"Mid-training",m6:"SFT & preferences",m7:"RL algorithms",m8:"Rewards & envs",m9:"Distillation",m10:"Evaluation",i1:"GPUs",i2:"Distributed",i3:"Inference",i4:"RL systems",i5:"Sandboxes",i6:"Clusters",w1:"Five routes",w2:"Architecture",w3:"Post-training",w4:"Forecasting",w5:"Data",w6:"Capstone",a1:"Lineage",a2:"Preferences",a3:"Policy gradient",a4:"Distillation",a5:"Reward models"};
function renderTabs(active){
  $("#maptab").setAttribute("aria-selected",String(active==="map"));
  var H={m:"",i:"",w:"",a:""};
  NODES.forEach(function(n){if(H[n.track]!==undefined){H[n.track]+=tabBtn(n.id,TABN[n.id]||n.short,n.code,active);}});
  $("#tabs-m").innerHTML=H.m;$("#tabs-i").innerHTML=H.i;$("#tabs-w").innerHTML=H.w;$("#tabs-a").innerHTML=H.a;
  [$("#tabs-m"),$("#tabs-i"),$("#tabs-w"),$("#tabs-a")].forEach(function(t){var a=$('.tab[aria-selected="true"]',t);if(a){try{t.scrollTo({left:a.offsetLeft-t.clientWidth/2+a.clientWidth/2,behavior:RM?"auto":"smooth"});}catch(e){}}});
}
$("#guide .tabsbar").addEventListener("click",function(e){var b=e.target.closest(".tab");if(!b){return;}var h="#"+b.getAttribute("data-go");if(location.hash===h){route();}else{location.hash=h;}});

/* ---------- step view ---------- */
var stopDiagram=null;
function li(arr){return arr.map(function(x){return "<li>"+x+"</li>";}).join("");}
function multi(list){return function(host){
  var stop=null;
  host.innerHTML='<div class="seg subtabs" role="group" aria-label="Switch diagram">'+list.map(function(x,k){return '<button type="button" data-v="'+k+'" aria-pressed="'+(k===0)+'">'+x[0]+'</button>';}).join("")+'</div><div class="d-body"></div>';
  var body=host.lastChild;
  function go(k){if(stop){stop();stop=null;}var nb=document.createElement("div");nb.className="d-body";host.replaceChild(nb,body);body=nb;stop=D[list[k][1]](body)||null;}
  onSeg(host.firstChild,function(v){go(parseInt(v,10));});
  go(0);
  return function(){if(stop){stop();}};
};}
function showStep(id){
  if(stopDiagram){stopDiagram();stopDiagram=null;}
  var s=BY[id],v=$("#view-step"),done=isDone(id),LIST={w:WORD,f:FORD,a:AORD}[s.track]||ORDER,k=LIST.indexOf(id);
  $("#view-map").hidden=true;v.hidden=false;
  var pv=k>0?BY[LIST[k-1]]:null,nx=k<LIST.length-1?BY[LIST[k+1]]:null;
  var prev=pv?'<a class="gbtn" href="#'+pv.id+'">← '+pv.code+' '+pv.short+'</a>':'<a class="gbtn" href="#map">← Map</a>';
  var next=nx?'<a class="gbtn" href="#'+nx.id+'">'+nx.code+' '+nx.short+' →</a>':'<a class="gbtn" href="#map">Back to the map →</a>';
  var trk={m:"Model track",i:"Infra track",w:"World model track",a:"Algorithm atlas"}[s.track];
  v.innerHTML=
    '<div class="step-head">'+
      '<div class="eyebrow"><span class="game">'+s.code+'</span><span>'+(s.track==="m"?trk+' · '+s.region:trk)+'</span><span class="depth">Depth: '+s.depth+'</span>'+(s.adv?'<span class="star">★ Core stage</span>':'')+'</div>'+
      '<h2>'+s.title+'</h2><p class="goal">'+s.goal+'</p>'+
      '<div class="chips"><span class="chip boss"><span class="game">PITFALL</span>'+s.boss+'</span><span class="chip loot"><span class="game">DELIVERABLE</span>'+s.loot+'</span>'+(s.adv?'<span class="chip adv">'+s.adv.replace("★ ","")+'</span>':'')+'</div>'+
    '</div>'+
    '<figure class="diagram"><div class="d-body" id="d-body"></div><figcaption>'+s.cap+'</figcaption></figure>'+
    '<div class="folds">'+
      '<details><summary>Where to find good information</summary><ul>'+li(s.find)+'</ul></details>'+
      '<details><summary>Hands-on: what to build</summary><ul>'+li(s.ex)+'</ul></details>'+
      '<details><summary>Self-check: can you answer these?</summary><ol>'+li(s.quiz)+'</ol></details>'+
      '<details><summary>Sources</summary><ul>'+s.src.map(function(x){return "<li>"+A(x[0],x[1])+"</li>";}).join("")+'</ul></details>'+
    '</div>'+
    '<div class="step-foot">'+prev+'<button type="button" class="gbtn done-btn" id="done-btn" aria-pressed="'+done+'">'+(done?"Done ✓":"Mark as done")+'</button>'+next+'</div>';
  $("#done-btn").addEventListener("click",function(){
    if(isDone(id)){state.done=state.done.filter(function(x){return x!==id;});}else{state.done.push(id);}
    save();var d=isDone(id);this.setAttribute("aria-pressed",String(d));this.textContent=d?"Done ✓":"Mark as done";
    renderTabs(id);renderMeter();
  });
  try{var fn=Array.isArray(s.d)?multi(s.d):D[s.d];stopDiagram=fn($("#d-body"))||null;}
  catch(err){$("#d-body").innerHTML='<p class="readout">The diagram failed to load.</p>';if(window.console){console.error(err);}}
  renderTabs(id);
}
function showMap(){
  if(stopDiagram){stopDiagram();stopDiagram=null;}
  $("#view-step").hidden=true;$("#view-step").innerHTML="";$("#view-map").hidden=false;
  renderMap();renderTabs("map");
}
function route(initial){
  var h=location.hash.replace(/^#/,"");
  /* Other hashes (#contact opens the site's message panel) leave the guide alone. */
  if(BY[h]){showStep(h);}else if(h==="map"||h===""||initial===true){showMap();}else{return;}
  if(initial===true&&!BY[h]){return;}
  var top=$("#guide").getBoundingClientRect().top+window.pageYOffset-mastheadH()-8;
  try{window.scrollTo({top:Math.max(0,top),behavior:"auto"});}catch(e){window.scrollTo(0,Math.max(0,top));}
}
function mastheadH(){var m=document.querySelector(".masthead");return m?m.offsetHeight:0;}

/* ---------- diagrams ---------- */
var D={};
D.lifecycle=function(host){
  var c=clock(),i=0,auto=!RM;
  var PH={pre:["Pretraining","var(--k-pref)"],mid:["Mid-training","var(--k-dist)"],post:["Post-training","var(--k-rl)"],ev:["Evaluation","var(--k-sft)"],serve:["Deployment","var(--k-out)"]};
  var ST=[
    {n:"Data",k:"pre",i:"Common Crawl web pages, code, books, papers",o:"Cleaned, deduplicated training corpus",s:"Trillions of tokens (FineWeb: 15T)",r:"Quality, duplication, eval set contamination",f:"Data pipeline (I6)",g:"m2"},
    {n:"Tokenizer",k:"pre",i:"Text",o:"Sequences of token ids",s:"Vocabulary usually on the order of 100K (Llama 3: 128K)",r:"Compression rate on multilingual text and code",f:"—",g:"m3"},
    {n:"Pretraining",k:"pre",i:"Tokens and the model architecture",o:"Base model",s:"Llama 3: 15T tokens; Qwen3: 36T tokens",r:"Loss spikes, throughput drops, hardware failures",f:"GPU, distributed training, cluster (I1, I2, I6)",g:"m4"},
    {n:"Mid-training",k:"mid",i:"Base model and high-quality data",o:"A base with stronger reasoning and longer context",s:"Learning rate decay phase; context extended to 128k",r:"Eval contamination, forgetting",f:"Distributed training (I2)",g:"m5"},
    {n:"SFT",k:"post",i:"Instruction and dialogue data",o:"A model that holds a conversation and follows formats",s:"Hundreds of thousands to a few million examples",r:"Chat template, overfitting",f:"Distributed training (I2)",g:"m6"},
    {n:"Preference / RL",k:"post",i:"Preference data, verifiable tasks, environments",o:"A model that reasons better and is more useful",s:"Rollout generation often takes most of the time",r:"Reward hacking, training collapse",f:"Inference engine, RL system, sandboxes (I3, I4, I5)",g:"m7"},
    {n:"Distillation",k:"post",i:"A large model or specialist teachers",o:"A smaller or more well-rounded student model",s:"Offline or on-policy",r:"Distribution mismatch, forgetting",f:"Inference engine (I3)",g:"m9"},
    {n:"Evaluation",k:"ev",i:"Checkpoints from every stage",o:"A decision: continue, roll back, or release",s:"Runs throughout",r:"Noise, contamination, benchmark gaming",f:"Eval pipeline (I6)",g:"m10"},
    {n:"Deployment",k:"serve",i:"Final model",o:"Online service",s:"Bounded by KV cache, throughput and latency",r:"Cost, latency, quality regressions",f:"Inference and serving (I3)",g:"i3"}
  ];
  host.innerHTML='<div class="chain">'+ST.map(function(s,k){return (k?'<span class="carr" aria-hidden="true">→</span>':'')+'<button type="button" class="cnode" data-k="'+k+'" style="--c:'+PH[s.k][1]+'">'+s.n+'</button>';}).join("")+'</div>'+
    '<div class="lcard" aria-live="polite"></div><div class="keys">'+Object.keys(PH).map(function(k){return '<span><i style="background:'+PH[k][1]+'"></i>'+PH[k][0]+'</span>';}).join("")+'</div>';
  var nodes=$$(".cnode",host),card=$(".lcard",host);
  function show(k){
    i=k;nodes.forEach(function(n,j){n.classList.toggle("on",j===k);n.classList.toggle("past",j<k);});
    var s=ST[k];
    card.innerHTML='<div class="lc-h"><b>'+s.n+'</b><span style="color:'+PH[s.k][1]+'">'+PH[s.k][0]+'</span></div><dl class="lc-dl"><dt>Input</dt><dd>'+s.i+'</dd><dt>Output</dt><dd>'+s.o+'</dd><dt>Scale</dt><dd>'+s.s+'</dd><dt>Main risks</dt><dd>'+s.r+'</dd><dt>Infra it depends on</dt><dd>'+s.f+'</dd></dl><a class="gbtn" href="#'+s.g+'">Go to this stage →</a>';
  }
  host.addEventListener("click",function(e){var b=e.target.closest(".cnode");if(!b){return;}auto=false;show(parseInt(b.getAttribute("data-k"),10));});
  show(0);
  if(!RM){c.int(2800,function(){if(auto){show((i+1)%ST.length);}});}
  return function(){c.clear();};
};

D.funnel=function(host){
  var c=clock(),i=0,auto=!RM;
  var F=[["Raw HTML (WARC)",100,"Raw Common Crawl captures, full of HTML, navigation bars, ads and boilerplate text."],
    ["Text extraction",62,"Extract the main text from the HTML. FineWeb extracts from WARC files with trafilatura, which works better than using the ready-made WET text."],
    ["Language ID",38,"Classify each document by language and keep only the target language (for example English)."],
    ["Rule filters",24,"Drop documents that are too short, have too many repeated lines, or have unusual symbol ratios (Gopher, C4 and similar rules)."],
    ["Deduplication",14,"MinHash fuzzy deduplication. FineWeb found that global deduplication across all snapshots made results worse, and switched to deduplicating each snapshot separately."],
    ["Quality classifier",7,"Score documents with fastText or a small model and keep only the high scorers (FineWeb-Edu, DCLM). DCLM found that classifier details alone can move a 7B model's MMLU anywhere between 35% and 44%."],
    ["Mixing",7,"Mix web, code, math and multilingual data in proportions chosen by small-model ablations."]];
  var MIX=[["Web",64,"var(--k-pref)"],["Code",16,"var(--k-rl)"],["Math",10,"var(--k-dist)"],["Multilingual",10,"var(--k-sft)"]];
  host.innerHTML='<div class="funnel">'+F.map(function(f,k){return '<button type="button" class="fstep" data-k="'+k+'"><span class="fname">'+f[0]+'</span><span class="ftrack"><span class="fbar" style="--w:'+f[1]+'%"></span></span><span class="fpct">'+f[1]+'%</span></button>';}).join("")+'</div>'+
    '<p class="readout" aria-live="polite"></p>'+
    '<div><div class="mini">Last step: mix by proportion (illustrative)</div><div class="bpp">'+MIX.map(function(m){return '<span style="flex:0 0 '+m[1]+'%;background:'+m[2]+'">'+m[1]+'%</span>';}).join("")+'</div><div class="keys" style="margin-top:6px">'+MIX.map(function(m){return '<span><i style="background:'+m[2]+'"></i>'+m[0]+'</span>';}).join("")+'</div></div>';
  var st=$$(".fstep",host),rd=$(".readout",host);
  function show(k){i=k;st.forEach(function(s,j){s.classList.toggle("on",j===k);s.classList.toggle("shown",j<=k);});rd.innerHTML='<b>'+F[k][0]+'</b>: '+F[k][2];}
  host.addEventListener("click",function(e){var b=e.target.closest(".fstep");if(!b){return;}auto=false;show(parseInt(b.getAttribute("data-k"),10));});
  if(RM){show(F.length-1);}else{show(0);c.int(2600,function(){if(auto){show((i+1)%F.length);}});}
  return function(){c.clear();};
};

D.arch=function(host){
  var c=clock(),i=0,auto=!RM;
  var R=[["Normalization","LayerNorm","RMSNorm","Cheaper to compute, with similar quality; modern models almost all use pre-norm."],
    ["Position encoding","Learned absolute positions","RoPE","Encodes relative position; long-context extension methods (YaRN and others) all build on it."],
    ["Attention heads","Multi-head attention (MHA)","GQA or MLA","Several query heads share one set of K/V (GQA), or K/V are compressed to a low dimension (MLA, DeepSeek): a much smaller KV cache and cheaper inference."],
    ["Attention stability","None","QK-Norm or QK-Clip","Keeps attention logits from blowing up and causing loss spikes. Marin 32B's spikes went away after adding QK-Norm; Kimi K2 uses MuonClip."],
    ["Feed-forward","GELU MLP","SwiGLU","A gated activation; better quality at the same parameter count."],
    ["Capacity","Dense","MoE","Very large total parameter count, but each token activates only a few experts: more capacity for the same compute, at the cost of communication and load balancing."],
    ["Long sequences","Full attention in every layer","Hybrid layers","Some layers switch to sliding-window attention, linear attention or Mamba to cut the cost of long sequences (Gemma 3, Qwen3-Next, Nemotron 3)."]];
  host.innerHTML='<div class="archgrid"><span class="hd">Component</span><span class="hd">GPT-2 (2019)</span><span></span><span class="hd">Modern open models (2025–26)</span>'+R.map(function(r,k){return '<span class="ac lab2" data-k="'+k+'">'+r[0]+'</span><span class="ac old" data-k="'+k+'">'+r[1]+'</span><span class="aarr" data-k="'+k+'" aria-hidden="true">→</span><span class="ac new" data-k="'+k+'">'+r[2]+'</span>';}).join("")+'</div><p class="readout" aria-live="polite"></p>';
  var cells=$$("[data-k]",host),rd=$(".readout",host);
  function show(k){i=k;cells.forEach(function(e){e.classList.toggle("on",parseInt(e.getAttribute("data-k"),10)===k);});rd.innerHTML="<b>"+R[k][0]+"</b>: "+R[k][3];}
  host.addEventListener("click",function(e){var b=e.target.closest("[data-k]");if(!b){return;}auto=false;show(parseInt(b.getAttribute("data-k"),10));});
  show(0);if(!RM){c.int(2600,function(){if(auto){show((i+1)%R.length);}});}
  return function(){c.clear();};
};

D.moe=function(host){
  var c=clock(),bal=true,E=8,TK=6,hist=[];
  host.innerHTML='<div class="ctl">'+segBtns("moe-s","Load balancing",[["1","With load balancing"],["0","Without load balancing"]],"1")+'</div><div class="chart"></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=270,svg=mkSvg($(".chart",host),W,H,"MoE routing sketch: each token picks 2 experts");
  var tx=46,rx=176,ex=320,tokY=[],expY=[],k;
  for(k=0;k<TK;k++){tokY.push(48+k*36);}for(k=0;k<E;k++){expY.push(24+k*30);}
  var routes=S("g",{},svg);
  S("rect",{x:rx-34,y:104,width:68,height:60,rx:10,"class":"router"},svg);txt(svg,rx,139,"Router","lbl","middle");
  tokY.forEach(function(y,j){S("circle",{cx:tx,cy:y,r:12,"class":"tokc"},svg);txt(svg,tx,y+4,"t"+(j+1),"tokt","middle");});
  var boxes=[],bars=[];
  expY.forEach(function(y,j){boxes.push(S("rect",{x:ex,y:y-11,width:72,height:22,rx:6,"class":"exp"},svg));txt(svg,ex+36,y+4,"Expert "+(j+1),"axt","middle");bars.push(S("rect",{x:ex+80,y:y-6,width:0,height:12,rx:3,"class":"loadbar"},svg));});
  txt(svg,ex+80,12,"Recent load","axt");
  function pick(){
    if(!bal&&Math.random()<0.85){return [0,1];}
    var a=Math.floor(Math.random()*E),b=Math.floor(Math.random()*(E-1));if(b>=a){b++;}return [a,b];
  }
  function batch(){
    while(routes.firstChild){routes.removeChild(routes.firstChild);}
    var cnt=[];for(var j=0;j<E;j++){cnt.push(0);}
    tokY.forEach(function(y){pick().forEach(function(e){cnt[e]++;var ey=expY[e];S("path",{d:"M"+(tx+12)+" "+y+" C"+(rx-70)+" "+y+" "+(rx-60)+" 134 "+(rx-34)+" 134 M"+(rx+34)+" 134 C"+(rx+80)+" 134 "+(ex-50)+" "+ey+" "+ex+" "+ey,"class":"route-l"},routes);});});
    hist.push(cnt);if(hist.length>5){hist.shift();}
    var sum=[];for(var e2=0;e2<E;e2++){var s=0;hist.forEach(function(h){s+=h[e2];});sum.push(s);}
    var mean=hist.length*TK*2/E;
    sum.forEach(function(s,j){var hot=s>2*mean;bars[j].setAttribute("width",Math.min(80,s*80/30));bars[j].setAttribute("class","loadbar"+(hot?" hot":""));boxes[j].setAttribute("class","exp"+(hot?" hot":""));});
    $(".readout",host).textContent=bal?"Each token activates only 2 experts, and the load stays roughly even (bars show load over the last 5 batches). DeepSeek-V3 keeps experts balanced by adjusting a bias, with no auxiliary loss.":"Without a balancing constraint, the router quickly favors a few experts: they overload, the others barely get trained, and their parameters are wasted.";
  }
  onSeg($("#moe-s",host),function(v){bal=v==="1";hist=[];batch();});
  batch();if(!RM){c.int(1500,batch);}
  return function(){c.clear();};
};

D.chin=function(host){
  var lc=23;
  host.innerHTML='<div class="ctl"><label for="ch-c">Training compute C <b id="ch-cv"></b></label><input id="ch-c" type="range" min="20" max="26" step="0.1" value="23"></div><div class="chart"></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=290,L=60,R=16,T=20,B=44;
  function X(v){return L+(v-20)/6*(W-L-R);}function Y(v){return T+(1-(v-8)/4)*(H-T-B);}
  var svg=mkSvg($(".chart",host),W,H,"Chinchilla-optimal parameter count versus compute, with several real models");
  var YL=["100M","1B","10B","100B","1T"];
  [8,9,10,11,12].forEach(function(v){ln(svg,L,Y(v),W-R,Y(v),"grid");txt(svg,L-6,Y(v)+4,YL[v-8],"axt","end");});
  [20,22,24,26].forEach(function(v){txt(svg,X(v),H-B+18,"10"+sup(v),"axt","middle");});
  txt(svg,L+(W-L-R)/2,H-8,"Training compute C (FLOPs, log scale)","axt","middle");txt(svg,L,T-8,"Parameters N (log scale)","axt");
  var off=Math.log10(120);
  S("path",{d:"M"+X(20)+" "+Y(0.5*(20-off))+" L"+X(26)+" "+Y(0.5*(26-off)),"class":"l1"},svg);
  txt(svg,X(20.4),Y(0.5*(20.4-off))-12,"Chinchilla optimal (D ≈ 20N)","lbl acc");
  var PTS=[["Chinchilla 70B",5.88e23,70e9,"end",-10,-10],["Llama 3 8B",7.2e23,8e9,"start",10,4],["Llama 3 70B",6.3e24,70e9,"start",10,16],["Llama 3 405B",3.8e25,405e9,"end",-10,-10]];
  PTS.forEach(function(p){var x=X(Math.log10(p[1])),y=Y(Math.log10(p[2]));S("circle",{cx:x,cy:y,r:5,"class":"mk2"},svg);txt(svg,x+p[4],y+p[5],p[0],"lbl",p[3]);});
  var mk=S("circle",{cx:0,cy:0,r:7,"class":"mk"},svg);
  var sl=$("#ch-c",host);
  function upd(){
    var C=Math.pow(10,lc),N=Math.sqrt(C/120),Dt=20*N,h=C/(989e12*0.4)/3600;
    mk.setAttribute("cx",X(lc));mk.setAttribute("cy",Y(Math.log10(N)));
    $("#ch-cv",host).textContent=sci(C)+" FLOPs";
    $(".readout",host).innerHTML="With C ≈ 6ND and D ≈ 20N, the optimum is about <b>"+fmtN(N)+"</b> parameters and <b>"+fmtN(Dt)+"</b> tokens, or about <b>"+Math.round(h).toLocaleString("en-US")+"</b> H100-hours at 40% utilization.<br>For comparison: Llama 3 8B used about 7.2×10²³ FLOPs. At that compute, Chinchilla would train about 77.5B parameters; Llama 3 8B used only 8B parameters and trained each on about 1,875 tokens, because small models are much cheaper to serve. The 405B model lands close to the optimal line.";
  }
  sl.addEventListener("input",function(){lc=parseFloat(sl.value);upd();});
  upd();
};

D.lr=function(host){
  var c=clock(),br=false;
  host.innerHTML='<div class="ctl">'+segBtns("lr-b","Decay branch",[["0","No branch"],["1","Branch a decay off WSD at 50%"]],"0")+'<button type="button" class="gbtn" data-act="replay">Replay</button></div><div class="chart"></div><p class="readout"></p>';
  var W=480,H=320,L=48,R=16;
  function X(t){return L+t*(W-L-R);}
  function Y1(v){return 24+(1-v)*96;}function Y2(v){var y=160+(1-(v-2.2)/1.0)*120;return Math.max(160,Math.min(280,y));}
  function cosL(t){var w=0.02;return t<w?t/w:0.5*(1+Math.cos(Math.PI*(t-w)/(1-w)));}
  function wsd(t){var w=0.02;return t<w?t/w:(t<0.85?1:Math.max(0,1-(t-0.85)/0.15));}
  function brn(t){var w=0.02;return t<w?t/w:(t<0.5?1:Math.max(0,1-(t-0.5)/0.08));}
  function loss(f){return function(t){return 2.2+1.6/(1+25*t)+0.35*f(t);};}
  var holder=$(".chart",host);
  function draw(){
    holder.innerHTML="";
    var svg=mkSvg(holder,W,H,"Illustrative: cosine and WSD learning rate schedules and the resulting loss");
    txt(svg,L,16,"Learning rate","axt");txt(svg,L,152,"Training loss (illustrative)","axt");
    ln(svg,L,Y1(0),W-R,Y1(0),"grid");ln(svg,L,280,W-R,280,"grid");
    txt(svg,L+(W-L-R)/2,H-12,"Training progress →","axt","middle");
    var ps=[];
    ps.push(S("path",{d:pathOf(cosL,0,1,200,X,Y1),"class":"l5 dash"},svg));
    ps.push(S("path",{d:pathOf(wsd,0,1,200,X,Y1),"class":"l1"},svg));
    ps.push(S("path",{d:pathOf(loss(cosL),0.01,1,200,X,Y2),"class":"l5 dash"},svg));
    ps.push(S("path",{d:pathOf(loss(wsd),0.01,1,200,X,Y2),"class":"l1"},svg));
    if(br){ps.push(S("path",{d:pathOf(brn,0.45,0.58,40,X,Y1),"class":"l2"},svg));ps.push(S("path",{d:pathOf(loss(brn),0.45,0.58,40,X,Y2),"class":"l2"},svg));txt(svg,X(0.6),Y2(loss(brn)(0.58))+4,"Branch: usable model at 58%","lbl amb");}
    txt(svg,X(0.62),Y1(cosL(0.62))-8,"cosine","lbl mut");txt(svg,X(0.3),Y1(1)-8,"WSD: warmup → stable → decay","lbl acc");
    txt(svg,X(0.98),Y2(loss(wsd)(0.98))-10,"Similar at the end","lbl mut","end");
    drawIn(ps,c);
  }
  $(".readout",host).textContent="Under WSD the loss falls slowly in the stable phase, then drops quickly once decay starts, ending close to cosine. The benefit is that you do not have to fix the total step count in advance: you can branch a short decay off any checkpoint in the stable phase to get a usable intermediate model, and you can switch to high-quality data during the decay. That is the annealing in M5.";
  onSeg($("#lr-b",host),function(v){br=v==="1";c.clear();draw();});
  $('[data-act="replay"]',host).addEventListener("click",function(){c.clear();draw();});
  draw();
  return function(){c.clear();};
};

D.midtrain=function(host){
  var c=clock(),t=RM?0.96:0;
  var CAT=[["Web","var(--k-pref)"],["Code","var(--k-rl)"],["Math","var(--k-dist)"],["Reasoning / instruction style","var(--k-sft)"],["Multilingual","var(--k-out)"]];
  var PH=[[0,0.75,"Stage 1: main pretraining",[75,12,4,0,9]],[0.75,0.92,"Stage 2: more code and math",[58,16,12,6,8]],[0.92,1,"Stage 3: learning rate decay + high-quality data (annealing)",[38,20,20,16,6]]];
  host.innerHTML='<div class="chart"></div><p class="readout" aria-live="polite"></p><div class="keys">'+CAT.map(function(k){return '<span><i style="background:'+k[1]+'"></i>'+k[0]+'</span>';}).join("")+'<span><i style="background:none;border:1.5px dashed var(--ink)"></i>Learning rate</span></div>';
  var W=480,H=250,L=40,R=16,T=16,B=48;
  function X(v){return L+v*(W-L-R);}function Y(v){return T+(1-v/100)*(H-T-B);}
  var svg=mkSvg($(".chart",host),W,H,"Illustrative: how the data mix and learning rate change over training");
  PH.forEach(function(p){var acc=0;p[3].forEach(function(v,j){if(v<=0){return;}S("rect",{x:X(p[0]),y:Y(acc+v),width:X(p[1])-X(p[0]),height:Y(acc)-Y(acc+v),style:"fill:"+CAT[j][1],opacity:"0.85"},svg);acc+=v;});});
  [0.75,0.92].forEach(function(b){ln(svg,X(b),T,X(b),H-B,"vline");});
  function lrf(x){return x<0.02?x/0.02*100:(x<0.92?100:100*(1-(x-0.92)/0.08));}
  S("path",{d:pathOf(lrf,0,1,200,X,Y),"class":"l5 dash",style:"stroke:var(--ink);stroke-width:2"},svg);
  txt(svg,X(0.37),H-B+18,"Stage 1","axt","middle");txt(svg,X(0.835),H-B+18,"Stage 2","axt","middle");txt(svg,X(0.96),H-B+18,"3","axt","middle");
  txt(svg,L+(W-L-R)/2,H-10,"Progress → (then context extension; SmolLM3: 4k → 128k)","axt","middle");
  [0,50,100].forEach(function(v){txt(svg,L-6,Y(v)+4,v+"%","axt","end");});
  var cur=ln(svg,X(t),T,X(t),H-B,"cursor");
  function upd(){
    cur.setAttribute("x1",X(t));cur.setAttribute("x2",X(t));
    var p=PH[0];PH.forEach(function(q){if(t>=q[0]){p=q;}});
    $(".readout",host).innerHTML="<b>"+p[2]+"</b>: "+p[3].map(function(v,j){return v?CAT[j][0]+" "+v+"%":"";}).filter(Boolean).join(", ")+"."+(p===PH[2]?" Swapping in the highest-quality data while the learning rate decays gives the largest gain.":"");
  }
  upd();
  if(!RM){var hold=0;c.int(60,function(){if(t>=1){hold++;if(hold>40){t=0;hold=0;}}else{t=Math.min(1,t+0.006);}upd();});}
  return function(){c.clear();};
};

D.recipes=function(host){
  var c=clock(),i=0,playing=!RM;
  var E=[
    {y:"2022",n:"InstructGPT",s:[["SFT","sft"],["Reward model","pref"],["PPO","rl"]],t:"The classic three steps: SFT → reward model → PPO."},
    {y:"2023",n:"Llama 2",s:[["SFT","sft"],["Two reward models (helpful / safe)","pref"],["Rejection sampling","sft"],["PPO","rl"],["Several rounds","loop"]],t:"Several rounds of rejection sampling plus PPO, with one reward model for helpfulness and one for safety."},
    {y:"2024",n:"Llama 3",s:[["Reward model","pref"],["Rejection sampling → SFT","sft"],["DPO","pref"],["Several rounds","loop"]],t:"Several rounds of reward-model filtering, SFT and DPO, with no online RL."},
    {y:"2024",n:"Tülu 3",s:[["SFT","sft"],["DPO","pref"],["RLVR","rl"]],t:"Simplified to SFT → DPO → RL with verifiable rewards. The term RLVR comes from this paper."},
    {y:"2025",n:"DeepSeek-R1",s:[["Cold-start SFT","sft"],["Reasoning RL","rl"],["Rejection-sampling SFT","sft"],["RL for all scenarios","rl"]],t:"Large-scale RL becomes the core; SFT only handles the cold start and cleans up the format."},
    {y:"2025",n:"Olmo 3",s:[["SFT","sft"],["DPO","pref"],["RLVR","rl"]],t:"The reasoning version of the Tülu 3 recipe, with data, code and intermediate checkpoints all public."},
    {y:"2026",n:"MOPD",s:[["Math teacher|Code teacher|Agent teacher","stack"],["On-policy distillation (reverse KL)","dist"],["One student model","out"]],t:"First train a specialist model for each domain, then distill them back into one model, token by token, on the student's own rollouts. MiMo-V2-Flash proposed it first; DeepSeek V4 and Nemotron 3 Ultra extended it to a dozen or so teachers. Not every lab does this yet."}
  ];
  var KEYS='<span><i style="background:var(--k-sft)"></i>SFT-like</span><span><i style="background:var(--k-pref)"></i>Preference / reward model</span><span><i style="background:var(--k-rl)"></i>Online RL</span><span><i style="background:var(--k-dist)"></i>Distillation</span>';
  host.innerHTML='<div class="eras" role="group" aria-label="Choose a year">'+E.map(function(e,k){return '<button type="button" class="era" data-i="'+k+'" aria-pressed="false"><span class="y">'+e.y+'</span><span class="nm">'+e.n+'</span></button>';}).join("")+'</div>'+
    '<div class="pipe"></div><p class="readout" aria-live="polite"></p>'+
    '<div class="ctl spread"><div class="keys">'+KEYS+'</div><button type="button" class="gbtn" data-act="play"></button></div>';
  var pipe=$(".pipe",host),note=$(".readout",host),btn=$('[data-act="play"]',host);
  function show(k){
    i=k;
    $$(".era",host).forEach(function(b){b.setAttribute("aria-pressed",String(parseInt(b.getAttribute("data-i"),10)===k));});
    var h="",n=0;
    E[k].s.forEach(function(st,j){
      if(j>0){h+='<span class="parr" style="--i:'+n+'" aria-hidden="true">→</span>';n++;}
      if(st[1]==="stack"){h+='<span class="stack3">'+st[0].split("|").map(function(x){return '<span class="stage dist" style="--i:'+n+'">'+x+'</span>';}).join("")+'</span>';}
      else{h+='<span class="stage '+st[1]+'" style="--i:'+n+'">'+st[0]+'</span>';}
      n++;
    });
    pipe.innerHTML=h;note.textContent=E[k].t;
    var eb=$('.era[data-i="'+k+'"]',host),bar=$(".eras",host);
    if(eb&&bar){try{bar.scrollTo({left:eb.offsetLeft-bar.clientWidth/2+eb.clientWidth/2,behavior:"smooth"});}catch(e){}}
  }
  function setPlay(p){playing=p;btn.textContent=p?"Pause":"Autoplay";c.clear();if(p){c.int(3800,function(){show((i+1)%E.length);});}}
  host.addEventListener("click",function(ev){var b=ev.target.closest(".era");if(b){setPlay(false);show(parseInt(b.getAttribute("data-i"),10));}});
  btn.addEventListener("click",function(){setPlay(!playing);});
  show(0);setPlay(playing);
  return function(){c.clear();};
};

D.passk=function(host){
  var W=480,H=290,L=48,R=20,T=24,B=46;
  function X(x){return L+x/8*(W-L-R);}function Y(y){return T+(1-y)*(H-T-B);}
  function base(x){return 0.30+0.58*(1-Math.exp(-x/3.2));}function rl(x){return 0.52+0.22*(1-Math.exp(-x/2.2));}
  host.innerHTML='<div class="chart"></div>'+
    '<div class="famlist">'+
      '<div class="famrow"><span class="fm">Qwen2.5-Math</span><span class="fr">RLVR with random or incorrect rewards</span><span class="farr2" aria-hidden="true"></span><span class="fo up">MATH score rises clearly</span></div>'+
      '<div class="famrow"><span class="fm">Llama 3 / OLMo 2</span><span class="fr">The same rewards</span><span class="farr2" aria-hidden="true"></span><span class="fo flat">Little to no gain</span></div>'+
    '</div><div class="ctl"><button type="button" class="gbtn" data-act="replay">Replay</button></div>';
  var svg=mkSvg($(".chart",host),W,H,"Illustrative: pass@k before and after RL; RL is higher at small k, and the base model overtakes at large k");
  [0,0.25,0.5,0.75,1].forEach(function(v){ln(svg,L,Y(v),W-R,Y(v),"grid");txt(svg,L-8,Y(v)+4,Math.round(v*100)+"%","axt","end");});
  [0,2,4,6,8].forEach(function(x){txt(svg,X(x),H-B+18,String(Math.pow(2,x)),"axt","middle");});
  txt(svg,L+(W-L-R)/2,H-8,"k: samples per problem (log scale)","axt","middle");txt(svg,L,T-10,"pass@k","axt");
  var pb=S("path",{d:pathOf(base,0,8,80,X,Y),"class":"ln-base"},svg),pr=S("path",{d:pathOf(rl,0,8,80,X,Y),"class":"ln-rl"},svg);
  var xc=0;for(var i=0;i<=800;i++){var x=i/100;if(base(x)>=rl(x)){xc=x;break;}}
  var cross=S("g",{"class":"cross"},svg);
  S("circle",{cx:X(xc),cy:Y(base(xc)),r:5,"class":"crossdot"},cross);
  txt(cross,X(xc)+10,Y(base(xc))+24,"Base overtakes past k≈"+Math.round(Math.pow(2,xc)),"lbl bad");
  txt(svg,X(0)+8,Y(rl(0))-12,"After RL: higher pass@1","lbl acc");
  txt(svg,X(8)-2,Y(base(8))-12,"Base: more samples cover more problems","lbl mut","end");
  var c=clock();
  function play(){if(RM){return;}cross.style.opacity="0";c.clear();drawIn([pb,pr],c,function(){cross.style.opacity="1";});}
  $('[data-act="replay"]',host).addEventListener("click",play);
  play();
  return function(){c.clear();};
};

D.chat=function(host){
  var c=clock();
  var T=[["<|im_start|>","sys","h"],["system","sys","h"],["You are an assistant","sys","c"],["<|im_end|>","sys","e"],["<|im_start|>","user","h"],["user","user","h"],["What is 7×8?","user","c"],["<|im_end|>","user","e"],["<|im_start|>","asst","h"],["assistant","asst","h"],["7×8","asst","c"],["=","asst","c"],["56","asst","c"],["<|im_end|>","asst","eos"]];
  var M={
    ok:{name:"Correct",loss:function(t){return t[1]==="asst"&&(t[2]==="c"||t[2]==="eos");},out:[["7×8=56",""],["<|im_end|>","okc"]],v:"✓ Loss only on the assistant's answer and the end token: the model learns where to stop."},
    nomask:{name:"Forgot the mask",loss:function(){return true;},out:[["7×8=56<|im_end|>",""],["<|im_start|>user And 8×9?<|im_end|><|im_start|>assistant 72…","bad"]],v:"✗ The system prompt and the user's turn are in the loss too: the model learns to speak for the user and starts asking and answering its own questions."},
    noeos:{name:"Dropped EOS",loss:function(t){return t[1]==="asst"&&t[2]==="c";},out:[["7×8=56",""],[". Also 7×9=63, 7×10=70, 7×11=77, 7×12=…","bad"]],v:"✗ The end token was never trained: the model does not know when to stop and writes until the length limit. The training loss looks completely normal."}
  };
  var order=["ok","nomask","noeos"],mode="ok",auto=!RM;
  host.innerHTML='<div class="ctl spread"><div class="seg" role="group" aria-label="Training setup">'+order.map(function(k){return '<button type="button" data-k="'+k+'" aria-pressed="'+(k===mode)+'">'+M[k].name+'</button>';}).join("")+'</div><span class="mini ch-count" style="margin:0"></span></div>'+
    '<div><div class="mini">Training example (ChatML format); blue tokens count toward the loss</div><div class="toks">'+T.map(function(t){return '<span class="tk r-'+t[1]+'">'+esc(t[0])+'</span>';}).join("")+'</div></div>'+
    '<div><div class="mini">At inference, the model\'s output for the same question</div><div class="gen" aria-live="polite"></div></div>'+
    '<p class="readout ch-v"></p>'+
    '<div class="keys"><span><i style="background:var(--k-out)"></i>system</span><span><i style="background:var(--k-pref)"></i>user</span><span><i style="background:var(--k-rl)"></i>assistant</span></div>';
  var tks=$$(".tk",host),gen=$(".gen",host),cnt=$(".ch-count",host),vv=$(".ch-v",host),seg=$(".seg",host);
  function run(){
    c.clear();var m=M[mode],n=0,i=0;
    tks.forEach(function(e){e.classList.remove("loss","scan");});gen.innerHTML="";vv.textContent="";
    function finish(){
      var tot=T.filter(m.loss).length;cnt.textContent="In the loss: "+tot+" / "+T.length+" tokens";
      if(RM){gen.innerHTML=m.out.map(function(s){return '<span class="'+s[1]+'">'+esc(s[0])+'</span>';}).join("");vv.textContent=m.v;return;}
      var spans=m.out.map(function(s){var sp=document.createElement("span");sp.className=s[1];gen.appendChild(sp);return sp;}),si=0,ci=0;
      c.int(45,function(){
        if(si>=m.out.length){c.clear();vv.textContent=m.v;if(auto){c.out(2800,function(){mode=order[(order.indexOf(mode)+1)%order.length];setPressed(seg,"data-k",mode);run();});}return;}
        var s=m.out[si][0];ci++;spans[si].textContent=s.slice(0,ci);if(ci>=s.length){si++;ci=0;}
      });
    }
    if(RM){tks.forEach(function(e,k){if(m.loss(T[k])){e.classList.add("loss");}});finish();return;}
    c.int(170,function(){
      tks.forEach(function(e){e.classList.remove("scan");});
      if(i>=tks.length){c.clear();finish();return;}
      tks[i].classList.add("scan");if(m.loss(T[i])){tks[i].classList.add("loss");n++;}
      cnt.textContent="In the loss: "+n+" / "+T.length+" tokens";i++;
    });
  }
  seg.addEventListener("click",function(e){var b=e.target.closest("button");if(!b){return;}auto=false;mode=b.getAttribute("data-k");setPressed(seg,"data-k",mode);run();});
  run();
  return function(){c.clear();};
};

D.overopt=function(host){
  var c=clock(),W=480,H=270,L=48,R=20,T=20,B=44,DM=10,YM=1.25,d=RM?7:0,playing=!RM;
  function X(v){return L+v/DM*(W-L-R);}function Y(v){return T+(1-v/YM)*(H-T-B);}
  function proxy(v){return 0.12*v;}function gold(v){return v*(0.22-0.022*v);}
  host.innerHTML='<div class="chart"></div><div class="ctl"><label for="oo-d">Optimization strength</label><input id="oo-d" type="range" min="0" max="100" value="'+(d*10)+'"><button type="button" class="gbtn" data-act="play"></button></div><p class="readout" aria-live="polite"></p>';
  var svg=mkSvg($(".chart",host),W,H,"Illustrative: the proxy reward keeps rising while true quality rises and then falls");
  [0,0.5,1].forEach(function(v){ln(svg,L,Y(v),W-R,Y(v),"grid");txt(svg,L-8,Y(v)+4,v.toFixed(1),"axt","end");});
  txt(svg,L+(W-L-R)/2,H-10,"Distance from the initial policy (√KL) →","axt","middle");txt(svg,L,T-6,"reward","axt");
  ln(svg,X(5),Y(0),X(5),Y(1.2),"peak");txt(svg,X(5)+6,Y(0)-8,"Where to stop","lbl mut");
  S("path",{d:pathOf(proxy,0,10,100,X,Y),"class":"ln-proxy"},svg);S("path",{d:pathOf(gold,0,10,100,X,Y),"class":"ln-gold"},svg);
  txt(svg,X(10)-4,Y(1.2)+20,"Proxy reward (RM score)","lbl acc","end");txt(svg,X(8.6),Y(gold(8.6))+22,"True quality","lbl ok","middle");
  var gl=ln(svg,X(d),Y(0),X(d),Y(YM),"guide"),dp=S("circle",{cx:X(d),cy:Y(proxy(d)),r:6,"class":"dp"},svg),dg=S("circle",{cx:X(d),cy:Y(gold(d)),r:6,"class":"dg"},svg);
  var sl=$("#oo-d",host),rd=$(".readout",host),btn=$('[data-act="play"]',host);
  function draw(){
    gl.setAttribute("x1",X(d));gl.setAttribute("x2",X(d));
    dp.setAttribute("cx",X(d));dp.setAttribute("cy",Y(proxy(d)));dg.setAttribute("cx",X(d));dg.setAttribute("cy",Y(gold(d)));
    sl.value=Math.round(d*10);
    var msg=d<4.5?"Both curves rise together; the optimization is working.":(d<=5.5?"True quality has peaked; this is where to stop.":"The proxy score is still rising but true quality is falling: the model is exploiting the reward model, most often by writing longer and longer answers.");
    rd.innerHTML='Proxy reward <b class="k">'+proxy(d).toFixed(2)+'</b> · True quality <b class="k">'+gold(d).toFixed(2)+'</b> · Average answer length about <b class="k">'+Math.round(180+40*d)+'</b> tokens<br>'+msg;
  }
  function setPlay(p){playing=p;btn.textContent=p?"Pause":"Play";c.clear();if(p){var hold=0;c.int(40,function(){if(d>=DM){hold++;if(hold>40){d=0;hold=0;}}else{d=Math.min(DM,d+0.06);}draw();});}}
  sl.addEventListener("input",function(){setPlay(false);d=parseInt(sl.value,10)/10;draw();});
  btn.addEventListener("click",function(){setPlay(!playing);});
  draw();setPlay(playing);
  return function(){c.clear();};
};

D.grpo=function(host){
  var c=clock(),cnt=3,norm=true,sign=1,high=false,auto=!RM,P=[2,5,0,7,3,1,6,4];
  host.innerHTML='<div class="sub2">① Sample 8 answers to one problem and compare them within the group to get advantages</div>'+
    '<div class="ctl"><label for="g-c">Correct answers out of 8: <b class="g-cv"></b></label><input id="g-c" type="range" min="0" max="8" value="3">'+
    '<div class="seg g-norm" role="group" aria-label="Advantage normalization"><button type="button" data-n="1" aria-pressed="true">GRPO: divide by group std</button><button type="button" data-n="0" aria-pressed="false">Dr. GRPO: no division</button></div></div>'+
    '<div><div class="advbars"></div><div class="rws"></div></div>'+
    '<p class="readout g-r" aria-live="polite"></p>'+
    '<div class="sub2" style="margin-top:6px">② Once the importance ratio r leaves the clip range, the gradient is 0</div>'+
    '<div class="ctl"><div class="seg g-sign" role="group" aria-label="Advantage sign"><button type="button" data-s="1" aria-pressed="true">Advantage A &gt; 0</button><button type="button" data-s="-1" aria-pressed="false">Advantage A &lt; 0</button></div>'+
    '<div class="seg g-high" role="group" aria-label="Clip upper bound"><button type="button" data-h="0" aria-pressed="true">Upper bound 1 + 0.2</button><button type="button" data-h="1" aria-pressed="false">clip-higher: 1 + 0.28</button></div></div>'+
    '<div class="chart g-clip"></div><p class="readout g-cr"></p>';
  var advEl=$(".advbars",host),rwEl=$(".rws",host),h="",r2="",k;
  for(k=0;k<8;k++){h+='<div class="col"><div class="bar pos" style="height:0%"></div><span class="v" style="top:calc(50% - 16px)"></span></div>';r2+='<span>#'+(k+1)+'<b></b></span>';}
  advEl.innerHTML=h;rwEl.innerHTML=r2;
  var slider=$("#g-c",host);
  function drawA(){
    var r=P.map(function(p){return p<cnt?1:0;}),m=cnt/8,sd=Math.sqrt(r.reduce(function(a,x){return a+(x-m)*(x-m);},0)/7);
    var Av=r.map(function(x){return norm?(sd>0?(x-m)/sd:0):(x-m);}),sc=norm?3:1;
    $$(".col",advEl).forEach(function(col,i){
      var a=Av[i],hh=Math.min(Math.abs(a)/sc,1)*44,bar=col.firstChild,v=col.lastChild;
      bar.className="bar "+(a>=0?"pos":"neg");bar.style.height=hh+"%";
      v.textContent=(a>=0?"+":"−")+Math.abs(a).toFixed(2);
      v.style.top=a>=0?"calc("+(50-hh)+"% - 16px)":"calc("+(50+hh)+"% + 2px)";
    });
    $$("b",rwEl).forEach(function(b,i){b.textContent=r[i]?"✓":"✗";b.className=r[i]?"y":"n";});
    $(".g-cv",host).textContent=cnt;slider.value=cnt;
    var z=(cnt===0||cnt===8);
    $(".g-r",host).innerHTML=z
      ?"Every answer got the same score, so <b>all advantages are 0 and this problem contributes no gradient</b>. DAPO's dynamic sampling filters such problems out and samples new ones in their place."
      :"Group mean <span class=\"k\">"+m.toFixed(3)+"</span>"+(norm?", std <span class=\"k\">"+sd.toFixed(3)+"</span>":"")+". Correct answers are pushed up and wrong ones pushed down. "+(norm?"The fewer correct answers, the larger each correct answer's advantage: dividing by std amplifies very hard and very easy problems.":"Without dividing by std, problem difficulty no longer changes the scale of the advantages (the vertical scale differs from the GRPO setting).");
  }
  var W=480,H=230,L=48,R=16,T=16,B=40,r0=0.5,r1=1.6,dotEl=null,dotTx=null,flatRange=[0,0],t=0,Yf=null,objf=null;
  function X(r){return L+(r-r0)/(r1-r0)*(W-L-R);}
  function drawClip(){
    var holder=$(".g-clip",host);holder.innerHTML="";
    var eh=high?0.28:0.2,lo=0.8,hi=1+eh,yr=sign>0?[0.4,1.4]:[-1.65,-0.45];
    Yf=function(y){return T+(1-(y-yr[0])/(yr[1]-yr[0]))*(H-T-B);};
    objf=function(r){var cl=Math.min(Math.max(r,lo),hi);return sign>0?Math.min(r,cl):-Math.max(r,cl);};
    var svg=mkSvg(holder,W,H,"Illustrative PPO/GRPO clipped objective");
    flatRange=sign>0?[hi,r1]:[r0,lo];
    S("rect",{x:X(flatRange[0]),y:T,width:X(flatRange[1])-X(flatRange[0]),height:H-T-B,"class":"flat"},svg);
    txt(svg,(X(flatRange[0])+X(flatRange[1]))/2,H-B-28,"Zero gradient","flatt","middle");
    [0.6,0.8,1.0,1.2,1.4,1.6].forEach(function(v){txt(svg,X(v),H-B+18,v.toFixed(1),"axt","middle");});
    txt(svg,L+(W-L-R)/2,H-6,"r = new policy prob / old policy prob","axt","middle");
    [lo,hi].forEach(function(v,k2){ln(svg,X(v),T,X(v),H-B,"vline");txt(svg,X(v)+(k2?4:-4),H-B-6,k2?"1+ε":"1−ε","axt",k2?"start":"end");});
    S("path",{d:pathOf(function(r){return sign*r;},r0,r1,110,X,Yf),"class":"raw"},svg);S("path",{d:pathOf(objf,r0,r1,110,X,Yf),"class":"obj"},svg);
    txt(svg,L+6,sign>0?T+16:H-B-24,"Dashed: unclipped r·A","lbl mut");
    dotEl=S("circle",{cx:X(1),cy:Yf(objf(1)),r:7,"class":"dot"},svg);
    dotTx=txt(svg,X(1),Yf(objf(1))-14,"","lbl","middle");
    $(".g-cr",host).innerHTML=sign>0
      ?"With A &gt; 0, once r exceeds 1+ε ("+hi.toFixed(2)+") there is no further reward, which keeps a single step from pushing a good answer's probability up too hard. "+(high?"clip-higher widens the upper bound to 1.28 so low-probability good tokens can grow more, which counters entropy collapse (DAPO).":"DAPO found that when the upper bound is too tight, low-probability tokens are hard to raise and entropy keeps falling over training.")
      :"With A &lt; 0, once r drops below 1−ε ("+lo.toFixed(2)+") there is no further penalty, which keeps a single step from pushing a bad answer's probability all the way down.";
    placeDot();
  }
  function placeDot(){
    if(!dotEl){return;}
    var r=RM?1.45:1.05+0.52*Math.sin(t),zero=r>=flatRange[0]&&r<=flatRange[1];
    dotEl.setAttribute("cx",X(r));dotEl.setAttribute("cy",Yf(objf(r)));dotEl.setAttribute("class","dot"+(zero?" zero":""));
    dotTx.setAttribute("x",Math.min(Math.max(X(r),L+30),W-R-30));dotTx.setAttribute("y",Yf(objf(r))-14);dotTx.textContent=zero?"Zero gradient":"Has gradient";
    dotTx.setAttribute("class","lbl "+(zero?"bad":"acc"));
  }
  slider.addEventListener("input",function(){auto=false;cnt=parseInt(slider.value,10);drawA();});
  $(".g-norm",host).addEventListener("click",function(e){var b=e.target.closest("button");if(!b){return;}auto=false;norm=b.getAttribute("data-n")==="1";setPressed(this,"data-n",b.getAttribute("data-n"));drawA();});
  $(".g-sign",host).addEventListener("click",function(e){var b=e.target.closest("button");if(!b){return;}sign=parseInt(b.getAttribute("data-s"),10);setPressed(this,"data-s",String(sign));drawClip();});
  $(".g-high",host).addEventListener("click",function(e){var b=e.target.closest("button");if(!b){return;}high=b.getAttribute("data-h")==="1";setPressed(this,"data-h",b.getAttribute("data-h"));drawClip();});
  drawA();drawClip();
  if(!RM){
    var seq=[3,1,6,8,0,4],si=0;
    c.int(2400,function(){if(!auto){return;}si=(si+1)%seq.length;cnt=seq[si];drawA();});
    c.int(40,function(){t+=0.035;placeDot();});
  }
  return function(){c.clear();};
};

D.verify=function(host){
  var c=clock(),ci=0,step=0,auto=!RM;
  var CASES=[
    {q:"Which region had the highest sales in 2025?",o:"SELECT region FROM sales\nWHERE year = 2025\nGROUP BY region\nORDER BY SUM(amount) DESC\nLIMIT 1;",j:"Result “East”\n= reference “East”",r:1,n:"Normal: the execution result matches the reference answer.",w:false},
    {q:"Which region had the highest sales in 2025?",o:"SELEC region FORM sales …",j:"Execution error",r:0,n:"Syntax error, straight to 0. These should be rare; if they are not, go back and check SFT first.",w:false},
    {q:"Which region had the highest sales in 2025?",o:"SELECT 'East';",j:"Result “East”\n= reference “East”",r:1,n:"⚠ Reward hacking: hardcoding the answer also earns full marks. Fix: execute on several perturbed copies of the database and compare (the Spider test-suite approach).",w:true},
    {q:"A proof problem, graded by an LLM judge",o:"Solution:",j:"Judge: correct",r:1,n:"⚠ Outputting nothing but an opening word fooled the judge (One Token to Fool LLM-as-a-Judge). Fix: use a rule-based verifier whenever you can; test any judge on adversarial examples before using it.",w:true}
  ];
  host.innerHTML='<div class="flowrow">'+
    '<div class="fbox"><span class="flab">Problem</span><div class="v-q"></div></div><div class="farr" aria-hidden="true">→</div>'+
    '<div class="fbox"><span class="flab">Model output</span><code class="v-o"></code></div><div class="farr" aria-hidden="true">→</div>'+
    '<div class="fbox"><span class="flab">Execute / grade</span><code class="v-j"></code></div><div class="farr" aria-hidden="true">→</div>'+
    '<div class="fbox"><span class="flab">Reward</span><div class="rwv v-r"></div></div></div>'+
    '<div class="ctl spread"><div class="cases">'+CASES.map(function(x,k){return '<button type="button" data-c="'+k+'" class="'+(x.w?"w":"")+'" aria-pressed="false" aria-label="Case '+(k+1)+'">'+(k+1)+'</button>';}).join("")+'</div><span class="mini" style="margin:0">Red circles are reward hacking cases</span></div>'+
    '<p class="readout v-n" aria-live="polite"></p>';
  var boxes=$$(".fbox",host),F=["q","o","j","r"];
  function el(id){return $(".v-"+id,host);}
  function show(k,full){
    ci=k;var x=CASES[k];
    el("q").textContent=x.q;el("o").textContent=x.o;el("j").textContent=x.j;
    el("r").textContent=String(x.r);el("r").className="rwv v-r "+(x.r?"one":"zero");
    var nn=el("n");nn.textContent=x.n;nn.className="readout v-n"+(x.w?" note-warn":"");
    setPressed($(".cases",host),"data-c",String(k));
    boxes.forEach(function(b,i){b.classList.toggle("on",full?i===3:false);});
    F.forEach(function(id,i){el(id).style.visibility=(full||i===0)?"visible":"hidden";});
    nn.style.visibility=full?"visible":"hidden";
  }
  function tick(){
    if(step<4){boxes.forEach(function(b,i){b.classList.toggle("on",i===step);});el(F[step]).style.visibility="visible";if(step===3){el("n").style.visibility="visible";}step++;}
    else if(step<8){step++;}
    else{step=0;show((ci+1)%CASES.length,false);}
  }
  $(".cases",host).addEventListener("click",function(e){var b=e.target.closest("button");if(!b){return;}auto=false;c.clear();show(parseInt(b.getAttribute("data-c"),10),true);});
  if(RM){show(2,true);}else{show(0,false);c.int(700,function(){if(auto){tick();}});}
  return function(){c.clear();};
};

D.gate=function(host){
  var q=0.95,unsafe=true;
  host.innerHTML='<div class="ctl"><label for="gt-q">Answer quality <b class="gt-qv"></b></label><input id="gt-q" type="range" min="0" max="100" value="95">'+segBtns("gt-s","Policy violation",[["1","Violates policy"],["0","Compliant"]],"1")+'</div>'+
    '<div class="gates"><div class="gate"><div class="gname">Weighted average: 0.8 × quality + 0.2 × compliance</div><div class="meterbar"><i class="gt-a"></i></div><b class="k gt-av"></b></div>'+
    '<div class="gate"><div class="gname">Gate: a violation scores 0, otherwise score by quality</div><div class="meterbar"><i class="gt-b"></i></div><b class="k gt-bv"></b></div></div>'+
    '<p class="readout" aria-live="polite"></p>';
  function upd(){
    var a=0.8*q+0.2*(unsafe?0:1),b=unsafe?0:q;
    $(".gt-qv",host).textContent=q.toFixed(2);
    var ia=$(".gt-a",host),ib=$(".gt-b",host);ia.style.width=(a*100)+"%";ib.style.width=(b*100)+"%";
    ia.className="gt-a "+(unsafe?"bad":"acc");ib.className="gt-b "+(unsafe?"bad":"acc");
    $(".gt-av",host).textContent=a.toFixed(2);$(".gt-bv",host).textContent=b.toFixed(2);
    $(".readout",host).textContent=unsafe?"A well-written answer that violates policy still gets "+a.toFixed(2)+" under the weighted average: the model learns that good writing can offset a violation. Under the gate it scores 0, and that path is closed.":"When the answer is compliant, the two schemes barely differ. The difference appears only on violating samples, which is exactly where the danger lies.";
  }
  $("#gt-q",host).addEventListener("input",function(){q=parseInt(this.value,10)/100;upd();});
  onSeg($("#gt-s",host),function(v){unsafe=v==="1";upd();});
  upd();
};

D.distill=function(host){
  var c=clock(),mode="off",auto=!RM,dom=0;
  var GOOD=["Since","3x","=","20","−","5",",","so","x","=","5"];
  var DOM=[
    {t:"Math teacher",p:"Solve 3x + 5 = 20",s:["Since","3x","=","20","−","5",",","so","x","=","6"],bad:10,fix:"5"},
    {t:"Code teacher",p:"Write a function that adds two numbers",s:["def","add(a,","b):","return","a","-","b"],bad:5,fix:"+"},
    {t:"Agent teacher",p:"Look up Q3 revenue and summarize it",s:["call","search(","\"Q3 revenue\"",")","→","invent","the","numbers"],bad:5,fix:"read the result"}
  ];
  var MODES=[["off","Offline distillation (SFT)"],["on","On-policy distillation"],["mopd","Multi-teacher MOPD"]];
  var TXT={
    off:"Offline distillation is SFT on data the teacher wrote: the student only sees the teacher's correct trajectories and never the states it reaches after its own mistakes, so training and inference see different distributions.",
    on:"On-policy distillation: the student generates and the teacher scores every token (per-token reverse KL). The signal lands on whichever token went wrong, so it is dense and matches the student's own distribution.",
    mopd:"Multi-teacher on-policy distillation (MOPD): first train a specialist teacher for each domain, then route each prompt to its domain's teacher and distill those skills back into one student."
  };
  host.innerHTML='<div class="seg ds-seg" role="group" aria-label="Distillation method">'+MODES.map(function(m){return '<button type="button" data-m="'+m[0]+'" aria-pressed="'+(m[0]===mode)+'">'+m[1]+'</button>';}).join("")+'</div>'+
    '<div class="teachers"></div><div class="mini ds-p" style="margin:0"></div><div class="mini ds-leg" style="margin:0"></div>'+
    '<div class="pairs" aria-live="polite"></div><p class="readout ds-r"></p>'+
    '<div class="fgt"><span>SFT</span><div><div class="b fg1" style="width:0%"></div></div><span>On-policy RL / distillation</span><div><div class="b lo fg2" style="width:0%"></div></div></div>'+
    '<div class="mini" style="margin:0">Bars: KL from the base model on the new task; larger means more forgetting (qualitative, based on the findings of RL\'s Razor).</div>';
  var seg=$(".ds-seg",host),pairs=$(".pairs",host);
  function run(){
    c.clear();pairs.innerHTML="";
    var tch=$(".teachers",host),items,lab;
    if(mode==="mopd"){tch.innerHTML=DOM.map(function(d,k){return '<span class="tch'+(k===dom?" on":"")+'">'+d.t+'</span>';}).join("");}
    else{tch.innerHTML='<span class="tch on">One teacher</span>';}
    var d=mode==="mopd"?DOM[dom]:DOM[0];
    $(".ds-p",host).textContent="Prompt: "+d.p;
    if(mode==="off"){lab="Each column: the teacher's token on top, the student copying it below";items=GOOD.map(function(tk){return '<span class="pair"><span class="tk t">'+esc(tk)+'</span><span class="gd cp">copy</span></span>';});}
    else{lab="Each column: the student's own token on top, the teacher's per-token score below";items=d.s.map(function(tk,k){var bad=k===d.bad;return '<span class="pair"><span class="tk s'+(bad?" err":"")+'">'+esc(tk)+'</span><span class="gd '+(bad?"bad":"ok")+'">'+(bad?"✗ expected: "+esc(d.fix):"✓")+'</span></span>';});}
    $(".ds-leg",host).textContent=lab;$(".ds-r",host).textContent=TXT[mode];
    $(".fg1",host).style.width="82%";$(".fg2",host).style.width="30%";
    if(RM){pairs.innerHTML=items.join("");return;}
    var i=0;
    c.int(260,function(){
      if(i<items.length){pairs.insertAdjacentHTML("beforeend",items[i]);i++;return;}
      c.clear();if(!auto){return;}
      c.out(2600,function(){
        if(mode==="mopd"&&dom<DOM.length-1){dom++;}
        else{var k=MODES.map(function(m){return m[0];}).indexOf(mode);mode=MODES[(k+1)%MODES.length][0];dom=0;setPressed(seg,"data-m",mode);}
        run();
      });
    });
  }
  seg.addEventListener("click",function(e){var b=e.target.closest("button");if(!b){return;}auto=false;mode=b.getAttribute("data-m");dom=0;setPressed(seg,"data-m",mode);run();});
  run();
  return function(){c.clear();};
};

D.evalsig=function(host){
  var fm="mc",seeds=false;
  host.innerHTML='<div class="ctl">'+segBtns("es-f","MMLU format",[["mc","MMLU: multiple choice"],["cf","MMLU: cloze"]],"mc")+segBtns("es-s","Noise",[["0","Single run"],["1","3 seeds"]],"0")+'</div><div class="chart"></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=280,L=44,R=16,T=18,B=44;
  function X(v){return L+v*(W-L-R);}function Y(v){return T+(1-v/80)*(H-T-B);}
  function nz(x,s){var v=Math.sin(x*91.7+s*12.3)*43758.5453;return (v-Math.floor(v))*2-1;}
  var F={hs:function(x){return 25+45*(1-Math.exp(-3*x));},mc:function(x){return 25+18*Math.pow(Math.max(0,(x-0.6)/0.4),1.6);},cf:function(x){return 27+13*(1-Math.exp(-2.5*x));},gsm:function(x){return 1+11*Math.pow(Math.max(0,(x-0.65)/0.35),1.8);}};
  var AMP={hs:0.8,mc:1.6,cf:0.8,gsm:1.2};
  var holder=$(".chart",host);
  function draw(){
    holder.innerHTML="";
    var svg=mkSvg(holder,W,H,"Illustrative: accuracy of different benchmarks during small-scale training");
    [0,25,50,75].forEach(function(v){ln(svg,L,Y(v),W-R,Y(v),"grid");txt(svg,L-6,Y(v)+4,v+"%","axt","end");});
    ln(svg,L,Y(25),W-R,Y(25),"vline");txt(svg,W-R,Y(25)+14,"Multiple-choice chance level 25%","axt","end");
    txt(svg,L+(W-L-R)/2,H-10,"Training tokens: few → many","axt","middle");txt(svg,L,T-6,"Accuracy","axt");
    var series=[["hs","l4","HellaSwag-like"],[fm,"l1",fm==="mc"?"MMLU (multiple choice)":"MMLU (cloze)"],["gsm","l2","GSM8K"]];
    series.forEach(function(sr){
      var f=F[sr[0]],n=seeds?3:1;
      for(var s=0;s<n;s++){(function(s){S("path",{d:pathOf(function(x){return f(x)+AMP[sr[0]]*nz(x,s+(seeds?1:0))*(seeds?1.6:0.6);},0,1,60,X,Y),"class":sr[1]+(seeds?" thin":"")},svg);})(s);}
      var ex=0.98;txt(svg,X(ex),Y(f(ex))-8,sr[2],"lbl "+(sr[1]==="l4"?"ok":(sr[1]==="l1"?"acc":"amb")),"end");
    });
    $(".readout",host).textContent=fm==="mc"?"On small models, MMLU in multiple-choice format sits near the 25% chance level for a long time and cannot show the effect of data or architecture changes. Small-scale ablations often switch to the cloze format, or keep only “early signal” tasks that rise monotonically, have low noise and stay above chance (FineWeb's selection criteria).":"The cloze format starts rising at small scale and can drive ablation decisions. Math tasks (GSM8K) show signal only very late, so do not count on them in small-model ablations. Turn on “3 seeds” to see how large the noise is: a conclusion that rests on a gap smaller than the noise is not usable.";
  }
  onSeg($("#es-f",host),function(v){fm=v;draw();});
  onSeg($("#es-s",host),function(v){seeds=v==="1";draw();});
  draw();
};

D.ci=function(host){
  var n=30,p=0.5,dl=0.03;
  host.innerHTML='<div class="ctlgrid">'+
    '<div class="lab"><span>Number of problems n</span>'+segBtns("ci-n","Number of problems",[["30","30 (AIME)"],["100","100"],["500","500"],["2000","2000"]],"30")+'</div>'+
    '<label for="ci-p"><span>Baseline accuracy <b class="ci-pv"></b></span><input id="ci-p" type="range" min="10" max="90" step="5" value="50"></label>'+
    '<label for="ci-d"><span>Claimed gain <b class="ci-dv"></b></span><input id="ci-d" type="range" min="1" max="10" step="0.5" value="3"></label></div>'+
    '<div class="nline" aria-hidden="true"><div class="track"></div><div class="zero" style="left:50%"></div><div class="band"></div><div class="mkr"></div>'+
    [-30,-20,-10,0,10,20,30].map(function(v){return '<span class="tl" style="left:'+((v+30)/60*100)+'%">'+(v>0?"+":"")+v+'</span>';}).join("")+'</div>'+
    '<p class="readout" aria-live="polite"></p>'+
    '<p class="mini" style="margin:0">Binomial approximation for two independent evaluations (in accuracy points). A paired comparison on the same problem set is somewhat narrower; running more seeds only reduces sampling noise and does not fix having too few problems.</p>';
  function pos(x){return (Math.max(-0.3,Math.min(0.3,x))+0.3)/0.6*100;}
  function upd(){
    var half=1.96*Math.sqrt(2*p*(1-p)/n),lo=dl-half,hi=dl+half,need=Math.ceil(2*1.96*1.96*p*(1-p)/(dl*dl));
    $(".ci-pv",host).textContent=Math.round(p*100)+"%";$(".ci-dv",host).textContent="+"+(dl*100).toFixed(1)+" points";
    var band=$(".band",host);band.style.left=pos(lo)+"%";band.style.width=(pos(hi)-pos(lo))+"%";band.className="band"+(lo>0?"":" noise");
    $(".mkr",host).style.left=pos(dl)+"%";
    $(".readout",host).innerHTML="95% interval: <b class=\"k\">"+(lo*100).toFixed(1)+"</b> to <b class=\"k\">+"+(hi*100).toFixed(1)+"</b> points (±"+(half*100).toFixed(1)+"). "+(lo>0?"The interval excludes 0, so this is probably a real gain.":"<b>The interval includes 0, so the gain cannot be told apart from noise.</b>")+" To make +"+(dl*100).toFixed(1)+" points significant you need about <b>"+need.toLocaleString("en-US")+"</b> problems.";
  }
  onSeg($("#ci-n",host),function(v){n=parseInt(v,10);upd();});
  $("#ci-p",host).addEventListener("input",function(){p=parseInt(this.value,10)/100;upd();});
  $("#ci-d",host).addEventListener("input",function(){dl=parseFloat(this.value)/100;upd();});
  upd();
};

D.roofline=function(host){
  var c=clock(),lb=0,auto=!RM,PEAK=989,BW=3.35,d=8192;
  host.innerHTML='<div class="ctl"><label for="rf-b">Tokens processed at once (batch) <b class="rf-bv"></b></label><input id="rf-b" type="range" min="0" max="13" step="1" value="0"></div><div class="chart"></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=290,L=56,R=16,T=20,B=44;
  function X(v){return L+(v+1)/5*(W-L-R);}function Y(v){return T+(1-(v+1)/4.3)*(H-T-B);}
  var svg=mkSvg($(".chart",host),W,H,"H100 roofline: arithmetic intensity versus achievable compute");
  [-1,0,1,2,3].forEach(function(v){ln(svg,L,Y(v),W-R,Y(v),"grid");txt(svg,L-6,Y(v)+4,String(Math.pow(10,v)),"axt","end");});
  [-1,0,1,2,3,4].forEach(function(v){txt(svg,X(v),H-B+18,String(Math.pow(10,v)),"axt","middle");});
  txt(svg,L+(W-L-R)/2,H-8,"Arithmetic intensity (FLOP/byte, log scale)","axt","middle");txt(svg,L,T-8,"Achievable TFLOPS (log scale)","axt");
  function att(I){return Math.min(PEAK,BW*I);}
  S("path",{d:pathOf(function(li){return Math.log10(att(Math.pow(10,li)));},-1,4,200,X,Y),"class":"l5",style:"stroke-width:3"},svg);
  var ridge=Math.log10(PEAK/BW);ln(svg,X(ridge),T,X(ridge),H-B,"vline");
  txt(svg,X(ridge)+5,Y(3.1),"Ridge ≈ "+Math.round(PEAK/BW)+" FLOP/byte","lbl mut");
  txt(svg,X(0.2),Y(0.2),"Memory-bound","lbl amb");txt(svg,X(3.3),Y(2.55),"Compute-bound","lbl acc","middle");
  var eI=Math.log10(1/6);S("circle",{cx:X(eI),cy:Y(Math.log10(att(1/6))),r:5,"class":"mk2"},svg);txt(svg,X(eI)+8,Y(Math.log10(att(1/6)))+16,"Elementwise ops (add, activation)","lbl mut");
  var mk=S("circle",{cx:0,cy:0,r:7,"class":"mk"},svg),sl=$("#rf-b",host);
  function upd(){
    var Bt=Math.pow(2,lb),I=Bt/(1+2*Bt/d),a=att(I),pct=a/PEAK*100;
    mk.setAttribute("cx",X(Math.log10(I)));mk.setAttribute("cy",Y(Math.log10(a)));sl.value=lb;
    $(".rf-bv",host).textContent=Bt.toLocaleString("en-US");
    $(".readout",host).innerHTML="An 8192×8192 bf16 matmul with batch "+Bt.toLocaleString("en-US")+": arithmetic intensity about <b class=\"k\">"+I.toFixed(1)+"</b> FLOP/byte, at most <b class=\"k\">"+Math.round(a)+"</b> TFLOPS ("+pct.toFixed(pct<10?1:0)+"% of peak). "+(I<PEAK/BW?"Memory-bound: reading the weights takes far longer than the math. Decode handles very few tokens per step and lands here, which is why inference relies on larger batches to amortize weight reads.":"Compute-bound: the Tensor Cores are the bottleneck, which is the normal case for large-batch matmuls in training.");
  }
  sl.addEventListener("input",function(){auto=false;lb=parseInt(sl.value,10);upd();});
  upd();
  if(!RM){c.int(700,function(){if(!auto){return;}lb=(lb+1)%14;upd();});}
  return function(){c.clear();};
};

D.zero=function(host){
  var sizes=[1,3,7,8,14,32,70,405],si=3,gp=8,st=3;
  host.innerHTML='<div class="ctl"><label for="z-m">Model parameters <b class="z-mv"></b></label><input id="z-m" type="range" min="0" max="'+(sizes.length-1)+'" step="1" value="3">'+segBtns("z-g","GPU count",[["8","8 GPUs"],["64","64"],["512","512"]],"8")+'</div>'+
    '<div class="ctl">'+segBtns("z-s","Sharding",[["0","DDP"],["1","ZeRO-1"],["2","ZeRO-2"],["3","ZeRO-3 / FSDP"]],"3")+'</div>'+
    '<div><div class="mini z-cap"></div><div class="gpus z-boxes"></div><div class="keys" style="margin-top:6px"><span><i style="background:var(--k-out)"></i>bf16 weights</span><span><i style="background:var(--k-pref)"></i>bf16 gradients</span><span><i style="background:var(--k-rl)"></i>fp32 optimizer state (master weights + two Adam moments)</span></div></div>'+
    '<p class="readout" aria-live="polite"></p>';
  var bx=$(".z-boxes",host),h="";for(var k=0;k<8;k++){h+='<div class="zg"><span class="zw"></span><span class="zgr"></span><span class="zo"></span><span class="cap"></span></div>';}bx.innerHTML=h;
  var NOTE=["Every GPU stores the full weights, gradients and optimizer state, and gradients are all-reduced once per step.","Shards only the optimizer state; communication volume is the same as DDP.","Also shards the gradients (reduce-scatter); communication volume is still the same as DDP.","Shards the parameters too: they are all-gathered on the fly during forward and backward, for about 1.5× the communication of DDP. PyTorch FSDP is in this family."];
  function upd(){
    var N=sizes[si],w=st>=3?2/gp:2,g=st>=2?2/gp:2,o=st>=1?12/gp:12,tw=N*w,tg=N*g,to=N*o,tot=tw+tg+to,over=tot>80;
    $(".z-mv",host).textContent=N+"B";
    $(".z-cap",host).textContent="Each cell is one 80GB GPU"+(gp>8?" ("+gp+" in total, only the first 8 shown)":"");
    $$(".zg",bx).forEach(function(z){
      var sp=z.children,b=0;
      [[sp[0],tw],[sp[1],tg],[sp[2],to]].forEach(function(p){var hh=p[1]/80*100;p[0].style.bottom=Math.min(b,100)+"%";p[0].style.height=Math.max(0,Math.min(hh,100-b))+"%";b+=hh;});
      sp[3].textContent=fmtGB(tot)+" GB";z.classList.toggle("over",over);
    });
    $(".readout",host).innerHTML="About <b>"+fmtGB(tot)+" GB</b> per GPU (excluding activations): "+(over?"<b>it does not fit</b>. ":"it fits, and the remaining memory goes to activations. ")+NOTE[st]+(over?" You can also stack TP (split each layer's matrices), PP (split by layer), CP (split by sequence) or EP (split by expert), or add GPUs.":"");
  }
  $("#z-m",host).addEventListener("input",function(){si=parseInt(this.value,10);upd();});
  onSeg($("#z-g",host),function(v){gp=parseInt(v,10);upd();});
  onSeg($("#z-s",host),function(v){st=parseInt(v,10);upd();});
  upd();
};

D.kv=function(host){
  var M=[["Llama 3 8B (GQA, 8 KV heads)",32,8,128,16,1],["Same size without GQA (32 KV heads)",32,32,128,16,1],["Llama 3 70B (GQA, 8 KV heads)",80,8,128,140,4]];
  var CTX=[1024,4096,8192,16384,32768,65536,131072],mi=0,ci=2,lc=5;
  host.innerHTML='<div class="ctl">'+segBtns("kv-m","Model",M.map(function(m,k){return [String(k),m[0]];}),"0")+'</div>'+
    '<div class="ctlgrid"><label for="kv-c"><span>Context length <b class="kv-cv"></b></span><input id="kv-c" type="range" min="0" max="6" step="1" value="2"></label><label for="kv-n"><span>Concurrent sequences <b class="kv-nv"></b></span><input id="kv-n" type="range" min="0" max="8" step="1" value="5"></label></div>'+
    '<div><div class="mini kv-cap"></div><div class="meterbar"><i class="kv-bar"></i></div></div><p class="readout" aria-live="polite"></p>';
  function upd(){
    var m=M[mi],per=2*m[1]*m[2]*m[3]*2,ctx=CTX[ci],conc=Math.pow(2,lc),tot=per*ctx*conc,budget=m[5]*80e9-m[4]*1e9,maxSeq=Math.floor(budget/(per*ctx));
    $(".kv-cv",host).textContent=(ctx/1024)+"k";$(".kv-nv",host).textContent=conc;
    var bl=m[5]===1?"one 80GB GPU minus 16GB of weights":"four 80GB GPUs minus 140GB of weights";
    $(".kv-cap",host).textContent="KV cache as a share of free memory ("+bl+" leaves about "+Math.round(budget/1e9)+" GB)";
    var bar=$(".kv-bar",host);bar.style.width=Math.min(100,tot/budget*100)+"%";bar.className="kv-bar "+(tot>budget?"bad":"acc");
    $(".readout",host).innerHTML="KV cache per token: "+(per/1024)+" KiB (2 × "+m[1]+" layers × "+m[2]+" KV heads × "+m[3]+" dims × 2 bytes). "+(ctx/1024)+"k context with "+conc+" concurrent sequences needs <b>"+fmtGB(tot/1e9)+" GB</b>"+(tot>budget?", <b>more than the free memory</b>":"")+"; with "+bl+", at most <b>"+maxSeq+"</b> sequences fit."+(mi===1?" Compare with the first option: GQA cuts the KV cache to 1/4.":"");
  }
  onSeg($("#kv-m",host),function(v){mi=parseInt(v,10);upd();});
  $("#kv-c",host).addEventListener("input",function(){ci=parseInt(this.value,10);upd();});
  $("#kv-n",host).addEventListener("input",function(){lc=parseInt(this.value,10);upd();});
  upd();
};

D.batching=function(host){
  var c=clock(),LEN=[5,2,7,3,4,6,2,5,3,7,4,2,6,3,5,4,3,6,2,4],SL=4,TT=24,COL=["var(--k-rl)","var(--k-sft)","var(--k-pref)","var(--k-dist)"];
  function sched(cont){
    var g=[],ends=[],s,t,k;for(s=0;s<SL;s++){var row=[];for(t=0;t<TT;t++){row.push(-1);}g.push(row);}
    var next=0;
    if(!cont){
      t=0;
      while(t<TT&&next<LEN.length){
        var batch=[];for(s=0;s<SL&&next<LEN.length;s++){batch.push(next++);}
        var mx=0;batch.forEach(function(r){mx=Math.max(mx,LEN[r]);});
        batch.forEach(function(r,s2){for(k=0;k<mx&&t+k<TT;k++){g[s2][t+k]=k<LEN[r]?r:-2;}ends.push(t+LEN[r]);});
        t+=mx;
      }
    }else{
      var free=[];for(s=0;s<SL;s++){free.push(0);}
      while(next<LEN.length){
        var b=0;for(s=1;s<SL;s++){if(free[s]<free[b]){b=s;}}
        if(free[b]>=TT){break;}
        var r=next++;for(k=0;k<LEN[r]&&free[b]+k<TT;k++){g[b][free[b]+k]=r;}ends.push(free[b]+LEN[r]);free[b]+=LEN[r];
      }
    }
    return{g:g,ends:ends};
  }
  var A=sched(false),Bc=sched(true);
  function grid(cls){var h="";for(var s=0;s<SL;s++){for(var t=0;t<TT;t++){h+='<span class="bcell" data-s="'+s+'" data-t="'+t+'"></span>';}}return '<div class="bgrid '+cls+'">'+h+'</div>';}
  host.innerHTML='<div><div class="btitle"><span>Static batching: 4 per batch, wait for the longest one to finish</span><span>Completed <b class="b-a">0</b></span></div>'+grid("ga")+'</div>'+
    '<div><div class="btitle"><span>Continuous batching: when one finishes, start a new request right away</span><span>Completed <b class="b-b">0</b></span></div>'+grid("gb")+'</div>'+
    '<p class="readout"></p>';
  var ca=$$(".ga .bcell",host),cb=$$(".gb .bcell",host);
  function paint(cells,sch,upto){cells.forEach(function(el){var s=parseInt(el.getAttribute("data-s"),10),t=parseInt(el.getAttribute("data-t"),10),v=t<upto?sch.g[s][t]:-1;el.className="bcell"+(v===-2?" idle":"");el.style.background=v>=0?COL[v%4]:"";});}
  function done(sch,upto){return sch.ends.filter(function(e){return e<=upto;}).length;}
  var t=RM?TT:0;
  function frame(){paint(ca,A,t);paint(cb,Bc,t);$(".b-a",host).textContent=done(A,t);$(".b-b",host).textContent=done(Bc,t);}
  $(".readout",host).textContent="In the same 24 time steps, static batching completes "+done(A,TT)+" requests and continuous batching completes "+done(Bc,TT)+". Red-outlined cells are idle slots: that sequence has finished but must wait for the longest one in its batch. Each cell is one request generating one token.";
  frame();
  if(!RM){var hold=0;c.int(200,function(){if(t>=TT){hold++;if(hold>12){t=0;hold=0;}}else{t++;}frame();});}
  return function(){c.clear();};
};

D.system=function(host){
  var c=clock(),tis=false,t=RM?160:0,TMAX=160,hold=0,ph=0;
  host.innerHTML='<div class="chart sy-arch"></div>'+
    '<div class="ctl spread"><div class="seg sy-seg" role="group" aria-label="Turn TIS on or off"><button type="button" data-t="0" aria-pressed="true">TIS off</button><button type="button" data-t="1" aria-pressed="false">TIS on</button></div><span class="mini sy-step" style="margin:0"></span><button type="button" class="gbtn" data-act="replay">Rerun</button></div>'+
    '<div class="sparks"></div><p class="readout" aria-live="polite"></p>';
  var svg=mkSvg($(".sy-arch",host),480,150,"The rollout engine sends samples to the training engine, which syncs new weights back to the rollout engine");
  S("rect",{x:12,y:28,width:156,height:94,rx:12,"class":"box"},svg);S("rect",{x:312,y:28,width:156,height:94,rx:12,"class":"box"},svg);
  txt(svg,90,70,"Rollout engine","boxt");txt(svg,90,92,"vLLM / SGLang","boxs");txt(svg,390,70,"Training engine","boxt");txt(svg,390,92,"FSDP / Megatron","boxs");
  S("path",{d:"M168 50 L312 50","class":"flowl"},svg);S("path",{d:"M312 102 L168 102","class":"flowl"},svg);
  txt(svg,240,38,"Samples + rollout logprobs →","boxs");txt(svg,240,126,"← sync new weights","boxs");
  var mm=txt(svg,240,80,"","boxt"),pts=[],wts=[],i;
  for(i=0;i<6;i++){pts.push(S("circle",{cx:168,cy:50,r:4,"class":"pt"},svg));}
  for(i=0;i<2;i++){wts.push(S("rect",{x:300,y:97,width:10,height:10,rx:2,"class":"wt"},svg));}
  var DEF=[["Reward / accuracy","reward",0,1],["Entropy","ent",0,1.4],["Truncation rate","tr",0,0.6],["Train–inference logprob gap","mm",0,0.08]];
  $(".sparks",host).innerHTML=DEF.map(function(d){return '<div class="sp"><div class="h"><span>'+d[0]+'</span><b data-v="'+d[1]+'"></b></div><svg viewBox="0 0 200 52" preserveAspectRatio="none" aria-hidden="true"><polyline class="spl" data-l="'+d[1]+'" points=""></polyline></svg></div>';}).join("");
  function nz(k,s){var x=Math.sin(k*12.9898+s*78.233)*43758.5453;return (x-Math.floor(x))*2-1;}
  function met(k){
    var crash=!tis&&k>85,pc=crash?Math.min(1,(k-85)/25):0;
    var mmv=0.010+0.022*Math.pow(k/TMAX,2)+(crash?0.03*pc:0)+0.002*nz(k,1);
    var rw0=0.18+0.52*(1-Math.exp(-k/45)),ent0=0.15+0.55*Math.exp(-k/110);
    var reward=crash?rw0*(1-pc)+0.08*pc+0.02*nz(k,2):rw0+0.025*nz(k,2);
    var ent=crash?(0.15+0.55*Math.exp(-85/110))*(1-pc)+1.25*pc+0.03*nz(k,3):ent0+0.02*nz(k,3);
    var tr=crash?0.03*(1-pc)+0.45*pc+0.015*nz(k,4):0.03+0.01*nz(k,4);
    return{reward:Math.max(0,Math.min(1,reward)),ent:Math.max(0,ent),tr:Math.max(0,tr),mm:Math.max(0,mmv),crash:crash};
  }
  function drawCharts(){
    var hist=[];for(var k=0;k<=t;k++){hist.push(met(k));}
    var last=hist[hist.length-1];
    DEF.forEach(function(d){
      var pl=$('polyline[data-l="'+d[1]+'"]',host),s="";
      hist.forEach(function(m,k){var x=k/TMAX*200,y=52-((m[d[1]]-d[2])/(d[3]-d[2]))*48-2;s+=x.toFixed(1)+","+Math.max(1,Math.min(51,y)).toFixed(1)+" ";});
      pl.setAttribute("points",s);pl.setAttribute("class","spl"+(last.crash?" bad":""));
      $('[data-v="'+d[1]+'"]',host).textContent=last[d[1]].toFixed(d[1]==="mm"?3:2);
    });
    mm.textContent="logprob gap "+last.mm.toFixed(3);
    $(".sy-step",host).textContent="step "+t+" / "+TMAX;
    var rd=$(".readout",host);
    if(tis){rd.textContent="The gap is still there, but reweighting with truncated importance sampling (TIS) on “training engine prob / rollout engine prob” keeps training stable. MoE models also need to record the routing at inference time and replay it during training (R3).";}
    else if(t<=85){rd.textContent="Everything looks normal: reward is rising and entropy is slowly falling. The only early signal is the train–inference logprob gap, which keeps creeping up.";}
    else{rd.textContent="Collapse: the two engines give increasingly different probabilities for the same weights, so on-policy training has effectively become off-policy. Truncation rate and entropy spike, and reward falls to the floor.";}
  }
  function frame(){
    var last=met(t);
    pts.forEach(function(p,j){var f=((ph*0.9+j/pts.length)%1);p.setAttribute("cx",168+f*144);p.setAttribute("class","pt"+(last.crash?" bad":""));});
    wts.forEach(function(w,j){var f=((ph*0.5+j/wts.length)%1);w.setAttribute("x",302-f*140);});
  }
  function start(){c.clear();t=RM?TMAX:0;hold=0;drawCharts();frame();
    if(RM){return;}
    c.int(40,function(){ph+=0.02;if(ph>1000){ph=0;}frame();});
    c.int(75,function(){if(t<TMAX){t++;drawCharts();}else{hold++;if(hold>26){t=0;hold=0;drawCharts();}}});
  }
  $(".sy-seg",host).addEventListener("click",function(e){var bt=e.target.closest("button");if(!bt){return;}tis=bt.getAttribute("data-t")==="1";setPressed(this,"data-t",bt.getAttribute("data-t"));start();});
  $('[data-act="replay"]',host).addEventListener("click",start);
  start();
  return function(){c.clear();};
};

D.async=function(host){
  var c=clock(),mode="sync",TM=36,TRN=3;
  var ITER=[[3,4,2,9,3,5,4,3],[4,2,3,3,8,2,5,3],[2,5,3,4,3,9,2,4],[3,3,6,2,4,3,8,2]];
  host.innerHTML='<div class="ctl">'+segBtns("as-m","Scheduling",[["sync","Synchronous"],["async","Asynchronous (one step off-policy)"]],"sync")+'<button type="button" class="gbtn" data-act="replay">Replay</button></div><div class="chart"></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=200,L=74,R=12,T=14;
  function X(t){return L+t/TM*(W-L-R);}
  var holder=$(".chart",host);
  function build(){
    holder.innerHTML="";
    var svg=mkSvg(holder,W,H,"Illustrative: busy and idle time of rollout and training GPUs under synchronous and asynchronous RL");
    var defs=S("defs",{},svg),cp=S("clipPath",{id:"as-clip"},defs),cr=S("rect",{x:L,y:0,width:RM?W:0,height:H},cp);
    var g=S("g",{"clip-path":"url(#as-clip)"},svg);
    txt(svg,L-8,T+60,"rollout","axt","end");txt(svg,L-8,T+74,"8 sequences","axt","end");txt(svg,L-8,T+140,"Training","axt","end");
    var genB=0,trnB=0,k,t0;
    function lane(k){return T+k*14;}
    if(mode==="sync"){
      t0=0;var it=0;
      while(t0<TM){
        var lens=ITER[it%ITER.length],mx=Math.max.apply(null,lens);
        lens.forEach(function(len,k2){var y=lane(k2);S("rect",{x:X(t0),y:y,width:X(t0+len)-X(t0),height:11,rx:2,"class":"ga-gen"},g);genB+=Math.max(0,Math.min(len,TM-t0));S("rect",{x:X(t0+len),y:y,width:X(t0+mx+TRN)-X(t0+len),height:11,rx:2,"class":"ga-idle"},g);});
        S("rect",{x:X(t0),y:T+128,width:X(t0+mx)-X(t0),height:16,rx:3,"class":"ga-idle"},g);
        S("rect",{x:X(t0+mx),y:T+128,width:X(t0+mx+TRN)-X(t0+mx),height:16,rx:3,"class":"ga-trn"},g);trnB+=Math.max(0,Math.min(TRN,TM-(t0+mx)));
        t0+=mx+TRN;it++;
      }
    }else{
      var flat=[];ITER.forEach(function(a){flat=flat.concat(a);});flat=flat.concat(flat);
      var lanes=[0,0,0,0,0,0,0,0],done=[],q=0;
      while(true){var b=0;for(k=1;k<8;k++){if(lanes[k]<lanes[b]){b=k;}}if(lanes[b]>=TM||q>=flat.length){break;}var len=flat[q++];S("rect",{x:X(lanes[b]),y:lane(b),width:X(lanes[b]+len)-X(lanes[b])-1,height:11,rx:2,"class":(q%2?"ga-gen":"ga-gen2")},g);genB+=Math.max(0,Math.min(len,TM-lanes[b]));lanes[b]+=len;done.push(lanes[b]);}
      done.sort(function(a,b2){return a-b2;});
      var prev=0;for(k=7;k<done.length;k+=8){var st=Math.max(done[k],prev);if(st>=TM){break;}S("rect",{x:X(st),y:T+128,width:X(st+TRN)-X(st)-1,height:16,rx:3,"class":"ga-trn"},g);trnB+=Math.min(TRN,TM-st);prev=st+TRN;}
    }
    ln(svg,L,T+118,W-R,T+118,"grid");
    var ru=genB/(8*TM)*100,tu=trnB/TM*100;
    $(".readout",host).textContent=mode==="sync"
      ?"Synchronous: every round waits for the longest generation to finish (the long tail), and the rollout GPUs sit idle during training (red). Rollout utilization is about "+Math.round(ru)+"%, training about "+Math.round(tu)+"%."
      :"Asynchronous: rollout keeps generating while training runs in parallel on batches that are already full. Rollout utilization is about "+Math.round(ru)+"%, training about "+Math.round(tu)+"%. The cost is that data comes from slightly older weights (staleness), so you cap how many steps behind it can be or correct with importance sampling; partial rollout cuts off overly long generations and resumes them in the next round.";
    if(!RM){var w=0;c.clear();c.int(30,function(){w=Math.min(W,w+8);cr.setAttribute("width",w);if(w>=W){c.clear();}});}
  }
  onSeg($("#as-m",host),function(v){mode=v;build();});
  $('[data-act="replay"]',host).addEventListener("click",build);
  build();
  return function(){c.clear();};
};

D.sandbox=function(host){
  var c=clock(),w=4,k=1,g=1,t0=0,TW=24;
  host.innerHTML='<div class="ctlgrid"><label for="sb-w"><span>Latency per tool call <b class="sb-wv"></b></span><input id="sb-w" type="range" min="1" max="20" step="1" value="8"></label><label for="sb-k"><span>Trajectories interleaved per GPU <b class="sb-kv"></b></span><input id="sb-k" type="range" min="1" max="16" step="1" value="1"></label></div>'+
    '<div class="chart"></div><div><div class="mini">GPU utilization</div><div class="meterbar"><i class="sb-u"></i></div></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=150,L=70,R=10,T=10;
  var svg=mkSvg($(".chart",host),W,H,"Illustrative: agent trajectories alternating between generating and waiting on tools"),g1=S("g",{},svg);
  txt(svg,L-8,T+12,"Traj. 1","axt","end");
  function X(t){return L+(t-t0)/TW*(W-L-R);}
  function draw(){
    while(g1.firstChild){g1.removeChild(g1.firstChild);}
    var lanes=Math.min(k,8),per=g+w;
    for(var j=0;j<lanes;j++){
      var y=T+j*16,off=-(j*per/k);
      for(var s=Math.floor((t0-off)/per)-1;s<Math.floor((t0+TW-off)/per)+1;s++){
        var a=off+s*per;
        [[a,a+g,"ga-gen"],[a+g,a+per,"ga-wait"]].forEach(function(seg){var x0=Math.max(seg[0],t0),x1=Math.min(seg[1],t0+TW);if(x1>x0){S("rect",{x:X(x0),y:y,width:X(x1)-X(x0),height:12,rx:2,"class":seg[2]},g1);}});
      }
    }
    if(k>8){txt(g1,L,T+8*16+12,"…plus "+(k-8)+" more","axt");}
  }
  function upd(){
    var u=Math.min(1,k*g/(g+w)),u1=g/(g+w);
    $(".sb-wv",host).textContent=w.toFixed(1)+" s";$(".sb-kv",host).textContent=k;
    var bar=$(".sb-u",host);bar.style.width=(u*100)+"%";bar.className="sb-u "+(u<0.5?"bad":"acc");
    $(".readout",host).textContent="Each step generates for 1 s, then waits "+w.toFixed(1)+" s for the tool: with a single trajectory the GPU is computing only "+Math.round(u1*100)+"% of the time. Interleaving "+k+" trajectories brings utilization to about "+Math.round(u*100)+"%. Remedies: more concurrent trajectories, faster sandboxes, asynchronous rollout, and timeouts on tool calls.";
    draw();
  }
  $("#sb-w",host).addEventListener("input",function(){w=parseInt(this.value,10)/2;upd();});
  $("#sb-k",host).addEventListener("input",function(){k=parseInt(this.value,10);upd();});
  upd();
  if(!RM){c.int(50,function(){t0+=0.08;draw();});}
  return function(){c.clear();};
};

D.goodput=function(host){
  var gpus=16384,T=30,sync=true,seed=7,R=10;
  host.innerHTML='<div class="ctl">'+segBtns("gp-g","Cluster size",[["1024","1k GPUs"],["4096","4k"],["16384","16k"],["65536","64k"]],"16384")+segBtns("gp-t","Checkpoint interval",[["5","5 min"],["10","10"],["30","30"],["60","60"],["120","120"]],"30")+'</div>'+
    '<div class="ctl">'+segBtns("gp-s","Save mode",[["1","Synchronous save (2 min pause each)"],["0","Asynchronous save"]],"1")+'<button type="button" class="gbtn" data-act="reseed">New random failures</button></div>'+
    '<div class="chart"></div><div class="keys"><span><i style="background:var(--good)"></i>Useful training</span><span><i style="background:var(--boss)"></i>Lost to a failure, must be recomputed</span><span><i style="background:var(--ink-3)"></i>Restart</span><span><i style="background:var(--k-dist)"></i>Synchronous checkpoint save</span></div>'+
    '<p class="readout" aria-live="polite"></p>';
  var W=480,H=96,L=10,Rr=10;
  function X(m){return L+m/1440*(W-L-Rr);}
  var holder=$(".chart",host);
  function run(){
    var r=rng(seed),lam=0.323/60*(gpus/16384),st=[],since=[],rest=0,ck=0,fails=[],t;
    for(t=0;t<1440;t++){
      if(rest>0){st.push(2);rest--;continue;}
      if(ck>0){st.push(3);ck--;continue;}
      if(r()<lam){since.forEach(function(m){st[m]=1;});since=[];st.push(2);rest=R-1;fails.push(t);continue;}
      st.push(0);since.push(t);
      if(since.length>=T){since=[];if(sync){ck=2;}}
    }
    holder.innerHTML="";
    var svg=mkSvg(holder,W,H,"Simulated 24 hours of training: failures, recomputation and checkpoints");
    var cls=["gp-ok","gp-lost","gp-rs","gp-ck"],a=0;
    for(t=1;t<=1440;t++){if(t===1440||st[t]!==st[a]){S("rect",{x:X(a),y:28,width:Math.max(0.6,X(t)-X(a)),height:26,"class":cls[st[a]]},svg);a=t;}}
    fails.forEach(function(f){S("path",{d:"M"+X(f)+" 24 l-4 -8 l8 0 Z","class":"mk"},svg);});
    [0,6,12,18,24].forEach(function(hh){txt(svg,X(hh*60),76,hh+"h","axt",hh===0?"start":(hh===24?"end":"middle"));});
    txt(svg,L,12,"24 hours, "+fails.length+" failures (red triangles)","axt");
    var good=st.filter(function(v){return v===0;}).length/1440,s=sync?2:0.2,est=Math.max(0,1-s/T-lam*(T/2+R)),topt=Math.sqrt(2*s/lam);
    $(".readout",host).innerHTML="Simulated: <b>"+Math.round(good*100)+"%</b> useful training (the formula estimates about "+Math.round(est*100)+"%: 1 − save time/interval − failure rate × (interval/2 + restart time)). By Young's formula the optimal interval is about <b>"+Math.round(topt)+" minutes</b> (√(2 × save time / failure rate)). For reference: Llama 3 trained for 54 days on 16,384 H100s, was interrupted 466 times, and still kept useful training time above 90%.";
  }
  onSeg($("#gp-g",host),function(v){gpus=parseInt(v,10);run();});
  onSeg($("#gp-t",host),function(v){T=parseInt(v,10);run();});
  onSeg($("#gp-s",host),function(v){sync=v==="1";run();});
  $('[data-act="reseed"]',host).addEventListener("click",function(){seed++;run();});
  run();
};

/* ---------- world model diagrams ---------- */
D.wroutes=function(host){
  var c=clock(),i=0,auto=!RM;
  var R=[
    {n:"Interactive video generation",p:"The next frame (Genie 4 also generates audio)",a:"Text plus navigation actions",f:"Genie 3 (August 2025), Genie 4 (October 2026), and Waymo World Model (post-trained from Genie 3 to output camera and lidar); the open-weight Cosmos 3",o:"Genie: closed. Cosmos 3: open (OpenMDW)",av:"Photorealistic simulation for driving and robotics. Data-hungry and compute-heavy, so not the place to start",star:false},
    {n:"Latent prediction (JEPA)",p:"Future representations, without reconstructing pixels",a:"Actions (V-JEPA 2-AC)",f:"V-JEPA 2 (over 1M hours of video plus under 62 hours of robot data), V-JEPA 2.1, LeWorldModel (about 15M parameters)",o:"Open",av:"Representation learning for sensor and trajectory sequences; fast planning, and trains on one GPU",star:true},
    {n:"Model-based RL",p:"Transitions and rewards in a latent state",a:"The agent's actions",f:"DreamerV3 (open source), Dreamer 4 (collects diamonds in Minecraft from offline data only)",o:"V3 open; no official Dreamer 4 code",av:"Training policies inside the world model (planning and control)",star:false},
    {n:"World-action models",p:"Future frames and actions, predicted jointly",a:"Task instructions, visual subgoals",f:"DreamZero (14B), GR00T 2, π0.7; Veo is used to evaluate Gemini Robotics policies",o:"Partly open",av:"Robot policies that imagine the outcome before acting",star:false},
    {n:"Physical-field models (weather)",p:"Probabilistic forecasts of physical fields such as the atmosphere",a:"Initial conditions (no actions)",f:"GenCast, WeatherNext 2 (open), WeatherNext 3 (service), Aurora, Earth-2 Atlas and StormScope",o:"WeatherNext 2, Aurora, and Earth-2 are open",av:"Context input for an agent-level world model, and a clean testbed for probabilistic metrics",star:true}
  ];
  host.innerHTML='<div class="wr-grid">'+R.map(function(r,k){return '<button type="button" class="wr-card" data-k="'+k+'"><span class="wr-n">Route '+(k+1)+'</span><b>'+r.n+'</b>'+(r.star?'<span class="wr-star">★ Used in this track</span>':'')+'</button>';}).join("")+'</div><div class="lcard" aria-live="polite"></div><p class="readout">This track combines two of them: a physical-field model (route 5) as context, a small latent or structured world model (route 2) at the core, and RL post-training from M7 on top.</p>';
  var cards=$$(".wr-card",host),card=$(".lcard",host);
  function show(k){i=k;cards.forEach(function(b,j){b.classList.toggle("on",j===k);});var r=R[k];card.innerHTML='<div class="lc-h"><b>'+r.n+'</b></div><dl class="lc-dl"><dt>Predicts</dt><dd>'+r.p+'</dd><dt>Controlled by</dt><dd>'+r.a+'</dd><dt>Flagship systems</dt><dd>'+r.f+'</dd><dt>Weights</dt><dd>'+r.o+'</dd><dt>Good for</dt><dd>'+r.av+'</dd></dl>';}
  host.addEventListener("click",function(e){var b=e.target.closest(".wr-card");if(!b){return;}auto=false;show(parseInt(b.getAttribute("data-k"),10));});
  show(0);if(!RM){c.int(3200,function(){if(auto){show((i+1)%R.length);}});}
  return function(){c.clear();};
};

D.werr=function(host){
  var c=clock(),mode="tf",h=RM?50:1;
  host.innerHTML='<div class="ctl">'+segBtns("we-m","Training method",[["tf","Teacher forcing: trained on true history only"],["sf","Self forcing: trained on its own predictions"]],"tf")+'</div><div class="chart we-c"></div><div class="chart we-p"></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=220,L=44,R=16,T=18,B=40,HM=50,YM=1.4;
  function X(v){return L+v/HM*(W-L-R);}function Y(v){return T+(1-v/YM)*(H-T-B);}
  function tf(v){return 0.008*v+0.00035*v*v;}function sf(v){return 0.008*v+0.00006*v*v;}
  var svg=mkSvg($(".we-c",host),W,H,"Illustrative: rollout error grows with the number of predicted steps");
  [0,0.5,1].forEach(function(v){ln(svg,L,Y(v),W-R,Y(v),"grid");txt(svg,L-6,Y(v)+4,v.toFixed(1),"axt","end");});
  [0,10,20,30,40,50].forEach(function(v){txt(svg,X(v),H-B+18,String(v),"axt","middle");});
  txt(svg,L+(W-L-R)/2,H-8,"Rollout steps","axt","middle");txt(svg,L,T-6,"Prediction error","axt");
  S("path",{d:pathOf(tf,0,50,100,X,Y),"class":"l2"},svg);S("path",{d:pathOf(sf,0,50,100,X,Y),"class":"l1"},svg);
  txt(svg,X(50)-4,Y(tf(50))+18,"teacher forcing","lbl amb","end");txt(svg,X(50)-4,Y(sf(50))-8,"self forcing","lbl acc","end");
  var cur=ln(svg,X(h),T,X(h),H-B,"cursor");
  var svg2=mkSvg($(".we-p",host),480,140,"Illustrative: the true trajectory and the model's own rollout");
  function tx(j){return 20+j*8.8;}function truth(j){return 72+26*Math.sin(j/8);}
  var tp="";for(var j=0;j<=50;j++){tp+=(j?"L":"M")+tx(j).toFixed(1)+" "+truth(j).toFixed(1);}
  S("path",{d:tp,"class":"l5 dash"},svg2);txt(svg2,20,14,"Dashed: true trajectory. Solid: the model rolling itself forward","axt");
  var pp=S("path",{d:"","class":"l2"},svg2),dot=S("circle",{cx:0,cy:0,r:5,"class":"mk"},svg2);
  function py(f,j){return truth(j)+f(j)*28*Math.sin(j/5+1);}
  function upd(){
    var f=mode==="tf"?tf:sf,d="";
    for(var j=0;j<=h;j++){d+=(j?"L":"M")+tx(j).toFixed(1)+" "+py(f,j).toFixed(1);}
    pp.setAttribute("d",d);pp.setAttribute("class",mode==="tf"?"l2":"l1");
    dot.setAttribute("cx",tx(h));dot.setAttribute("cy",py(f,h));
    cur.setAttribute("x1",X(h));cur.setAttribute("x2",X(h));
    $(".readout",host).textContent="Step "+h+": error is about "+tf(h).toFixed(2)+" with teacher forcing and "+sf(h).toFixed(2)+" with self forcing. A model that has only seen true history must consume its own predictions at inference time, and the error snowballs step by step. That is exposure bias. Self Forcing, Dreamer 4's shortcut forcing, and state-space memory all counter it.";
  }
  onSeg($("#we-m",host),function(v){mode=v;upd();});
  upd();
  if(!RM){var hold=0;c.int(80,function(){if(h>=50){hold++;if(hold>25){h=1;hold=0;}}else{h++;}upd();});}
  return function(){c.clear();};
};

D.wpost=function(host){
  var c=clock(),mode="merged",t=RM?100:0,ci=0;
  var CH=["Pretrained world model","SFT: action-observation data","RFT: verifiable rewards","SFT again","RFT again"];
  host.innerHTML='<div class="chipflow">'+CH.map(function(x,k){return (k?'<span class="carr" aria-hidden="true">→</span>':'')+'<span class="cfp">'+x+'</span>';}).join("")+'</div>'+
    '<div class="ctl">'+segBtns("wp-m","How rewards are combined",[["merged","Merged into one weighted reward"],["split","Computed and constrained separately"]],"merged")+'</div>'+
    '<div class="sparks"></div><p class="readout" aria-live="polite"></p>';
  var DEF=[["Prediction accuracy / visual quality","q"],["Action following","a"],["Physical consistency","p"]];
  $(".sparks",host).innerHTML=DEF.map(function(d){return '<div class="sp"><div class="h"><span>'+d[0]+'</span><b data-v="'+d[1]+'"></b></div><svg viewBox="0 0 200 52" preserveAspectRatio="none" aria-hidden="true"><polyline class="spl" data-l="'+d[1]+'" points=""></polyline></svg></div>';}).join("");
  function m(k){var x=k/100;if(mode==="merged"){return{q:0.4+0.5*(1-Math.exp(-3*x)),a:0.55+0.15*Math.min(1,x*2.5)-0.5*Math.max(0,x-0.4),p:0.5-0.18*Math.max(0,x-0.5)};}return{q:0.4+0.38*(1-Math.exp(-3*x)),a:0.55+0.3*(1-Math.exp(-2.5*x)),p:0.5+0.25*(1-Math.exp(-2*x))};}
  function draw(){
    DEF.forEach(function(d){var s="";for(var k=0;k<=t;k++){s+=(k*2).toFixed(1)+","+(50-m(k)[d[1]]*46).toFixed(1)+" ";}var pl=$('polyline[data-l="'+d[1]+'"]',host);pl.setAttribute("points",s);var bad=mode==="merged"&&d[1]!=="q"&&t>45;pl.setAttribute("class","spl"+(bad?" bad":""));$('[data-v="'+d[1]+'"]',host).textContent=m(t)[d[1]].toFixed(2);});
    $(".readout",host).textContent=mode==="merged"?"With a single weighted reward, the model finds that improving visual quality pays best. Accuracy keeps rising, action following starts to slide halfway through, and physical consistency gets worse too: reward hacking.":"Compute the interaction and visual-quality rewards separately and constrain each one (WorldCompass), and alternate SFT with RFT (SMART-R1): all three curves rise together. For flow and diffusion models, make the sampler stochastic first (Flow-GRPO), or comparing samples within a group means nothing.";
  }
  onSeg($("#wp-m",host),function(v){mode=v;t=RM?100:0;draw();});
  var cfs=$$(".cfp",host);function hl(k){cfs.forEach(function(e,j){e.classList.toggle("on",j===k);});}
  draw();hl(0);
  if(!RM){c.int(60,function(){if(t<100){t++;draw();}});c.int(1300,function(){ci=(ci+1)%CH.length;hl(ci);});}
  return function(){c.clear();};
};

D.wcrps=function(host){
  var c=clock(),sg=0.5,auto=!RM,dir=1,i,k;
  var r=rng(11),Ys=[];for(i=0;i<400;i++){var u1=Math.max(1e-9,r()),u2=r();Ys.push(Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2));}
  function erf(x){var s=x<0?-1:1;x=Math.abs(x);var t=1/(1+0.3275911*x);var y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);return s*y;}
  function Phi(z){return 0.5*(1+erf(z/Math.SQRT2));}function phi(z){return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);}
  function crps(s){var a=0;Ys.forEach(function(y){var z=y/s;a+=s*(z*(2*Phi(z)-1)+2*phi(z)-1/Math.sqrt(Math.PI));});return a/Ys.length;}
  var rmse=Math.sqrt(Ys.reduce(function(a,y){return a+y*y;},0)/Ys.length),mae=Ys.reduce(function(a,y){return a+Math.abs(y);},0)/Ys.length;
  var CUR=[];for(k=0;k<=56;k++){var sv=0.2+k*0.05;CUR.push([sv,crps(sv)]);}
  var cmax=Math.max.apply(null,CUR.map(function(p){return p[1];})),cmin=Math.min.apply(null,CUR.map(function(p){return p[1];}));
  host.innerHTML='<div class="ctl"><label for="wc-s">Width σ of the predicted distribution <b class="wc-sv"></b></label><input id="wc-s" type="range" min="0.2" max="3" step="0.05" value="0.5"></div><div class="chart wc-a"></div><div class="chart wc-b"></div><p class="readout" aria-live="polite"></p>';
  var W=480,L=44,R=16,H=160,T=24,B=24;
  function X(v){return L+(v+4)/8*(W-L-R);}function Yd(v){return T+(1-v/0.9)*(H-T-B);}
  var s1=mkSvg($(".wc-a",host),W,H,"Histogram of observations and the model's predicted distribution");
  var bins=[];for(k=0;k<20;k++){bins.push(0);}Ys.forEach(function(y){var b=Math.floor((y+4)/0.4);if(b>=0&&b<20){bins[b]++;}});
  bins.forEach(function(n,b){var d=n/Ys.length/0.4;S("rect",{x:X(-4+b*0.4)+1,y:Yd(d),width:X(0.4)-X(0)-2,height:Yd(0)-Yd(d),"class":"hist"},s1);});
  [-3,-2,-1,0,1,2,3].forEach(function(v){txt(s1,X(v),H-6,String(v),"axt","middle");});
  txt(s1,L,14,"Gray: distribution of observations. Line: the model's predicted distribution","axt");
  var pdf=S("path",{d:"","class":"l1"},s1);
  var H2=176,T2=22,B2=38,lo=cmin*0.94,hi=cmax*1.03;function X2(s){return L+(s-0.2)/2.8*(W-L-R);}function Y2(v){return T2+(1-(v-lo)/(hi-lo))*(H2-T2-B2);}
  var s2=mkSvg($(".wc-b",host),W,H2,"Mean CRPS as a function of the predicted width σ");
  [0.5,1,1.5,2,2.5,3].forEach(function(v){txt(s2,X2(v),H2-B2+18,String(v),"axt","middle");});
  txt(s2,L+(W-L-R)/2,H2-6,"σ: width of the predicted distribution","axt","middle");txt(s2,L,T2-6,"Mean CRPS (lower is better)","axt");
  ln(s2,L,H2-B2,W-R,H2-B2,"grid");
  S("path",{d:CUR.map(function(p,j){return (j?"L":"M")+X2(p[0]).toFixed(1)+" "+Y2(p[1]).toFixed(1);}).join(""),"class":"l4"},s2);
  ln(s2,X2(1),T2,X2(1),H2-B2,"vline");txt(s2,X2(1)+5,T2+12,"σ = true error: calibrated","lbl mut");
  var mk=S("circle",{cx:0,cy:0,r:6,"class":"mk"},s2),sl=$("#wc-s",host);
  function upd(){
    var d="";for(var j=0;j<=80;j++){var v=-4+j*0.1;d+=(j?"L":"M")+X(v).toFixed(1)+" "+Yd(Math.min(0.9,Math.exp(-v*v/(2*sg*sg))/(sg*Math.sqrt(2*Math.PI)))).toFixed(1);}
    pdf.setAttribute("d",d);
    var cr=crps(sg),ss=sg/rmse;mk.setAttribute("cx",X2(sg));mk.setAttribute("cy",Y2(cr));sl.value=sg;
    $(".wc-sv",host).textContent=sg.toFixed(2);
    var st=ss<0.85?"Overconfident: the distribution is too narrow and the truth often falls outside it.":(ss>1.15?"Too cautious: the distribution is too wide and carries little information.":"Well calibrated: CRPS is lowest around here.");
    $(".readout",host).innerHTML="σ = "+sg.toFixed(2)+": mean CRPS <b class=\"k\">"+cr.toFixed(3)+"</b>, spread-skill ≈ σ / RMSE = <b class=\"k\">"+ss.toFixed(2)+"</b>. "+st+" Mean error alone cannot tell you whether σ is right: the MAE stays at "+mae.toFixed(2)+" whatever σ is.";
  }
  sl.addEventListener("input",function(){auto=false;sg=parseFloat(sl.value);upd();});
  upd();
  if(!RM){c.int(70,function(){if(!auto){return;}sg+=dir*0.02;if(sg>2.6){dir=-1;}if(sg<0.3){dir=1;}upd();});}
  return function(){c.clear();};
};

D.wscene=function(host){
  var c=clock(),aware=false,sel=0,t=0;
  var W=480,H=300,ZN={x:236,y:136,r:44},GL={x:410,y:196};
  var PATHS=[[[12,44],[130,70],[236,128],[336,176],[410,196]],[[20,282],[150,252],[280,222],[410,196]],[[468,18],[452,92],[424,156],[410,196]],[[12,176],[120,186],[262,204],[410,196]]];
  var TYPES=["vehicle","vehicle","truck","cyclist"],VMAX=[14,12,10,6];
  host.innerHTML='<div class="ctl spread">'+segBtns("ws-m","Context input",[["0","Without the context map"],["1","With the context map"]],"0")+'<span class="mini" style="margin:0">Click an agent to select it</span></div><div class="chart"></div><div class="tokrow"></div><p class="readout" aria-live="polite"></p>';
  var svg=mkSvg($(".chart",host),W,H,"Illustrative: four agents heading to a goal, a blocked zone, and the predicted ensemble for the selected agent");
  S("circle",{cx:ZN.x,cy:ZN.y,r:ZN.r,"class":"zone1"},svg);S("circle",{cx:ZN.x,cy:ZN.y,r:ZN.r*0.6,"class":"zone2"},svg);
  txt(svg,ZN.x,ZN.y+ZN.r+16,"Blocked zone (from the context map)","axt","middle");
  S("rect",{x:GL.x-9,y:GL.y-9,width:18,height:18,rx:3,"class":"goalmk"},svg);txt(svg,GL.x,GL.y+26,"Goal","axt","middle");
  PATHS.forEach(function(p){S("polyline",{points:p.map(function(q){return q.join(",");}).join(" "),"class":"pathl"},svg);});
  var fanG=S("g",{},svg),ACS=[];
  PATHS.forEach(function(p,k){var g=S("g",{},svg);S("circle",{cx:0,cy:0,r:14,"class":"hitarea"},g);var tri=S("path",{d:"M0 -8 L6 7 L0 3 L-6 7 Z","class":"agent"},g);g.style.cursor="pointer";g.addEventListener("click",function(){sel=k;frame();});ACS.push({g:g,tri:tri});});
  var LENS=PATHS.map(function(p){var a=[0];for(var i=1;i<p.length;i++){a.push(a[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));}return a;});
  function at(k,f){var p=PATHS[k],Ls=LENS[k],d=f*Ls[Ls.length-1];for(var i=1;i<p.length;i++){if(d<=Ls[i]){var u=(d-Ls[i-1])/(Ls[i]-Ls[i-1]);return{x:p[i-1][0]+u*(p[i][0]-p[i-1][0]),y:p[i-1][1]+u*(p[i][1]-p[i-1][1]),dx:p[i][0]-p[i-1][0],dy:p[i][1]-p[i-1][1]};}}var n=p.length-1;return{x:p[n][0],y:p[n][1],dx:p[n][0]-p[n-1][0],dy:p[n][1]-p[n-1][1]};}
  function frac(k){return (t*0.6+k*0.23)%0.85;}
  function frame(){
    while(fanG.firstChild){fanG.removeChild(fanG.firstChild);}
    ACS.forEach(function(a,k){var q=at(k,frac(k)),ang=Math.atan2(q.dy,q.dx)*180/Math.PI+90;a.g.setAttribute("transform","translate("+q.x.toFixed(1)+" "+q.y.toFixed(1)+")");a.tri.setAttribute("class","agent"+(k===sel?" sel":""));a.tri.setAttribute("transform","rotate("+ang.toFixed(0)+")");});
    var q=at(sel,frac(sel)),hits=0,tot=0;
    for(var s=0;s<8;s++){
      var x=q.x,y=q.y,d="M"+x.toFixed(1)+" "+y.toFixed(1),hitAny=false,jit=(s-3.5)*0.07;
      for(var j=0;j<12;j++){
        var tx=GL.x-x,ty=GL.y-y,tn=Math.hypot(tx,ty);if(tn<10){break;}
        var dx=tx/tn,dy=ty/tn,an=jit+0.05*Math.sin(s*1.7+j),ca=Math.cos(an),sa=Math.sin(an),rx=dx*ca-dy*sa,ry=dx*sa+dy*ca;dx=rx;dy=ry;
        if(aware){var ox=x-ZN.x,oy=y-ZN.y,on=Math.hypot(ox,oy)||1;if(on<ZN.r+34){var w=(ZN.r+34-on)/(ZN.r+34)*1.6;dx+=ox/on*w;dy+=oy/on*w;var nn=Math.hypot(dx,dy);dx/=nn;dy/=nn;}}
        x+=dx*13;y+=dy*13;d+=" L"+x.toFixed(1)+" "+y.toFixed(1);
        tot++;if(Math.hypot(x-ZN.x,y-ZN.y)<ZN.r){hits++;hitAny=true;}
      }
      S("path",{d:d,"class":"fanl"+(hitAny?" in":"")},fanG);
    }
    var f=frac(sel)/0.85,spd=(VMAX[sel]*(1-0.55*f)).toFixed(1),hdg=Math.round((Math.atan2(q.dx,-q.dy)*180/Math.PI+360)%360);
    $(".tokrow",host).innerHTML=[["Agent","#"+(sel+1)+" "+TYPES[sel]],["x",(q.x*0.5).toFixed(1)+" m"],["y",((H-q.y)*0.5).toFixed(1)+" m"],["Speed",spd+" m/s"],["Heading",hdg+"°"],["Goal","G1"],["Context","map tile 3×2"]].map(function(p){return '<span><b>'+p[0]+'</b>'+p[1]+'</span>';}).join("");
    var pct=tot?Math.round(hits/tot*100):0;
    $(".readout",host).textContent=aware?"With the context map as an input, the predicted ensemble routes around the blocked zone ("+pct+"% of predicted points fall inside it). The row above is this agent's state token.":"Without the context map, the predicted ensemble cuts straight through the blocked zone ("+pct+"% of predicted points fall inside it), while real agents go around it. The row above is this agent's state token.";
  }
  onSeg($("#ws-m",host),function(v){aware=v==="1";frame();});
  frame();
  if(!RM){c.int(60,function(){t+=0.002;frame();});}
  return function(){c.clear();};
};

function projectDiag(cfg){return function(host){
  var c=clock(),C=2*Math.PI*54,ids=cfg.checks.map(function(x){return x[0];});
  host.innerHTML='<div class="ms">'+cfg.ms.map(function(m,k){return '<button type="button" class="msb" data-k="'+k+'"><span class="wr-n">Milestone '+(k+1)+'</span><b>'+m[0]+'</b></button>';}).join("")+'</div><div class="lcard ms-d" aria-live="polite"></div>'+(cfg.extra||"")+
    '<div class="kit"><svg class="ring" viewBox="0 0 132 132" role="img" aria-label="Progress"><circle class="rg-bg" cx="66" cy="66" r="54"></circle><circle class="rg-fg" cx="66" cy="66" r="54" transform="rotate(-90 66 66)" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+C.toFixed(1)+'"></circle><text class="rg-t" x="66" y="70"></text><text class="rg-s" x="66" y="88">progress</text></svg>'+
    '<div class="kgroup"><h4>'+cfg.checkTitle+'</h4>'+cfg.checks.map(function(it){return '<label class="kitem" for="kit-'+it[0]+'"><input type="checkbox" id="kit-'+it[0]+'" data-k="'+it[0]+'"'+(state.kit.indexOf(it[0])>=0?" checked":"")+'><span>'+it[1]+'</span></label>';}).join("")+'</div></div>'+
    (cfg.risk?'<p class="mini" style="margin:0">'+cfg.risk+'</p>':'');
  var bs=$$(".msb",host),dd=$(".ms-d",host);
  function show(k){bs.forEach(function(b,j){b.classList.toggle("on",j===k);});dd.innerHTML='<div class="lc-h"><b>Milestone '+(k+1)+': '+cfg.ms[k][0]+'</b></div><div>'+cfg.ms[k][1]+'</div>';}
  host.addEventListener("click",function(e){var b=e.target.closest(".msb");if(b){show(parseInt(b.getAttribute("data-k"),10));}});
  function upd(){var n=ids.filter(function(k){return state.kit.indexOf(k)>=0;}).length;$(".rg-fg",host).setAttribute("stroke-dashoffset",(C*(1-n/ids.length)).toFixed(1));$(".rg-t",host).textContent=n+"/"+ids.length;}
  host.addEventListener("change",function(e){var cb=e.target;if(!cb||cb.type!=="checkbox"){return;}var k=cb.getAttribute("data-k");if(cb.checked){if(state.kit.indexOf(k)<0){state.kit.push(k);}}else{state.kit=state.kit.filter(function(x){return x!==k;});}save();upd();});
  show(0);$(".rg-t",host).textContent="0/"+ids.length;if(RM){upd();}else{c.out(150,upd);}
  return function(){c.clear();};
};}

D.wproj=projectDiag({
  ms:[["Dataset and baselines","Pick one domain with public data. Driving logs such as the Waymo Open Motion Dataset are a good default, because Waymax and the Sim Agents leaderboard give you a closed-loop testbed. Clean the data, align the context inputs, and freeze a versioned dataset. Baselines: constant velocity, LSTM, flow matching. Metrics: minADE@k, CRPS, spread-skill, constraint violation rate, and collision or near-miss rate. Check the data license before you start."],
      ["Conditioning and paired tests","Add context (maps, forecasts) and actions or intent proxies (goals, latent actions). Report hard and easy regimes separately. Run What-If paired tests: keep the history fixed, change one variable (a goal, an obstacle), and check that the output moves in the right direction."],
      ["RL post-training and closed loop","Post-train with Flow-GRPO, or with SMART-R1-style SFT → RFT → SFT. Keep the rewards separate: CRPS or energy score, physical constraints, event realism (match the real near-miss rate rather than minimizing it), respect for the context (the share of rollouts entering blocked zones should match reality), and spread-skill near 1. Then replay in closed loop in a simulator."]],
  checkTitle:"Project checklist",
  checks:[["w-c1","Versioned dataset with context inputs"],["w-c2","Three baselines and five metrics"],["w-c3","Context and action conditioning"],["w-c4","What-If paired tests"],["w-c5","Separate verifiable rewards"],["w-c6","Flow-GRPO or SMART-R1-style RL post-training"],["w-c7","Closed-loop replay in a simulator"],["w-c8","Public write-up"]],
  risk:"Risks: data licenses, missing action labels, and open-loop metrics that do not predict closed-loop behavior. Use public data throughout."
});
/* ---------- algorithm atlas: mechanism diagrams ---------- */
D.akl=function(host){
  var c=clock(),mode="fwd",t=RM?1:0;
  function N(x,m,s){return Math.exp(-(x-m)*(x-m)/(2*s*s))/(s*Math.sqrt(2*Math.PI));}
  function p(x){return 0.62*N(x,2,0.55)+0.38*N(x,-2,0.55);}
  var FW={m:0.62*2+0.38*-2},v2=0.55*0.55+4;FW.s=Math.sqrt(v2-FW.m*FW.m);
  var RV={m:0,s:1,kl:1e9},xs=[],x,i;for(x=-6;x<=6;x+=0.04){xs.push(x);}
  for(var mu=-3.5;mu<=3.5;mu+=0.05){for(var sg=0.2;sg<=2.6;sg+=0.04){var kl=0;for(i=0;i<xs.length;i++){var q=N(xs[i],mu,sg);if(q>1e-12){kl+=q*(Math.log(q)-Math.log(p(xs[i])+1e-300))*0.04;}}if(kl<RV.kl){RV={m:mu,s:sg,kl:kl};}}}
  host.innerHTML='<div class="ctl">'+segBtns("ak-m","KL direction",[["fwd","Forward KL(teacher‖student): SFT, offline distillation"],["rev","Reverse KL(student‖teacher): on-policy distillation, the KL term in RL"]],"fwd")+'</div><div class="chart"></div><p class="readout" aria-live="polite"></p>';
  var W=480,H=220,L=20,R=20,T=24,B=30;function X(v){return L+(v+5)/10*(W-L-R);}function Y(v){return T+(1-v/0.62)*(H-T-B);}
  var svg=mkSvg($(".chart",host),W,H,"The teacher is bimodal and the student can only be a single Gaussian: the student fitted under each KL direction");
  var a="M"+X(-5)+" "+Y(0);for(x=-5;x<=5.001;x+=0.05){a+="L"+X(x).toFixed(1)+" "+Y(p(x)).toFixed(1);}a+="L"+X(5)+" "+Y(0)+"Z";
  S("path",{d:a,"class":"hist"},svg);ln(svg,L,Y(0),W-R,Y(0),"grid");
  txt(svg,X(2),Y(p(2))-8,"Teacher’s main peak","lbl mut","middle");txt(svg,X(-2),Y(p(-2))-8,"Teacher’s minor peak","lbl mut","middle");
  var qp=S("path",{d:"","class":"l1"},svg),gap=txt(svg,X(0),Y(0)-8,"","lbl bad","middle");
  txt(svg,L,14,"Gray: teacher (two peaks). Colored line: student (a single Gaussian)","axt");
  function upd(){
    var tg=mode==="fwd"?FW:RV,e=1-Math.pow(1-t,3),m=0+(tg.m-0)*e,s=2.6+(tg.s-2.6)*e,d="";
    for(x=-5;x<=5.001;x+=0.05){d+=(d?"L":"M")+X(x).toFixed(1)+" "+Y(Math.min(0.62,N(x,m,s))).toFixed(1);}
    qp.setAttribute("d",d);qp.setAttribute("class",mode==="fwd"?"l1":"l3");
    gap.textContent=mode==="fwd"&&t>0.8?"Student puts mass where the teacher is near zero":"";
    $(".readout",host).textContent=mode==="fwd"?"Forward KL is the same as maximizing the student’s likelihood on teacher samples (this is what SFT and offline distillation do). The student must cover every teacher peak; without enough capacity it spreads out and puts probability between the peaks, where the teacher would never go (mean-seeking). Fit: mean "+FW.m.toFixed(2)+", width "+FW.s.toFixed(2)+".":"Reverse KL is computed on the student’s own samples and penalizes the student for saying what the teacher considers impossible. The student locks onto one peak and stays sharp (mode-seeking), at the cost of dropping the other peak and losing diversity. The per-token reward in on-policy distillation is exactly −(log π_student − log π_teacher). Fit: mean "+RV.m.toFixed(2)+", width "+RV.s.toFixed(2)+".";
  }
  onSeg($("#ak-m",host),function(v){mode=v;t=RM?1:0;upd();});
  upd();if(!RM){c.int(40,function(){if(t<1){t=Math.min(1,t+0.025);upd();}});}
  return function(){c.clear();};
};

D.adense=function(host){
  var c=clock(),mode="rl",cur=RM?10:-1;
  var T=["12×15","=","12×10","+","12×5","=","120","+","50","=","170"],K=[0.05,0.02,0.08,0.03,0.04,0.02,0.05,0.04,2.6,0.03,0.07];
  host.innerHTML='<div class="mini">Problem: 12 × 15 = ? Below is the answer the student wrote (token 9 is wrong: 12 × 5 should be 60)</div>'+
    '<div class="ctl">'+segBtns("ad-m","Signal source",[["rl","RL: one reward at the end of the response"],["opd","On-policy distillation: the teacher scores every token"]],"rl")+'</div>'+
    '<div class="toks">'+T.map(function(s,k){return '<div class="tok"><div class="b"><i style="height:0"></i></div><code>'+s+'</code></div>';}).join("")+'</div>'+
    '<div class="gates"><div class="gate"><div class="gname">Training signals per response</div><div class="meterbar"><i class="acc ad-n"></i></div><b class="k ad-v"></b></div></div>'+
    '<p class="readout" aria-live="polite"></p>';
  var bars=$$(".tok .b i",host),codes=$$(".tok code",host);
  function upd(){
    bars.forEach(function(b,k){var on=k<=cur;var h=mode==="rl"?(cur>=T.length-1?60:0):(on?Math.max(6,K[k]/2.6*100):0);b.style.height=h+"%";b.style.background=mode==="rl"?"var(--boss)":(K[k]>1?"var(--boss)":"var(--k-dist)");});
    codes.forEach(function(e,k){e.classList.toggle("cur",k===cur);});
    $(".ad-n",host).style.width=(mode==="rl"?1/T.length*100:100)+"%";$(".ad-v",host).textContent=mode==="rl"?"1":String(T.length);
    $(".readout",host).textContent=mode==="rl"?"The final answer 170 is wrong (it should be 180), so reward = 0. All 11 tokens of the response get pushed down together, including the 8 correct steps before the error. Only many samples can average out which step was actually wrong.":"The teacher scores every position the student wrote (per-token reverse KL). Only the “50” step is heavily penalized; the later “= 170” is correct given “120 + 50”, so it is barely penalized. The signal is per token, so the same number of samples teaches much more, provided you have a stronger teacher.";
  }
  onSeg($("#ad-m",host),function(v){mode=v;cur=RM?T.length-1:-1;upd();});
  upd();if(!RM){var hold=0;c.int(260,function(){if(cur<T.length-1){cur++;upd();}else{hold++;if(hold>14){hold=0;cur=-1;upd();}}});}
  return function(){c.clear();};
};

D.adpo=function(host){
  var c=clock(),k=0,auto=!RM,mode="dpo";
  var ST=[["Objective","max<sub>π</sub> E[ r(x,y) ] − β·KL( π ‖ π<sub>ref</sub> )","The RLHF objective: get high reward without drifting too far from the reference model. PPO optimizes it directly with sampling and a critic."],
    ["Closed-form solution","π*(y|x) = π<sub>ref</sub>(y|x) · exp( r(x,y) / β ) / Z(x)","This objective has a closed-form optimum: the reference model times exp(reward / β), normalized. Z(x) sums over all possible responses, so it cannot be computed."],
    ["Solve for the reward","r(x,y) = β·log( π*(y|x) / π<sub>ref</sub>(y|x) ) + β·log Z(x)","Inverting it, the reward can be written as the log-probability ratio between the policy and the reference model: the language model itself is an implicit reward model."],
    ["Plug into Bradley-Terry","L = −log σ( β·log π(y<sub>w</sub>)/π<sub>ref</sub>(y<sub>w</sub>) − β·log π(y<sub>l</sub>)/π<sub>ref</sub>(y<sub>l</sub>) )","Bradley-Terry only looks at the reward difference between two responses, so the intractable Z(x) cancels. What remains is a classification loss: no sampling, no reward model, no critic. The cost is that it learns only from fixed preference pairs, and those responses were not generated by the current policy (offline)."]];
  host.innerHTML='<div class="deriv">'+ST.map(function(s,j){return '<div class="dv" data-k="'+j+'"><span class="dn">'+(j+1)+' · '+s[0]+'</span>'+s[1]+'</div>';}).join("")+'</div><p class="readout ad-r" aria-live="polite"></p>'+
    '<div class="ctl">'+segBtns("dp-m","Training method",[["dpo","DPO"],["rpo","DPO plus an SFT term on chosen"]],"dpo")+'</div><div class="chart"></div><p class="readout ad-r2" aria-live="polite"></p>';
  var dvs=$$(".dv",host);
  function show(j){k=j;dvs.forEach(function(d,i){d.classList.toggle("on",i===j);});$(".ad-r",host).textContent=ST[j][2];}
  host.addEventListener("click",function(e){var d=e.target.closest(".dv");if(d){auto=false;show(parseInt(d.getAttribute("data-k"),10));}});
  var W=480,H=200,L=44,R=86,Tt=16,B=30;function X(v){return L+v/100*(W-L-R);}function Y(v){return Tt+(1-(v+30)/60)*(H-Tt-B);}
  var svg=mkSvg($(".chart",host),W,H,"Illustrative: log probabilities of chosen and rejected during training, and their difference");
  [-30,-15,0,15,30].forEach(function(v){ln(svg,L,Y(v),W-R,Y(v),"grid");txt(svg,L-6,Y(v)+4,(v>0?"+":"")+v,"axt","end");});
  txt(svg,L+(W-L-R)/2,H-6,"Training steps","axt","middle");txt(svg,L,10,"Change in log probability from the start","axt");
  var pc=S("path",{d:"","class":"l4"},svg),pr=S("path",{d:"","class":"l2"},svg),pm=S("path",{d:"","class":"l1 dash"},svg);
  var lc=txt(svg,W-R+4,0,"chosen","lbl ok"),lr=txt(svg,W-R+4,0,"rejected","lbl amb"),lm=txt(svg,W-R+4,0,"margin","lbl acc");
  function fc(s){return mode==="dpo"?-6*(1-Math.exp(-s/35)):3*(1-Math.exp(-s/35));}function fr(s){return -26*(1-Math.exp(-s/30));}function fm(s){return fc(s)-fr(s);}
  function draw(){pc.setAttribute("d",pathOf(fc,0,100,60,X,Y));pr.setAttribute("d",pathOf(fr,0,100,60,X,Y));pm.setAttribute("d",pathOf(fm,0,100,60,X,Y));
    lc.setAttribute("y",Y(fc(100))+4);lr.setAttribute("y",Y(fr(100))+4);lm.setAttribute("y",Y(fm(100))+4);
    $(".ad-r2",host).textContent=mode==="dpo"?"DPO only asks for the margin to grow. Often the chosen probability falls too, just more slowly than rejected; probability mass moves to responses that appear in neither (likelihood displacement).":"Adding an SFT term (negative log-likelihood) on chosen stops the chosen probability from falling. Llama 3’s DPO stage and iterative DPO on reasoning tasks both do this.";}
  onSeg($("#dp-m",host),function(v){mode=v;draw();});
  show(0);draw();if(!RM){c.int(4200,function(){if(auto){show((k+1)%ST.length);}});}
  return function(){c.clear();};
};

D.aprm=function(host){
  var mode="orm";
  var Q="A price rises 20%, then falls 20%. What percent of the original price is the final price?";
  var STP=[["Let the original price be 100",0.97,1],["Up 20%: 100 × 1.2 = 120",0.95,1],["Down 20%: 120 − 20 = 100",0.12,0],["So the final price is 100",0.31,0],["Answer: 100% of the original price",0.08,0]];
  host.innerHTML='<div class="mini">Problem: '+Q+' (correct answer: 96%)</div><div class="ctl">'+segBtns("ap-m","Scoring method",[["orm","ORM: scores only the final answer"],["prm","PRM: scores each step"],["gen","Generative judge: writes a rationale, then decides"]],"orm")+'</div>'+
    '<div class="schain">'+STP.map(function(s,k){return '<div class="stepc'+(k===2?' badstep':'')+'"><span class="sn">S'+(k+1)+'</span><span>'+s[0]+'</span><span class="sb"><i style="width:0"></i></span><span class="sv2"></span></div>';}).join("")+'</div>'+
    '<div class="lcard ap-g" hidden><div class="lc-h"><b>Judge output</b></div><div class="k" style="white-space:pre-wrap">Step 3 is wrong: a 20% decrease means 120 × 0.8 = 96, not subtracting 20.\nThe later steps all build on this error. The correct answer is 96%.\nVerdict: incorrect.</div></div>'+
    '<p class="readout" aria-live="polite"></p>';
  function upd(){
    $$(".stepc",host).forEach(function(r,k){var i=$(".sb i",r),v=$(".sv2",r),sc=null;
      if(mode==="orm"){sc=k===STP.length-1?0:null;}else if(mode==="prm"){sc=STP[k][1];}
      i.style.width=sc===null?"0":Math.max(3,sc*100)+"%";i.style.background=sc===null?"transparent":(sc>0.5?"var(--good)":"var(--boss)");v.textContent=sc===null?"—":sc.toFixed(2);});
    $(".ap-g",host).hidden=mode!=="gen";
    $(".readout",host).textContent={orm:"An ORM (or a 0/1 answer checker) gives the whole chain a single score. As an RL reward, the model cannot tell which step was wrong; for best-of-n reranking, answers with a wrong process that happen to reach the right answer also get picked.",prm:"A PRM scores every step: the error is located at step 3, and the steps built on it also score low. The cost is step-level labeling (PRM800K has about 800K step-level labels), and the PRM itself can be hacked.",gen:"A generative judge writes its reasoning before concluding: you can trade more reasoning for more accurate judgments, and it is easier to audit. The cost is high, and it can still be fooled (see One Token to Fool in M8)."}[mode];
  }
  onSeg($("#ap-m",host),function(v){mode=v;upd();});
  upd();
};

function X_(id){return "https://arxiv.org/abs/"+id;}
var ALGO={
  reinforce:{n:"REINFORCE / ReMax",yr:"1992",y:"REINFORCE 1992 (Williams); ReMax 2023 (CUHK-Shenzhen)",on:1,rm:1,
    p:"The most basic policy gradient: sample, then raise log probabilities weighted by reward.",
    h:"Gradient = (R − b)·∇log π(y|x), where b is a baseline that reduces variance. ReMax sets the baseline to the reward of the greedy-decoded response.",
    num:"ReMax uses 46% less GPU memory than PPO at 7B.",
    pit:"High variance; with a poor baseline, the gradient is very noisy.",
    f:"∇J = E[ (R − b) · ∇log π<sub>θ</sub>(y|x) ]",l:[["ReMax",X_("2310.10505")]]},
  ppo:{n:"PPO (RLHF)",yr:"2017",y:"PPO 2017; RLHF-PPO 2022 (OpenAI InstructGPT)",on:1,rm:1,ref:1,critic:1,
    p:"A policy gradient step that is too large breaks training; PPO uses clipping as a simple trust region.",
    h:"Compute a per-token importance ratio r = π/π_old and take min(r·A, clip(r, 1±ε)·A); advantages come from a critic plus GAE. The RLHF version folds a per-token KL penalty against the reference model into the reward.",
    who:"InstructGPT; the RLVR stage of Tülu 3; ByteDance Seed’s VAPO still keeps the critic.",
    num:"InstructGPT: responses from the 1.3B model were preferred over 175B GPT-3.",
    pit:"Four models in memory at once; on long CoT the critic tends to be biased (VC-PPO and VAPO target exactly this).",
    f:"min( r<sub>t</sub>·Â<sub>t</sub> , clip(r<sub>t</sub>, 1−ε, 1+ε)·Â<sub>t</sub> )",l:[["PPO",X_("1707.06347")],["InstructGPT",X_("2203.02155")]]},
  vapo:{n:"VC-PPO / VAPO",yr:"2025",y:"2025 · ByteDance Seed",on:1,rm:1,critic:1,
    p:"Instead of removing the critic, fix it: critic bias on long CoT is the root of PPO’s instability.",
    h:"Pretrain the value model first; use decoupled GAE parameters for the policy and the value; adapt GAE to response length.",
    who:"Seed1.5-Thinking.",num:"AIME24 60.4 on Qwen2.5-32B, more than 10 points above DAPO; on Seed’s 150B MoE, VAPO 79% vs DAPO 73%.",
    pit:"The engineering complexity of the critic comes back.",l:[["VC-PPO",X_("2503.01491")],["VAPO",X_("2504.05118")]]},
  rloo:{n:"RLOO",yr:"2024",y:"2024 · Cohere",on:1,rm:1,ref:1,
    p:"PPO is too heavy for LLMs. A whole response can be treated as a single action.",
    h:"Sample k responses per prompt; the baseline is the mean reward of the other k − 1 (leave-one-out). Pure REINFORCE: no critic, with the KL penalty folded into the reward.",
    who:"Implemented in five frameworks including TRL, OpenRLHF, and verl; no large-model tech report says it uses it yet.",
    num:"In the paper, REINFORCE-style methods beat PPO’s win rate by 3.2–20.3 percentage points.",
    pit:"High variance when k is small.",
    f:"Â<sub>i</sub> = R<sub>i</sub> − ( Σ<sub>j≠i</sub> R<sub>j</sub> ) / (k − 1)",l:[["RLOO",X_("2402.14740")]]},
  rpp:{n:"REINFORCE++",yr:"2025",y:"2025 · OpenRLHF",on:1,rm:1,ref:1,
    p:"No critic and no per-prompt grouping: the whole batch is the baseline.",
    h:"Advantages are normalized across the whole batch, combined with PPO-style clipping and a per-token KL penalty.",
    who:"Implemented in five open-source frameworks; no large-model tech report says it uses it yet.",
    pit:"Not yet proven at frontier scale.",
    f:"Â = ( R − mean<sub>batch</sub> ) / std<sub>batch</sub>",l:[["REINFORCE++",X_("2501.03262")]]},
  grpo:{n:"GRPO",yr:"2024",y:"2024 · DeepSeek (DeepSeekMath)",on:1,rm:1,ref:1,
    p:"Drop the critic: sample a group of responses per prompt and use the group mean as the baseline.",
    h:"Â = (R − group mean) / group std; PPO-style clip; a k3-estimated KL added directly to the loss; averaging by length within each response.",
    who:"DeepSeek-R1, V3.2, and the V4 expert models; Qwen3; GLM-5; Nemotron 3 Ultra. The default backbone for RL on large open models in 2026, though most drop the KL and add clip-higher.",
    num:"Qwen3-235B’s AIME24 went from 70.1 to 85.1 within 170 RL steps.",
    pit:"Length averaging introduces a length bias and dividing by the std introduces a difficulty bias; per-token ratios are noisy on MoE.",
    f:"Â<sub>i</sub> = ( R<sub>i</sub> − mean(R) ) / std(R)",l:[["DeepSeekMath",X_("2402.03300")],["DeepSeek-R1",X_("2501.12948")]]},
  drgrpo:{n:"Dr. GRPO",yr:"2025",y:"2025 · Sea AI Lab",on:1,rm:1,ref:1,
    p:"GRPO’s two normalizations are biased: long wrong answers are penalized less, so responses keep getting longer; dividing by the std favors prompts that are too hard or too easy.",
    h:"Remove 1/|o| and the std; divide the loss by a constant instead.",
    who:"Meituan LongCat; Olmo 3 and DeepSeek-V3.2 also drop the std.",
    num:"Trained a 7B base model to 43.3% on AIME24.",
    pit:"Many open-source PPO implementations have the same length bias, not just GRPO.",
    f:"Â<sub>i</sub> = R<sub>i</sub> − mean(R), loss divided by a constant",l:[["Dr. GRPO",X_("2503.20783")]]},
  dapo:{n:"DAPO",yr:"2025",y:"2025 · ByteDance Seed, Tsinghua AIR",on:1,rm:1,
    p:"In long-CoT RL, entropy collapses, many groups give no gradient, long responses dilute the gradient, and truncation adds reward noise.",
    h:"Clip-higher (upper bound 0.28); dynamic sampling (drop all-correct or all-wrong groups); token-level averaging; a soft penalty for overlong responses; no KL.",
    who:"GLM-4.5 and GLM-5, MiniMax-M1, Olmo 3, and LongCat all use some of these tricks.",
    num:"AIME24 50 on Qwen2.5-32B, vs 47 for DeepSeek-R1-Zero on the same base, with half the training steps.",
    pit:"Meta’s ScaleRL found its asymptotic ceiling is lower than that of CISPO and GSPO.",
    f:"clip( r, 1 − 0.2, 1 + 0.28 ); keep only groups with 0 &lt; #correct &lt; G",l:[["DAPO",X_("2503.14476")],["ScaleRL",X_("2510.13786")]]},
  gspo:{n:"GSPO",yr:"2025",y:"2025 · Qwen",on:1,rm:1,
    p:"The reward is given to the whole response, so per-token importance ratios are noisy; on MoE, any routing change makes things even less stable.",
    h:"Compute the ratio over the whole response and take the length-normalized root: (π(y)/π_old(y))<sup>1/|y|</sup>; clip the whole response together, with a very narrow range (about 3e-4).",
    who:"Later Qwen3 models; Meituan LongCat; supported by seven mainstream RL frameworks.",
    num:"On Qwen3-30B-A3B, about 10% of expert routes change with each update, which makes per-token ratios noisy.",
    pit:"Coarser credit assignment: all tokens in a response share one ratio.",
    f:"s<sub>i</sub> = ( π<sub>θ</sub>(y<sub>i</sub>) / π<sub>old</sub>(y<sub>i</sub>) )<sup>1/|y<sub>i</sub>|</sup>",l:[["GSPO",X_("2507.18071")]]},
  cispo:{n:"CISPO",yr:"2025",y:"2025 · MiniMax (M1)",on:1,rm:1,
    p:"PPO’s clip simply drops the gradient of low-probability “pivot” tokens (such as However and Wait), which hurts long reasoning.",
    h:"Do not clip the update; clip only the importance weight and stop its gradient: sg(clip(r))·Â·log π. Every token keeps its gradient.",
    who:"MiniMax-M1 and M2; Meta’s ScaleRL recipe.",
    num:"About 2× faster than DAPO; MiniMax-M1’s entire RL stage cost about $535K.",
    pit:"The update itself has no trust region, so the step size must be controlled by other means.",
    f:"sg( clip(r<sub>t</sub>, 1−ε<sub>low</sub>, 1+ε<sub>high</sub>) ) · Â · log π<sub>θ</sub>(o<sub>t</sub>)",l:[["MiniMax-M1",X_("2506.13585")],["ScaleRL",X_("2510.13786")]]},
  sapo:{n:"SAPO",yr:"2025",y:"2025 · Qwen",on:1,rm:1,
    p:"A hard clip cuts off abruptly at the boundary, so the gradient is discontinuous.",
    h:"Replace the hard clip with a sigmoid soft gate, using a higher temperature for negative advantages than for positive ones.",
    who:"Qwen3-VL.",pit:"No large-model report outside Qwen uses it yet.",l:[["SAPO",X_("2511.20347")]]},
  kimi:{n:"Kimi’s RL objective",yr:"2025",y:"2025–26 · Moonshot (K2, K2.5, K3)",on:1,rm:1,pol:"Online, with partial rollouts",
    p:"In agentic RL with long rollouts, policy drift and training-inference mismatch are both worse.",
    h:"K2: a squared loss (r − r̄ − τ·log(π/π_old))² with the regularizer built in. K2.5 and K3: tokens whose log ratio falls outside [α, β] have their gradient masked, regardless of the sign of the advantage.",
    who:"Kimi K2, K2.5, K3.",pit:"Public details are limited; reproduction relies mainly on the formulas in the tech reports.",
    f:"K2: ( r − r̄ − τ·log( π<sub>θ</sub> / π<sub>old</sub> ) )²",l:[["Kimi K2",X_("2507.20534")],["Kimi K2.5",X_("2602.02276")],["Kimi K3",X_("2607.24653")]]},
  mismatch:{n:"Training-inference mismatch correction",yr:"2025",y:"2025 · TIS (Yao et al.), IcePop / MIS (Ant Ling)",on:1,rm:1,
    p:"Rollout uses vLLM or SGLang while training uses a different set of kernels. For the same response the two sides compute different probabilities, and RL quietly becomes off-policy.",
    h:"TIS: multiply by a truncated weight min(π<sub>train</sub>/π<sub>infer</sub>, C). MIS and IcePop: zero out tokens where the two probabilities differ too much. The root fix is consistent numerics: an FP32 LM head, FP16, or quantization in both training and inference.",
    who:"TIS: Olmo 3, the TRL default. IcePop: Ring-1T, GLM-5. MIS: Nemotron 3 Ultra. FP32 head: MiniMax-M1.",
    num:"ScaleRL: switching the LM head to FP32 raised asymptotic performance from 0.52 to 0.61.",
    pit:"It only mitigates the problem; MoE also needs fixed routing (DeepSeek-V3.2 keeps the rollout-time routing and sampling masks). I4 has a diagram of this problem.",
    f:"w<sub>t</sub> = min( π<sub>train</sub>(o<sub>t</sub>) / π<sub>infer</sub>(o<sub>t</sub>) , C )",l:[["verl rollout correction",'https://verl.readthedocs.io/en/latest/algo/rollout_corr_math.html'],["IcePop",X_("2510.18855")],["FP16",X_("2510.26788")]]},
  entropy:{n:"Entropy control",yr:"2025",y:"2025 · Clip-Cov / KL-Cov (Shanghai AI Lab); ProRL (NVIDIA)",on:1,rm:1,ref:1,
    p:"As RL training goes on, entropy bottoms out, the model stops exploring, and performance plateaus.",
    h:"Clip-Cov and KL-Cov: apply clipping or a KL penalty to the few tokens with the highest covariance between log probability and advantage. ProRL: keep the KL, periodically reset the reference model to the current policy, make the tasks as diverse as possible, and train beyond 2,000 steps.",
    num:"Empirical law R = −a·e<sup>H</sup> + b: once entropy is used up, performance tops out. ProRL’s 1.5B model scores 14.7% higher than R1-1.5B on math.",
    pit:"A few extra hyperparameters; resetting the reference model is a heuristic.",l:[["Clip-Cov / KL-Cov",X_("2505.22617")],["ProRL",X_("2505.24864")]]},
  async:{n:"Async RL",yr:"2025",y:"2025 · AReaL (Tsinghua, Ant), PipelineRL",on:1,rm:1,pol:"Bounded staleness: samples may come from a policy a few steps old",
    p:"In synchronous RL, generation and training wait on each other, leaving GPUs idle much of the time.",
    h:"Generation and training run concurrently. AReaL uses decoupled PPO to separate the behavior policy from the proximal policy; PipelineRL swaps in new weights in the middle of generation.",
    who:"Ant’s Ring and Ling use AReaL; Meta’s ScaleRL uses PipelineRL-style async.",
    num:"Training speedups of about 2.77× (AReaL) and about 2× (PipelineRL).",
    pit:"The staler the data, the more off-policy it is, so importance correction is needed. I4 has a diagram comparing sync and async.",l:[["AReaL",X_("2505.24298")],["PipelineRL",X_("2509.19128")]]},
  dpo:{n:"DPO",yr:"2023",y:"2023 · Stanford",ref:1,
    p:"PPO is too complex: it needs sampling, a reward model, and a critic.",
    h:"Plug the closed-form solution of the RLHF objective into Bradley-Terry to get a classification loss over preference pairs alone (derivation in the first diagram of A2).",
    who:"Tülu 3 (length-normalized DPO); Olmo 3 (Delta Learning); Llama 4 finishes with “lightweight DPO”.",
    num:"Tülu 3’s comparison: length-normalized DPO averages 57.3, PPO 55.5. But in Xu et al. 2024, well-tuned PPO beats DPO on every task (CodeContest 10@1k: 16.4% → 22.4%).",
    pit:"Offline: no exploration, and it may push probability onto unseen responses; results depend on how close the preference data is to the current policy.",
    f:"−log σ( β·[ log π(y<sub>w</sub>)/π<sub>ref</sub>(y<sub>w</sub>) − log π(y<sub>l</sub>)/π<sub>ref</sub>(y<sub>l</sub>) ] )",l:[["DPO",X_("2305.18290")],["Is DPO Superior to PPO?",X_("2404.10719")],["Tülu 3",X_("2411.15124")]]},
  ipo:{n:"IPO",yr:"2023",y:"2023 · Google DeepMind",ref:1,
    p:"When preferences are close to deterministic, DPO pushes the margin toward infinity and overfits.",
    h:"Replace the logistic loss with squared regression on the margin, toward a finite target value.",
    pit:"Mostly still at the research stage.",
    f:"( margin − 1/(2τ) )²",l:[["IPO",X_("2310.12036")]]},
  kto:{n:"KTO",yr:"2024",y:"2024 · Stanford, Contextual AI",ref:1,
    p:"Paired preference data is hard to collect; single “good / bad” labels are much easier.",
    h:"Borrows the value function from prospect theory: compute utility separately for good and bad single responses, with the reference point estimated from the KL.",
    num:"Matches DPO from 1B to 30B.",pit:"A poor estimate of the reference point hurts stability.",l:[["KTO",X_("2402.01306")]]},
  orpo:{n:"ORPO",yr:"2024",y:"2024 · KAIST",
    p:"Merge SFT and preference alignment into one step, with no reference model.",
    h:"NLL on chosen, plus a contrastive odds-ratio loss.",
    num:"12.20% on AlpacaEval 2.0.",pit:"The whole tradeoff between SFT and preference rests on a single coefficient λ.",
    f:"NLL(y<sub>w</sub>) − λ·log σ( log odds(y<sub>w</sub>) − log odds(y<sub>l</sub>) )",l:[["ORPO",X_("2403.07691")]]},
  simpo:{n:"SimPO",yr:"2024",y:"2024 · Princeton",
    p:"DPO’s implicit reward does not match the average log probability actually used at generation, and DPO needs a reference model.",
    h:"Use the length-averaged log probability directly as the reward, add a margin γ, and drop the reference model.",
    num:"6.4 points above DPO on AlpacaEval 2.",pit:"Lost to length-normalized DPO in Tülu 3; γ and β need tuning.",
    f:"−log σ( β·avg log π(y<sub>w</sub>) − β·avg log π(y<sub>l</sub>) − γ )",l:[["SimPO",X_("2405.14734")]]},
  odpo:{n:"Online / iterative DPO",yr:"2024",y:"2024 · OAIF (Google DeepMind), RLHF Workflow, and others",on:1,rm:1,ref:1,
    p:"DPO is offline and does not explore.",
    h:"Each round, sample new responses from the current policy, have an RM or LLM judge label preference pairs, then run DPO.",
    num:"In its experiments, OAIF beats both offline DPO and RLHF.",pit:"The judge’s own preferences get learned too.",l:[["OAIF",X_("2402.04792")],["RLHF Workflow",X_("2405.07863")]]},
  sppo:{n:"SPPO / Nash learning",yr:"2024",y:"2023 · DeepMind (NLHF); 2024 · UCLA (SPPO)",on:1,rm:1,ref:1,
    p:"Bradley-Terry assumes preferences are transitive, which real preferences may not be.",
    h:"Learn a pairwise preference model directly and solve for the Nash equilibrium of the resulting game; SPPO approximates it with iterative self-play.",
    num:"SPPO’s length-controlled win rate on AlpacaEval 2 is 28.53%.",pit:"Mostly still at the research stage.",l:[["NLHF",X_("2312.00886")],["SPPO",X_("2405.00675")]]},
  sftkd:{n:"Offline distillation",yr:"2016",y:"SeqKD 2016 (Harvard); DeepSeek-R1 distillation 2025",teacher:1,
    p:"Move a large model’s abilities into a small model cheaply; you only need the teacher’s output text (a black-box API works too).",
    h:"Have the teacher generate responses and SFT the student on them. Equivalent to minimizing the forward KL(teacher‖student).",
    who:"DeepSeek-R1 distilled small Qwen and Llama models from about 800K R1 samples; the first stage of the small Qwen3 models.",
    num:"R1-Distill-Qwen-32B scores 72.6 on AIME24; the same base trained directly with more than 10K steps of RL reaches only 47.0.",
    pit:"Exposure bias: during training the student sees only states the teacher visited, but at inference it reaches its own states, and errors compound. Gains grow roughly logarithmically with data size.",
    f:"min E<sub>y~teacher</sub>[ −log π<sub>θ</sub>(y|x) ]",l:[["SeqKD",X_("1606.07947")],["DeepSeek-R1",X_("2501.12948")]]},
  minillm:{n:"MiniLLM",yr:"2023",y:"2023 · Tsinghua, Microsoft Research",on:1,teacher:1,
    p:"Forward KL forces a small student to spread probability onto outputs the teacher would never produce.",
    h:"Minimize the reverse KL(student‖teacher) instead, optimized with policy gradient on the student’s own samples; single-step decomposition, mixing in teacher samples, and length normalization stabilize training.",
    pit:"Reverse KL rewards very short or even empty responses, so length normalization is required.",
    f:"min KL( π<sub>θ</sub> ‖ π<sub>teacher</sub> ), estimated on student samples",l:[["MiniLLM",X_("2306.08543")]]},
  gkd:{n:"GKD",yr:"2023",y:"2023 · Google DeepMind",on:1,teacher:1,
    p:"Offline distillation trains on the teacher’s states, but at inference the student reaches its own states.",
    h:"Mix fixed data and the student’s own samples in proportion λ; the divergence is a generalized JSD(β) that interpolates between forward and reverse KL. λ = 1 is fully on-policy.",
    who:"TRL’s GKD trainer and Distillation trainer.",
    num:"Reported gains over standard KD: 2.1× on summarization, 1.7× on translation, 1.9× on math reasoning.",
    pit:"The best divergence depends on the task; gains appear only once on-policy data is above 25%.",
    f:"(1−λ)·D<sub>fixed data</sub> + λ·D<sub>student samples</sub>, D = JSD(β)",l:[["GKD",X_("2306.13649")],["TRL GKD",'https://huggingface.co/docs/trl/main/en/gkd_trainer']]},
  opd:{n:"On-policy distillation (OPD)",yr:"2025",y:"2025-10 · systematized by Thinking Machines; Qwen3 used it in production earlier",on:1,teacher:1,
    p:"RL gives each response a single score, which is too sparse; offline distillation suffers from exposure bias. OPD gets a dense per-token signal on the student’s own samples.",
    h:"The student samples; the teacher computes a log probability for every token. Per-token reward = log π<sub>teacher</sub> − log π<sub>student</sub> (discount 0), used as the advantage in RL’s importance-sampling loss. In practice, you swap the reference model in the KL regularizer for the teacher.",
    who:"Qwen3’s 0.6B–14B and 30B-A3B; the Tinker cookbook; verl added OPD docs in 2026-10.",
    num:"Qwen3-8B: OPD reaches 74.4 on AIME24 in 1,800 GPU hours; RL reaches 67.6 in 17,920 GPU hours. Thinking Machines: AIME24 from 60% to 70% in about 150 steps, with about 9× fewer FLOPs than continuing SFT.",
    pit:"The teacher is the ceiling; teacher and student must share a tokenizer (if not, align them with TRL’s GOLD); a confidently wrong teacher leads the student astray (TGOPD verifies before distilling).",
    f:"r<sub>t</sub> = log π<sub>teacher</sub>(x<sub>t</sub>|x<sub>&lt;t</sub>) − log π<sub>θ</sub>(x<sub>t</sub>|x<sub>&lt;t</sub>), x ~ π<sub>θ</sub>",
    l:[["On-Policy Distillation","https://thinkingmachines.ai/blog/on-policy-distillation/"],["Qwen3",X_("2505.09388")],["verl OPD","https://verl.readthedocs.io/en/latest/algo/opd.html"],["TGOPD",X_("2609.02998")]]},
  mopd:{n:"Multi-teacher on-policy distillation (MOPD)",yr:"2026",y:"2026 · Xiaomi MiMo-V2-Flash, then DeepSeek-V4, Kimi K3",on:1,teacher:1,
    p:"Running RL on math, code, and agents in one model makes the abilities interfere with each other; instead, train specialist experts first, then merge them into one student.",
    h:"Train one expert per domain with SFT plus RL; the student minimizes Σ w<sub>i</sub>·KL(π<sub>student</sub> ‖ π<sub>expert i</sub>) on its own rollouts. MiMo also adds an outcome reward; GLM-5 uses checkpoints from earlier stages as teachers to recover abilities lost in later RL.",
    who:"MiMo-V2-Flash; DeepSeek-V4 (more than ten teachers); Kimi K3 (nine experts: domain × reasoning effort); GLM-5’s cross-stage variant.",
    pit:"DeepSeek-V4 found that using only the sampled token’s log ratio as the advantage has too much variance, and switched to full-vocabulary logit distillation, which requires dedicated scheduling of teacher inference.",
    f:"min Σ<sub>i</sub> w<sub>i</sub>·KL( π<sub>θ</sub> ‖ π<sub>expert i</sub> ), on student rollouts",
    l:[["MiMo-V2-Flash",X_("2601.02780")],["DeepSeek-V4",X_("2606.19348")],["Kimi K3",X_("2607.24653")],["GLM-5",X_("2602.15763")]]},
  selfd:{n:"Self-distillation",yr:"2026",y:"2026 · OPSD, SDFT, SDPO",on:1,
    p:"No stronger teacher: the model serves as its own teacher when it sees extra information (a reference solution, a demonstration, feedback).",
    h:"Teacher = the same model plus privileged information; student = the model without it. Do per-token distillation on the student’s own samples. The three variants are in the A4 cards.",
    who:"TRL has experimental SDFT and SDPO trainers.",
    pit:"Often ineffective or even harmful for thinking models that already do long reasoning; gains shrink as models get larger.",
    f:"min D( π<sub>θ</sub>(·|x) , π<sub>θ</sub>(·|x, privileged info) )",l:[["OPSD",X_("2601.18734")],["SDFT",X_("2601.19897")],["SDPO",X_("2601.20802")]]},
  opsd:{n:"OPSD",yr:"2026",y:"2026-01 · UCLA, Meta",on:1,
    p:"What if there is no stronger teacher? Let the model, looking at a verified solution, act as its own teacher.",
    h:"One model plays two roles: the teacher sees the verified solution, the student sees only the problem; the divergence is computed per token on the student’s rollouts. Version 3 of the paper switches to forward KL.",
    num:"Qwen3-1.7B goes from 36.7 to 43.9 on AIME25 in 50 steps, using a single 1k-token rollout per problem (the GRPO baseline uses 8 × 16k).",
    pit:"Harmful for thinking models (relative drops of up to 17%); at 8B the gain shrinks from 3.05 points to 0.14.",
    f:"teacher π<sub>θ</sub>(·|x, solution), student π<sub>θ</sub>(·|x)",l:[["OPSD",X_("2601.18734")],["Fails on thinking models",X_("2607.05184")]]},
  sdft:{n:"SDFT",yr:"2026",y:"2026-01 · MIT, ETH (ICML 2026)",on:1,
    p:"SFT on a new task forgets old abilities, which blocks continual learning.",
    h:"The teacher is the model that sees a demonstration, π(·|x, demo); the student is π(·|x). Compute the reverse KL on student samples and update the teacher with an EMA. Equivalent to on-policy RL with reward log π(y|x,demo)/π(y|x).",
    who:"TRL’s experimental SDFT trainer.",num:"About 2.5× the FLOPs and about 4× the wall-clock time of SFT, with much less forgetting.",
    pit:"The student copies phrasing like “based on the above…” that only makes sense in the teacher’s context; relies on strong in-context learning.",
    f:"min KL( π<sub>θ</sub>(·|x) ‖ π<sub>EMA</sub>(·|x, demo) )",l:[["SDFT",X_("2601.19897")]]},
  sdpo:{n:"SDPO",yr:"2026",y:"2026-01 · ETH and others (ICML 2026)",on:1,rm:1,
    p:"RL uses only a scalar reward, wasting rich feedback such as error messages and critiques.",
    h:"The self-teacher is the same model after seeing feedback (a runtime error, a judge’s critique, or a successful sibling rollout); its predictions are distilled back into the feedback-free policy with a logit-level JSD.",
    who:"TRL’s experimental SDPO trainer.",num:"Qwen3-8B reaches 48.8% on LiveCodeBench v6 vs 41.2% for GRPO, and matches GRPO’s final accuracy with a quarter of the generations.",
    pit:"Gains depend heavily on the strength of the base model.",f:"teacher π<sub>θ</sub>(·|x, feedback), student π<sub>θ</sub>(·|x), JSD",l:[["SDPO",X_("2601.20802")]]},
  bon:{n:"Best-of-n and rejection sampling",yr:"2021",y:"WebGPT 2021; RAFT 2023 (HKUST); Llama 2, Llama 3",rm:1,pol:"Iterative: resample each round, then offline SFT",
    p:"Use a reward model without running RL: sample several responses and pick the best.",
    h:"Sample n responses per prompt and pick the highest-scoring one with the reward model: return it directly at inference (best-of-n), or use it for SFT (RAFT, rejection sampling fine-tuning), possibly over several rounds.",
    who:"WebGPT; Llama 2’s rejection sampling fine-tuning; Llama 3 uses rejection sampling plus DPO.",
    num:"The KL of best-of-n relative to the base has a closed form: log n − (n−1)/n, about 1.84 nats at n = 16.",
    pit:"The larger n is, the more it overoptimizes the reward model (Gao et al. 2022).",
    f:"y* = argmax<sub>i≤n</sub> r(x, y<sub>i</sub>), then SFT on y*",l:[["WebGPT",X_("2112.09332")],["RAFT",X_("2304.06767")],["Llama 2",X_("2307.09288")],["Gao et al.",X_("2210.10760")]]},
  star:{n:"STaR",yr:"2022",y:"2022 · Stanford, Google",rm:1,pol:"Iterative: resample each round, then offline SFT",
    p:"There are no labeled rationales, only final answers.",
    h:"Have the model write rationales and keep only those with the correct final answer; for problems it gets wrong, give the answer as a hint and have the model write a rationale for it (rationalization); SFT on this data and repeat.",
    num:"72.5% on CommonsenseQA, vs 73.0% for a fine-tuned model 30× larger.",
    pit:"Problems the model never solves are never learned, which is why rationalization was added.",
    f:"keep { (x, rationale, ŷ) : ŷ = reference answer }, SFT, repeat",l:[["STaR",X_("2203.14465")]]},
  restem:{n:"ReST / ReST-EM",yr:"2023",y:"2023 · Google DeepMind",rm:1,pol:"Iterative: resample each round, then offline SFT",
    p:"Frame rejection sampling as EM; on math and code it beats SFT on human data alone.",
    h:"E-step: sample from the current model and filter by reward. M-step: SFT on the filtered data, retraining from the base model each round rather than continuing from the previous one.",
    pit:"After a few iterations the gains diminish and it starts to overfit.",
    f:"E: y ~ π<sub>t</sub>, keep r(x,y) = 1; M: SFT from the base to get π<sub>t+1</sub>",l:[["ReST",X_("2308.08998")],["ReST-EM",X_("2312.06585")]]},
  rft:{n:"RFT and expert iteration",yr:"2023",y:"RFT 2023 (Yuan et al.); expert iteration 2017 / 2022",rm:1,pol:"Iterative: resample each round, then offline SFT",
    p:"Augment the training data with reasoning paths the model itself got right.",
    h:"Sample many reasoning paths, keep those with correct answers and distinct paths, and SFT on them; expert iteration repeats the loop “search or sample → keep successes → train”.",
    num:"With rejection-sampled data pooled from several models, LLaMA-7B on GSM8K goes from 35.9% (SFT) to 49.3%. In Meta’s 2024 comparison, expert iteration matches or beats PPO in most settings.",
    pit:"Learns only from positive samples, with no negative gradient; the ceiling is limited by exploration.",
    f:"keep { y ~ π : verifier(y) = 1 }, deduplicate, SFT",l:[["RFT",X_("2308.01825")],["Teaching LLMs to Reason with RL (Meta)",X_("2403.04642")]]},
  spin:{n:"SPIN",yr:"2024",y:"2024 · UCLA",ref:1,pol:"Iterative: resample each round, then train offline",
    p:"You have only SFT data but want to keep improving.",
    h:"A DPO-style logistic loss: SFT data as chosen, the previous round’s own outputs as rejected.",
    num:"zephyr-7b’s Open LLM Leaderboard average goes from 58.14 to 63.16.",
    pit:"The optimum is the SFT data distribution itself, so it cannot surpass the SFT data.",
    f:"chosen = human-written response, rejected = response from π<sub>t</sub>",l:[["SPIN",X_("2401.01335")]]},
  btrm:{n:"Bradley-Terry RM",yr:"2022",y:"2022 · OpenAI InstructGPT",tags:["Training data: preference pairs or rankings","Output: one scalar"],
    p:"Human preferences cannot be written as a function, so first learn a scoring model.",
    h:"Labelers rank K = 4–9 responses to the same prompt, which are split into C(K,2) pairs; the model learns only score differences, and absolute values carry no meaning.",
    who:"InstructGPT (6B RM); Llama 2 trains separate helpfulness and safety RMs and adds a margin to the loss.",
    num:"Responses from InstructGPT 1.3B were preferred over 175B GPT-3.",
    pit:"It has only been trained on the reference policy’s distribution. Once RL pushes the policy out of that distribution, the RM extrapolates badly and gets hacked: the true score first rises and then falls with KL (Gao et al.).",
    f:"L = −log σ( r(x,y<sub>w</sub>) − r(x,y<sub>l</sub>) )",l:[["InstructGPT",X_("2203.02155")],["Gao et al.",X_("2210.10760")]]},
  prm:{n:"Process reward model (PRM)",yr:"2023",y:"2023 · OpenAI (Lightman); Math-Shepherd (Peking University, DeepSeek)",tags:["Training data: step-level labels, or rollouts from each step","Output: one score per step"],
    p:"An ORM looks only at the final answer and cannot tell which step went wrong.",
    h:"Score every step of the reasoning. Lightman uses human step-level labels (PRM800K); Math-Shepherd runs N = 8 rollouts from a given step and scores it by the fraction that reach the correct answer, a Monte Carlo estimate of the Q value.",
    who:"Mainly used for reranking and search; DeepSeek-R1 abandoned PRMs for large-scale RL.",
    num:"Best-of-1860 on a MATH subset: PRM 78.2%, ORM 72.4%, majority voting 69.6%.",
    pit:"A “step” is hard to define, labels are noisy, and the PRM gets hacked under large-scale RL.",
    f:"r(x, s<sub>1..k</sub>) ≈ P( reaching the correct answer from step k )",l:[["Let's Verify Step by Step",X_("2305.20050")],["Math-Shepherd",X_("2312.08935")]]},
  genrm:{n:"Generative RM (GenRM / GRM)",yr:"2024",y:"2024 · Google DeepMind; 2025 · DeepSeek-GRM",tags:["Training data: judgments with rationales","Output: a critique first, then a score"],
    p:"A scalar RM cannot reason, and cannot trade more compute for more accurate judgments.",
    h:"Have the model write a CoT critique before judging; the reward is P(“Yes”), and you can sample several times and vote. DeepSeek-GRM writes principles first and then the critique, is trained with online RL (SPCT), and aggregates with a meta-RM.",
    who:"DeepSeek-V3.2 uses a rubric-based GRM; DeepSeek-V4 no longer uses a scalar RM, and the policy model doubles as the GRM; GLM-5 mixes rules, ORMs, and GRMs; Kimi K3 uses an agentic GRM.",
    num:"GenRM raises best-of-N on GSM8K from 73% to 93.4%.",
    pit:"Higher variance than a scalar ORM (GLM-5’s experience); expensive inference; can still be fooled.",
    f:"r = P( “Yes” | x, y, critique ), averaged over several samples",l:[["GenRM",X_("2408.15240")],["DeepSeek-GRM",X_("2504.02495")],["DeepSeek-V3.2",X_("2512.02556")]]},
  rubric:{n:"Rubric reward",yr:"2025",y:"2025 · Scale AI (RaR), RLCF; Kimi K2’s self-critique",tags:["Training data: one rubric per prompt","Output: per-item scores, weighted"],
    p:"Open-ended tasks such as medicine, writing, and agents have no reference answer that a program can verify.",
    h:"Write a rubric for each prompt (what must be mentioned, what must not be done); a judge checks each item, and the scores are summed with weights.",
    who:"Kimi K2, K3; DeepSeek-V3.2, V4.",num:"On HealthBench, RaR gives up to a 31% relative improvement over a Likert-scale judge.",
    pit:"The judge’s preferences can be hacked (CHERRL reproduces this specifically); Kimi K3 marks responses over a length threshold as failures, to stop length from inflating scores.",
    f:"r = Σ<sub>j</sub> w<sub>j</sub> · judge( item j satisfied )",l:[["Rubrics as Rewards",X_("2507.17746")],["RLCF",X_("2507.18624")],["Kimi K2",X_("2507.20534")],["CHERRL",X_("2606.04923")]]},
  cai:{n:"Constitutional AI / RLAIF",yr:"2022",y:"2022 · Anthropic; 2023 · Google",tags:["Training data: a set of principles (constitution)","Labeler: AI"],
    p:"Human preference labeling is expensive and slow, especially for safety.",
    h:"Supervised stage: the model critiques and revises its own outputs according to the principles, then SFT. RL stage: an AI gives preference labels according to the principles, a preference model is trained, then RL; d-RLAIF has the LLM score directly during RL.",
    who:"Claude (Anthropic has published the constitution).",num:"Win rate over SFT: RLAIF 71%, RLHF 73%, not a significant difference (Google 2023).",
    pit:"Safety RLHF done on chat-style prompts did not transfer to agentic tasks (Anthropic 2025).",
    l:[["Constitutional AI",X_("2212.08073")],["RLAIF vs RLHF",X_("2309.00267")],["Anthropic 2025",X_("2511.18397")]]},
  rlvr:{n:"RLVR (verifiable rewards)",yr:"2024",y:"2024 · AI2 Tülu 3; 2025 · DeepSeek-R1",tags:["Training data: problems with reference answers or tests","Output: pass/fail from a program"],
    p:"Learned RMs get hacked; if a task can be checked by a program, do not use an RM.",
    h:"Answer matching, unit tests, execution result comparison: give a reward if it passes (Tülu 3 uses α = 10), otherwise 0.",
    who:"DeepSeek-R1, Tülu 3, Olmo 3, and almost every reasoning model.",
    pit:"The checker itself can be exploited (GLM-5 hit truncation and layout hacks in RL on slide-generation tasks); it covers only verifiable tasks.",
    f:"r = α · 1[ verifier(x, y) passes ]",l:[["Tülu 3",X_("2411.15124")],["DeepSeek-R1",X_("2501.12948")]]}
};
var FAMS=[["Online RL: policy gradient","Sample from the current policy, compute advantages from the reward, update",[["reinforce",0],["rloo",1],["rpp",1],["ppo",0],["vapo",1],["grpo",1],["drgrpo",2],["dapo",2],["gspo",2],["cispo",2]]],
  ["Offline preference optimization","Optimize directly on fixed preference pairs, no sampling",[["dpo",0],["ipo",1],["kto",1],["orpo",1],["simpo",1],["odpo",1],["sppo",1]]],
  ["Rejection sampling and self-training","Sample, keep the good ones, then SFT",[["bon",0],["star",1],["rft",1],["restem",1],["spin",1]]],
  ["Distillation","Learn from a stronger teacher, or from yourself with privileged information",[["sftkd",0],["minillm",1],["gkd",1],["opd",1],["mopd",2],["selfd",2]]]];
var PICKD={
  demos:{t:"SFT, then rejection sampling",w:"With only demonstrations, SFT is the one signal you can use directly. Then let the model sample on its own, keep the good outputs with an answer check or a judge, and SFT again (RFT, STaR, ReST-EM), possibly for a few rounds.",e:"The first step of almost every pipeline; DeepSeek-R1 starts with cold-start SFT on a small amount of long-CoT data.",go:["m6","a4"]},
  pairs:{t:"DPO; with more budget, online DPO, or train an RM and do RL",w:"Feeding preference pairs straight into DPO is the simplest and most stable option, but it is offline and does not explore. For more gains, resample with the current policy and have an RM or judge label the pairs (online DPO), or train a reward model and do RL.",e:"Tülu 3 and Olmo 3 use DPO in their preference stage; Llama 4 finishes with lightweight DPO. In Xu et al. 2024 well-tuned PPO generally beats DPO, while Tülu 3 found the opposite: data and tuning matter more than the algorithm’s name.",go:["a2","m6"]},
  verif:{t:"RLVR: a GRPO backbone plus stability patches",w:"If a program can judge right and wrong, do RL directly, without a learned RM. Common practice in 2026: drop the critic and the KL, use clip-higher, often drop the std, filter all-correct or all-wrong groups, and correct training-inference mismatch. For a higher ceiling, look at CISPO or GSPO.",e:"DeepSeek-R1 and V3.2, Qwen3, GLM-5, Olmo 3; MiniMax-M1 uses CISPO.",go:["a3","m7","m8","i4"]},
  teacher:{t:"Offline distillation first, then on-policy distillation",w:"With a stronger teacher, distillation is an order of magnitude cheaper than RL: first SFT on the teacher’s outputs, then let the student sample while the teacher scores each token (OPD). To surpass the teacher, you still need RL at the end.",e:"Qwen3-8B: OPD reaches 74.4 on AIME24 in 1,800 GPU hours, RL reaches 67.6 in 17,920 GPU hours. Several frontier models in 2026 first train multiple RL experts, then do multi-teacher on-policy distillation (MiMo, DeepSeek-V4, Kimi K3).",go:["a4","m9"]},
  rubric:{t:"A rubric or generative judge as the reward, then RL",w:"Open-ended tasks have no reference answer. Write a rubric for each prompt and have a judge score it item by item; gate safety-related items instead of averaging them in with weights; before deploying, test whether the judge can be fooled.",e:"Kimi K2 and K3 and DeepSeek-V3.2 and V4 use rubrics plus generative RMs; Rubrics as Rewards gives up to a 31% relative gain on HealthBench.",go:["a5","m8"]}};
D.apick=function(host){
  host.innerHTML='<div class="mini">What is the strongest training signal you have?</div><div class="ctl">'+segBtns("pk-m","Training signal",[["demos","Demonstrations only"],["pairs","Preference pairs"],["verif","A program can check answers"],["teacher","A stronger teacher model"],["rubric","Only a rubric or judge"]],"verif")+'</div><div class="lcard pick-out" aria-live="polite"></div>'+
    '<p class="readout">A common shape for frontier open models in 2026: cold-start SFT → per-domain RL on a GRPO backbone to train experts → multi-teacher on-policy distillation into one model → a little preference optimization or RL to finish. Not every lab does this.</p>';
  function show(k){var d=PICKD[k];$(".pick-out",host).innerHTML='<div class="lc-h"><b>'+d.t+'</b></div><dl class="lc-dl"><dt>Why</dt><dd>'+d.w+'</dd><dt>Real examples</dt><dd>'+d.e+'</dd><dt>Go to</dt><dd class="codes">'+codeLinks(d.go)+'</dd></dl>';}
  onSeg($("#pk-m",host),show);show("verif");
};
function needHTML(a){if(a.tags){return '<div class="need">'+a.tags.map(function(t){return '<span class="pol">'+t+'</span>';}).join("")+'</div>';}var N=[["rm","reward or verifier"],["ref","reference model"],["critic","critic"],["teacher","teacher model"]];return '<div class="need"><span class="pol">'+(a.pol||(a.on?"Online: samples from the current policy":"Offline: fixed data"))+'</span>'+N.map(function(x){return '<span class="'+(a[x[0]]?"y":"")+'">'+(a[x[0]]?"Needs a ":"No ")+x[1]+'</span>';}).join("")+'</div>';}
function algoCard(id){var a=ALGO[id];return '<div class="lc-h"><b>'+a.n+'</b><span>'+a.y+'</span></div>'+needHTML(a)+
  '<dl class="lc-dl"><dt>Problem</dt><dd>'+a.p+'</dd><dt>Method</dt><dd>'+a.h+'</dd>'+(a.who?'<dt>Who uses it</dt><dd>'+a.who+'</dd>':'')+(a.num?'<dt>Numbers</dt><dd>'+a.num+'</dd>':'')+'<dt>Pitfalls</dt><dd>'+a.pit+'</dd></dl>'+
  (a.f?'<div class="lc-f">'+a.f+'</div>':'')+(a.l&&a.l.length?'<div class="mini" style="margin:0">Sources: '+a.l.map(function(x){return A(x[0],x[1]);}).join(" · ")+'</div>':'');}
function algoCards(ids){return function(host){
  host.innerHTML='<div class="alg-grid">'+ids.map(function(id){var a=ALGO[id];return '<button type="button" class="alg" data-a="'+id+'" aria-pressed="false"><span>'+a.n+'</span><span class="yr">'+a.yr+'</span></button>';}).join("")+'</div><div class="lcard" aria-live="polite"></div>';
  function show(id){$$(".alg",host).forEach(function(b){var on=b.getAttribute("data-a")===id;b.classList.toggle("on",on);b.setAttribute("aria-pressed",String(on));});$(".lcard",host).innerHTML=algoCard(id);}
  host.addEventListener("click",function(e){var b=e.target.closest(".alg");if(b){show(b.getAttribute("data-a"));}});
  show(ids[0]);
};}
D.cards_pref=algoCards(["dpo","ipo","kto","orpo","simpo","odpo","sppo","ppo"]);
D.cards_pg=algoCards(["ppo","reinforce","rloo","rpp","grpo","drgrpo","dapo","vapo","gspo","cispo","sapo","kimi","mismatch","entropy","async"]);
D.cards_dist=algoCards(["sftkd","opd","mopd","gkd","minillm","opsd","sdft","sdpo","bon","star","rft","restem","spin"]);
D.cards_rm=algoCards(["btrm","prm","genrm","rubric","cai","rlvr"]);
D.atree=function(host){
  var c=clock(),flt="all",sel="grpo",auto=!RM;
  host.innerHTML='<div class="root-box">Shared objective: max E[ r(x,y) ] − β·KL( π ‖ π<sub>ref</sub> ). The algorithms differ in where samples come from, what the signal is, and how many models are loaded.</div>'+
    '<div class="ctl">'+segBtns("at-f","Filter",[["all","All"],["on","Online sampling"],["rm","Needs reward or verifier"],["ref","Needs reference model"],["critic","Needs critic"],["teacher","Needs teacher"]],"all")+'</div>'+
    '<div class="fam-grid">'+FAMS.map(function(f){return '<div class="fam"><h5>'+f[0]+'</h5><div class="fd">'+f[1]+'</div>'+f[2].map(function(x){var a=ALGO[x[0]];return '<button type="button" class="alg lv'+x[1]+'" data-a="'+x[0]+'" aria-pressed="false"><span>'+(x[1]?"↳ ":"")+a.n+'</span><span class="yr">'+a.yr+'</span></button>';}).join("")+'</div>';}).join("")+'</div>'+
    '<div class="lcard" aria-live="polite"></div>';
  function paint(){$$(".alg",host).forEach(function(b){var id=b.getAttribute("data-a"),a=ALGO[id];b.classList.toggle("dim",flt!=="all"&&!a[flt]);b.classList.toggle("on",id===sel);b.setAttribute("aria-pressed",String(id===sel));});$(".lcard",host).innerHTML=algoCard(sel);}
  onSeg($("#at-f",host),function(v){auto=false;flt=v;paint();});
  host.addEventListener("click",function(e){var b=e.target.closest(".alg");if(b){auto=false;sel=b.getAttribute("data-a");paint();}});
  paint();
  if(!RM){var F=["all","on","rm","ref","critic","teacher"],fi=0;c.int(2600,function(){if(!auto){return;}fi=(fi+1)%F.length;flt=F[fi];setPressed($("#at-f",host),"data-v",flt);paint();});}
  return function(){c.clear();};
};

var LOSSK=[["filt","Data filtering"],["adv","Advantage"],["ratio","Importance ratio"],["clip","Clip"],["agg","Aggregation"],["kl","KL term"]];
var LOSS=[
  {id:"grpo",n:"GRPO",ref:1,rw:"reward or verifier",critic:0,chg:[],filt:"None",adv:"Sample G responses per prompt: (R − group mean) / group std",ratio:"Per token: π(oₜ) / π_old(oₜ)",clip:"Symmetric: [1 − ε, 1 + ε]",agg:"Average over length within each response, then over the group",kl:"k3 estimator, added directly to the loss",note:"The reference point. Each variant below marks which rows it changes relative to GRPO."},
  {id:"ppo",n:"PPO (RLHF)",ref:1,rw:"reward model",critic:1,chg:["adv","kl","agg"],filt:"None",adv:"A critic estimates each token’s value; GAE computes the advantage",ratio:"Per token",clip:"Symmetric; the value loss is clipped too",agg:"Per-token average (varies by implementation)",kl:"Per-token KL penalty folded into the reward",note:"Four models in memory at once, and the critic is as large as the policy. GRPO starts by removing the critic."},
  {id:"rloo",n:"RLOO",ref:1,rw:"reward model",critic:0,chg:["adv","ratio","clip","agg","kl"],filt:"None",adv:"Leave-one-out: R_i − mean reward of the other k − 1 responses",ratio:"Not needed in the original: one update per batch, which is plain REINFORCE",clip:"None",agg:"Per response",kl:"KL penalty folded into the reward",note:"Treats the whole response as one action and goes back to REINFORCE. In the paper, REINFORCE-style methods beat PPO’s win rate by 3.2–20.3 percentage points and use much less memory."},
  {id:"rpp",n:"REINFORCE++",ref:1,rw:"reward model",critic:0,chg:["adv","kl","agg"],filt:"None",adv:"Normalized globally over the whole batch, not per group",ratio:"Per token",clip:"PPO-style clip",agg:"Per token",kl:"Per-token KL penalty folded into the reward",note:"Uses the whole batch as the baseline, without per-prompt groups. Five open-source frameworks implement it; no large-model tech report says it uses it yet."},
  {id:"drgrpo",n:"Dr. GRPO",ref:1,rw:"reward or verifier",critic:0,chg:["adv","agg"],filt:"None",adv:"R − group mean, no longer divided by the std",ratio:"Same as GRPO",clip:"Same as GRPO",agg:"Divided by a constant, not by each response’s own length",kl:"Same as GRPO",note:"Removes two biases: length averaging penalizes long wrong answers less, so responses grow longer; dividing by the std favors prompts that are too hard or too easy. Olmo 3 and DeepSeek-V3.2 also drop the std."},
  {id:"dapo",n:"DAPO",ref:0,rw:"verifier",critic:0,chg:["filt","clip","agg","kl"],filt:"Dynamic sampling: drop all-correct or all-wrong groups and resample until the batch is full; soft penalty for overlong responses",adv:"Same as GRPO",ratio:"Same as GRPO",clip:"Clip-higher: lower bound 0.2, upper bound relaxed to 0.28",agg:"Average over all tokens in the batch",kl:"Removed",note:"The four changes target entropy collapse, groups with no gradient, diluted gradients on long responses, and reward noise from truncation. AIME24 50 on Qwen2.5-32B, with half the steps of R1-Zero."},
  {id:"gspo",n:"GSPO",ref:0,rw:"reward or verifier",critic:0,chg:["ratio","clip","agg","kl"],filt:"Same as GRPO",adv:"Same as GRPO",ratio:"Per response: (π(y) / π_old(y))^(1/|y|)",clip:"Clip on the whole response, with a very narrow range (about 3e-4)",agg:"Per response",kl:"Not used",note:"The reward is given to the whole response, so the ratio should be computed on the whole response too. On Qwen3-30B-A3B about 10% of expert routes change with each update, which makes per-token ratios noisy."},
  {id:"cispo",n:"CISPO",ref:0,rw:"verifier",critic:0,chg:["ratio","clip","agg","kl"],filt:"Same as GRPO",adv:"Same as GRPO",ratio:"Per token, but used only as a truncated weight (no gradient through it)",clip:"Clips the weight, not the token: every token keeps a gradient",agg:"Per token",kl:"Removed",note:"PPO-style clipping drops the gradient of low-probability “pivot” tokens (such as However and Wait); CISPO keeps them. About 2× faster than DAPO."}
];
D.aloss=function(host){
  var c=clock(),k=0,auto=!RM;
  host.innerHTML='<div class="eras">'+LOSS.map(function(a,j){return '<button type="button" class="era" data-i="'+j+'" aria-pressed="false"><span class="nm">'+a.n+'</span></button>';}).join("")+'</div>'+
    '<div class="lossf">J(θ) = E<sub><span data-c="filt">q ~ prompt set</span>, {oᵢ} ~ π_old</sub>[ <span data-c="agg">1/G Σᵢ 1/|oᵢ| Σₜ</span> min( <span data-c="ratio">rᵢ,ₜ(θ)</span> · <span data-c="adv">Âᵢ</span> , <span data-c="clip">clip(rᵢ,ₜ, 1−ε, 1+ε)</span> · Âᵢ ) ] − <span data-c="kl">β · KL(π_θ ‖ π_ref)</span></div>'+
    '<div class="anat"></div><div class="mem"></div><p class="readout" aria-live="polite"></p>';
  function show(j){k=j;var a=LOSS[j];
    $$(".era",host).forEach(function(b){b.setAttribute("aria-pressed",String(parseInt(b.getAttribute("data-i"),10)===j));});
    $$(".lossf span",host).forEach(function(s){s.classList.toggle("hl",a.chg.indexOf(s.getAttribute("data-c"))>=0);});
    $(".anat",host).innerHTML=LOSSK.map(function(r){return '<div class="k2">'+r[1]+'</div><div class="v'+(a.chg.indexOf(r[0])>=0?" chg":"")+'">'+a[r[0]]+'</div>';}).join("");
    $(".mem",host).innerHTML='Models to load: <span class="y">policy</span><span class="'+(a.ref?"y":"")+'">reference model</span><span class="y">'+a.rw+'</span><span class="'+(a.critic?"y":"")+'">critic</span>';
    $(".readout",host).textContent=a.note;
    var eb=$('.era[data-i="'+j+'"]',host),bar=$(".eras",host);if(eb&&bar){try{bar.scrollTo({left:eb.offsetLeft-bar.clientWidth/2+eb.clientWidth/2,behavior:"smooth"});}catch(err){}}
  }
  host.addEventListener("click",function(e){var b=e.target.closest(".era");if(b){auto=false;show(parseInt(b.getAttribute("data-i"),10));}});
  show(0);if(!RM){c.int(4000,function(){if(auto){show((k+1)%LOSS.length);}});}
  return function(){c.clear();};
};

/* ---------- boot ---------- */
function setStickyTop(){var g=$("#guide");if(g){g.style.setProperty("--g-mh",mastheadH()+"px");}}
setStickyTop();
renderMeter();
window.addEventListener("hashchange",function(){route();});
var rt=null,lastNarrow=null;
window.addEventListener("resize",function(){
  clearTimeout(rt);
  rt=setTimeout(function(){setStickyTop();var h=$("#map-host");if(!h||$("#view-map").hidden){return;}var nw=(h.clientWidth<640)+"|"+miniNarrow();if(nw!==lastNarrow){lastNarrow=nw;renderMap();}},150);
});
route(true);
var mh=$("#map-host");lastNarrow=mh?(mh.clientWidth<640)+"|"+miniNarrow():null;
})();
