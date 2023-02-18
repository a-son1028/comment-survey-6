import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import "../configs/mongoose.config";
import Models from "../models";
import fs from "fs";
import axios from "axios";
import bluebird, { Promise } from "bluebird";
import Services from "../services";
import natural from "natural";
const isEnglish = require("is-english");

const PorterStemmer = require("../../node_modules/natural/lib/natural/stemmers/porter_stemmer");

var bayesClassifier = new natural.BayesClassifier(PorterStemmer);
var logisticRegressionClassifier = new natural.LogisticRegressionClassifier(PorterStemmer);

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csvtojson");
import CoreNLP, { Properties, Pipeline } from "corenlp";
import _ from "lodash";
var w2v = require("word2vec");
var w2vModel;
var w2vModelData = {};
const comment =
  "Do not use this app, it is full of scammers. All they want you to do is take their word for how great the room is send you some generic pictures and ask for your security deposit without getting to see the room.";
const categoryGroups = {
  Beauty: ["Beauty", "Lifestyle"],
  Business: ["Business"],
  Education: ["Education", "Educational"],
  Entertainment: ["Entertainment", "Photography"],
  Finance: [
    "Finance",
    "Events",
    "Action",
    "Action & Adventure",
    "Adventure",
    "Arcade",
    "Art & Design",
    "Auto & Vehicles",
    "Board",
    "Books & Reference",
    "Brain Games",
    "Card",
    "Casino",
    "Casual",
    "Comics",
    "Creativity",
    "House & Home",
    "Libraries & Demo",
    "News & Magazines",
    "Parenting",
    "Pretend Play",
    "Productivity",
    "Puzzle",
    "Racing",
    "Role Playing",
    "Simulation",
    "Strategy",
    "Trivia",
    "Weather",
    "Word"
  ],
  "Food & Drink": ["Food & Drink"],
  "Health & Fitness": ["Health & Fitness"],
  "Maps & Navigation": ["Maps & Navigation"],
  Medical: ["Medical"],
  "Music & Audio": ["Music & Audio", "Video Players & Editors", "Music & Video", "Music"],
  Shopping: ["Shopping"],
  Social: ["Social", "Dating", "Communication"],
  Sports: ["Sports"],
  Tools: ["Tools", "Personalization"],
  "Travel & Local": ["Travel & Local"]
};

const categoriesCollection = [
  {
    id: "1",
    name: "Admin",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "2",
    name: "Purchase",
    level: "1",
    parent: "null",
    keywords: ["business", "commercial", "businesses", "purchase"]
  },
  {
    id: "3",
    name: "Education",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "4",
    name: "Healthcare",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "5",
    name: "Booking",
    level: "1",
    parent: "null",
    keywords: ["booking"]
  },
  {
    id: "6",
    name: "Services",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "7",
    name: "Marketing",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "8",
    name: "Profiling",
    level: "2",
    parent: "1",
    keywords: ["profile", "profiling"]
  },
  {
    id: "9",
    name: "Analysis",
    level: "2",
    parent: "1",
    keywords: ["Analytics", "analysis", "analyze", "analyse", "analyzing"]
  },
  {
    id: "10",
    name: "Statistical",
    level: "2",
    parent: "1",
    keywords: ["Statistical", "statistics"]
  },
  {
    id: "11",
    name: "Advertisements",
    level: "2",
    parent: "1",
    keywords: ["ads", "advertising", "advertisement", "advertisers"]
  },
  {
    id: "12",
    name: "Maintenance",
    level: "2",
    parent: "1",
    keywords: ["maintain", "maintenance", "maintained"]
  },
  {
    id: "13",
    name: "Identifying",
    level: "2",
    parent: "1",
    keywords: [
      "identifier",
      "identifying",
      "authentication",
      "authenticate",
      "authenticates",
      "identity",
      "identities",
      "identifiable",
      "identifies"
    ]
  },
  {
    id: "14",
    name: "Testing/Troubleshooting",
    level: "2",
    parent: "1",
    keywords: ["Troubleshooting", "tests", "testing", "troubleshoot"]
  },
  {
    id: "15",
    name: "Payment",
    level: "2",
    parent: "2",
    keywords: ["purchase", "purchasing", "payment"]
  },
  {
    id: "16",
    name: "Delivery",
    level: "2",
    parent: "2",
    keywords: ["delivery", "shipping", "delivering"]
  },
  {
    id: "17",
    name: "Contacting",
    level: "2",
    parent: "2",
    keywords: ["Contacting", "contacts", "contacted", "communications"]
  },
  {
    id: "18",
    name: "Research",
    level: "2",
    parent: "3",
    keywords: ["research", "researching"]
  },
  {
    id: "19",
    name: "Survey",
    level: "2",
    parent: "3",
    keywords: ["survey"]
  },
  {
    id: "20",
    name: "Treatment",
    level: "2",
    parent: "4",
    keywords: ["Treatment"]
  },
  {
    id: "21",
    name: "Diagnosis",
    level: "2",
    parent: "4",
    keywords: ["diagnostics", "diagnosis"]
  },
  {
    id: "22",
    name: "Medical",
    level: "2",
    parent: "4",
    keywords: ["medical", "healthcare", "health care", "disease"]
  },
  {
    id: "23",
    name: "Improving quality",
    level: "2",
    parent: "6",
    keywords: ["improve", "improving", "improvement"]
  },
  {
    id: "24",
    name: "Developing the new services",
    level: "2",
    parent: "6",
    keywords: ["new service", "new product", "new feature", "new functions"]
  },
  {
    id: "25",
    name: "Direct Email",
    level: "2",
    parent: "7",
    keywords: ["direct && email"]
  },
  {
    id: "26",
    name: "Direct Phone",
    level: "2",
    parent: "7",
    keywords: ["direct && phone"]
  },
  {
    id: "27",
    name: "Booking",
    level: "2",
    parent: "5",
    keywords: ["booking"]
  }
];

const categoriesThirdParty = [
  {
    id: "0",
    name: "Third party",
    level: "0",
    parent: "null",
    keywords: ["Third-party", "3rd parties", "third party", "third parties", "3rd party"]
  },
  {
    id: "2",
    name: "Purpose",
    level: "1",
    parent: "null",
    keywords: [""]
  },
  {
    id: "10",
    name: "Payment",
    level: "2",
    parent: "2",
    keywords: ["payment; purchase; order; credit card"]
  },
  {
    id: "11",
    name: "Delivery",
    level: "2",
    parent: "2",
    keywords: ["diliver; delivery; deliverer"]
  },
  {
    id: "12",
    name: "Marketing",
    level: "2",
    parent: "2",
    keywords: ["marketing"]
  },
  {
    id: "13",
    name: "Advertisement",
    level: "2",
    parent: "2",
    keywords: ["Advertising; ads; advertisement; advertiser;"]
  },
  {
    id: "14",
    name: "Analysis",
    level: "2",
    parent: "2",
    keywords: ["Analysis; analytical; analysed; analyzed; analytics; market research"]
  }
];

const groupQuestions = {
  1: [
    // Food & Drink
    "resep masakan",
    "tip calculator : split tip",

    //  Health & Fitness
    "easy rise alarm clock",
    "sports supplements",

    // Maps & Navigation
    "tc fuel consumption record",
    "taiwan mrt info - taipei、taoyuan、kaohsiung",

    // Music & Audio
    "soul radio",
    "find that song",

    // Social
    "facebook",
    // "chat rooms - find friends",
    "my t-mobile - nederland"
  ],
  2: [
    // Beauty
    "sweet macarons hd wallpapers",
    "kuchen rezepte kochbuch",
    // "feeling of color combination",
    // Business
    "real estate auctions listings  - gsa listings",
    "mobile inventory",
    // Shopping
    "brands for less",
    "house of fraser",
    // Entertainment
    "christmas cards",
    "sound view spectrum analyzer",

    // Finance
    "google news - daily headlines",
    "habit calendar : track habits"
  ],
  3: [
    // Sports
    "football news - patriots",
    "australian hunter magazine",

    // Medical
    "acupressure tips",
    "nighttime speaking clock",

    // Travel & Local
    // "walkway navi - gps for walking",
    "beijing metro map",
    "google earth",

    // Education
    "brainwell mind & brain trainer",
    "origami flower instructions 3d",

    // Tools
    "the ney is an end-blown flute sufi music wallpaper",
    "calcnote - notepad calculator"
  ]
};
const permissionTypes = {
  Telephony: [
    "android.permission.ACCEPT_HANDOVER",
    "com.android.voicemail.permission.ADD_VOICEMAIL",
    "android.permission.ANSWER_PHONE_CALLS",
    "android.permission.CALL_PHONE",
    "android.permission.GET_ACCOUNTS",
    "android.permission.PROCESS_OUTGOING_CALLS",
    "android.permission.READ_CALL_LOG",
    "android.permission.READ_CONTACTS",
    "android.permission.READ_PHONE_NUMBERS",
    "android.permission.READ_PHONE_STATE",
    "android.permission.READ_SMS",
    "android.permission.RECEIVE_MMS",
    "android.permission.RECEIVE_SMS",
    "android.permission.RECEIVE_WAP_PUSH",
    "android.permission.SEND_SMS",
    "android.permission.USE_SIP",
    "android.permission.WRITE_CALL_LOG",
    "android.permission.WRITE_CONTACTS"
  ],
  Location: [
    "android.permission.ACCESS_BACKGROUND_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_MEDIA_LOCATION"
  ],
  Fitness: [
    // Health&Fitness
    "android.permission.ACTIVITY_RECOGNITION",
    "android.permission.BODY_SENSORS"
  ],
  Connection: [
    "android.permission.BLUETOOTH_ADVERTISE",
    "android.permission.BLUETOOTH_CONNECT",
    "android.permission.BLUETOOTH_SCAN",
    "android.permission.UWB_RANGING"
  ],
  Hardware: ["android.permission.CAMERA"],
  Calendar: ["android.permission.READ_CALENDAR", "android.permission.WRITE_CALENDAR"],
  Storage: [
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE"
  ],
  Media: ["android.permission.RECORD_AUDIO"]
};
const dataCollectionTypes = {
  Connection: [
    "Bluetooth",
    "Companion devices",
    "Connectivity status",
    "DNS",
    "Inet",
    "IP",
    "Link",
    "Socket",
    "MAC",
    "Mailto",
    "Network type",
    "Proxy",
    "Route",
    "SSL",
    "URI",
    "VPN",
    "HTTP",
    "NSD",
    "RTP",
    "SIP",
    "Wifi",
    "NFC",
    "URL",
    "Cookie",
    "Authenticator",
    "IDN",
    "Cache"
  ],
  Hardware: [
    "Camera",
    "Flash",
    "Buffer",
    "Accelerometer sensor",
    "Temperature sensor",
    "Other sensors",
    "Gyroscope sensor",
    "Heart beat sensor",
    "Heart rate sensor",
    "Light sensor",
    "Acceleration sensor",
    "Location sensor",
    "Biometric",
    "Device model",
    "Lens",
    "Screen",
    "Display",
    "Fingerprint",
    "Hardware type",
    "Keyboard",
    "USB",
    "IMEI"
  ],
  Fitness: [
    // Health&Fitness
    "Bluetooth device",
    "Google Fit",
    "Fitness activity",
    "Time",
    "Glucose",
    "Blood pressure",
    "Body position",
    "Body tempurature",
    "Cervical",
    "Meal",
    "Menstrual flow",
    "Ovulation",
    "Oxygen",
    "Sleep"
  ],
  Location: [
    "Latitude",
    "Longitude",
    "Address",
    "Country",
    "Local name",
    "Locale",
    "Postal code",
    "Criteria",
    "Geographic",
    "Local time",
    "Measurement",
    "Navigation",
    "GPS",
    "Longitude, Latitude",
    "Destination",
    "Location type",
    "Distance",
    "Accuracy",
    "Speed",
    "Altitude",
    "Bearing",
    "NMEA",
    "Locale name",
    "Position",
    "Location activity",
    "Vehicle",
    "Duration",
    "Maps",
    "Places",
    "Location name",
    "Phone number"
  ],
  Media: [
    "Audio",
    "Image",
    "Player",
    "Video",
    "Recorder",
    "Scanner",
    "Microphone",
    "Remote",
    "Movie",
    "Music",
    "Channels",
    "Volume",
    "Device info",
    "Audio manager",
    "HDMI",
    "Sound",
    "Playback",
    "Headphone",
    "Presentation",
    "Media type",
    "Timestamp",
    "Audio track",
    "Video quality",
    "Camera",
    "Interface",
    "Length",
    "Face detector",
    "Media Cas",
    "Session",
    "Codec",
    "Callback",
    "Color",
    "Feature",
    "Profile",
    "Encoder",
    "Controller",
    "Media description",
    "Media ID",
    "Media name",
    "DRM",
    "Key",
    "Media format",
    "Metadata",
    "Muxer",
    "Players",
    "Voice",
    "Router",
    "Display",
    "Media connection",
    "Sync",
    "Rating",
    "Ringtone",
    "TONE",
    "Processing",
    "Environtmental",
    "Equalizer",
    "Virtualizer",
    "Browser",
    "Effect",
    "Midi",
    "Projection",
    "TV",
    "Preview",
    "Program",
    "Flash",
    "GPS",
    "Speed",
    "Lens",
    "Light",
    "Adapter",
    "HTTP",
    "Sensor",
    "Widget"
  ],
  Telephony: [
    "MMS",
    "SMS",
    "ThreadsColumns",
    "Carrier",
    "Service",
    "Network type",
    "MNC",
    "Roaming",
    "Cell",
    "ICC",
    "Session",
    "Phone number",
    "Phone status",
    "Subscription",
    "Telephony manager",
    "Callback",
    "UICC",
    "Voicemail",
    "APN",
    "EUICC",
    "Download",
    "File info",
    "Group call",
    "MBMS"
  ],
  Info: [
    // UserInfo
    "Account",
    "Name",
    "Contact",
    "User profile",
    "Address",
    "Age",
    "Bigraphy",
    "Birthdays",
    "Email",
    "Gender",
    "Organizations",
    "Bigraphic",
    "Nickname",
    "Occupation",
    "Phone number",
    "SIP",
    "URL"
  ]
};
const dataTypes = {
  Connection: [
    "Bluetooth",
    "Companion devices",
    "Connectivity status",
    "DNS",
    "Inet",
    "IP",
    "Link",
    "Socket",
    "MAC",
    "Mailto",
    "Network type",
    "Proxy",
    "Route",
    "SSL",
    "URI",
    "VPN",
    "HTTP",
    "NSD",
    "RTP",
    "SIP",
    "Wifi",
    "NFC",
    "URL",
    "Cookie",
    "Authenticator",
    "IDN",
    "Cache"
  ],
  Hardware: [
    "Camera",
    "Flash",
    "Buffer",
    "Accelerometer sensor",
    "Temperature sensor",
    "Other sensors",
    "Gyroscope sensor",
    "Heart beat sensor",
    "Heart rate sensor",
    "Light sensor",
    "Acceleration sensor",
    "Location sensor",
    "Biometric",
    "Device model",
    "Lens",
    "Screen",
    "Display",
    "Fingerprint",
    "Hardware type",
    "Keyboard",
    "USB",
    "IMEI"
  ],
  "Health&Fitness": [
    "Bluetooth device",
    "Google Fit",
    "Fitness activity",
    "Time",
    "Glucose",
    "Blood pressure",
    "Body position",
    "Body tempurature",
    "Cervical",
    "Meal",
    "Menstrual flow",
    "Ovulation",
    "Oxygen",
    "Sleep"
  ],
  Location: [
    "Latitude",
    "Longitude",
    "Address",
    "Country",
    "Local name",
    "Locale",
    "Postal code",
    "Criteria",
    "Geographic",
    "Local time",
    "Measurement",
    "Navigation",
    "GPS",
    "Longitude, Latitude",
    "Destination",
    "Location type",
    "Distance",
    "Accuracy",
    "Speed",
    "Altitude",
    "Bearing",
    "NMEA",
    "Locale name",
    "Position",
    "Location activity",
    "Vehicle",
    "Duration",
    "Maps",
    "Places",
    "Location name",
    "Phone number"
  ],
  Media: [
    "Audio",
    "Image",
    "Player",
    "Video",
    "Recorder",
    "Scanner",
    "Microphone",
    "Remote",
    "Movie",
    "Music",
    "Channels",
    "Volume",
    "Device info",
    "Audio manager",
    "HDMI",
    "Sound",
    "Playback",
    "Headphone",
    "Presentation",
    "Media type",
    "Timestamp",
    "Audio track",
    "Video quality",
    "Camera",
    "Interface",
    "Length",
    "Face detector",
    "Media Cas",
    "Session",
    "Codec",
    "Callback",
    "Color",
    "Feature",
    "Profile",
    "Encoder",
    "Controller",
    "Media description",
    "Media ID",
    "Media name",
    "DRM",
    "Key",
    "Media format",
    "Metadata",
    "Muxer",
    "Players",
    "Voice",
    "Router",
    "Display",
    "Media connection",
    "Sync",
    "Rating",
    "Ringtone",
    "TONE",
    "Processing",
    "Environtmental",
    "Equalizer",
    "Virtualizer",
    "Browser",
    "Effect",
    "Midi",
    "Projection",
    "TV",
    "Preview",
    "Program",
    "Flash",
    "GPS",
    "Speed",
    "Lens",
    "Light",
    "Adapter",
    "HTTP",
    "Sensor",
    "Widget"
  ],
  Telephony: [
    "MMS",
    "SMS",
    "ThreadsColumns",
    "Carrier",
    "Service",
    "Network type",
    "MNC",
    "Roaming",
    "Cell",
    "ICC",
    "Session",
    "Phone number",
    "Phone status",
    "Subscription",
    "Telephony manager",
    "Callback",
    "UICC",
    "Voicemail",
    "APN",
    "EUICC",
    "Download",
    "File info",
    "Group call",
    "MBMS"
  ],
  UserInfo: [
    "Account",
    "Name",
    "Contact",
    "User profile",
    "Address",
    "Age",
    "Bigraphy",
    "Birthdays",
    "Email",
    "Gender",
    "Organizations",
    "Bigraphic",
    "Nickname",
    "Occupation",
    "Phone number",
    "SIP",
    "URL"
  ]
};
const DATA_TYPES = [
  "Bluetooth",
  "Companion devices",
  "Connectivity status",
  "DNS",
  "Inet",
  "IP",
  "Link",
  "Socket",
  "MAC",
  "Mailto",
  "Network type",
  "Proxy",
  "Route",
  "SSL",
  "URI",
  "VPN",
  "HTTP",
  "NSD",
  "RTP",
  "SIP",
  "Wifi",
  "NFC",
  "URL",
  "Cookie",
  "Authenticator",
  "IDN",
  "Cache",
  "Camera",
  "Flash",
  "Buffer",
  "Accelerometer sensor",
  "Temperature sensor",
  "Other sensors",
  "Gyroscope sensor",
  "Heart beat sensor",
  "Heart rate sensor",
  "Light sensor",
  "Acceleration sensor",
  "Location sensor",
  "Biometric",
  "Device model",
  "Lens",
  "Screen",
  "Display",
  "Fingerprint",
  "Hardware type",
  "Keyboard",
  "USB",
  "IMEI",
  "Bluetooth device",
  "Google Fit",
  "Fitness activity",
  "Time",
  "Glucose",
  "Blood pressure",
  "Body position",
  "Body tempurature",
  "Cervical",
  "Meal",
  "Menstrual flow",
  "Ovulation",
  "Oxygen",
  "Sleep",
  "Latitude",
  "Longitude",
  "Address",
  "Country",
  "Local name",
  "Locale",
  "Postal code",
  "Criteria",
  "Geographic",
  "Local time",
  "Measurement",
  "Navigation",
  "GPS",
  "Longitude, Latitude",
  "Destination",
  "Location type",
  "Distance",
  "Accuracy",
  "Speed",
  "Altitude",
  "Bearing",
  "NMEA",
  "Locale name",
  "Position",
  "Location activity",
  "Vehicle",
  "Duration",
  "Maps",
  "Places",
  "Location name",
  "Phone number",
  "Audio",
  "Image",
  "Player",
  "Video",
  "Recorder",
  "Scanner",
  "Microphone",
  "Remote",
  "Movie",
  "Music",
  "Channels",
  "Volume",
  "Device info",
  "Audio manager",
  "HDMI",
  "Sound",
  "Playback",
  "Headphone",
  "Presentation",
  "Media type",
  "Timestamp",
  "Audio track",
  "Video quality",
  "Interface",
  "Length",
  "Face detector",
  "Media Cas",
  "Session",
  "Codec",
  "Callback",
  "Color",
  "Feature",
  "Profile",
  "Encoder",
  "Controller",
  "Media description",
  "Media ID",
  "Media name",
  "DRM",
  "Key",
  "Media format",
  "Metadata",
  "Muxer",
  "Players",
  "Voice",
  "Router",
  "Media connection",
  "Sync",
  "Rating",
  "Ringtone",
  "TONE",
  "Processing",
  "Environtmental",
  "Equalizer",
  "Virtualizer",
  "Browser",
  "Effect",
  "Midi",
  "Projection",
  "TV",
  "Preview",
  "Program",
  "Light",
  "Adapter",
  "Sensor",
  "Widget",
  "MMS",
  "SMS",
  "ThreadsColumns",
  "Carrier",
  "Service",
  "MNC",
  "Roaming",
  "Cell",
  "ICC",
  "Phone status",
  "Subscription",
  "Telephony manager",
  "UICC",
  "Voicemail",
  "APN",
  "EUICC",
  "Download",
  "File info",
  "Group call",
  "MBMS",
  "Account",
  "Name",
  "Contact",
  "User profile",
  "Age",
  "Bigraphy",
  "Birthdays",
  "Email",
  "Gender",
  "Organizations",
  "Bigraphic",
  "Nickname",
  "Occupation"
];
const PERMISSIONS = [
  "Calendar",
  "Connection",
  "Media",
  "Storage",
  "Telephony",
  "Location",
  "Fitness",
  "Hardware"
];
const THIRD_PARTIES = [
  "a.applovin.com",
  "aarki.net",
  "active.mobi",
  "adactioninteractive.com",
  "Adcolony",
  "addthis.com",
  "adfalcon.com",
  "adjust.com",
  "admin.appnext.com",
  "admixer.co.kr",
  "admobgeek.com",
  "Adobe",
  "adroll.com",
  "adrta.com",
  "Ads Moloco",
  "Ads Server",
  "Ads Symptotic",
  "AdSafeProtected",
  "agkn.com",
  "airpush.com",
  "akamaihd.net",
  "algovid.com",
  "Altitude-arena",
  "altrooz.com",
  "Amazon",
  "api reporting review mobile ads",
  "api.pingstart.com",
  "App Adsp",
  "app.appsflyer.com",
  "apperol.com",
  "applovin.com",
  "appmakertw",
  "appnext.com",
  "appsflyer.com",
  "AppsGeyser",
  "apptrknow.com",
  "appwalls.mobi",
  "apsalar.com",
  "aptrk.com",
  "Avocarrot",
  "Baidu",
  "beacon.krxd.net",
  "beaconsinspace.com",
  "bidswitch.net",
  "Bluekai.com",
  "bttrack.com",
  "casalemedia.com",
  "cauly.co",
  "chartbeat.net",
  "choices.truste.com",
  "clinkadtracking.com",
  "control.kochava.com",
  "cootek.com",
  "criteo.com",
  "cs.gssprt.jp",
  "cs.nend.net",
  "DoubleVerify",
  "dpm.demdex.net",
  "Dribbble",
  "everesttech.net",
  "Facebook",
  "feedmob.com",
  "Google Ads",
  "Google Analytics",
  "Google Data API",
  "Google Doc",
  "Google Firebase",
  "Google Fonts",
  "Google Map",
  "Google Play",
  "Google Tag Manager",
  "Google Video",
  "Google Vision",
  "Google Youtube",
  "gstatic.com",
  "guest.wireless.cmu.edu",
  "haloapps.com",
  "Heyzap",
  "http://timmystudios.com/",
  "i-mobile.co.jp",
  "impact.applifier.com",
  "inmobi.com",
  "inmobicdn.net",
  "Instagram",
  "intentiq.com",
  "jennywsplash.com",
  "Kakao",
  "kika-backend.com",
  "kikakeyboard.com",
  "Kiosked",
  "Leadbolt Ads",
  "leadboltapps.net",
  "lenzmx.com",
  "lfstmedia.com",
  "liftoff.io",
  "lkqd.net",
  "ludei.com",
  "Microsoft",
  "mixpanel.com",
  "Moat Ads",
  "mobile-up-date.com",
  "mobile.btrll.com",
  "mobilecore.com",
  "Mobincube",
  "mookie1.com",
  "MoPub",
  "mxptint.net",
  "Mydas Mobi",
  "Myi Ads",
  "mysearch-online.com",
  "Native Ads",
  "nend.net",
  "newoffer2017.com",
  "nexac.com",
  "online-metrix.net",
  "paperlit.com",
  "Payco",
  "phonegame.so",
  "play.king.com",
  "Pub Ads",
  "pubmatic.com",
  "quantcount.com",
  "Quiztapp",
  "rayjump.com",
  "sappsuma.com",
  "sc.iasds01.com",
  "Scorecard Research",
  "searchmobileonline.com",
  "Securepub Ads",
  "silvermob.com",
  "simpli.fi",
  "sm-trk.com",
  "smaato",
  "smartadserver",
  "Spotify",
  "Start App Service",
  "stat.appioapp.com",
  "Sticky ads TV",
  "sumatoad.com",
  "SuperSonic Ads",
  "Sync",
  "tapad.com",
  "tapjoy.com",
  "tappx.com",
  "Taptica",
  "Te Ads",
  "theappsgalore.com",
  "tinyhoneybee.com",
  "tlnk.io",
  "turn.com",
  "Twitter",
  "Unity Ads",
  "Unknown",
  "vdopia.com",
  "volo-mobile.com",
  "vungle.com",
  "w55c.net",
  "www.appyet.com",
  "www.blogger.com",
  "www.cdnstabletransit.com",
  "www.cmu.edu",
  "www.gamefeat.net",
  "www.nexogen.in",
  "www.searchmobileonline.com",
  "www.ssacdn.com",
  "www.startappexchange.com",
  "Yahoo",
  "Yandex",
  "ymtracking.com",
  "yyapi.net"
];
const PURPOSES = [
  "Advertisements",
  "Analysis",
  "Authentication",
  "Authorization",
  "Communicating with malware",
  "Connection",
  "Maintenance",
  "Management",
  "Marketing",
  "Remote",
  "Statistical",
  "Storage",
  "Tracking"
];

const SYNTHETIC = [
  // use
  ["access", "apply", "connect", "employ", "process", "save", "use", "utilize"],

  // collect
  ["collect", "gather", "obtain"],

  // store
  ["record", "retain", "store"],

  // share
  [
    "disclose",
    "distribute",
    "exchange",
    "give",
    "lease",
    "provide",
    "release",
    "report",
    "sell",
    "send",
    "share",
    "transfer",
    "transmit"
  ],

  // data item
  // connection
  [
    "Bluetooth",
    "Companion devices",
    "Connectivity status",
    "DNS",
    "Inet",
    "IP",
    "Link",
    "Socket",
    "MAC",
    "Mailto",
    "Network type",
    "Proxy",
    "Route",
    "SSL",
    "URI",
    "VPN",
    "HTTP",
    "NSD",
    "RTP",
    "SIP",
    "Wifi",
    "NFC",
    "URL",
    "Cookie",
    "Authenticator",
    "IDN",
    "Cache"
  ],

  // hardware
  [
    "Camera",
    "Flash",
    "Buffer",
    "Accelerometer sensor",
    "Temperature sensor",
    "Other sensors",
    "Gyroscope sensor",
    "Heart beat sensor",
    "Heart rate sensor",
    "Light sensor",
    "Acceleration sensor",
    "Location sensor",
    "Biometric",
    "Device model",
    "Lens",
    "Screen",
    "Display",
    "Fingerprint",
    "Hardware type",
    "Keyboard",
    "USB",
    "IMEI"
  ],

  // Health&Fitness
  [
    "Bluetooth device",
    "Google Fit",
    "Fitness activity",
    "Time",
    "Glucose",
    "Blood pressure",
    "Body position",
    "Body tempurature",
    "Cervical",
    "Meal",
    "Menstrual flow",
    "Ovulation",
    "Oxygen",
    "Sleep"
  ],

  // location
  [
    "Latitude",
    "Longitude",
    "Address",
    "Country",
    "City",
    "Local name",
    "Locale",
    "Postal code",
    "Criteria",
    "Geographic",
    "Local time",
    "Measurement",
    "Navigation",
    "GPS",
    "Longitude",
    "Latitude",
    "Destination",
    "Location type",
    "Distance",
    "Accuracy",
    "Speed",
    "Altitude",
    "Bearing",
    "NMEA",
    "Locale name",
    "Position",
    "Location activity",
    "Vehicle",
    "Duration",
    "Maps",
    "Places",
    "Location name",
    "Phone number"
  ],

  // media
  [
    "Audio",
    "Image",
    "Player",
    "Video",
    "Recorder",
    "Scanner",
    "Microphone",
    "Remote",
    "Movie",
    "Music",
    "Channels",
    "Volume",
    "Device info",
    "Audio manager",
    "HDMI",
    "Sound",
    "Playback",
    "Headphone",
    "Presentation",
    "Media type",
    "Timestamp",
    "Audio track",
    "Video quality",
    "Camera",
    "Interface",
    "Length",
    "Face detector",
    "Media Cas",
    "Session",
    "Codec",
    "Callback",
    "Color",
    "Feature",
    "Profile",
    "Encoder",
    "Controller",
    "Media description",
    "Media ID",
    "Media name",
    "DRM",
    "Key",
    "Media format",
    "Metadata",
    "Muxer",
    "Players",
    "Voice",
    "Router",
    "Display",
    "Media connection",
    "Sync",
    "Rating",
    "Ringtone",
    "TONE",
    "Processing",
    "Environtmental",
    "Equalizer",
    "Virtualizer",
    "Browser",
    "Effect",
    "Midi",
    "Projection",
    "TV",
    "Preview",
    "Program",
    "Flash",
    "GPS",
    "Speed",
    "Lens",
    "Light",
    "Adapter",
    "HTTP",
    "Sensor",
    "Widget"
  ],

  // Telephony
  [
    "MMS",
    "SMS",
    "ThreadsColumns",
    "Carrier",
    "Service",
    "Network type",
    "MNC",
    "Roaming",
    "Cell",
    "ICC",
    "Session",
    "Phone number",
    "Phone status",
    "Subscription",
    "Telephony manager",
    "Callback",
    "UICC",
    "Voicemail",
    "APN",
    "EUICC",
    "Download",
    "File info",
    "Group call",
    "MBMS"
  ],

  // User info
  [
    "Account",
    "Name",
    "Contact",
    "User profile",
    "Address",
    "Age",
    "Bigraphy",
    "Birthdays",
    "Email",
    "Gender",
    "Organizations",
    "Bigraphic",
    "Nickname",
    "Occupation",
    "Phone number",
    "SIP",
    "URL",
    "profile"
  ],

  // purchase
  ["business", "commercial", "businesses", "purchase"],

  // medical
  ["medical", "healthcare", "health care", "disease"],

  // profiling
  ["profile", "profiling"],

  //
  ["Analytics", "analysis", "analyze", "analyse", "analyzing"],

  //
  ["Statistical", "statistics"],

  //
  ["ads", "advertising", "advertisement", "advertisers"],

  //
  ["maintain", "maintenance", "maintained"],

  //
  [
    "identifier",
    "identifying",
    "authentication",
    "authenticate",
    "authenticates",
    "identity",
    "identities",
    "identifiable",
    "identifies"
  ],

  //
  ["Troubleshooting", "tests", "testing", "troubleshoot"],

  //
  ["purchase", "purchasing", "payment"],

  //
  ["delivery", "shipping", "delivering"],

  //
  ["Contacting", "contacts", "contacted", "communications"],

  //
  ["research", "researching"],

  //
  ["survey"],

  //
  ["Treatment"],

  //
  ["diagnostics", "diagnosis"],

  //
  ["improve", "improving", "improvement"],

  //
  ["new service", "new product", "new feature", "new functions"],

  //
  ["Booking"],

  // third party
  [
    "a.applovin.com",
    "aarki.net",
    "active.mobi",
    "adactioninteractive.com",
    "Adcolony",
    "addthis.com",
    "adfalcon.com",
    "adjust.com",
    "admin.appnext.com",
    "admixer.co.kr",
    "admobgeek.com",
    "Adobe",
    "adroll.com",
    "adrta.com",
    "Ads Moloco",
    "Ads Server",
    "Ads Symptotic",
    "AdSafeProtected",
    "agkn.com",
    "airpush.com",
    "akamaihd.net",
    "algovid.com",
    "Altitude-arena",
    "altrooz.com",
    "Amazon",
    "api reporting review mobile ads",
    "api.pingstart.com",
    "App Adsp",
    "app.appsflyer.com",
    "apperol.com",
    "applovin.com",
    "appmakertw",
    "appnext.com",
    "appsflyer.com",
    "AppsGeyser",
    "apptrknow.com",
    "appwalls.mobi",
    "apsalar.com",
    "aptrk.com",
    "Avocarrot",
    "Baidu",
    "beacon.krxd.net",
    "beaconsinspace.com",
    "bidswitch.net",
    "Bluekai.com",
    "bttrack.com",
    "casalemedia.com",
    "cauly.co",
    "chartbeat.net",
    "choices.truste.com",
    "clinkadtracking.com",
    "control.kochava.com",
    "cootek.com",
    "criteo.com",
    "cs.gssprt.jp",
    "cs.nend.net",
    "DoubleVerify",
    "dpm.demdex.net",
    "Dribbble",
    "everesttech.net",
    "Facebook",
    "feedmob.com",
    "Google Ads",
    "Google Analytics",
    "Google Data API",
    "Google Doc",
    "Google Firebase",
    "Google Fonts",
    "Google Map",
    "Google Play",
    "Google Tag Manager",
    "Google Video",
    "Google Vision",
    "Google Youtube",
    "gstatic.com",
    "guest.wireless.cmu.edu",
    "haloapps.com",
    "Heyzap",
    "http://timmystudios.com/",
    "i-mobile.co.jp",
    "impact.applifier.com",
    "inmobi.com",
    "inmobicdn.net",
    "Instagram",
    "intentiq.com",
    "jennywsplash.com",
    "Kakao",
    "kikabackend.com",
    "kikakeyboard.com",
    "Kiosked",
    "Leadbolt Ads",
    "leadboltapps.net",
    "lenzmx.com",
    "lfstmedia.com",
    "liftoff.io",
    "lkqd.net",
    "ludei.com",
    "Microsoft",
    "mixpanel.com",
    "Moat Ads",
    "mobile-update.com",
    "mobile.btrll.com",
    "mobilecore.com",
    "Mobincube",
    "mookie1.com",
    "MoPub",
    "mxptint.net",
    "Mydas Mobi",
    "Myi Ads",
    "mysearch-online.com",
    "Native Ads",
    "nend.net",
    "newoffer2017.com",
    "nexac.com",
    "online-metrix.net",
    "paperlit.com",
    "Payco",
    "phonegame.so",
    "play.king.com",
    "Pub Ads",
    "pubmatic.com",
    "quantcount.com",
    "Quiztapp",
    "rayjump.com",
    "sappsuma.com",
    "sc.iasds01.com",
    "Scorecard Research",
    "searchmobileonline.com",
    "Securepub Ads",
    "silvermob.com",
    "simpli.fi",
    "smtrk.com",
    "smaato",
    "smartadserver",
    "Spotify",
    "Start App Service",
    "stat.appioapp.com",
    "Sticky ads TV",
    "sumatoad.com",
    "SuperSonic Ads",
    "Sync",
    "tapad.com",
    "tapjoy.com",
    "tappx.com",
    "Taptica",
    "Te Ads",
    "theappsgalore.com",
    "tinyhoneybee.com",
    "tlnk.io",
    "turn.com",
    "Twitter",
    "Unity Ads",
    "Unknown",
    "vdopia.com",
    "volo-mobile.com",
    "vungle.com",
    "w55c.net",
    "www.appyet.com",
    "www.blogger.com",
    "www.cdnstabletransit.com",
    "www.cmu.edu",
    "www.gamefeat.net",
    "www.nexogen.in",
    "www.searchmobileonline.com",
    "www.ssacdn.com",
    "www.startappexchange.com",
    "Yahoo",
    "Yandex",
    "ymtracking.com",
    "yyapi.net"
  ]
];
async function getSentenceStructure(comment) {
  const selectedKeys = ["dobj", "compound", "case", "obl", "amod", "nsubj", "nmod"];
  const result = [];
  const props = new Properties({
    annotators: "tokenize,ssplit,pos,lemma,ner,parse",
    outputFormat: "json",
    timeout: 30000
  });
  const pipeline = new Pipeline(props, "English"); // uses ConnectorServer by default
  const sent = new CoreNLP.simple.Expression(comment);

  const nlpResult = await pipeline.annotate(sent);

  nlpResult.toJSON().sentences.forEach(sentence => {
    const basicDependencies = sentence.toJSON()[3].toJSON();

    Object.entries(basicDependencies).forEach(([, dependent]) => {
      // {
      // 	dep: 'dobj',
      // 	governor: 31,
      // 	governorGloss: 'see',
      // 	dependent: 33,
      // 	dependentGloss: 'room'
      // }
      if (dependent.dep && selectedKeys.includes(dependent.dep)) {
        result.push(dependent);
      }
    });
  });

  return result;
}
function getStructureBySimiWords(securityKeyWords, structure) {
  // get most similar words
  let securitySimiWords = {};

  for (let i = 0; i < securityKeyWords.length; i++) {
    const keyword = securityKeyWords[i];

    let mostSimilarWords;
    if (w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword];
    else {
      mostSimilarWords = w2vModel.mostSimilar(keyword, 20);

      w2vModelData[keyword] = mostSimilarWords;
    }
    securitySimiWords[keyword] = mostSimilarWords;
  }
  const words = Object.entries(securitySimiWords).reduce((acc, [, wordsByKey]) => {
    acc = [...acc, ..._.map(wordsByKey, "word").map(item => item.toLowerCase())];
    return acc;
  }, []);

  const simiWordsSelected = [];
  const result = structure.filter(item => {
    const isBoolean = words.includes(item.governorGloss) || words.includes(item.dependentGloss);

    words.forEach(item2 => {
      if (item2.toLowerCase() === item.governorGloss.toLowerCase())
        simiWordsSelected.push(item.governorGloss);
      if (item2.toLowerCase() === item.dependentGloss.toLowerCase())
        simiWordsSelected.push(item.dependentGloss);
    });

    return isBoolean;
  });

  return [securitySimiWords, result, simiWordsSelected];
}

function getStructureByTypes(types, structure) {
  // get most similar words
  let securitySimiWords = {};

  for (let typeName of types) {
    const subItems = types[typeName];
  }

  for (let i = 0; i < securityKeyWords.length; i++) {
    const keyword = securityKeyWords[i];

    const mostSimilarWords = w2vModel.mostSimilar(keyword, 20);
    securitySimiWords[keyword] = mostSimilarWords;
  }
  console.log(3, securitySimiWords);

  const words = Object.entries(securitySimiWords).reduce((acc, [, wordsByKey]) => {
    acc = [...acc, ..._.map(wordsByKey, "word").map(item => item.toLowerCase())];
    return acc;
  }, []);

  const result = structure.filter(item => {
    return words.includes(item.governorGloss) || words.includes(item.dependentGloss);
  });

  return [securitySimiWords, result];
}

// getStructureComment(comment)
async function getStructureComment(comment) {
  console.log("getSentenceStructure");
  const structure = await getSentenceStructure(comment);

  return structure;
}

async function getStructureBySimis(structure) {
  const securityKeyWords = ["security"];
  let [securitySimiWords, securityStructure] = getStructureBySimiWords(securityKeyWords, structure);
  let [, securityStructureWithKeywords] = getStructureBySimiWords(
    ["bad", "good"],
    securityStructure
  );

  const privacyKeyWords = ["privacy"];
  const [privacySimiWords, privacyStructure] = getStructureBySimiWords(privacyKeyWords, structure);
  let [, privacyStructureWithKeyWords] = getStructureBySimiWords(["bad", "good"], privacyStructure);

  const permissionKeyWords = ["permission"];
  const [permissionSimiWords, permissionStructure] = getStructureBySimiWords(
    permissionKeyWords,
    structure
  );
  let [, permissionStructureWithKeyWords] = getStructureBySimiWords(
    ["bad", "good"],
    permissionStructure
  );

  const collectionKeyWords = ["collection"];
  const [collectionSimiWords, collectionStructure] = getStructureBySimiWords(
    collectionKeyWords,
    structure
  );
  const collectionDataTypes = {};

  for (let typeName in dataTypes) {
    const subItems = dataTypes[typeName];

    subItems.forEach(item => {
      let [
        simiWordsByItem,
        collectionStructureWithKeyWords,
        simiWordsSelected
      ] = getStructureBySimiWords([item], collectionStructure);
      collectionSimiWords[item] = simiWordsByItem;

      if (collectionStructureWithKeyWords && collectionStructureWithKeyWords.length) {
        if (!collectionDataTypes[typeName]) collectionDataTypes[typeName] = [];

        simiWordsSelected.forEach(item => collectionDataTypes[typeName].push(item));

        collectionDataTypes[typeName] = _.uniq(collectionDataTypes[typeName]);
      }
    });
  }

  const sharingKeyWords = ["sharing"];
  const [sharingSimiWords, sharingStructure] = getStructureBySimiWords(sharingKeyWords, structure);
  const sharingDataTypes = {};
  for (let typeName in dataTypes) {
    const subItems = dataTypes[typeName];

    subItems.forEach(item => {
      let [
        simiWordsByItem,
        sharingStructureWithKeyWords,
        simiWordsSelected
      ] = getStructureBySimiWords([item], sharingStructure);
      sharingSimiWords[item] = simiWordsByItem;

      if (sharingStructureWithKeyWords && sharingStructureWithKeyWords.length) {
        if (!sharingDataTypes[typeName]) sharingDataTypes[typeName] = [];

        simiWordsSelected.forEach(item => sharingDataTypes[typeName].push(item));

        sharingDataTypes[typeName] = _.uniq(sharingDataTypes[typeName]);
      }
    });
  }
  return [
    securityKeyWords,
    securitySimiWords,
    securityStructure,
    securityStructureWithKeywords,
    privacyKeyWords,
    privacySimiWords,
    privacyStructure,
    privacyStructureWithKeyWords,
    permissionKeyWords,
    permissionSimiWords,
    permissionStructure,
    permissionStructureWithKeyWords,
    collectionKeyWords,
    collectionSimiWords,
    collectionStructure,
    collectionDataTypes,
    sharingKeyWords,
    sharingSimiWords,
    sharingStructure,
    sharingDataTypes
  ];
}

async function step1() {
  const comments = await Models.Comment.find({
    isGetStructure: { $ne: true }
  });

  for (let i = 0; i < comments.length; i++) {
    console.log(`Running ${i + 1}/${comments.length}`);
    const comment = comments[i];

    // const [securityKeyWords, securitySimiWords, securityStructure, structure] = await getStructureComment(comment.comment)
    const structure = await retry(getStructureComment(comment.comment), 10);

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      {
        isGetStructure: true
      }
    );

    await Models.CommentMeta.insertMany([
      // {
      // 	commentId: comment.id,
      // 	key: 'securityKeyWords',
      // 	value: JSON.stringify(securityKeyWords)
      // },
      // {
      // 	commentId: comment.id,
      // 	key: 'securitySimiWords',
      // 	value: JSON.stringify(securitySimiWords)
      // },
      // {
      // 	commentId: comment.id,
      // 	key: 'securityStructure',
      // 	value: JSON.stringify(securityStructure)
      // },
      {
        commentId: comment.id,
        key: "structure",
        value: JSON.stringify(structure)
      }
    ]);
  }
}

async function step2() {
  console.log("Load model");
  // https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
  w2vModel = await new Promise((resolve, reject) => {
    w2v.loadModel(process.env.W2V_MODEL, function(error, model) {
      if (error) reject(error);

      resolve(model);
    });
  });

  const comments = await Models.Comment.find({
    isAnalyzed: {
      $ne: true
    },
    isLabeled: true
  });

  const step2ByApp = async comment => {
    let structure = await Models.CommentMeta.findOne({
      commentId: comment.id,
      key: "structure"
    });
    structure = JSON.parse(structure.value);

    const [
      securityKeyWords,
      securitySimiWords,
      securityStructure,
      securityStructureWithKeywords,
      privacyKeyWords,
      privacySimiWords,
      privacyStructure,
      privacyStructureWithKeyWords,
      permissionKeyWords,
      permissionSimiWords,
      permissionStructure,
      permissionStructureWithKeyWords,
      collectionKeyWords,
      collectionSimiWords,
      collectionStructure,
      collectionDataTypes,
      sharingKeyWords,
      sharingSimiWords,
      sharingStructure,
      sharingDataTypes
    ] = await getStructureBySimis(structure);

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      {
        securityKeyWords,
        securitySimiWords,
        securityStructure,
        securityStructureWithKeywords,
        privacyKeyWords,
        privacySimiWords,
        privacyStructure,
        privacyStructureWithKeyWords,
        permissionKeyWords,
        permissionSimiWords,
        permissionStructure,
        permissionStructureWithKeyWords,
        collectionKeyWords,
        collectionSimiWords,
        collectionStructure,
        collectionDataTypes,
        sharingKeyWords,
        sharingSimiWords,
        sharingStructure,
        sharingDataTypes,
        isAnalyzed: true
      }
    );

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "securityKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "securitySimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "securityStructure" });
    await Models.CommentMeta.deleteMany({
      commentId: comment.id,
      key: "securityStructureWithKeywords"
    });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "privacyKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "privacySimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "privacyStructure" });
    await Models.CommentMeta.deleteMany({
      commentId: comment.id,
      key: "privacyStructureWithKeyWords"
    });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "permissionKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "permissionSimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "permissionStructure" });
    await Models.CommentMeta.deleteMany({
      commentId: comment.id,
      key: "permissionStructureWithKeyWords"
    });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionSimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionStructure" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionDataTypes" });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingSimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingStructure" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingDataTypes" });

    await Models.CommentMeta.insertMany([
      {
        commentId: comment.id,
        key: "securityKeyWords",
        value: JSON.stringify(securityKeyWords)
      },
      {
        commentId: comment.id,
        key: "securitySimiWords",
        value: JSON.stringify(securitySimiWords)
      },
      {
        commentId: comment.id,
        key: "securityStructure",
        value: JSON.stringify(securityStructure)
      },
      {
        commentId: comment.id,
        key: "securityStructureWithKeywords",
        value: JSON.stringify(securityStructureWithKeywords)
      },

      {
        commentId: comment.id,
        key: "privacyKeyWords",
        value: JSON.stringify(privacyKeyWords)
      },
      {
        commentId: comment.id,
        key: "privacySimiWords",
        value: JSON.stringify(privacySimiWords)
      },
      {
        commentId: comment.id,
        key: "privacyStructure",
        value: JSON.stringify(privacyStructure)
      },
      {
        commentId: comment.id,
        key: "privacyStructureWithKeyWords",
        value: JSON.stringify(privacyStructureWithKeyWords)
      },

      {
        commentId: comment.id,
        key: "permissionKeyWords",
        value: JSON.stringify(permissionKeyWords)
      },
      {
        commentId: comment.id,
        key: "permissionSimiWords",
        value: JSON.stringify(permissionSimiWords)
      },
      {
        commentId: comment.id,
        key: "permissionStructure",
        value: JSON.stringify(permissionStructure)
      },
      {
        commentId: comment.id,
        key: "permissionStructureWithKeyWords",
        value: JSON.stringify(permissionStructureWithKeyWords)
      },

      {
        commentId: comment.id,
        key: "collectionKeyWords",
        value: JSON.stringify(collectionKeyWords)
      },
      {
        commentId: comment.id,
        key: "collectionSimiWords",
        value: JSON.stringify(collectionSimiWords)
      },
      {
        commentId: comment.id,
        key: "collectionStructure",
        value: JSON.stringify(collectionStructure)
      },
      {
        commentId: comment.id,
        key: "collectionDataTypes",
        value: JSON.stringify(collectionDataTypes)
      },

      {
        commentId: comment.id,
        key: "sharingKeyWords",
        value: JSON.stringify(sharingKeyWords)
      },
      {
        commentId: comment.id,
        key: "sharingSimiWords",
        value: JSON.stringify(sharingSimiWords)
      },
      {
        commentId: comment.id,
        key: "sharingStructure",
        value: JSON.stringify(sharingStructure)
      },
      {
        commentId: comment.id,
        key: "sharingDataTypes",
        value: JSON.stringify(sharingDataTypes)
      }
    ]);
  };

  const commentChunks = _.chunk(comments, 100);
  for (let i = 0; i < commentChunks.length; i++) {
    console.log(`Running ${i + 1}/${commentChunks.length}`);
    const chunk = commentChunks[i];

    await Promise.all(chunk.map(step2ByApp));
  }
}

async function step22() {
  console.log("Running step22");
  console.log("Load model");
  const stemmer = natural.PorterStemmer;

  // https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
  w2vModel = await new Promise((resolve, reject) => {
    w2v.loadModel(process.env.W2V_MODEL, function(error, model) {
      if (error) reject(error);

      resolve(model);
    });
  });

  const getMostSimilarWords = keyword => {
    let mostSimilarWords = [];
    if (w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword];
    else {
      mostSimilarWords = w2vModel.mostSimilar(keyword, 20) || [];
      w2vModelData[keyword] = mostSimilarWords;
    }

    mostSimilarWords = _.map(mostSimilarWords, "word").map(item => item.toLowerCase());

    return mostSimilarWords && mostSimilarWords.length ? mostSimilarWords : [keyword.toLowerCase()];
  };

  const findKeydsInText = (keys, text) => {
    text = text.toLowerCase();

    return keys.filter(key => text.includes(key.toLowerCase()));
  };

  const getData = async comment => {
    const commentText = stemmer.stem(comment.comment);
    const subComments = commentText
      .split(".")
      .map(item => item.trim())
      .filter(item => !!item);
    //
    const simiSecurity = getMostSimilarWords("security").map(stemmer.stem);

    console.log(1, commentText);
    let securitySentences = subComments.filter(subComment => {
      return simiSecurity.some(word => subComment.toLowerCase().includes(word.toLowerCase()));
    });
    securitySentences = _.uniq(securitySentences);

    //
    const simiPrivacy = getMostSimilarWords("privacy").map(stemmer.stem);
    let privacySentences = subComments.filter(subComment => {
      return simiPrivacy.some(word => subComment.toLowerCase().includes(word.toLowerCase()));
    });
    privacySentences = _.uniq(privacySentences);

    //
    const simiPermission = getMostSimilarWords("permission").map(stemmer.stem);
    const hasPermission = simiPermission.some(word =>
      commentText.toLowerCase().includes(word.toLowerCase())
    );
    let permissionSentences = [];
    if (hasPermission) {
      const simiPermissionItems = PERMISSIONS.reduce((acc, item) => {
        return (acc = [...acc, ...getMostSimilarWords(item).map(stemmer.stem)]);
      }, []);
      permissionSentences = subComments.filter(subComment => {
        return !!findKeydsInText(simiPermissionItems, subComment).length;
      });
    }

    //

    const dataItems = DATA_TYPES.filter(item => {
      // const simiItems = getMostSimilarWords(item);

      // return !!findKeydsInText(simiItems, commentText).length;
      return commentText.toLowerCase().includes(stemmer.stem(item).toLowerCase());
    });

    //
    const purposes = PURPOSES.filter(item => {
      // const simiItems = getMostSimilarWords(item);

      // return !!findKeydsInText(simiItems, commentText).length;
      return commentText.toLowerCase().includes(stemmer.stem(item).toLowerCase());
    });

    //
    const thirdParties = THIRD_PARTIES.filter(item => {
      // const simiItems = getMostSimilarWords(item);

      // return !!findKeydsInText(simiItems, commentText).length;
      return commentText.toLowerCase().includes(stemmer.stem(item).toLowerCase());
    });
    //
    const simiCollection = getMostSimilarWords("collection").map(stemmer.stem);
    const hasCollection = !!findKeydsInText(simiCollection, commentText).length;

    let collectionSentences = [];
    if (hasCollection) {
      const simiItems = [...DATA_TYPES, ...PURPOSES].reduce((acc, item) => {
        return (acc = [...acc, ...getMostSimilarWords(item).map(stemmer.stem)]);
      }, []);

      collectionSentences = subComments.filter(subComment => {
        return !!findKeydsInText(simiItems, subComment).length;
      });
    }
    collectionSentences = _.uniq(collectionSentences);

    //
    const simiSharing = getMostSimilarWords("sharing").map(stemmer.stem);
    const hasSharing = !!findKeydsInText(simiSharing, commentText).length;
    let sharingSentences = [];
    if (hasSharing) {
      const simiItems = [...DATA_TYPES, ...PURPOSES, ...THIRD_PARTIES].reduce((acc, item) => {
        return (acc = [...acc, ...getMostSimilarWords(item).map(stemmer.stem)]);
      }, []);

      sharingSentences = subComments.filter(subComment => {
        return !!findKeydsInText(simiItems, subComment).length;
      });
    }
    sharingSentences = _.uniq(sharingSentences);

    const result = {
      securitySentences,
      privacySentences,
      permissionSentences,
      collectionSentences,
      sharingSentences,
      dataItems,
      purposes,
      thirdParties,
      isCheckRelated: true
    };

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      result
    );
    return;
  };

  let comments;
  do {
    comments = await Models.Comment.find({
      // isShowOnRais3: true,
      isNotLabel: true,
      isCheckRelated: { $exists: false },
      $or: [
        { securitySentences: [] },
        { privacySentences: [] },
        { permissionSentences: [] },
        { collectionSentences: [] },
        { sharingSentences: [] }
      ]
    }).limit(1000);

    await bluebird.map(
      comments,
      (comment, i) => {
        // console.log(`Running ${i + 1}/${comments.length}`);
        return getData(comment);
      },
      { concurrency: 20 }
    );
  } while (comments.length === 1000);

  // for(let i = 0; i < comments.length; i++) {
  // 	const comment = comments[i]

  // 	await getData(comment.comment)
  // }

  // const commentChunks = _.chunk(comments, 100);
  // for (let i = 0; i < commentChunks.length; i++) {
  //   console.log(`Running ${i + 1}/${commentChunks.length}`);
  //   const chunk = commentChunks[i];

  //   await Promise.all(chunk.map(getData));
  // }

  console.log("DONE");
}

async function reportComments() {
  const [comments, answers] = await Promise.all([Models.Comment.find({}), Models.Answer.find()]);

  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "comments",
      title: "Comments"
    },
    {
      id: "app",
      title: "App"
    },
    {
      id: "security",
      title: "Security"
    },
    {
      id: "privacy",
      title: "Privacy"
    },
    {
      id: "permission",
      title: "Permission"
    },
    {
      id: "dataCollection",
      title: "Data collection"
    },
    {
      id: "dataSharing",
      title: "Data sharing"
    }
  ];
  let rows = [];

  await bluebird.map(
    comments,
    (comment, i) => {
      return (async () => {
        let row = {};
        // const app = await Models.App.findOne({
        //   appName: comment.appName
        // });
        answers.forEach(answer => {
          const { questions: answerQuestions } = answer;
          answerQuestions.forEach(answerQuestion => {
            if (answerQuestion.commentId === comment.commentId) {
              const responses = answerQuestion.responses;

              const security = responses.find(item => item.name === "question2");
              const privacy = responses.find(item => item.name === "question3");
              const permission = responses.find(item => item.name === "question4");
              const dataCollection = responses.find(item => item.name === "question5");
              const dataSharing = responses.find(item => item.name === "question6");

              row = {
                ...row,
                security: security.value !== "3" ? "x" : "",
                privacy: privacy.value !== "3" ? "x" : "",
                permission: dataCollection.value === "1" ? "x" : "",
                dataCollection: dataCollection.value === "1" ? "x" : "",
                dataSharing: dataCollection.value === "1" ? "x" : ""
              };
            }
          });
        });

        rows.push({
          ...row,
          stt: i + 1,
          app: comment.appName,
          comments: comment.comment
        });
      })();
    },
    { concurrency: 100 }
  );
  rows = _.sortBy(rows, "stt");
  const csvWriter = createCsvWriter({
    path: "./comments-report.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
}

async function getTranningSet() {
  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/Label_Comments.csv");

  const header = [
    // {
    //   id: "stt",
    //   title: "#"
    // },
    {
      id: "label",
      title: "label"
    },
    // {
    //   id: "char",
    //   title: "char"
    // },
    {
      id: "comment",
      title: "comment"
    }
  ];

  const securityTraning = [];
  for (let i = 0; i < dataCSV.length; i++) {
    const [stt, comment, appName, rating, security] = dataCSV[i];

    const generatedComments = generateComment(comment);
    generatedComments.forEach(commentText => {
      securityTraning.push({
        stt,
        label: security === "" ? 1 : 2,
        char: "q",
        comment: commentText
      });
    });
  }

  const csvWriter = createCsvWriter({
    path: "./securityTraning.csv",
    header
  });
  csvWriter.writeRecords(securityTraning);
  console.log("done");
}

async function getTestingSet() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "comment",
      title: "comment"
    }
  ];
  const comments = await Models.Comment.find({
    isRelatedRail3: true,
    scores: {
      $exists: false
    }
  })
    .select("comment")
    .limit();

  const rows = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    rows.push({
      stt: i,
      comment: comment.comment
    });
  }

  const csvWriter = createCsvWriter({
    path: "./testing.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("done");
}

function generateComment(comment) {
  if (!comment) return [];
  comment = comment.toLowerCase();

  let result = [comment];
  SYNTHETIC.forEach(words => {
    words = words.map(word => word.toLowerCase());

    words.forEach(word => {
      const foundWord = !!word && !!comment.includes(word) && word;

      if (foundWord) {
        const regex = new RegExp(`(${foundWord}[a-z]*)`, "gi");

        words.forEach(item => {
          const newComment = comment.replace(regex, item);

          result.push(newComment);
        });
      }
    });
  });

  result = _.uniq(result);

  return result;
}

async function rawData() {
  const fs = require("fs");
  console.log("1");
  // const res = await axios.get("https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=kaka1");
  const $ = cheerio.load(res.data);
  fs.writeFileSync("./kaka.html", res.data);
  console.log("loaded");
  $("#gs_res_ccl_mid .gs_r.gs_or.gs_scl").each((index, post) => {
    console.log(index);
    const $post = $(post);
    const title = $post.find("h3 a").text();
    let relatedPostAction = $post
      .find(".gs_ri .gs_fl a")
      .filter((_, action) => $(action).text() === "Related articles");
    relatedPostAction = relatedPostAction[0];
    const relatedPostActionHTML = $(relatedPostAction).html();

    if (relatedPostActionHTML) {
      const regex = new RegExp("q=info:([a-zA-Z0-9]+):scholar.google.com", "i");
      // const id = "https://scholar.google.com/scholar?q=info:Eu2XDpXt6G4J:scholar.google.com/&output=cite&scirp=0&hl=en".match(regex)[1]
      console.log(id);
    }
    console.log(1, title, relatedPostActionHTML);

    // const res = await axios.get(
    //   "https://scholar.google.com/scholar?q=info:Eu2XDpXt6G4J:scholar.google.com/&output=cite&scirp=0&hl=en"
    // );
  });
  console.log("Done");
}

async function calculateResults() {
  console.log("Running calculateResults");
  const comments = await Models.Comment.find({
    // permissionResult: { $exists: false }
  });

  await bluebird.map(
    comments,
    (comment, i) => {
      return (async () => {
        let {
          id,
          appName,
          permissions: commentPermissions = [],
          dataTypes: commentDataType = {},
          purposes: commentPurposes = [],
          thirdParties: commentThirdParties = [],
          perissionType,
          dataItemType,
          purposeType,
          thirdPartyType
        } = comment;

        const app = await Models.App.findOne({
          appName: appName
        });
        if (!app) return;
        const {
          permissions: appPermissions = [],
          dataTypes: appDataItems = [],
          purposesHP: appPurposes = [],
          thirdPartiesHP: appThirdParties = []
        } = app;

        const appPermissionGroups = getPermissionGroups(appPermissions);
        const permissionResult = calculatePermissionOnlyPer(
          appPermissionGroups,
          commentPermissions,
          perissionType,
          appPermissions
        );

        // data type
        const appDataTypes = getDataTypesFromItem(appDataItems);
        commentDataType = Object.keys(commentDataType);
        const dataTypeResult = calculatePermission(appDataTypes, commentDataType, dataItemType);

        // purpose
        const purposeResult = calculatePermission(appPurposes, commentPurposes, purposeType);

        console.log({ appThirdParties, commentThirdParties });
        // thirt party
        const thirdPartyResult = calculatePermission(
          appThirdParties,
          commentThirdParties,
          thirdPartyType
        );

        await Models.Comment.updateOne(
          {
            _id: id
          },
          {
            permissionResult,
            dataTypeResult,
            purposeResult,
            thirdPartyResult
          }
        );
      })();
    },
    { concurrency: 100 }
  );
}

function getDataTypesFromItem(dataItems) {
  const result = Object.entries(dataCollectionTypes)
    .filter(([dataTypeName, dataItemsInType]) => {
      return !!_.intersection(dataItemsInType, dataItems).length;
    })
    .map(([dataTypeName]) => dataTypeName);

  return result;
}
function calculatePermissionOnlyPer(
  appPermissionGroups,
  commentPermissions,
  perissionType,
  appPermissionItems
) {
  let permissionResult = 0;
  const totalAppPermision = appPermissionGroups.length;
  const totalCommentPermision = commentPermissions.length;
  try {
    if (!totalAppPermision || !totalCommentPermision) {
      return permissionResult;
    }

    if (perissionType === "all") {
      permissionResult = (appPermissionItems / 191).toFixed(2);
    } else if (perissionType === "specific") {
      const intersection = _.intersection(appPermissionGroups, commentPermissions);

      permissionResult = (intersection.length / totalCommentPermision).toFixed(2);
    }

    return permissionResult;
  } catch (err) {
    console.log("calculatePermission ERROR", err.message, totalAppPermision, totalCommentPermision);
  }
}

function calculatePermission(appPermissionGroups, commentPermissions, perissionType) {
  let permissionResult = 0;
  const totalAppPermision = appPermissionGroups.length;
  const totalCommentPermision = commentPermissions.length;
  try {
    if (!totalAppPermision || !totalCommentPermision) {
      return permissionResult;
    }

    if (perissionType === "all") {
      permissionResult = (totalCommentPermision / totalAppPermision).toFixed(2);
    } else if (perissionType === "specific") {
      const intersection = _.intersection(appPermissionGroups, commentPermissions);

      permissionResult = (intersection.length / totalCommentPermision).toFixed(2);
    }

    return permissionResult;
  } catch (err) {
    console.log("calculatePermission ERROR", err.message, totalAppPermision, totalCommentPermision);
  }
}
function getPermissionGroups(appPermissions) {
  if (!appPermissions.length) return [];
  const appPermissionGroups = Object.entries(permissionTypes)
    .filter(([_, permissions]) => {
      return !!getDupkicatedValues([...permissions, ...appPermissions]).length;
    })
    .map(([groupName]) => groupName);
  return appPermissionGroups;
}
function getDupkicatedValues(arr) {
  return _.filter(arr, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
}

async function getSentimentOfApp() {
  const Analyzer = require("natural").SentimentAnalyzer;
  const stemmer = require("natural").PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");

  const comments = await Models.Comment.find({
    // sentiment: { $exists: false }
  });

  console.log("comments", comments);
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    const sentiment = analyzer.getSentiment(comment.comment.split(" ")).toFixed(2);

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      {
        sentiment
      }
    );
  }
  console.log("DONE getSentimentOfApp");
}
async function updateSectionsToShow() {
  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/Comment_dataset.csv");

  await bluebird.map(
    dataCSV,
    async (item, i) => {
      const [
        stt,
        comment,
        appName,
        security,
        privacy,
        permission,
        dataCollection,
        dataSharing
      ] = item;

      await Models.Comment.updateOne(
        {
          comment
        },
        {
          isShowSecurityRail3: security === "x",
          isShowPrivacyRail3: privacy === "x",
          isShowPermissionRail3: permission === "x",
          isShowDataCollectionRail3: dataCollection === "x",
          isShowDataSharingRail3: dataSharing === "x"
        }
      );
    },
    { concurrency: 100 }
  );
}
async function getDistance() {
  const apps = await Models.App.find({
    // sentiment: { $exists: false }
  }).select("distance");

  const maxDis = _.maxBy(apps, "distance").get("distance");
  const minDis = _.minBy(apps, "distance").get("distance");

  const segment = (maxDis - minDis) / 5;

  const rangeVL = [minDis, minDis + segment * 1];
  const rangeL = [minDis + segment * 1, minDis + segment * 2];
  const rangeN = [minDis + segment * 2, minDis + segment * 3];
  const rangeH = [minDis + segment * 3, minDis + segment * 4];
  const rangeVH = [minDis + segment * 4, minDis + segment * 5];

  for (let i = 0; i < apps.length; i++) {
    console.log(i);
    const app = apps[i];

    let distanceRais3;
    if (_.inRange(app.distance, ...rangeVL)) {
      distanceRais3 = 0.1;
    } else if (_.inRange(app.distance, ...rangeL)) {
      distanceRais3 = 0.3;
    } else if (_.inRange(app.distance, ...rangeN)) {
      distanceRais3 = 0.5;
    } else if (_.inRange(app.distance, ...rangeH)) {
      distanceRais3 = 0.7;
    } else if (_.inRange(app.distance, ...rangeVH)) {
      distanceRais3 = 0.9;
    } else {
      distanceRais3 = 0.5;
    }

    await Models.App.updateOne(
      {
        _id: app.id
      },
      {
        distanceRais3
      }
    );
  }
  console.log("DONE");
}

async function updateComentShow() {
  let comments = await Models.Comment.updateMany(
    {
      $or: [
        { "scores.SPLabel": { $gte: 0.5 } },
        { "scores.permissionLabel": { $gte: 0.5 } },
        { "scores.dataCollectionLabel": { $gte: 0.5 } },
        { "scores.dataSharingLabel": { $gte: 0.5 } }
      ]
    },
    {
      isShowOnRais3: true
    }
  );

  console.log(comments);
  console.log("DONE");
}

async function getCommentSurvey() {
  let apps = await Models.App.find({}).select("_id");

  const appsHasComment = await bluebird.filter(apps, async app => {
    const isHasComment = await Models.Comment.findOne({
      appId: app.id,

      isShowOnRais3: true,
      $or: [
        { securitySentences: { $ne: [] } },
        { privacySentences: { $ne: [] } },
        { permissionSentences: { $ne: [] } },
        { collectionSentences: { $ne: [] } },
        { sharingSentences: { $ne: [] } }
      ]
    });
    return !!isHasComment;
  });

  const appSurveys = _.chunk(appsHasComment, 20);

  await Models.AppSurvey.deleteMany();

  await bluebird.map(appSurveys, async apps => {
    if (apps.length < 20) return;
    return Models.AppSurvey.create({
      apps: apps.map((app, stt) => ({ stt: stt + 1, appId: app.id }))
    });
  });

  console.log("DONE");
}

async function getCommentSurveyV2() {
  const surveys = await Models.AppSurvey.find({
    isDone: false,
    isV2: { $exists: false }
  });

  const appIds = surveys.reduce((acc, survey) => {
    acc = [...acc, ..._.map(survey.apps, "appId")];
    return acc;
  }, []);

  const appIdChunks = _.chunk(appIds, 14);

  await Models.AppSurvey.deleteMany({
    isV2: true
  });

  await bluebird.map(appIdChunks, async appIds => {
    if (appIds.length < 14) return;

    return Models.AppSurvey.create({
      apps: appIds.map((appId, stt) => ({ stt: stt + 1, appId })),
      isV2: true
    });
  });
}

async function getCommentSurveyV3() {
  await Models.AppSurvey.deleteMany({
    isV3: true
  });
  const apps = await Models.App.find({
    isTest5: true
  }).select("_id");

  const appsHasComment = await Promise.filter(
    apps,
    async app => {
      const comment = await Models.Comment.findOne({
        appId: app._id,
        isNotLabel: true,
        scores: { $exists: true, $ne: null },
        $or: [
          { securitySentences: { $ne: [] } },
          { privacySentences: { $ne: [] } },
          { permissionSentences: { $ne: [] } },
          { collectionSentences: { $ne: [] } },
          { sharingSentences: { $ne: [] } }
        ]
      });

      return !!comment;
    },
    {
      concurrency: 100
    }
  );

  // map comments to app
  const appsWithComments = await Promise.map(
    appsHasComment,
    async app => {
      app = app.toJSON();
      const comments = await Models.Comment.find({
        appId: app._id,
        isNotLabel: true,
        scores: { $exists: true, $ne: null },
        $or: [
          { securitySentences: { $ne: [] } },
          { privacySentences: { $ne: [] } },
          { permissionSentences: { $ne: [] } },
          { collectionSentences: { $ne: [] } },
          { sharingSentences: { $ne: [] } }
        ]
      }).limit(300);

      app.commentIds = _.map(comments, "_id");

      console.log(app.commentIds);
      return app;
    },
    {
      concurrency: 100
    }
  );

  const appChunks = _.chunk(appsWithComments, 5);
  await bluebird.map(appChunks, async apps => {
    if (apps.length < 5) return;

    let totalComment = 0;
    apps.forEach(app => {
      totalComment += app.commentIds.length;
    });

    return Models.AppSurvey.create({
      apps: apps.map((app, stt) => ({ stt: stt + 1, appId: app.id, commentIds: app.commentIds })),
      isV3: true,
      totalComment
    });
  });

  console.log("DONE getCommentSurveyV3");
}

async function report2() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "id",
      title: "id"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "time",
      title: "Time"
    },
    ...Array.from({ length: 7 }, (v, i) => ({
      id: `app${i + 1}`,
      title: `App ${i + 1}`
    })),
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "comment",
      title: "Comment"
    }
  ];

  const getValueByBoolean = value => {
    if (value === 1) return "Yes";
    else if (value === 0) return "No";
    else if (value === 2) return "Partially";
  };

  const getNameBySttSub = stt => {
    if (stt == 0) return "Security&Privacy";
    else if (stt == 1) return "Permission";
    else if (stt == 2) return "Data collection";
    else if (stt == 3) return "Data sharing";
  };

  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/CSVReport_50749452be0b_B_Page#1_With_PageSize#5000 (4).csv");

  const rows = [];
  const answers = await Models.Answer.find({});

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);

    // if (user.version !== "v1") continue;
    if (!user.isAnswerd || answer.questions.length < 7) continue;

    const resultInMicro = dataFromMicro.find(
      item => item[9]?.trim().toLowerCase() === user.email.trim().toLowerCase()
    );

    let row = {};
    let time = 0;
    answer.questions.forEach(appRes => {
      let appCol = "";
      appCol = `Time: ${appRes.time}s\n`;
      appRes.responses.forEach((commentRes, commentStt) => {
        appCol += `Comment ${commentStt + 1}: ${getValueByBoolean(commentRes.value)} \n`;

        if (commentRes.value == 2) {
          appCol += "   User provied:\n";
          Object.entries(commentRes.subQuestions).forEach(([sttSub, objectValue]) => {
            if (objectValue.selected) {
              appCol += `   - ${getNameBySttSub(sttSub)}: ${objectValue.result} \n`;
            }
          });
        }
      });

      row[`app${appRes.stt}`] = appCol;

      time += appRes.time;
    });

    rows.push({
      ...row,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      time: resultInMicro ? resultInMicro[8] : "",
      satisfied: answer.isSatisfied ? "Yes" : "No",
      comment: answer.isHasComment ? `Yes - ${answer.comment}` : "No"
    });
  }

  const csvWriter = createCsvWriter({
    path: "./report-rais3(file2).csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
}
async function report1() {
  let result = {
    0: 0,
    1: 0,
    2: 0
  };
  const answers = await Models.Answer.find({});
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];

    const user = await Models.User.findById(answer.userId);

    if (!user.isAnswerd || answer.questions.length < 7) continue;

    answer.questions.forEach(appRes => {
      appRes.responses.forEach(commentRes => {
        result[commentRes.value]++;
      });
    });
  }
  delete result.null;
  const total = _.sum(Object.values(result));

  const getValueByBoolean = value => {
    if (value == 1) return "Yes";
    else if (value == 0) return "No";
    else if (value == 2) return "Partially";
  };

  let text = "";
  Object.entries(result).forEach(([key, value]) => {
    text += `${getValueByBoolean(key)}: ${value}(${(value / total).toFixed(2) * 100}%)}\n`;
  });

  fs.writeFileSync("./report-rais3(file1).txt", text);
  console.log("DONE");
}

async function statAppcomment() {
  try {
    const header = [
      {
        id: "stt",
        title: "#"
      },
      {
        id: "appName",
        title: "App Name"
      },
      {
        id: "categoryName",
        title: "Category Name"
      },
      {
        id: "totalComment",
        title: "Total Comment"
      },
      {
        id: "totalRelatedComment",
        title: "Comments Including Keyword"
      },
      {
        id: "totalPredictComment",
        title: "Bert prediction"
      }
    ];

    const apps = await Models.App.find({
      isGotCommentV2: true
    }).select("appName categoryName");

    let rows = [];

    await Promise.map(
      apps,
      async (app, index) => {
        const comments = await Models.Comment.find({
          appId: app._id
        }).select("isRelatedRail3 scores");

        const relatedComments = comments.filter(item => item.isRelatedRail3);
        const predictionComments = relatedComments.filter(item => !_.isEmpty(item.scores));

        rows.push({
          stt: index + 1,
          appName: app.appName,
          categoryName: app.categoryName,
          totalComment: comments.length,
          totalRelatedComment: relatedComments.length,
          totalPredictComment: predictionComments.length
        });
      },
      { concurrency: 100 }
    );

    rows = rows.filter(row => row.totalRelatedComment !== 0 || row.totalPredictComment !== 0);
    rows = _.orderBy(rows, ["totalRelatedComment"], ["desc"]);
    rows = rows.map((item, index) => {
      item.stt = index + 1;

      return item;
    });

    const csvWriter = createCsvWriter({
      path: "./app-comment(rais3).csv",
      header
    });
    csvWriter.writeRecords(rows);
  } catch (err) {
    console.error(err);
  }
}

async function statCatApp() {
  try {
    const header = [
      {
        id: "stt",
        title: "#"
      },
      {
        id: "categoryName",
        title: "Category Name"
      },
      {
        id: "app",
        title: "App"
      }
    ];

    let apps = await Models.App.find({
      isGotCommentV2: true
    }).select("appName categoryName");

    apps = await Promise.map(
      apps,
      async app => {
        const totalComment = await Models.Comment.count({
          appId: app._id,
          isRelatedRail3: true
        }).select("_id");

        return {
          ...app.toJSON(),
          totalComment
        };
      },
      { concurrency: 1000 }
    );

    const appsGroupByCat = _.groupBy(apps, "categoryName");

    let rows = [];
    Object.entries(appsGroupByCat).forEach(([categoryName, apps], index) => {
      rows.push({
        stt: index + 1,
        categoryName,
        app: _.sumBy(apps, "totalComment")
      });
    });

    rows = _.orderBy(rows, ["app"], ["desc"]);
    rows = rows.map((item, index) => {
      item.stt = index + 1;

      return item;
    });

    console.log(rows);

    const csvWriter = createCsvWriter({
      path: "./category-app(rais3).csv",
      header
    });
    csvWriter.writeRecords(rows);

    console.log("DONE");
  } catch (error) {
    console.log(error);
  }
}

async function getRemainingComments() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "categoryName",
      title: "Category Name"
    },
    {
      id: "appName",
      title: "App Name"
    },
    {
      id: "userName",
      title: "User Name"
    },
    {
      id: "comment",
      title: "comment"
    }
  ];

  const comments = await Models.Comment.find({
    label: { $exists: false }
  });

  let rows = await Promise.map(
    comments,
    async function(comment) {
      const app = await Models.App.findOne({
        appName: comment.appName
      }).cache(60 * 1000);

      return {
        categoryName: app.categoryName,
        appName: app.appName,
        userName: comment.userName,
        comment: comment.comment
      };
    },
    { concurrency: 100 }
  );

  rows = rows.map((item, i) => {
    item.stt = i + 1;

    return item;
  });

  const csvWriter = createCsvWriter({
    path: "./remaining-apps-without-lable(mobile_purpose).csv",
    header
  });
  csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function getPredictionReport() {
  try {
    const header = [
      {
        id: "stt",
        title: "#"
      },
      // {
      //   id: "categoryName",
      //   title: "Category Name"
      // },
      // {
      //   id: "appName",
      //   title: "App Name"
      // },
      {
        id: "comment",
        title: "Comment"
      },
      {
        id: "sp",
        title: "S&P"
      },
      {
        id: "permission",
        title: "Permission"
      },
      {
        id: "dataCollection",
        title: "Data collection"
      },
      {
        id: "dataSharing",
        title: "Data sharing"
      }
    ];

    const comments = await Models.Comment.find({
      scores: { $exists: true }
    });

    let rows = await Promise.map(
      comments,
      async function(comment, index) {
        // const app = await Models.App.findOne({
        //   _id: comment.appId
        // }).cache(60 * 1000);

        return {
          comment: comment.comment,
          sp: comment.scores.SPLabel,
          permission: comment.scores.permissionLabel,
          dataCollection: comment.scores.dataCollectionLabel,
          dataSharing: comment.scores.dataSharingLabel
        };
      },
      { concurrency: 100 }
    );

    rows = rows.map((item, i) => {
      item.stt = i + 1;

      return item;
    });

    const csvWriter = createCsvWriter({
      path: "./comments-prediction.csv",
      header
    });
    csvWriter.writeRecords(rows);

    console.log("DONE");
  } catch (error) {
    console.log(error);
  }
}

async function getRemainingApps() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "appName",
      title: "App Name"
    },
    {
      id: "categoryName",
      title: "Category Name"
    },
    {
      id: "dataset",
      title: "Dataset"
    },
    {
      id: "totalComment",
      title: "Total Comment"
    },
    {
      id: "totalRelatedComment",
      title: "Comments Including Keyword"
    },
    {
      id: "totalPredictComment",
      title: "Bert prediction"
    }
  ];

  const categoryLimit = {
    Shopping: 217,
    "Maps & Navigation": 164,
    Finance: 293,
    Social: 164,
    Entertainment: 229,
    "Music & Audio": 171,
    Tools: 226,
    Beauty: 154,
    "Health & Fitness": 165,
    "Travel & Local": 194,
    Education: 266,
    "Food & Drink": 214,
    Business: 230,
    Sports: 166,
    Medical: 176
  };

  const getCategory = categoryName => {
    const category = Object.entries(categoryGroups).find(item => {
      const subCategories = item[1];

      if (subCategories.includes(categoryName)) return true;
      return false;
    })[0];

    return category;
  };

  const [dataCSV, newdataCSV] = await Promise.all([
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Documents/app-comment(rais3).csv"),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Documents/app-comment(rais3_v2).csv")
  ]);

  const oldDataSet = dataCSV.map(item => {
    return {
      appName: item[1],
      categoryName: getCategory(item[2]),
      totalComment: item[3],
      commentWithKeyword: item[4],
      commentWithBert: item[5]
    };
  });
  const newDataSet = newdataCSV.map(item => {
    return {
      appName: item[1],
      categoryName: getCategory(item[2]),
      totalComment: item[3],
      commentWithKeyword: item[4],
      commentWithBert: item[5]
    };
  });

  const oldDataSetGroupByCat = _.groupBy(oldDataSet, "categoryName");

  let stt = 1;
  const rows = [];
  await Promise.map(Object.keys(categoryLimit), async category => {
    const apps = oldDataSet.filter(app => app.categoryName === category);

    const numberOfCommentNeedAdd = categoryLimit[category] - apps.length;

    let newAppsByCategory = newDataSet.filter(
      app => app.categoryName === category && !_.includes(_.map(apps, "appName"), app.appName)
    );
    newAppsByCategory = newAppsByCategory.splice(0, numberOfCommentNeedAdd);

    apps.forEach(item => {
      rows.push({
        stt: stt++,
        appName: item.appName,
        categoryName: item.categoryName,
        dataset: "old",
        totalComment: item.totalComment,
        totalRelatedComment: item.commentWithKeyword,
        totalPredictComment: item.commentWithBert
      });
    });
    newAppsByCategory.forEach(item => {
      rows.push({
        stt: stt++,
        appName: item.appName,
        categoryName: item.categoryName,
        dataset: "new",
        totalComment: item.totalComment,
        totalRelatedComment: item.commentWithKeyword,
        totalPredictComment: item.commentWithBert
      });
    });

    // await bluebird.map(
    //   newAppsByCategory,
    //   app =>
    //     Models.App.updateOne(
    //       {
    //         appName: app.appName
    //       },
    //       {
    //         needRunBert: true
    //       }
    //     ),
    //   { concurrency: 100 }
    // );
  });

  const csvWriter = createCsvWriter({
    path: "./app-comment(with target).csv",
    header
  });
  csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function test() {
  let [k1, k2, k3, k4, k5] = await Promise.all([
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Documents/K1.csv"),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Documents/K2.csv"),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Documents/K3.csv"),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Documents/K4.csv"),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Documents/K5.csv")
  ]);

  const formatCSV = rows => {
    return rows.map(row => ({
      stt: row[0],
      cites: row[1],
      authors: row[2],
      title: row[3],
      year: row[4],
      source: row[5],
      publisher: row[6],
      articleURL: row[7],
      citesURL: row[8],
      gsRank: row[9],
      queryDate: row[10],
      type: row[11]
    }));
  };

  k1 = formatCSV(k1).map(item => {
    item.fileName = "k1";
    return item;
  });
  k2 = formatCSV(k2).map(item => {
    item.fileName = "k2";
    return item;
  });
  k3 = formatCSV(k3).map(item => {
    item.fileName = "k3";
    return item;
  });
  k4 = formatCSV(k4).map(item => {
    item.fileName = "k4";
    return item;
  });
  k5 = formatCSV(k5).map(item => {
    item.fileName = "k5";
    return item;
  });

  const uniqArticles = _.uniqBy([...k1, ...k2, ...k3, ...k4, ...k5], function(elem) {
    return [elem.authors, elem.title].join();
  });

  let content = "";
  uniqArticles.forEach(item => {
    content += `${item.fileName}_${item.stt}\n`;
  });

  let content1 = {};
  uniqArticles.forEach(item => {
    content1[[item.authors, item.title].join()] = `${item.fileName}_${item.stt}`;
  });

  fs.writeFileSync("./articles_ids.txt", content);
  fs.writeFileSync("./articles_ids.json", JSON.stringify(content1, null, 2));
}

async function generateTrainningAndTesting() {
  const [
    dataCollectionCSV,
    dataSharingCSV,
    permissionCSV,
    SPCommentCSV,
    SPTraningCSV
  ] = await Promise.all([
    csv({
      noheader: false,
      output: "csv"
    }).fromFile(
      "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/DATA_COLLECTION_TRAINING.csv"
    ),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile(
      "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/DATA_SHARING_TRAINING.csv"
    ),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile(
      "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/PERMISSION_TRAINING.csv"
    ),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile(
      "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/S&P_Comment_TrainingDataset(Y-N).csv"
    ),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile(
      "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/S&P_TRAINING.csv"
    )
  ]);

  const getTrainningAndTestingPercent = data => {
    const numberOfTrainning = Math.floor(data.length * 0.7);

    const trainning = data.slice(0, numberOfTrainning);
    const testing = data.slice(numberOfTrainning, data.length);
    return {
      trainning,
      testing
    };
  };

  const dataCollectionDataSet = getTrainningAndTestingPercent(dataCollectionCSV);
  const dataSharingDataSet = getTrainningAndTestingPercent(dataSharingCSV);
  const permissionDataSet = getTrainningAndTestingPercent(permissionCSV);
  const SPCommentDataSet = getTrainningAndTestingPercent(SPCommentCSV);
  const SPTraningDataSet = getTrainningAndTestingPercent(SPTraningCSV);

  const header = [
    {
      id: "id",
      title: "id"
    },
    {
      id: "comment_text",
      title: "comment_text"
    },
    {
      id: "SPCommentLabel",
      title: "SPCommentLabel"
    },
    {
      id: "SPTrainingLabel",
      title: "SPTrainingLabel"
    },
    {
      id: "permissionLabel",
      title: "permissionLabel"
    },
    {
      id: "dataCollectionLabel",
      title: "dataCollectionLabel"
    },
    {
      id: "dataSharingLabel",
      title: "dataSharingLabel"
    },
    {
      id: "temp1",
      title: "temp1"
    }
  ];

  let training = [];

  dataCollectionDataSet.trainning.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = training.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      training[rowIndex].dataCollectionLabel = label === "Y" ? 1 : 0;
    } else {
      training.push({
        comment: comment.trim(),
        SPCommentLabel: 0,
        SPTrainingLabel: 0,
        permissionLabel: 0,
        dataCollectionLabel: label === "Y" ? 1 : 0,
        dataSharingLabel: 0
      });
    }
  });

  dataSharingDataSet.trainning.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = training.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      training[rowIndex].dataSharingLabel = label === "Y" ? 1 : 0;
    } else {
      training.push({
        comment: comment.trim(),
        SPCommentLabel: 0,
        SPTrainingLabel: 0,
        permissionLabel: 0,
        dataCollectionLabel: 0,
        dataSharingLabel: label === "Y" ? 1 : 0
      });
    }
  });

  permissionDataSet.trainning.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = training.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      training[rowIndex].permissionLabel = label === "Y" ? 1 : 0;
    } else {
      training.push({
        comment: comment.trim(),
        SPCommentLabel: 0,
        SPTrainingLabel: 0,
        permissionLabel: label === "Y" ? 1 : 0,
        dataCollectionLabel: 0,
        dataSharingLabel: 0
      });
    }
  });

  SPCommentDataSet.trainning.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = training.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      training[rowIndex].SPCommentLabel = label === "Y" ? 1 : 0;
    } else {
      training.push({
        comment: comment.trim(),
        SPCommentLabel: label === "Y" ? 1 : 0,
        SPTrainingLabel: 0,
        permissionLabel: 0,
        dataCollectionLabel: 0,
        dataSharingLabel: 0
      });
    }
  });

  SPTraningDataSet.trainning.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = training.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      training[rowIndex].SPTrainingLabel = label === "Y" ? 1 : 0;
    } else {
      training.push({
        comment: comment.trim(),
        SPCommentLabel: 0,
        SPTrainingLabel: label === "Y" ? 1 : 0,
        permissionLabel: 0,
        dataCollectionLabel: 0,
        dataSharingLabel: 0
      });
    }
  });

  training = training.map((item, index) => {
    return {
      ...item,
      id: index + 1,
      comment_text: item.comment,
      temp1: 0
    };
  });

  const csvWriter = createCsvWriter({
    path: "./training.csv",
    header
  });
  csvWriter.writeRecords(training);

  //  ======== Testing

  const calculateAccuracy = async (data, fieldName) => {
    const header = [
      {
        id: "name",
        title: ""
      },
      {
        id: "begin",
        title: ""
      }
    ];

    const header2 = [
      {
        id: "stt",
        title: "STT"
      },
      {
        id: "comment",
        title: "Comment"
      },
      {
        id: "label",
        title: "Label"
      },
      {
        id: "bertPrediction",
        title: "Bert prediction"
      }
    ];

    const testing = await Promise.map(
      data,
      async (item, index) => {
        const [, comment, label] = item;

        const prediction = await Services.PredictionLabel.getPredictLabel([
          { id: 1, text: comment }
        ]);
        const predictionLabel = prediction[0].scores[fieldName] >= 0.5 ? "Y" : "N";

        console.log(index, predictionLabel);
        return {
          comment,
          label,
          prediction: prediction[0].scores[fieldName],
          predictionLabel
        };
      },
      { concurrency: 10 }
    );

    let X = 0,
      Y = 0,
      Z = 0,
      W = 0;

    testing.forEach(item => {
      const { predictionLabel, label } = item;
      if (predictionLabel === "N" && label === "N") X++;
      else if (predictionLabel === "Y" && label === "N") Y++;
      else if (predictionLabel === "N" && label === "Y") Z++;
      else if (predictionLabel === "Y" && label === "Y") W++;
    });

    const Precision = X / (X + Z);
    const Recall = X / (X + Y);
    const F1 = (2 * (Precision * Recall)) / (Precision + Recall);
    const Accuracy = (X + W) / (X + Y + Z + W);

    const rows = [
      {
        name: "Percision",
        begin: Precision
      },
      {
        name: "Recall",
        begin: Recall
      },
      {
        name: "F1",
        begin: F1
      },
      {
        name: "Accuracy",
        begin: Accuracy
      }
    ];

    const rows2 = testing.map((item, stt) => {
      return {
        stt: stt + 1,
        comment: item.comment,
        label: item.label,
        bertPrediction: item.predictionLabel
      };
    });
    const csvWriter = createCsvWriter({
      path: `./${fieldName}.csv`,
      header
    });
    const csvWriter2 = createCsvWriter({
      path: `./${fieldName}-prediction.csv`,
      header: header2
    });
    await csvWriter.writeRecords(rows);
    await csvWriter2.writeRecords(rows2);
  };

  const confusion = async (data, fieldName) => {
    const header = [
      {
        id: "name",
        title: ""
      },
      {
        id: "predictY",
        title: "Predicted value: YES"
      },
      {
        id: "predictN",
        title: "Predicted value: NO"
      }
    ];

    const testing = await Promise.map(
      data,
      async (item, index) => {
        const [, comment, label] = item;

        const prediction = await Services.PredictionLabel.getPredictLabel([
          { id: 1, text: comment }
        ]);
        const predictionLabel = prediction[0].scores[fieldName] >= 0.5 ? "Y" : "N";

        console.log(index, predictionLabel);
        return {
          comment,
          label,
          prediction: prediction[0].scores[fieldName],
          predictionLabel
        };
      },
      { concurrency: 5 }
    );

    let X = 0,
      Y = 0,
      Z = 0,
      W = 0;

    testing.forEach(item => {
      const { predictionLabel, label } = item;
      if (predictionLabel === "N" && label === "N") X++;
      else if (predictionLabel === "Y" && label === "N") Y++;
      else if (predictionLabel === "N" && label === "Y") Z++;
      else if (predictionLabel === "Y" && label === "Y") W++;
    });

    const rows = [
      {
        name: "Actual value: Yes",
        predictY: W,
        predictN: Z
      },
      {
        name: "Actual value: No",
        predictY: Y,
        predictN: X
      }
    ];

    const csvWriter = createCsvWriter({
      path: `./${fieldName}-confusion.csv`,
      header
    });
    await csvWriter.writeRecords(rows);
  };

  await Promise.all([
    // confusion(SPCommentDataSet.testing, "SPCommentLabel"),
    // confusion(SPTraningDataSet.testing, "SPTrainingLabel"),
    calculateAccuracy(SPTraningDataSet.testing, "SPTrainingLabel"),
    calculateAccuracy(SPCommentDataSet.testing, "SPCommentLabel")
  ]);
  // await calculateAccuracy(SPTraningDataSet.testing, "SPTrainingLabel");
  // await calculateAccuracy(SPCommentDataSet.testing, "SPCommentLabel");
  // await calculateAccuracy(permissionDataSet.testing, "permissionLabel");
  // await calculateAccuracy(dataSharingDataSet.testing, "dataSharingLabel");
  // await calculateAccuracy(dataCollectionDataSet.testing, "dataCollectionLabel");

  console.log("done");
}

async function generateTrainningAndTestingV2() {
  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/Comment_dataset_multi_label.csv");

  const getTrainningAndTestingPercent = data => {
    const numberOfTrainning = Math.floor(data.length * 0.7);

    const trainning = data.slice(0, numberOfTrainning);
    const testing = data.slice(numberOfTrainning, data.length);
    return {
      trainning,
      testing
    };
  };

  dataCSV = dataCSV.slice(0, 10);
  const dataSet = getTrainningAndTestingPercent(dataCSV);

  // const header = [
  //   {
  //     id: "id",
  //     title: "id"
  //   },
  //   {
  //     id: "comment_text",
  //     title: "comment_text"
  //   },
  //   {
  //     id: "SPCommentLabel",
  //     title: "SPCommentLabel"
  //   },
  //   {
  //     id: "SPTrainingLabel",
  //     title: "SPTrainingLabel"
  //   },
  //   {
  //     id: "permissionLabel",
  //     title: "permissionLabel"
  //   },
  //   {
  //     id: "dataCollectionLabel",
  //     title: "dataCollectionLabel"
  //   },
  //   {
  //     id: "dataSharingLabel",
  //     title: "dataSharingLabel"
  //   },
  //   {
  //     id: "temp1",
  //     title: "temp1"
  //   }
  // ];

  // let training = [];

  // dataSet.trainning.forEach(item => {
  //   const [
  //     ,
  //     comment,
  //     SPCommentLabel,
  //     permissionLabel,
  //     dataCollectionLabel,
  //     dataSharingLabel
  //   ] = item;

  //   const rowIndex = training.findIndex(item => item.comment === comment.trim());

  //   training.push({
  //     comment: comment.trim(),
  //     SPCommentLabel: SPCommentLabel === "x" ? 1 : 0,
  //     SPTrainingLabel: 0,
  //     permissionLabel: permissionLabel === "x" ? 1 : 0,
  //     dataCollectionLabel: dataCollectionLabel === "x" ? 1 : 0,
  //     dataSharingLabel: dataSharingLabel === "x" ? 1 : 0
  //   });
  // });

  // training = training.map((item, index) => {
  //   return {
  //     ...item,
  //     id: index + 1,
  //     comment_text: item.comment,
  //     temp1: 0
  //   };
  // });

  // const csvWriter = createCsvWriter({
  //   path: "./training.csv",
  //   header
  // });
  // csvWriter.writeRecords(training);

  //  ======== Testing
  const calculateAccuracy = async data => {
    const header = [
      {
        id: "name",
        title: ""
      },
      {
        id: "begin",
        title: ""
      }
    ];

    const header2 = [
      {
        id: "stt",
        title: "STT"
      },
      {
        id: "comment",
        title: "Comment"
      },
      {
        id: "SPCommentLabel",
        title: "S&P assessment"
      },
      {
        id: "SPCommentLabelPrediction",
        title: "S&P assessment prediction"
      },
      {
        id: "permissionLabel",
        title: "Permission"
      },
      {
        id: "permissionLabelPrediction",
        title: "Permission rediction"
      },
      {
        id: "dataCollectionLabel",
        title: "Data collection"
      },
      {
        id: "dataCollectionLabelPrediction",
        title: "Data collection prediction"
      },
      {
        id: "dataSharingLabel",
        title: "Data sharing"
      },
      {
        id: "dataSharingLabelPrediction",
        title: "Data sharing prediction"
      }
    ];

    const testing = await Promise.map(
      data,
      async (item, index) => {
        const [
          ,
          comment,
          SPCommentLabel,
          permissionLabel,
          dataCollectionLabel,
          dataSharingLabel
        ] = item;

        const prediction = await Services.PredictionLabel.getPredictLabel([
          { id: 1, text: comment }
        ]);

        console.log(prediction);
        const SPCommentLabelPrediction = prediction[0].scores.SPCommentLabel >= 0.5 ? "x" : "";
        const permissionLabelPrediction = prediction[0].scores.permissionLabel >= 0.5 ? "x" : "";
        const dataCollectionLabelPrediction =
          prediction[0].scores.dataCollectionLabel >= 0.5 ? "x" : "";
        const dataSharingLabelPrediction = prediction[0].scores.dataSharingLabel >= 0.5 ? "x" : "";

        return {
          comment,
          SPCommentLabel,
          permissionLabel,
          dataCollectionLabel,
          dataSharingLabel,

          SPCommentLabelPrediction,
          permissionLabelPrediction,
          dataCollectionLabelPrediction,
          dataSharingLabelPrediction
        };
      },
      { concurrency: 10 }
    );

    let XSPComment = 0,
      YSPComment = 0,
      ZSPComment = 0,
      WSPComment = 0;

    let Xpermission = 0,
      Ypermission = 0,
      Zpermission = 0,
      Wpermission = 0;

    let XdataCollection = 0,
      YdataCollection = 0,
      ZdataCollection = 0,
      WdataCollection = 0;

    let XdataSharing = 0,
      YdataSharing = 0,
      ZdataSharing = 0,
      WdataSharing = 0;

    testing.forEach(item => {
      const {
        SPCommentLabel,
        permissionLabel,
        dataCollectionLabel,
        dataSharingLabel,

        SPCommentLabelPrediction,
        permissionLabelPrediction,
        dataCollectionLabelPrediction,
        dataSharingLabelPrediction
      } = item;
      if (SPCommentLabelPrediction === "" && SPCommentLabel === "") XSPComment++;
      else if (SPCommentLabelPrediction === "x" && SPCommentLabel === "") YSPComment++;
      else if (SPCommentLabelPrediction === "" && SPCommentLabel === "x") ZSPComment++;
      else if (SPCommentLabelPrediction === "x" && SPCommentLabel === "x") WSPComment++;

      if (permissionLabelPrediction === "" && permissionLabel === "") Xpermission++;
      else if (permissionLabelPrediction === "x" && permissionLabel === "") Ypermission++;
      else if (permissionLabelPrediction === "" && permissionLabel === "x") Zpermission++;
      else if (permissionLabelPrediction === "x" && permissionLabel === "x") Wpermission++;

      if (dataCollectionLabelPrediction === "" && dataCollectionLabel === "") XdataCollection++;
      else if (dataCollectionLabelPrediction === "x" && dataCollectionLabel === "")
        YdataCollection++;
      else if (dataCollectionLabelPrediction === "" && dataCollectionLabel === "x")
        ZdataCollection++;
      else if (dataCollectionLabelPrediction === "x" && dataCollectionLabel === "x")
        WdataCollection++;

      if (dataSharingLabelPrediction === "" && dataSharingLabel === "") XdataSharing++;
      else if (dataSharingLabelPrediction === "x" && dataSharingLabel === "") YdataSharing++;
      else if (dataSharingLabelPrediction === "" && dataSharingLabel === "x") ZdataSharing++;
      else if (dataSharingLabelPrediction === "x" && dataSharingLabel === "x") WdataSharing++;
    });

    const PrecisionSPComment = XSPComment / (XSPComment + ZSPComment);
    const RecallSPComment = XSPComment / (XSPComment + YSPComment);
    const F1SPComment =
      (2 * (PrecisionSPComment * RecallSPComment)) / (PrecisionSPComment + RecallSPComment);
    const AccuracySPComment =
      (XSPComment + WSPComment) / (XSPComment + YSPComment + ZSPComment + WSPComment);

    const Precisionpermission = Xpermission / (Xpermission + Zpermission);
    const Recallpermission = Xpermission / (Xpermission + Ypermission);
    const F1permission =
      (2 * (Precisionpermission * Recallpermission)) / (Precisionpermission + Recallpermission);
    const Accuracypermission =
      (Xpermission + Wpermission) / (Xpermission + Ypermission + Zpermission + Wpermission);

    const PrecisiondataCollection = XdataCollection / (XdataCollection + ZdataCollection);
    const RecalldataCollection = XdataCollection / (XdataCollection + YdataCollection);
    const F1dataCollection =
      (2 * (PrecisiondataCollection * RecalldataCollection)) /
      (PrecisiondataCollection + RecalldataCollection);
    const AccuracydataCollection =
      (XdataCollection + WdataCollection) /
      (XdataCollection + YdataCollection + ZdataCollection + WdataCollection);

    const PrecisiondataSharing = XdataSharing / (XdataSharing + ZdataSharing);
    const RecalldataSharing = XdataSharing / (XdataSharing + YdataSharing);
    const F1dataSharing =
      (2 * (PrecisiondataSharing * RecalldataSharing)) / (PrecisiondataSharing + RecalldataSharing);
    const AccuracydataSharing =
      (XdataSharing + WdataSharing) / (XdataSharing + YdataSharing + ZdataSharing + WdataSharing);

    const rows = [
      {
        name: "Percision",
        begin: Precision
      },
      {
        name: "Recall",
        begin: Recall
      },
      {
        name: "F1",
        begin: F1
      },
      {
        name: "Accuracy",
        begin: Accuracy
      }
    ];

    const rows2 = testing.map((item, stt) => {
      return {
        stt: stt + 1,
        ...item
      };
    });

    const csvWriter = createCsvWriter({
      path: `./google-bert-accuracy.csv`,
      header
    });
    const csvWriter2 = createCsvWriter({
      path: `./google-bert-prediction.csv`,
      header: header2
    });
    await csvWriter.writeRecords(rows);
    await csvWriter2.writeRecords(rows2);
  };

  const confusion = async (data, fieldName) => {
    const header = [
      {
        id: "name",
        title: ""
      },
      {
        id: "predictY",
        title: "Predicted value: YES"
      },
      {
        id: "predictN",
        title: "Predicted value: NO"
      }
    ];

    const testing = await Promise.map(
      data,
      async (item, index) => {
        const [, comment, label] = item;

        const prediction = await Services.PredictionLabel.getPredictLabel([
          { id: 1, text: comment }
        ]);
        const predictionLabel = prediction[0].scores[fieldName] >= 0.5 ? "Y" : "N";

        console.log(index, predictionLabel);
        return {
          comment,
          label,
          prediction: prediction[0].scores[fieldName],
          predictionLabel
        };
      },
      { concurrency: 5 }
    );

    let X = 0,
      Y = 0,
      Z = 0,
      W = 0;

    testing.forEach(item => {
      const { predictionLabel, label } = item;
      if (predictionLabel === "N" && label === "N") X++;
      else if (predictionLabel === "Y" && label === "N") Y++;
      else if (predictionLabel === "N" && label === "Y") Z++;
      else if (predictionLabel === "Y" && label === "Y") W++;
    });

    const rows = [
      {
        name: "Actual value: Yes",
        predictY: W,
        predictN: Z
      },
      {
        name: "Actual value: No",
        predictY: Y,
        predictN: X
      }
    ];

    const csvWriter = createCsvWriter({
      path: `./${fieldName}-confusion.csv`,
      header
    });
    await csvWriter.writeRecords(rows);
  };

  await calculateAccuracy(dataSet.testing, "google-bert");
  console.log("done");
}

async function trainningAndTestingLNAndBaye() {
  console.log("Running trainningAndTesting");
  const percentage = 70;
  const result = {
    bayes: {
      SPComment: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      },
      permission: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      },
      dataCollection: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      },
      dataSharing: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      }
    },
    logistic: {
      SPComment: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      },
      permission: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      },
      dataCollection: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      },
      dataSharing: {
        TP: 0,
        TN: 0,
        FP: 0,
        FN: 0
      }
    }
  };
  const headerAccuracy = [
    {
      id: "name",
      title: ""
    },
    {
      id: "beginSPComment",
      title: "Bayesian S&P assessment"
    },
    {
      id: "beginpermission",
      title: "Bayesian permission"
    },
    {
      id: "begindataCollection",
      title: "Bayesian data collection"
    },
    {
      id: "begindataSharing",
      title: "Bayesian data sharing"
    },
    {
      id: "maliciousSPComment",
      title: "Logistic Regression S&P assessment"
    },
    {
      id: "maliciouspermission",
      title: "Logistic Regression permission"
    },
    {
      id: "maliciousdataCollection",
      title: "Logistic Regression data collection"
    },
    {
      id: "maliciousdataSharing",
      title: "Logistic Regression data sharing"
    }
  ];

  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/Comment_dataset_multi_label.csv");

  const getTrainningAndTestingPercent = data => {
    const numberOfTrainning = Math.floor(data.length * 0.7);

    const trainning = data.slice(0, numberOfTrainning);
    const testing = data.slice(numberOfTrainning, data.length);
    return {
      trainning,
      testing
    };
  };

  const dataSet = getTrainningAndTestingPercent(dataCSV);

  const getTrainning = (dataset, valueIndex) => {
    return dataset.map(item => ({
      comment: item[1],
      label: item[valueIndex] === "x" ? "Y" : "N"
    }));
  };

  let bayesClassifierSPComment = new natural.BayesClassifier(PorterStemmer);
  let logisticRegressionClassifierSPComment = new natural.LogisticRegressionClassifier(
    PorterStemmer
  );

  let bayesClassifierpermission = new natural.BayesClassifier(PorterStemmer);
  let logisticRegressionClassifierpermission = new natural.LogisticRegressionClassifier(
    PorterStemmer
  );

  let bayesClassifierdataCollection = new natural.BayesClassifier(PorterStemmer);
  let logisticRegressionClassifierdataCollection = new natural.LogisticRegressionClassifier(
    PorterStemmer
  );

  let bayesClassifierdataSharing = new natural.BayesClassifier(PorterStemmer);
  let logisticRegressionClassifierdataSharing = new natural.LogisticRegressionClassifier(
    PorterStemmer
  );

  const SPCommentTrainingSet = getTrainning(dataSet.trainning, 2);
  const permissionTrainingSet = getTrainning(dataSet.trainning, 3);
  const dataCollectionTrainingSet = getTrainning(dataSet.trainning, 4);
  const dataSharingTrainingSet = getTrainning(dataSet.trainning, 5);

  SPCommentTrainingSet.forEach(item => {
    bayesClassifierSPComment.addDocument(item.comment, item.label);
    logisticRegressionClassifierSPComment.addDocument(item.comment, item.label);
  });

  permissionTrainingSet.forEach(item => {
    bayesClassifierpermission.addDocument(item.comment, item.label);
    logisticRegressionClassifierpermission.addDocument(item.comment, item.label);
  });

  dataCollectionTrainingSet.forEach(item => {
    bayesClassifierdataCollection.addDocument(item.comment, item.label);
    logisticRegressionClassifierdataCollection.addDocument(item.comment, item.label);
  });

  dataSharingTrainingSet.forEach(item => {
    bayesClassifierdataSharing.addDocument(item.comment, item.label);
    logisticRegressionClassifierdataSharing.addDocument(item.comment, item.label);
  });

  bayesClassifierSPComment.train();
  logisticRegressionClassifierSPComment.train();

  bayesClassifierpermission.train();
  logisticRegressionClassifierpermission.train();

  bayesClassifierdataCollection.train();
  logisticRegressionClassifierdataCollection.train();

  bayesClassifierdataSharing.train();
  logisticRegressionClassifierdataSharing.train();

  const testing = dataSet.testing;
  let rowsCSV = [];
  testing.forEach(item => {
    const [
      ,
      comment,
      SPCommentLabel,
      permissionLabel,
      dataCollectionLabel,
      dataSharingLabel
    ] = item;

    const actualClassBayesSPComment = bayesClassifierSPComment.classify(comment);
    const actualClassBayespermission = bayesClassifierpermission.classify(comment);
    const actualClassBayesdataCollection = bayesClassifierdataCollection.classify(comment);
    const actualClassBayesdataSharing = bayesClassifierdataSharing.classify(comment);

    if (SPCommentLabel === "x" && actualClassBayesSPComment == "Y") result.bayes.SPComment.TP++;
    else if (SPCommentLabel === "" && actualClassBayesSPComment == "N") result.bayes.SPComment.TN++;
    else if (SPCommentLabel === "x" && actualClassBayesSPComment == "N")
      result.bayes.SPComment.FP++;
    else if (SPCommentLabel === "" && actualClassBayesSPComment == "Y") result.bayes.SPComment.FN++;

    if (permissionLabel === "x" && actualClassBayespermission == "Y") result.bayes.permission.TP++;
    else if (permissionLabel === "" && actualClassBayespermission == "N")
      result.bayes.permission.TN++;
    else if (permissionLabel === "x" && actualClassBayespermission == "N")
      result.bayes.permission.FP++;
    else if (permissionLabel === "" && actualClassBayespermission == "Y")
      result.bayes.permission.FN++;

    if (dataCollectionLabel === "x" && actualClassBayesdataCollection == "Y")
      result.bayes.dataCollection.TP++;
    else if (dataCollectionLabel === "" && actualClassBayesdataCollection == "N")
      result.bayes.dataCollection.TN++;
    else if (dataCollectionLabel === "x" && actualClassBayesdataCollection == "N")
      result.bayes.dataCollection.FP++;
    else if (dataCollectionLabel === "" && actualClassBayesdataCollection == "Y")
      result.bayes.dataCollection.FN++;

    if (dataSharingLabel === "x" && actualClassBayesdataSharing == "Y")
      result.bayes.dataSharing.TP++;
    else if (dataSharingLabel === "" && actualClassBayesdataSharing == "N")
      result.bayes.dataSharing.TN++;
    else if (dataSharingLabel === "x" && actualClassBayesdataSharing == "N")
      result.bayes.dataSharing.FP++;
    else if (dataSharingLabel === "" && actualClassBayesdataSharing == "Y")
      result.bayes.dataSharing.FN++;

    const actualClassLogisticSPComment = logisticRegressionClassifierSPComment.classify(comment);
    const actualClassLogisticpermission = logisticRegressionClassifierpermission.classify(comment);
    const actualClassLogisticdataCollection = logisticRegressionClassifierdataCollection.classify(
      comment
    );
    const actualClassLogisticdataSharing = logisticRegressionClassifierdataSharing.classify(
      comment
    );

    if (SPCommentLabel === "x" && actualClassLogisticSPComment == "Y")
      result.logistic.SPComment.TP++;
    else if (SPCommentLabel === "" && actualClassLogisticSPComment == "N")
      result.logistic.SPComment.TN++;
    else if (SPCommentLabel === "x" && actualClassLogisticSPComment == "N")
      result.logistic.SPComment.FP++;
    else if (SPCommentLabel === "" && actualClassLogisticSPComment == "Y")
      result.logistic.SPComment.FN++;

    if (permissionLabel === "x" && actualClassLogisticpermission == "Y")
      result.logistic.permission.TP++;
    else if (permissionLabel === "" && actualClassLogisticpermission == "N")
      result.logistic.permission.TN++;
    else if (permissionLabel === "x" && actualClassLogisticpermission == "N")
      result.logistic.permission.FP++;
    else if (permissionLabel === "" && actualClassLogisticpermission == "Y")
      result.logistic.permission.FN++;

    if (dataCollectionLabel === "x" && actualClassLogisticdataCollection == "Y")
      result.logistic.dataCollection.TP++;
    else if (dataCollectionLabel === "" && actualClassLogisticdataCollection == "N")
      result.logistic.dataCollection.TN++;
    else if (dataCollectionLabel === "x" && actualClassLogisticdataCollection == "N")
      result.logistic.dataCollection.FP++;
    else if (dataCollectionLabel === "" && actualClassLogisticdataCollection == "Y")
      result.logistic.dataCollection.FN++;

    if (dataSharingLabel === "x" && actualClassLogisticdataSharing == "Y")
      result.logistic.dataSharing.TP++;
    else if (dataSharingLabel === "" && actualClassLogisticdataSharing == "N")
      result.logistic.dataSharing.TN++;
    else if (dataSharingLabel === "x" && actualClassLogisticdataSharing == "N")
      result.logistic.dataSharing.FP++;
    else if (dataSharingLabel === "" && actualClassLogisticdataSharing == "Y")
      result.logistic.dataSharing.FN++;

    rowsCSV.push({
      comment,
      SPCommentLabel,
      permissionLabel,
      dataCollectionLabel,
      dataSharingLabel,

      bayesianSPComment: actualClassBayesSPComment,
      logisticSPComment: actualClassLogisticSPComment,

      bayesianpermission: actualClassBayespermission,
      logisticpermission: actualClassLogisticpermission,

      bayesiandataCollection: actualClassBayesdataCollection,
      logisticdataCollection: actualClassLogisticdataCollection,

      bayesiandataSharing: actualClassBayesdataSharing,
      logisticdataSharing: actualClassLogisticdataSharing
    });
  });

  console.log(result);
  // accuracy
  const PrecisionBenignSPComment =
    result.bayes.SPComment.TP / (result.bayes.SPComment.TP + result.bayes.SPComment.FP);
  const PrecisionBenignpermission =
    result.bayes.permission.TP / (result.bayes.permission.TP + result.bayes.permission.FP);
  const PrecisionBenigndataCollection =
    result.bayes.dataCollection.TP /
    (result.bayes.dataCollection.TP + result.bayes.dataCollection.FP);
  const PrecisionBenigndataSharing =
    result.bayes.dataSharing.TP / (result.bayes.dataSharing.TP + result.bayes.dataSharing.FP);

  const PrecisionMaliciousSPComment =
    result.logistic.SPComment.TP / (result.logistic.SPComment.TP + result.logistic.SPComment.FP);
  const PrecisionMaliciouspermission =
    result.logistic.permission.TP / (result.logistic.permission.TP + result.logistic.permission.FP);
  const PrecisionMaliciousdataCollection =
    result.logistic.dataCollection.TP /
    (result.logistic.dataCollection.TP + result.logistic.dataCollection.FP);
  const PrecisionMaliciousdataSharing =
    result.logistic.dataSharing.TP /
    (result.logistic.dataSharing.TP + result.logistic.dataSharing.FP);

  const RecallBenignSPComment =
    result.bayes.SPComment.TP / (result.bayes.SPComment.TP + result.bayes.SPComment.FN);
  const RecallBenignpermission =
    result.bayes.permission.TP / (result.bayes.permission.TP + result.bayes.permission.FN);
  const RecallBenigndataCollection =
    result.bayes.dataCollection.TP /
    (result.bayes.dataCollection.TP + result.bayes.dataCollection.FN);
  const RecallBenigndataSharing =
    result.bayes.dataSharing.TP / (result.bayes.dataSharing.TP + result.bayes.dataSharing.FN);

  const RecallMaliciousSPComment =
    result.logistic.SPComment.TP / (result.logistic.SPComment.TP + result.logistic.SPComment.FN);
  const RecallMaliciouspermission =
    result.logistic.permission.TP / (result.logistic.permission.TP + result.logistic.permission.FN);
  const RecallMaliciousdataCollection =
    result.logistic.dataCollection.TP /
    (result.logistic.dataCollection.TP + result.logistic.dataCollection.FN);
  const RecallMaliciousdataSharing =
    result.logistic.dataSharing.TP /
    (result.logistic.dataSharing.TP + result.logistic.dataSharing.FN);

  const F1BenignSPComment =
    (2 * (PrecisionBenignSPComment * RecallBenignSPComment)) /
    (PrecisionBenignSPComment + RecallBenignSPComment);
  const F1Benignpermission =
    (2 * (PrecisionBenignpermission * RecallBenignpermission)) /
    (PrecisionBenignpermission + RecallBenignpermission);
  const F1BenigndataCollection =
    (2 * (PrecisionBenigndataCollection * RecallBenigndataCollection)) /
    (PrecisionBenigndataCollection + RecallBenigndataCollection);
  const F1BenigndataSharing =
    (2 * (PrecisionBenigndataSharing * RecallBenigndataSharing)) /
    (PrecisionBenigndataSharing + RecallBenigndataSharing);

  const F1MaliciousSPComment =
    (2 * (PrecisionMaliciousSPComment * RecallMaliciousSPComment)) /
    (PrecisionMaliciousSPComment + RecallMaliciousSPComment);
  const F1Maliciouspermission =
    (2 * (PrecisionMaliciouspermission * RecallMaliciouspermission)) /
    (PrecisionMaliciouspermission + RecallMaliciouspermission);
  const F1MaliciousdataCollection =
    (2 * (PrecisionMaliciousdataCollection * RecallMaliciousdataCollection)) /
    (PrecisionMaliciousdataCollection + RecallMaliciousdataCollection);
  const F1MaliciousdataSharing =
    (2 * (PrecisionMaliciousdataSharing * RecallMaliciousdataSharing)) /
    (PrecisionMaliciousdataSharing + RecallMaliciousdataSharing);

  const AccuracySPComment =
    (result.bayes.SPComment.TP + result.bayes.SPComment.TN) /
    (result.bayes.SPComment.TP +
      result.bayes.SPComment.FP +
      result.bayes.SPComment.FN +
      result.bayes.SPComment.TN);
  const Accuracypermission =
    (result.bayes.permission.TP + result.bayes.permission.TN) /
    (result.bayes.permission.TP +
      result.bayes.permission.FP +
      result.bayes.permission.FN +
      result.bayes.permission.TN);
  const AccuracydataCollection =
    (result.bayes.dataCollection.TP + result.bayes.dataCollection.TN) /
    (result.bayes.dataCollection.TP +
      result.bayes.dataCollection.FP +
      result.bayes.dataCollection.FN +
      result.bayes.dataCollection.TN);
  const AccuracydataSharing =
    (result.bayes.dataSharing.TP + result.bayes.dataSharing.TN) /
    (result.bayes.dataSharing.TP +
      result.bayes.dataSharing.FP +
      result.bayes.dataSharing.FN +
      result.bayes.dataSharing.TN);

  const AccuracyMaliciousSPComment =
    (result.logistic.SPComment.TP + result.logistic.SPComment.TN) /
    (result.logistic.SPComment.TP +
      result.logistic.SPComment.FP +
      result.logistic.SPComment.FN +
      result.logistic.SPComment.TN);
  const AccuracyMaliciouspermission =
    (result.logistic.permission.TP + result.logistic.permission.TN) /
    (result.logistic.permission.TP +
      result.logistic.permission.FP +
      result.logistic.permission.FN +
      result.logistic.permission.TN);
  const AccuracyMaliciousdataCollection =
    (result.logistic.dataCollection.TP + result.logistic.dataCollection.TN) /
    (result.logistic.dataCollection.TP +
      result.logistic.dataCollection.FP +
      result.logistic.dataCollection.FN +
      result.logistic.dataCollection.TN);
  const AccuracyMaliciousdataSharing =
    (result.logistic.dataSharing.TP + result.logistic.dataSharing.TN) /
    (result.logistic.dataSharing.TP +
      result.logistic.dataSharing.FP +
      result.logistic.dataSharing.FN +
      result.logistic.dataSharing.TN);

  const rowsAccuracy = [
    {
      name: "TP",
      beginSPComment: result.bayes.SPComment.TP,
      beginpermission: result.bayes.permission.TP,
      begindataCollection: result.bayes.dataCollection.TP,
      begindataSharing: result.bayes.dataSharing.TP,

      maliciousSPComment: result.logistic.SPComment.TP,
      maliciouspermission: result.logistic.permission.TP,
      maliciousdataCollection: result.logistic.dataCollection.TP,
      maliciousdataSharing: result.logistic.dataSharing.TP
    },
    {
      name: "TN",

      beginSPComment: result.bayes.SPComment.TN,
      beginpermission: result.bayes.permission.TN,
      begindataCollection: result.bayes.dataCollection.TN,
      begindataSharing: result.bayes.dataSharing.TN,

      maliciousSPComment: result.logistic.SPComment.TN,
      maliciouspermission: result.logistic.permission.TN,
      maliciousdataCollection: result.logistic.dataCollection.TN,
      maliciousdataSharing: result.logistic.dataSharing.TN
    },
    {
      name: "FP",

      beginSPComment: result.bayes.SPComment.FP,
      beginpermission: result.bayes.permission.FP,
      begindataCollection: result.bayes.dataCollection.FP,
      begindataSharing: result.bayes.dataSharing.FP,

      maliciousSPComment: result.logistic.SPComment.FP,
      maliciouspermission: result.logistic.permission.FP,
      maliciousdataCollection: result.logistic.dataCollection.FP,
      maliciousdataSharing: result.logistic.dataSharing.FP
    },
    {
      name: "FN",

      beginSPComment: result.bayes.SPComment.FN,
      beginpermission: result.bayes.permission.FN,
      begindataCollection: result.bayes.dataCollection.FN,
      begindataSharing: result.bayes.dataSharing.FN,

      maliciousSPComment: result.logistic.SPComment.FN,
      maliciouspermission: result.logistic.permission.FN,
      maliciousdataCollection: result.logistic.dataCollection.FN,
      maliciousdataSharing: result.logistic.dataSharing.FN
    },
    {
      name: "Percision",

      beginSPComment: PrecisionBenignSPComment,
      beginpermission: PrecisionBenignpermission,
      begindataCollection: PrecisionBenigndataCollection,
      begindataSharing: PrecisionBenigndataSharing,

      maliciousSPComment: PrecisionMaliciousSPComment,
      maliciouspermission: PrecisionMaliciouspermission,
      maliciousdataCollection: PrecisionMaliciousdataCollection,
      maliciousdataSharing: PrecisionMaliciousdataSharing
    },
    {
      name: "Recall",
      beginSPComment: RecallBenignSPComment,
      beginpermission: RecallBenignpermission,
      begindataCollection: RecallBenigndataCollection,
      begindataSharing: RecallBenigndataSharing,

      maliciousSPComment: RecallMaliciousSPComment,
      maliciouspermission: RecallMaliciouspermission,
      maliciousdataCollection: RecallMaliciousdataCollection,
      maliciousdataSharing: RecallMaliciousdataSharing
    },
    {
      name: "F1",
      beginSPComment: F1BenignSPComment,
      beginpermission: F1Benignpermission,
      begindataCollection: F1BenigndataCollection,
      begindataSharing: F1BenigndataSharing,

      maliciousSPComment: F1MaliciousSPComment,
      maliciouspermission: F1Maliciouspermission,
      maliciousdataCollection: F1MaliciousdataCollection,
      maliciousdataSharing: F1MaliciousdataSharing
    },
    {
      name: "Accuracy",
      beginSPComment: AccuracySPComment,
      beginpermission: Accuracypermission,
      begindataCollection: AccuracydataCollection,
      begindataSharing: AccuracydataSharing,

      maliciousSPComment: AccuracyMaliciousSPComment,
      maliciouspermission: AccuracyMaliciouspermission,
      maliciousdataCollection: AccuracyMaliciousdataCollection,
      maliciousdataSharing: AccuracyMaliciousdataSharing
    }
  ];

  const csvWriterAccuracy = createCsvWriter({
    path: `./output/Bayesian-and-Logistic-Regression-Classifiers(${percentage}-${100 -
      percentage}).csv`,
    header: headerAccuracy
  });
  await csvWriterAccuracy.writeRecords(rowsAccuracy);

  rowsCSV = rowsCSV.map((item, index) => {
    item.stt = index + 1;
    return item;
  });

  const csvWriter = createCsvWriter({
    path: `./output/TRAINING-TEST(${percentage}-${100 - percentage}).csv`,
    header: [
      {
        id: "stt",
        title: "#"
      },

      {
        id: "comment",
        title: "Comment"
      },

      {
        id: "SPCommentLabel",
        title: "S&P assessment"
      },
      {
        id: "bayesianSPComment",
        title: "S&P assessment Bayesian"
      },
      {
        id: "logisticSPComment",
        title: "S&P assessment Logistic Regression"
      },

      //
      {
        id: "permissionLabel",
        title: "Permission"
      },
      {
        id: "bayesianpermission",
        title: "Permission Bayesian"
      },
      {
        id: "logisticpermission",
        title: "Permission Logistic Regression"
      },
      //
      {
        id: "dataCollectionLabel",
        title: "Data collection"
      },
      {
        id: "bayesiandataCollection",
        title: "Data collection Bayesian"
      },
      {
        id: "logisticdataCollection",
        title: "Data collection Logistic Regression"
      },

      //
      {
        id: "dataSharingLabel",
        title: "Data sharing"
      },
      {
        id: "bayesiandataSharing",
        title: "Data sharing Bayesian"
      },
      {
        id: "logisticdataSharing",
        title: "Data sharing Logistic Regression"
      }
    ]
  });
  await csvWriter.writeRecords(rowsCSV);

  console.log("DONE");
}

async function trainningAndTestingFromDatasetV2() {
  console.log("Running trainningAndTestingFromDatasetV2");

  // https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
  w2vModel = await new Promise((resolve, reject) => {
    w2v.loadModel(process.env.W2V_MODEL, function(error, model) {
      if (error) reject(error);

      resolve(model);
    });
  });
  const getMostSimilarWords = keyword => {
    let mostSimilarWords = [];
    if (w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword];
    else {
      mostSimilarWords = w2vModel.mostSimilar(keyword, 2) || [];
      w2vModelData[keyword] = mostSimilarWords;
    }

    mostSimilarWords = _.map(mostSimilarWords, "word").map(item => item.toLowerCase());

    return mostSimilarWords && mostSimilarWords.length
      ? [keyword, ...mostSimilarWords]
      : [keyword.toLowerCase()];
  };

  const generateComments = comment => {
    const comments = [];
    const commentWords = comment.split(" ");

    for (let i = 0; i < commentWords.length; i++) {
      const commentWord = commentWords[i];

      const similarWords = getMostSimilarWords(commentWord);

      similarWords.forEach(similarWord => {
        comments.push(
          `${commentWords.slice(0, i).join(" ")} ${similarWord} ${commentWords
            .slice(i + 1)
            .join(" ")}`
        );
      });
    }

    return comments;
  };

  const trainingHeader = [
    {
      id: "label",
      title: ""
    },
    {
      id: "comment",
      title: ""
    }
  ];
  const percentage = 70;

  let mutiFileData = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/Comment_dataset_multi_label.csv");

  const commentsDB = await Models.Comment.find({
    isShowOnRais3: true,
    securitySentences: [],
    privacySentences: [],
    permissionSentences: [],
    collectionSentences: [],
    sharingSentences: []
  }).limit(4000);

  const createFile = async (labelIndex, prefix) => {
    const rows = mutiFileData.map(item => ({
      comment: item[1],
      label: item[labelIndex] === "x" ? 2 : 1
    }));

    let dataset = rows.reduce((acc, { label, comment }) => {
      let generatedComments = [];
      if (label === 2) generatedComments = generateComments(comment);

      acc = [
        ...acc,
        {
          label,
          comment,
          isReal: true
        },
        ...generatedComments.map(comment => ({
          label,
          comment,
          isReal: false
        }))
      ];

      return acc;
    }, []);

    dataset = [
      ...dataset,
      ..._.map(commentsDB, "comment").map(comment => ({
        label: 1,
        comment,
        isReal: false
      }))
    ];
    const originalDataset = [...dataset];

    const totalY = dataset.filter(row => row.label === 2).length;
    const totalN = dataset.filter(row => row.label === 1).length;

    dataset = _.orderBy(dataset, row => row.label, ["desc"]);
    const trainningY = dataset.splice(0, Math.floor(totalY * (percentage / 100)));
    dataset = _.orderBy(dataset, row => row.label, ["asc"]);
    const trainningN = dataset.splice(0, Math.floor(totalN * (percentage / 100)));

    const trainingRowsCSV = [...trainningY, ...trainningN];
    const testingRowsCSV = [...dataset];

    const csvWriterTrainingReal = createCsvWriter({
      path: `./training-${prefix}.csv`,
      header: trainingHeader
    });
    await csvWriterTrainingReal.writeRecords(trainingRowsCSV);

    const csvWriterTestingReal = createCsvWriter({
      path: `./testing-${prefix}.csv`,
      header: trainingHeader
    });
    await csvWriterTestingReal.writeRecords(testingRowsCSV);

    const csvWriterTraining = createCsvWriter({
      path: `./training-${prefix}-real.csv`,
      header: trainingHeader
    });
    await csvWriterTraining.writeRecords(originalDataset);
  };

  await createFile(2, "SAndP");
  await createFile(3, "permission");
  await createFile(4, "dataCollection");
  await createFile(5, "dataSharing");
}

async function trainningAndTestingFromDataset() {
  console.log("Running trainningAndTestingFromDataset");

  // https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
  w2vModel = await new Promise((resolve, reject) => {
    w2v.loadModel(process.env.W2V_MODEL, function(error, model) {
      if (error) reject(error);

      resolve(model);
    });
  });
  const getMostSimilarWords = keyword => {
    let mostSimilarWords = [];
    if (w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword];
    else {
      mostSimilarWords = w2vModel.mostSimilar(keyword, 2) || [];
      w2vModelData[keyword] = mostSimilarWords;
    }

    mostSimilarWords = _.map(mostSimilarWords, "word").map(item => item.toLowerCase());

    return mostSimilarWords && mostSimilarWords.length
      ? [keyword, ...mostSimilarWords]
      : [keyword.toLowerCase()];
  };

  const generateComments = comment => {
    const comments = [];
    const commentWords = comment.split(" ");

    for (let i = 0; i < commentWords.length; i++) {
      const commentWord = commentWords[i];

      const similarWords = getMostSimilarWords(commentWord);

      similarWords.forEach(similarWord => {
        comments.push(
          `${commentWords.slice(0, i).join(" ")} ${similarWord} ${commentWords
            .slice(i + 1)
            .join(" ")}`
        );
      });
    }

    return comments;
  };

  const trainingHeader = [
    {
      id: "label",
      title: ""
    },
    {
      id: "comment",
      title: ""
    }
  ];
  const percentage = 70;

  let [rows] = await Promise.all([
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Downloads/DATA_SHARING_TRAINING (1).csv")
  ]);

  const totalY = rows.filter(row => row[2] === "Y").length;
  const totalN = rows.filter(row => row[2] === "N").length;

  rows = _.orderBy(rows, row => row[2], ["desc"]);
  const trainningY = rows.splice(0, Math.floor(totalY * (percentage / 100)));
  rows = _.orderBy(rows, row => row[2], ["asc"]);
  const trainningN = rows.splice(0, Math.floor(totalN * (percentage / 100)));

  const commentsDB = await Models.Comment.find({
    isShowOnRais3: true,
    securitySentences: [],
    privacySentences: [],
    permissionSentences: [],
    collectionSentences: [],
    sharingSentences: []
  }).limit(4000);

  let trainingRowsCSV = [...trainningY, ...trainningN].reduce((acc, item) => {
    const comment = item[1];
    const label = item[2];

    let generatedComments = [];
    if (label === "Y") generatedComments = generateComments(comment);

    acc = [
      ...acc,
      {
        label: label == "Y" ? 2 : 1,
        comment,
        isReal: true
      },
      ...generatedComments.map(comment => ({
        label: label == "Y" ? 2 : 1,
        comment,
        isReal: false
      }))
    ];

    return acc;
  }, []);

  trainingRowsCSV = [
    ...trainingRowsCSV,
    ..._.map(commentsDB.splice(0, 700), "comment").map(comment => ({
      label: 1,
      comment,
      isReal: false
    }))
  ];

  let testingRowsCSV = rows.reduce((acc, item) => {
    const comment = item[1];
    const label = item[2];

    acc = [
      ...acc,
      {
        label: label == "Y" ? 2 : 1,
        comment,
        isReal: true
      }
    ];

    return acc;
  }, []);

  const csvWriterTrainingReal = createCsvWriter({
    path: `./training-SP-real.csv`,
    header: trainingHeader
  });
  await csvWriterTrainingReal.writeRecords(trainingRowsCSV.filter(item => item.isReal));

  const csvWriterTestingReal = createCsvWriter({
    path: `./testing-SP-real.csv`,
    header: trainingHeader
  });
  await csvWriterTestingReal.writeRecords(testingRowsCSV.filter(item => item.isReal));

  const csvWriterTraining = createCsvWriter({
    path: `./training-SP.csv`,
    header: trainingHeader
  });
  await csvWriterTraining.writeRecords(trainingRowsCSV);
}
async function trainningAndTesting() {
  console.log("Running trainningAndTesting");

  const [SPCommentCSV, SPTraningCSV] = await Promise.all([
    csv({
      noheader: false,
      output: "csv"
    }).fromFile(
      "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/S&P_Comment_TrainingDataset(Y-N).csv"
    ),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile(
      "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/S&P_TRAINING.csv"
    )
  ]);

  const percentage = 70;
  const result = {
    bayes: {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0
    },
    logistic: {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0
    }
  };
  const headerAccuracy = [
    {
      id: "name",
      title: ""
    },
    {
      id: "begin",
      title: "Bayesian"
    },
    {
      id: "malicious",
      title: "Logistic Regression"
    }
  ];

  let rows = SPTraningCSV;

  const totalY = rows.filter(row => row[2] === "Y").length;
  const totalN = rows.filter(row => row[2] === "N").length;
  let rowsCSV = [];

  const trainningY = rows.splice(0, Math.floor(totalY * (percentage / 100)));
  const trainningN = rows.splice(0, Math.floor(totalN * (percentage / 100)));

  const trainning = [...trainningY, ...trainningN];
  trainning.forEach(([, text, label]) => {
    bayesClassifier.addDocument(text, label);
    logisticRegressionClassifier.addDocument(text, label);
  });

  bayesClassifier.train();
  logisticRegressionClassifier.train();

  const testing = rows;
  testing.forEach(item => {
    const [, text, label] = item;
    const actualClassBayes = bayesClassifier.classify(text);
    console.log(1, actualClassBayes);
    if (label === "Y" && actualClassBayes == "Y") result.bayes.TP++;
    else if (label === "N" && actualClassBayes == "N") result.bayes.TN++;
    else if (label === "Y" && actualClassBayes == "N") result.bayes.FP++;
    else if (label === "N" && actualClassBayes == "Y") result.bayes.FN++;

    const actualClassLogistic = logisticRegressionClassifier.classify(text);
    console.log(2, actualClassLogistic);

    if (label === "Y" && actualClassLogistic == "Y") result.logistic.TP++;
    else if (label === "N" && actualClassLogistic == "N") result.logistic.TN++;
    else if (label === "Y" && actualClassLogistic == "N") result.logistic.FP++;
    else if (label === "N" && actualClassLogistic == "Y") result.logistic.FN++;

    rowsCSV.push({
      comment: text,
      label,
      bayesian: actualClassBayes,
      logistic: actualClassLogistic
    });
  });

  // accuracy
  const PrecisionBenign = result.bayes.TP / (result.bayes.TP + result.bayes.FP);
  const PrecisionMalicious = result.logistic.TP / (result.logistic.TP + result.logistic.FP);

  const RecallBenign = result.bayes.TP / (result.bayes.TP + result.bayes.FN);
  const RecallMalicious = result.logistic.TP / (result.logistic.TP + result.logistic.FN);

  const F1Benign = (2 * (PrecisionBenign * RecallBenign)) / (PrecisionBenign + RecallBenign);
  const F1Malicious =
    (2 * (PrecisionMalicious * RecallMalicious)) / (PrecisionMalicious + RecallMalicious);

  const Accuracy =
    (result.bayes.TP + result.bayes.TN) /
    (result.bayes.TP + result.bayes.FP + result.bayes.FN + result.bayes.TN);
  const AccuracyMalicious =
    (result.logistic.TP + result.logistic.TN) /
    (result.logistic.TP + result.logistic.FP + result.logistic.FN + result.logistic.TN);

  const rowsAccuracy = [
    {
      name: "TP",
      begin: result.bayes.TP,
      malicious: result.logistic.TP
    },
    {
      name: "TN",
      begin: result.bayes.TN,
      malicious: result.logistic.TN
    },
    {
      name: "FP",
      begin: result.bayes.FP,
      malicious: result.logistic.FP
    },
    {
      name: "FN",
      begin: result.bayes.FN,
      malicious: result.logistic.FN
    },
    {
      name: "Percision",
      begin: PrecisionBenign,
      malicious: PrecisionMalicious
    },
    {
      name: "Recall",
      begin: RecallBenign,
      malicious: RecallMalicious
    },
    {
      name: "F1",
      begin: F1Benign,
      malicious: F1Malicious
    },
    {
      name: "Accuracy",
      begin: Accuracy,
      malicious: AccuracyMalicious
    }
  ];

  const csvWriterAccuracy = createCsvWriter({
    path: `./Bayesian-and-Logistic-Regression-Classifiers(${percentage}-${100 - percentage}).csv`,
    header: headerAccuracy
  });
  await csvWriterAccuracy.writeRecords(rowsAccuracy);

  console.log("DONE");
}

async function test2() {
  const csvData = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/ind/comment-survey-3/be/SPTrainingLabel-new(prediction).csv");

  let X = 0,
    Y = 0,
    Z = 0,
    W = 0;

  csvData.forEach(item => {
    const [, , label, predictionLabel] = item;
    if (predictionLabel === "N" && label === "N") X++;
    else if (predictionLabel === "Y" && label === "N") Y++;
    else if (predictionLabel === "N" && label === "Y") Z++;
    else if (predictionLabel === "Y" && label === "Y") W++;
  });

  const Precision = X / (X + Z);
  const Recall = X / (X + Y);
  const F1 = (2 * (Precision * Recall)) / (Precision + Recall);
  const Accuracy = (X + W) / (X + Y + Z + W);

  const header1 = [
    {
      id: "name",
      title: ""
    },
    {
      id: "begin",
      title: ""
    }
  ];
  const header2 = [
    {
      id: "name",
      title: ""
    },
    {
      id: "predictY",
      title: "Predicted value: YES"
    },
    {
      id: "predictN",
      title: "Predicted value: NO"
    }
  ];

  const rows1 = [
    {
      name: "Percision",
      begin: Precision
    },
    {
      name: "Recall",
      begin: Recall
    },
    {
      name: "F1",
      begin: F1
    },
    {
      name: "Accuracy",
      begin: Accuracy
    }
  ];

  const rows2 = [
    {
      name: "Actual value: Yes",
      predictY: W,
      predictN: Z
    },
    {
      name: "Actual value: No",
      predictY: Y,
      predictN: X
    }
  ];

  const csvWriter1 = createCsvWriter({
    path: `./SPTrainingLabel-new(accuracy).csv`,
    header: header1
  });
  await csvWriter1.writeRecords(rows1);

  const csvWriter2 = createCsvWriter({
    path: `./SPTrainingLabel-new(confusion).csv`,
    header: header2
  });
  await csvWriter2.writeRecords(rows2);
  return;
  const header = [
    {
      id: "stt",
      title: "STT"
    },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "label",
      title: "Label"
    },
    {
      id: "predictionLabel",
      title: "Bert prediction"
    }
  ];
  console.log(1);
  const rows = await csv({
    noheader: false,
    output: "csv"
  }).fromFile(
    "/Users/tuanle/Documents/SP_TRAINING,SP_Comment_TrainingDataset(Y-N),PERMISSION_TRAINING/SPTrainingLabel-new.csv"
  );

  let result = await Promise.map(
    rows,
    async row => {
      const [stt, comment, label] = row;

      console.log(1, stt);
      const prediction = await Services.PredictionLabel.getPredictLabel([{ id: 1, text: comment }]);
      const predictionLabel = prediction[0].scores.SPTrainingLabel >= 0.5 ? "Y" : "N";

      return {
        comment,
        label,
        predictionLabel
      };
    },
    {
      concurrency: 10
    }
  );

  console.log(result);
  result = result.map((item, i) => {
    item.stt = i + 1;

    return item;
  });

  const csvWriterAccuracy = createCsvWriter({
    path: `./SPTrainingLabel-new(prediction).csv`,
    header: header
  });
  await csvWriterAccuracy.writeRecords(result);

  console.log("DONE");
}
// #|Apps|#Total comments|#Keyword including comments|#BERT predicting comments|#Comments labeling by Users|#Remaining comments

async function test3() {
  const header = [
    {
      id: "stt",
      title: "STT"
    },
    {
      id: "appName",
      title: "App Name"
    },
    {
      id: "totalComment",
      title: "Total Comments"
    },
    {
      id: "englishComments",
      title: "English comments"
    },
    {
      id: "commentIncludeKeyWord",
      title: "Keyword including comments"
    },
    {
      id: "commentIncludeBert",
      title: "BERT predicting comments"
    },
    {
      id: "commentIncludelabeling",
      title: "Comments labeling by Users"
    },
    {
      id: "remainingComments",
      title: "Remaining comments"
    }
  ];

  let currentRows = [];
  try {
    currentRows = await csv({
      noheader: false,
      output: "csv"
    }).fromFile("./appRais3.csv");
  } catch (error) {
    console.error(error.message);
  }

  const appSurveys = await Models.AppSurvey.find();
  const answers = await Models.Answer.find();

  const commentIdsAnswered = answers.reduce((acc, item) => {
    acc = [
      ...acc,
      ..._.map(_.flatten(_.map(item.questions, "responses")), "commentId").map(item =>
        item.toString()
      )
    ];
    return acc;
  }, []);

  let appIds = appSurveys.reduce((acc, item) => {
    acc = [...acc, ..._.map(item.apps, "appId")];
    return acc;
  }, []);

  let rows = await Promise.map(
    appIds,
    async (appId, index) => {
      console.log(`RUNNING ${index + 1}/${appIds.length}`);

      try {
        const app = await Models.App.findById(appId);
        let appName,
          totalComment,
          englishComments,
          commentIncludeKeyWord,
          commentIncludeBert,
          commentIncludelabeling,
          remainingComments;
        const existedRow = currentRows.find(item => item[1] === app.appName);
        if (existedRow) {
          appName = existedRow[1];
          totalComment = existedRow[2];
          englishComments = existedRow[3];
          commentIncludeKeyWord = existedRow[4];
          commentIncludeBert = existedRow[5];
          commentIncludelabeling = existedRow[6];
          remainingComments = existedRow[7];
        } else {
          const comments = await Models.Comment.find({
            appId
          });

          const relatedComments = comments.filter(item => item.isRelatedRail3);
          const bertComments = comments.filter(item => item.scores);
          const labelComments = comments.filter(item =>
            _.includes(commentIdsAnswered, item._id.toString())
          );

          englishComments = comments.filter(item => isEnglish(item.comment)).length;

          appName = app.appName;
          totalComment = comments.length;
          // englishComments = englishComments.length;
          commentIncludeKeyWord = relatedComments.length;
          commentIncludeBert = bertComments.length;
          commentIncludelabeling = labelComments.length;
          remainingComments =
            comments.length - relatedComments.length - bertComments.length - labelComments.length;
        }

        return {
          appName,
          totalComment,
          englishComments,
          commentIncludeKeyWord,
          commentIncludeBert,
          commentIncludelabeling,
          remainingComments
        };
      } catch (err) {
        console.log(err);
      }
    },
    {
      concurrency: 30
    }
  );

  rows = rows.filter(item => !!item);
  rows = rows.map((item, i) => {
    item.stt = i + 1;

    return item;
  });

  const csvWriter1 = createCsvWriter({
    path: `./appRais3.csv`,
    header
  });
  await csvWriter1.writeRecords(rows);

  console.log("DONE test3");
}

async function test4() {
  const targetApps = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("./data/app-comment(with target).csv");

  let currentRows = [];
  try {
    currentRows = await csv({
      noheader: false,
      output: "csv"
    }).fromFile("./app-comment(with target).csv");
  } catch (error) {
    console.error(error.message);
  }

  const answers = await Models.Answer.find();
  const commentIdsAnswered = answers.reduce((acc, item) => {
    acc = [
      ...acc,
      ..._.map(_.flatten(_.map(item.questions, "responses")), "commentId").map(item =>
        item.toString()
      )
    ];
    return acc;
  }, []);

  const header = [
    {
      id: "stt",
      title: "No."
    },
    {
      id: "appName",
      title: "App Name"
    },
    {
      id: "categoryName",
      title: "Category Name"
    },
    {
      id: "dataset",
      title: "Dataset"
    },
    {
      id: "totalComment",
      title: "Total Comment"
    },
    {
      id: "totalRelatedComment",
      title: "Comments Including Keyword"
    },
    {
      id: "totalPredictComment",
      title: "Bert prediction"
    },
    {
      id: "percentage",
      title: "Percentage"
    },
    {
      id: "commentIncludelabeling",
      title: "Comments labeling by Users"
    }
  ];

  let rows = await Promise.map(
    targetApps,
    async app => {
      try {
        const [
          stt,
          appName,
          categoryName,
          dataset,
          totalComment,
          totalRelatedComment,
          totalPredictComment,
          percentage
        ] = app;

        let labelComments;
        const existedRow = currentRows.find(item => item[0] === stt);
        if (existedRow) {
          labelComments = existedRow[8];
        } else {
          const appDB = await Models.App.findOne({
            appName
          });

          if (!appDB) return;
          const comments = await Models.Comment.find({
            appId: appDB._id
          });

          labelComments = comments.filter(item =>
            _.includes(commentIdsAnswered, item._id.toString())
          );
        }

        return {
          stt,
          appName,
          categoryName,
          dataset,
          totalComment,
          totalRelatedComment,
          totalPredictComment,
          percentage,
          commentIncludelabeling: labelComments.length
        };
      } catch (err) {
        console.error(err);
      }
    },
    {
      concurrency: 10
    }
  );

  rows = rows.filter(item => !!item);
  rows = _.orderBy(rows, ["stt"], ["asc"]);

  const csvWriter1 = createCsvWriter({
    path: `./app-comment(with target).csv`,
    header
  });
  await csvWriter1.writeRecords(rows);

  console.log("DONE test4");
}

async function test5() {
  const targetApps = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("./data/app-comment(with target).csv");

  const answers = await Models.Answer.find();
  const commentIdsAnswered = answers.reduce((acc, item) => {
    acc = [
      ...acc,
      ..._.map(_.flatten(_.map(item.questions, "responses")), "commentId").map(item =>
        item.toString()
      )
    ];
    return acc;
  }, []);

  await Promise.map(
    targetApps,
    async app => {
      try {
        const [
          stt,
          appName,
          categoryName,
          dataset,
          totalComment,
          totalRelatedComment,
          totalPredictComment,
          percentage
        ] = app;
        console.log(dataset);

        if (dataset === "old") return;

        const appDB = await Models.App.findOne({
          appName
        });

        if (!appDB || appDB.isTest5) return;

        const comments = await Models.Comment.find({
          appId: appDB._id
        });

        const labelComments = comments.filter(
          item => !_.includes(commentIdsAnswered, item._id.toString())
        );

        await Models.Comment.updateMany(
          {
            _id: {
              $in: _.map(labelComments, "_id")
            }
          },
          {
            $set: { isNotLabel: true }
          }
        );

        await Models.App.updateOne(
          {
            appName
          },
          {
            $set: {
              isTest5: true
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    },
    {
      concurrency: 10
    }
  );

  console.log("DONE test5");
}

async function addLabelToFile() {
  const predictionData = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/tuanle/Documents/kaka/test-permission.csv");

  const testingData = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/ind/comment-survey-3/be/testing-SP-real.csv");

  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "label",
      title: "label"
    },
    {
      id: "prediction",
      title: "prediction label"
    }
  ];

  function lettersOnly(str) {
    return str.replace(/[^a-zA-Z]/g, "");
  }

  const rows = testingData.map((item, index) => {
    const [label, comment] = item;

    const predictionRow = predictionData.find(item => {
      console.log(1, lettersOnly(item[1]), lettersOnly(comment));
      return lettersOnly(item[1]) == lettersOnly(comment);
    });

    if (!predictionRow) {
      console.log(2, comment);
      throw new Error("kakakaks");
    }
    return {
      stt: index + 1,
      comment,
      label,
      prediction: Number(predictionRow[2]) >= 0.5 ? "Y" : "N"
    };
  });

  const csvWriter1 = createCsvWriter({
    path: `./permission-prediction.csv`,
    header
  });
  await csvWriter1.writeRecords(rows);

  console.log("DONE addLabelToFile");
}

async function getTestingSetFromDB() {
  const trainingHeader = [
    {
      id: "label",
      title: ""
    },
    {
      id: "comment",
      title: ""
    }
  ];

  // scores: { $exists: true, $ne: null },
  const comments = await Models.Comment.find({
    isNotLabel: true,
    scores: { $exists: false },
    $or: [
      { securitySentences: { $ne: [] } },
      { privacySentences: { $ne: [] } },
      { permissionSentences: { $ne: [] } },
      { collectionSentences: { $ne: [] } },
      { sharingSentences: { $ne: [] } }
    ]
  });

  console.log(1, comments.length);

  const rows = comments.map(item => ({
    label: 0,
    comment: item.comment
  }));

  const csvWriter1 = createCsvWriter({
    path: `./testing-db.csv`,
    header: trainingHeader
  });
  await csvWriter1.writeRecords(rows);
}

async function updateLabelFromFile() {
  const labelData = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/tuanle/Documents/kaka/testing-db.csv");

  const comments = await Models.Comment.find({
    isNotLabel: true,
    scores: { $exists: false },
    $or: [
      { securitySentences: { $ne: [] } },
      { privacySentences: { $ne: [] } },
      { permissionSentences: { $ne: [] } },
      { collectionSentences: { $ne: [] } },
      { sharingSentences: { $ne: [] } }
    ]
  });

  await Promise.map(
    comments,
    async comment => {
      const labelRow = labelData.find(
        item => item[1].toLowerCase() === comment.comment.toLowerCase()
      );

      if (!labelRow) return;

      const [, , SPLabel, permissionLabel, dataCollectionLabel, dataSharingLabel] = labelRow;

      await Models.Comment.updateOne(
        {
          _id: comment.id
        },
        {
          $set: {
            "scores.SPLabel": Number(SPLabel),
            "scores.permissionLabel": Number(permissionLabel),
            "scores.dataCollectionLabel": Number(dataCollectionLabel),
            "scores.dataSharingLabel": Number(dataSharingLabel)
          }
        }
      );
    },
    {
      concurrency: 10
    }
  );
}

async function statBert() {
  const bertPredictionData = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/tuanle/Documents/kaka/sandp/test-sandp.csv");

  const combineRows = [];
  for (let i = 0; i < bertPredictionData.length; i++) {
    const [stt, comment, SPLabel, bertSPLabel] = bertPredictionData[i];

    combineRows.push({
      comment,
      SPLabel: SPLabel == "2" ? "Y" : "N",

      bertSPLabel: Number(bertSPLabel) >= 0.5 ? "Y" : "N"
    });
  }

  const calculateAccuracy = async fieldName => {
    const header = [
      {
        id: "name",
        title: ""
      },
      {
        id: "begin",
        title: ""
      }
    ];

    const header2 = [
      {
        id: "stt",
        title: "STT"
      },
      {
        id: "comment",
        title: "Comment"
      },
      {
        id: "label",
        title: "Label"
      },
      {
        id: "bertPrediction",
        title: "Bert prediction"
      }
    ];

    let X = 0,
      Y = 0,
      Z = 0,
      W = 0;

    combineRows.forEach(item => {
      const label = item.SPLabel;
      const predictionLabel = item.bertSPLabel;

      if (predictionLabel === "N" && label === "N") X++;
      else if (predictionLabel === "Y" && label === "N") Y++;
      else if (predictionLabel === "N" && label === "Y") Z++;
      else if (predictionLabel === "Y" && label === "Y") W++;
    });

    const Precision = X / (X + Z);
    const Recall = X / (X + Y);
    const F1 = (2 * (Precision * Recall)) / (Precision + Recall);
    const Accuracy = (X + W) / (X + Y + Z + W);

    const rows = [
      {
        name: "Percision",
        begin: Precision
      },
      {
        name: "Recall",
        begin: Recall
      },
      {
        name: "F1",
        begin: F1
      },
      {
        name: "Accuracy",
        begin: Accuracy
      }
    ];

    const rows2 = combineRows.map((item, stt) => {
      const label = item.SPLabel;
      const predictionLabel = item.bertSPLabel;

      return {
        stt: stt + 1,
        comment: item.comment,
        label: label,
        bertPrediction: predictionLabel
      };
    });
    const csvWriter = createCsvWriter({
      path: `./report/${fieldName}.csv`,
      header
    });
    const csvWriter2 = createCsvWriter({
      path: `./report/${fieldName}-prediction.csv`,
      header: header2
    });
    await csvWriter.writeRecords(rows);
    await csvWriter2.writeRecords(rows2);
  };

  const confusion = async fieldName => {
    const header = [
      {
        id: "name",
        title: ""
      },
      {
        id: "predictY",
        title: "Predicted value: YES"
      },
      {
        id: "predictN",
        title: "Predicted value: NO"
      }
    ];

    let X = 0,
      Y = 0,
      Z = 0,
      W = 0;

    combineRows.forEach(item => {
      const label = item.SPLabel;
      const predictionLabel = item.bertSPLabel;

      if (predictionLabel === "N" && label === "N") X++;
      else if (predictionLabel === "Y" && label === "N") Y++;
      else if (predictionLabel === "N" && label === "Y") Z++;
      else if (predictionLabel === "Y" && label === "Y") W++;
    });

    const rows = [
      {
        name: "Actual value: Yes",
        predictY: W,
        predictN: Z
      },
      {
        name: "Actual value: No",
        predictY: Y,
        predictN: X
      }
    ];

    const csvWriter = createCsvWriter({
      path: `./report/${fieldName}-confusion.csv`,
      header
    });
    await csvWriter.writeRecords(rows);
  };

  await calculateAccuracy("SPLabel");
  await confusion("SPLabel");
}

async function campaign1() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "category",
      title: "category"
    },
    {
      id: "yes",
      title: "Yes"
    },
    {
      id: "no",
      title: "No"
    },
    {
      id: "partially",
      title: "Partially"
    },
    {
      id: "pyes",
      title: "% Yes"
    },
    {
      id: "pno",
      title: "% No"
    },
    {
      id: "ppartially",
      title: "% Partially"
    }
  ];

  const answers = await Models.Answer.find();

  const result = {};

  await bluebird.map(
    answers,
    async answer => {
      if (answer.questions.length !== 50) return;

      for (let j = 0; j < answer.questions.length; j++) {
        const question = answer.questions[j].toJSON();

        const comment = await Models.Comment.findOne({
          commentId: question.commentId
        });

        const app = await Models.App.findOne({
          appName: comment.appName
        }).select("appName categoryName");
        if (app) {
          if (result[app.categoryName] === undefined) {
            result[app.categoryName] = {
              0: 0,
              1: 0,
              2: 0
            };
          }
          for (let k = 0; k < question.responses.length; k++) {
            const response = question.responses[k];
            result[app.categoryName][response.value]++;
          }
        }
      }
    },
    {
      concurrency: 10
    }
  );

  const rows = [];
  Object.entries(result).forEach(([categoryName, stat], index) => {
    const total = stat[0] + stat[1] + stat[2];
    rows.push({
      stt: index + 1,
      category: categoryName,
      yes: stat[1],
      no: stat[0],
      partially: stat[2],
      pyes: (stat[1] / total).toFixed(2) * 100,
      pno: (stat[0] / total).toFixed(2) * 100,
      ppartially: (stat[2] / total).toFixed(2) * 100
    });
  });
  const csvWriter = createCsvWriter({
    path: `./12f1389f58a6_B.csv`,
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function campaign2V1() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "category",
      title: "category"
    },
    {
      id: "yes",
      title: "Yes"
    },
    {
      id: "no",
      title: "No"
    },
    {
      id: "partially",
      title: "Partially"
    },
    {
      id: "pyes",
      title: "% Yes"
    },
    {
      id: "pno",
      title: "% No"
    },
    {
      id: "ppartially",
      title: "% Partially"
    }
  ];

  const answers = await Models.Answer.find();

  const result = {};

  await bluebird.map(
    answers,
    async answer => {
      if (answer.questions.length !== 50) return;

      for (let j = 0; j < answer.questions.length; j++) {
        const question = answer.questions[j].toJSON();

        const comment = await Models.Comment.findOne({
          commentId: question.commentId
        });

        const app = await Models.App.findOne({
          appName: comment.appName
        }).select("appName categoryName");
        if (app) {
          if (result[app.categoryName] === undefined) {
            result[app.categoryName] = {
              0: 0,
              1: 0,
              2: 0
            };
          }
          for (let k = 0; k < question.responses.length; k++) {
            const response = question.responses[k];
            result[app.categoryName][response.value]++;
          }
        }
      }
    },
    {
      concurrency: 10
    }
  );

  const rows = [];
  Object.entries(result).forEach(([categoryName, stat], index) => {
    const total = stat[0] + stat[1] + stat[2];
    rows.push({
      stt: index + 1,
      category: categoryName,
      yes: stat[1],
      no: stat[0],
      partially: stat[2],
      pyes: (stat[1] / total).toFixed(2) * 100,
      pno: (stat[0] / total).toFixed(2) * 100,
      ppartially: (stat[2] / total).toFixed(2) * 100
    });
  });
  const csvWriter = createCsvWriter({
    path: `./8b367f03819a.csv`,
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function campaign2V2() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "category",
      title: "category"
    },
    {
      id: "yes",
      title: "Yes"
    },
    {
      id: "no",
      title: "No"
    },
    {
      id: "partially",
      title: "Partially"
    },
    {
      id: "pyes",
      title: "% Yes"
    },
    {
      id: "pno",
      title: "% No"
    },
    {
      id: "ppartially",
      title: "% Partially"
    },
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "psatisfied",
      title: "% Satisfied"
    }
  ];

  const answers = await Models.Answer.find();

  const result = {};

  await bluebird.map(
    answers,
    async answer => {
      if (answer.questions.length !== 7) return;

      for (let j = 0; j < answer.questions.length; j++) {
        const question = answer.questions[j].toJSON();

        const app = await Models.App.findOne({
          _id: question.appId
        }).select("appName categoryName");
        if (app) {
          if (result[app.categoryName] === undefined) {
            result[app.categoryName] = {
              0: 0,
              1: 0,
              2: 0
            };
          }
          for (let k = 0; k < question.responses.length; k++) {
            const response = question.responses[k];
            result[app.categoryName][response.value]++;
          }
        }
      }
    },
    {
      concurrency: 10
    }
  );

  const rows = [];
  Object.entries(result).forEach(([categoryName, stat], index) => {
    const total = stat[0] + stat[1] + stat[2];
    rows.push({
      stt: index + 1,
      category: categoryName,
      yes: stat[1],
      no: stat[0],
      partially: stat[2],
      pyes: (stat[1] / total).toFixed(2) * 100,
      pno: (stat[0] / total).toFixed(2) * 100,
      ppartially: (stat[2] / total).toFixed(2) * 100,
      satisfied: answers.filter(answer => answer.questions.length === 7 && answer.isSatisfied)
        .length,
      psatisfied:
        (
          answers.filter(answer => answer.questions.length === 7 && answer.isSatisfied).length /
          answers.filter(answer => answer.questions.length === 7).length
        ).toFixed(2) * 100
    });
  });
  const csvWriter = createCsvWriter({
    path: `./9b45f61b802d.csv`,
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function campaign3() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "category",
      title: "category"
    },
    {
      id: "yes",
      title: "Yes"
    },
    {
      id: "no",
      title: "No"
    },
    {
      id: "partially",
      title: "Partially"
    },
    {
      id: "pyes",
      title: "% Yes"
    },
    {
      id: "pno",
      title: "% No"
    },
    {
      id: "ppartially",
      title: "% Partially"
    },
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "psatisfied",
      title: "% Satisfied"
    }
  ];

  const answers = await Models.Answer.find();

  const result = {};

  await bluebird.map(
    answers,
    async answer => {
      if (answer.questions.length !== 20) return;

      for (let j = 0; j < answer.questions.length; j++) {
        const question = answer.questions[j].toJSON();

        const app = await Models.App.findOne({
          _id: question.appId
        }).select("appName categoryName");
        if (app) {
          if (result[app.categoryName] === undefined) {
            result[app.categoryName] = {
              0: 0,
              1: 0,
              2: 0
            };
          }
          for (let k = 0; k < question.responses.length; k++) {
            const response = question.responses[k];
            result[app.categoryName][response.value]++;
          }
        }
      }
    },
    {
      concurrency: 10
    }
  );

  const rows = [];
  Object.entries(result).forEach(([categoryName, stat], index) => {
    const total = stat[0] + stat[1] + stat[2];
    rows.push({
      stt: index + 1,
      category: categoryName,
      yes: stat[1],
      no: stat[0],
      partially: stat[2],
      pyes: (stat[1] / total).toFixed(2) * 100,
      pno: (stat[0] / total).toFixed(2) * 100,
      ppartially: (stat[2] / total).toFixed(2) * 100,
      satisfied: answers.filter(answer => answer.questions.length === 20 && answer.isSatisfied)
        .length,
      psatisfied:
        (
          answers.filter(answer => answer.questions.length === 20 && answer.isSatisfied).length /
          answers.filter(answer => answer.questions.length === 20).length
        ).toFixed(2) * 100
    });
  });
  const csvWriter = createCsvWriter({
    path: `./group3.csv`,
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function campaign4() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "category",
      title: "category"
    },
    {
      id: "yes",
      title: "Yes"
    },
    {
      id: "no",
      title: "No"
    },
    {
      id: "partially",
      title: "Partially"
    },
    {
      id: "pyes",
      title: "% Yes"
    },
    {
      id: "pno",
      title: "% No"
    },
    {
      id: "ppartially",
      title: "% Partially"
    },
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "psatisfied",
      title: "% Satisfied"
    }
  ];

  const answers = await Models.Answer.find();

  const result = {};

  await bluebird.map(
    answers,
    async answer => {
      if (answer.questions.length !== 5) return;

      for (let j = 0; j < answer.questions.length; j++) {
        const question = answer.questions[j].toJSON();

        const app = await Models.App.findOne({
          _id: question.appId
        }).select("appName categoryName");
        if (app) {
          if (result[app.categoryName] === undefined) {
            result[app.categoryName] = {
              0: 0,
              1: 0,
              2: 0
            };
          }
          for (let k = 0; k < question.responses.length; k++) {
            const response = question.responses[k];
            result[app.categoryName][response.value]++;
          }
        }
      }
    },
    {
      concurrency: 10
    }
  );

  const rows = [];
  Object.entries(result).forEach(([categoryName, stat], index) => {
    const total = stat[0] + stat[1] + stat[2];
    rows.push({
      stt: index + 1,
      category: categoryName,
      yes: stat[1],
      no: stat[0],
      partially: stat[2],
      pyes: (stat[1] / total).toFixed(2) * 100,
      pno: (stat[0] / total).toFixed(2) * 100,
      ppartially: (stat[2] / total).toFixed(2) * 100,
      satisfied: answers.filter(answer => answer.questions.length === 5 && answer.isSatisfied)
        .length,
      psatisfied:
        (
          answers.filter(answer => answer.questions.length === 5 && answer.isSatisfied).length /
          answers.filter(answer => answer.questions.length === 5).length
        ).toFixed(2) * 100
    });
  });
  const csvWriter = createCsvWriter({
    path: `./group4.csv`,
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function combineCSV() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "category",
      title: "category"
    },
    {
      id: "yes",
      title: "Yes"
    },
    {
      id: "no",
      title: "No"
    },
    {
      id: "partially",
      title: "Partially"
    },
    {
      id: "pyes",
      title: "% Yes"
    },
    {
      id: "pno",
      title: "% No"
    },
    {
      id: "ppartially",
      title: "% Partially"
    },
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "psatisfied",
      title: "% Satisfied"
    }
  ];

  let dataCSV1 = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("./8b367f03819a.csv");

  let dataCSV2 = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("./9b45f61b802d.csv");

  const result = {};

  dataCSV1.forEach(row => {
    const [, categoryName, yes, no, partially] = row;
    if (!result[categoryName]) {
      result[categoryName] = {
        yes: 0,
        no: 0,
        partially: 0,
        satisfied: 0,
        psatisfied: 0
      };
    }

    result[categoryName].yes += Number(yes);
    result[categoryName].no += Number(no);
    result[categoryName].partially += Number(partially);
  });

  dataCSV2.forEach(row => {
    const [, categoryName, yes, no, partially, , , , satisfied, psatisfied] = row;
    if (!result[categoryName]) {
      result[categoryName] = {
        yes: 0,
        no: 0,
        partially: 0,
        satisfied: 0,
        psatisfied: 0
      };
    }

    result[categoryName].yes += Number(yes);
    result[categoryName].no += Number(no);
    result[categoryName].partially += Number(partially);
    result[categoryName].satisfied += Number(satisfied);
    result[categoryName].psatisfied += Number(psatisfied);
  });

  const rows = Object.entries(result).map(([categoryName, stat], index) => {
    const total = stat.yes + stat.no + stat.partially;
    return {
      stt: index,
      category: categoryName,
      yes: stat.yes,
      no: stat.no,
      partially: stat.partially,
      pyes: (stat.yes / total).toFixed(2) * 100,
      pno: (stat.no / total).toFixed(2) * 100,
      ppartially: (stat.partially / total).toFixed(2) * 100,
      satisfied: stat.satisfied,
      psatisfied: stat.psatisfied
    };
  });
  const csvWriter = createCsvWriter({
    path: `./group2.csv`,
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function convertSubCategoryIntoCategory() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "category",
      title: "category"
    },
    {
      id: "yes",
      title: "Yes"
    },
    {
      id: "no",
      title: "No"
    },
    {
      id: "partially",
      title: "Partially"
    },
    {
      id: "pyes",
      title: "% Yes"
    },
    {
      id: "pno",
      title: "% No"
    },
    {
      id: "ppartially",
      title: "% Partially"
    },
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "psatisfied",
      title: "% Satisfied"
    }
  ];
  const getCategory = categoryName => {
    const category = Object.entries(categoryGroups).find(item => {
      const subCategories = item[1];

      if (subCategories.includes(categoryName)) return true;
      return false;
    })[0];

    return category;
  };

  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("./group4.csv");

  const result = {};
  dataCSV.forEach(row => {
    const [, categoryName, yes, no, partially, , , , satisfied = 0, psatisfied = 0] = row;

    const realCategoryName = getCategory(categoryName);
    if (!result[realCategoryName]) {
      result[realCategoryName] = {
        yes: 0,
        no: 0,
        partially: 0,
        satisfied: 0,
        psatisfied: 0
      };
    }

    result[realCategoryName].yes += Number(yes);
    result[realCategoryName].no += Number(no);
    result[realCategoryName].partially += Number(partially);
    result[realCategoryName].satisfied += Number(satisfied);

    if (result[realCategoryName].satisfied) {
      result[realCategoryName].satisfied += Number(satisfied);

      result[realCategoryName].satisfied /= 2;
    } else {
      result[realCategoryName].satisfied += Number(satisfied);
    }

    if (result[realCategoryName].psatisfied) {
      result[realCategoryName].psatisfied += Number(psatisfied);

      result[realCategoryName].psatisfied /= 2;
    } else {
      result[realCategoryName].psatisfied += Number(psatisfied);
    }
  });

  const rows = Object.entries(result).map(([categoryName, stat], index) => {
    const total = stat.yes + stat.no + stat.partially;
    return {
      stt: index,
      category: categoryName,
      yes: stat.yes,
      no: stat.no,
      partially: stat.partially,
      pyes: (stat.yes / total).toFixed(2) * 100,
      pno: (stat.no / total).toFixed(2) * 100,
      ppartially: (stat.partially / total).toFixed(2) * 100,
      satisfied: stat.satisfied,
      psatisfied: stat.psatisfied
    };
  });

  const csvWriter = createCsvWriter({
    path: `./group4-v2.csv`,
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}
main();
async function main() {
  const comments = await Models.Comment.find({
    scores: { $exists: true }
    // isRelatedRail3: true // tab 2
  }).select("id");

  console.log(comments.length);
  return;
  // console.log(comments.length);
  // await combineCSV();
  // await convertSubCategoryIntoCategory();
  // await campaign1();
  // await campaign2V1();
  // await campaign3();
  // await campaign4();
  // console.log(answers);
  // await statBert();
  // await updateLabelFromFile();
  // await getTestingSetFromDB();
  // await trainningAndTestingFromDataset();
  // await trainningAndTestingFromDatasetV2();
  // await addLabelToFile();
  // await test3();

  // await test2();
  // await trainningAndTesting();
  // await generateTrainningAndTesting();
  // await generateTrainningAndTestingV2();
  // await trainningAndTestingLNAndBaye();
  // await test();
  // await getCommentSurveyV2();
  // await getCommentSurveyV3();

  // await getRemainingComments();
  await Promise.all([
    // test3(),
    // test4()
    // test5()
    // getRemainingApps()
    // statCatApp(),
    // statAppcomment()
    // getPredictionReport()
    // report1(),
    // report2()
  ]);

  // await statAppcomment();

  // await getCommentSurvey();
  // await updateComentShow();
  // await getDistance();
  // await step22();
  // await getSentimentOfApp();
  // await calculateResults();
  // await updateSectionsToShow();

  // await generateComments();
  await getTestingSet();
  // await getTranningSet();

  // await rawData();

  // await reportComments();
  console.log("DONE");
  return;
  // await step1()
  // await step2()
  // await step22()

  await Promise.all([
    // reportSurvey2(),
    // explanationReport(),
    // getUserEmail(),
    // getUserDone()
  ]);

  let dataURLFile = fs.readFileSync("./dataURL.json", "utf-8");
  dataURLFile = JSON.parse(dataURLFile);

  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("./urls.csv");
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "url",
      title: "Url"
    },
    {
      id: "total",
      title: "Total apps"
    },
    {
      id: "malware",
      title: "Malware"
    }
  ];
  const rows = [];
  for (let i = 0; i < dataCSV.length; i++) {
    console.log(`Running ${i + 1}/${dataCSV.length}`);
    const [stt, url, total] = dataCSV[i];

    let maliApp = dataURLFile.find(item => item.url === url);
    if (!maliApp) {
      const requestURl = `https://ipqualityscore.com/api/json/url/pdsizCQXtcP9NK0A4luZsC7YSatUHcgk/${encodeURIComponent(
        url
      )}`;

      try {
        const res = await axios.get(requestURl);
        maliApp = res.data;
      } catch (err) {
        maliApp = {
          malware: null
        };
      }

      maliApp.url = url;
      dataURLFile.push(maliApp);
      fs.writeFileSync("./dataURL.json", JSON.stringify(dataURLFile, null, 2), "utf-8");
    }

    rows.push({
      stt,
      url,
      total,
      malware: maliApp.malware === null ? "Cannot identify" : maliApp.malware ? "Yes" : "No"
    });
  }

  const csvWriter = createCsvWriter({
    path: "./urls(ver2).csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
  return;
  let appsDB = fs.readFileSync(
    "/Users/a1234/Downloads/Static-DynamicDataOf_1379_TargetApps.json",
    "utf-8"
  );
  appsDB = JSON.parse(appsDB);
  const appIds = appsDB.map(app => app.appIdCHPlay);
  const selectedApps = [];
  const apps = [];
  const urls = {};
  var readline = require("linebyline"),
    rl = readline("/Users/a1234/Downloads/data_collect_purpose.json");
  rl.on("line", function(line, lineCount, byteCount) {
    // do something with the line of text
    const app = JSON.parse(line);
    if (app && app.data && appIds.includes(app.app)) apps.push(app.app);

    if (app && app.data && app.data.url && appIds.includes(app.app)) {
      let url = app.data.url.split("|")[0].trim();
      if (url && url !== "tracking" && url !== "null") {
        if (!urls[url]) urls[url] = [];

        urls[url].push(app.app);
        selectedApps.push(app.app);
      }
    }
  })
    .on("error", function(e) {
      // something went wrong
    })
    .on("close", function(e) {
      console.log(_.uniq(apps));
      console.log(1, _.uniq(selectedApps).length, _.uniq(apps).length);
      const header = [
        {
          id: "stt",
          title: "#"
        },
        {
          id: "url",
          title: "Url"
        },
        {
          id: "total",
          title: "Total apps"
        }
      ];
      let rows = [];
      //   decodeURI
      //   axios.get('/user?ID=12345')
      const arrayUrls = Object.entries(urls);
      for (let i = 0; i < arrayUrls.length; i++) {
        const [url, apps] = arrayUrls[i];

        // let maliApp = dataURLFile.find(item => item.url === url)

        // if(!maliApp) {
        // 	const maliApp = await axios.get(`https://ipqualityscore.com/api/json/url/pdsizCQXtcP9NK0A4luZsC7YSatUHcgk/${decodeURI(url)}`)
        // 	console.log(1, maliApp)
        // 	maliApp.url = url

        // 	dataURLFile.push(maliApp)
        // 	fs.writeFileSync("./dataURL.json", JSON.stringify(dataURLFile),"utf-8")
        // }
        rows.push({
          stt: i + 1,
          url,
          total: _.uniq(apps).length
        });
      }

      rows = _.orderBy(rows, ["total"], ["desc"]);
      rows = rows.map((item, index) => {
        item.stt = index + 1;
        return item;
      });
      const csvWriter = createCsvWriter({
        path: "./urls.csv",
        header
      });
      csvWriter.writeRecords(rows);

      console.log("DONE");
    });
}
async function getUserDone() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "id",
      title: "ID of microworker"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "time",
      title: "time"
    },
    {
      id: "num",
      title: "Total questions did"
    }
  ];
  const rows = [];
  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(
    "/Users/a1234/individual/abc/comment-survey2/be/CSVReport_8b367f03819a_B_Page#1_With_PageSize#5000.csv"
  );

  const answers = await Models.Answer.find();

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);

    const resultInMicro = dataFromMicro.find(item => item[2].trim() === user.email);

    rows.push({
      stt: i + 1,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      time: resultInMicro ? resultInMicro[1] : "",
      num: `${answer.questions.length.toString()}`
    });
  }

  const csvWriter = createCsvWriter({
    path: "./report-user(done-undone)(rais2).csv",
    header
  });
  await csvWriter.writeRecords(rows);
  console.log("DONE");
}
async function getUserEmail() {
  const users = await Models.User.find();
  const emails = _.map(users, "email").join("\n");

  fs.writeFileSync("./email(rais2).txt", emails, "utf-8");
}
async function explanationReport() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "numberOfNumber",
      title: "Number of comment"
    },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "agree",
      title: "Agree"
    },
    {
      id: "security",
      title: "Security"
    },
    {
      id: "privacy",
      title: "Privacy"
    },
    {
      id: "permission",
      title: "Permission"
    },
    {
      id: "collection",
      title: "Collection"
    },
    {
      id: "sharing",
      title: "Sharing"
    }
  ];
  const rows = [];
  let stt = 1;

  const [answers, comments] = await Promise.all([Models.Answer.find(), Models.Comment.find()]);

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);

    for (let j = 0; j < answer.questions.length; j++) {
      const question = answer.questions[j];
      const comment = comments.find(comment => comment.commentId === question.commentId);
      const [firstRes, ...explainationRes] = question.responses;
      let row = {};

      row.agree = firstRes.value === "1" ? "Yes" : firstRes.value === "2" ? "Partially" : "No";
      if (firstRes.value === "0") {
        const security = explainationRes.find(item => item.name === "question11");
        if (security && security.value !== null) {
          row.security = security.value === "1" ? `Yes - ${security.reason}` : "No";
          console.log("security", security);
        }

        const privacy = explainationRes.find(item => item.name === "question12");
        if (privacy && privacy.value !== null) {
          console.log("privacy", privacy);
          row.privacy = privacy.value === "1" ? `Yes - ${privacy.reason}` : "No";
        }

        const permission = explainationRes.find(item => item.name === "question13");
        if (permission && permission.value !== null) {
          console.log("permission", permission);
          row.permission = permission.value === "1" ? `Yes - ${permission.reason}` : "No";
        }

        const collection = explainationRes.find(item => item.name === "question14");
        if (collection && collection.value !== null) {
          console.log("collection", collection);
          row.collection = collection.value === "1" ? `Yes - ${collection.reason}` : "No";
        }

        const sharing = explainationRes.find(item => item.name === "question15");
        if (sharing && sharing.value !== null) {
          console.log("sharing", sharing);
          row.sharing = sharing.value === "1" ? `Yes - ${sharing.reason}` : "No";
        }
      }

      rows.push({
        stt: stt++,
        email: user.email,
        numberOfNumber: j + 1,
        comment: comment.comment,
        ...row
      });
    }
  }

  const csvWriter = createCsvWriter({
    path: "./explaination(rais2).csv",
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}
async function reportSurvey2() {
  const answers = await Models.Answer.find();

  const result = {
    0: 0,
    1: 0,
    2: 0
  };
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];

    for (let j = 0; j < answer.questions.length; j++) {
      const question = answer.questions[j];

      const firstRes = question.responses[0];

      result[firstRes.value]++;
    }
  }

  const total = _.sum(Object.values(result));
  const content = `
Yes: ${result[1]} (${((result[1] / total) * 100).toFixed(2)}%)
Partially: ${result[2]} (${((result[2] / total) * 100).toFixed(2)}%)
No: ${result[0]} (${((result[0] / total) * 100).toFixed(2)}%)
Total of comment: ${total}
		`;
  fs.writeFileSync("./report(rais2).txt", content, "utf-8");
}

// file2()
async function file2() {
  let result = {};
  const data = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/file2.csv");

  data.forEach(item => {
    if (!result[item[1]]) result[item[1]] = [];

    if (!result[item[1]].includes(item[7])) result[item[1]].push(item[7]);
  });

  console.log(result);
}

async function retry(promise, time) {
  let counter = 1;
  let status = false;
  let result;

  do {
    try {
      result = await promise;
      status = true;
    } catch (error) {
      result = error;
      counter++;

      await sleep(10 * 1000);
    }
  } while (!status && counter <= time);

  if (!status) throw result;

  return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
