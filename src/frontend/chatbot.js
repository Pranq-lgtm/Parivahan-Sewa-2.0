/**
 * Parivahan AI Saathi - OpenAI RAG Chatbot Integration
 * Features:
 * - Direct OpenAI Completions API with key authentication
 * - RAG semantic context retrieval from ParivahanKnowledgeBase
 * - Full multi-turn conversational memory persisted in localStorage
 * - Active User & Page Context Awareness (Knows user's vehicles, DL, pending fines)
 * - Alternative Path Advisor for official offline/online fallback routes
 * - Responsive floating widget with quick prompt suggestion chips
 */

(function () {
    const OPENAI_MODEL = 'gpt-4o-mini';

    // ----------------------------------------------------
    // 1. Initialize State & Memory
    // ----------------------------------------------------
    let isOpen = false;
    let isTyping = false;
    const STORAGE_KEY = 'parivahan_ai_chat_history_v1';

    function getChatHistory() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    function saveChatHistory(history) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20))); // Keep last 20 messages
        } catch (e) {
            console.warn('Could not save chat history to localStorage', e);
        }
    }

    function getUserContext() {
        try {
            const userStr = localStorage.getItem('mockUser');
            if (userStr) {
                const user = JSON.parse(userStr);
                // Look up in mock data if available
                let persona = null;
                if (window.ParivahanMockData && window.ParivahanMockData.personas) {
                    persona = window.ParivahanMockData.personas.find(p => p.email === user.email || p.name === user.name);
                }
                return {
                    name: user.name || 'Citizen',
                    email: user.email || '',
                    role: user.role || (persona ? persona.role : 'Citizen'),
                    vehicle: persona ? persona.primaryVehicle : (user.primaryVehicle || 'DL01AB1234'),
                    dlNumber: persona ? persona.primaryDL : (user.primaryDL || 'DL-1420110012345'),
                    details: persona ? persona.description : 'Individual verified transport citizen'
                };
            }
        } catch (e) {}
        return {
            name: 'Guest Citizen',
            email: 'Not Logged In',
            role: 'Citizen (Unauthenticated)',
            vehicle: 'DL01AB1234 (Sample)',
            dlNumber: 'DL-1420110012345 (Sample)',
            details: 'Browsing publicly'
        };
    }

    function getPageContext() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceId = urlParams.get('id') || 'home-overview';
        return {
            path: window.location.pathname,
            serviceId: serviceId,
            title: document.title
        };
    }

    // ----------------------------------------------------
    // 2. Create Floating Chat Widget DOM
    // ----------------------------------------------------
    function injectChatbotUI() {
        if (document.getElementById('parivahan-chatbot-container')) return;

        const container = document.createElement('div');
        container.id = 'parivahan-chatbot-container';
        container.className = 'fixed bottom-6 right-6 z-50 font-sans';

        container.innerHTML = `
            <!-- Chat Trigger Floating Action Button (FAB) -->
            <button id="chatbot-fab" class="relative group bg-gradient-to-r from-primary via-blue-800 to-primary text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/20 min-h-[56px] min-w-[56px]" aria-label="Open Parivahan AI Saathi">
                <span class="absolute -top-1 -right-1 flex h-4 w-4">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-4 w-4 bg-secondary border-2 border-white"></span>
                </span>
                <i class="fas fa-robot text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
                <span class="ml-2.5 font-bold text-sm hidden md:inline-block pr-1 tracking-wide">AI Saathi</span>
            </button>

            <!-- Chat Window Dialog Box -->
            <div id="chatbot-dialog" class="hidden fixed sm:absolute bottom-0 right-0 sm:bottom-16 sm:right-0 w-full sm:w-[420px] h-[92vh] sm:h-[620px] max-h-[92vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 z-50 transition-all duration-300 transform scale-95 opacity-0">
                
                <!-- Chat Header -->
                <div class="bg-gradient-to-r from-primary via-blue-900 to-primary text-white p-4 flex items-center justify-between shadow-md select-none">
                    <div class="flex items-center space-x-3">
                        <div class="relative w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-inner">
                            <i class="fas fa-robot text-orange-400 text-lg"></i>
                            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-primary rounded-full"></span>
                        </div>
                        <div>
                            <div class="flex items-center space-x-1.5">
                                <h3 class="font-extrabold text-sm tracking-tight text-white">Parivahan AI Saathi</h3>
                                <span class="bg-secondary text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">RAG v2</span>
                            </div>
                            <p class="text-[11px] text-blue-200 flex items-center mt-0.5">
                                <i class="fas fa-user-circle mr-1 text-[10px]"></i>
                                <span id="chat-user-badge" class="truncate max-w-[170px]">Citizen Rajesh</span>
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-1">
                        <button id="chatbot-clear-btn" title="Clear Chat History" class="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition text-xs" aria-label="Clear chat">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button id="chatbot-minimize-btn" title="Minimize Chat" class="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition text-sm" aria-label="Minimize chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Context Status Ribbon -->
                <div class="bg-slate-100 px-3.5 py-1.5 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <div class="flex items-center space-x-1.5 truncate">
                        <i class="fas fa-shield-alt text-emerald-600"></i>
                        <span class="truncate">Context: <strong id="chat-page-context">Dashboard</strong></span>
                    </div>
                    <span class="text-[10px] text-primary font-semibold shrink-0">OpenAI 4o-mini</span>
                </div>

                <!-- Messages Scroll Area -->
                <div id="chatbot-messages" class="flex-grow p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs sm:text-sm">
                    <!-- Dynamic Messages will appear here -->
                </div>

                <!-- Quick Suggestion Chips -->
                <div id="chatbot-chips" class="px-3.5 py-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex space-x-2 scrollbar-none">
                    <button class="chat-chip bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 transition" data-prompt="How to apply for Learner License online?">
                        🚗 Apply Learner's License
                    </button>
                    <button class="chat-chip bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 transition" data-prompt="What is the procedure and fees to transfer RC ownership?">
                        🔄 Transfer RC Ownership
                    </button>
                    <button class="chat-chip bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 transition" data-prompt="What should I do if my Aadhaar Face Auth fails for driving test?">
                        ⚠️ Aadhaar Auth Failing (Alternative Paths)
                    </button>
                    <button class="chat-chip bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 transition" data-prompt="Check pending challan details and how to pay or dispute online">
                        📜 Pay / Dispute eChallan
                    </button>
                    <button class="chat-chip bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 transition" data-prompt="What are my registered vehicle and driving license details?">
                        👤 Remember My Credentials
                    </button>
                </div>

                <!-- Chat Input Form -->
                <form id="chatbot-form" class="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
                    <input type="text" id="chatbot-input" placeholder="Ask about DL, RC, Challans, Rules..." class="flex-grow border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50 focus:bg-white transition" autocomplete="off" required>
                    <button type="submit" id="chatbot-send-btn" class="bg-primary hover:bg-blue-900 text-white rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition flex items-center justify-center shrink-0 min-h-[40px] min-w-[44px]">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(container);
        setupEventListeners();
        renderInitialConversation();
    }

    // ----------------------------------------------------
    // 3. UI Controls & Toggle Logic
    // ----------------------------------------------------
    function toggleChat(open) {
        isOpen = open !== undefined ? open : !isOpen;
        const dialog = document.getElementById('chatbot-dialog');
        const fab = document.getElementById('chatbot-fab');

        if (!dialog) return;

        if (isOpen) {
            dialog.classList.remove('hidden');
            setTimeout(() => {
                dialog.classList.remove('scale-95', 'opacity-0');
                dialog.classList.add('scale-100', 'opacity-100');
                document.getElementById('chatbot-input')?.focus();
                scrollChatToBottom();
            }, 10);
            updateContextRibbon();
        } else {
            dialog.classList.remove('scale-100', 'opacity-100');
            dialog.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                dialog.classList.add('hidden');
            }, 250);
        }
    }

    function updateContextRibbon() {
        const user = getUserContext();
        const page = getPageContext();
        const userBadge = document.getElementById('chat-user-badge');
        const pageBadge = document.getElementById('chat-page-context');

        if (userBadge) userBadge.textContent = `${user.name} (${user.role})`;
        if (pageBadge) pageBadge.textContent = page.serviceId.replace(/-/g, ' ').toUpperCase();
    }

    function setupEventListeners() {
        const fab = document.getElementById('chatbot-fab');
        const minBtn = document.getElementById('chatbot-minimize-btn');
        const clearBtn = document.getElementById('chatbot-clear-btn');
        const form = document.getElementById('chatbot-form');
        const chipsContainer = document.getElementById('chatbot-chips');

        fab?.addEventListener('click', () => toggleChat(true));
        minBtn?.addEventListener('click', () => toggleChat(false));

        clearBtn?.addEventListener('click', () => {
            if (confirm('Clear all conversation history?')) {
                localStorage.removeItem(STORAGE_KEY);
                renderInitialConversation();
            }
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('chatbot-input');
            const text = input.value.trim();
            if (text && !isTyping) {
                input.value = '';
                handleUserMessage(text);
            }
        });

        chipsContainer?.addEventListener('click', (e) => {
            const chip = e.target.closest('.chat-chip');
            if (chip && !isTyping) {
                const prompt = chip.getAttribute('data-prompt');
                if (prompt) {
                    handleUserMessage(prompt);
                }
            }
        });
    }

    // ----------------------------------------------------
    // 4. Message Rendering & History Handling
    // ----------------------------------------------------
    function renderInitialConversation() {
        const history = getChatHistory();
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        container.innerHTML = '';

        if (history.length === 0) {
            const user = getUserContext();
            const welcomeMsg = {
                role: 'assistant',
                content: `Namaste **${user.name}**! 🙏\n\nI am **Parivahan AI Saathi**, your official AI guide for all transport and motor vehicle services in India.\n\nI can assist you with:\n- **Driving License**: Learner test, renewals, ADTT slots, lost DL\n- **Vehicle Registration**: RC transfers, NOC Form 28, hypothecation\n- **eChallan & PUCC**: Instant lookup, fine settlement, virtual courts\n- **Alternative Paths**: Troubleshooting biometric failures, delays, or offline RTO options\n\nHow can I help you today?`
            };
            appendMessageUI(welcomeMsg.role, welcomeMsg.content, false);
        } else {
            history.forEach(msg => {
                appendMessageUI(msg.role, msg.content, false);
            });
        }
        scrollChatToBottom();
    }

    function parseMarkdown(text) {
        if (!text) return '';
        // Escape HTML
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Inline Code
        html = html.replace(/`(.*?)`/g, '<code class="bg-slate-200 px-1 py-0.5 rounded text-primary font-mono text-xs">$1</code>');
        // Bullet points
        html = html.replace(/^\s*-\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>');
        // Numbered lists
        html = html.replace(/^\s*(\d+)\.\s+(.*)$/gm, '<li class="ml-4 list-decimal">$2</li>');
        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-secondary font-bold underline hover:text-orange-700" target="_blank">$1</a>');
        // Line breaks
        html = html.replace(/\n\n/g, '<p class="mt-2"></p>').replace(/\n/g, '<br>');

        return html;
    }

    function appendMessageUI(role, text, animate = true) {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        const isUser = role === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} ${animate ? 'animate-fade-in' : ''}`;

        const bubble = document.createElement('div');
        bubble.className = isUser
            ? 'bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[85%] shadow-sm leading-relaxed'
            : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%] shadow-sm leading-relaxed';

        bubble.innerHTML = isUser ? `<div>${text}</div>` : `
            <div class="flex items-center space-x-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-slate-100">
                <i class="fas fa-robot text-primary"></i>
                <span>Parivahan Saathi</span>
            </div>
            <div class="prose-sm text-slate-700 leading-normal">${parseMarkdown(text)}</div>
        `;

        msgDiv.appendChild(bubble);
        container.appendChild(msgDiv);
        scrollChatToBottom();
    }

    function showTypingIndicator() {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        const ind = document.createElement('div');
        ind.id = 'chat-typing-indicator';
        ind.className = 'flex justify-start';
        ind.innerHTML = `
            <div class="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs flex items-center space-x-1.5">
                <span class="text-xs font-semibold text-primary mr-1"><i class="fas fa-brain animate-pulse"></i> Consulting Knowledge Base</span>
                <span class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
        `;
        container.appendChild(ind);
        scrollChatToBottom();
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('chat-typing-indicator');
        if (ind) ind.remove();
    }

    function scrollChatToBottom() {
        const container = document.getElementById('chatbot-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // ----------------------------------------------------
    // 5. OpenAI API & RAG Execution Engine
    // ----------------------------------------------------
    async function handleUserMessage(userInput) {
        isTyping = true;
        appendMessageUI('user', userInput);

        const history = getChatHistory();
        history.push({ role: 'user', content: userInput });
        saveChatHistory(history);

        showTypingIndicator();

        // 1. Retrieve RAG context
        let retrievedKnowledge = '';
        if (window.ParivahanKnowledgeBase && typeof window.ParivahanKnowledgeBase.findRelevantContext === 'function') {
            const articles = window.ParivahanKnowledgeBase.findRelevantContext(userInput, 3);
            if (articles && articles.length > 0) {
                retrievedKnowledge = articles.map((a, i) => `[Source ${i+1}: ${a.title} - ${a.category}]\n${a.content}\n${a.alternativePath ? 'Alternative Fallback: ' + a.alternativePath : ''}`).join('\n\n');
            }
        }

        // 2. Extract Active User Context & Mock Credentials
        const user = getUserContext();
        const page = getPageContext();

        // 3. Assemble OpenAI System Prompt
        const systemPrompt = `You are "Parivahan AI Saathi", the official AI virtual assistant for the Ministry of Road Transport and Highways (MoRTH), Government of India portal (Parivahan Sewa).

USER CONTEXT:
- Citizen Name: ${user.name}
- Role: ${user.role}
- Email: ${user.email}
- Registered Primary Vehicle Number: ${user.vehicle}
- Registered Driving License Number: ${user.dlNumber}
- Current Portal Page: ${page.serviceId} (${page.title})

DOMAIN KNOWLEDGE (RAG RETRIEVED SOURCES):
${retrievedKnowledge || 'Consult standard Motor Vehicles Act (1988/2019), Central Motor Vehicles Rules (CMVR 1989), Sarathi 4.0, and Vahan 4.0 guidelines.'}

CRITICAL OPERATIONAL GUIDELINES:
1. Tone & Persona: Courteous, official, empowering, and extremely clear Indian Government representative. Use "Namaste" or polite citizen address.
2. Memory: Remember and acknowledge the citizen's credentials (${user.name}, Vehicle ${user.vehicle}, DL ${user.dlNumber}) when relevant to their questions.
3. Structured Steps: Always format instructions into numbered steps with relevant Form numbers (e.g. Form 1, Form 29, Form 30, Form 28).
4. Alternative Path Guidance (IMPORTANT): Whenever a citizen expresses difficulties, confusion, failed biometrics, lost documents, or RTO delays, ALWAYS provide an official alternative or fallback path (e.g., non-Aadhaar offline booking, DigiLocker verified copies, Lok Adalat fine waivers, CPGRAMS grievance escalation).
5. Brevity & Quality: Keep answers focused, neatly formatted in markdown with bullet points, and avoid unnecessary verbosity.`;

        // 4. Assemble OpenAI Messages Array
        const messagesPayload = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-8) // Send recent multi-turn context
        ];

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: OPENAI_MODEL,
                    messages: messagesPayload,
                    temperature: 0.4,
                    max_tokens: 650
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error('OpenAI API Error:', errData);
                throw new Error(errData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

            removeTypingIndicator();
            appendMessageUI('assistant', reply);

            history.push({ role: 'assistant', content: reply });
            saveChatHistory(history);
        } catch (error) {
            console.warn('Falling back to local RAG expert engine:', error);
            removeTypingIndicator();

            // Intelligent Local RAG Fallback in case of API limits / offline mode
            const fallbackReply = generateLocalFallback(userInput, user, retrievedKnowledge);
            appendMessageUI('assistant', fallbackReply);

            history.push({ role: 'assistant', content: fallbackReply });
            saveChatHistory(history);
        } finally {
            isTyping = false;
        }
    }

    // ----------------------------------------------------
    // 6. Intelligent Local RAG Fallback Engine
    // ----------------------------------------------------
    function generateLocalFallback(query, user, retrievedKnowledge) {
        const q = query.toLowerCase();

        if (q.includes('remember') || q.includes('my detail') || q.includes('my vehicle') || q.includes('my dl') || q.includes('who am i')) {
            return `Namaste **${user.name}**! Here are your profile credentials currently remembered in this session:\n\n- **Name**: ${user.name}\n- **Role**: ${user.role}\n- **Primary Vehicle**: \`${user.vehicle}\`\n- **Driving License**: \`${user.dlNumber}\`\n- **Email**: ${user.email}\n\nYou can use these credentials in any search box or application form across the Parivahan portal.`;
        }

        if (q.includes('learner') || q.includes('apply dl') || q.includes('driving license')) {
            return `### How to Apply for Learner's License (LL)\n\n1. **Aadhaar Authentication**: Apply 100% contactless through Aadhaar face authentication without RTO visit.\n2. **Documents**: Form 1 (Self Medical Declaration) and proof of address.\n3. **Online Test**: 15 road safety questions (Pass score: 9/15).\n4. **Fee**: Rs 200 total (Test + Form fee).\n\n💡 **Alternative Path**: If Aadhaar face/OTP verification fails, select *'Apply without Aadhaar'* on the Sarathi portal to book a physical appointment at your local RTO within 3 working days.`;
        }

        if (q.includes('transfer') || q.includes('sell') || q.includes('buy') || q.includes('ownership')) {
            return `### Vehicle RC Ownership Transfer Steps\n\n1. **Within Same State**: Submit **Form 29** (Notice of Transfer) and **Form 30** (Application for Transfer) along with valid Insurance & PUCC. Fee: Rs 300 - Rs 500.\n2. **Inter-State Transfer**: Obtain **Form 28 (NOC)** from source RTO, then submit in destination RTO with state road tax within 30 days.\n\n💡 **Alternative Path**: If the seller is unresponsive, submit the physical sale deed with notarized Form 29/30 counterfoil to the RTO for legal dispute resolution.`;
        }

        if (q.includes('challan') || q.includes('fine') || q.includes('dispute') || q.includes('court')) {
            return `### eChallan Payment & Dispute Options\n\n- **Instant Payment**: Pay online via UPI, Net Banking, or Card on the Parivahan eChallan portal to get digital receipt Form TR-5.\n- **Virtual Court**: For compounding offenses (Speeding, Red Light), plead guilty to pay discounted fines online or transfer to regular court.\n\n💡 **Alternative Path**: You can attend the upcoming **National Lok Adalat** to request a 50% to 70% settlement waiver on pending traffic fines.`;
        }

        if (retrievedKnowledge) {
            return `Namaste **${user.name}**! Based on Parivahan official records:\n\n${retrievedKnowledge}\n\n💡 *Need further assistance? You can also contact the National Transport Helpdesk at 0120-4925555.*`;
        }

        return `Namaste **${user.name}**! I am here to guide you on all Parivahan Sewa services (Driving License, RC Transfer, eChallans, PUCC, and Commercial Permits).\n\nCould you please specify your requirement or query, or click one of the quick suggestions below?`;
    }

    // ----------------------------------------------------
    // 7. Auto-Mount on Document Load
    // ----------------------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbotUI);
    } else {
        injectChatbotUI();
    }

    // Expose for external controls if needed
    window.ParivahanChatbot = {
        open: () => toggleChat(true),
        close: () => toggleChat(false),
        ask: (prompt) => {
            toggleChat(true);
            handleUserMessage(prompt);
        }
    };
})();
