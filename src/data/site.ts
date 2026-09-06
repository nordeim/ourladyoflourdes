export const site = {
  name: "Church of Our Lady of Lourdes",
  shortName: "Our Lady of Lourdes",
  tagline: "Two tongues, one faith, one family.",
  vision:
    "To be a welcoming household of grace at 50 Ophir Road — the oldest Tamil Catholic parish in Singapore — where the English and Tamil communities grow together in faith, hope, and love under the patronage of Our Lady of Lourdes.",
  founded: 1888,
  address: {
    street: "50 Ophir Road",
    city: "Singapore",
    zip: "188690",
    get full() {
      return `${this.street}, ${this.city} ${this.zip}`;
    },
    get query() {
      return encodeURIComponent(this.full);
    },
  },
  hours: {
    church: "Daily 8:00 AM – 8:00 PM",
    office: "Mon–Fri 9:00 AM – 5:00 PM",
    reception: "Mon–Fri 9:00 AM – 5:00 PM",
    adoration: "Daily 8:00 AM – 8:00 PM",
    confessionWeekday: "15 minutes before every Mass",
    confessionWeekend: "15 minutes before every Mass",
  },
  mass: {
    weekdayRosary: "Mon, Wed, Thu & Fri 11:35 AM",
    weekdayDivineMercy: "Tue 11:35 AM",
    weekdayEnglish: "12:30 PM",
    weekdayTamil: "7:00 PM",
    saturday: "5:00 PM, 6:15 PM & 7:30 PM (English)",
    saturdayRosary: "Sat 4:15 PM",
    sunday: [
      { time: "8:00 AM", language: "English" },
      { time: "9:30 AM", language: "Tamil" },
      { time: "11:00 AM", language: "English" },
      { time: "12:30 PM", language: "English" },
      { time: "6:30 PM", language: "Tamil" },
    ],
    publicHoliday: [
      { time: "9:00 AM", language: "English" },
      { time: "10:00 AM", language: "Tamil" },
    ],
    confession: "Available 15 minutes before every Mass",
    adoration: "Daily 8:00 AM – 8:00 PM",
    note: "On public holidays (Mon–Fri) the Parish Office is closed and the main entrance gates close at 5:00 PM.",
  },
  contact: {
    officePhone: "+65 6294 0624",
    email: "colol.secretariat@catholic.org.sg",
    connectEmail: "colol.secretariat@catholic.org.sg",
    bookingsEmail: "colol.mtn@catholic.org.sg",
  },
  transport: {
    mrt: "Rochor (DT13) · Bugis (EW12 / DT14)",
    buses: "Ophir Road & Rochor Road corridors",
  },
  feast: {
    name: "Our Lady of Lourdes",
    date: "11 February",
  },
  chequePayee: "Church of Our Lady of Lourdes",
  archdiocese: "https://www.catholic.sg",
  holySee: "http://www.vatican.va/content/vatican/en.html",
  myCatholic: "https://mycatholic.sg/",
  dailyReadings: "http://universalis.com/mass.htm",
  mapsUrl: "https://www.google.com/maps?q=50+Ophir+Road,+Singapore+188690",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=50+Ophir+Road,+Singapore+188690&output=embed",
  url: "https://ourladyoflourdes.sg/",
  ogImage: "https://ourladyoflourdes.sg/images/hero-church.jpg",
} as const;
