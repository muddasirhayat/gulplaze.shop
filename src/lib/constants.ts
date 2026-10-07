export const STORE_NAME = "GulPlaze";
export const TAGLINE = "Where little ones bloom";
export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "ur"] as const;
export type Locale = (typeof LOCALES)[number];

export const AGE_RANGES = [
  { key: "0-3m", label: "0–3 months", labelUr: "0–3 ماہ", months: [0, 3], pastel: "#F4C7C3" },
  { key: "3-6m", label: "3–6 months", labelUr: "3–6 ماہ", months: [3, 6], pastel: "#CFE3F1" },
  { key: "6-12m", label: "6–12 months", labelUr: "6–12 ماہ", months: [6, 12], pastel: "#A8C3A0" },
  { key: "1-2y", label: "1–2 years", labelUr: "1–2 سال", months: [12, 24], pastel: "#F4E4C1" },
  { key: "2-4y", label: "2–4 years", labelUr: "2–4 سال", months: [24, 48], pastel: "#F4C7C3" },
  { key: "4-7y", label: "4–7 years", labelUr: "4–7 سال", months: [48, 84], pastel: "#CFE3F1" },
  { key: "7-10y", label: "7–10 years", labelUr: "7–10 سال", months: [84, 120], pastel: "#A8C3A0" },
  { key: "10-12y", label: "10–12 years", labelUr: "10–12 سال", months: [120, 144], pastel: "#E8D5F2" },
] as const;

export type AgeKey = (typeof AGE_RANGES)[number]["key"];

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Hyderabad",
  "Gujranwala",
  "Sargodha",
  "Bahawalpur",
  "Sukkur",
  "Abbottabad",
  "Mardan",
  "Rahim Yar Khan",
  "Sahiwal",
  "Okara",
  "Wah Cantonment",
] as const;

export const CITY_AREAS: Record<string, string[]> = {
  Karachi: ["Clifton", "DHA", "Gulshan-e-Iqbal", "North Nazimabad", "PECHS", "Saddar", "Korangi", "Malir"],
  Lahore: ["DHA", "Gulberg", "Johar Town", "Model Town", "Bahria Town", "Cantt", "Garden Town"],
  Islamabad: ["F-6", "F-7", "F-8", "F-10", "F-11", "G-9", "G-11", "Bahria Town"],
  Rawalpindi: ["Saddar", "Bahria Town", "Westridge", "Satellite Town", "Chaklala"],
  Faisalabad: ["D Ground", "Madina Town", "Peoples Colony", "Jinnah Colony"],
  Multan: ["Cantt", "Gulgasht", "Shah Rukn-e-Alam", "Bosan Road"],
  Peshawar: ["University Town", "Hayatabad", "Saddar", "Cantt"],
  Quetta: ["Cantt", "Jinnah Town", "Satellite Town"],
};

export const FREE_SHIPPING_THRESHOLD = 3000;
export const GIFT_WRAP_PRICE = 200;
export const COD_FEE = 0;
export const LOYALTY_EARN_PER_100 = 1;
export const LOYALTY_RUPEE_PER_POINT = 1;
export const REFERRAL_REWARD = 300;
export const FIRST_ORDER_COUPON = "BLOOM10";

export const ORDER_STATUSES = [
  "pending_confirmation",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "exchanged",
] as const;

export const STAFF_ROLES = ["admin", "manager", "packer", "support"] as const;

export const MEGA_NAV = [
  {
    label: "Newborn",
    href: "/category/newborn",
    featured: { title: "Hospital bag sets", href: "/category/newborn-essentials", image: "" },
    groups: [
      {
        title: "Clothing",
        links: [
          { label: "Bodysuits", href: "/category/bodysuits" },
          { label: "Rompers", href: "/category/rompers" },
          { label: "Sleepsuits", href: "/category/sleepsuits" },
          { label: "Caps & mittens", href: "/category/newborn-accessories" },
        ],
      },
      {
        title: "Essentials",
        links: [
          { label: "Swaddles", href: "/category/newborn-essentials" },
          { label: "Gift sets", href: "/category/newborn-gifts" },
        ],
      },
    ],
  },
  {
    label: "Kids Clothing",
    href: "/category/kids",
    featured: { title: "Eid looks", href: "/category/seasonal", image: "" },
    groups: [
      {
        title: "Girls",
        links: [
          { label: "Dresses", href: "/category/girls-dresses" },
          { label: "Tops", href: "/category/girls-tops" },
          { label: "Nightwear", href: "/category/kids-nightwear" },
        ],
      },
      {
        title: "Boys",
        links: [
          { label: "T-shirts", href: "/category/boys-tees" },
          { label: "Bottoms", href: "/category/boys-bottoms" },
          { label: "Ethnic wear", href: "/category/boys-ethnic" },
        ],
      },
    ],
  },
  {
    label: "Toys",
    href: "/category/toys",
    featured: { title: "Educational picks", href: "/category/educational", image: "" },
    groups: [
      {
        title: "By type",
        links: [
          { label: "Soft toys", href: "/category/soft-toys" },
          { label: "Building blocks", href: "/category/blocks" },
          { label: "Puzzles", href: "/category/puzzles" },
          { label: "Outdoor", href: "/category/outdoor" },
        ],
      },
    ],
  },
  {
    label: "Mother Care",
    href: "/category/mother-care",
    featured: { title: "Strollers & gear", href: "/category/gear", image: "" },
    groups: [
      {
        title: "Gear",
        links: [
          { label: "Strollers", href: "/category/strollers" },
          { label: "Car seats", href: "/category/car-seats" },
          { label: "Carriers", href: "/category/carriers" },
        ],
      },
      {
        title: "Care",
        links: [
          { label: "Feeding", href: "/category/feeding" },
          { label: "Bath & skincare", href: "/category/bath" },
          { label: "Maternity", href: "/category/maternity" },
        ],
      },
    ],
  },
  { label: "Gifts", href: "/gifts", featured: null, groups: [] },
  { label: "Sale", href: "/sale", featured: null, groups: [] },
] as const;
