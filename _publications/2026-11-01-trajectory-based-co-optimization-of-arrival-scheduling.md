---
title: "Trajectory-Based Co-Optimization of Arrival Scheduling and Descent Path Design in the Terminal Maneuvering Area"
collection: publications
category: underreview
area: tracon
representative: true
permalink: /publication/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling
excerpt: "Jointly optimizes arrival sequencing and descent-path geometry in the terminal maneuvering area from recorded trajectory data."
date: 2026-11-01
venue: "Under review at Aerospace Science and Technology"
arxiv: "https://arxiv.org/abs/2608.22480"
authors: "<b>Pang, Y.</b>* & Clarke, J."
citation: "<b>Pang, Y.</b>* & Clarke, J. (2026). “Trajectory-Based Co-Optimization of Arrival Scheduling and Descent Path Design in the Terminal Maneuvering Area.” <i>Aerospace Science and Technology</i>."
bibtex: |
  @unpublished{pang2026trajectoryb,
    title = {Trajectory-Based Co-Optimization of Arrival Scheduling and Descent Path Design in the Terminal Maneuvering Area},
    author = {Pang, Y. and Clarke, J.},
    note = {Under review at Aerospace Science and Technology},
    year = {2026}
  }
header:
  teaser: publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling.png
figure_caption: "Runway 8L arrivals at Atlanta in east flow, rendered as a terminal radar display. Left: current operations, where the six published arrival flows merge onto the final approach course under radar vectoring. Right: the proposed 4D trajectory-based arrival manager, where each arrival receives at its metering gate a committed lateral path, descent design, and scheduled time at the final approach fix, with the committed vertical profile of one aircraft inset."
---

Jointly optimizes arrival sequencing and descent-path geometry in the terminal maneuvering area from recorded trajectory data.

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling.gif" alt="Animated co-optimized arrival run in the terminal area" loading="lazy">
  <figcaption>Animated co-optimized arrival run in the terminal area: lateral tracks with the synchronized vertical profile of the delayed deceleration approach.</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-menu.png" alt="Stabilized design menus of descent time versus fuel" loading="lazy">
  <figcaption>Stabilized design menus at the zero-wind node: descent time to the final approach fix versus fuel to the threshold for every lattice design. Stars mark the fuel-optimal designs, the cross marks the CDA Baseline, and the joint commitment trades along these clouds when absorbing separation delay.</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-profiles.png" alt="Descent profiles of the fuel-optimal CDA and DDA designs" loading="lazy">
  <figcaption>Descent profiles at the zero-wind node for a B737-800 (left) and an A340-300 (right): altitude, CAS, flap setting, and cumulative fuel for the fuel-optimal CDA and the fuel-optimal DDA. The DDA stays clean at the 240 kt hold CAS deepest into the arrival and deploys the landing flap on the final segment.</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-wind-fuel.png" alt="Descent fuel versus along-track wind for each airframe" loading="lazy">
  <figcaption>Descent fuel of the wind-aware plan versus the along-track wind at 10,000 ft for each airframe, comparing the baseline trigger schedule with the fuel-optimal stabilized CDA and DDA designs. Crosses mark the wind nodes at which the fuel-optimal design changes.</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-paths.png" alt="Committed lateral paths under the CDA Baseline and the co-optimized DDA" loading="lazy">
  <figcaption>Committed lateral paths for one scenario with 27 aircraft arriving from the four corner fixes, under the CDA Baseline (left) and the co-optimized DDA (right). Each path is colored by its committed base-leg extension, and the dotted circle marks the 30 nmi TRACON boundary.</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-timeline.png" alt="FAF landing timeline for a congested scenario" loading="lazy">
  <figcaption>FAF landing timeline for a congested 60 aircraft per hour scenario, comparing the Baseline continuous descent (top) with the co-optimized delayed deceleration (bottom). The Baseline saturates its delay authority late in the arrival push and lands four aircraft with separation shortfalls totaling 392 s, whereas the co-optimized schedule absorbs the same demand with a single 20 s shortfall while burning 22% less fleet fuel.</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-savings.png" alt="Fleet fuel saving versus arrival rate" loading="lazy">
  <figcaption>Average fleet fuel saving relative to the CDA Baseline, paired per scenario, versus aircraft gate arrival rate for the CDA family (left) and the DDA family (right) under the FEFS, FOFFS, and FOFFS-CPS scheduling policies.</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-noise.png" alt="Cumulative noise footprints of the co-optimized CDA and DDA" loading="lazy">
  <figcaption>Cumulative maximum noise footprint of the congested scenario: the co-optimized CDA (left) and the co-optimized DDA (center) on a shared color scale with the 55 and 65 dBA contours outlined, and the difference between the two over the exposed area (right).</figcaption>
</figure>

<figure class="publication__figure">
  <img src="/images/publications/2026-11-01-trajectory-based-co-optimization-of-arrival-scheduling-case2-paths.png" alt="Committed paths on the six published Runway 8L arrival flows" loading="lazy">
  <figcaption>The six published Runway 8L arrival flows with the committed paths of one 27 aircraft scenario: current practice (left) against the co-optimized delayed deceleration (right). The two schedules spend almost the same total extension, yet the co-optimized fleet burns 20.8% less fuel.</figcaption>
</figure>

\* Corresponding author.

**Representative publication** of this research line.
