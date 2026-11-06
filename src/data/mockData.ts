import {
  CropSummary,
  MandiItem,
  NearbyMandiArbitrage,
  CorporateTender,
  DiseaseThreat,
  CalendarTask,
  NotificationItem,
} from '../types';

export const USER_PROFILE = {
  name: 'Gopal Rao',
  role: 'Farmer account',
  farmerPartner: 'Farmer Partner',
  holding: '12.5 Acres',
  location: 'Guntur District, Andhra Pradesh',
  station: 'Station #4 • Guntur (16.3067° N, 80.4365° E)',
  avatar:
    'https://lh3.googleusercontent.com/aida/AEtjO1VdVEXnjNX-bM_Pdw5ixy7WUi5m5NKSnaReSf0GEYSyJ_9VwctlPQ6RE_DC2WkEXZ_gbQ_Z84ZLpkwJ4d6f01z7s9lSbu8WKZMr_kuKt-Qbcu8A9BE8zDQaDAVpsvY_t_l8gk_lRz7Q_Dxwu51DDj78Yl38SU_dHO5ZmuViPmPAWTP4lxRN1PnDj4Q6HW5TyLp4QAp2yhlUCiy3oeQoQxWuu4E7lZdSQMdUN4qfDuY2T_KNQ7u9IfhLLYA',
  landscape:
    'https://lh3.googleusercontent.com/aida/AEtjO1WvAbpPecAlwi8qL5im6_DIN1Re3XEl5kUrXuZkbcW9Qt40pEIoP4zIwFNLlJhn21GswQxK1J04lg_90PpB_xencHf7rLvd3riKy_teZWnOY1SAitPgyL3B9BuyL5RASnnTzJHVdwwLuzGzj_H3PHZcH97cLK8OzHvj251rULzLo710cy9wIla_ksRwFLoh-Ebp2MN8-8s3NZdUOa_DoxKQibs2o0RNCVC_80OAkXccmAmTR-h554DouA',
};

export const CROPS_DATA: CropSummary[] = [
  {
    id: 'crop-1',
    name: 'Rice',
    variety: 'Basmati 1509',
    field: 'Field 1 (Parcel A)',
    area: '5.0 acres',
    status: 'healthy',
    stage: 'Vegetative stage',
    days: 45,
    progressPercent: 72,
    icon: '🌾',
  },
  {
    id: 'crop-2',
    name: 'Chilli',
    variety: 'Guntur Sannam / Teja',
    field: 'Field 2 (Parcel B)',
    area: '3.0 acres',
    status: 'attention',
    stage: 'Flowering & Fruit Set',
    days: 62,
    progressPercent: 58,
    icon: '🌶️',
  },
  {
    id: 'crop-3',
    name: 'Maize',
    variety: 'Hybrid Yellow',
    field: 'Field 3 (Parcel C)',
    area: '2.5 acres',
    status: 'healthy',
    stage: 'Vegetative stage',
    days: 38,
    progressPercent: 66,
    icon: '🌽',
  },
  {
    id: 'crop-4',
    name: 'Groundnut',
    variety: 'K6 Kadiri (Bold Pods)',
    field: 'Field 4 (Parcel D)',
    area: '2.0 acres',
    status: 'healthy',
    stage: 'Flowering & Pegging',
    days: 50,
    progressPercent: 74,
    icon: '🥜',
  },
];

export const MANDI_ITEMS: MandiItem[] = [
  {
    id: 'mandi-1',
    name: 'Guntur Sannam Chilli',
    grade: 'Grade A Export Quality',
    price: 19850,
    unit: 'quintal',
    change: '+₹420',
    changePercent: 2.1,
    isPositive: true,
    dailyArrival: '14,200 bags',
    modalPrice: 18900,
    procurementDemand: 'Export Pool Active',
  },
  {
    id: 'mandi-2',
    name: 'Paddy Basmati 1509',
    grade: 'High Demand Kharif',
    price: 3680,
    unit: 'quintal',
    change: '+₹65',
    changePercent: 1.8,
    isPositive: true,
    dailyArrival: '12,400 Qtl',
    modalPrice: 3680,
    msp: 2320,
    overMsp: '+58.6%',
  },
  {
    id: 'mandi-3',
    name: 'Hybrid Yellow Maize',
    grade: 'Heavy Inflow Pressure',
    price: 2180,
    unit: 'quintal',
    change: '-₹30',
    changePercent: -1.3,
    isPositive: false,
    dailyArrival: '31,000 Qtl',
    modalPrice: 2150,
    arrivalPressure: 'High (31,000 Qtl)',
    storageAdvice: 'Hold in Silo',
  },
  {
    id: 'mandi-4',
    name: 'Groundnut (Bold Pods)',
    grade: 'Oil Mills Procuring',
    price: 6750,
    unit: 'quintal',
    change: '+₹110',
    changePercent: 1.6,
    isPositive: true,
    dailyArrival: '5,800 bags',
    modalPrice: 6680,
    procurementDemand: 'Very Strong',
    moistureAvg: '7.4% (Optimal)',
  },
];

export const NEARBY_ARBITRAGE: NearbyMandiArbitrage[] = [
  {
    mandi: 'Guntur APMC Yard',
    distance: '14 km',
    variety: 'Paddy 1509',
    minRate: 3520,
    maxRate: 3740,
    modalPrice: 3680,
    dailyArrival: '12,400 Qtl',
    netReturn: 3655,
    statusTag: 'Highest Demand',
    diffNote: 'RECOMMENDED BEST NET',
  },
  {
    mandi: 'Tenali Market Yard',
    distance: '28 km',
    variety: 'Paddy 1509',
    minRate: 3480,
    maxRate: 3690,
    modalPrice: 3640,
    dailyArrival: '6,800 Qtl',
    netReturn: 3590,
    diffNote: '-₹65 vs Guntur',
  },
  {
    mandi: 'Vijayawada Wholesale Hub',
    distance: '32 km',
    variety: 'Paddy 1509',
    minRate: 3510,
    maxRate: 3710,
    modalPrice: 3660,
    dailyArrival: '9,100 Qtl',
    netReturn: 3602,
    diffNote: '-₹53 vs Guntur',
  },
  {
    mandi: 'Ongole Agricultural Market',
    distance: '108 km',
    variety: 'Paddy 1509',
    minRate: 3580,
    maxRate: 3780,
    modalPrice: 3720,
    dailyArrival: '4,200 Qtl',
    netReturn: 3526,
    diffNote: 'Freight erodes gain',
  },
  {
    mandi: 'Khammam Grain Mandi',
    distance: '126 km',
    variety: 'Paddy 1509',
    minRate: 3420,
    maxRate: 3610,
    modalPrice: 3540,
    dailyArrival: '7,500 Qtl',
    netReturn: 3313,
    diffNote: '-₹342 vs Guntur',
  },
];

export const CORPORATE_TENDERS: CorporateTender[] = [
  {
    id: 'tender-1',
    company: 'ITC Agri Business Division',
    subtitle: 'Direct Procurement for Aashirvaad / Export Pool',
    tags: ['Verified Corporate', 'APMC Licensed'],
    contractOffer: '₹3,740 / Qtl',
    minLotSize: '50 Quintals',
    paymentTerms: 'T+1 Day Direct Bank',
    actionText: 'Initiate Trade',
    phone: '+91 98480 11223',
  },
  {
    id: 'tender-2',
    company: 'Patanjali Foods Ltd',
    subtitle: 'Solvent Extraction & Edible Oil Sourcing',
    tags: ['Mega Buyer', 'ISO Certified'],
    contractOffer: '₹6,880 / Qtl',
    targetCrop: 'Groundnut Pods',
    farmgatePickup: 'Free Transport',
    actionText: 'Initiate Trade',
    phone: '+91 98480 33445',
  },
  {
    id: 'tender-3',
    company: 'Gopal Delta Farmers Producer Co.',
    subtitle: 'Aggregated Export Consolidation to UAE',
    tags: ['FPO Collective', '1,840 Members'],
    contractOffer: '₹20,400 / Qtl',
    targetVariety: 'Teja Red Chilli',
    spotAdvance: '30% upfront booking',
    actionText: 'Join Aggregation Lot',
    phone: '+91 98480 55667',
  },
];

export const DISEASES_CATALOG: DiseaseThreat[] = [
  {
    id: 'dis-1',
    name: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    crop: 'paddy',
    fieldTag: 'Paddy (Field 1)',
    severity: 'high',
    severityLabel: 'High Alert',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDa0xR_hIGbMRhD7V8ShaaPpQmCpnoYf4TWvJ1OZjonaF-87yXHPB0HuNznne-KFwj62HOyqzsW-2T0jrg7TIaillZEJvzT1wCv-1yQ5jpVeFRK55cP2tsjy4hGvblfVP_MKylHB4jHFWIy6dn7RKlXSeOesYK42ZlBi_OrjXEhdEMd1dF254_pbZgNpLgwkqNktRcKGxX9QauptLC1ogrX4xfkZs4-rk7Ht5OUeqvRw6e9rUTmmiGp',
    symptoms:
      'Water-soaked to yellowish stripes along leaf margins, wilting, grayish-white blighted leaves under humid conditions.',
    solution:
      'Streptocycline (1 g/10 L) + Copper Oxychloride 50% WP (25 g/10 L) foliar spray.',
    preventiveCare:
      'Avoid excess nitrogen top-dressing; maintain 5cm water level during tillering; drain excess stagnant water.',
    treatmentPrice: 380,
  },
  {
    id: 'dis-2',
    name: 'Chilli Anthracnose / Die Back',
    scientificName: 'Colletotrichum capsici',
    crop: 'chilli',
    fieldTag: 'Chilli (Field 2)',
    severity: 'high',
    severityLabel: 'High Alert',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1DbK4dBrsmCFKO7-Y051XErqafufFWv2y5FVnxZpx7znqQyPvCFpbEpVeNf3WUJRAnYCqhA160RYiLR-YlLrUAKFEJyDKCFKmi1Ur_ShM83imQd_A-98WGanZWYYGFEFQyUDCvYJih68K2vB0kaMjxMAtyBkQywUfNA2uEnbyfSZ-S0IpgXiuAS6Nl9zba8Bd2AeDpgiCkEeB4LPmMmidJtRfMXtZyzDtITUyKCjb6wrHVyK-1W2-',
    symptoms:
      'Dark sunken circular spots on ripening chillies, twig drying from tip downwards, black acervuli rings.',
    solution:
      'Propiconazole 25% EC @ 1 ml/L or Azoxystrobin 23% SC @ 1 ml/L at first appearance.',
    preventiveCare:
      'Ensure proper field drainage after unseasonal rain; prune infected dry twigs; seed treatment with Trichoderma.',
    treatmentPrice: 540,
  },
  {
    id: 'dis-3',
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    crop: 'maize',
    fieldTag: 'Maize (Field 3)',
    severity: 'moderate',
    severityLabel: 'Moderate',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEeizOkrb2bQhG429heg7sS808jlebObTw3TeuHhizNWfzdtQ_25r9uMHXw8-7q6_ZBMZUWFtWOlRjr3UmEUH-I_easlZwZyZO_LSVsv0irW4dFYjNbmal5OHDCe01uvPP-aILq_gPNm60URIwta_NLcCAA_KfxGzTUwvuM6rNnmRn-U9vlEO0BsRRyZvs5EaS89xO7rJ_frVVSVLDZf6eLGyurxbbjHgket-0l2k3BLZGnbF3eyMn',
    symptoms:
      'Pin-hole feeding damage in whorl leaves, extensive ragged leaf edges, abundant sawdust-like frass.',
    solution:
      'Emamectin benzoate 5% SG @ 0.4 g/L or Bacillus thuringiensis spray into central whorls.',
    preventiveCare:
      'Install pheromone traps (5 traps/acre) for early adult moth surveillance and border intercropping.',
    treatmentPrice: 420,
  },
  {
    id: 'dis-4',
    name: 'Tikka Leaf Spot',
    scientificName: 'Cercospora arachidicola',
    crop: 'groundnut',
    fieldTag: 'Groundnut (Field 4)',
    severity: 'moderate',
    severityLabel: 'Moderate',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0XU9ZNE21BP9a5islCEE9JoUrRxEN-iOudbXES-qHEvUGWL95Oz-9ggRIWxCGMMz2MmT0rJvwsCh0oI8XqPSwGs9KWH9DrrRAuo1qc2oqAa2AkJjgIPIMHmyhaueZApBt2o3_n-MASpq2y8L4KlePLHuvjjMpApg9CBvHHdguFYio1jQjkkfRbB5SaCy2BbzW2Z7BFUs0XuQjevOxxvtz0xTad05gENv3QvL2wOjD42xO6G76BcGL',
    symptoms:
      'Dark necrotic circular spots with bright chlorotic yellow halos on older leaves leading to defoliation.',
    solution:
      'Mancozeb 75% WP @ 2.5 g/L or Carbendazim 50% WP @ 1 g/L spray.',
    preventiveCare:
      'Crop rotation with millets & deep summer ploughing to destroy resting fungal mycelium.',
    treatmentPrice: 310,
  },
  {
    id: 'dis-5',
    name: 'Paddy Blast / Neck Blast',
    scientificName: 'Magnaporthe oryzae',
    crop: 'paddy',
    fieldTag: 'Paddy (Field 1)',
    severity: 'preventative',
    severityLabel: 'Monitored',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMT7xPbflXpJA6ZN6TKRJIpTjwoLwXEXtb5VuwVT6yGhjwbZSEGPj597AI8RrPU_mhUzPguGcyANCK_bGi9_saHzy92DjggwPxHEeibaMuWxLbxTw5NJAZWQXlam4xllqXZ3bI5lW7fXzUmsIPSAn0rZ8wXJEeH7bicil12wyVtCrIG_xN1LMwIctvCVv0luIr8HnSUG9QzAqn8y2QarvREufiLo14JkLQFp72kYcI83RJdZVpJb63',
    symptoms:
      'Spindle-shaped lesions with grey/whitish centres and brown margins; darkening at neck node.',
    solution:
      'Tricyclazole 75% WP @ 0.6 g/L water or Isoprothiolane 40% EC.',
    preventiveCare:
      'Balanced fertilizer application; avoid late evening overhead flood irrigation.',
    treatmentPrice: 490,
  },
  {
    id: 'dis-6',
    name: 'Powdery Mildew in Chilli',
    scientificName: 'Leveillula taurica',
    crop: 'chilli',
    fieldTag: 'Chilli (Field 2)',
    severity: 'preventative',
    severityLabel: 'Monitored',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTNl0yll_wwJCpWcONh20OWkpyb_P1_u_XaTjXqZVMaufp_tia-rgNj3XZ7poJUqcsh1z8YpbLYQUvnTP-AKITHlvJNzXSvJ1nmklpxp_xZiQ1uOoEobNMLiJGTdUye8xjaBXE2uwTon08l7Fz4FoPlPoPK5r4adofRyJ8qoqeZa7BiOIE7yrPXz9wkt6F-QDJJ7_ebGMn3WOpEc0w68ypAFYou-r1vQlgjVH4ll77yaJQjDF3L6XN',
    symptoms:
      'White powdery growth on lower leaf surfaces, corresponding chlorotic patches, upward leaf curling.',
    solution:
      'Wettable Sulphur 80% WP @ 3 g/L or Dinocap @ 1 ml/L.',
    preventiveCare:
      'Dusting with sulphur during early morning hours with low wind speeds.',
    treatmentPrice: 260,
  },
];

export const CALENDAR_TASKS: CalendarTask[] = [
  {
    id: 'task-1',
    title: 'Precision Urea & DAP Top-Dressing (Second Split)',
    description:
      'Apply 25 kg Urea + 10 kg DAP per acre (45 DAS vegetative stage). Soil nitrogen saturation is currently 38%. Ideal moisture window before light rain.',
    category: 'fertilizer',
    categoryLabel: 'Fertilizer Application',
    field: 'Field 1 (Basmati Rice - 5.0 Acres)',
    timing: 'Today • 10:00 AM - 01:00 PM',
    dueDateLabel: 'Due Today',
    isCompleted: false,
    actionButtonText: 'Mark as Completed',
    guideButtonText: 'Spreading Guide',
  },
  {
    id: 'task-2',
    title: 'Neem Biopesticide Foliar Spray (Thrips & Mites)',
    description:
      '5ml/L cold-pressed neem formulation to protect early flower buds against thrips and mites during cool morning hours.',
    category: 'pest',
    categoryLabel: 'Crop Protection',
    field: 'Field 2 (Chilli - 3.0 Acres)',
    timing: 'Tomorrow • 07:30 AM',
    dueDateLabel: 'Upcoming',
    isCompleted: false,
    actionButtonText: 'Prepare Spray Kit',
    guideButtonText: 'View Safety SOP',
  },
  {
    id: 'task-3',
    title: 'Scheduled Drip Fertigation & Irrigation',
    description:
      'Run automated drip cycle for 2.5 hours to provide 14,000 Litres groundwater and soluble Potassium booster.',
    category: 'irrigation',
    categoryLabel: 'Irrigation Cycle',
    field: 'Field 3 (Maize - 2.5 Acres)',
    timing: 'Saturday, 03 Oct • 06:00 AM',
    dueDateLabel: 'Scheduled',
    isCompleted: false,
    actionButtonText: 'Review Sensor Trigger',
  },
  {
    id: 'task-4',
    title: 'Gypsum Application at Flowering Stage',
    description:
      'Broadcast 200 kg Gypsum/Acre to enhance pod formation and calcium absorption in red sandy loam soil.',
    category: 'fertilizer',
    categoryLabel: 'Pre-Order Input',
    field: 'Field 4 (Groundnut - 2.0 Acres)',
    timing: 'Next Week (08 Oct)',
    dueDateLabel: 'Pre-Task',
    isCompleted: false,
    actionButtonText: 'Order from Farm Store (₹650)',
  },
];

export const NOTIFICATIONS_DATA: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Heavy Rain & Wind Advisory for Guntur District',
    description:
      'Localized thunderstorm activity detected via Sentinel radar. Wind speeds 35-45 km/h. Secure nursery shade nets and inspect irrigation valves before 14:00.',
    category: 'weather',
    categoryLabel: 'Weather Warning',
    time: '10:45 AM',
    group: 'today',
    isUnread: true,
    severityTag: '78% Severity',
    actionUrlTab: 'weather',
    actionLabel: 'Review Weather Radar',
  },
  {
    id: 'notif-2',
    title: 'Teja Chilli Price Surged by +18% in Guntur APMC',
    description:
      'Current rate is ₹21,500/quintal (up ₹2,200 from yesterday). Optimal trading window to release 40 quintals from Rao Cold Storage. High spot trading volume recorded.',
    category: 'mandi',
    categoryLabel: 'Mandi Price Surge',
    time: '08:30 AM',
    group: 'today',
    isUnread: true,
    actionUrlTab: 'market-prices',
    actionLabel: 'View Mandi Ticker',
    sparkline: true,
  },
  {
    id: 'notif-3',
    title: 'Fertilizer Top-Dressing Scheduled for Field 1',
    description:
      'Apply 25 kg Urea + 10 kg DAP per Acre (45 DAS vegetative stage). Soil moisture is optimal at 54.2%. Complete before predicted rainfall.',
    category: 'crops',
    categoryLabel: 'Agronomy Schedule',
    time: '06:15 AM',
    group: 'today',
    isUnread: true,
    actionUrlTab: 'crop-calendar',
    actionLabel: 'Mark Task Done',
  },
  {
    id: 'notif-4',
    title: 'Yellow Stem Borer Warning in Neighbouring Tenali Mandal',
    description:
      'Pheromone trap threshold exceeded in 3 adjacent mandals (>28 moths/trap/night). Preventive application of Chlorantraniliprole 18.5 SC recommended within 72 hours.',
    category: 'crops',
    categoryLabel: 'Biosecurity Alert',
    time: 'Yesterday, 4:20 PM',
    group: 'yesterday',
    isUnread: false,
    actionUrlTab: 'diseases-library',
    actionLabel: 'Check Disease SOP',
  },
  {
    id: 'notif-5',
    title: 'PM-Kisan 17th Installment Credited',
    description:
      'Direct Benefit Transfer of ₹2,000 has been processed to your linked SBI account (ending in *4321). RRN: 429188092104. Status: Confirmed by PFMS.',
    category: 'govt',
    categoryLabel: 'Direct Benefit Transfer',
    time: 'Yesterday, 11:00 AM',
    group: 'yesterday',
    isUnread: false,
    actionLabel: 'View DBT Receipt',
  },
  {
    id: 'notif-6',
    title: 'Leaf Spot Diagnosis Report Complete',
    description:
      'AI Scan result: Mild Cercospora leaf spot in Field 2 Chilli crop. Recommended copper oxychloride spray (2.5g/L). Severity score: 3.2/10 (Low risk profile).',
    category: 'crops',
    categoryLabel: 'Dost AI Diagnostic',
    time: '28 Sep, 02:15 PM',
    group: 'earlier',
    isUnread: false,
    actionUrlTab: 'crop-doctor',
    actionLabel: 'Open Full Diagnosis',
  },
  {
    id: 'notif-7',
    title: 'Neem Biopesticide Order #KD-8821 Dispatched',
    description:
      'Your order containing 5L Cold-Pressed Neem Oil (10,000 ppm) has left Guntur Rythu Seva Kendra. Expected doorstep delivery: Tomorrow morning.',
    category: 'system',
    categoryLabel: 'Farm Store Logistics',
    time: '27 Sep, 05:40 PM',
    group: 'earlier',
    isUnread: false,
    actionLabel: 'Track Shipment',
  },
];

export const NOTIFICATIONS: NotificationItem[] = NOTIFICATIONS_DATA;

