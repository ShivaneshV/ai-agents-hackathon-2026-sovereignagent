let walletBalance = 250.00;
let displayedLogs = 0;
let lastLogTimestamp = "";
const API_URL = 'http://127.0.0.1:3000/api';

// Tab Mapping Data
const tabData = {
    'tab-autonomous': { title: 'Autonomous Systems', subtitle: 'Multi-Agent Swarm Monitor & KPIs' },
    'tab-voice': { title: 'Voice & Conversational AI', subtitle: 'Browser SpeechSynthesis Voice Agent' },
    'tab-generative': { title: 'Generative AI (RAG)', subtitle: 'Compliance Reference Library Viewer' },
    'tab-healthcare': { title: 'Healthcare Audits', subtitle: 'HIPAA Compliance & PHI Anonymization' },
    'tab-finance': { title: 'Finance & Staking', subtitle: 'Sharp Economy Yield & Token Bounties' },
    'tab-devtools': { title: 'Developer Tools', subtitle: 'Hugging Face Sync & CI/CD Terminal Logs' },
    'tab-open-innovation': { title: 'Model Alignment Hub', subtitle: 'Crowdsourced Multilingual Datasets' }
};

// Alignment Explorer Base Dataset
const alignmentDataset = [
    { id: 'REQ-001', english: 'The borrower must maintain a minimum collateral ratio of 150%.', language: 'Spanish', translation: 'El prestatario debe mantener un índice de colateral mínimo del 150%.', score: 98, status: 'Consensus' },
    { id: 'REQ-002', english: 'Failure to report foreign assets will result in penalties.', language: 'French', translation: 'Le défaut de déclaration des actifs étrangers entraînera des pénalités.', score: 95, status: 'Consensus' },
    { id: 'REQ-003', english: 'Interest rates are subject to quarterly compounding as per RBI.', language: 'German', translation: 'Zinssätze unterliegen gemäß der RBI der vierteljährlichen Verzinsung.', score: 94, status: 'Consensus' },
    { id: 'REQ-004', english: 'In case of default, the lender reserves the right to liquidate assets.', language: 'Italian', translation: 'In caso di insolvenza, il prestatore si riserva il diritto di liquidare i beni.', score: 92, status: 'Consensus' },
    { id: 'REQ-005', english: 'Users must complete identity verification before withdrawal.', language: 'Portuguese', translation: 'Os usuários devem concluir a verificação de identidade antes do saque.', score: 97, status: 'Consensus' },
    { id: 'REQ-006', english: 'Smart contracts automatically freeze funds upon breach of terms.', language: 'French', translation: 'Les contrats intelligents gèlent automatiquement les fonds en cas de violation des conditions.', score: 91, status: 'Consensus' },
    { id: 'REQ-007', english: 'Patient medical records must be encrypted at rest and in transit as per HIPAA rules.', language: 'Spanish', translation: 'Los registros médicos del paciente deben estar encriptados en reposo y en tránsito según las reglas de HIPAA.', score: 99, status: 'Consensus' }
];

window.humanCorrections = {};

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupVoiceAgent();
    setupHealthcareAnonymizer();
    setupFinanceCalculator();
    setupPDFViewer();
    setupDevTools();
    setupAlignmentExplorer();
    fetchState();
    setInterval(fetchState, 1000);
});

// 1. Sidebar Tab Logic
function setupTabs() {
    const navLinks = document.querySelectorAll('#sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            document.getElementById('dashboard-title').innerText = tabData[targetId].title;
            document.getElementById('dashboard-subtitle').innerText = tabData[targetId].subtitle;
        });
    });
}

// 2. Browser Speech Agent
function setupVoiceAgent() {
    const btnSpeak = document.getElementById('btn-speak');
    const input = document.getElementById('voice-input');
    const chatPane = document.getElementById('chat-pane');
    const wave = document.getElementById('voice-wave');

    const handleInput = () => {
        const text = input.value.trim();
        if(!text) return;
        
        chatPane.innerHTML += `<div class="message user">${text}</div>`;
        input.value = '';
        chatPane.scrollTop = chatPane.scrollHeight;
        
        setTimeout(() => {
            let reply = "";
            const query = text.toLowerCase();
            if (query.includes('hipaa') || query.includes('health') || query.includes('patient') || query.includes('medical')) {
                reply = "Retrieving HIPAA Privacy Standard (45 CFR)... Under healthcare compliance guidelines, all Patient Health Information (PHI) must be encrypted at rest and in transit. Cortex audits translation models to verify terms like 'encryption' are legally correct in regional scripts.";
            } else if (query.includes('rbi') || query.includes('finance') || query.includes('interest') || query.includes('withdrawal') || query.includes('penalty')) {
                reply = "Querying RBI Compounding Guidelines... According to the RBI circular, interest rates are subject to quarterly compounding, and early withdrawals may incur a penalty of 2%. Cortex automatically evaluates these translations to prevent compliance failures.";
            } else if (query.includes('defi') || query.includes('smart contract') || query.includes('staking')) {
                reply = "Accessing DeFi Smart Contract Standards... Staking pools must autonomously escrow and distribute rewards. Our Sharp Token settlement agent integrates these internet-native economies to incentivize crowd audits.";
            } else {
                reply = "I am processing your query across the RAG knowledge base. I can verify regulatory rules for healthcare (HIPAA), banking (RBI circulars), or Web3 smart contracts.";
            }

            chatPane.innerHTML += `<div class="message ai">${reply}</div>`;
            chatPane.scrollTop = chatPane.scrollHeight;
            if('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(reply);
                utterance.onstart = () => wave.classList.remove('hidden');
                utterance.onend = () => wave.classList.add('hidden');
                window.speechSynthesis.speak(utterance);
            } else {
                wave.classList.remove('hidden');
                setTimeout(() => wave.classList.add('hidden'), 2000);
            }
        }, 1000);
    };

    document.getElementById('btn-send-chat').addEventListener('click', handleInput);
    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleInput();
    });

    // Integrated Web Speech API for actual listening & transcription
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            btnSpeak.classList.add('recording');
            wave.classList.remove('hidden');
            showToast("🎙️ Microphone active. Speak now...");
        };

        recognition.onend = () => {
            btnSpeak.classList.remove('recording');
            wave.classList.add('hidden');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            showToast(`✓ Voice Transcribed: "${transcript}"`);
            handleInput();
        };

        recognition.onerror = (e) => {
            console.error(e);
            showToast("⚠️ Speech recognition error or permission denied.");
            btnSpeak.classList.remove('recording');
            wave.classList.add('hidden');
        };
    }

    btnSpeak.addEventListener('click', () => {
        if (recognition) {
            if (btnSpeak.classList.contains('recording')) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (err) {
                    console.error(err);
                    recognition.stop();
                }
            }
        } else {
            showToast("🎙️ Speech recognition is not supported in this browser. Please use Google Chrome or Edge, or type your query.");
        }
    });
}

// 3. Healthcare Regex Redactor
function setupHealthcareAnonymizer() {
    document.getElementById('btn-anonymize').addEventListener('click', () => {
        let text = document.getElementById('phi-input').value;
        if(!text) return showToast("Enter text to anonymize");
        
        // Scrub Names, Phones, and SSNs
        text = text.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '<span class="text-green">[REDACTED NAME]</span>');
        text = text.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '<span class="text-green">[REDACTED PHONE]</span>');
        text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '<span class="text-green">[REDACTED SSN]</span>');

        document.getElementById('phi-output').innerHTML = text;
        showToast("PHI Data successfully anonymized.");
    });
}

// 4. Yield Calculator
function setupFinanceCalculator() {
    document.getElementById('btn-calc').addEventListener('click', () => {
        const p = parseFloat(document.getElementById('calc-principal').value);
        const r = parseFloat(document.getElementById('calc-rate').value) / 100;
        const t = parseFloat(document.getElementById('calc-time').value) || 1;
        if(isNaN(p) || isNaN(r) || isNaN(t)) return;
        
        const yieldAmount = p * Math.pow((1 + r), t);
        document.getElementById('calc-result').innerText = `Projected Return: ${yieldAmount.toFixed(2)} SHARP`;
    });
}

// 5. Mock PDF Viewer Modal
let pdfCurrentPage = 1;
let currentDocName = "";

function setupPDFViewer() {
    const modal = document.getElementById('pdf-viewer-modal');
    document.getElementById('close-pdf').addEventListener('click', () => modal.classList.add('hidden'));
    
    document.getElementById('pdf-prev').addEventListener('click', () => loadPDFPage(-1));
    document.getElementById('pdf-next').addEventListener('click', () => loadPDFPage(1));

    window.openPDFViewer = function(docName) {
        currentDocName = docName;
        document.getElementById('pdf-title').innerText = docName;
        modal.classList.remove('hidden');
        pdfCurrentPage = 1;
        renderPDFContent();
    }
}

function loadPDFPage(direction) {
    pdfCurrentPage += direction;
    if (pdfCurrentPage < 1) pdfCurrentPage = 1;
    renderPDFContent();
}

function renderPDFContent() {
    document.getElementById('pdf-page-num').innerText = `Page ${pdfCurrentPage}`;
    const content = document.getElementById('pdf-page-content');
    content.innerHTML = `
        <h2 style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">${currentDocName.replace(/_/g, ' ').replace('.pdf', '')}</h2>
        <h3 style="margin-bottom: 15px;">Chapter ${pdfCurrentPage}: Compliance & Regulatory Framework</h3>
        <p style="margin-bottom: 15px; line-height: 1.8; font-size: 16px;">
            [Vector Embedding Match 0.94] The central banking authority requires strict adherence to the KYC protocols established in the prior fiscal year. Institutions failing to report cross-border remittances exceeding the prescribed limits will be subject to immediate punitive action.
        </p>
        <p style="background: #fef08a; padding: 10px; border-left: 4px solid #f59e0b; font-size: 16px; margin-top: 20px;">
            <strong>Highlighted Segment (RAG Context):</strong> Section ${pdfCurrentPage}.4 explicitly notes that digital assets must be declared in annual tax returns.
        </p>
    `;
}

// 6. Developer Tools Export Simulation
function setupDevTools() {
    // 6a. Force Sync
    document.getElementById('btn-export').addEventListener('click', () => {
        const btn = document.getElementById('btn-export');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
        
        const logs = document.getElementById('commit-logs');
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        logs.innerHTML += `<p class="log-cyan">ℹ [${time}] Initiating Parquet export to Hugging Face...</p>`;
        logs.scrollTop = logs.scrollHeight;

        setTimeout(() => {
            const time2 = new Date().toLocaleTimeString('en-US', { hour12: false });
            logs.innerHTML += `<p class="log-green">✓ [${time2}] Successfully synced Sovereign-FinComply-Eval to HF.</p>`;
            logs.scrollTop = logs.scrollHeight;
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sync"></i> Force Sync Parquet';
            showToast("Dataset successfully exported to Hugging Face.");
        }, 2000);
    });

    // 6b. API Token Tester
    document.getElementById('btn-test-hf-conn').addEventListener('click', () => {
        const token = document.getElementById('hf-api-token').value.trim();
        const statusDiv = document.getElementById('hf-conn-status');
        const btn = document.getElementById('btn-test-hf-conn');

        if(!token) return showToast("❌ Please enter a Hugging Face API token!");

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pinging...';
        statusDiv.innerText = "Connecting to https://huggingface.co/api/datasets/...";
        showToast("🔌 Authenticating API Credentials...");

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = 'Test HF API Connection';
            statusDiv.innerHTML = `<span class="text-green">✓ Connected. Organization: ShivaneshV. Permissions: write-access verified.</span>`;
            showToast("🎉 Hugging Face API connection successful!");
        }, 1200);
    });

    // 6c. Schema Integrity Validator
    document.getElementById('btn-check-schema').addEventListener('click', () => {
        const schema = document.getElementById('schema-select').value;
        const outputDiv = document.getElementById('schema-check-output');
        const btn = document.getElementById('btn-check-schema');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing Schema...';
        outputDiv.innerText = `Analyzing schema constraints for ${schema}...`;

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = 'Run Schema Verification';
            outputDiv.innerHTML = `
                <span class="text-green">✓ ${schema} Schema Validated successfully.</span><br>
                <span>• Columns Count: 5 | Primary Key: id</span><br>
                <span>• Types: id (String), english (String), translation (String), score (Int), status (String)</span>
            `;
            showToast("✓ Parquet file integrity check passed.");
        }, 1000);
    });
}

// 7. RLHF Dataset Explorer logic
function setupAlignmentExplorer() {
    const searchInput = document.getElementById('align-search');
    const langSelect = document.getElementById('align-lang-select');
    const downloadBtn = document.getElementById('btn-download-align');

    // Attach search and filter events
    searchInput.addEventListener('input', () => renderAlignmentTable());
    langSelect.addEventListener('change', () => renderAlignmentTable());

    // Download JSON action
    downloadBtn.addEventListener('click', () => {
        const exportData = alignmentDataset.map(row => {
            const corrected = window.humanCorrections[row.id];
            return {
                id: row.id,
                english: row.english,
                language: row.language,
                translation: corrected || row.translation,
                score: corrected ? 99 : row.score,
                status: corrected ? "Human Verified (Staking Yielded)" : row.status
            };
        });

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "alignment_consensus.json");
        dlAnchorElem.click();
        showToast("🎉 Exported alignment_consensus.json successfully!");
    });

    // Render table
    window.renderAlignmentTable = function() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedLang = langSelect.value;
        const tbody = document.getElementById('innovation-table');
        if(!tbody) return;

        let html = '';
        alignmentDataset.forEach(row => {
            const correctedText = window.humanCorrections[row.id];
            const currentTranslation = correctedText || row.translation;
            const currentScore = correctedText ? '99% (Staking)' : `${row.score}%`;
            const currentStatus = correctedText ? 'Human Verified' : row.status;

            // Search filter
            const matchesQuery = row.english.toLowerCase().includes(query) || currentTranslation.toLowerCase().includes(query);
            const matchesLang = selectedLang === 'all' || row.language === selectedLang;

            if (matchesQuery && matchesLang) {
                const statusBadge = currentStatus === 'Human Verified' 
                    ? '<span class="badge pass" style="background: rgba(16, 185, 129, 0.2); color: var(--accent-green);"><i class="fas fa-check-double"></i> Human Verified</span>' 
                    : `<span class="badge pass" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;"><i class="fas fa-users"></i> Consensus (${currentScore})</span>`;

                html += `
                    <tr>
                        <td style="font-family:\'JetBrains Mono\', monospace; font-weight:bold; padding: 12px; border-bottom:1px solid #333;">${row.id}</td>
                        <td style="padding: 12px; border-bottom:1px solid #333;">${row.english}</td>
                        <td style="padding: 12px; border-bottom:1px solid #333;"><span class="badge pass" style="background:rgba(59, 130, 246, 0.15); color:#60a5fa;">${row.language}</span></td>
                        <td style="padding: 12px; border-bottom:1px solid #333; font-style:${correctedText ? 'italic' : 'normal'}; color:${correctedText ? 'var(--accent-green)' : 'inherit'};">
                            ${currentTranslation}
                        </td>
                        <td style="padding: 12px; border-bottom:1px solid #333;">${statusBadge}</td>
                    </tr>
                `;
            }
        });

        if (html === '') {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 30px; color: var(--text-muted);">No matching alignment records found.</td></tr>';
        } else {
            tbody.innerHTML = html;
        }
    };

    window.renderAlignmentTable();
}

// 8. Backend API Polling
async function fetchState() {
    try {
        const response = await fetch(`${API_URL}/state`);
        if (!response.ok) return;
        const data = await response.json();
        
        document.getElementById('kpi-total').textContent = data.stats.total;
        document.getElementById('kpi-passed').textContent = data.stats.passed;
        document.getElementById('kpi-failed').textContent = data.stats.failed;
        document.getElementById('kpi-escrow').textContent = data.stats.tokensEscrowed;
        
        // Update DevTools
        const progress = Math.min((data.stats.total / 30) * 100, 100);
        const progressFill = document.getElementById('export-progress');
        if (progressFill) progressFill.style.width = `${progress}%`;
        
        const devRows = document.getElementById('dev-rows');
        if (devRows) devRows.textContent = data.stats.total;

        updateLogs(data.logs);
        updateBounties(data.bounties);
    } catch (error) { 
        // Silent fail
    }
}

function updateLogs(logs) {
    const terminal = document.getElementById('terminal-logs');
    if (!terminal) return;
    if (logs.length === 0) return;
    
    const latestLog = logs[logs.length - 1];
    const latestKey = `${latestLog.time}-${latestLog.agent}-${latestLog.message}`;
    
    if (latestKey !== lastLogTimestamp) {
        terminal.innerHTML = ''; 
        logs.forEach(log => {
            let colorClass = 'log-cyan';
            if (log.agent === 'Generator Agent') colorClass = 'log-purple';
            if (log.agent === 'Supervisor Agent') colorClass = log.message.includes('PASS') ? 'log-green' : 'log-red';
            if (log.agent === 'Settlement Agent') colorClass = 'log-yellow';

            const p = document.createElement('p');
            p.innerHTML = `<span style="color:#666">[${log.time}]</span> <span class="${colorClass}">[${log.agent}]</span> ${log.message}`;
            terminal.appendChild(p);
        });
        terminal.scrollTop = terminal.scrollHeight;
        lastLogTimestamp = latestKey;
    }
}

function updateBounties(bounties) {
    const tbody = document.querySelector('#bounty-table tbody');
    if (!tbody) return; 

    if (bounties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 40px; color: #94a3b8;">All workflows verified. No pending bounties.</td></tr>';
        return;
    }

    const visibleIds = Array.from(tbody.querySelectorAll('tr')).map(tr => tr.id.replace('row-', ''));
    const backendIds = bounties.map(b => b.id);
    const needRedraw = visibleIds.length !== backendIds.length || !visibleIds.every((id, idx) => id === backendIds[idx]);

    if (needRedraw) {
        let html = '';
        bounties.forEach(bounty => {
            const escapedCorrect = bounty.correct ? bounty.correct.replace(/"/g, '&quot;') : '';
            html += `
                <tr id="row-${bounty.id}">
                    <td style="width: 35%;">
                        <strong>${bounty.id}</strong> <span class="badge pass" style="background:rgba(59, 130, 246, 0.2); color:#60a5fa;">${bounty.language}</span>
                        <div class="text-muted mt-2" style="font-size:12px;">${bounty.english}</div>
                    </td>
                    <td style="width: 35%;">
                        <div class="hallucination-box">
                            <div style="margin-bottom:8px;">${bounty.translation}</div>
                            <div style="font-size:12px; color:var(--accent-yellow); font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> Drift: ${bounty.hallucination}</div>
                        </div>
                    </td>
                    <td style="width: 30%;">
                        <input type="text" class="input-dark mb-2" id="input-${bounty.id}" placeholder="Enter verified translation...">
                        <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; color: var(--accent-yellow); cursor: pointer; font-weight: 600;" class="autofill-btn" data-id="${bounty.id}" data-correct="${escapedCorrect}">
                                <i class="fas fa-magic"></i> Auto-fill Correct
                            </span>
                        </div>
                        <button class="btn-stake stake-btn" data-id="${bounty.id}">
                            <i class="fas fa-coins"></i> Stake 5 SHARP
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;

        // Add event listeners for autofill buttons
        tbody.querySelectorAll('.autofill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const correctText = btn.getAttribute('data-correct');
                const input = document.getElementById(`input-${id}`);
                if (input) {
                    input.value = correctText;
                    showToast("✨ Auto-filled ground-truth translation!");
                }
            });
        });

        // Add event listeners for stake buttons
        tbody.querySelectorAll('.stake-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                submitCorrection(id);
            });
        });
    }
}

window.submitCorrection = async function(id) {
    const inputInput = document.getElementById(`input-${id}`);
    if (!inputInput) return;
    const input = inputInput.value.trim();
    if (!input) return showToast("❌ Please enter a corrected translation!");

    const btn = document.querySelector(`#row-${id} .stake-btn`);
    if (btn) {
        btn.disabled = true; 
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    }

    try {
        const response = await fetch(`${API_URL}/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, correction: input })
        });
        const result = await response.json();
        
        if (result.success) {
            walletBalance += 15;
            document.getElementById('wallet-balance').textContent = `${walletBalance.toFixed(2)} SHARP`;
            
            const walletCard = document.querySelector('.wallet-card');
            walletCard.classList.add('mint');
            setTimeout(() => walletCard.classList.remove('mint'), 500);

            showToast(`🎉 Verified via Adaption! +15 SHARP yielded.`);
            
            // Log to local humanCorrections mapping and refresh alignment table
            window.humanCorrections[id] = input;
            if (window.renderAlignmentTable) window.renderAlignmentTable();

            const targetRow = document.getElementById(`row-${id}`);
            if (targetRow) targetRow.remove();
            fetchState(); 
        } else {
            showToast(`❌ ${result.reason || 'Verification failed.'}`);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-coins"></i> Stake 5 SHARP';
            }
        }
    } catch (error) { 
        console.error(error); 
        if (btn) {
            btn.disabled = false; 
            btn.innerHTML = '<i class="fas fa-coins"></i> Stake 5 SHARP'; 
        }
    }
};

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas fa-check-circle" style="font-size: 20px;"></i> ${message}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
}
