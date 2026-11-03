export interface SampleMaterial {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  content: string;
}

export const SAMPLE_MATERIALS: SampleMaterial[] = [
  {
    id: 'bio-atp',
    title: 'Mitochondrial Bioenergetics & Chemiosmosis',
    subject: 'Cellular Biology',
    difficulty: 'medium',
    description: 'Electron transport chain, proton motive force, and rotary ATP synthase mechanics.',
    content: `Cellular Respiration and Oxidative Phosphorylation:
The mitochondrion is known as the powerhouse of the eukaryotic cell because it produces the vast majority of adenosine triphosphate (ATP) through oxidative phosphorylation. The process occurs across the inner mitochondrial membrane (IMM), which is folded into cristae to dramatically increase surface area.

1. The Electron Transport Chain (ETC):
Electrons harvested from glycolysis and the citric acid cycle are carried by high-energy electron shuttles, NADH and FADH2. NADH delivers its electron pair to Complex I (NADH dehydrogenase), while FADH2 donates to Complex II (succinate dehydrogenase). As electrons flow exergonically through Complexes I, III (cytochrome bc1), and IV (cytochrome c oxidase) to molecular oxygen (the terminal electron acceptor, forming water), energy is released. This free energy is harnessed to pump protons (H+) from the mitochondrial matrix into the intermembrane space (IMS). 

2. Proton Motive Force (PMF):
The asymmetric pumping of protons establishes both an electrical gradient (membrane potential, Δψ, with positive outside and negative inside) and a chemical concentration gradient (ΔpH, lower pH in the IMS). Together, these form the electrochemical proton motive force. Because the inner mitochondrial membrane is strictly impermeable to charged protons, they cannot spontaneously diffuse back into the matrix.

3. Peter Mitchell's Chemiosmotic Hypothesis and ATP Synthase (Complex V):
ATP synthase is a nanomachine composed of two primary functional domains: the hydrophobic F0 domain embedded in the inner membrane and the hydrophilic F1 catalytic head in the matrix. Protons travel down their electrochemical gradient back into the matrix solely through the F0 channel. This passage drives the physical rotation of the c-ring and central gamma stalk. As the asymmetrical gamma stalk spins inside the stationary alpha3-beta3 catalytic hexamer of F1, it induces cyclical conformational changes in the beta subunits (Open, Loose, Tight states). In the Tight conformation, ADP and inorganic phosphate (Pi) are compressed together to synthesize ATP. In the Open conformation, freshly synthesized ATP is released into the mitochondrial matrix.

4. Uncoupling and Inhibitors:
Chemical uncouplers like 2,4-dinitrophenol (DNP) or physiological uncoupling protein 1 (UCP1 / thermogenin in brown adipose tissue) dissipate the proton gradient by shuttling H+ directly across the membrane, generating heat instead of ATP. In contrast, cyanide and carbon monoxide directly block Complex IV, halting the entire respiratory chain and oxygen consumption. Oligomycin selectively inhibits the F0 proton channel, preventing ATP synthesis.`,
  },
  {
    id: 'cs-deadlocks',
    title: 'Operating Systems: Deadlocks & Banker\'s Algorithm',
    subject: 'Computer Science',
    difficulty: 'hard',
    description: 'The Coffman conditions, resource allocation graphs, and Dijkstra\'s Banker\'s Algorithm.',
    content: `Operating Systems Principles: Deadlock Handling and Prevention

In a multiprogramming system, multiple concurrent processes compete for a finite set of shared hardware and software resources (such as CPU cycles, memory frames, mutex locks, and I/O devices). A deadlock is a state in which every process in a set is waiting for an event (typically the acquisition of a resource) that can only be caused by another process in the same set.

The Four Coffman Conditions:
A deadlock can arise if and only if all four of the following conditions hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode; only one process can use the resource at any given time.
2. Hold and Wait: A process must currently be holding at least one resource and simultaneously requesting additional resources currently allocated to other processes.
3. No Preemption: Resources cannot be forcibly taken away from a process; they can only be released voluntarily by the holding process after it finishes its task.
4. Circular Wait: A closed chain of processes {P0, P1, ..., Pn} exists such that P0 is waiting for a resource held by P1, P1 is waiting for a resource held by P2, and Pn is waiting for a resource held by P0.

Deadlock Handling Strategies:
Systems generally handle deadlocks through four methods:
- Ignorance (The Ostrich Algorithm): Pretend deadlocks never occur; used in general-purpose OSs when deadlocks are rare.
- Prevention: Structurally invalidate at least one of the four Coffman conditions (e.g., impose strict global resource ordering to prevent Circular Wait).
- Detection and Recovery: Allow deadlocks to occur, periodically check resource allocation graphs for cycles, and recover via process termination or resource preemption with rollback.
- Avoidance: Dynamically examine resource allocation requests to ensure that the system never enters an 'unsafe' state.

The Banker's Algorithm (Edsger Dijkstra):
The Banker's Algorithm is a classic deadlock-avoidance algorithm for systems with multiple instances of each resource type. It uses the following data structures:
- Available[m]: Vector of size m indicating the number of available instances of each resource.
- Max[n][m]: Matrix defining the maximum resource demand of each of the n processes.
- Allocation[n][m]: Matrix defining the amount of each resource currently allocated to each process.
- Need[n][m]: Matrix calculated as Need[i][j] = Max[i][j] - Allocation[i][j], representing remaining resources process Pi may request.

Safety Algorithm:
The system tests whether granting a request keeps the system in a 'Safe State'. A safe state is one where there exists a 'Safe Sequence' <P0, P1, ..., Pn-1> such that for each process Pi, the resources that Pi can still request (Need[i]) can be satisfied by the currently available resources plus the resources already held by all preceding processes Pj (where j < i). If no such safe sequence exists, the state is unsafe, and the resource request is delayed even if the requested resources are technically free.`,
  },
  {
    id: 'econ-inflation',
    title: 'Macroeconomics: Inflationary Dynamics & Monetary Policy',
    subject: 'Economics',
    difficulty: 'medium',
    description: 'Demand-pull vs cost-push inflation, headline CPI vs Core PCE, and central bank interest rate mechanisms.',
    content: `Macroeconomic Foundations: Inflation Dynamics and Central Banking

Inflation represents a persistent, general increase in the overall price level of goods and services across an economy over time, which reduces the purchasing power of the domestic currency.

1. Types and Drivers of Inflation:
Economists classify inflationary pressures primarily into two categories:
- Demand-Pull Inflation: Occurs when aggregate demand (AD = C + I + G + (X - M)) expands faster than an economy's aggregate supply capacity ('too much money chasing too few goods'). This frequently happens during economic booms, fiscal stimulus, or rapid credit expansion.
- Cost-Push Inflation: Triggered by abrupt supply-side shocks that escalate unit production costs, such as oil price spikes, geopolitical disruptions, or supply chain bottlenecks. This shifts the short-run aggregate supply (SRAS) curve to the left, resulting in higher prices alongside stagnating output—a dangerous phenomenon termed 'stagflation'.

2. Measurement Metrics:
- Consumer Price Index (CPI): Measures the average price change over time of a fixed market basket of goods and services purchased by typical urban consumers. CPI includes volatile categories like food and energy prices (Headline CPI).
- Personal Consumption Expenditures (PCE) Price Index: The Federal Reserve's preferred gauge. The Core PCE index strips out volatile food and energy components to capture underlying, persistent structural inflation trends. Unlike CPI, the PCE uses a chained index that accounts for consumer substitution behavior when prices shift.

3. Central Bank Policy Response:
Central banks (e.g., the Federal Reserve, ECB) maintain price stability, typically aiming for an average 2% annual inflation benchmark.
When inflation exceeds target, the central bank enacts contractionary monetary policy:
- Raising the Policy Rate (e.g., Federal Funds Rate): Increases borrowing costs for commercial banks, driving up interest rates on mortgages, auto loans, and corporate credit.
- Dampening Demand: Higher borrowing costs encourage saving, discourage capital expenditures by firms, and cool consumer spending, gradually easing demand-pull pressures.
- Quantitative Tightening (QT): The central bank sells government securities or lets them mature without reinvestment, absorbing excess liquidity from the financial system.

4. The Wage-Price Spiral and Inflation Expectations:
If workers and businesses expect high inflation to persist, workers demand higher nominal wages, and businesses raise prices to protect margins. This psychological feedback loop un-anchors inflation expectations, forcing central banks to maintain restrictive monetary stances for longer even at the cost of rising unemployment.`,
  },
  {
    id: 'law-checks',
    title: 'Constitutional Law: Separation of Powers & Checks',
    subject: 'Political Science & Law',
    difficulty: 'easy',
    description: 'Tripartite governance, institutional checks, and judicial review under Marbury v. Madison.',
    content: `Constitutional Framework: Separation of Powers and Checks and Balances

The United States Constitution establishes a tripartite government designed by the Framers (heavily influenced by Montesquieu's 'Spirit of the Laws') to prevent tyranny and the concentration of unchecked power.

1. The Three Distinct Branches:
- Article I - The Legislative Branch (Congress: Senate and House of Representatives): Vested with the authority to enact federal statutes, levy taxes, coin money, regulate interstate and foreign commerce, and declare war.
- Article II - The Executive Branch (President and Administrative Agencies): Vested with executive power to enforce and administer laws enacted by Congress, command the armed forces, negotiate treaties, and appoint federal officers.
- Article III - The Judicial Branch (Supreme Court and Inferior Federal Courts): Vested with judicial power to resolve 'Cases and Controversies' arising under the Constitution, federal statutes, and treaties.

2. The System of Checks and Balances:
Rather than creating completely hermetic silos, the Constitution deliberately gives each branch specific constitutional tools to oversee, influence, and restrain the actions of the other two branches:
- Executive Checks on the Legislature: The President may veto legislation passed by Congress.
- Legislative Checks on the Executive: Congress can override a presidential veto with a two-thirds supermajority in both chambers. The Senate possesses the sole power of 'Advice and Consent' to confirm presidential appointments (judges, cabinet secretaries) and ratify treaties. Congress holds the 'power of the purse' (must authorize appropriations) and has impeachment power.
- Judicial Review (Check on both Legislature and Executive): Established definitively in the landmark ruling Marbury v. Madison (1803), the Supreme Court holds the power to declare acts of Congress or executive actions unconstitutional if they violate supreme law.
- Legislative and Executive Checks on the Judiciary: The President nominates federal judges, who must be confirmed by the Senate. Congress sets the jurisdiction and size of federal courts and holds the authority to amend statutes or initiate constitutional amendments.

3. Core Principle:
The primary rationale of this structural friction is not rapid administrative efficiency, but the preservation of liberty and accountability by ensuring that no single individual or governing faction can wield unrestrained power.`,
  },
];
