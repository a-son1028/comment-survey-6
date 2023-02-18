import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../.env") });
import _ from "lodash";
import "../src/configs/mongoose.config";
import Models from "../src/models";
const csv = require("csvtojson");
var w2v = require("word2vec");
var w2vModel;
var w2vModelData = {};
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

main();
async function main() {
  // const comments = await Models.Comment.find({
  //   // perissionType: { $exists: false },
  //   // dataItemType: { $exists: false },
  //   // purposeType: { $exists: false },
  //   // thirdPartyType: { $exists: false }
  // });

  w2vModel = await new Promise((resolve, reject) => {
    w2v.loadModel(process.env.W2V_MODEL, function(error, model) {
      if (error) reject(error);

      resolve(model);
    });
  });

  // try {
  //   for (let comment of comments) {
  //     const [perissionType, dataItemType, purposeType, thirdPartyType] = await Promise.all([
  //       getPermissionType(comment.comment),
  //       getDataCollectionType(comment.comment),
  //       getPurposeType(comment.comment),
  //       getSharingType(comment.comment)
  //     ]);

  //     await Models.Comment.updateOne(
  //       {
  //         _id: comment.id
  //       },
  //       {
  //         perissionType,
  //         dataItemType,
  //         purposeType,
  //         thirdPartyType
  //       }
  //     );
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  await updateData();

  console.log("DONE");
}

async function updateData() {
  // w2vModel  = await new Promise((resolve, reject) => {
  // 	w2v.loadModel( process.env.W2V_MODEL, function( error, model ) {
  // 		if(error) reject(error)

  // 		resolve(model)
  // 	});
  // })
  const comments = await Models.Comment.find({
    _id: "6248747af878240dc03c2559",
    permissions: { $exists: false },
    dataTypes: { $exists: false },
    purposes: { $exists: false },
    thirdParties: { $exists: false }
  });

  for (let comment of comments) {
    const [permissions, dataTypes, purposes, thirdParties] = await Promise.all([
      getCommentPermission(comment.comment),
      getCommentDataType(comment.comment),
      getCommentPurpose(comment.comment),
      getCommentThirdParty(comment.comment)
    ]);

    console.log(
      "result",
      JSON.stringify({ permissions, dataTypes, purposes, thirdParties }, null, 2)
    );

    // await Models.Comment.updateOne(
    //   {
    //     _id: comment.id
    //   },
    //   {
    //     permissions,
    //     dataTypes,
    //     purposes,
    //     thirdParties
    //   }
    // );
  }
}
function getCommentPermission(comment) {
  const permissions = Object.keys(permissionTypes).filter(permission => {
    let similaPermission = getMostSimilarWords(permission);
    const hasPermission = findKeydsInText(similaPermission, comment).length;

    return !!hasPermission;
  });

  return permissions;
}

function getCommentPurpose(comment) {
  const result = PURPOSES.filter(permission => {
    let similaPermission = getMostSimilarWords(permission);
    const hasPermission = findKeydsInText(similaPermission, comment).length;

    return !!hasPermission;
  });

  return result;
}

function getCommentThirdParty(comment) {
  const result = THIRD_PARTIES.filter(permission => {
    let similaPermission = getMostSimilarWords(permission);
    const hasPermission = findKeydsInText(similaPermission, comment).length;

    return !!hasPermission;
  });

  return result;
}

function getCommentDataType(comment) {
  let result = {};
  Object.keys(dataCollectionTypes).forEach(dataTypeName => {
    const dataItem = dataCollectionTypes[dataTypeName];

    const dataItemSelected = dataItem.filter(item => {
      let simila = getMostSimilarWords(item);
      const isHas = findKeydsInText(simila, comment).length;
      return isHas;
    });

    if (dataItemSelected && dataItemSelected.length) {
      result[dataTypeName] = dataItemSelected;
    }
  });

  return result;
}

function getPermissionType(comment) {
  let hasPermissionType = "none";
  const similaSpecificPermission = Object.keys(permissionTypes).reduce((acc, permissionType) => {
    return [...acc, ...getMostSimilarWords(permissionType)];
  }, []);

  let similaPermission = getMostSimilarWords("permission");
  const hasPermission = findKeydsInText(similaPermission, comment).length;

  if (hasPermission) {
    const isSpecificPermission = findKeydsInText(similaSpecificPermission, comment).length;
    if (isSpecificPermission) {
      hasPermissionType = "specific";
    } else {
      hasPermissionType = "all";
    }
  }

  return hasPermissionType;
}

function getDataCollectionType(comment) {
  let hasType = "none";
  const similaSpecific = Object.keys(dataCollectionTypes).reduce((acc, type) => {
    return [...acc, ...getMostSimilarWords(type)];
  }, []);

  // let simila = getMostSimilarWords("collection");
  const keywords = ["collect", "gather", "obtain"];
  let simila = keywords.reduce((acc, keyword) => {
    acc = [...acc, ...getMostSimilarWords(keyword)];
    return acc;
  }, []);

  const hasSimila = findKeydsInText(simila, comment).length;

  if (hasSimila) {
    const isSpecific = findKeydsInText(similaSpecific, comment).length;
    if (isSpecific) {
      hasType = "specific";
    } else {
      hasType = "all";
    }
  }

  return hasType;
}

function getPurposeType(comment) {
  let hasType = "none";
  const similaSpecific = PURPOSES.reduce((acc, type) => {
    return [...acc, ...getMostSimilarWords(type)];
  }, []);

  let simila = getMostSimilarWords("purpose");
  const hasSimila = findKeydsInText(simila, comment).length;

  if (hasSimila) {
    const isSpecific = findKeydsInText(similaSpecific, comment).length;
    if (isSpecific) {
      hasType = "specific";
    } else {
      hasType = "all";
    }
  }

  return hasType;
}

function getSharingType(comment) {
  let hasType = "none";
  const similaSpecific = THIRD_PARTIES.reduce((acc, type) => {
    return [...acc, ...getMostSimilarWords(type)];
  }, []);

  const keywords = ["partner", "party", "parties", "third party"];
  let simila = keywords.reduce((acc, keyword) => {
    acc = [...acc, ...getMostSimilarWords(keyword)];
    return acc;
  }, []);
  const hasSimila = findKeydsInText(simila, comment).length;

  if (hasSimila) {
    const isSpecific = findKeydsInText(similaSpecific, comment).length;
    if (isSpecific) {
      hasType = "specific";
    } else {
      hasType = "all";
    }
  }

  return hasType;
}
function getMostSimilarWords(keyword) {
  let mostSimilarWords = [];
  if (w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword];
  else {
    mostSimilarWords = w2vModel.mostSimilar(keyword, 20) || [];
    w2vModelData[keyword] = mostSimilarWords;
  }

  mostSimilarWords = _.map(mostSimilarWords, "word").map(item => item.toLowerCase());

  return mostSimilarWords && mostSimilarWords.length ? mostSimilarWords : [keyword.toLowerCase()];
}
function findKeydsInText(keys, text) {
  text = text.toLowerCase();

  return keys.filter(key => text.includes(key.toLowerCase()));
}
