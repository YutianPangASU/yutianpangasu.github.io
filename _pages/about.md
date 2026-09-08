---
permalink: /
title: "About me"
title_zh: "关于我"
seo_title: "Yutian Pang Homepage"
author_profile: true
wallpaper: /images/wallpapers/wall1-bg.webp
redirect_from: 
  - /about/
  - /about.html
---

<!-- Bilingual page: each prose block ships twice, wrapped in .i18n-en / .i18n-zh,
     and the 中文/ENG toggle in the masthead reveals one. Shared material (the
     overview figure, the publication list, the visitor map) sits outside those
     wrappers so it is not duplicated in the DOM. -->

<div class="i18n-en" markdown="1">
I am a postdoctoral research fellow in the Department of Aerospace Engineering & Engineering Mechanics at The University of Texas at Austin, working with Prof. John-Paul Clarke. My research focuses on **smart aviation**, **including air transportation, air traffic control, advanced air mobility, and advanced aerial operations**. I use both **methods that learn from data (machine learning and AI) and methods based on models (optimization and simulations)**. My work cuts across disciplines, spanning aerospace engineering, data science and artificial intelligence, computer engineering, transportation engineering, industrial engineering and operations research, human factors, and geographic information systems.
</div>

<div class="i18n-zh" lang="zh-Hans" markdown="1">
我是得克萨斯大学奥斯汀分校航空航天工程与工程力学系的博士后研究员，与 John-Paul Clarke 教授一同工作。我的研究方向是**智慧航空**，**涵盖航空运输、空中交通管制、先进空中交通与先进空中作业**。我同时使用**从数据中学习的方法（机器学习与人工智能）以及基于模型的方法（优化与仿真）**。我的工作横跨多个学科，涉及航空航天工程、数据科学与人工智能、计算机工程、交通运输工程、工业工程与运筹学、人因工程，以及地理信息系统。
</div>

<img src="/images/overview-web.webp" alt="Overview of my research expertise: air transportation, air traffic control, advanced air mobility, and advanced aerial operations, addressed with complementary data-driven and model-driven methods combined into hybrid methods, and a path from a NASA-sponsored Ph.D. at ASU through Thales and a UT Austin postdoc to startup products, delivering deployment-ready solutions." style="width: 100%; border-radius: 6px;" />

<div class="i18n-en" markdown="1">
My path has crossed the spectrum from models to data in stages. My Ph.D. at Arizona State University, sponsored by a NASA aviation data science project that ran five years, was data-driven work: from probabilistic deep learning to graph models that predict air traffic behavior from operational data at massive scale. My postdoc at UT Austin has added the model-driven side, with flight simulation, trajectory optimization, and hybrid methods that couple the two traditions. Throughout, the solutions are built to be ready for deployment, rather than merely staying on paper.

Alongside academia, I have **industry experience**. I worked full-time at Thales Group as a machine learning engineer in San Jose, California, where I built a background in security and privacy research for critical industries. A solution I developed there, an embedding protection tool, is now part of the Thales data security platform. Moreover, experience at **multiple startups** (across aerospace, autonomous driving, and healthcare) has demonstrated my capacity for **bold innovation and hands on execution**, delivering products across different industries. Currently, I serve as **co-founder and CTO of [Wyzzy](https://calls.wyzzy.ai/)**, an agentic-AI healthcare startup whose product is deployed in dental offices in Dallas, Texas.

_I am always open to collaborations and am actively looking for research opportunities worldwide. Please reach me at **yutian DOT pang AT outlook DOT com**, or send me a direct message through the panel on the right edge of this page._
</div>

<div class="i18n-zh" lang="zh-Hans" markdown="1">
我的研究经历分阶段走过了从模型到数据的整个谱系。在亚利桑那州立大学攻读博士期间，我参与了一个历时五年的 NASA 航空数据科学项目，做的是数据驱动的工作：从概率深度学习，到从海量运行数据中预测空中交通行为的图模型。在得克萨斯大学奥斯汀分校的博士后阶段，我补上了模型驱动的一侧，包括飞行仿真、轨迹优化，以及把两种传统耦合起来的混合方法。在整个过程中，我所给出的方案都以可落地部署为目标，而不是停留在纸面上。

在学术界之外，我也有**产业界的经历**。我曾在泰雷兹集团（Thales Group）位于加州圣何塞的团队全职担任机器学习工程师，在那里积累了面向关键行业的安全与隐私研究背景。我在那里研发的一项嵌入向量保护工具，如今已成为泰雷兹数据安全平台的一部分。此外，在**多家初创公司**（横跨航空航天、自动驾驶与医疗健康）的经历，也印证了我**大胆创新、亲手落地**的能力，在不同行业交付出真实的产品。目前，我担任 agentic AI 医疗健康初创公司 **[Wyzzy](https://calls.wyzzy.ai/) 的联合创始人兼首席技术官**，其产品已在得克萨斯州达拉斯的牙科诊所投入使用。

_我一直欢迎各种形式的合作，目前也在全球范围内积极寻找研究机会。欢迎通过 **yutian DOT pang AT outlook DOT com** 与我联系，或者通过本页右侧边缘的面板直接给我留言。_
</div>

<h1 id="research-areas">{% include t.html en="Research areas" zh="研究方向" %}</h1>

<div class="i18n-en" markdown="1">
* **Decision-making and optimization under uncertainty** — *what should we do?* Allocating scarce resources such as runways, airspace, and vehicle fleets, and designing schedules and trajectories, when demand, weather, and human behavior are only known probabilistically, from strategic planning down to real-time control.
* **Safety, risk, and reliability of increasingly autonomous operations** — *how safe is it, and can we prove it?* Quantifying how communication, human, and autonomy uncertainties bound the capacity and reliability of operations, combining data-driven learning with the rigor and guarantees of model-based analysis.
* **Human–AI teaming in safety-critical operations** — *how do humans stay in command?* Understanding pilot and controller communication and workload, and designing decision support that complements rather than replaces human judgment.
* **Prediction of air traffic behavior under uncertainty** — *what will the system do?* Learning how aircraft, traffic flows, and airspace demand evolve from operational data, with calibrated uncertainty attached to every prediction so it can inform real decisions.
</div>

<div class="i18n-zh" lang="zh-Hans" markdown="1">
* **不确定性下的决策与优化** —— *我们应该怎么做？* 当需求、天气和人的行为只能以概率的方式刻画时，如何分配跑道、空域、机队这些稀缺资源，如何设计排序方案与飞行轨迹，从战略规划一直到实时管控。
* **自主化程度不断提高的运行的安全、风险与可靠性** —— *到底有多安全，又能否加以证明？* 量化通信、人因与自主性方面的不确定性如何界定运行的容量与可靠性上限，把数据驱动的学习与基于模型的分析所具备的严谨性和保证结合起来。
* **安全攸关运行中的人机协同** —— *人如何始终掌握主导权？* 理解飞行员与管制员的通信和工作负荷，设计能够补充而非取代人类判断的决策支持。
* **不确定性下的空中交通行为预测** —— *系统接下来会怎样？* 从运行数据中学习航空器、交通流与空域需求的演化规律，并为每一个预测附上经过校准的不确定性，使其能够真正支撑决策。
</div>

<h1 id="selected-publications">{% include t.html en="Selected publications" zh="代表性论文" %}</h1>

1. **Pang, Y.**\*, Kendall, A., & Clarke, J. (2026). “[Modeling the Impact of Communication and Human Uncertainties on Runway Capacity in Terminal Airspace](/publication/2026-11-01-modeling-the-impact-of-communication-and-human).” *Journal of Air Transport Management*.
2. **Pang, Y.**\*, Kendall, A., & Clarke, J. (2026). “[The Reliability of Remotely Piloted Aircraft System Performance under Aeronautical Communication Uncertainties](/publication/2026-10-01-the-reliability-of-remotely-piloted-aircraft-system).” *Reliability Engineering & System Safety*.
3. **Pang, Y.**\*, Kendall, A. P., Porcayo, A., Barsotti, M., Jain, A., & Clarke, J. (2026). “[From Voice to Safety: Language AI Powered Pilot-ATC Communication Understanding for Airport Surface Movement Collision Risk Assessment](/publication/2026-09-01-from-voice-to-safety-language-ai-powered).” *Transportation Research Part C: Emerging Technologies*, 184, 105540.
4. **Pang, Y.**, Zhao, P., Hu, J., & Liu, Y. (2024). “[Machine Learning-Enhanced Aircraft Landing Scheduling under Uncertainties](/publication/2024-10-01-machine-learning-enhanced-aircraft-landing-scheduling-under).” *Transportation Research Part C: Emerging Technologies*, 158, 104444.
5. **Pang, Y.**, Hu, J., Lieber, C., Cooke, N., & Liu, Y. (2023). “[Air Traffic Controller Cognitive Workload Level Prediction using Conformal Dynamical Graph Learning](/publication/2023-08-01-air-traffic-controller-cognitive-workload-level-prediction).” *Advanced Engineering Informatics*, 57, 102113.
6. **Pang, Y.**, Zhao, X., Hu, J., Yan, H., & Liu, Y. (2022). “[Bayesian Spatio-Temporal Graph Transformer Network (B-STAR) for Multi-Aircraft Trajectory Prediction](/publication/2022-09-01-bayesian-spatio-temporal-graph-transformer-network-b).” *Knowledge-Based Systems*, 249, 108998.
7. **Pang, Y.**, Zhao, X., Yan, H., & Liu, Y. (2021). “[Data-driven trajectory prediction with weather uncertainties: A Bayesian deep learning approach](/publication/2021-12-01-data-driven-trajectory-prediction-with-weather-uncertainties).” *Transportation Research Part C: Emerging Technologies*, 130, 103326.
8. **Pang, Y.**, Cheng, S., Hu, J., & Liu, Y. (2021). “[Evaluating the Robustness of Bayesian Neural Networks Against Different Types of Attacks](/publication/2021-12-01-evaluating-the-robustness-of-bayesian-neural-networks).” *CVPR 2021 Workshop on Adversarial Machine Learning in Real-World Computer Vision Systems*.

<h1 id="news">{% include t.html en="News" zh="最新动态" %}</h1>

<div class="i18n-en" markdown="1">
* **Sep 2026** — The three stage program toward TRACON arrival automation is complete, with all three manuscripts now on arXiv. [Trajectory-Based Optimization for Air Traffic Control in the Terminal Maneuvering Area](/publication/2026-07-01-trajectory-based-optimization-for-air-traffic-control) ([arXiv](https://arxiv.org/abs/2604.17776)) sets up the lateral formulation of arrival trajectory design, turning radar vectoring into computable path extensions and speed profiles, and is under review at *Transportation Research Part C*. [Optimal TRACON Descent Procedures under Wind Uncertainty and Fuel Savings Factors](/publication/2026-10-01-fuel-optimal-stochastic-optimization-of-delayed-deceleration) ([arXiv](https://arxiv.org/abs/2608.22480)) goes down to the aircraft configuration level, with six degree of freedom simulations of the airframe coupled to its flight management system, and selects the flap deployment speeds and glideslope capture distance that minimize expected fuel under wind uncertainty subject to a stabilized approach guarantee; it is under review at the *AIAA Journal of Aircraft*. [Trajectory-Based Co-Optimization of Arrival Scheduling and Descent Path Design in the Terminal Maneuvering Area](/publication/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling) ([arXiv](https://arxiv.org/abs/2609.03234)) closes the loop by co-optimizing the lateral and vertical procedures in a single scheduler, evaluated on Atlanta arrival scenarios against current published procedures; it is under review at *Aerospace Science and Technology*.
* **Aug 2026** — NASA ACERO wildfire air traffic management: a [technical review of firefighting UAVs for wildland fire](/files/firefighting_uav_review.html) — platforms and missions, flight dynamics and control models, and the coupling of fire-propagation models to UAV planning — and a companion [review of optimization formulations for the firefighting-UAV problem](/files/uav_optimization_formulation.html) — constraints, cost functions, and tractability across the strategic, tactical, and trajectory layers.
* **Jun 2026** — [Data-Driven Runway and Taxiway Exits Prediction of Landing Aircraft: A Case Study at Hartsfield-Jackson Atlanta International Airport](/publication/2026-12-01-data-driven-runway-and-taxiway-exits-prediction) published in the *Journal of Air Transport Management*.
* **May 2026** — [Modeling the Impact of Communication and Human Uncertainties on Runway Capacity in Terminal Airspace](/publication/2026-11-01-modeling-the-impact-of-communication-and-human) published in the *Journal of Air Transport Management*.
* **Mar 2026** — [The Reliability of Remotely Piloted Aircraft System Performance under Aeronautical Communication Uncertainties](/publication/2026-10-01-the-reliability-of-remotely-piloted-aircraft-system) published in *Reliability Engineering & System Safety*.
* **Jan 2026** — [From Voice to Safety: Language AI Powered Pilot-ATC Communication Understanding for Airport Surface Movement Collision Risk Assessment](/publication/2026-09-01-from-voice-to-safety-language-ai-powered) published in *Transportation Research Part C: Emerging Technologies*.
* **Oct 2025** — Invited talk at the INFORMS Annual Meeting, Atlanta.
* **Mar 2025** — 2nd place in the FAA Machine Learning / AI Data Challenge for Aviation Safety.
* **Jul 2024** — Joined UT Austin as a postdoctoral research fellow.
* **May 2023** — Ph.D. from Arizona State University; Outstanding Graduate Research Award, ASU MAE.
</div>

<div class="i18n-zh" lang="zh-Hans" markdown="1">
* **2026 年 9 月** —— 面向进近管制区进港自动化的三阶段研究计划全部完成，三篇论文均已在 arXiv 公开。[Trajectory-Based Optimization for Air Traffic Control in the Terminal Maneuvering Area](/publication/2026-07-01-trajectory-based-optimization-for-air-traffic-control)（[arXiv](https://arxiv.org/abs/2604.17776)）建立了进港轨迹设计的横向问题模型，把雷达引导转化为可计算的航径延长量与速度剖面，目前正在 *Transportation Research Part C* 审稿。[Optimal TRACON Descent Procedures under Wind Uncertainty and Fuel Savings Factors](/publication/2026-10-01-fuel-optimal-stochastic-optimization-of-delayed-deceleration)（[arXiv](https://arxiv.org/abs/2608.22480)）深入到航空器构型层面，采用与飞行管理系统耦合的机体六自由度仿真，在保证稳定进近的前提下，选取使风场不确定性下期望燃油消耗最小的襟翼放出速度与下滑道截获距离，目前正在 *AIAA Journal of Aircraft* 审稿。[Trajectory-Based Co-Optimization of Arrival Scheduling and Descent Path Design in the Terminal Maneuvering Area](/publication/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling)（[arXiv](https://arxiv.org/abs/2609.03234)）把横向与纵向程序放进同一个排序器中协同优化，从而闭合整个链条，并在亚特兰大进港场景中与现行公布程序进行了对比，目前正在 *Aerospace Science and Technology* 审稿。
* **2026 年 8 月** —— NASA ACERO 野火空中交通管理项目：一篇[消防无人机应对野外火灾的技术综述](/files/firefighting_uav_review.html)，内容涵盖平台与任务、飞行动力学与控制模型，以及火蔓延模型与无人机规划的耦合；另有一篇配套的[消防无人机问题优化建模综述](/files/uav_optimization_formulation.html)，梳理了战略层、战术层与轨迹层的约束、目标函数与可解性。
* **2026 年 6 月** —— [Data-Driven Runway and Taxiway Exits Prediction of Landing Aircraft: A Case Study at Hartsfield-Jackson Atlanta International Airport](/publication/2026-12-01-data-driven-runway-and-taxiway-exits-prediction) 发表于 *Journal of Air Transport Management*。
* **2026 年 5 月** —— [Modeling the Impact of Communication and Human Uncertainties on Runway Capacity in Terminal Airspace](/publication/2026-11-01-modeling-the-impact-of-communication-and-human) 发表于 *Journal of Air Transport Management*。
* **2026 年 3 月** —— [The Reliability of Remotely Piloted Aircraft System Performance under Aeronautical Communication Uncertainties](/publication/2026-10-01-the-reliability-of-remotely-piloted-aircraft-system) 发表于 *Reliability Engineering & System Safety*。
* **2026 年 1 月** —— [From Voice to Safety: Language AI Powered Pilot-ATC Communication Understanding for Airport Surface Movement Collision Risk Assessment](/publication/2026-09-01-from-voice-to-safety-language-ai-powered) 发表于 *Transportation Research Part C: Emerging Technologies*。
* **2025 年 10 月** —— 在亚特兰大举行的 INFORMS 年会上作特邀报告。
* **2025 年 3 月** —— 获 FAA 航空安全机器学习与人工智能数据挑战赛第二名。
* **2024 年 7 月** —— 加入得克萨斯大学奥斯汀分校，任博士后研究员。
* **2023 年 5 月** —— 于亚利桑那州立大学获得博士学位，并获 ASU 机械与航空航天工程系杰出研究生科研奖。
</div>

<h1 id="visitors">{% include t.html en="Visitors" zh="访客" %}</h1>

{% include visitor-map.html %}
