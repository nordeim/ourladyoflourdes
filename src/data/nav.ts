export interface NavLink {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  to?: string;
  description?: string;
  children?: NavLink[];
}

export const primaryNav: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    description: "Our parish, our monument, and our story",
    children: [
      { label: "The Parish", to: "/about" },
      { label: "Our History", to: "/history" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    label: "Worship",
    description: "Mass times, reconciliation, and how to find us",
    children: [
      { label: "Mass Times", to: "/worship#mass" },
      { label: "Reconciliation & Adoration", to: "/worship#confession" },
      { label: "Find Us", to: "/worship#visit" },
    ],
  },
  {
    label: "Sacraments",
    description: "Baptism to Anointing — grace for every season",
    children: [
      { label: "Infant Baptism", to: "/sacraments#infant-baptism" },
      { label: "Holy Matrimony", to: "/sacraments#matrimony" },
      { label: "Reconciliation", to: "/sacraments#reconciliation" },
      { label: "Anointing of the Sick", to: "/sacraments#anointing" },
    ],
  },
  {
    label: "Ministries",
    description: "Liturgical, formation, pastoral, and outreach",
    children: [
      { label: "Liturgical", to: "/ministries#liturgical" },
      { label: "Faith Formation", to: "/ministries#formation" },
      { label: "Pastoral Care", to: "/ministries#pastoral" },
      { label: "Community & Outreach", to: "/ministries#community" },
    ],
  },
  { label: "News & Events", to: "/news-events" },
];

export const footerNav: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "History", to: "/history" },
  { label: "Worship", to: "/worship" },
  { label: "Sacraments", to: "/sacraments" },
  { label: "Ministries", to: "/ministries" },
  { label: "News & Events", to: "/news-events" },
  { label: "Give", to: "/give" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/worship#visit" },
];
