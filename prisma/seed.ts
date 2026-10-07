import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

const img = (id: string, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80${extra}`;

type SeedProduct = {
  title: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  compareAt?: number;
  costPrice: number;
  gender?: string;
  material: string;
  care: string;
  safety: string;
  ages: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  stock?: number;
  tags: string[];
  featured?: boolean;
  bestSeller?: boolean;
  giftReady?: boolean;
  images: string[];
  sku: string;
};

const products: SeedProduct[] = [
  {
    title: "Organic Cotton Bodysuit Set",
    slug: "organic-cotton-bodysuit-set",
    sku: "GP-NB-001",
    description:
      "Three envelope-neck bodysuits in cloud-soft organic cotton. Gentle on newborn skin, easy for late-night changes.",
    brand: "GulPlaze Baby",
    category: "bodysuits",
    price: 1890,
    compareAt: 2300,
    costPrice: 900,
    material: "Organic cotton",
    care: "Gentle machine wash, tumble dry low. Do not bleach.",
    safety: "Nickel-free snaps. Tested for harmful substances.",
    ages: ["0-3m", "3-6m", "6-12m"],
    sizes: ["0-3M", "3-6M", "6-12M"],
    colors: [
      { name: "Cream", hex: "#F7EFE6" },
      { name: "Sage", hex: "#A8C3A0" },
    ],
    tags: ["newborn", "clothing", "cotton"],
    featured: true,
    bestSeller: true,
    giftReady: true,
    images: [img("photo-1522771739844-6a9f6d5f14af"), img("photo-1515488044360-807ade115a5a")],
  },
  {
    title: "Cloud Soft Sleepsuit",
    slug: "cloud-soft-sleepsuit",
    sku: "GP-NB-002",
    description: "A zip-up sleepsuit for quieter nights. Two-way zip so you never fully undress a sleepy baby.",
    brand: "GulPlaze Baby",
    category: "sleepsuits",
    price: 1650,
    costPrice: 780,
    material: "Cotton jersey",
    care: "Wash inside out at 30°C.",
    safety: "No loose trims. Zip guard at the chin.",
    ages: ["0-3m", "3-6m", "6-12m"],
    sizes: ["0-3M", "3-6M", "6-12M"],
    colors: [{ name: "Ivory", hex: "#FFF9F3" }],
    tags: ["newborn", "nightwear"],
    bestSeller: true,
    images: [img("photo-1519689680058-324335c77eba"), img("photo-1566004100631-35d015d6a491")],
  },
  {
    title: "Newborn Hospital Bag Set",
    slug: "newborn-hospital-bag-set",
    sku: "GP-NB-003",
    description:
      "Going-home outfit, two bodysuits, a muslin wrap, cap and mittens. Packed in a keep-forever box.",
    brand: "GulPlaze Baby",
    category: "newborn-gifts",
    price: 4500,
    costPrice: 2200,
    material: "Cotton",
    care: "Wash before first wear.",
    safety: "Hygiene-sensitive. Unworn items with tags may be exchanged within 7 days.",
    ages: ["0-3m"],
    tags: ["newborn", "gift", "hospital"],
    featured: true,
    giftReady: true,
    images: [img("photo-1515488044360-cc9c3e6f70a5"), img("photo-1470116945706-e6bf5d5a76e9")],
  },
  {
    title: "Muslin Swaddle 3-Pack",
    slug: "muslin-swaddle-3-pack",
    sku: "GP-NB-004",
    description: "Breathable muslin squares for swaddling, nursing cover or a picnic blanket later on.",
    brand: "GulPlaze Baby",
    category: "newborn-essentials",
    price: 2200,
    costPrice: 950,
    material: "Cotton muslin",
    care: "Gets softer with every wash.",
    safety: "Never cover baby's face. Always supervised.",
    ages: ["0-3m", "3-6m", "6-12m"],
    colors: [
      { name: "Blush", hex: "#F4C7C3" },
      { name: "Sky", hex: "#CFE3F1" },
    ],
    tags: ["newborn", "essentials"],
    giftReady: true,
    images: [img("photo-1522772543416-b2824961e6d5"), img("photo-1519689377413-9202eb3c7897")],
  },
  {
    title: "Knit Booties & Mittens",
    slug: "knit-booties-mittens",
    sku: "GP-NB-005",
    description: "Keep tiny hands and feet warm without extra bulk. Soft knit with gentle elastic.",
    brand: "GulPlaze Baby",
    category: "newborn-accessories",
    price: 890,
    costPrice: 320,
    material: "Cotton knit",
    care: "Hand wash recommended.",
    safety: "No pompoms or cords.",
    ages: ["0-3m", "3-6m"],
    tags: ["newborn", "accessories"],
    giftReady: true,
    images: [img("photo-1515488044360-cc6d4c0c0f0c").replace("cc6d4c0c0f0c", "1544126592-807ade115a0b")],
  },
  {
    title: "Floral Everyday Romper",
    slug: "floral-everyday-romper",
    sku: "GP-NB-006",
    description: "A light romper for warm days and family photos. Snap crotch, flutter sleeve.",
    brand: "Little Bloom",
    category: "rompers",
    price: 1450,
    costPrice: 600,
    gender: "girl",
    material: "Cotton voile",
    care: "Gentle wash, hang dry.",
    safety: "Dye-safe for sensitive skin.",
    ages: ["3-6m", "6-12m", "1-2y"],
    sizes: ["3-6M", "6-12M", "12-18M", "18-24M"],
    colors: [{ name: "Blush floral", hex: "#F4C7C3" }],
    tags: ["newborn", "clothing"],
    featured: true,
    images: [img("photo-1522771930-78848d9293e8").replace("1522771930-78848d9293e8", "1522771731739-25ba8c294327")],
  },
  {
    title: "Girls Linen Frock",
    slug: "girls-linen-frock",
    sku: "GP-KD-001",
    description: "Breathable linen-blend frock with a simple sash. For Eid mornings and everyday play.",
    brand: "Little Bloom",
    category: "girls-dresses",
    price: 2490,
    compareAt: 2990,
    costPrice: 1100,
    gender: "girl",
    material: "Linen blend",
    care: "Cool iron on reverse.",
    safety: "No scratchy linings.",
    ages: ["2-4y", "4-7y"],
    sizes: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y"],
    colors: [
      { name: "Sage", hex: "#A8C3A0" },
      { name: "Cream", hex: "#FFF9F3" },
    ],
    tags: ["kids", "girls", "clothing"],
    bestSeller: true,
    images: [img("photo-1503454537195-1dcabb73ffb9"), img("photo-1518834107812-67b0b7c58434")],
  },
  {
    title: "Boys Everyday Cotton Tee",
    slug: "boys-everyday-cotton-tee",
    sku: "GP-KD-002",
    description: "Soft jersey tee that survives playgrounds and family lunches.",
    brand: "Playfield",
    category: "boys-tees",
    price: 1290,
    costPrice: 480,
    gender: "boy",
    material: "Cotton jersey",
    care: "Machine wash.",
    safety: "Lead-free prints.",
    ages: ["2-4y", "4-7y", "7-10y"],
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: [
      { name: "Sky", hex: "#CFE3F1" },
      { name: "Charcoal", hex: "#2B2B2B" },
    ],
    tags: ["kids", "boys", "clothing"],
    bestSeller: true,
    images: [img("photo-1503944583220-79d8926ad5e2"), img("photo-1519238263530-99bdd11df2ea")],
  },
  {
    title: "Kids Nightwear Set",
    slug: "kids-nightwear-set",
    sku: "GP-KD-003",
    description: "Matching top and pants in brushed cotton. Quiet prints, elastic waist.",
    brand: "GulPlaze Baby",
    category: "kids-nightwear",
    price: 2190,
    costPrice: 900,
    material: "Brushed cotton",
    care: "Wash before first wear.",
    safety: "Snug fit, no loose cords.",
    ages: ["2-4y", "4-7y"],
    sizes: ["2Y", "4Y", "6Y"],
    colors: [{ name: "Moon cream", hex: "#FFF9F3" }],
    tags: ["kids", "nightwear"],
    images: [img("photo-1516627145497-ae6968895b74")],
  },
  {
    title: "Boys Kurta Shalwar",
    slug: "boys-kurta-shalwar",
    sku: "GP-KD-004",
    description: "Light cotton kurta set for Eid, weddings and Friday prayers. Easy wash, easy iron.",
    brand: "Little Bloom",
    category: "boys-ethnic",
    price: 3200,
    costPrice: 1400,
    gender: "boy",
    material: "Cotton lawn",
    care: "Warm iron.",
    safety: "Covered buttons.",
    ages: ["2-4y", "4-7y", "7-10y", "10-12y"],
    sizes: ["3Y", "5Y", "7Y", "9Y", "11Y"],
    colors: [
      { name: "Ivory", hex: "#FFF9F3" },
      { name: "Sage", hex: "#A8C3A0" },
    ],
    tags: ["kids", "ethnic", "eid"],
    featured: true,
    giftReady: true,
    images: [img("photo-1604671801908-6f0c6a092c05"), img("photo-1544716278-ca5e3f4abd8c")],
  },
  {
    title: "Girls Eid Frock",
    slug: "girls-eid-frock",
    sku: "GP-KD-005",
    description: "Soft organza overlay with cotton lining. Made for photographs and long family visits.",
    brand: "Little Bloom",
    category: "seasonal",
    price: 3890,
    compareAt: 4590,
    costPrice: 1800,
    gender: "girl",
    material: "Organza and cotton",
    care: "Dry clean or gentle hand wash.",
    safety: "Lined throughout. No sequin shedding.",
    ages: ["2-4y", "4-7y", "7-10y"],
    sizes: ["3Y", "5Y", "7Y", "9Y"],
    colors: [{ name: "Blush", hex: "#F4C7C3" }],
    tags: ["kids", "eid", "seasonal"],
    giftReady: true,
    images: [img("photo-1471286174890-9c112ffca5ba")],
  },
  {
    title: "Soft Canvas Sneakers",
    slug: "soft-canvas-sneakers",
    sku: "GP-KD-006",
    description: "First-walkers and playground shoes with a flexible sole.",
    brand: "Playfield",
    category: "kids-accessories",
    price: 2490,
    costPrice: 1100,
    material: "Canvas",
    care: "Wipe clean.",
    safety: "Non-slip sole. No small detachable parts.",
    ages: ["1-2y", "2-4y", "4-7y"],
    sizes: ["21", "23", "25", "27", "29"],
    colors: [{ name: "Cream", hex: "#F7EFE6" }],
    tags: ["kids", "shoes"],
    images: [img("photo-1542291026-7eec264c27ff")],
  },
  {
    title: "Wooden Rainbow Stacker",
    slug: "wooden-rainbow-stacker",
    sku: "GP-TY-001",
    description: "Classic arch stacker for quiet play and small hands. Natural wood, water-based stain.",
    brand: "Playfield",
    category: "educational",
    price: 1890,
    costPrice: 800,
    material: "Beech wood",
    care: "Wipe with a damp cloth.",
    safety: "Age 12 months+. No small parts. EN71 toy safety.",
    ages: ["1-2y", "2-4y"],
    tags: ["toys", "educational", "wood"],
    featured: true,
    bestSeller: true,
    images: [img("photo-1596461404969-9ae70f2830c1"), img("photo-1587654780291-39c9404d746b")],
  },
  {
    title: "Sensory Soft Bunny",
    slug: "sensory-soft-bunny",
    sku: "GP-TY-002",
    description: "A crinkle-eared bunny for tummy time. Machine-washable plush.",
    brand: "GulPlaze Baby",
    category: "soft-toys",
    price: 1290,
    costPrice: 500,
    material: "Plush polyester",
    care: "Gentle machine wash in a bag.",
    safety: "0 months+ with supervision. Embroidered eyes, no beads.",
    ages: ["0-3m", "3-6m", "6-12m", "1-2y"],
    tags: ["toys", "soft", "newborn"],
    giftReady: true,
    bestSeller: true,
    images: [img("photo-1555252333-9f8e92e65df9"), img("photo-1562047876-7b0c1c0c0c0c").replace("1562047876-7b0c1c0c0c0c", "1601758125946-6b3cce2c0953")],
  },
  {
    title: "Building Blocks 60-Piece",
    slug: "building-blocks-60",
    sku: "GP-TY-003",
    description: "Chunky blocks for towers that inevitably become cities.",
    brand: "Playfield",
    category: "blocks",
    price: 2490,
    costPrice: 1100,
    material: "ABS",
    care: "Wipe clean.",
    safety: "18 months+. Choking hazard for under 18 months.",
    ages: ["1-2y", "2-4y", "4-7y"],
    tags: ["toys", "blocks"],
    images: [img("photo-1587654780291-39c9404d746b")],
  },
  {
    title: "Farm Floor Puzzle",
    slug: "farm-floor-puzzle",
    sku: "GP-TY-004",
    description: "Large-piece puzzle for little hands and curious talkers.",
    brand: "Playfield",
    category: "puzzles",
    price: 990,
    costPrice: 380,
    material: "Cardboard",
    care: "Keep dry.",
    safety: "3 years+. Small parts warning for under 3.",
    ages: ["3-5y", "2-4y", "4-7y"],
    tags: ["toys", "puzzles"],
    images: [img("photo-1516627145497-ae6968895b74").replace("1516627145497-ae6968895b74", "1615486517262-8a2c0c0c0c0c")].map((u, i) =>
      i === 0 ? img("photo-1606092195730-5d7b9af1efc5") : u,
    ),
  },
  {
    title: "Pretend Kitchen Set",
    slug: "pretend-kitchen-set",
    sku: "GP-TY-005",
    description: "Wooden counter, pans and play food. Hours of 'just one more chai'.",
    brand: "Playfield",
    category: "pretend",
    price: 4590,
    compareAt: 5290,
    costPrice: 2200,
    material: "Wood and felt",
    care: "Wipe clean.",
    safety: "3 years+. Rounded corners.",
    ages: ["2-4y", "4-7y"],
    tags: ["toys", "pretend"],
    featured: true,
    images: [img("photo-1515488044360-807ade115a5a"), img("photo-1566576912321-d58ddd7a6088")],
  },
  {
    title: "Balance Bike Scooter",
    slug: "balance-bike-scooter",
    sku: "GP-TY-006",
    description: "A first ride-on with wide wheels for uneven courtyards.",
    brand: "Playfield",
    category: "outdoor",
    price: 3890,
    costPrice: 1800,
    material: "Steel and rubber",
    care: "Wipe frame, check screws monthly.",
    safety: "Helmet recommended. 3 years+.",
    ages: ["2-4y", "4-7y"],
    colors: [{ name: "Sage", hex: "#A8C3A0" }],
    tags: ["toys", "outdoor"],
    images: [img("photo-1504196606672-aef5c9cefc92")],
  },
  {
    title: "Art & Craft Case",
    slug: "art-craft-case",
    sku: "GP-TY-007",
    description: "Crayons, stickers and paper in one tin. For rainy afternoons.",
    brand: "Playfield",
    category: "art",
    price: 1790,
    costPrice: 700,
    material: "Paper and wax",
    care: "Keep away from heat.",
    safety: "Non-toxic crayons. 3 years+.",
    ages: ["4-7y", "7-10y"],
    tags: ["toys", "art"],
    images: [img("photo-1513364776144-60967b0f800f")],
  },
  {
    title: "Remote Control Car",
    slug: "remote-control-car",
    sku: "GP-TY-008",
    description: "Simple two-button remote. Ready after a short charge.",
    brand: "Playfield",
    category: "remote",
    price: 3290,
    costPrice: 1500,
    material: "ABS",
    care: "Charge with included cable only.",
    safety: "6 years+. Small parts. Not for under 6.",
    ages: ["4-7y", "7-10y", "10-12y"],
    tags: ["toys", "remote"],
    images: [img("photo-1594787318284-9a8f2c1c0c0c").replace("1594787318284-9a8f2c1c0c0c", "1558618666-fcd25c85cd64")],
  },
  {
    title: "City Compact Stroller",
    slug: "city-compact-stroller",
    sku: "GP-MC-001",
    description: "One-hand fold, dappled shade, and wheels that cope with Lahore and Karachi streets.",
    brand: "Nest & Go",
    category: "strollers",
    price: 18900,
    compareAt: 21900,
    costPrice: 11000,
    material: "Aluminium and oxford cloth",
    care: "Wipe frame. Spot-clean fabric.",
    safety: "Meets stroller stability standards. Use harness always. Birth to 15 kg with newborn insert.",
    ages: ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y"],
    colors: [
      { name: "Sage grey", hex: "#A8C3A0" },
      { name: "Charcoal", hex: "#2B2B2B" },
    ],
    stock: 8,
    tags: ["gear", "stroller"],
    featured: true,
    bestSeller: true,
    images: [img("photo-1591871937573-74dbba515c4c"), img("photo-1544126592-807ade115a0b")],
  },
  {
    title: "Infant Car Seat",
    slug: "infant-car-seat",
    sku: "GP-MC-002",
    description: "Rear-facing infant seat with side-impact protection. For the first journeys home.",
    brand: "Nest & Go",
    category: "car-seats",
    price: 22500,
    costPrice: 13000,
    material: "EPS foam and fabric",
    care: "Follow manual. Do not machine-wash harness.",
    safety: "ECE R44/04. Rear-facing only. Birth to 13 kg. Never on a front seat with airbag.",
    ages: ["0-3m", "3-6m", "6-12m"],
    stock: 5,
    tags: ["gear", "car-seat", "safety"],
    featured: true,
    images: [img("photo-1449965408869-eaa3f722e40d")],
  },
  {
    title: "Soft Structured Carrier",
    slug: "soft-structured-carrier",
    sku: "GP-MC-003",
    description: "Ergonomic carrier for hip-healthy positioning. For market days and sleepy walks.",
    brand: "Nest & Go",
    category: "carriers",
    price: 8900,
    costPrice: 4200,
    material: "Cotton canvas",
    care: "Machine wash carrier body. Wipe buckles.",
    safety: "Follow T.I.C.K.S. rules. Newborn insert included.",
    ages: ["0-3m", "3-6m", "6-12m", "1-2y"],
    tags: ["gear", "carrier"],
    images: [img("photo-1544124499-58912cbddaad")],
  },
  {
    title: "Moses Carrycot",
    slug: "moses-carrycot",
    sku: "GP-MC-004",
    description: "A first bed that moves from room to room. Firm mattress, breathable sides.",
    brand: "Nest & Go",
    category: "gear",
    price: 12500,
    costPrice: 6200,
    material: "Palm and cotton",
    care: "Air mattress weekly. Spot-clean fabric.",
    safety: "Firm flat sleep surface. No extras in the cot. Back to sleep.",
    ages: ["0-3m", "3-6m"],
    tags: ["gear", "carrycot", "sleep"],
    featured: true,
    images: [img("photo-1522771739844-6a9f6d5f14af"), img("photo-1519689377413-9202eb3c7897")],
  },
  {
    title: "Baby Walker",
    slug: "baby-walker",
    sku: "GP-MC-005",
    description: "Height-adjustable walker with activity tray. Use only on even floors, never stairs.",
    brand: "Nest & Go",
    category: "gear",
    price: 6500,
    costPrice: 3100,
    material: "Plastic and steel",
    care: "Wipe tray after snacks.",
    safety: "Never leave unattended. Avoid stairs and heat. ASTM style warnings on carton.",
    ages: ["6-12m", "1-2y"],
    tags: ["gear", "walker"],
    images: [img("photo-1566004100631-35d015d6a491")],
  },
  {
    title: "Feeding Bottle Starter Set",
    slug: "feeding-bottle-starter-set",
    sku: "GP-MC-006",
    description: "Anti-colic bottles, slow-flow teats and a travel cap. For mixed feeding families.",
    brand: "Nurture",
    category: "feeding",
    price: 2490,
    costPrice: 1100,
    material: "PP and silicone",
    care: "Sterilise before first use. Replace teats regularly.",
    safety: "BPA-free. Inspect teats for wear.",
    ages: ["0-3m", "3-6m", "6-12m"],
    giftReady: true,
    tags: ["feeding", "bottles"],
    images: [img("photo-1584839397760-1c1c1c1c1c1c").replace("1584839397760-1c1c1c1c1c1c", "1584839397761-cbb3c1c1c1c1")].map(() =>
      img("photo-1584839397761-29a5fe1d62cd"),
    ),
  },
  {
    title: "Electric Breast Pump",
    slug: "electric-breast-pump",
    sku: "GP-MC-007",
    description: "Quiet double pump with closed system. For returning to work without rushing.",
    brand: "Nurture",
    category: "feeding",
    price: 8900,
    costPrice: 4500,
    material: "PP and silicone",
    care: "Wash parts that touch milk. Do not immerse motor.",
    safety: "Personal use item. Not returnable once opened for hygiene.",
    ages: ["0-3m", "3-6m", "6-12m"],
    tags: ["feeding", "pump", "maternity"],
    images: [img("photo-1555252333-9f8e92e65df9")],
  },
  {
    title: "Bath Tub and Hooded Towel",
    slug: "bath-tub-hooded-towel",
    sku: "GP-MC-008",
    description: "Newborn sling insert plus a hooded towel in cream terry.",
    brand: "Nurture",
    category: "bath",
    price: 3290,
    costPrice: 1400,
    material: "PP and cotton terry",
    care: "Towel: machine wash. Tub: rinse after each bath.",
    safety: "Never leave a baby in water unattended.",
    ages: ["0-3m", "3-6m", "6-12m"],
    giftReady: true,
    tags: ["bath", "newborn"],
    images: [img("photo-1515488044360-cc9c3e6f70a5")],
  },
  {
    title: "Calming Baby Lotion",
    slug: "calming-baby-lotion",
    sku: "GP-MC-009",
    description: "Light lotion with oat and shea. Unscented enough for evening massage.",
    brand: "Nurture",
    category: "bath",
    price: 1490,
    costPrice: 520,
    material: "Oat and shea",
    care: "Patch test. Store away from heat.",
    safety: "Personal care. Unopened returns only.",
    ages: ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y"],
    tags: ["skincare", "bath"],
    images: [img("photo-1556228720-195a672e8a03")],
  },
  {
    title: "Nursing Wrap Top",
    slug: "nursing-wrap-top",
    sku: "GP-MC-010",
    description: "A wrap top that looks like a blouse. Hidden openings, soft viscose.",
    brand: "Nurture",
    category: "maternity",
    price: 2890,
    costPrice: 1200,
    gender: "none",
    material: "Viscose",
    care: "Gentle wash.",
    safety: "—",
    ages: ["0-3m", "3-6m", "6-12m"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Sage", hex: "#A8C3A0" }],
    tags: ["maternity", "nursing"],
    images: [img("photo-1487412947147-5cebf100ffc2")],
  },
  {
    title: "Weekender Diaper Bag",
    slug: "weekender-diaper-bag",
    sku: "GP-MC-011",
    description: "Insulated bottle pocket, changing mat, and a shape that does not shout 'baby bag'.",
    brand: "Nest & Go",
    category: "diapering",
    price: 4590,
    costPrice: 2100,
    material: "Water-resistant canvas",
    care: "Wipe clean.",
    safety: "—",
    ages: ["0-3m", "3-6m", "6-12m", "1-2y"],
    giftReady: true,
    tags: ["diapering", "bag"],
    images: [img("photo-1547949003-9792a18a2601")],
  },
  {
    title: "Digital Thermometer",
    slug: "digital-thermometer",
    sku: "GP-MC-012",
    description: "Fast reading with a gentle beep. Keep one in the night-stand drawer.",
    brand: "Nurture",
    category: "health",
    price: 1890,
    costPrice: 700,
    material: "ABS",
    care: "Wipe probe. Replace battery as needed.",
    safety: "Follow age instructions in the leaflet.",
    ages: ["0-3m", "3-6m", "6-12m", "1-2y", "2-4y", "4-7y"],
    tags: ["health", "safety"],
    images: [img("photo-1584308666744-24d5c474f2ae")],
  },
  {
    title: "Newborn Welcome Hamper",
    slug: "newborn-welcome-hamper",
    sku: "GP-GF-001",
    description: "Bodysuit, swaddle, bunny and a handwritten card. We wrap it for you.",
    brand: "GulPlaze Baby",
    category: "newborn-gifts",
    price: 5500,
    costPrice: 2600,
    material: "Mixed",
    care: "See inner items.",
    safety: "Gift-ready. Hygiene rules apply to opened babywear.",
    ages: ["0-3m"],
    giftReady: true,
    featured: true,
    tags: ["gift", "newborn", "hamper"],
    images: [img("photo-1513885535751-8b9238bd345a"), img("photo-1549465220-1a8b9238bd34")],
  },
  {
    title: "Birthday Gift Box",
    slug: "birthday-gift-box",
    sku: "GP-GF-002",
    description: "A toy, a small outfit and wrapping under Rs. 3,000. For cousins who always forget until the night before.",
    brand: "GulPlaze Baby",
    category: "gifts",
    price: 2990,
    costPrice: 1400,
    material: "Mixed",
    care: "See inner items.",
    safety: "Check age label on the toy.",
    ages: ["1-2y", "2-4y", "4-7y"],
    giftReady: true,
    tags: ["gift", "birthday", "budget"],
    images: [img("photo-1513885535751-8b9238bd345a")],
  },
];

async function main() {
  const tables = [
    "reviewVote",
    "review",
    "answer",
    "question",
    "wishlistItem",
    "cartItem",
    "cart",
    "orderItem",
    "payment",
    "shipment",
    "orderStatusHistory",
    "returnRequest",
    "order",
    "bundleItem",
    "bundle",
    "collectionProduct",
    "productAge",
    "productImage",
    "stockHistory",
    "productVariant",
    "backInStock",
    "product",
    "collection",
    "category",
    "brand",
    "coupon",
    "flashSale",
    "giftCard",
    "shippingRate",
    "pageRevision",
    "page",
    "blogPost",
    "blogCategory",
    "menu",
    "announcement",
    "popup",
    "homepageSection",
    "setting",
    "notificationTemplate",
    "popularSearch",
    "mediaAsset",
    "mediaFolder",
    "activityLog",
    "notificationInbox",
  ] as const;

  for (const table of tables) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any)[table].deleteMany();
    } catch {
      /* empty db */
    }
  }

  const password = await hashPassword("GulplazeAdmin1!");
  const customerPassword = await hashPassword("Password123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@gulplaze.shop" },
    update: { role: "admin" },
    create: {
      id: nanoid(),
      name: "GulPlaze Admin",
      email: "admin@gulplaze.shop",
      emailVerified: true,
      role: "admin",
      phone: "03001234567",
      referralCode: "ADMIN",
    },
  });
  await prisma.account.deleteMany({ where: { userId: admin.id, providerId: "credential" } });
  await prisma.account.create({
    data: {
      id: nanoid(),
      accountId: admin.id,
      providerId: "credential",
      userId: admin.id,
      password,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "amina@example.com" },
    update: {},
    create: {
      id: nanoid(),
      name: "Amina Khan",
      email: "amina@example.com",
      emailVerified: true,
      role: "customer",
      phone: "03211234567",
      loyaltyPoints: 240,
      referralCode: "AMINA240",
    },
  });
  await prisma.account.deleteMany({ where: { userId: customer.id, providerId: "credential" } });
  await prisma.account.create({
    data: {
      id: nanoid(),
      accountId: customer.id,
      providerId: "credential",
      userId: customer.id,
      password: customerPassword,
    },
  });

  await prisma.childProfile.create({
    data: {
      userId: customer.id,
      name: "Zara",
      birthday: new Date("2024-04-12"),
      ageKey: "1-2y",
      gender: "girl",
    },
  });
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "Amina Khan",
      phone: "03211234567",
      city: "Lahore",
      area: "DHA",
      address: "House 12, Street 7, Phase 6",
      isDefault: true,
    },
  });

  const brandNames = ["GulPlaze Baby", "Little Bloom", "Playfield", "Nest & Go", "Nurture"];
  const brands = Object.fromEntries(
    await Promise.all(
      brandNames.map(async (name) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const row = await prisma.brand.create({ data: { name, slug } });
        return [name, row] as const;
      }),
    ),
  );

  const categoryTree: { name: string; slug: string; parent?: string; featured?: boolean }[] = [
    { name: "Newborn & Baby", slug: "newborn", featured: true },
    { name: "Bodysuits", slug: "bodysuits", parent: "newborn" },
    { name: "Rompers", slug: "rompers", parent: "newborn" },
    { name: "Sleepsuits", slug: "sleepsuits", parent: "newborn" },
    { name: "Newborn accessories", slug: "newborn-accessories", parent: "newborn" },
    { name: "Newborn essentials", slug: "newborn-essentials", parent: "newborn" },
    { name: "Newborn gifts", slug: "newborn-gifts", parent: "newborn" },
    { name: "Kids Clothing", slug: "kids", featured: true },
    { name: "Girls dresses", slug: "girls-dresses", parent: "kids" },
    { name: "Girls tops", slug: "girls-tops", parent: "kids" },
    { name: "Boys tees", slug: "boys-tees", parent: "kids" },
    { name: "Boys bottoms", slug: "boys-bottoms", parent: "kids" },
    { name: "Boys ethnic", slug: "boys-ethnic", parent: "kids" },
    { name: "Kids nightwear", slug: "kids-nightwear", parent: "kids" },
    { name: "Seasonal", slug: "seasonal", parent: "kids" },
    { name: "Kids accessories", slug: "kids-accessories", parent: "kids" },
    { name: "Toys", slug: "toys", featured: true },
    { name: "Educational", slug: "educational", parent: "toys" },
    { name: "Soft toys", slug: "soft-toys", parent: "toys" },
    { name: "Building blocks", slug: "blocks", parent: "toys" },
    { name: "Puzzles", slug: "puzzles", parent: "toys" },
    { name: "Pretend play", slug: "pretend", parent: "toys" },
    { name: "Outdoor", slug: "outdoor", parent: "toys" },
    { name: "Art & craft", slug: "art", parent: "toys" },
    { name: "Remote control", slug: "remote", parent: "toys" },
    { name: "Mother Care", slug: "mother-care", featured: true },
    { name: "Gear", slug: "gear", parent: "mother-care" },
    { name: "Strollers", slug: "strollers", parent: "mother-care" },
    { name: "Car seats", slug: "car-seats", parent: "mother-care" },
    { name: "Carriers", slug: "carriers", parent: "mother-care" },
    { name: "Feeding", slug: "feeding", parent: "mother-care" },
    { name: "Diapering", slug: "diapering", parent: "mother-care" },
    { name: "Bath & skincare", slug: "bath", parent: "mother-care" },
    { name: "Maternity", slug: "maternity", parent: "mother-care" },
    { name: "Health & safety", slug: "health", parent: "mother-care" },
    { name: "Gifts", slug: "gifts", featured: true },
  ];

  const cats: Record<string, string> = {};
  for (const [i, cat] of categoryTree.entries()) {
    const row = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        featured: Boolean(cat.featured),
        sortOrder: i,
        parentId: cat.parent ? cats[cat.parent] : null,
        image: products[i % products.length]?.images[0],
      },
    });
    cats[cat.slug] = row.id;
  }

  const createdProducts: { id: string; slug: string; category: string }[] = [];

  for (const p of products) {
    const sizes = p.sizes ?? [""];
    const colors = p.colors ?? [{ name: "", hex: "" }];
    const created = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        sku: p.sku,
        brandId: brands[p.brand].id,
        categoryId: cats[p.category],
        price: p.price,
        compareAt: p.compareAt,
        costPrice: p.costPrice,
        gender: p.gender ?? "unisex",
        material: p.material,
        care: p.care,
        safety: p.safety,
        tags: JSON.stringify(p.tags),
        featured: Boolean(p.featured),
        bestSeller: Boolean(p.bestSeller),
        giftReady: Boolean(p.giftReady),
        status: "active",
        publishedAt: new Date(),
        weightGrams: p.price > 10000 ? 8000 : 400,
        images: {
          create: p.images.map((url, i) => ({ url, alt: p.title, sortOrder: i })),
        },
        ages: { create: p.ages.map((ageKey) => ({ ageKey })) },
        variants: {
          create: sizes.flatMap((size, si) =>
            colors.map((color, ci) => ({
              name: [color.name, size].filter(Boolean).join(" / ") || "Default",
              sku: `${p.sku}-${si}${ci}`,
              size,
              color: color.name,
              colorHex: color.hex,
              stock: p.stock ?? 12 + ((si + ci) % 8),
            })),
          ),
        },
      },
    });
    createdProducts.push({ id: created.id, slug: p.slug, category: p.category });
  }

  const giftCol = await prisma.collection.create({
    data: { name: "Gift ready", slug: "gift-ready", type: "manual" },
  });
  const saleCol = await prisma.collection.create({
    data: {
      name: "Sale",
      slug: "sale",
      type: "automatic",
      rules: JSON.stringify({ compareAt: true }),
    },
  });
  for (const p of createdProducts.filter((_, i) => products[i]?.giftReady)) {
    await prisma.collectionProduct.create({
      data: { collectionId: giftCol.id, productId: p.id },
    });
  }
  for (const [i, p] of createdProducts.entries()) {
    if (products[i]?.compareAt) {
      await prisma.collectionProduct.create({
        data: { collectionId: saleCol.id, productId: p.id },
      });
    }
  }

  const stroller = createdProducts.find((p) => p.slug === "city-compact-stroller");
  const carSeat = createdProducts.find((p) => p.slug === "infant-car-seat");
  if (stroller && carSeat) {
    await prisma.bundle.create({
      data: {
        name: "First journeys pair",
        slug: "first-journeys",
        discountPct: 10,
        items: {
          create: [{ productId: stroller.id }, { productId: carSeat.id }],
        },
      },
    });
  }

  await prisma.coupon.createMany({
    data: [
      { code: "BLOOM10", type: "percent", value: 10, firstOrderOnly: true, minSpend: 0 },
      { code: "WELCOME300", type: "fixed", value: 300, minSpend: 2000 },
      { code: "FREESHIP", type: "free_shipping", value: 0, minSpend: 2500 },
    ],
  });

  await prisma.flashSale.create({
    data: {
      name: "Weekend soft toys",
      percent: 15,
      startsAt: new Date(Date.now() - 3600_000),
      endsAt: new Date(Date.now() + 3 * 24 * 3600_000),
      productIds: JSON.stringify(
        createdProducts.filter((p) => p.slug.includes("bunny") || p.slug.includes("stacker")).map((p) => p.id),
      ),
    },
  });

  await prisma.giftCard.create({
    data: { code: "GIFT-5000", balance: 5000, initial: 5000 },
  });

  const cities = [
    ["Karachi", 200],
    ["Lahore", 200],
    ["Islamabad", 220],
    ["Rawalpindi", 220],
    ["Faisalabad", 250],
    ["Multan", 280],
    ["Peshawar", 300],
    ["Quetta", 350],
    ["Default", 300],
  ] as const;
  await prisma.shippingRate.createMany({
    data: cities.map(([city, rate]) => ({ city, rate })),
  });

  const bunny = createdProducts.find((p) => p.slug === "sensory-soft-bunny");
  const frock = createdProducts.find((p) => p.slug === "girls-linen-frock");
  if (bunny) {
    await prisma.review.create({
      data: {
        productId: bunny.id,
        userId: customer.id,
        authorName: "Amina Khan",
        rating: 5,
        title: "So soft",
        body: "Zara sleeps holding this. Washed well, eyes still stitched.",
        photos: JSON.stringify([img("photo-1555252333-9f8e92e65df9")]),
        verified: true,
      },
    });
  }
  if (frock) {
    await prisma.review.create({
      data: {
        productId: frock.id,
        authorName: "Hira S.",
        rating: 5,
        title: "True to size",
        body: "Used the size guide. Arrived in two days to DHA.",
        verified: true,
      },
    });
  }

  await prisma.announcement.create({
    data: {
      messages: JSON.stringify([
        "Free delivery over Rs. 3,000",
        "Cash on delivery available",
        "Easy exchange on unused clothing",
      ]),
    },
  });

  await prisma.popup.create({
    data: {
      title: "A little welcome",
      body: "10% off your first order with BLOOM10.",
      coupon: "BLOOM10",
    },
  });

  const sections = [
    { type: "hero", title: "Hero", sortOrder: 0, data: { slides: [{ headline: "Where little ones bloom", line: "Clothes, toys and gentle gear for their first twelve years.", cta: "Shop New Arrivals", href: "/shop?sort=newest", image: img("photo-1515488044360-807ade115a5a") }, { headline: "Gifts that feel considered", line: "Hampers, boxes and wrap, ready for the hospital bag.", cta: "Shop gifts", href: "/gifts", image: img("photo-1513885535751-8b9238bd345a") }, { headline: "Mother care, made calmer", line: "Strollers, seats and carriers chosen for real Pakistani days.", cta: "Explore gear", href: "/category/mother-care", image: img("photo-1591871937573-74dbba515c4c") }] } },
    { type: "shopByAge", title: "Shop by Age", sortOrder: 1, data: {} },
    { type: "categoryTiles", title: "Shop by Category", sortOrder: 2, data: {} },
    { type: "bestSellers", title: "Best Sellers", sortOrder: 3, data: { tabs: ["Clothes", "Toys", "Mother Care"] } },
    { type: "featureBanner", title: "Gift banner", sortOrder: 4, data: { title: "Newborn gift sets", text: "Thoughtful boxes for hospital bags and welcome-home days.", href: "/gifts", image: img("photo-1513885535751-8b9238bd345a") } },
    { type: "newArrivals", title: "New Arrivals", sortOrder: 5, data: {} },
    { type: "motherCare", title: "Mother Care", sortOrder: 6, data: {} },
    { type: "trustStrip", title: "Trust", sortOrder: 7, data: {} },
    { type: "reviews", title: "Reviews", sortOrder: 8, data: {} },
    { type: "shopByBudget", title: "Budget", sortOrder: 9, data: { tiles: [1500, 3000, 5000] } },
    { type: "blog", title: "Journal", sortOrder: 10, data: {} },
    { type: "instagram", title: "Instagram", sortOrder: 11, data: {} },
    { type: "newsletter", title: "Newsletter", sortOrder: 12, data: {} },
  ];
  for (const s of sections) {
    await prisma.homepageSection.create({
      data: { type: s.type, title: s.title, sortOrder: s.sortOrder, data: JSON.stringify(s.data) },
    });
  }

  await prisma.menu.create({
    data: {
      handle: "header",
      items: JSON.stringify([
        { label: "Newborn", href: "/category/newborn" },
        { label: "Kids Clothing", href: "/category/kids" },
        { label: "Toys", href: "/category/toys" },
        { label: "Mother Care", href: "/category/mother-care" },
        { label: "Gifts", href: "/gifts" },
        { label: "Sale", href: "/sale" },
      ]),
    },
  });
  await prisma.menu.create({
    data: {
      handle: "footer",
      items: JSON.stringify([
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Size guides", href: "/size-guide" },
      ]),
    },
  });

  const pages = [
    ["About Us", "about", "GulPlaze is a blooming marketplace for little ones. We started with a simple wish: clothes that feel kind on newborn skin, toys that last beyond one afternoon, and gear a mother can trust on a long day.\n\nWe buy carefully, photograph honestly, and write like a friend. Pakistan first — PKR, cash on delivery, and couriers you already know."],
    ["Shipping", "shipping", "We ship across Pakistan with TCS, Leopards and partner couriers.\n\nMetro cities usually arrive in 1–3 working days. Other cities 3–5. Free delivery over Rs. 3,000.\n\nYou will receive a tracking link by SMS and WhatsApp when the parcel is booked."],
    ["Returns and Exchange", "returns", "We want you to feel safe buying for a baby online.\n\nClothing and unused toys may be exchanged within 7 days if tags are on and items are unworn.\n\nFor hygiene, we cannot accept returns on opened feeding, bath, skincare, innerwear, or used baby gear. Faulty items are replaced or refunded after a photo review.\n\nWrite to hello@gulplaze.shop or WhatsApp us with your order number."],
    ["Hygiene Policy", "hygiene", "Baby items sit close to skin and mouths. We keep warehouse handling clean, and we are clear about what cannot come back once opened: bottles, teats, pumps, lotions, diapers, underwear, and used sleep products.\n\nIf something arrives damaged or incorrect, tell us within 48 hours."],
    ["Refund Policy", "refund", "Refunds are issued to the original method where possible. COD refunds are sent via bank transfer or store credit within 7 working days after we receive the item.\n\nPartial refunds are available if only one piece from a set is faulty."],
    ["Privacy Policy", "privacy", "We collect your name, phone, address and order history to fulfil orders. We do not sell your data. Pixels and analytics run only with consent. You may ask us to delete your account.\n\nChild profiles are optional and used only for age-right suggestions and birthday notes."],
    ["Terms", "terms", "By placing an order you agree to our prices in PKR, our hygiene policy, and that product colours may vary slightly from screens. Gift cards cannot be exchanged for cash."],
    ["FAQ", "faq", ""],
    ["Size Guide", "size-guide", ""],
    ["Contact", "contact", "WhatsApp, phone and a small studio in Lahore. We reply within a few hours on working days."],
  ] as const;
  for (const [title, slug, body] of pages) {
    await prisma.page.create({ data: { title, slug, body, status: "published" } });
  }

  const journal = await prisma.blogCategory.create({ data: { name: "Newborn care", slug: "newborn-care" } });
  const giftsCat = await prisma.blogCategory.create({ data: { name: "Gift ideas", slug: "gift-ideas" } });
  const toysCat = await prisma.blogCategory.create({ data: { name: "Toys by age", slug: "toys-by-age" } });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "What to pack in a Pakistani hospital bag",
        slug: "hospital-bag-pakistan",
        excerpt: "A calm list for the last weeks: clothes, papers, snacks, and what the ward actually has.",
        body: "<p>Keep it light. Two going-home outfits, muslin wraps, extra pads, documents, a long charger, and snacks you actually like.</p><p>Hospitals are air-conditioned. A light knit for you and a cotton layer for baby is enough for most cities.</p>",
        cover: img("photo-1515488044360-807ade115a5a"),
        categoryId: journal.id,
        status: "published",
        publishedAt: new Date(),
      },
      {
        title: "Toys for a three-year-old who already has too many",
        slug: "toys-for-3-year-old",
        excerpt: "Open-ended play wins: blocks, pretend kitchens, outdoor balance.",
        body: "<p>At three, the best toys still ask the child to do the imagining. Skip one-button gadgets if the cupboard is already full.</p>",
        cover: img("photo-1596461404969-9ae70f2830c1"),
        categoryId: toysCat.id,
        status: "published",
        publishedAt: new Date(),
      },
      {
        title: "How to choose a stroller for Pakistani streets",
        slug: "choose-stroller-pakistan",
        excerpt: "Wheels, fold, shade and boot space — a practical buying guide.",
        body: "<p>Look for a one-hand fold, decent shade, and wheels that are not tiny suitcase casters. Test the fold in the shop or on a video call with us.</p>",
        cover: img("photo-1591871937573-74dbba515c4c"),
        categoryId: giftsCat.id,
        status: "published",
        publishedAt: new Date(),
      },
    ],
  });

  await prisma.setting.createMany({
    data: [
      {
        key: "storeInfo",
        value: JSON.stringify({
          name: "GulPlaze",
          tagline: "Where little ones bloom",
          email: "hello@gulplaze.shop",
          phone: "+92 300 1234567",
          whatsapp: "923001234567",
          address: "DHA Phase 6, Lahore, Pakistan",
          instagram: "https://instagram.com/gulplaze",
          facebook: "https://facebook.com/gulplaze",
          tiktok: "https://tiktok.com/@gulplaze",
          freeShippingThreshold: 3000,
          giftWrapPrice: 200,
          bankName: "Meezan Bank",
          bankAccount: "GulPlaze",
          bankIban: "PK00MEZN0000000000000000",
          pixels: { ga4: "", gtm: "", meta: "", tiktok: "" },
        }),
      },
      {
        key: "theme",
        value: JSON.stringify({
          logoText: "gulplaze",
          background: "#FFF9F3",
          primary: "#A8C3A0",
          cta: "#F2836B",
          radius: "18px",
        }),
      },
    ],
  });

  await prisma.notificationTemplate.createMany({
    data: [
      { key: "order_placed", channel: "email", subject: "We have your order {{number}}", body: "Thank you. We are confirming {{number}}." },
      { key: "abandoned_cart", channel: "whatsapp", subject: "", body: "You left something soft in your GulPlaze basket. We kept it aside." },
      { key: "review_request", channel: "email", subject: "How did it feel?", body: "If you have a moment, a photo review helps other mothers." },
    ],
  });

  await prisma.popularSearch.createMany({
    data: [
      { query: "stroller", count: 40 },
      { query: "newborn gift", count: 36 },
      { query: "romper", count: 22 },
      { query: "car seat", count: 18 },
    ],
  });

  await prisma.mediaFolder.create({
    data: {
      name: "Products",
      assets: {
        create: {
          url: img("photo-1522771739844-6a9f6d5f14af"),
          filename: "bodysuit.jpg",
          mimeType: "image/jpeg",
          alt: "Organic bodysuit",
        },
      },
    },
  });

  console.log("Seeded GulPlaze. Admin: admin@gulplaze.shop / GulplazeAdmin1!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
