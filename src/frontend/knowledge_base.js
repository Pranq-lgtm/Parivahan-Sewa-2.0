/**
 * Parivahan AI Saathi - Comprehensive RAG Domain Knowledge Base
 * Indexes official MoRTH rules, CMVR 1989, fees, step-by-step procedures,
 * and alternative fallback paths for citizens and commercial transporters.
 */

window.ParivahanKnowledgeBase = {
    // ----------------------------------------------------
    // 1. Structured Knowledge Chunks for Semantic Retrieval
    // ----------------------------------------------------
    articles: [
        {
            id: 'dl-learner-apply',
            category: 'Driving License',
            title: 'Applying for Learner\'s License (LL) Online via Aadhaar Face Authentication',
            keywords: ['learner', 'll', 'apply learner license', 'driving test', 'age limit', 'aadhaar', 'face auth', 'documents'],
            content: `Learner's License (LL) can be applied 100% online through Aadhaar Face Authentication without visiting an RTO.
- Minimum Age: 16 years for motorcycle without gear (up to 50cc with parental consent); 18 years for private motor car (LMV) and geared motorcycle (MCWG); 20 years for commercial transport vehicle.
- Documents Required: Aadhaar Card (linked with active mobile), Medical Form 1 (Self Declaration if age <40) or Form 1A (Doctor certified if age >=40 or commercial).
- Online Test: 15 questions on road signs and traffic safety. Passing score is 9/15 (60%).
- Fees: Rs 150 for LL Test + Rs 50 per vehicle class.
- Validity: 6 months from issue date. Permanent Driving License can be applied after 30 days of LL issue.`,
            alternativePath: `If Aadhaar OTP fails or Face Recognition fails 3 times: Choose 'Apply without Aadhaar' mode on Sarathi. You will be scheduled for an in-person biometrics appointment at your local RTO within 3 working days.`
        },
        {
            id: 'dl-permanent-apply',
            category: 'Driving License',
            title: 'Permanent Driving License (DL) Application & Skill Test',
            keywords: ['permanent dl', 'driving test slot', 'dl appointment', 'automated driving track', 'adt'],
            content: `Permanent DL can be applied after 30 days and within 180 days of Learner License issue.
- Step 1: Login with LL number and Date of Birth on Sarathi portal.
- Step 2: Book slot for Automated Driving Test Track (ADTT) at your preferred RTO.
- Step 3: Present your original LL, slot receipt, and vehicle with 'L' board and valid RC/Insurance/PUCC on test date.
- Step 4: Perform Reverse-S, 8-figure, parallel parking, and gradient hill restart tests on sensor tracks.
- Fees: Rs 200 for Driving Test + Rs 200 for Smart Card DL issue.`
        },
        {
            id: 'dl-renewal-duplicate',
            category: 'Driving License',
            title: 'Renewal of Driving License & Duplicate DL for Lost/Mutilated Card',
            keywords: ['renew dl', 'duplicate dl', 'lost dl', 'expired license', 'grace period', 'form 1a'],
            content: `Driving License Renewal:
- Can be applied up to 1 year before expiry or within 1 year after expiry without re-test.
- Grace Period: 1 year. If expired over 1 year, you must undergo driving re-test.
- Penalty: Standard renewal Rs 200. Late fee Rs 300 per year of delay after 1-year grace period.
- Duplicate DL: If lost, file online e-FIR / police loss intimation report, fill Form 2 online, fee Rs 200.`
        },
        {
            id: 'rc-transfer-ownership',
            category: 'Vehicle Registration',
            title: 'Transfer of Vehicle Ownership (RC Transfer - Within State & Inter-State)',
            keywords: ['transfer ownership', 'sell car', 'buy used car', 'form 29', 'form 30', 'noc', 'form 28', 'out of state'],
            content: `RC Transfer within Same State:
- Seller initiates transfer on Vahan 4.0 using Vehicle Number and Chassis Last 5 digits.
- Both Seller and Buyer verify via Aadhaar OTP.
- Required: Form 29 (Notice of Transfer), Form 30 (Application for Transfer), Valid Insurance, Valid PUCC, Original RC, and Bank NOC Form 35 (if loan was active).
- Fee: Rs 300 (Two wheeler) / Rs 500 (Car) + smart card fee Rs 200.
Inter-State RC Transfer:
- Step 1: Obtain Form 28 (No Objection Certificate - NOC) from seller's original RTO.
- Step 2: Submit NOC, Form 29/30, and state Road Tax invoice to buyer's destination RTO within 30 days of NOC issue.
- Pro-rata road tax refund can be claimed from the source state after re-registration in the new state.`
        },
        {
            id: 'echallan-dispute-payment',
            category: 'Compliance',
            title: 'eChallan Payment, Verification, and Virtual Court Grievance',
            keywords: ['echallan', 'traffic fine', 'speed challan', 'dispute challan', 'virtual court', 'lok adalat', 'pay online'],
            content: `eChallan Management:
- Look up by Challan Number, Vehicle Registration, or Driving License.
- Payment Options: Instant UPI, Net Banking, Credit/Debit card with immediate payment receipt (Form TR-5).
- Virtual Court Settlement: For compounding offenses (speeding, red light, helmet), you can plead guilty online and pay reduced fine or plead not guilty to transfer case to regular court.
- Lok Adalat: National Lok Adalat held quarterly provides 50% to 70% waiver on eligible compoundable traffic challans.`
        },
        {
            id: 'pucc-rules-validity',
            category: 'Compliance',
            title: 'Pollution Under Control Certificate (PUCC) Standards & Penalty',
            keywords: ['pucc', 'pollution test', 'emission certificate', 'bs6', 'bs4', 'fines for pollution'],
            content: `PUCC Norms under Central Motor Vehicles Rules (CMVR):
- New vehicles: First PUCC is valid for 1 year from the date of registration.
- BS-IV and BS-VI vehicles: Subsequent PUCC valid for 12 months (1 year).
- Pre-BS-IV vehicles: PUCC valid for 6 months.
- Electric Vehicles (BEV): Exempted from PUCC requirement.
- Penalty under Section 190(2) MV Act: Rs 10,000 fine and/or 3-month DL suspension for operating vehicle without valid PUCC.`
        },
        {
            id: 'commercial-national-permits',
            category: 'Commercial',
            title: 'National Permits, All India Tourist Permit (AITP), and Fitness Testing',
            keywords: ['commercial permit', 'national permit', 'aitp', 'fitness test', 'speed governor', 'sld', 'gps tracking', 'ais 140'],
            content: `Commercial Transporter Norms:
- National Permit (Goods): Consolidated annual fee Rs 16,500 + State authorization fee. Valid across all Indian States and UTs.
- Fitness Certificate (Form 38): Mandatory for all commercial transport vehicles. Renewal every 2 years for vehicles up to 8 years old; every 1 year for vehicles older than 8 years.
- Mandatory Fitments: AIS-140 GPS Device with Panic Button, Speed Limiting Device (SLD calibrated to 80 km/h), Retro-reflective tapes.`
        },
        {
            id: 'vehicle-scrapping-rvsf',
            category: 'Commercial & Environmental',
            title: 'Voluntary Vehicle Fleet Modernization Program (Scrappage Policy)',
            keywords: ['scrapping', 'vehicle scrap', 'rvsf', 'certificate of deposit', 'cod', 'scrap discount', '15 year rule'],
            content: `Scrappage Policy Guidelines:
- Commercial vehicles older than 15 years and private vehicles older than 20 years must pass automated fitness test or be deregistered.
- Scrapping at Registered Vehicle Scrapping Facility (RVSF) yields a 'Certificate of Deposit' (CoD).
- Benefits of CoD: Up to 25% motor vehicle tax rebate on purchase of new vehicle + waiver of registration fee + manufacturer discount up to 5%.`
        },
        {
            id: 'fancy-choice-number',
            category: 'Vehicle Registration',
            title: 'Fancy / Choice Registration Number Allotment & E-Auction',
            keywords: ['fancy number', 'vip number', 'choice number', '0001', 'e-auction', 'bidding'],
            content: `Fancy Number Allotment:
- Category 1 (Super Premium: 0001) - Base bidding price Rs 5,00,000.
- Category 2 (Single digit / repeating: 0002 to 0009, 0786, 1111, 9999) - Base price Rs 3,00,000.
- Category 3 (Semi-premium: 0010, 0100, 1000, 1234) - Base price Rs 2,00,000.
- Choice Numbers (Non-auction running series e.g., birth years, lucky numbers) - Flat fee Rs 25,000.
- Process: Online registration on Vahan Fancy Number Portal -> 3-day bidding window -> Instant allotment letter upon highest bid clearance.`
        }
    ],

    // ----------------------------------------------------
    // 2. Semantic Search & RAG Context Matcher
    // ----------------------------------------------------
    findRelevantContext: function(query, topK = 3) {
        if (!query) return [];
        const cleanQuery = query.toLowerCase();
        const queryWords = cleanQuery.split(/[\s,?.!-]+/).filter(w => w.length > 2);

        const scoredArticles = this.articles.map(article => {
            let score = 0;
            const textToSearch = (article.title + ' ' + article.keywords.join(' ') + ' ' + article.content + ' ' + (article.alternativePath || '')).toLowerCase();

            // Direct substring match
            if (textToSearch.includes(cleanQuery)) {
                score += 15;
            }

            // Keyword match
            article.keywords.forEach(kw => {
                if (cleanQuery.includes(kw.toLowerCase())) {
                    score += 8;
                }
            });

            // Word frequency match
            queryWords.forEach(word => {
                const regex = new RegExp('\\b' + word + '\\b', 'g');
                const matches = (textToSearch.match(regex) || []).length;
                score += matches * 2;
            });

            return { ...article, score };
        });

        scoredArticles.sort((a, b) => b.score - a.score);
        return scoredArticles.slice(0, topK).filter(a => a.score > 0);
    }
};
