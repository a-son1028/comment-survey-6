import "../configs/mongoose.config";
import Models from "../models";
import csv from "csvtojson";
const path = require("path");
const _ = require("lodash");
import axios from "axios";
import fs from "fs";
import { truncate } from "lodash";

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

main();
async function main() {
  let DataItemLabel = await csv({
    noheader: truncate,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/DataItemLabel.csv");
  const DATA_TYPES = _.uniq(_.map(DataItemLabel, item => item[1]));
  const apps = await Models.App.find({
    categoryName: {
      $in: ["Health & Fitness", "Medical"]
    }
    // purposesHP: { $ne: [], $exists: true },
    // staticApis: { $ne: [], $exists: true }
  }).select("appName purposesHP thirdPartiesHP staticApis");
  // .limit(10);

  const THIRD_PARTIES = _.uniq(_.flatten(_.map(apps, "thirdPartiesHP")));
  const PURPOSES = _.uniq(_.flatten(_.map(apps, "purposesHP")));

  const questions = [];
  // type 1
  apps.forEach(app => {
    const { appName, staticApis, thirdPartiesHP, purposesHP } = app;
    const personalData = getPersionalDataByApis(staticApis, DataItemLabel);

    // type 1
    activities.forEach(activity => {
      personalData.forEach(personalItem => {
        questions.push({
          question: `You are ${activity}. Do you allow ${appName} app to access your ${personalItem}?`,
          type: "type1",
          params: [activity, app, personalItem]
        });
      });
    });

    // type 2
    activities.forEach(activity => {
      personalData.forEach(personalItem => {
        thirdPartiesHP.forEach(thirdParty => {
          questions.push({
            question: `You are ${activity}. Do you allow ${appName} app to share your ${personalItem} to ${thirdParty}?`,
            type: "type2",
            params: [activity, app, personalItem, thirdParty]
          });
        });
      });
    });

    // type 4
    personalData.forEach(personalItem => {
      purposesHP.forEach(purpose => {
        questions.push({
          question: `Do you want your ${personalItem} to be collected by ${appName} for ${purpose} purposes?`,
          type: "type4",
          params: [personalItem, app, purpose]
        });
      });
    });
  });

  // type 3
  activities.forEach(activity => {
    DATA_TYPES.forEach(personalItem => {
      people.forEach(person => {
        questions.push({
          question: `You are ${activity}. Do you want to share your ${personalItem} with ${person}?`,
          type: "type3",
          params: [activity, personalItem, person]
        });
      });
    });
  });

  // type 5
  THIRD_PARTIES.forEach(thirdParty => {
    DATA_TYPES.forEach(personalItem => {
      PURPOSES.forEach(purpose => {
        questions.push({
          question: `Do you want your ${personalItem} to be shared to ${thirdParty} for ${purpose} purposes?`,
          type: "type5",
          params: [personalItem, thirdParty, purpose]
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

function getPersionalDataByApis(apis, DataItemLabel) {
  const dataTypes = DataItemLabel.filter(item => apis.includes(item[2]));

  return _.uniq(_.map(dataTypes, item => item[1]));
}
