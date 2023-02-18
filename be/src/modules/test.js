import "../configs/mongoose.config";
import Models from "../models";
import fs from "fs";
const csv = require("csvtojson");
const _ = require("lodash");

// main();
async function main() {
  const [oldData, newData] = await Promise.all([
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Downloads/scholar-deployment_Castle-Crush_20221101-1055.csv"),
    csv({
      noheader: false,
      output: "csv"
    }).fromFile("/Users/tuanle/Downloads/scholar-deployment_Castle-Crush_20221107-1042.csv")
  ]);

  const oldMetaMask = _.map(oldData, item => item[5]);

  const newMetaMask = _.map(newData, item => item[5]);

  console.log(_.difference(newMetaMask, oldMetaMask));
}

main1();
async function main1() {
  const result = {
    personalDataTypes: {},
    privacyPolicy: 0,
    purposes: {},
    thirdParties: {},
    dynamicAPIs: {},
    dynamicFunctions: {}
  };
  const apps = await Models.App.find({
    categoryName: "Medical"
  });

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];

    const personalDataTypes = app.personalDataTypes;
    _.map(personalDataTypes, "name").forEach(item => {
      if (!result.personalDataTypes[item]) result.personalDataTypes[item] = 0;

      result.personalDataTypes[item]++;
    });

    if (app.contentPrivacyPolicy) {
      result.privacyPolicy++;
    }

    const app1 = await Models.App1.findOne({
      appName: app.appName
    });

    if (app1) {
      // purpose
      (app1.purposesHP || []).forEach(item => {
        if (!result.purposes[item]) result.purposes[item] = 0;
        result.purposes[item]++;
      });

      (app1.thirdPartiesHP || []).forEach(item => {
        if (!result.thirdParties[item]) result.thirdParties[item] = 0;
        result.thirdParties[item]++;
      });

      (app1.dynamicApis || []).forEach(item => {
        if (!result.dynamicAPIs[item]) result.dynamicAPIs[item] = 0;
        result.dynamicAPIs[item]++;
      });

      (app1.dynamicFunctions || []).forEach(item => {
        if (!result.dynamicFunctions[item]) result.dynamicFunctions[item] = 0;
        result.dynamicFunctions[item]++;
      });
    }
  }

  let textContent = `Total apps: ${apps.length}\n`;
  textContent += `* Personal data types \n`;
  Object.entries(result.personalDataTypes).map(([key, value]) => {
    textContent += `- ${key}: ${value} \n`;
  });
  textContent += "\n";

  textContent += `* Privacy policy: ${result.privacyPolicy}`;
  textContent += "\n";

  textContent += `* Purposes \n`;
  Object.entries(result.purposes).map(([key, value]) => {
    textContent += `- ${key}: ${value} \n`;
  });
  textContent += "\n";

  textContent += `* Third parties \n`;
  Object.entries(result.thirdParties).map(([key, value]) => {
    textContent += `- ${key}: ${value} \n`;
  });
  textContent += "\n";

  textContent += `* Dynamic APIs \n`;
  Object.entries(result.dynamicAPIs).map(([key, value]) => {
    textContent += `- ${key}: ${value} \n`;
  });
  textContent += "\n";

  textContent += `* Dynamic functions \n`;
  Object.entries(result.dynamicFunctions).map(([key, value]) => {
    textContent += `- ${key}: ${value} \n`;
  });
  textContent += "\n";

  console.log(textContent);
  console.log(result);

  fs.writeFileSync("./cate2.txt", textContent);
  console.log("DONE");
}
