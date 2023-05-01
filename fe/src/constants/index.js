export const PERMISSIONS = ["Calendar", "Connection", "Media", "Storage", "Telephony"];
export const THIRD_PARTIES = [
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
  "yyapi.net",
];
export const PURPOSES = [
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
  "Tracking",
];

export const DATA_TYPES = {
  Location: {
    "Approximate location": {
      desc: "Yours or your device's physical location to an area greater than or equal to 3 square kilometers, such as the city you are in.",
    },
    "Precise location": {
      desc: "Yours or your device's physical location within an area less than 3 square kilometers.",
    },
  },
  "Personal info": {
    Name: {
      desc: "How you refer to yourself, such as your first or last name, or nickname.",
    },
    "Email address": {
      desc: "Your email address.",
    },
    "User IDs": {
      desc: "Identifiers that relate to an identifiable person. For example, an account ID, account number, or account name.",
    },
    Address: {
      desc: "Your address, such as a mailing or home address.",
    },
    "Phone number": {
      desc: "Your phone number.",
    },
    "Race and ethnicity": {
      desc: "Information about your race or ethnicity.",
    },
    "Political or religious beliefs": {
      desc: "Information about your political or religious beliefs.",
    },
    "Sexual orientation": {
      desc: "Information about your sexual orientation.",
    },
    "Other info": {
      desc: "Any other personal information such as date of birth, gender identity, veteran status, etc.",
    },
  },
  "Financial info": {
    "User payment info": {
      desc: "Information about your financial accounts, such as credit card number.",
    },
    "Purchase history": {
      desc: "Information about purchases or transactions you have made.",
    },
    "Credit score": {
      desc: "Information about your credit. For example, your credit history or credit score.",
    },
    "Other financial info": {
      desc: "Any other financial information, such as your salary or debts.",
    },
  },
  "Health and fitness": {
    "Health info": {
      desc: "Information about your health, such as medical records or symptoms.",
    },
    "Fitness info": {
      desc: "Information about your fitness, such as exercise or other physical activity.",
    },
  },
  Messages: {
    Emails: {
      desc: "Your emails, including the email subject line, sender, recipients, and the content of the email.",
    },
    "SMS or MMS": {
      desc: "Your text messages, including the sender, recipients, and the content of the message.",
    },
    "Other in-app messages": {
      desc: "Any other types of messages. For example, instant messages or chat content.",
    },
  },
  "Photos and videos": {
    Photos: {
      desc: "Your photos.",
    },
    Videos: {
      desc: "Your videos.",
    },
  },
  "Audio files": {
    "Voice or sound recordings": {
      desc: "Your voice, such as a voicemail or a sound recording.",
    },
    "Music files": {
      desc: "Your music files.",
    },
    "Other audio files": {
      desc: "Any other audio files you created or provided.",
    },
  },
  "Files and docs": {
    "Files and docs": {
      desc: "Your files or documents, or information about your files or documents, such as file names.",
    },
  },
  Calendar: {
    "Calendar events": {
      desc: "Information from your calendar, such as events, event notes, and attendees.",
    },
  },
  Contacts: {
    Contacts: {
      desc: "Information about your contacts, such as contact names, message history, and social graph information like usernames, contact recency, contact frequency, interaction duration, and call history.",
    },
  },
  "App activity": {
    "App interactions": {
      desc: "Information about how you interact with the app. For example, the number of times you visit a page or sections you tap on.",
    },
    "In-app search history": {
      desc: "Information about what you have searched for in the app.",
    },
    "Installed apps": {
      desc: "Information about the apps installed on your device.",
    },
    "Other user-generated content": {
      desc: "Any other content you generated that is not listed here, or in any other section. For example, bios, notes, or open-ended responses.",
    },
    "Other actions": {
      desc: "Any other activity or actions in-app not listed here, such as gameplay, likes, and dialog options.",
    },
  },
  "Web browsing": {
    "Web browsing history": {
      desc: "Information about the websites you have visited.",
    },
  },
  "App info and performance": {
    "Crash logs": {
      desc: "Crash data from the app. For example, the number of times the app has crashed on the device or other information directly related to a crash.",
    },
    Diagnostics: {
      desc: "Information about the performance of the app on the device. For example, battery life, loading time, latency, framerate, or any technical diagnostics.",
    },
    "Other app performance data": {
      desc: "Any other app performance data not listed here",
    },
  },
  "Device or other IDs": {
    "Device or other IDs": {
      desc: "Identifiers that relate to an individual device, browser, or app. For example, an IMEI number, MAC address, Widevine Device ID, Firebase installation ID, or advertising identifier.",
    },
  },
};

export const DATA_PURPOSES = {
  "Account management": {
    desc: "Used for the setup or management of your account with the developer.",
    example: `For example, to let you:

    Create accounts, or add information to an account the developer provides for use across its services.
    Log in to the app, or verify your credentials.`,
  },
  "Advertising or marketing": {
    desc: "Used to display or target ads or marketing communications, or measuring ad performance.",
    example: `For example, displaying ads in your app, sending push notifications to promote other products or services, or sharing data with advertising partners.`,
  },
  "App functionality": {
    desc: "Used for features that are available in the app.",
    example: `For example, to enable app features, or authenticate you.`,
  },
  Analytics: {
    desc: "Used to collect data about how you use the app or how it performs.",
    example: `For example, to see how many users are using a particular feature, to monitor app health, to diagnose and fix bugs or crashes, or to make future performance improvements.`,
  },
  "Developer communications": {
    desc: "Used to send news or notifications about the app or the developer.",
    example: `For example, sending a push notification to inform you about new features of the app or an important security update.`,
  },
  "Fraud prevention, security, and compliance": {
    desc: "Used for fraud prevention, security, or compliance with laws.",
    example: `For example, monitoring failed login attempts to identify possible fraudulent activity.`,
  },
  Personalization: {
    desc: "Used to customize your app, such as showing recommended content or suggestions.",
    example: `For example, suggesting playlists based on your listening habits or delivering local news based on your location.`,
  },
};
export const QUESTION_NUM = 5;

export const TITLES_BY_STAGE = {
  training1: "Survey on the collection of personal data by the apps",
  testing1: "Survey on the collection of personal data by the apps",

  training2: "Survey on sharing of personal data by apps",
  testing2: "Survey on sharing of personal data by apps",

  training3: "Survey on sharing information for different objects in different contexts",
  testing3: "Survey on sharing information for different objects in different contexts",

  training4: "Survey on allowing data collection by different purposes",
  testing4: "Survey on allowing data collection by different purposes",

  training5: "Survey on allowing data sharing by different purposes",
  testing5: "Survey on allowing data sharing by different purposes",
};