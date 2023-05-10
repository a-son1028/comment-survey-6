import "../configs/mongoose.config";
import Models from "../models";
import csv from "csvtojson";
const path = require("path");
const _ = require("lodash");
import axios from "axios";
import fs from "fs";
import { truncate } from "lodash";
import { execSync } from "child_process";
const isEnglish = require("is-english");

const activities = [
  "playing sport",
  "relaxing",
  "doing daily activities",
  "at home",
  "at work",
  "having treatment at home",
  "at the hospital",
  "under an emergency"
];
const people = [
  "friends",
  "family memebers",
  "doctors",
  "nurses",
  "Personal training",
  "Colleague"
];

const DATA_TYPE_ITEMS = {
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
  ]
};
const DATA_TYPES = ["Connection", "Hardware", "Fitness", "Location", "Media", "Telephony", "Info"];
// 8 * 6 * 8;

function getDataTypeItem(dataType) {
  const data = DATA_TYPE_ITEMS[dataType];
  const result = [];
  for (let i = 0; i < 2; i++) {
    const item1 = data[i];

    for (let j = 1; j < 3; j++) {
      const item2 = data[j];

      for (let k = 2; k < 4; k++) {
        const item3 = data[k];

        result.push([item1, item2, item3]);
      }
    }
  }

  return result;
}
main();
async function main() {
  // await createQuestions();

  await createSurvey();
  console.log("DONE");
}
async function createQuestions() {
  await Models.Question.deleteMany({});

  let DataItemLabel = await csv({
    noheader: truncate,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/DataItemLabel.csv");

  const apps = await Models.App.find({
    categoryName: {
      $in: ["Health & Fitness", "Medical"]
    }
    // purposesHP: { $ne: [], $exists: true },
    // staticApis: { $ne: [], $exists: true }
  }).select("appName purposesHP thirdPartiesHP staticApis description categoryName");
  // .limit(1000);

  const THIRD_PARTIES = _.uniq(_.flatten(_.map(apps, "thirdPartiesHP")));
  const PURPOSES = _.uniq(_.flatten(_.map(apps, "purposesHP")));

  const questions = [];
  // type 1
  apps.forEach(app => {
    const { appName, staticApis = [], thirdPartiesHP = [], purposesHP = [] } = app;
    const personalData = getPersionalDataByApis(staticApis, DataItemLabel);
    if (isEnglish(appName)) {
      // type 1
      activities.forEach(activity => {
        personalData.forEach(personalItem => {
          const dataTypeChunkItem = getDataTypeItem(personalItem);
          dataTypeChunkItem.forEach(childPersonalItems => {
            questions.push({
              question: `You are ${activity}. Do you allow ${appName} app to access your ${personalItem}?`,
              type: "type1",
              params: [activity, app, personalItem, childPersonalItems]
            });
          });
        });
      });

      // type 2
      activities.forEach(activity => {
        personalData.forEach(personalItem => {
          thirdPartiesHP.forEach(thirdParty => {
            const dataTypeChunkItem = getDataTypeItem(personalItem);
            dataTypeChunkItem.forEach(childPersonalItems => {
              questions.push({
                question: `You are ${activity}. Do you allow ${appName} app to share your ${personalItem} to ${thirdParty}?`,
                type: "type2",
                params: [activity, app, personalItem, thirdParty, childPersonalItems]
              });
            });
          });
        });
      });

      // type 4
      personalData.forEach(personalItem => {
        purposesHP.forEach(purpose => {
          const dataTypeChunkItem = getDataTypeItem(personalItem);

          dataTypeChunkItem.forEach(childPersonalItems => {
            questions.push({
              question: `Do you want your ${personalItem} to be collected by ${appName} for ${purpose} purposes?`,
              type: "type4",
              params: [personalItem, app, purpose, childPersonalItems]
            });
          });
        });
      });
    }
  });

  // type 3
  activities.forEach(activity => {
    DATA_TYPES.forEach(personalItem => {
      people.forEach(person => {
        const dataTypeChunkItem = getDataTypeItem(personalItem);

        dataTypeChunkItem.forEach(childPersonalItems => {
          questions.push({
            question: `You are ${activity}. Do you want to share your ${personalItem} with ${person}?`,
            type: "type3",
            params: [activity, personalItem, person, childPersonalItems]
          });
        });
      });
    });
  });

  // type 5
  THIRD_PARTIES.forEach(thirdParty => {
    DATA_TYPES.forEach(personalItem => {
      PURPOSES.forEach(purpose => {
        const dataTypeChunkItem = getDataTypeItem(personalItem);

        dataTypeChunkItem.forEach(childPersonalItems => {
          questions.push({
            question: `Do you want your ${personalItem} to be shared to ${thirdParty} for ${purpose} purposes?`,
            type: "type5",
            params: [personalItem, thirdParty, purpose, childPersonalItems]
          });
        });
      });
    });
  });

  //
  // console.log(questions.length);
  console.log(`type1: ${questions.filter(item => item.type === "type1").length}`);
  console.log(`type2: ${questions.filter(item => item.type === "type2").length}`);
  console.log(`type3: ${questions.filter(item => item.type === "type3").length}`);
  console.log(`type4: ${questions.filter(item => item.type === "type4").length}`);
  console.log(`type5: ${questions.filter(item => item.type === "type5").length}`);
  await Models.Question.insertMany(questions);
}

async function createSurvey() {
  // await Models.AppSurvey.deleteMany({});

  let questions = await Models.Question.find();
  questions = _.sampleSize(questions, questions.length);

  const questionsT1 = questions.filter(item => item.type === "type1");
  const questionsT2 = questions.filter(item => item.type === "type2");
  const questionsT3 = questions.filter(item => item.type === "type3");
  const questionsT4 = questions.filter(item => item.type === "type4");
  const questionsT5 = questions.filter(item => item.type === "type5");

  do {
    const questionsT1Chunk = questionsT1.splice(0, 16).map(item => item._id);
    const questionsT2Chunk = questionsT2.splice(0, 16).map(item => item._id);
    const questionsT3Chunk = questionsT3.splice(0, 16).map(item => item._id);
    const questionsT4Chunk = questionsT4.splice(0, 16).map(item => item._id);
    const questionsT5Chunk = questionsT5.splice(0, 16).map(item => item._id);

    await Models.AppSurvey.create({
      type1: questionsT1Chunk,
      type2: questionsT2Chunk,
      type3: questionsT3Chunk,
      type4: questionsT4Chunk,
      type5: questionsT5Chunk,
      questionIds: [
        ...questionsT1Chunk,
        ...questionsT2Chunk,
        ...questionsT3Chunk,
        ...questionsT4Chunk,
        ...questionsT5Chunk
      ]
    });
  } while (
    questionsT1.length >= 16 &&
    questionsT2.length >= 16 &&
    questionsT3.length >= 16 &&
    questionsT4.length >= 16 &&
    questionsT5.length >= 16
  );
}
function getPersionalDataByApis(apis, DataItemLabel) {
  const dataTypes = DataItemLabel.filter(item => apis.includes(item[2]));

  return _.uniq(_.map(dataTypes, item => item[1]));
}
