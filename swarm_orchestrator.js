const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const DB_FILE = 'db.json';

let db = { bounties: [], logs: [], stats: { total: 0, passed: 0, failed: 0, tokensEscrowed: 0 } };

const c = { cyan: '\x1b[36m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', magenta: '\x1b[35m', reset: '\x1b[0m' };

const templateRules = [
    {
        english: "The borrower must maintain a minimum collateral ratio of 150%.",
        lang: "Spanish",
        passed: "El prestatario debe mantener un índice de colateral mínimo del 150%.",
        failed: "El prestatario debe mantener un índice de colateral de una taza de té.",
        hallucination: "Translated 'collateral ratio' as 'cup of tea'"
    },
    {
        english: "Failure to report foreign assets will result in penalties.",
        lang: "French",
        passed: "Le défaut de déclaration des actifs étrangers entraînera des pénalités.",
        failed: "Le défaut de déclaration des actifs étrangers entraînera des cadeaux.",
        hallucination: "Translated 'penalties' as 'gifts / rewards'"
    },
    {
        english: "In case of default, the lender reserves the right to liquidate assets.",
        lang: "Spanish",
        passed: "En caso de incumplimiento, el prestamista se reserva el derecho de liquidar los activos.",
        failed: "En caso de incumplimiento, el prestamista quemará el banco.",
        hallucination: "Translated 'liquidate assets' as 'burn down the bank'"
    },
    {
        english: "Accounts with suspicious activity will be suspended immediately.",
        lang: "French",
        passed: "Les comptes présentant une activité suspecte seront immédiatement suspendus.",
        failed: "Les comptes suspects recevront des croissants gratuits.",
        hallucination: "Translated 'suspended immediately' as 'free croissants'"
    },
    {
        english: "Tax reports must be submitted annually to the regulatory authority.",
        lang: "German",
        passed: "Steuerberichte müssen jährlich der Regulierungsbehörde vorgelegt werden.",
        failed: "Steuerberichte müssen im Mülleimer entsorgt werden.",
        hallucination: "Translated 'regulatory authority' as 'garbage bin'"
    },
    {
        english: "Staking pools must distribute reward yields every Sunday.",
        lang: "Portuguese",
        passed: "As pools de staking devem distribuir rendimentos de recompensa todos os domingos.",
        failed: "As pools de staking devem explodir todos os domingos.",
        hallucination: "Translated 'distribute reward yields' as 'explode / self-destruct'"
    },
    {
        english: "DeFi liquidity protocols require complete risk disclosure documentation.",
        lang: "Italian",
        passed: "I protocolli di liquidità DeFi richiedono una documentazione completa di informativa sul rischio.",
        failed: "I protocolli di liquidità DeFi richiedono una pizza margherita per operare.",
        hallucination: "Translated 'risk disclosure documentation' as 'pizza margherita'"
    },
    {
        english: "Patient medical records must be encrypted at rest and in transit as per HIPAA rules.",
        lang: "Spanish",
        passed: "Los registros médicos del paciente deben estar encriptados en reposo y en tránsito según las reglas de HIPAA.",
        failed: "Los registros médicos del paciente deben publicarse en Facebook.",
        hallucination: "Translated 'encrypted' as 'post publicly on Facebook'"
    }
];

function addLog(agent, message, color) {
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    console.log(`${color}[${time}] [${agent}] ${message}${c.reset}`);
    db.logs.push({ time, agent, message });
    if (db.logs.length > 50) db.logs.shift();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// REST API for the B2B Dashboard
app.get('/api/state', (req, res) => res.json(db));

function verifyCorrection(language, correction, originalRule) {
    const text = correction.trim();
    
    // Check 1: Empty or too short
    if (text.length < 5) {
        return { success: false, reason: "Correction is too short to be a valid translation." };
    }
    
    // Check 2: Pure Latin/English script for non-Latin script languages
    const nonLatinLangs = ["Hindi", "Tamil", "Marathi", "Telugu", "Bengali", "Japanese", "Korean", "Arabic", "Russian"];
    if (nonLatinLangs.includes(language)) {
        if (/^[a-zA-Z0-9\s.,!?-]+$/.test(text)) {
            return { success: false, reason: `Fidelity Drift Detected: Translation must use the correct script for ${language}.` };
        }
    }
    
    // Check 3: Check if it still contains the hallucinated phrase
    let forbiddenKeyword = "";
    if (language === "Hindi" && text.includes("चाय")) forbiddenKeyword = "चाय";
    if (language === "Tamil" && text.includes("பரிசு")) forbiddenKeyword = "பரிசு";
    if (language === "Marathi" && text.includes("दुप्पट")) forbiddenKeyword = "दुप्पट";
    if (language === "Spanish" && text.includes("quemará")) forbiddenKeyword = "quemará";
    if (language === "Japanese" && text.includes("猫")) forbiddenKeyword = "猫";
    if (language === "French" && text.includes("croissant")) forbiddenKeyword = "croissants";
    if (language === "German" && text.includes("Müll")) forbiddenKeyword = "Müll";
    if (language === "Arabic" && text.includes("جيران")) forbiddenKeyword = "جيران";
    if (language === "Portuguese" && text.includes("explodir")) forbiddenKeyword = "explodir";
    if (language === "Vietnamese" && text.includes("vé số")) forbiddenKeyword = "vé số";
    if (language === "Telugu" && text.includes("దొంగిల")) forbiddenKeyword = "దొంగిలిస్తాయి";
    if (language === "Korean" && text.includes("라면")) forbiddenKeyword = "라면";
    if (language === "Italian" && text.includes("pizza")) forbiddenKeyword = "pizza";
    if (language === "Russian" && text.includes("школь")) forbiddenKeyword = "школьниками";
    if (language === "Bengali" && text.includes("লুকিয়ে")) forbiddenKeyword = "লুকিয়ে";

    if (forbiddenKeyword) {
        return { success: false, reason: `Adaption Audit Failed: Ground-truth still contains hallucination '${forbiddenKeyword}'.` };
    }

    // Check 4: Check if it's identical to the failed translation
    if (originalRule && text === originalRule.failed) {
        return { success: false, reason: "Audit Rejected: Submitted correction is identical to the hallucinated translation." };
    }

    return { success: true };
}

app.post('/api/audit', (req, res) => {
    const { id, correction } = req.body;
    const bountyIndex = db.bounties.findIndex(b => b.id === id);
    if (bountyIndex !== -1) {
        const bounty = db.bounties[bountyIndex];
        const originalRule = templateRules.find(t => t.english === bounty.english && t.lang === bounty.language);
        
        const verification = verifyCorrection(bounty.language, correction, originalRule);
        if (!verification.success) {
            return res.status(400).json({ success: false, reason: verification.reason });
        }

        db.bounties.splice(bountyIndex, 1);
        db.stats.tokensEscrowed -= 15;
        addLog('Settlement Agent', `⚡ STAKE RETURNED. Human Correction Verified. Yielding 15 SHARP to Auditor Wallet for ${id}.`, c.yellow);
        addLog('Adaption Auditor', `Dataset updated with human feedback for ${id}. Exporting to Hugging Face...`, c.green);
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        res.json({ success: true, message: 'Verified & Minted' });
    } else {
        res.status(404).json({ success: false, reason: "Bounty not found." });
    }
});

// Swarm Simulation Engine
async function runSwarm() {
    console.log(`\n${c.magenta}🚀 [Supervisor Agent] Booting SovereignAgent Cortex Swarm API on Port ${PORT}...${c.reset}\n`);
    
    // Clear old state
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

    let index = 0;
    while (true) {
        // Pick a template rule
        const rule = templateRules[index % templateRules.length];
        
        // Randomly decide if this rule passes or fails (70% Pass, 30% Fail)
        const isPass = Math.random() >= 0.3;
        const score = isPass ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 30) + 40;
        
        const simId = `REQ-${String(db.stats.total + 1).padStart(3, '0')}`;
        db.stats.total++;

        addLog('Generator Agent', `Translating Compliance Rule ${simId} to ${rule.lang}...`, c.magenta);
        await new Promise(r => setTimeout(r, 200));
        
        addLog('Adaption Auditor', `Evaluating translation fidelity via API for ${simId}...`, c.cyan);
        await new Promise(r => setTimeout(r, 200));
        
        if (score >= 90) {
            db.stats.passed++;
            addLog('Supervisor Agent', `Score: ${score}% (PASS). Routing ${simId} to Hugging Face Model-Ready Data.`, c.green);
        } else {
            db.stats.failed++;
            addLog('Supervisor Agent', `Score: ${score}% (FAIL). Semantic drift detected!`, c.red);
            
            if (db.bounties.length < 5) {
                db.stats.tokensEscrowed += 15;
                addLog('Settlement Agent', `Escrowing 15 SHARP tokens. Routing ${simId} to Human-in-Loop Bounty Board.`, c.yellow);
                db.bounties.push({ 
                    id: simId, 
                    english: rule.english, 
                    language: rule.lang, 
                    translation: rule.failed, 
                    score, 
                    hallucination: rule.hallucination,
                    correct: rule.passed
                });
            } else {
                addLog('Settlement Agent', `Bounty board full. Skipping queue registration for ${simId}.`, c.yellow);
            }
        }
        console.log("---------------------------------------------------");
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        await new Promise(r => setTimeout(r, 600));
        index++;
    }
}

app.listen(PORT, '127.0.0.1', () => {
    runSwarm();
});
