export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface GroundsPlace {
  id: string;
  title: string;
  description: string;
  image: string;
  imageFallback: string;
  imageAlt: string;
}

export interface Ministry {
  id: string;
  title: string;
  summary: string;
  description: string;
  details: string[];
  image: string;
  imageFallback: string;
  imageAlt: string;
}

export interface Sacrament {
  id: string;
  title: string;
  summary: string;
  description: string;
  details: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface EventItem {
  title: string;
  date: string;
  summary: string;
  category: "Parish" | "Devotion" | "Formation" | "Archdiocese";
  href?: string;
}

export interface GivingOption {
  title: string;
  description: string;
  icon: string;
}

export const lifeTimeline: TimelineEntry[] = [
  {
    year: "1856",
    title: "The First Shepherd",
    description:
      "Fr Pierre Paris takes charge of the pioneering Indian Catholics, teaching catechism, baptising, preaching, and celebrating the Eucharist in Tamil each Sunday from Sts Peter and Paul along Queen Street until his death in 1883.",
  },
  {
    year: "1884",
    title: "An Indian Church Is Established",
    description:
      "The Catholic Ministry for Indians is officially established. Bishop Edouard Gasnier entrusts Fr Joachim Alexandre Marie Meneuvier with the community and tasks him to learn Tamil and build a church of their own.",
  },
  {
    year: "1888",
    title: "The Church at Ophir Road",
    description:
      "Built between 1886 and 1888 in the mould of the Basilica at Lourdes, the gothic church is completed on 13 May 1888 — a house of prayer for the Indian Catholics of Singapore, known simply as the Indian Church.",
  },
  {
    year: "1888",
    title: "A School in the Compound",
    description:
      "Our Lady of Lourdes School begins operations in the church compound, extending the parish's care for the young alongside its liturgical life.",
  },
  {
    year: "1958–59",
    title: "Windows Made Whole",
    description:
      "Fr Fortier leads major renovations, restoring the fifteen clerestory stained-glass windows broken during World War II — each depicting a mystery of the Holy Rosary — and installing electronic bells and a second loft.",
  },
  {
    year: "2000",
    title: "A Hand Up for Migrant Workers",
    description:
      "A centre opens at the parish to help migrant workers upgrade themselves, extending OLL's long tradition of welcome to a new generation far from home.",
  },
  {
    year: "2009",
    title: "Monument Restored",
    description:
      "Recognised as a National Monument, the church undergoes restoration works of S$1.75 million to return her to her original splendour — tracery parapets, French windows, and tile roof intact.",
  },
  {
    year: "2010s",
    title: "A House Made New",
    description:
      "A further renovation and restoration of about S$6.5 million renews the oldest Tamil Catholic parish in Singapore for the generations to come.",
  },
  {
    year: "Today",
    title: "Two Tongues, One Family",
    description:
      "English and Tamil communities worship together under one gothic spire at 50 Ophir Road — Masses, devotions, and outreach continuing unbroken since 1888.",
  },
];

export const grounds: GroundsPlace[] = [
  {
    id: "main-church",
    title: "The Main Church",
    description:
      "Gothic in character, modelled on the Basilica at Lourdes — cornices and pilasters, tracery parapets, and the year 1888 set in gold above the rose window.",
    image: "/images/main-church.jpg",
    imageFallback: "/images/hero-church.jpg",
    imageAlt: "The white gothic facade of the Church of Our Lady of Lourdes at dusk, framed by palm fronds",
  },
  {
    id: "grotto",
    title: "The Lourdes Grotto",
    description:
      "In place of a conventional altar focal point, the parish keeps a replica of the grotto of Lourdes with the Virgin Mary standing within it — the heart of Marian devotion here.",
    image: "/images/grotto.jpg",
    imageFallback: "/images/interior.jpg",
    imageAlt: "A parish grotto shrine with the statue of Our Lady of Lourdes and pews for prayer",
  },
  {
    id: "nave",
    title: "The Nave & Clerestory",
    description:
      "Cast-iron columns lift the nave to a clerestory of fifteen stained-glass windows depicting the mysteries of the Rosary, flooding the church with natural light.",
    image: "/images/interior.jpg",
    imageFallback: "/images/stained-glass.jpg",
    imageAlt: "A gothic nave rising to stained-glass clerestory windows in natural light",
  },
];

export const sacraments: Sacrament[] = [
  {
    id: "infant-baptism",
    title: "Infant Baptism",
    summary: "The doorway into the family of God for the youngest among us.",
    description:
      "Baptism is the first sacrament and the gate to all the others — the moment a child is claimed for Christ and welcomed into the parish household. Parents and godparents profess the faith on the child's behalf and take up the promise to raise them in the life of the Church.",
    details: [
      "Arrange preparation and booking through the Parish Office.",
      "Parents are invited to prepare for the rite with the parish team.",
      "Godparents should be confirmed, practising Catholics.",
    ],
  },
  {
    id: "matrimony",
    title: "Holy Matrimony",
    summary: "A covenant of faithful love, witnessed and blessed by the Church.",
    description:
      "Christian marriage is a covenant between a man and a woman, ordered to the good of the spouses and the raising of children — a living sign of Christ's love for his Church. Couples of the parish are invited to begin their preparation well in advance of the wedding date.",
    details: [
      "Contact the Parish Office at least six months before your intended date.",
      "Preparation includes marriage preparation conversations with the priest.",
      "Church bookings are coordinated via colol.mtn@catholic.org.sg.",
    ],
  },
  {
    id: "communion",
    title: "Holy Communion",
    summary: "The Body and Blood of Christ — the source and summit of our life.",
    description:
      "In the Eucharist, the Church receives nothing less than Christ himself. Children of the parish prepare for their First Holy Communion through the catechism programme, and the whole community is nourished at every Mass in English and in Tamil.",
    details: [
      "First Communion preparation runs through the parish Catechism programme.",
      "See Mass Times for the weekly schedule of English and Tamil Masses.",
      "Communion is brought to the sick and homebound by parish ministers.",
    ],
  },
  {
    id: "confirmation",
    title: "Confirmation",
    summary: "The seal of the Holy Spirit, strengthening the baptised for mission.",
    description:
      "Confirmation completes baptismal grace: the confirmed are bound more closely to the Church, enriched with the Spirit's special strength, and sent out as witnesses of Christ. Youth of the parish prepare through the catechism programme over several years.",
    details: [
      "Preparation is coordinated through the parish Catechism programme.",
      "Adults seeking confirmation may journey through RCIA.",
      "Register interest with the Parish Office.",
    ],
  },
  {
    id: "reconciliation",
    title: "Reconciliation",
    summary: "Mercy voiced aloud — sins forgiven, peace restored.",
    description:
      "The Sacrament of Reconciliation is offered before every Mass at OLL, so that no one approaches the altar unprepared. It is the ordinary way the Church mediates God's mercy to the repentant sinner — honest, personal, and gentle.",
    details: [
      "Available 15 minutes before every Mass, in English and Tamil.",
      "Alternatively, ask any priest after Mass for a confession at a set time.",
      "First Reconciliation is prepared alongside First Communion in catechism.",
    ],
  },
  {
    id: "homebound",
    title: "Communion for the Homebound",
    summary: "The Eucharist carried to those who cannot join us at the altar.",
    description:
      "For parishioners confined to home, hospital, or care facilities, extraordinary ministers bring Holy Communion on a regular basis — so that the sick remain full members of the praying community. Families are invited to let the parish know when a loved one needs this ministry.",
    details: [
      "Arrange visits through the Parish Office at +65 6294 0624.",
      "Ministers can visit regularly or for a one-off need.",
      "The Anointing of the Sick can be requested alongside a visit.",
    ],
  },
  {
    id: "anointing",
    title: "Anointing of the Sick",
    summary: "Grace in frailty — Christ's healing touch in time of illness.",
    description:
      "The Anointing of the Sick strengthens the faithful in serious illness, advanced age, or before surgery, uniting their suffering to the passion of Christ. The parish encourages families not to wait until the last moment to request this sacrament of healing.",
    details: [
      "Request the sacrament through the Parish Office at +65 6294 0624.",
      "Communal anointing services are announced on the News & Events page.",
      "For the dying, ask the priest for the sacrament without delay.",
    ],
  },
];

export const ministries: Ministry[] = [
  {
    id: "liturgical",
    title: "Liturgical Ministries",
    summary: "Serving the altar, the ambo, the choir loft, and the doors.",
    description:
      "The liturgical ministries of OLL keep the worship of the parish beautiful, orderly, and welcoming — in English and in Tamil. From the reverence of the Eucharistic ministers to the song of the choir and the welcome at the door, each ministry is a distinct way of loving the liturgy.",
    details: [
      "Eucharistic Ministry — distributing Holy Communion at Mass and to the homebound.",
      "Lectors & Commentators — proclaiming the Word and guiding the assembly.",
      "Music — choirs and musicians for the English and Tamil Masses.",
      "Altar Servers — boys and girls assisting the priest at the altar.",
      "Hospitality — ushering, collections, and the welcome of newcomers.",
    ],
    image: "/images/liturgical.jpg",
    imageFallback: "/images/interior.jpg",
    imageAlt: "Candles and incense at the altar during Eucharistic adoration",
  },
  {
    id: "formation",
    title: "Faith Formation",
    summary: "Teaching the faith to every age — from first catechism to RCIA.",
    description:
      "Formation at OLL carries the faith from one generation to the next. Catechism classes walk children and youth through the whole life of the Church, while the Rite of Christian Initiation of Adults (RCIA) accompanies adults on the journey to baptism and full communion — discover the Catholic faith and journey toward a deeper relationship with God. Registration is open through the Parish Office before each year's intake.",
    details: [
      "Catechism — weekly classes for children from primary to secondary levels.",
      "RCIA (Adult Baptism) — a year-round journey of enquiry, catechesis, and conversion.",
    ],
    image: "/images/formation.jpg",
    imageFallback: "/images/stained-glass.jpg",
    imageAlt: "An open Bible and study materials for faith formation",
  },
  {
    id: "pastoral",
    title: "Pastoral Care",
    summary: "Accompanying the grieving and Mary's quiet service among us.",
    description:
      "The pastoral ministries walk with parishioners through the hardest hours of life. The Bereavement Ministry supports families from the wake to the funeral Mass and beyond, while the Legion of Mary carries out Marian apostolate — visitation, prayer, and quiet service modelled on Our Lady's own fiat.",
    details: [
      "Bereavement Ministry — practical and spiritual support for grieving families, including wake venue coordination via colol.mtn@catholic.org.sg.",
      "Legion of Mary — Marian devotion, visitation of the sick, and apostolic works.",
    ],
    image: "/images/pastoral.jpg",
    imageFallback: "/images/grotto.jpg",
    imageAlt: "Hands clasped in prayer and support",
  },
  {
    id: "community",
    title: "Community & Outreach",
    summary: "Society of St Vincent de Paul, migrant welfare, and legal aid.",
    description:
      "Outreach is where OLL's 1888 charter of welcome meets the needs of the city today. The SVDP Society serves neighbours in material need, the Migrant Welfare Committee continues the parish's long care for workers far from home, and the Legal Aid ministry offers pro bono guidance to those who cannot afford it.",
    details: [
      "SVDP Society — friendship and material help for families in difficulty.",
      "Migrant Welfare Committee — support, formation, and community for migrant workers.",
      "Legal Aid — pro bono legal guidance for those in need.",
    ],
    image: "/images/community.jpg",
    imageFallback: "/images/main-church.jpg",
    imageAlt: "A multicultural parish community gathered in the parish hall",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "What are the Mass times at OLL?",
    answer:
      "Weekday Masses are at 12:30 PM in English and 7:00 PM in Tamil, with the Rosary (Mon, Wed, Thu & Fri) and Divine Mercy Devotion (Tue) at 11:35 AM. On Saturday, English Masses are at 5:00 PM, 6:15 PM and 7:30 PM. On Sunday, English Masses are at 8:00 AM, 11:00 AM and 12:30 PM, and Tamil Masses at 9:30 AM and 6:30 PM. On public holidays (Mon–Fri), the only Masses are 9:00 AM in English and 10:00 AM in Tamil.",
  },
  {
    question: "Is the Sacrament of Reconciliation available?",
    answer:
      "Yes — Reconciliation is available 15 minutes before every Mass, in English and Tamil. The Adoration Room is open daily from 8:00 AM to 8:00 PM for quiet prayer before the Blessed Sacrament.",
  },
  {
    question: "How do I get to the church?",
    answer:
      "The church is at 50 Ophir Road, Singapore 188690, in the Rochor district. The nearest MRT stations are Rochor (DT13) and Bugis (EW12/DT14), both a short walk away along the Ophir-Rochor corridor.",
  },
  {
    question: "Is there a dress code for visiting the church?",
    answer:
      "Out of reverence for the sanctuary, visitors are asked to dress modestly: shoulders and knees covered, and no hats or caps inside the Main Church. Please also keep mobile phones on silent — food and drinks are not permitted in the Main Church, and smoking is allowed only at designated areas.",
  },
  {
    question: "How do I book a meeting room, wake venue, or hall?",
    answer:
      "For bookings and inquiries about meeting rooms, the wake venue, or the parish hall, please email colol.mtn@catholic.org.sg. Do note the Parish Office is closed on public holidays.",
  },
  {
    question: "How do I join a ministry or enrol for baptisms and marriages?",
    answer:
      "For all sacramental enquiries — infant baptism, holy matrimony, catechism, RCIA — and to join a ministry, contact the Parish Office at +65 6294 0624 or email colol.secretariat@catholic.org.sg. The parish team will guide you through preparation and registration.",
  },
];

export const upcomingEvents: EventItem[] = [
  {
    title: "Feast of Our Lady of Lourdes",
    date: "11 February",
    summary:
      "Our patronal feast — the anniversary of the apparitions at Lourdes to St Bernadette. Trilingual celebrations are announced each year in the parish bulletin.",
    category: "Parish",
  },
  {
    title: "Rosary Devotion",
    date: "Mon, Wed, Thu & Fri · 11:35 AM",
    summary:
      "The parish gathers for the Rosary before the 12:30 PM Mass — and on Saturdays at 4:15 PM before the evening Masses.",
    category: "Devotion",
  },
  {
    title: "Divine Mercy Devotion",
    date: "Tuesdays · 11:35 AM",
    summary:
      "The Chaplet of Divine Mercy is prayed before the Tuesday midday Mass, trusting in the mercy Christ promised through St Faustina.",
    category: "Devotion",
  },
  {
    title: "Eucharistic Adoration",
    date: "Daily · 8:00 AM – 8:00 PM",
    summary:
      "The Adoration Room is open daily for silent prayer before the Blessed Sacrament — the quiet heart of Ophir Road.",
    category: "Devotion",
  },
  {
    title: "RCIA — Journey in Faith",
    date: "Enquiries open",
    summary:
      "Discover the Catholic faith and journey toward a deeper relationship with God — join our RCIA programme; enquiries are welcome at the Parish Office.",
    category: "Formation",
  },
  {
    title: "Daily Readings & Catholic Calendar",
    date: "Every day",
    summary:
      "Follow the daily Mass readings and the Church's liturgical calendar through universalis.com and the Archdiocese's Catholic Calendar.",
    category: "Archdiocese",
    href: "http://universalis.com/mass.htm",
  },
];

export const givingOptions: GivingOption[] = [
  {
    title: "Sunday Collection",
    description:
      "The collection taken at every English and Tamil Mass goes towards the running of the parish and the archdiocese's charities throughout the year.",
    icon: "church",
  },
  {
    title: "At the Parish Office",
    description:
      "Offerings in cash or by cheque may be made at the Parish Office, 50 Ophir Road, during opening hours — Mon–Fri 9:00 AM to 5:00 PM.",
    icon: "heart",
  },
  {
    title: "Cheque",
    description:
      "Cheques may be made payable to “Church of Our Lady of Lourdes” and passed to the Parish Office or dropped into the collection.",
    icon: "book",
  },
  {
    title: "Electronic Transfer",
    description:
      "For PayNow or bank transfer details, please contact the Parish Office at +65 6294 0624 or colol.secretariat@catholic.org.sg.",
    icon: "globe",
  },
  {
    title: "Mass Offerings",
    description:
      "Mass intentions for loved ones — living or deceased — may be arranged with the Parish Office during opening hours.",
    icon: "flame",
  },
  {
    title: "SVDP & Outreach",
    description:
      "To give specifically to the poor through the Society of St Vincent de Paul or the Migrant Welfare Committee, mark your offering or contact the parish.",
    icon: "sprout",
  },
];

export const devotions = [
  {
    title: "Rosary Devotion",
    when: "Mon, Wed, Thu & Fri 11:35 AM · Sat 4:15 PM",
    where: "Main Church",
  },
  {
    title: "Divine Mercy Devotion",
    when: "Tuesdays 11:35 AM",
    where: "Main Church",
  },
  {
    title: "Eucharistic Adoration",
    when: "Daily 8:00 AM – 8:00 PM",
    where: "Adoration Room",
  },
  {
    title: "Sunday Tamil Choir Practice",
    when: "As announced in the bulletin",
    where: "Choir Loft",
  },
];

export const images = {
  hero: "/images/hero-church.jpg",
  heroFallback: "/images/main-church.jpg",
  mainChurch: "/images/main-church.jpg",
  grotto: "/images/grotto.jpg",
  interior: "/images/interior.jpg",
  stainedGlass: "/images/stained-glass.jpg",
  liturgical: "/images/liturgical.jpg",
  formation: "/images/formation.jpg",
  pastoral: "/images/pastoral.jpg",
  community: "/images/community.jpg",
};
