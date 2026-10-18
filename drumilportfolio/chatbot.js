/**
 * AETHEL COPILOT — Architecture & Project Scoping Assistant
 * Engineered for AETHEL hq (https://aethelhq.com)
 */

(function () {
    'use strict';

    // --- Knowledge Base & Architectural Data ---
    const KB = {
        identity: {
            name: "AETHEL Copilot",
            agency: "AETHEL hq",
            founder: "Drumil Patel",
            role: "Systems Architect & Full-Stack Engineer",
            email: "hello@aethelhq.com",
            github: "https://github.com/meetcreator",
            sprintCycle: "Two-week agile sprints with working staging builds every 14 days",
            guarantee: "100% intellectual property and full code ownership handed over to clients"
        },
        services: {
            automation: {
                title: "Process Automation",
                desc: "High-throughput autonomous pipelines connecting CRM, ERP, and payment systems with zero-latency synchronization.",
                stack: ["Python", "FastAPI", "Webhooks", "Redis", "Celery", "PostgreSQL"],
                metrics: "Replaces 20+ manual hours/week with sub-second error-checked pipelines."
            },
            saas: {
                title: "Custom SaaS Development",
                desc: "Enterprise-grade web applications built from zero. From scalable multitenant backends to high-conversion modern UIs.",
                stack: ["Next.js 16", "React", "Python", "FastAPI", "PostgreSQL", "AWS / Docker"],
                metrics: "Production-ready architectures engineered for rapid iteration and high concurrency."
            },
            ai: {
                title: "Autonomous AI & RAG Integration",
                desc: "Deploying custom LLMs and private retrieval-augmented generation (RAG) engines inside client infrastructure.",
                stack: ["Python", "LangChain / LlamaIndex", "Vector DBs (Qdrant/Pinecone)", "FastAPI", "OpenAI / Claude / Local LLMs"],
                metrics: "Real business leverage — automated document parsing, vendor analysis, and private data querying."
            }
        },
        projects: {
            archshield: {
                name: "Archshield",
                category: "Security Infrastructure",
                summary: "Enterprise IaC security analyzer that parses Terraform files to uncover security vulnerabilities, estimate cloud costs, and enforce compliance before deployment.",
                metrics: "65% deploy error reduction & pre-commit cost forecasting.",
                url: "/archshield",
                infoUrl: "archshield-info.html"
            },
            business: {
                name: "BusinessAnalyticsPro",
                category: "Data Intelligence",
                summary: "Executive analytics dashboard with automated data profiling, automated data cleaning pipelines, and interactive financial charts for non-technical stakeholders.",
                metrics: "Sub-second data profiling with pandas & FastAPI.",
                url: "/business",
                infoUrl: "business-analytics-info.html"
            },
            procurement: {
                name: "Procurement AI",
                category: "Autonomous AI",
                summary: "Autonomous procurement platform with supplier sourcing, LLM contract risk analysis, human-in-the-loop approvals, and real-time spend analytics.",
                metrics: "Cuts standard procurement cycle times by 60%.",
                url: "/procurement",
                infoUrl: "procurement-info.html"
            },
            olympiad: {
                name: "Indian National Olympiad",
                category: "Education Platform",
                summary: "Nationwide registration, study portal, and real-time result tracking platform handling high concurrent student volumes.",
                metrics: "50,000+ active students supported with Next.js and Firebase.",
                url: "/olympiad"
            }
        }
    };

    // --- State Management ---
    let state = {
        isOpen: false,
        scopingMode: null, // 'asking_type', 'asking_scale', 'asking_timeline'
        scopingData: {},
        messages: []
    };

    // --- UI Templates ---
    function renderChatWidget() {
        const widget = document.createElement('div');
        widget.id = 'aethel-copilot-root';
        widget.innerHTML = `
            <!-- Floating Launcher -->
            <div class="aethel-chat-launcher">
                <div class="chat-teaser-bubble" id="chat-teaser-trigger">
                    <span class="teaser-dot"></span>
                    <span>Architecture scope or questions? 👋</span>
                </div>
                <button class="chat-launcher-btn" id="chat-launcher-toggle" aria-label="Open AETHEL Copilot">
                    <span class="launcher-pulse-ring"></span>
                    <i class="fas fa-terminal launcher-icon-chat"></i>
                    <i class="fas fa-times launcher-icon-close"></i>
                </button>
            </div>

            <!-- Modal Window -->
            <div class="aethel-chat-modal" id="aethel-chat-modal" role="dialog" aria-modal="true" aria-label="AETHEL Architecture Copilot">
                <!-- Header -->
                <div class="chat-modal-header">
                    <div class="chat-header-identity">
                        <div class="chat-avatar-mark">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="6" fill="#141312"/>
                                <path d="M6.5 17.5L12 6.5L17.5 17.5M8.5 13.5H15.5" stroke="#c17d3c" stroke-width="2.2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="chat-header-text">
                            <h4>AETHEL <span class="chat-copilot-tag">AI Copilot</span></h4>
                            <div class="chat-status-sub">
                                <span class="status-dot"></span>
                                <span>Architecture &amp; Scoping Engine</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-header-actions">
                        <button class="chat-tool-btn" id="chat-clear-btn" title="Reset chat conversation">
                            <i class="fas fa-rotate-right"></i>
                        </button>
                        <button class="chat-tool-btn" id="chat-close-btn" title="Close chat">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>

                <!-- Quick Prompts Bar -->
                <div class="chat-quick-prompts" id="chat-quick-prompts">
                    <button class="quick-prompt-pill" data-prompt="Scope my project & estimate timeline">
                        <i class="fas fa-calculator"></i> Scope my project
                    </button>
                    <button class="quick-prompt-pill" data-prompt="How does Procurement AI cut 60% cycles?">
                        <i class="fas fa-robot"></i> Procurement AI
                    </button>
                    <button class="quick-prompt-pill" data-prompt="Tell me about Archshield security analyzer">
                        <i class="fas fa-shield-alt"></i> Archshield IaC
                    </button>
                    <button class="quick-prompt-pill" data-prompt="What is your tech stack and delivery sprint process?">
                        <i class="fas fa-layer-group"></i> Tech Stack &amp; Process
                    </button>
                    <button class="quick-prompt-pill" data-prompt="How do I book a consultation with Drumil?">
                        <i class="fas fa-calendar-check"></i> Book Consultation
                    </button>
                </div>

                <!-- Messages Stream -->
                <div class="chat-messages-container" id="chat-messages-container">
                    <!-- Populated dynamically -->
                </div>

                <!-- Input Footer -->
                <div class="chat-modal-footer">
                    <form class="chat-input-form" id="chat-input-form">
                        <textarea class="chat-textarea" id="chat-input-field" rows="1" placeholder="Ask about architecture, tech stack, or scope..." aria-label="Message"></textarea>
                        <button type="submit" class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                    </form>
                    <div class="chat-privacy-hint">
                        Direct connection to <a href="mailto:hello@aethelhq.com">Drumil Patel</a> · AETHEL hq Systems
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
    }

    // --- Messaging & History ---
    function saveHistory() {
        try {
            sessionStorage.setItem('aethel_copilot_msgs', JSON.stringify(state.messages));
        } catch (e) {}
    }

    function loadHistory() {
        try {
            const saved = sessionStorage.getItem('aethel_copilot_msgs');
            if (saved) {
                state.messages = JSON.parse(saved);
                state.messages.forEach(msg => appendMessageUI(msg.sender, msg.html, false));
                return true;
            }
        } catch (e) {}
        return false;
    }

    function appendMessageUI(sender, htmlContent, scroll = true) {
        const container = document.getElementById('chat-messages-container');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;

        if (sender === 'bot') {
            msgDiv.innerHTML = `
                <div class="msg-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M6.5 17.5L12 6.5L17.5 17.5M8.5 13.5H15.5" stroke="#c17d3c" stroke-width="2.6" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="msg-bubble">${htmlContent}</div>
            `;
        } else {
            msgDiv.innerHTML = `
                <div class="msg-bubble">${htmlContent}</div>
            `;
        }

        container.appendChild(msgDiv);
        if (scroll) {
            container.scrollTop = container.scrollHeight;
        }
    }

    function showTypingIndicator() {
        const container = document.getElementById('chat-messages-container');
        const existing = document.getElementById('chat-typing');
        if (existing) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'chat-typing';
        typingDiv.className = 'chat-msg bot';
        typingDiv.innerHTML = `
            <div class="msg-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.5 17.5L12 6.5L17.5 17.5M8.5 13.5H15.5" stroke="#c17d3c" stroke-width="2.6" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="chat-typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    function hideTypingIndicator() {
        const el = document.getElementById('chat-typing');
        if (el) el.remove();
    }

    function addBotResponse(htmlContent, delay = 400) {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessageUI('bot', htmlContent);
            state.messages.push({ sender: 'bot', html: htmlContent });
            saveHistory();
        }, delay);
    }

    function addUserMessage(text) {
        const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        appendMessageUI('user', `<p>${escaped}</p>`);
        state.messages.push({ sender: 'user', html: `<p>${escaped}</p>` });
        saveHistory();
    }

    // --- Intelligent Natural Language Reasoning Engine ---
    function processUserMessage(rawQuery) {
        const q = rawQuery.toLowerCase().trim();

        // 1. Check if user is currently inside the interactive scoping wizard
        if (state.scopingMode) {
            handleScopingFlow(q, rawQuery);
            return;
        }

        // 2. Interactive Scoping Trigger
        if (q.includes('scope') || q.includes('estimate') || q.includes('cost') || q.includes('how much') || q.includes('quote') || q.includes('pricing') || q.includes('timeline')) {
            startScopingWizard();
            return;
        }

        // 3. Procurement AI inquiries
        if (q.includes('procurement') || q.includes('contract') || q.includes('sourcing') || q.includes('vendor')) {
            addBotResponse(`
                <p><strong>Procurement AI</strong> is an autonomous enterprise sourcing &amp; contract risk intelligence system built by AETHEL hq.</p>
                <ul>
                    <li><strong>Key Impact:</strong> Cuts standard procurement turnaround cycles by <strong>60%</strong>.</li>
                    <li><strong>Core Capabilities:</strong> Automated vendor RFP matching, LLM contract compliance risk audit, human-in-the-loop approvals, and real-time spend analytics.</li>
                    <li><strong>Architecture:</strong> Python, FastAPI, SQLite / PostgreSQL, and structured LLM JSON inference engines.</li>
                </ul>
                <div class="chat-card-actions">
                    <a href="/procurement" target="_blank" class="chat-action-btn primary">Open Live Prototype ↗</a>
                    <a href="procurement-info.html" class="chat-action-btn secondary">Architecture Details</a>
                </div>
            `);
            return;
        }

        // 4. Archshield inquiries
        if (q.includes('archshield') || q.includes('terraform') || q.includes('iac') || q.includes('security') || q.includes('vulnerability')) {
            addBotResponse(`
                <p><strong>Archshield</strong> is an enterprise-grade Infrastructure as Code (IaC) static security analyzer.</p>
                <ul>
                    <li><strong>Core Function:</strong> Scans Terraform configurations before cloud deployments to detect misconfigurations, IAM privilege escalations, and cost drift.</li>
                    <li><strong>Demonstrated Impact:</strong> Achieved a <strong>65% reduction in production deployment security issues</strong>.</li>
                    <li><strong>Stack:</strong> Next.js 16 frontend, FastAPI microservice backend, Python AST parsing engine.</li>
                </ul>
                <div class="chat-card-actions">
                    <a href="/archshield" target="_blank" class="chat-action-btn primary">Launch Archshield Demo ↗</a>
                    <a href="archshield-info.html" class="chat-action-btn secondary">Case Study</a>
                </div>
            `);
            return;
        }

        // 5. BusinessAnalyticsPro inquiries
        if (q.includes('analytics') || q.includes('businessanalytics') || q.includes('dashboard') || q.includes('data')) {
            addBotResponse(`
                <p><strong>BusinessAnalyticsPro</strong> solves data fragmentation for non-technical leadership teams.</p>
                <ul>
                    <li><strong>Core Function:</strong> Automated dataset ingestion, pandas profiling pipelines, instant anomaly detection, and interactive charts.</li>
                    <li><strong>Performance:</strong> Sub-second calculation times on 100k+ row datasets.</li>
                    <li><strong>Stack:</strong> React, Tailwind CSS, Python, Pandas, FastAPI.</li>
                </ul>
                <div class="chat-card-actions">
                    <a href="/business" target="_blank" class="chat-action-btn primary">Explore Live Dashboard ↗</a>
                    <a href="business-analytics-info.html" class="chat-action-btn secondary">Technical Specs</a>
                </div>
            `);
            return;
        }

        // 6. Technology Stack & Process
        if (q.includes('stack') || q.includes('tech') || q.includes('languages') || q.includes('python') || q.includes('react') || q.includes('process') || q.includes('sprint') || q.includes('agile')) {
            addBotResponse(`
                <p><strong>AETHEL hq Technical Architecture &amp; Delivery Model:</strong></p>
                <ul>
                    <li><strong>Backend &amp; Compute:</strong> Python, FastAPI, Node.js, Docker, Celery asynchronous workers.</li>
                    <li><strong>Frontend &amp; UX:</strong> React, Next.js 16, TypeScript, modern CSS design systems.</li>
                    <li><strong>Data &amp; Infra:</strong> PostgreSQL, Redis, AWS (ECS, Lambda, RDS), Terraform IaC.</li>
                    <li><strong>Delivery Cadence:</strong> <strong>2-week agile sprints</strong> with working staging deployments every 14 days.</li>
                    <li><strong>Code Ownership:</strong> 100% intellectual property transfer upon completion. No vendor lock-in.</li>
                </ul>
                <div class="chat-card-actions">
                    <button class="chat-action-btn primary" onclick="window.AethelChat.scopeProject()">Scope My Architecture ➔</button>
                </div>
            `);
            return;
        }

        // 7. Founder & Drumil Patel
        if (q.includes('drumil') || q.includes('patel') || q.includes('founder') || q.includes('team') || q.includes('who are you') || q.includes('who is')) {
            addBotResponse(`
                <p>AETHEL hq is spearheaded by <strong>Drumil Patel</strong>, a systems architect and full-stack engineer.</p>
                <p>He specializes in designing and building end-to-end software where engineering decisions directly produce measurable revenue outcomes (ROI).</p>
                <div class="chat-card-actions">
                    <a href="https://github.com/meetcreator" target="_blank" rel="noopener noreferrer" class="chat-action-btn secondary">
                        <i class="fab fa-github"></i> GitHub: @meetcreator
                    </a>
                    <a href="mailto:hello@aethelhq.com" class="chat-action-btn primary">
                        <i class="far fa-envelope"></i> Email Drumil
                    </a>
                </div>
            `);
            return;
        }

        // 8. Consultation & Contact Booking
        if (q.includes('contact') || q.includes('hire') || q.includes('book') || q.includes('call') || q.includes('meeting') || q.includes('email') || q.includes('reach')) {
            addBotResponse(`
                <p><strong>Ready to review your architecture or build your next system?</strong></p>
                <p>We are currently accepting <strong>2 new client partnerships for Q2</strong>.</p>
                <div class="chat-brief-card">
                    <div class="brief-card-title"><i class="fas fa-check-circle"></i> Direct Consultation</div>
                    <div class="brief-card-rows">
                        <div class="brief-row">
                            <span class="brief-row-lbl">Email:</span>
                            <span class="brief-row-val">hello@aethelhq.com</span>
                        </div>
                        <div class="brief-row">
                            <span class="brief-row-lbl">Response Time:</span>
                            <span class="brief-row-val">Under 12 Business Hours</span>
                        </div>
                        <div class="brief-row">
                            <span class="brief-row-lbl">Format:</span>
                            <span class="brief-row-val">30-min Technical Diagnostic</span>
                        </div>
                    </div>
                    <div class="chat-card-actions">
                        <a href="mailto:hello@aethelhq.com?subject=Technical%20Architecture%20Inquiry%20-%20AETHEL%20hq" class="chat-action-btn primary">
                            Send Email to Drumil ➔
                        </a>
                    </div>
                </div>
            `);
            return;
        }

        // 9. AI Integration / RAG
        if (q.includes('ai') || q.includes('llm') || q.includes('rag') || q.includes('agent') || q.includes('gpt')) {
            addBotResponse(`
                <p><strong>Private AI Integration &amp; Custom LLM Engines:</strong></p>
                <p>We deploy AI inside your private virtual private cloud (VPC) so your proprietary company data never leaks to public training sets.</p>
                <ul>
                    <li>Retrieval-Augmented Generation (RAG) with vector databases</li>
                    <li>Automated document extraction and contract risk analysis</li>
                    <li>Autonomous background agents with guardrailed execution</li>
                </ul>
                <div class="chat-card-actions">
                    <button class="chat-action-btn primary" onclick="window.AethelChat.scopeProject('AI Integration')">Scope AI Project ➔</button>
                </div>
            `);
            return;
        }

        // 10. Intelligent Fallback with Scoping Recommendation
        addBotResponse(`
            <p>I can help you analyze technical architecture, review past case studies, or estimate a production scope for your team.</p>
            <p>What would you like to explore?</p>
            <div class="chat-card-actions">
                <button class="chat-action-btn primary" onclick="window.AethelChat.scopeProject()">🏗️ Scope My Project</button>
                <button class="chat-action-btn secondary" onclick="window.AethelChat.sendQuery('What is your tech stack and delivery sprint process?')">⚡ Tech Stack &amp; Sprints</button>
                <a href="mailto:hello@aethelhq.com" class="chat-action-btn secondary">✉️ Email Founder</a>
            </div>
        `);
    }

    // --- Interactive Scoping Wizard Flow ---
    function startScopingWizard(preselectedType = null) {
        state.scopingData = {};
        if (preselectedType) {
            state.scopingData.type = preselectedType;
            state.scopingMode = 'asking_scale';
            addBotResponse(`
                <p>Great! Let's scope your <strong>${preselectedType}</strong> solution.</p>
                <p>What is your expected scale or user volume?</p>
                <div class="chat-card-actions">
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Internal Team &lt; 50 Users')">Internal Team (&lt; 50 users)</button>
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Growing SaaS 1k-10k Users')">Growing SaaS (1k–10k users)</button>
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Enterprise 10k+ Concurrency')">High Scale (10k+ concurrency)</button>
                </div>
            `);
            return;
        }

        state.scopingMode = 'asking_type';
        addBotResponse(`
            <p><strong>AETHEL Architecture Scoping Engine:</strong></p>
            <p>Select what type of system you are planning to build:</p>
            <div class="chat-card-actions">
                <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Full-Stack SaaS Application')">🌐 Full-Stack SaaS</button>
                <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Process Automation Pipeline')">⚡ Process Automation</button>
                <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Private AI & RAG Engine')">🧠 Private AI / LLM Engine</button>
                <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Cloud Infrastructure & Security Audit')">🔒 Cloud Infra / Security</button>
            </div>
        `);
    }

    function handleScopingFlow(lowerQuery, rawQuery) {
        if (state.scopingMode === 'asking_type') {
            state.scopingData.type = rawQuery;
            state.scopingMode = 'asking_scale';
            addBotResponse(`
                <p>Noted: <strong>${state.scopingData.type}</strong>.</p>
                <p>What is the primary timeline or launch target for this build?</p>
                <div class="chat-card-actions">
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Fast Sprint: 2-4 Weeks MVP')">⚡ 2–4 Weeks (Fast MVP)</button>
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Comprehensive: 6-8 Weeks')">⏱️ 6–8 Weeks (Production Build)</button>
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Ongoing Architecture Advisory')">🔄 Ongoing Partnership</button>
                </div>
            `);
            return;
        }

        if (state.scopingMode === 'asking_scale') {
            state.scopingData.scaleOrTimeline = rawQuery;
            state.scopingMode = 'asking_budget';
            addBotResponse(`
                <p>Understood. Target cadence: <strong>${state.scopingData.scaleOrTimeline}</strong>.</p>
                <p>Do you already have existing infrastructure or APIs to integrate with, or are we building greenfield from scratch?</p>
                <div class="chat-card-actions">
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Greenfield from scratch')">🌱 Greenfield (From scratch)</button>
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.answerScoping('Integrating with existing CRM/APIs/Database')">🔗 Integrating with existing APIs</button>
                </div>
            `);
            return;
        }

        if (state.scopingMode === 'asking_budget') {
            state.scopingData.infraContext = rawQuery;
            state.scopingMode = null; // Scoping completed!
            generateArchitectureBrief();
            return;
        }
    }

    function generateArchitectureBrief() {
        const type = state.scopingData.type || "Custom Software Architecture";
        const cadence = state.scopingData.scaleOrTimeline || "4-6 Weeks (2-3 Sprints)";
        const infra = state.scopingData.infraContext || "Full End-to-End Build";

        // Determine smart stack recommendation based on type
        let stack = "FastAPI + React / Next.js 16 + PostgreSQL + Docker";
        let sprints = "2 to 3 Sprints (4–6 Weeks)";

        if (type.toLowerCase().includes('automation')) {
            stack = "Python + FastAPI + Celery / Redis + PostgreSQL + Webhooks";
            sprints = "1 to 2 Sprints (2–4 Weeks)";
        } else if (type.toLowerCase().includes('ai')) {
            stack = "Python + FastAPI + Vector DB + LLM Agent Pipelines + Next.js";
            sprints = "2 to 3 Sprints (4–6 Weeks)";
        } else if (type.toLowerCase().includes('infra') || type.toLowerCase().includes('security')) {
            stack = "Terraform IaC + AWS / GCP + Docker + Archshield Audit Engine";
            sprints = "1 to 2 Sprints (2–4 Weeks)";
        }

        const mailtoSubject = encodeURIComponent(`Architecture Scope Request: ${type}`);
        const mailtoBody = encodeURIComponent(
            `Hi Drumil,\n\nI generated an architectural scope using AETHEL Copilot:\n\n` +
            `- Project Type: ${type}\n` +
            `- Target Timeline: ${cadence}\n` +
            `- Infrastructure Context: ${infra}\n` +
            `- Proposed Stack: ${stack}\n\n` +
            `I'd like to schedule a 30-min technical diagnostic call to discuss this build.\n\nBest,\n`
        );

        addBotResponse(`
            <p>✅ <strong>Preliminary Architecture Brief Generated:</strong></p>
            <div class="chat-brief-card">
                <div class="brief-card-title"><i class="fas fa-layer-group"></i> Architecture Specification</div>
                <div class="brief-card-rows">
                    <div class="brief-row">
                        <span class="brief-row-lbl">System Type:</span>
                        <span class="brief-row-val">${type}</span>
                    </div>
                    <div class="brief-row">
                        <span class="brief-row-lbl">Recommended Stack:</span>
                        <span class="brief-row-val">${stack}</span>
                    </div>
                    <div class="brief-row">
                        <span class="brief-row-lbl">Estimated Cadence:</span>
                        <span class="brief-row-val">${sprints}</span>
                    </div>
                    <div class="brief-row">
                        <span class="brief-row-lbl">IP &amp; Ownership:</span>
                        <span class="brief-row-val">100% Client Owned</span>
                    </div>
                </div>
                <div class="chat-card-actions">
                    <a href="mailto:hello@aethelhq.com?subject=${mailtoSubject}&body=${mailtoBody}" class="chat-action-btn primary">
                        <i class="far fa-paper-plane"></i> Send Brief to Drumil for Quote ➔
                    </a>
                    <button class="chat-action-btn secondary" onclick="window.AethelChat.scopeProject()">Restart Scope</button>
                </div>
            </div>
            <p style="margin-top: 10px; font-size: 0.78rem; color: rgba(255,255,255,0.6);">
                Clicking the button above will prepare a pre-filled diagnostic email directly to Drumil Patel.
            </p>
        `);
    }

    // --- Init & Event Listeners ---
    function init() {
        if (document.getElementById('aethel-copilot-root')) return;

        renderChatWidget();

        const launcherBtn = document.getElementById('chat-launcher-toggle');
        const teaserBubble = document.getElementById('chat-teaser-trigger');
        const modal = document.getElementById('aethel-chat-modal');
        const closeBtn = document.getElementById('chat-close-btn');
        const clearBtn = document.getElementById('chat-clear-btn');
        const inputForm = document.getElementById('chat-input-form');
        const inputField = document.getElementById('chat-input-field');
        const quickPrompts = document.getElementById('chat-quick-prompts');

        const toggleChat = (openState) => {
            state.isOpen = typeof openState === 'boolean' ? openState : !state.isOpen;
            if (state.isOpen) {
                modal.classList.add('open');
                launcherBtn.classList.add('active');
                if (teaserBubble) teaserBubble.style.display = 'none';
                inputField.focus();

                // If first time open and empty, send welcome
                if (state.messages.length === 0) {
                    addBotResponse(`
                        <p>Welcome to <strong>AETHEL hq</strong>. I'm your technical copilot.</p>
                        <p>I can help you scope your project, estimate timelines &amp; architectures, or answer questions about our past enterprise work (Archshield, Procurement AI, INO).</p>
                        <p>How can I assist your engineering roadmap today?</p>
                    `, 200);
                }
            } else {
                modal.classList.remove('open');
                launcherBtn.classList.remove('active');
            }
        };

        launcherBtn.addEventListener('click', () => toggleChat());
        if (teaserBubble) teaserBubble.addEventListener('click', () => toggleChat(true));
        closeBtn.addEventListener('click', () => toggleChat(false));

        clearBtn.addEventListener('click', () => {
            state.messages = [];
            state.scopingMode = null;
            state.scopingData = {};
            try { sessionStorage.removeItem('aethel_copilot_msgs'); } catch (e) {}
            const container = document.getElementById('chat-messages-container');
            if (container) container.innerHTML = '';
            addBotResponse(`Conversation reset. How can I help you scope your next build?`, 150);
        });

        // Quick prompt click
        quickPrompts.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-prompt-pill');
            if (!btn) return;
            const prompt = btn.dataset.prompt;
            addUserMessage(prompt);
            processUserMessage(prompt);
        });

        // Form Submit
        inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = inputField.value.trim();
            if (!text) return;
            inputField.value = '';
            addUserMessage(text);
            processUserMessage(text);
        });

        // Enter key handling (Shift+Enter for newline)
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                inputForm.dispatchEvent(new Event('submit'));
            }
        });

        // Check if history exists
        loadHistory();

        // Expose helper API globally for inline action buttons
        window.AethelChat = {
            toggle: toggleChat,
            scopeProject: (type) => {
                toggleChat(true);
                startScopingWizard(type);
            },
            answerScoping: (val) => {
                addUserMessage(val);
                processUserMessage(val);
            },
            sendQuery: (query) => {
                toggleChat(true);
                addUserMessage(query);
                processUserMessage(query);
            }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
