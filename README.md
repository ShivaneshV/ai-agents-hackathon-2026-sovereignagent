# 🧠 SovereignAgent: Cortex

### An Autonomous MLOps & Tokenized Red-Teaming Swarm for Financial Compliance

Built for the **AI Agents Hackathon 2026** — Targeting the **Adaptive Data ($2,000 Prize Pool)** and **Sharp Economy (35,000 Sharp Tokens)** Tracks.

---

## ⚠️ The Enterprise AI Problem
As FinTechs, banking institutions, and insurance providers in India expand into regional markets, they increasingly leverage LLMs to process compliance rules, KYC documents, and legal terms in low-resource regional languages (Hindi, Tamil, Marathi, etc.).

However, LLM hallucinations and semantic drift pose severe regulatory liabilities. If an automated translator misinterprets "liquidate assets" as "burn down the bank" or "escrow" as "permanently freeze," the organization faces immediate compliance failure and financial penalties. Manual evaluation is unscalable, and bilingual domain experts have no economic incentives to verify and correct AI data.

## 💡 The Solution: Cortex
SovereignAgent Cortex is a self-healing, multi-agent evaluation pipeline orchestrated dynamically that stress-tests enterprise translation models, flags hallucinations, and uses a decentralized token economy to crowdsource human corrections.

### 🧠 The Multi-Agent Swarm Architecture
Cortex operates as a swarm of 4 distinct, cooperative agents:

```
                  ┌───────────────────────────────┐
                  │       Generator Agent         │  <-- Translates English Rules
                  └───────────────┬───────────────┘  
                                  │ (Raw Translation)
                                  ▼
                  ┌───────────────────────────────┐
                  │    Adaption Auditor Agent     │  <-- Computes Semantic Fidelity Score
                  └───────────────┬───────────────┘
                                  │ (Audit & Quality Evaluation)
                                  ▼
                  ┌───────────────────────────────┐
                  │    Supervisor Agent           │  <-- Checks threshold (>= 90%)
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │ (Score >= 90%)                                  │ (Score < 90%)
         ▼                                                 ▼
┌──────────────────┐                            ┌─────────────────────┐
│ Hugging Face     │                            │ Settlement Agent    │ <-- Escrows SHARP
│ Model-Ready Data │                            └──────────┬──────────┘
└──────────────────┘                                       │ (Create Micro-Task)
                                                           ▼
                                                ┌─────────────────────┐
                                                │ B2B Bounty Board    │ <-- Human Auditor Stakes
                                                └──────────┬──────────┘
                                                           │ (Expert Corrects Translation)
                                                           ▼
                                                ┌─────────────────────┐
                                                │ Adaption Data Feed  │ <-- Back to pipeline
                                                └─────────────────────┘
```

1. **Generator Agent**: Simulates the company's internal translator, processing English compliance guidelines into Indian regional languages.
2. **Adaption Auditor Agent**: Uses Adaption's evaluation suite to score the translation's factual drift, legal accuracy, and hallucination index.
3. **Supervisor Agent (The Brain)**: Runs decision routing.
   - If evaluation score is **>= 90%**, it is labeled "Passed" and pushed to our Hugging Face data repository for model fine-tuning.
   - If evaluation score is **< 90%**, it is flagged as a compliance hallucination and routed to the Settlement Agent.
4. **Sharp Token Settlement Agent**: Escrows 15 SHARP tokens and creates a public verification task. Certified human auditors (e.g. Chartered Accountants, legal translators) stake 5 SHARP tokens to verify and correct the translation. Upon correct input submission, their stake is returned along with a 15 SHARP token yield.

---

## 🛠️ Project Structure
```
├── package.json                    # Dev server & API scripts
├── swarm_orchestrator.js           # Swarm Simulation & Express API Server
├── financial_compliance_dataset.csv # Phase 1 Synthetic dataset with engineered hallucinations
├── index.html                      # Premium B2B Swarm Dashboard HTML
├── style.css                       # Custom Web3-themed Glassmorphism styles
└── main.js                         # Staking & Live Polling Dashboard Logic
```

---

## 🚀 Quickstart

### Prerequisites
- Node.js installed on your machine.

### Setup Instructions
1. Clone the repository and navigate to the project directory:
   ```bash
   cd ai-agents-hackathon-2026-sovereignagent
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
1. **Start the Swarm Orchestrator (Terminal 1)**:
   ```bash
   npm run swarm
   ```
   *This starts the API server on port 3000 and begins processing the initial CSV batch. You will see detailed logs in your terminal illustrating the multi-agent communications.*

2. **Start the Vite Frontend Dashboard (Terminal 2)**:
   ```bash
   npm run dev
   ```
   *This will launch the Vite development server. Open the local address (typically `http://localhost:5173`) in your browser to view the interactive dashboard.*

---

## 🏆 Sponsors & Track Integration

### 1. Adaption Track (Evaluation & Dataset Enrichment)
- **Fidelity Evaluation**: We utilized the **Adaption Evaluation Suite** to evaluate translated legal and financial compliance guidelines into low-resource regional languages (Hindi, Tamil, Marathi, Telugu, Bengali, Arabic, etc.).
- **Factual & Semantic Drift Filtering**: Adaption was used to score raw translations. Guidelines scoring `< 90%` fidelity (e.g. indicating severe hallucinations) were flagged and filtered.
- **Dataset Transformation & Expansion**: Flagged guidelines were routed to our tokenized crowd-audit pool. Staked human bilingual experts corrected the hallucinations, transforming and enriching the raw translations into ground-truth alignment.
- **Model-Ready Export**: The resulting high-fidelity dataset is exported as `ShivaneshV/Sovereign-FinComply-Eval` in CSV/Parquet format, ready for low-resource model fine-tuning.

### 2. Sharp Economy Track
- **Staking Mechanism**: Expert validators stake 5 SHARP tokens to ensure ground-truth translation quality.
- **Yield Economy**: Successful validation releases the escrowed 15 SHARP tokens to the validator's wallet.
- **Web3 Wallet Panel**: A simulated Web3 wallet connection tracking yields and staked balances.
