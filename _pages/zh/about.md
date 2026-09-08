---
permalink: /zh/
title: "关于我"
lang: zh
seo_title: "庞雨田 个人主页"
author_profile: true
wallpaper: /images/wallpapers/wall1-bg.webp
---

我是得克萨斯大学奥斯汀分校航空航天工程与工程力学系的博士后研究员，与 John-Paul Clarke 教授一同工作。我的研究方向是**智慧航空**，**涵盖航空运输、空中交通管制、先进空中交通与先进空中作业**。我同时使用**从数据中学习的方法（机器学习与人工智能）以及基于模型的方法（优化与仿真）**。我的工作横跨多个学科，涉及航空航天工程、数据科学与人工智能、计算机工程、交通运输工程、工业工程与运筹学、人因工程，以及地理信息系统。

<img src="/images/overview-web.webp" alt="研究领域概览：航空运输、空中交通管制、先进空中交通与先进空中作业，以数据驱动与模型驱动相结合的混合方法应对；从 NASA 资助的 ASU 博士阶段，经泰雷兹与 UT Austin 博士后，到初创公司产品，交付可落地部署的解决方案。" style="width: 100%; border-radius: 6px;" />

我的研究经历分阶段走过了从模型到数据的整个谱系。在亚利桑那州立大学攻读博士期间，我参与了一个历时五年的 NASA 航空数据科学项目，做的是数据驱动的工作：从概率深度学习，到从海量运行数据中预测空中交通行为的图模型。在得克萨斯大学奥斯汀分校的博士后阶段，我补上了模型驱动的一侧，包括飞行仿真、轨迹优化，以及把两种传统耦合起来的混合方法。在整个过程中，我所给出的方案都以可落地部署为目标，而不是停留在纸面上。

在学术界之外，我也有**产业界的经历**。我曾在泰雷兹集团（Thales Group）位于加州圣何塞的团队全职担任机器学习工程师，在那里积累了面向关键行业的安全与隐私研究背景。我在那里研发的一项嵌入向量保护工具，如今已成为泰雷兹数据安全平台的一部分。此外，在**多家初创公司**（横跨航空航天、自动驾驶与医疗健康）的经历，也印证了我**大胆创新、亲手落地**的能力，在不同行业交付出真实的产品。目前，我担任一个医疗 Agentic AI 初创公司 **[Wyzzy](https://calls.wyzzy.ai/) 的联合创始人兼首席技术官**，其产品已在得克萨斯州达拉斯的牙科诊所投入使用。

_我一直欢迎各种形式的合作，目前也在全球范围内积极寻找研究机会。欢迎通过 **yutian DOT pang AT outlook DOT com** 与我联系，或者通过本页右侧边缘的面板直接给我留言。_

研究方向
======
* **不确定性下的决策与优化** —— *我们应该怎么做？* 当需求、天气和人的行为只能以概率的方式刻画时，如何分配跑道、空域、机队这些稀缺资源，如何设计排序方案与飞行轨迹，从战略规划一直到实时管控。
* **自主化程度不断提高的运行的安全、风险与可靠性** —— *到底有多安全，又能否加以证明？* 量化通信、人因与自主性方面的不确定性如何界定运行的容量与可靠性上限，把数据驱动的学习与基于模型的分析所具备的严谨性和保证结合起来。
* **安全攸关运行中的人机协同** —— *人如何始终掌握主导权？* 理解飞行员与管制员的通信和工作负荷，设计能够补充而非取代人类判断的决策支持。
* **不确定性下的空中交通行为预测** —— *系统接下来会怎样？* 从运行数据中学习航空器、交通流与空域需求的演化规律，并为每一个预测附上经过校准的不确定性，使其能够真正支撑决策。

代表性论文
======
{% include selected-publications.md %}

最新动态
======
* **2026 年 9 月** —— 面向进近管制区进港自动化的三阶段研究计划全部完成，三篇论文均已在 arXiv 公开。[Trajectory-Based Optimization for Air Traffic Control in the Terminal Maneuvering Area](/publication/2026-07-01-trajectory-based-optimization-for-air-traffic-control)（[arXiv](https://arxiv.org/abs/2604.17776)）建立了进港轨迹设计的横向问题模型，把雷达引导转化为可计算的航径延长量与速度剖面，目前正在 *Transportation Research Part C* 审稿。[Optimal TRACON Descent Procedures under Wind Uncertainty and Fuel Savings Factors](/publication/2026-10-01-fuel-optimal-stochastic-optimization-of-delayed-deceleration)（[arXiv](https://arxiv.org/abs/2608.22480)）深入到航空器构型层面，采用与飞行管理系统耦合的机体六自由度仿真，在保证稳定进近的前提下，选取使风场不确定性下期望燃油消耗最小的襟翼放出速度与下滑道截获距离，目前正在 *AIAA Journal of Aircraft* 审稿。[Trajectory-Based Co-Optimization of Arrival Scheduling and Descent Path Design in the Terminal Maneuvering Area](/publication/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling)（[arXiv](https://arxiv.org/abs/2609.03234)）把横向与纵向程序放进同一个排序器中协同优化，从而闭合整个链条，并在亚特兰大进港场景中与现行公布程序进行了对比，目前正在 *Aerospace Science and Technology* 审稿。
* **2026 年 8 月** —— NASA ACERO 山火空中交通管理项目：一篇[消防无人机应对野外火灾的技术综述](/files/firefighting_uav_review.html)，内容涵盖平台与任务、飞行动力学与控制模型，以及火蔓延模型与无人机规划的耦合；另有一篇配套的[消防无人机问题优化建模综述](/files/uav_optimization_formulation.html)，梳理了战略层、战术层与轨迹层的约束、目标函数与可解性。
* **2026 年 6 月** —— [Data-Driven Runway and Taxiway Exits Prediction of Landing Aircraft: A Case Study at Hartsfield-Jackson Atlanta International Airport](/publication/2026-12-01-data-driven-runway-and-taxiway-exits-prediction) 发表于 *Journal of Air Transport Management*。
* **2026 年 5 月** —— [Modeling the Impact of Communication and Human Uncertainties on Runway Capacity in Terminal Airspace](/publication/2026-11-01-modeling-the-impact-of-communication-and-human) 发表于 *Journal of Air Transport Management*。
* **2026 年 3 月** —— [The Reliability of Remotely Piloted Aircraft System Performance under Aeronautical Communication Uncertainties](/publication/2026-10-01-the-reliability-of-remotely-piloted-aircraft-system) 发表于 *Reliability Engineering & System Safety*。
* **2026 年 1 月** —— [From Voice to Safety: Language AI Powered Pilot-ATC Communication Understanding for Airport Surface Movement Collision Risk Assessment](/publication/2026-09-01-from-voice-to-safety-language-ai-powered) 发表于 *Transportation Research Part C: Emerging Technologies*。
* **2025 年 10 月** —— 在亚特兰大举行的 INFORMS 年会上作特邀报告。
* **2025 年 3 月** —— 获 美国航空安全管理局航空安全机器学习与人工智能数据挑战赛第二名。
* **2024 年 7 月** —— 加入得克萨斯大学奥斯汀分校，任博士后研究员。
* **2023 年 5 月** —— 于亚利桑那州立大学获得博士学位，并获 ASU 机械与航空航天工程系杰出研究生科研奖。

访客
======
{% include visitor-map.html %}
