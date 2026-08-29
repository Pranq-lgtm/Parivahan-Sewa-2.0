/**
 * Parivahan Sewa - Centralized Mock Data & Personas
 * Provides realistic test credentials and records across the portal.
 */

window.ParivahanMockData = {
    // ----------------------------------------------------
    // 1. Demo User Personas for 1-Click Login & Testing
    // ----------------------------------------------------
    personas: [
        {
            id: 'citizen',
            role: 'Citizen User',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@citizen.nic.in',
            phone: '+91 98765 43210',
            aadhaar: 'XXXX-XXXX-8921',
            city: 'New Delhi, DL',
            avatarText: 'RK',
            avatarBg: 'bg-blue-600',
            primaryVehicle: 'DL01AB1234',
            primaryDL: 'DL-1420110012345',
            pendingChallans: 1,
            description: 'Individual vehicle owner & holder of Permanent Driving License (LMV/MCWG).'
        },
        {
            id: 'commercial',
            role: 'Fleet / Transporter Operator',
            name: 'Vikram Singh Logistics',
            email: 'vikram.singh@delhifleet.in',
            phone: '+91 98111 22334',
            gstin: '07AAAAA1234A1Z5',
            city: 'Gurugram, HR',
            avatarText: 'VS',
            avatarBg: 'bg-orange-600',
            primaryVehicle: 'HR26DK8899',
            fleetCount: 14,
            nationalPermits: 8,
            description: 'Commercial Goods Carrier fleet operator managing National & State All-India Permits.'
        },
        {
            id: 'officer',
            role: 'RTO Verification Officer',
            name: 'Inspector Anjali Sharma',
            email: 'anjali.sharma@rto.delhi.gov.in',
            phone: '+91 99887 76655',
            badgeNumber: 'RTO-DL01-884',
            city: 'Mall Road RTO, Delhi',
            avatarText: 'AS',
            avatarBg: 'bg-indigo-700',
            station: 'RTO Zone 01 - North Delhi',
            pendingApprovals: 28,
            description: 'Authorized MoRTH Transport Inspector for DL skill tests and RC clearance.'
        },
        {
            id: 'dealer',
            role: 'Automotive Dealer / Maker',
            name: 'Arun Patel (Apex Motors)',
            email: 'arun@apexmotors.dealer.in',
            phone: '+91 97234 56789',
            tradeCert: 'TC-2024-ND-492',
            city: 'Noida, UP',
            avatarText: 'AP',
            avatarBg: 'bg-emerald-600',
            makerCode: 'M-TATA-IND-99',
            pendingDeliveries: 9,
            description: 'Authorized dealer with point-of-sale temporary RC and homologation permissions.'
        }
    ],

    // ----------------------------------------------------
    // 2. Mock Vehicle Registration (RC) Records
    // ----------------------------------------------------
    vehicles: {
        'DL01AB1234': {
            rcNumber: 'DL01AB1234',
            ownerName: 'Rajesh Kumar',
            fatherName: 'Suresh Kumar',
            makerModel: 'Hyundai Creta 1.5 SX (Petrol)',
            vehicleClass: 'Motor Car (LMV - Private)',
            fuelType: 'Petrol / BS-VI',
            registrationDate: '14-Nov-2021',
            fitnessValidUpto: '13-Nov-2036 (Valid)',
            insuranceValidUpto: '10-Nov-2027 (HDFC ERGO - Active)',
            puccValidUpto: '18-Oct-2026 (Valid)',
            taxStatus: 'One Time Paid (LTT)',
            financer: 'HDFC Bank Ltd. (Hypothecated)',
            rtoOffice: 'RTO Mall Road, North Delhi (DL-01)',
            status: 'Active & Clean'
        },
        'MH02CD5678': {
            rcNumber: 'MH02CD5678',
            ownerName: 'Priya Deshmukh',
            fatherName: 'Anil Deshmukh',
            makerModel: 'Tata Nexon EV Max',
            vehicleClass: 'Electric Vehicle (LMV - Private)',
            fuelType: 'Battery Electric (BEV)',
            registrationDate: '02-Feb-2023',
            fitnessValidUpto: '01-Feb-2038 (Valid)',
            insuranceValidUpto: '15-Jan-2028 (ICICI Lombard - Active)',
            puccValidUpto: 'Exempt (Zero Emission)',
            taxStatus: 'Zero Tax (EV Exemption)',
            financer: 'None (Unencumbered)',
            rtoOffice: 'Andheri RTO, Mumbai West (MH-02)',
            status: 'Active & Clean'
        },
        'HR26DK8899': {
            rcNumber: 'HR26DK8899',
            ownerName: 'Vikram Singh Logistics',
            fatherName: 'Commercial Entity',
            makerModel: 'Tata Signa 4825.TK (Multi-Axle Tipper)',
            vehicleClass: 'Heavy Goods Vehicle (HGV - Commercial)',
            fuelType: 'Diesel / BS-VI',
            registrationDate: '10-Jun-2020',
            fitnessValidUpto: '09-Jun-2026 (Renew Due Soon)',
            insuranceValidUpto: '05-Jun-2027 (New India Assurance)',
            puccValidUpto: '12-Mar-2026 (Expired)',
            taxStatus: 'Annual Tax Paid up to 31-Mar-2027',
            financer: 'Kotak Mahindra Prime',
            rtoOffice: 'Gurugram RTO (HR-26)',
            permitType: 'All India Tourist / Goods Permit (Valid)',
            status: 'Attention Required (PUCC Expired)'
        },
        'KA05EF9012': {
            rcNumber: 'KA05EF9012',
            ownerName: 'Karthik Ramanathan',
            fatherName: 'S. Ramanathan',
            makerModel: 'Royal Enfield Hunter 350',
            vehicleClass: 'Two Wheeler (MCWG)',
            fuelType: 'Petrol',
            registrationDate: '20-Aug-2022',
            fitnessValidUpto: '19-Aug-2037 (Valid)',
            insuranceValidUpto: '18-Aug-2027 (Digit Insurance)',
            puccValidUpto: '14-Sep-2026 (Valid)',
            taxStatus: 'Lifetime Tax Paid',
            financer: 'None',
            rtoOffice: 'Jayanagar RTO, Bengaluru South (KA-05)',
            status: 'Active & Clean'
        }
    },

    // ----------------------------------------------------
    // 3. Mock Driving License (DL) Records
    // ----------------------------------------------------
    licenses: {
        'DL-1420110012345': {
            dlNumber: 'DL-1420110012345',
            holderName: 'Rajesh Kumar',
            dob: '12-Aug-1991',
            bloodGroup: 'B+',
            cov: 'LMV, MCWG (Car & Geared Motorcycle)',
            issueDate: '25-Jan-2011',
            validUpto: '11-Aug-2035 (Valid)',
            rtoJurisdiction: 'RTO Janakpuri, West Delhi (DL-14)',
            status: 'Active / Non-Suspended',
            aadhaarLinked: 'Yes (Biometric Verified)'
        },
        'MH-0220180098765': {
            dlNumber: 'MH-0220180098765',
            holderName: 'Priya Deshmukh',
            dob: '05-May-1996',
            bloodGroup: 'O+',
            cov: 'LMV (Light Motor Vehicle)',
            issueDate: '15-Mar-2018',
            validUpto: '04-May-2036 (Valid)',
            rtoJurisdiction: 'Andheri RTO, Mumbai (MH-02)',
            status: 'Active',
            aadhaarLinked: 'Yes'
        },
        'HR-2620050044556': {
            dlNumber: 'HR-2620050044556',
            holderName: 'Vikram Singh',
            dob: '19-Jul-1980',
            bloodGroup: 'A+',
            cov: 'TRANS, HMV, LMV (Commercial Heavy Transport)',
            issueDate: '10-Jul-2005',
            validUpto: '18-Jul-2028 (Valid)',
            rtoJurisdiction: 'Gurugram RTO (HR-26)',
            status: 'Active / Commercial Endorsed',
            aadhaarLinked: 'Yes'
        }
    },

    // ----------------------------------------------------
    // 4. Mock eChallans (Traffic Violations & Fines)
    // ----------------------------------------------------
    challans: {
        'CH-2024-88391': {
            challanNumber: 'CH-2024-88391',
            vehicleNumber: 'DL01AB1234',
            ownerName: 'Rajesh Kumar',
            offense: 'Exceeding Prescribed Speed Limit (Sec 183(1) MV Act)',
            offenseLocation: 'Outer Ring Road near Munirka Flyover, New Delhi',
            offenseDate: '24-Aug-2026 11:42 AM',
            evidenceSpeed: '84 km/h in 60 km/h camera zone',
            penaltyAmount: 2000,
            status: 'Pending Payment',
            courtDisposition: 'Can be settled online via Parivahan Virtual Court'
        },
        'CH-2024-91024': {
            challanNumber: 'CH-2024-91024',
            vehicleNumber: 'HR26DK8899',
            ownerName: 'Vikram Singh Logistics',
            offense: 'Driving without Valid Pollution Under Control Certificate (Sec 190(2))',
            offenseLocation: 'NH-48 Kherki Daula Toll, Gurugram',
            offenseDate: '27-Aug-2026 09:15 AM',
            evidenceSpeed: 'N/A',
            penaltyAmount: 10000,
            status: 'Pending Payment',
            courtDisposition: 'Compounding Notice Issued'
        },
        'CH-2024-55412': {
            challanNumber: 'CH-2024-55412',
            vehicleNumber: 'DL01AB1234',
            ownerName: 'Rajesh Kumar',
            offense: 'Signal Jumping (Sec 184 Red Light Violation)',
            offenseLocation: 'ITO Intersection, New Delhi',
            offenseDate: '12-May-2026 08:30 PM',
            evidenceSpeed: 'N/A',
            penaltyAmount: 1000,
            status: 'Paid & Disposed',
            receiptNumber: 'RCPT-ND-2026-992144'
        }
    },

    // ----------------------------------------------------
    // 5. Mock Downloadable Forms Directory
    // ----------------------------------------------------
    formsDirectory: [
        { id: 'form-1', title: 'Form 1 - Self Declaration of Physical Fitness', cat: 'Driving License', desc: 'Mandatory declaration for applicant age below 40 years for non-transport vehicle.' },
        { id: 'form-1a', title: 'Form 1A - Medical Certificate by Registered Medical Practitioner', cat: 'Driving License', desc: 'Required for commercial transport applicants or applicants above 40 years.' },
        { id: 'form-2', title: 'Form 2 - Application for Learner / Driving License Grant', cat: 'Driving License', desc: 'Standard consolidated application for grant or renewal of license.' },
        { id: 'form-20', title: 'Form 20 - Application for Registration of a Motor Vehicle', cat: 'Vehicle RC', desc: 'Required for new vehicle temporary and permanent RC allotment.' },
        { id: 'form-28', title: 'Form 28 - Application & Grant of No Objection Certificate (NOC)', cat: 'Vehicle RC', desc: 'Required when moving vehicle to another State/Union Territory jurisdiction.' },
        { id: 'form-29', title: 'Form 29 - Notice of Transfer of Ownership of a Motor Vehicle', cat: 'Vehicle RC', desc: 'Signed by seller to report vehicle transfer to the registering authority.' },
        { id: 'form-30', title: 'Form 30 - Application for Intimation & Transfer of Ownership', cat: 'Vehicle RC', desc: 'Dual-part form signed by both buyer and seller with hypothecation clause.' },
        { id: 'form-38', title: 'Form 38 - Certificate of Fitness Inspection', cat: 'Commercial', desc: 'Inspection slip for commercial carrier roadworthiness validation.' }
    ]
};
