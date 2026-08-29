/**
 * Parivahan Sewa - Core Client-Side Logic
 * Coordinates Search, Test Credentials, Dynamic Service Pages, and User Sessions.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ====================================================
    // 1. User Session & Login Header State
    // ====================================================
    function setupUserSession() {
        const userStr = localStorage.getItem('mockUser');
        const loginBtn = document.getElementById('unifiedLoginBtn');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');

        if (userStr) {
            let userData;
            try {
                userData = JSON.parse(userStr);
            } catch (e) {
                userData = { name: 'Citizen User', role: 'Citizen' };
            }

            const initial = (userData.name || 'C').charAt(0).toUpperCase();

            // Desktop Header
            if (loginBtn) {
                const profileContainer = document.createElement('div');
                profileContainer.className = 'flex items-center space-x-2 bg-slate-800 border border-slate-600 rounded-full pl-1.5 pr-3 py-1 text-white shadow-xs';
                profileContainer.innerHTML = `
                    <div class="w-6 h-6 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-xs shadow-inner">
                        ${initial}
                    </div>
                    <span class="text-xs font-bold truncate max-w-[120px] text-gray-100">${userData.name}</span>
                    <button id="logoutBtn" title="Logout" class="text-gray-400 hover:text-red-400 ml-1.5 text-xs transition" aria-label="Logout">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                `;
                loginBtn.replaceWith(profileContainer);

                document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('mockUser');
                    window.location.reload();
                });
            }

            // Mobile Header
            if (mobileLoginBtn) {
                mobileLoginBtn.innerHTML = `
                    <i class="fas fa-user-check"></i>
                    <span>Logged In: ${userData.name}</span>
                `;
                mobileLoginBtn.classList.remove('bg-secondary');
                mobileLoginBtn.classList.add('bg-primary');

                const mobileLogout = document.createElement('button');
                mobileLogout.className = 'w-full bg-red-50 text-red-700 font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 mt-2 border border-red-200 text-xs';
                mobileLogout.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Sign Out</span>';
                mobileLogout.addEventListener('click', () => {
                    localStorage.removeItem('mockUser');
                    window.location.reload();
                });
                mobileLoginBtn.parentElement?.appendChild(mobileLogout);
            }
        }
    }

    setupUserSession();

    // ====================================================
    // 2. Google Sign-In Mock Handler (on login page)
    // ====================================================
    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const citizenUser = window.ParivahanMockData?.personas?.[0] || {
                id: 'citizen',
                name: 'Rajesh Kumar',
                email: 'rajesh.kumar@citizen.nic.in',
                role: 'Citizen User',
                primaryVehicle: 'DL01AB1234',
                primaryDL: 'DL-1420110012345'
            };
            localStorage.setItem('mockUser', JSON.stringify(citizenUser));
            window.location.href = 'index.html';
        });
    }

    // ====================================================
    // 3. Homepage Search Tabs & Quick Test Data Pills
    // ====================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('searchInput');
    const searchActionBtn = document.getElementById('searchActionBtn');
    const searchForm = document.getElementById('searchForm');
    const searchResultBox = document.getElementById('searchResultBox');

    const tabConfig = {
        'rc': {
            placeholder: 'Enter Vehicle Registration Number (e.g., DL01AB1234)',
            btnText: 'Check Vehicle RC',
            ariaLabel: 'Vehicle RC Search Input'
        },
        'dl': {
            placeholder: 'Enter Driving License Number (e.g., DL-1420110012345)',
            btnText: 'Track Driving License',
            ariaLabel: 'Driving License Search Input'
        },
        'echallan': {
            placeholder: 'Enter Challan Number / Vehicle Number (e.g., CH-2024-88391)',
            btnText: 'Pay / Track eChallan',
            ariaLabel: 'eChallan Search Input'
        }
    };

    let currentTab = 'rc';

    function switchSearchTab(tabKey) {
        currentTab = tabKey;
        tabBtns.forEach(b => {
            const isMatch = b.getAttribute('data-tab') === tabKey;
            b.classList.toggle('text-primary', isMatch);
            b.classList.toggle('border-b-2', isMatch);
            b.classList.toggle('border-primary', isMatch);
            b.classList.toggle('bg-blue-50', isMatch);
            b.classList.toggle('font-bold', isMatch);
            b.classList.toggle('text-gray-600', !isMatch);
            b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        if (searchInput && tabConfig[tabKey]) {
            searchInput.placeholder = tabConfig[tabKey].placeholder;
            searchInput.setAttribute('aria-label', tabConfig[tabKey].ariaLabel);
        }
        if (searchActionBtn && tabConfig[tabKey]) {
            searchActionBtn.innerHTML = `<i class="fas fa-search mr-1.5"></i><span>${tabConfig[tabKey].btnText}</span>`;
        }
        if (searchResultBox) {
            searchResultBox.classList.add('hidden');
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchSearchTab(btn.getAttribute('data-tab'));
        });
    });

    // Quick Fill 1-Click Test Data Pills
    document.querySelectorAll('.quick-fill-btn').forEach(pill => {
        pill.addEventListener('click', () => {
            const fillVal = pill.getAttribute('data-fill');
            const targetTab = pill.getAttribute('data-tab');

            if (targetTab) switchSearchTab(targetTab);
            if (searchInput && fillVal) {
                searchInput.value = fillVal;
                // Auto trigger submit
                searchForm?.dispatchEvent(new Event('submit'));
            }
        });
    });

    // Handle Search Form Submission
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim().toUpperCase();
            if (!query) return;

            renderSearchResult(currentTab, query);
        });
    }

    function renderSearchResult(tab, query) {
        if (!searchResultBox) return;

        searchResultBox.innerHTML = '';
        searchResultBox.classList.remove('hidden');

        if (tab === 'rc') {
            const v = window.ParivahanMockData?.vehicles?.[query] || {
                rcNumber: query,
                ownerName: 'Verified Transport Citizen',
                makerModel: 'Maruti Suzuki Dzire (Petrol)',
                vehicleClass: 'Motor Car (LMV - Private)',
                registrationDate: '12-Jan-2022',
                fitnessValidUpto: '11-Jan-2037 (Valid)',
                insuranceValidUpto: '08-Jan-2027 (Active)',
                puccValidUpto: '15-Dec-2026 (Valid)',
                status: 'Active & Clean',
                rtoOffice: 'RTO Mall Road (DL-01)'
            };

            searchResultBox.innerHTML = `
                <div class="mt-6 p-5 sm:p-6 bg-gradient-to-br from-blue-50/90 to-slate-50 border-2 border-blue-200 rounded-2xl shadow-md animate-fade-in text-slate-800">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-blue-200 gap-2">
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="bg-primary text-white text-xs font-extrabold px-2.5 py-1 rounded tracking-widest">${v.rcNumber}</span>
                                <span class="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center">
                                    <i class="fas fa-check-circle mr-1"></i> ${v.status}
                                </span>
                            </div>
                            <h3 class="font-bold text-lg text-primary mt-1">${v.makerModel}</h3>
                        </div>
                        <a href="service.html?id=transfer-ownership&rc=${v.rcNumber}" class="bg-secondary hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-exchange-alt"></i>
                            <span>Transfer / Manage RC</span>
                        </a>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-4 text-xs">
                        <div class="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                            <span class="text-gray-500 block">Registered Owner</span>
                            <strong class="text-gray-800 text-sm">${v.ownerName}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                            <span class="text-gray-500 block">Vehicle Class</span>
                            <strong class="text-gray-800 text-sm">${v.vehicleClass}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                            <span class="text-gray-500 block">RTO Authority</span>
                            <strong class="text-gray-800 text-sm">${v.rtoOffice || 'Delhi RTO'}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                            <span class="text-gray-500 block">Fitness Validity</span>
                            <strong class="text-emerald-700 text-sm">${v.fitnessValidUpto}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                            <span class="text-gray-500 block">Insurance Status</span>
                            <strong class="text-emerald-700 text-sm">${v.insuranceValidUpto}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                            <span class="text-gray-500 block">PUCC Validity</span>
                            <strong class="${v.puccValidUpto.includes('Expired') ? 'text-red-600' : 'text-emerald-700'} text-sm">${v.puccValidUpto}</strong>
                        </div>
                    </div>
                </div>
            `;
        } else if (tab === 'dl') {
            const dl = window.ParivahanMockData?.licenses?.[query] || {
                dlNumber: query,
                holderName: 'Rajesh Kumar',
                dob: '12-Aug-1991',
                bloodGroup: 'B+',
                cov: 'LMV, MCWG (Car & Motorcycle)',
                issueDate: '25-Jan-2011',
                validUpto: '11-Aug-2035 (Valid)',
                status: 'Active',
                rtoJurisdiction: 'RTO Janakpuri, West Delhi (DL-14)'
            };

            searchResultBox.innerHTML = `
                <div class="mt-6 p-5 sm:p-6 bg-gradient-to-br from-indigo-50/90 to-slate-50 border-2 border-indigo-200 rounded-2xl shadow-md animate-fade-in text-slate-800">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-indigo-200 gap-2">
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="bg-indigo-900 text-white text-xs font-extrabold px-2.5 py-1 rounded tracking-widest">${dl.dlNumber}</span>
                                <span class="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center">
                                    <i class="fas fa-id-card mr-1"></i> ${dl.status}
                                </span>
                            </div>
                            <h3 class="font-bold text-lg text-indigo-950 mt-1">${dl.holderName}</h3>
                        </div>
                        <a href="service.html?id=renew-license&dl=${dl.dlNumber}" class="bg-primary hover:bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-redo"></i>
                            <span>Renew / Update License</span>
                        </a>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-4 text-xs">
                        <div class="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                            <span class="text-gray-500 block">Class of Vehicle (COV)</span>
                            <strong class="text-gray-800 text-sm">${dl.cov}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                            <span class="text-gray-500 block">Blood Group & DOB</span>
                            <strong class="text-gray-800 text-sm">${dl.bloodGroup} | ${dl.dob}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                            <span class="text-gray-500 block">Validity Upto</span>
                            <strong class="text-emerald-700 text-sm">${dl.validUpto}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                            <span class="text-gray-500 block">Jurisdiction</span>
                            <strong class="text-gray-800 text-sm">${dl.rtoJurisdiction}</strong>
                        </div>
                    </div>
                </div>
            `;
        } else if (tab === 'echallan') {
            const ch = window.ParivahanMockData?.challans?.[query] || {
                challanNumber: query.startsWith('CH-') ? query : `CH-2024-${Math.floor(10000 + Math.random() * 90000)}`,
                vehicleNumber: query.startsWith('CH-') ? 'DL01AB1234' : query,
                ownerName: 'Rajesh Kumar',
                offense: 'Exceeding Speed Limit (Sec 183 MV Act)',
                offenseLocation: 'Outer Ring Road, Delhi',
                offenseDate: '24-Aug-2026 11:42 AM',
                penaltyAmount: 2000,
                status: 'Pending Payment',
                courtDisposition: 'Eligible for Virtual Court settlement'
            };

            searchResultBox.innerHTML = `
                <div class="mt-6 p-5 sm:p-6 bg-gradient-to-br from-amber-50/90 to-slate-50 border-2 border-amber-300 rounded-2xl shadow-md animate-fade-in text-slate-800">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-amber-200 gap-2">
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="bg-amber-900 text-white text-xs font-extrabold px-2.5 py-1 rounded tracking-widest">${ch.challanNumber}</span>
                                <span class="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                    <i class="fas fa-clock mr-1"></i> ${ch.status}
                                </span>
                            </div>
                            <h3 class="font-bold text-base text-gray-900 mt-1">${ch.offense}</h3>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-gray-500 block">Fine Amount</span>
                            <span class="text-2xl font-black text-secondary">₹${ch.penaltyAmount}</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4 text-xs">
                        <div class="bg-white p-3 rounded-xl border border-amber-200">
                            <span class="text-gray-500 block">Vehicle Reg. No</span>
                            <strong class="text-gray-800">${ch.vehicleNumber}</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-amber-200">
                            <span class="text-gray-500 block">Location & Timestamp</span>
                            <strong class="text-gray-800">${ch.offenseLocation} (${ch.offenseDate})</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-amber-200">
                            <span class="text-gray-500 block">Virtual Court Settlement</span>
                            <strong class="text-emerald-700">${ch.courtDisposition}</strong>
                        </div>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-amber-200">
                        <a href="service.html?id=pay-echallan&challan=${ch.challanNumber}" class="bg-secondary hover:bg-orange-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-md flex items-center space-x-1.5">
                            <i class="fas fa-credit-card"></i>
                            <span>Pay ₹${ch.penaltyAmount} Online Now</span>
                        </a>
                    </div>
                </div>
            `;
        }
    }

    // ====================================================
    // 4. Dynamic Service Page Rendering Engine (service.html)
    // ====================================================
    const dynamicRoot = document.getElementById('service-dynamic-root');
    if (dynamicRoot) {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceId = (urlParams.get('id') || 'directory').toLowerCase();
        const breadcrumbEl = document.getElementById('breadcrumbService');

        renderServiceView(serviceId, dynamicRoot, breadcrumbEl);
    }

    function renderServiceView(id, container, breadcrumb) {
        // Map common aliases
        if (id.includes('learner') || id.includes('driving-license') || id.includes('apply-dl')) {
            if (breadcrumb) breadcrumb.textContent = "Apply for Learner's Driving License (Sarathi)";
            container.innerHTML = renderLearnerLicenseModule();
            attachLearnerLicenseLogic();
        } else if (id.includes('transfer') || id.includes('ownership') || id.includes('change-address')) {
            if (breadcrumb) breadcrumb.textContent = "Transfer Vehicle RC Ownership / Address Change";
            container.innerHTML = renderTransferRCModule();
            attachTransferRCLogic();
        } else if (id.includes('echallan') || id.includes('pay-echallan') || id.includes('fines')) {
            if (breadcrumb) breadcrumb.textContent = "eChallan Digital Settlement & Payment Gateway";
            container.innerHTML = renderEChallanModule();
            attachEChallanLogic();
        } else if (id.includes('pucc') || id.includes('pollution')) {
            if (breadcrumb) breadcrumb.textContent = "Pollution Under Control (PUCC) Digital Validation";
            container.innerHTML = renderPUCCModule();
        } else if (id.includes('fancy') || id.includes('choice')) {
            if (breadcrumb) breadcrumb.textContent = "Fancy & Choice Registration Number E-Auction";
            container.innerHTML = renderFancyNumberModule();
            attachFancyNumberLogic();
        } else if (id.includes('permit') || id.includes('commercial') || id.includes('fitness')) {
            if (breadcrumb) breadcrumb.textContent = "Commercial Vehicle Transport & National Permits";
            container.innerHTML = renderCommercialPermitsModule();
        } else {
            // Default Comprehensive Directory
            if (breadcrumb) breadcrumb.textContent = "Parivahan Citizen Service Directory & Hub";
            container.innerHTML = renderServiceDirectory();
        }
    }

    // ----------------------------------------------------
    // Service Module 1: Learner License Application
    // ----------------------------------------------------
    function renderLearnerLicenseModule() {
        return `
            <div class="space-y-8 animate-fade-in">
                <!-- Header Banner -->
                <div class="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span class="bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Contactless Sarathi 4.0</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold mt-1">Apply for Learner's License (LL)</h1>
                        <p class="text-blue-200 text-xs sm:text-sm mt-1 max-w-xl">Complete your application, Aadhaar face authentication, and online road safety test from home.</p>
                    </div>
                    <button id="fillTestApplicantBtn" class="bg-white/10 hover:bg-white text-white hover:text-primary border border-white/30 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2">
                        <i class="fas fa-bolt text-yellow-300"></i>
                        <span>⚡ Fill Test Applicant (Rajesh Kumar)</span>
                    </button>
                </div>

                <!-- 4-Step Progress Ribbon -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-center">
                    <div class="p-3 bg-blue-50 border-2 border-primary text-primary rounded-xl shadow-xs flex items-center justify-center space-x-2">
                        <span class="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                        <span>Aadhaar e-KYC</span>
                    </div>
                    <div class="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl flex items-center justify-center space-x-2">
                        <span class="w-5 h-5 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[10px]">2</span>
                        <span>Applicant Details</span>
                    </div>
                    <div class="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl flex items-center justify-center space-x-2">
                        <span class="w-5 h-5 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[10px]">3</span>
                        <span>Road Safety Test</span>
                    </div>
                    <div class="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl flex items-center justify-center space-x-2">
                        <span class="w-5 h-5 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[10px]">4</span>
                        <span>Instant LL Download</span>
                    </div>
                </div>

                <!-- Main Interactive Application Form -->
                <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm" id="ll-step-container">
                    <h2 class="text-xl font-bold text-primary mb-4 flex items-center">
                        <i class="fas fa-fingerprint text-secondary mr-2.5"></i>
                        <span>Step 1: Contactless Aadhaar Face / OTP Verification</span>
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Applicant Aadhaar Number / Virtual ID</label>
                                <input type="text" id="llAadhaarInput" value="XXXX-XXXX-8921" class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-slate-50 font-mono focus:ring-2 focus:ring-primary">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">State & Jurisdictional RTO</label>
                                <select class="w-full border border-gray-300 rounded-lg p-3 text-sm bg-slate-50">
                                    <option>DL-01: Mall Road RTO, North Delhi</option>
                                    <option>MH-02: Andheri RTO, Mumbai</option>
                                    <option>KA-05: Jayanagar RTO, Bengaluru</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Vehicle Category</label>
                                <div class="space-y-2 text-xs">
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked class="rounded text-primary">
                                        <span>Light Motor Vehicle (LMV) - Motor Car / Jeep</span>
                                    </label>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked class="rounded text-primary">
                                        <span>Motorcycle with Gear (MCWG)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Face Auth Camera Simulation Box -->
                        <div class="bg-slate-900 rounded-2xl p-6 text-center text-white space-y-4 border border-slate-700">
                            <div class="w-24 h-24 mx-auto rounded-full border-4 border-emerald-400 flex items-center justify-center bg-slate-800 relative">
                                <i class="fas fa-user text-4xl text-gray-300"></i>
                                <span class="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping"></span>
                            </div>
                            <div>
                                <strong class="text-sm block font-bold text-emerald-400">Face Recognition Verified (AI Liveness 99.4%)</strong>
                                <p class="text-[11px] text-gray-400 mt-0.5">Matched against UIDAI National Identity Database</p>
                            </div>
                            <button id="startLLTestBtn" class="w-full bg-secondary hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2 text-sm">
                                <span>Proceed to Road Safety Mock Exam (15 Qs)</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div id="ll-test-result-box" class="hidden"></div>
            </div>
        `;
    }

    function attachLearnerLicenseLogic() {
        document.getElementById('fillTestApplicantBtn')?.addEventListener('click', () => {
            const aadhaar = document.getElementById('llAadhaarInput');
            if (aadhaar) aadhaar.value = '9821-4450-8921';
            alert('Filled test data for Rajesh Kumar (DOB: 12-Aug-1991, Class: LMV/MCWG).');
        });

        document.getElementById('startLLTestBtn')?.addEventListener('click', () => {
            const box = document.getElementById('ll-test-result-box');
            if (!box) return;

            box.innerHTML = `
                <div class="bg-green-50 border-2 border-green-300 rounded-2xl p-6 text-green-900 animate-fade-in shadow-md">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-green-200 gap-3">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-emerald-950">Test Passed! Score: 14/15 (93%)</h3>
                                <p class="text-xs text-emerald-700">Congratulations! Provisional Learner's License generated successfully.</p>
                            </div>
                        </div>
                        <span class="bg-emerald-200 text-emerald-900 text-xs font-mono font-bold px-3 py-1.5 rounded-lg">LL No: DL-01/LL/2026/0091244</span>
                    </div>

                    <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div class="bg-white p-3 rounded-xl border border-green-200">
                            <span class="text-gray-500 block">Applicant Name</span>
                            <strong>Rajesh Kumar</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-green-200">
                            <span class="text-gray-500 block">Validity Period</span>
                            <strong class="text-emerald-800">29-Aug-2026 to 28-Feb-2027 (6 Months)</strong>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-green-200">
                            <span class="text-gray-500 block">Eligible for Permanent DL Test</span>
                            <strong>After 29-Sep-2026 (30 Days)</strong>
                        </div>
                    </div>

                    <div class="mt-5 flex flex-wrap items-center justify-end gap-3">
                        <button onclick="alert('Downloading official digitally signed Form 3 Learner License PDF...')" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-download"></i>
                            <span>Download Digitally Signed Form 3 LL (PDF)</span>
                        </button>
                    </div>
                </div>
            `;
            box.classList.remove('hidden');
            box.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ----------------------------------------------------
    // Service Module 2: RC Ownership Transfer
    // ----------------------------------------------------
    function renderTransferRCModule() {
        return `
            <div class="space-y-8 animate-fade-in">
                <div class="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span class="bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Vahan 4.0 Online</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold mt-1">Transfer of Vehicle Ownership (RC)</h1>
                        <p class="text-blue-200 text-xs sm:text-sm mt-1 max-w-xl">Generate Form 29 & Form 30 with contactless Aadhaar verification between Seller and Buyer.</p>
                    </div>
                    <button id="fillTestRCBtn" class="bg-white/10 hover:bg-white text-white hover:text-primary border border-white/30 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2">
                        <i class="fas fa-bolt text-yellow-300"></i>
                        <span>⚡ Fill Test Vehicle (DL01AB1234)</span>
                    </button>
                </div>

                <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                    <form id="transferRCForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Vehicle Registration No</label>
                                <input type="text" id="trVehicleNo" value="DL01AB1234" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-slate-50 font-mono font-bold" required>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Chassis Number (Last 5 Digits)</label>
                                <input type="text" id="trChassisNo" value="98421" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-slate-50 font-mono font-bold" required>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Transfer Type</label>
                                <select class="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-slate-50 font-bold">
                                    <option>Normal Sale / Purchase (Within State)</option>
                                    <option>Inter-State Transfer with NOC (Form 28)</option>
                                    <option>Death of Owner (Succession)</option>
                                </select>
                            </div>
                        </div>

                        <div class="border-t border-gray-200 pt-5">
                            <h3 class="text-sm font-extrabold text-primary mb-3">Buyer (Transferee) Details</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <label class="block font-bold text-gray-700 mb-1">Buyer Full Name</label>
                                    <input type="text" value="Priya Deshmukh" class="w-full border border-gray-300 rounded-lg p-2.5 bg-slate-50">
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-1">Buyer Aadhaar / Mobile</label>
                                    <input type="text" value="9876543299" class="w-full border border-gray-300 rounded-lg p-2.5 bg-slate-50">
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-1">Prescribed Fee</label>
                                    <div class="p-2.5 bg-blue-50 font-bold text-primary rounded-lg border border-blue-200">
                                        ₹530 (Transfer ₹300 + Smart Card ₹230)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-secondary hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2 text-sm">
                            <i class="fas fa-file-signature"></i>
                            <span>Generate Dual-Party Form 29/30 & Submit to RTO</span>
                        </button>
                    </form>

                    <div id="transferRCResult" class="hidden mt-6"></div>
                </div>
            </div>
        `;
    }

    function attachTransferRCLogic() {
        document.getElementById('fillTestRCBtn')?.addEventListener('click', () => {
            alert('Filled test vehicle credentials for DL01AB1234 (Hyundai Creta).');
        });

        document.getElementById('transferRCForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const res = document.getElementById('transferRCResult');
            if (!res) return;

            res.innerHTML = `
                <div class="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-900 animate-fade-in shadow-xs">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-check-circle text-2xl text-emerald-600"></i>
                        <div>
                            <strong class="text-base font-extrabold text-emerald-950">Application Submitted to Mall Road RTO (DL-01)!</strong>
                            <p class="text-xs text-emerald-800 mt-0.5">Application Ref No: <strong>APPL-RC-2026-99412</strong>. Both parties have verified via Aadhaar OTP.</p>
                        </div>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        });
    }

    // ----------------------------------------------------
    // Service Module 3: eChallan Payment Portal
    // ----------------------------------------------------
    function renderEChallanModule() {
        return `
            <div class="space-y-8 animate-fade-in">
                <div class="bg-gradient-to-r from-amber-700 to-orange-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span class="bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">MoRTH Virtual Court</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold mt-1">eChallan Settlement & Fine Payment</h1>
                        <p class="text-amber-200 text-xs sm:text-sm mt-1 max-w-xl">Search pending traffic violations and clear fines with instant digital receipt Form TR-5.</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">Active Challans: <strong>2 Pending</strong></span>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                    <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-receipt text-secondary mr-2"></i>
                        <span>Pending Traffic Challans on Record</span>
                    </h2>

                    <div class="space-y-4" id="challan-list-container">
                        <!-- Challan 1 -->
                        <div class="p-5 border-2 border-amber-200 bg-amber-50/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="space-y-1">
                                <div class="flex items-center space-x-2">
                                    <span class="bg-amber-900 text-white text-xs font-mono font-bold px-2 py-0.5 rounded">CH-2024-88391</span>
                                    <span class="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">Speed Violation (Sec 183)</span>
                                </div>
                                <h3 class="font-bold text-gray-800 text-sm">Outer Ring Road near Munirka Flyover, Delhi</h3>
                                <p class="text-xs text-gray-500">Vehicle: <strong>DL01AB1234</strong> | Date: 24-Aug-2026 11:42 AM (84 km/h in 60 km/h camera zone)</p>
                            </div>
                            <div class="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                                <span class="text-xl font-black text-secondary">₹2,000</span>
                                <button class="pay-challan-btn bg-secondary hover:bg-orange-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5" data-challan="CH-2024-88391" data-amt="2000">
                                    <i class="fas fa-credit-card"></i>
                                    <span>Pay Fine Online</span>
                                </button>
                            </div>
                        </div>

                        <!-- Challan 2 -->
                        <div class="p-5 border-2 border-red-200 bg-red-50/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div class="space-y-1">
                                <div class="flex items-center space-x-2">
                                    <span class="bg-red-900 text-white text-xs font-mono font-bold px-2 py-0.5 rounded">CH-2024-91024</span>
                                    <span class="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">Expired PUCC (Sec 190(2))</span>
                                </div>
                                <h3 class="font-bold text-gray-800 text-sm">NH-48 Kherki Daula Toll, Gurugram</h3>
                                <p class="text-xs text-gray-500">Vehicle: <strong>HR26DK8899</strong> | Date: 27-Aug-2026 09:15 AM</p>
                            </div>
                            <div class="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                                <span class="text-xl font-black text-secondary">₹10,000</span>
                                <button class="pay-challan-btn bg-secondary hover:bg-orange-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5" data-challan="CH-2024-91024" data-amt="10000">
                                    <i class="fas fa-credit-card"></i>
                                    <span>Pay Fine Online</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Success Modal Target -->
                <div id="paymentReceiptModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div class="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-4 animate-fade-in">
                        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                            <i class="fas fa-check"></i>
                        </div>
                        <h3 class="text-xl font-black text-gray-900">Payment Successful!</h3>
                        <p class="text-xs text-gray-600">Your traffic violation has been cleared on the National Vahan & Sarathi network.</p>
                        <div class="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 text-left border border-slate-200">
                            <div class="flex justify-between"><span>Receipt No:</span><strong class="font-mono" id="rcptNo">RCPT-2026-991244</strong></div>
                            <div class="flex justify-between"><span>Payment Mode:</span><strong>UPI / Bharat BillPay</strong></div>
                            <div class="flex justify-between"><span>Status:</span><strong class="text-emerald-700 font-bold">DISPOSED & CLOSED</strong></div>
                        </div>
                        <button id="closeReceiptBtn" class="w-full bg-primary hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition">
                            Close & Return
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function attachEChallanLogic() {
        const modal = document.getElementById('paymentReceiptModal');
        const closeBtn = document.getElementById('closeReceiptBtn');

        document.querySelectorAll('.pay-challan-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const challanId = btn.getAttribute('data-challan');
                const amt = btn.getAttribute('data-amt');

                if (confirm(`Proceed to pay ₹${amt} for Challan ${challanId} via Unified Government Payment Gateway?`)) {
                    document.getElementById('rcptNo').textContent = `RCPT-DL-${Math.floor(100000 + Math.random() * 900000)}`;
                    modal?.classList.remove('hidden');

                    // Change card status
                    const parentCard = btn.closest('.p-5');
                    if (parentCard) {
                        parentCard.classList.remove('bg-amber-50/50', 'border-amber-200', 'bg-red-50/50', 'border-red-200');
                        parentCard.classList.add('bg-emerald-50/50', 'border-emerald-200');
                        btn.replaceWith(document.createRange().createContextualFragment('<span class="text-emerald-700 font-bold text-xs"><i class="fas fa-check-double mr-1"></i> Paid & Disposed</span>'));
                    }
                }
            });
        });

        closeBtn?.addEventListener('click', () => {
            modal?.classList.add('hidden');
        });
    }

    // ----------------------------------------------------
    // Service Module 4: PUCC Status
    // ----------------------------------------------------
    function renderPUCCModule() {
        return `
            <div class="space-y-8 animate-fade-in">
                <div class="bg-gradient-to-r from-emerald-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
                    <span class="bg-emerald-400 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">CMVR Rule 115</span>
                    <h1 class="text-2xl sm:text-3xl font-extrabold mt-1">Pollution Under Control Certificate (PUCC)</h1>
                    <p class="text-emerald-200 text-xs sm:text-sm mt-1 max-w-xl">Real-time emission certificate lookup linked directly with testing center smoke analyzers.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                        <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                            <span class="font-mono font-bold text-primary text-base">DL01AB1234 (Hyundai Creta)</span>
                            <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full"><i class="fas fa-check mr-1"></i> Valid</span>
                        </div>
                        <div class="text-xs space-y-2 text-gray-600">
                            <p><strong>Fuel Standard:</strong> BS-VI Petrol</p>
                            <p><strong>Carbon Monoxide (CO):</strong> 0.08% (Prescribed Limit: 0.3%)</p>
                            <p><strong>Hydrocarbons (HC):</strong> 84 ppm (Prescribed Limit: 200 ppm)</p>
                            <p><strong>Valid Upto:</strong> <strong class="text-emerald-700">18-Oct-2026</strong></p>
                        </div>
                        <button onclick="alert('Downloading Green Emission Certificate PDF...')" class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center space-x-1.5">
                            <i class="fas fa-file-pdf"></i>
                            <span>Download Digital PUCC Certificate</span>
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                        <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                            <span class="font-mono font-bold text-orange-800 text-base">HR26DK8899 (Commercial Tipper)</span>
                            <span class="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full"><i class="fas fa-exclamation-triangle mr-1"></i> Expired</span>
                        </div>
                        <div class="text-xs space-y-2 text-gray-600">
                            <p><strong>Fuel Standard:</strong> BS-VI Diesel Commercial</p>
                            <p><strong>Last Test Date:</strong> 13-Mar-2025</p>
                            <p><strong>Valid Upto:</strong> <strong class="text-red-600">12-Mar-2026 (Expired by 170 days)</strong></p>
                            <p class="text-red-700 font-semibold">Penalty Notice: Vehicle liable for ₹10,000 fine under Sec 190(2).</p>
                        </div>
                        <a href="service.html?id=faqs-helpdesk" class="w-full bg-secondary hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center space-x-1.5">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Find Nearest Authorized Testing Station</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // ----------------------------------------------------
    // Service Module 5: Fancy Number E-Auction
    // ----------------------------------------------------
    function renderFancyNumberModule() {
        return `
            <div class="space-y-8 animate-fade-in">
                <div class="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
                    <span class="bg-yellow-400 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Vahan E-Auction Portal</span>
                    <h1 class="text-2xl sm:text-3xl font-extrabold mt-1">Fancy & Choice Registration Numbers</h1>
                    <p class="text-purple-200 text-xs sm:text-sm mt-1 max-w-xl">Bid in open transparent electronic auctions for VIP numbers (0001, 0786, 9999) or book choice numbers.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <!-- Plate 1 -->
                    <div class="bg-white rounded-2xl border-2 border-yellow-300 p-5 shadow-sm space-y-3 text-center">
                        <div class="bg-yellow-400/20 border border-yellow-400 py-3 rounded-xl font-mono text-2xl font-black text-slate-900 tracking-widest">
                            DL 01 AA 0001
                        </div>
                        <div class="text-xs text-gray-500">
                            <span class="block">Category 1 (Super VIP)</span>
                            <span class="text-primary font-bold text-sm">Current Bid: ₹8,50,000</span>
                        </div>
                        <button class="bid-btn w-full bg-primary hover:bg-blue-900 text-white font-bold py-2 rounded-lg text-xs transition" data-num="0001">Place Mock Bid</button>
                    </div>

                    <!-- Plate 2 -->
                    <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3 text-center">
                        <div class="bg-slate-100 border border-slate-300 py-3 rounded-xl font-mono text-2xl font-black text-slate-900 tracking-widest">
                            DL 01 AA 0786
                        </div>
                        <div class="text-xs text-gray-500">
                            <span class="block">Category 2 (Heritage Number)</span>
                            <span class="text-primary font-bold text-sm">Current Bid: ₹3,25,000</span>
                        </div>
                        <button class="bid-btn w-full bg-primary hover:bg-blue-900 text-white font-bold py-2 rounded-lg text-xs transition" data-num="0786">Place Mock Bid</button>
                    </div>

                    <!-- Plate 3 -->
                    <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3 text-center">
                        <div class="bg-slate-100 border border-slate-300 py-3 rounded-xl font-mono text-2xl font-black text-slate-900 tracking-widest">
                            DL 01 AA 9999
                        </div>
                        <div class="text-xs text-gray-500">
                            <span class="block">Category 2 (Quad Repeat)</span>
                            <span class="text-primary font-bold text-sm">Current Bid: ₹3,00,000</span>
                        </div>
                        <button class="bid-btn w-full bg-primary hover:bg-blue-900 text-white font-bold py-2 rounded-lg text-xs transition" data-num="9999">Place Mock Bid</button>
                    </div>

                    <!-- Plate 4 -->
                    <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3 text-center">
                        <div class="bg-slate-100 border border-slate-300 py-3 rounded-xl font-mono text-2xl font-black text-slate-900 tracking-widest">
                            DL 01 AA 1234
                        </div>
                        <div class="text-xs text-gray-500">
                            <span class="block">Category 3 (Sequence Number)</span>
                            <span class="text-primary font-bold text-sm">Current Bid: ₹2,10,000</span>
                        </div>
                        <button class="bid-btn w-full bg-primary hover:bg-blue-900 text-white font-bold py-2 rounded-lg text-xs transition" data-num="1234">Place Mock Bid</button>
                    </div>
                </div>
            </div>
        `;
    }

    function attachFancyNumberLogic() {
        document.querySelectorAll('.bid-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const num = btn.getAttribute('data-num');
                alert(`Mock Bid placed successfully for registration number series: ${num}! Allotment letter will be generated post auction closing.`);
            });
        });
    }

    // ----------------------------------------------------
    // Service Module 6: Commercial & National Permits
    // ----------------------------------------------------
    function renderCommercialPermitsModule() {
        return `
            <div class="space-y-8 animate-fade-in">
                <div class="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
                    <span class="bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">MoRTH Commercial Fleet</span>
                    <h1 class="text-2xl sm:text-3xl font-extrabold mt-1">National Permits & Automated Fitness</h1>
                    <p class="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">All-India Tourist/Goods permit renewal, automated fitness track booking, and tax payments.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center text-lg font-bold">
                            <i class="fas fa-globe-asia"></i>
                        </div>
                        <h3 class="font-extrabold text-sm text-gray-800">All-India National Permit</h3>
                        <p class="text-gray-500">Annual composite fee of ₹16,500 for uninterrupted freight mobility across 36 States and UTs.</p>
                        <button onclick="alert('National Permit authorization renewed up to 28-Aug-2027.')" class="w-full bg-primary hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg transition">Renew National Permit</button>
                    </div>

                    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <div class="w-10 h-10 rounded-xl bg-orange-100 text-secondary flex items-center justify-center text-lg font-bold">
                            <i class="fas fa-tachometer-alt"></i>
                        </div>
                        <h3 class="font-extrabold text-sm text-gray-800">Automated Fitness Testing Slot</h3>
                        <p class="text-gray-500">Book slot at Automated Vehicle Testing Center (Burari / Jhuljhuli ADTT) for Form 38 fitness renewal.</p>
                        <button onclick="alert('Slot booked for Fitness Testing at Burari Track on Monday 09:30 AM.')" class="w-full bg-secondary hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg transition">Book Fitness Track Slot</button>
                    </div>

                    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-accent flex items-center justify-center text-lg font-bold">
                            <i class="fas fa-recycle"></i>
                        </div>
                        <h3 class="font-extrabold text-sm text-gray-800">Vehicle Scrappage (RVSF)</h3>
                        <p class="text-gray-500">Scrap 15+ year old commercial vehicles to receive Certificate of Deposit (CoD) with 25% tax waiver.</p>
                        <button onclick="alert('Generating Certificate of Deposit (CoD) application...')" class="w-full bg-accent hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg transition">Apply Scrappage CoD</button>
                    </div>
                </div>
            </div>
        `;
    }

    // ----------------------------------------------------
    // Service Module 7: Full Comprehensive Service Directory
    // ----------------------------------------------------
    function renderServiceDirectory() {
        return `
            <div class="space-y-8 animate-fade-in">
                <div class="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg text-center max-w-3xl mx-auto">
                    <span class="bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">MoRTH Transport Directory</span>
                    <h1 class="text-2xl sm:text-4xl font-extrabold mt-2">All Transport & Citizen Services</h1>
                    <p class="text-blue-200 text-xs sm:text-sm mt-2">Browse the complete catalogue of digitized transport services available under Sarathi, Vahan, and eChallan.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Col 1 -->
                    <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                        <h2 class="text-base font-extrabold text-primary flex items-center pb-2 border-b">
                            <i class="fas fa-id-card text-secondary mr-2"></i> Driving License (Sarathi)
                        </h2>
                        <ul class="space-y-2 text-xs font-semibold text-gray-700">
                            <li><a href="service.html?id=apply-learner-permanent" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Apply Learner / Permanent License</a></li>
                            <li><a href="service.html?id=renew-license" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Renew License & Grace Period</a></li>
                            <li><a href="service.html?id=duplicate-license" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Duplicate License (Lost / Damaged)</a></li>
                            <li><a href="service.html?id=international-permit-idp" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> International Driving Permit (IDP)</a></li>
                        </ul>
                    </div>

                    <!-- Col 2 -->
                    <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                        <h2 class="text-base font-extrabold text-primary flex items-center pb-2 border-b">
                            <i class="fas fa-car text-secondary mr-2"></i> Vehicle Registration (Vahan)
                        </h2>
                        <ul class="space-y-2 text-xs font-semibold text-gray-700">
                            <li><a href="service.html?id=transfer-ownership" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Transfer of RC Ownership</a></li>
                            <li><a href="service.html?id=change-address" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Change of Address in RC</a></li>
                            <li><a href="service.html?id=renew-duplicate-rc" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Renew / Duplicate RC Certificate</a></li>
                            <li><a href="service.html?id=fancy-choice-number" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Fancy / Choice Registration Plate</a></li>
                        </ul>
                    </div>

                    <!-- Col 3 -->
                    <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                        <h2 class="text-base font-extrabold text-primary flex items-center pb-2 border-b">
                            <i class="fas fa-shield-alt text-secondary mr-2"></i> Compliance & Commercial
                        </h2>
                        <ul class="space-y-2 text-xs font-semibold text-gray-700">
                            <li><a href="service.html?id=pay-echallan" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> eChallan Settlement (Fines)</a></li>
                            <li><a href="service.html?id=pucc-status" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> PUCC Pollution Status & Testing</a></li>
                            <li><a href="service.html?id=commercial-permits" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> National Permits & Fitness Testing</a></li>
                            <li><a href="service.html?id=vehicle-scrapping" class="block p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition"><i class="fas fa-chevron-right text-[10px] text-gray-400 mr-2"></i> Scrappage Policy Certificate (CoD)</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    // ====================================================
    // 5. Accessibility Controls (Font Scaling & Contrast)
    // ====================================================
    let currentScale = 1.0;
    function setFontScale(scale) {
        currentScale = scale;
        document.documentElement.style.setProperty('--font-scale', `${scale}rem`);
    }

    document.getElementById('btnDecreaseText')?.addEventListener('click', () => {
        if (currentScale > 0.85) setFontScale(Math.max(0.85, currentScale - 0.1));
    });
    document.getElementById('btnNormalText')?.addEventListener('click', () => {
        setFontScale(1.0);
    });
    document.getElementById('btnIncreaseText')?.addEventListener('click', () => {
        if (currentScale < 1.3) setFontScale(Math.min(1.3, currentScale + 0.1));
    });

    document.getElementById('btnHighContrast')?.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });

    // Mobile Hamburger Toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileMenuDrawer');
    const mobileClose = document.getElementById('mobileMenuClose');
    const mobileBackdrop = document.getElementById('mobileMenuBackdrop');

    mobileToggle?.addEventListener('click', () => mobileDrawer?.classList.remove('hidden'));
    mobileClose?.addEventListener('click', () => mobileDrawer?.classList.add('hidden'));
    mobileBackdrop?.addEventListener('click', () => mobileDrawer?.classList.add('hidden'));
});