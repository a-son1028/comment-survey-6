import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import "../configs/mongoose.config";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import Models from "../models";
import { Promise } from "bluebird";
import _ from "lodash";
import natural from "natural";

const csv = require("csvtojson");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const DATA_TYPES = {
  Location: {
    "Approximate location": {
      desc:
        "Yours or your device's physical location to an area greater than or equal to 3 square kilometers, such as the city you are in."
    },
    "Precise location": {
      desc: "Yours or your device's physical location within an area less than 3 square kilometers."
    }
  },
  "Personal info": {
    Name: {
      desc: "How you refer to yourself, such as your first or last name, or nickname."
    },
    "Email address": {
      desc: "Your email address."
    },
    "User IDs": {
      desc:
        "Identifiers that relate to an identifiable person. For example, an account ID, account number, or account name."
    },
    Address: {
      desc: "Your address, such as a mailing or home address."
    },
    "Phone number": {
      desc: "Your phone number."
    },
    "Race and ethnicity": {
      desc: "Information about your race or ethnicity."
    },
    "Political or religious beliefs": {
      desc: "Information about your political or religious beliefs."
    },
    "Sexual orientation": {
      desc: "Information about your sexual orientation."
    },
    "Other info": {
      desc:
        "Any other personal information such as date of birth, gender identity, veteran status, etc."
    }
  },
  "Financial info": {
    "User payment info": {
      desc: "Information about your financial accounts, such as credit card number."
    },
    "Purchase history": {
      desc: "Information about purchases or transactions you have made."
    },
    "Credit score": {
      desc: "Information about your credit. For example, your credit history or credit score."
    },
    "Other financial info": {
      desc: "Any other financial information, such as your salary or debts."
    }
  },
  "Health and fitness": {
    "Health info": {
      desc: "Information about your health, such as medical records or symptoms."
    },
    "Fitness info": {
      desc: "Information about your fitness, such as exercise or other physical activity."
    }
  },
  Messages: {
    Emails: {
      desc:
        "Your emails, including the email subject line, sender, recipients, and the content of the email."
    },
    "SMS or MMS": {
      desc: "Your text messages, including the sender, recipients, and the content of the message."
    },
    "Other in-app messages": {
      desc: "Any other types of messages. For example, instant messages or chat content."
    }
  },
  "Photos and videos": {
    Photos: {
      desc: "Your photos."
    },
    Videos: {
      desc: "Your videos."
    }
  },
  "Audio files": {
    "Voice or sound recordings": {
      desc: "Your voice, such as a voicemail or a sound recording."
    },
    "Music files": {
      desc: "Your music files."
    },
    "Other audio files": {
      desc: "Any other audio files you created or provided."
    }
  },
  "Files and docs": {
    "Files and docs": {
      desc:
        "Your files or documents, or information about your files or documents, such as file names."
    }
  },
  Calendar: {
    "Calendar events": {
      desc: "Information from your calendar, such as events, event notes, and attendees."
    }
  },
  Contacts: {
    Contacts: {
      desc:
        "Information about your contacts, such as contact names, message history, and social graph information like usernames, contact recency, contact frequency, interaction duration, and call history."
    }
  },
  "App activity": {
    "App interactions": {
      desc:
        "Information about how you interact with the app. For example, the number of times you visit a page or sections you tap on."
    },
    "In-app search history": {
      desc: "Information about what you have searched for in the app."
    },
    "Installed apps": {
      desc: "Information about the apps installed on your device."
    },
    "Other user-generated content": {
      desc:
        "Any other content you generated that is not listed here, or in any other section. For example, bios, notes, or open-ended responses."
    },
    "Other actions": {
      desc:
        "Any other activity or actions in-app not listed here, such as gameplay, likes, and dialog options."
    }
  },
  "Web browsing": {
    "Web browsing history": {
      desc: "Information about the websites you have visited."
    }
  },
  "App info and performance": {
    "Crash logs": {
      desc:
        "Crash data from the app. For example, the number of times the app has crashed on the device or other information directly related to a crash."
    },
    Diagnostics: {
      desc:
        "Information about the performance of the app on the device. For example, battery life, loading time, latency, framerate, or any technical diagnostics."
    },
    "Other app performance data": {
      desc: "Any other app performance data not listed here"
    }
  },
  "Device or other IDs": {
    "Device or other IDs": {
      desc:
        "Identifiers that relate to an individual device, browser, or app. For example, an IMEI number, MAC address, Widevine Device ID, Firebase installation ID, or advertising identifier."
    }
  }
};
const DATA_PURPOSES = {
  "Account management": {
    desc: "Used for the setup or management of your account with the developer.",
    example: `For example, to let you:

    Create accounts, or add information to an account the developer provides for use across its services.
    Log in to the app, or verify your credentials.`
  },
  "Advertising or marketing": {
    desc: "Used to display or target ads or marketing communications, or measuring ad performance.",
    example:
      "For example, displaying ads in your app, sending push notifications to promote other products or services, or sharing data with advertising partners."
  },
  "App functionality": {
    desc: "Used for features that are available in the app.",
    example: "For example, to enable app features, or authenticate you."
  },
  Analytics: {
    desc: "Used to collect data about how you use the app or how it performs.",
    example:
      "For example, to see how many users are using a particular feature, to monitor app health, to diagnose and fix bugs or crashes, or to make future performance improvements."
  },
  "Developer communications": {
    desc: "Used to send news or notifications about the app or the developer.",
    example:
      "For example, sending a push notification to inform you about new features of the app or an important security update."
  },
  "Fraud prevention, security, and compliance": {
    desc: "Used for fraud prevention, security, or compliance with laws.",
    example:
      "For example, monitoring failed login attempts to identify possible fraudulent activity."
  },
  Personalization: {
    desc: "Used to customize your app, such as showing recommended content or suggestions.",
    example:
      "For example, suggesting playlists based on your listening habits or delivering local news based on your location."
  }
};
const QUESTION3 = {
  "An app accesses the data only on your device and it is not sent off your device.": "",
  "Your data is sent off the device but only processed ephemerally.": "",
  "Your data is sent using end-to-end encryption.": "",
  "The apps may redirect you to a different service to complete a certain action.": ""
};
const QUESTION4 = {
  "The data is transferred to a third party based on a specific action that you initiate, where you reasonably expect the data to be shared":
    "",
  "The data transfer to a third party is prominently disclosed in the app, and the app requests your consent in a way that meets the requirements of Google Play’s User Data policy":
    "",
  "The data is transferred to a service provider to process it on the developer’s behalf": "",
  "The data is transferred for specific legal purposes": "",
  "The data transferred is fully anonymized so it can no longer be associated with any individual.":
    ""
};

updateHtmlPrivacyPolicy();
async function updateHtmlPrivacyPolicy() {
  let apps = [];

  do {
    apps = await Models.App.find({
      privacyLink: { $exists: true },
      isUpdatedHtmlPrivacyPolicy: { $exists: false }
    }).limit(500);

    await Promise.map(
      apps,
      async (app, i) => {
        console.log(`${i + 1}/${apps.length}`);
        const { privacyLink } = app;
        try {
          const html = await getContentFromUrl(privacyLink);

          await Models.App.updateOne(
            {
              _id: app.id
            },
            {
              isUpdatedHtmlPrivacyPolicy: true,
              htmlPrivacyPolicy: html
            }
          );
        } catch (error) {
          console.log(error.message);
        }
        return;
      },
      {
        concurrency: 3
      }
    );
  } while (apps.length);

  console.log("DONE");
}

// getParagraphs();
async function getParagraphs() {
  const apps = await Models.App.find({
    htmlPrivacyPolicy: { $ne: "" },
    isUpdatedHtmlPrivacyPolicy: true
  }).limit(1);

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const { htmlPrivacyPolicy, privacyLink } = app;
    const $ = await cheerio.load(htmlPrivacyPolicy);

    $("p").each((index, element) => {
      const $element = $(element);
      const pTagContent = $element.text();
      console.log(pTagContent);
      const $nextElement = $element.next();
      const $nextParentElement = $element.parent().next();
      if ($nextElement.is("ul")) {
        const ulTagContent = $nextElement.html();
        console.log(ulTagContent);
      }
    });
  }
  console.log("DONE");
}

// checkSententIncludeSecurity("le thanh tuan security privacy");
async function checkSententIncludeSecurity(sentent) {
  const keywords = [
    "security",
    "privacy",
    "keyword",
    "privaci",
    "person",
    "secur",
    "collect",
    "protect",
    "parti",
    "third",
    "access",
    "cooki",
    "share",
    "purpos",
    "identifi",
    "address",
    "store",
    "email",
    "advertis",
    "locat",
    "permiss",
    "confidenti",
    "safeti",
    "sell",
    "purchas",
    "password",
    "identif",
    "encrypt",
    "policyprivaci",
    "policyi",
    "securityi",
    "privat",
    "defend",
    "securityw",
    "policythi"
  ];
  const stemmer = natural.PorterStemmer;
  const sententStem = stemmer.stem(sentent);

  return keywords.some(keyword => sententStem.includes(keyword));
}
// main();
async function main() {
  console.log(1);

  const apps = await Models.App.find({
    // categoryName: {
    //   $in: ["Social", "Dating", "Communication"]
    // },
    // appIdCHPlay: { $exists: true },
    // appInfo: { $exists: false }
    appInfo: { $exists: true },
    isUpdatedInfo: { $exists: false }
  });
  // .limit(1000);
  // console.log(apps.length)
  await Promise.map(
    apps,
    async (app, i) => {
      console.log(`${i}/${apps.length}`);
      const dataSafety = await getDataSafety(
        `https://play.google.com/store/apps/datasafety?id=${app.appIdCHPlay}`
      );

      const appInfo = await getAppInfo(
        `https://play.google.com/store/apps/details?id=${app.appIdCHPlay}`
      );

      await Models.App.updateOne(
        {
          _id: app.id
        },
        {
          isUpdatedInfo: true,
          appInfo: {
            ...appInfo,
            dataSafety
          }
        }
      );

      return;
    },
    {
      concurrency: 6
    }
  );
  for (let i = 0; i < apps.length; i++) {}

  console.log("DONE");
}
// getStat1();
async function getStat1() {
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
      id: "isCompleted",
      title: "Completed"
    },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "time",
      title: "Time"
    },
    {
      id: "question1",
      title:
        "1. Is the app's description mentioning its personal data collection and sharing behaviors?"
    },
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);
        const key = `${dataCollectionName}+${dataTypeName}`;
        acc.push({
          id: key,
          title: `2. ${title} -> ${item}`
        });
      });

      return acc;
    }, []),
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);

        Object.keys(DATA_PURPOSES).forEach(purposeName => {
          const key = `${dataCollectionName}+${dataTypeName}+${_.kebabCase(purposeName)}`;

          acc.push({
            id: key,
            title: `3. ${title} -> ${item} -> ${purposeName}`
          });
        });
      });

      return acc;
    }, []),
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);
        const key = `question4${dataCollectionName}+${dataTypeName}`;
        acc.push({
          id: key,
          title: `4. ${title} -> ${item}`
        });
      });

      return acc;
    }, []),
    ...Object.entries(DATA_TYPES).reduce((acc, [title, items]) => {
      const dataCollectionName = _.kebabCase(title);

      Object.keys(items).forEach(item => {
        const dataTypeName = _.kebabCase(item);

        Object.keys(DATA_PURPOSES).forEach(purposeName => {
          const key = `question5${dataCollectionName}+${dataTypeName}+${_.kebabCase(purposeName)}`;

          acc.push({
            id: key,
            title: `5. ${title} -> ${item} -> ${purposeName}`
          });
        });
      });

      return acc;
    }, [])
  ];
  // console.log(header)
  const rows = [];
  const answers = await Models.Answer.find({
    // questions: { $size: 5 }
  });
  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/CSVReport_17bc748481c2_B_Page#1_With_PageSize#5000.csv");

  const getNecessaryByValue = value => {
    switch (value) {
      case 1:
        return "Very unnecessary";
      case 2:
        return "Unnecessary";
      case 3:
        return "Neutral";
      case 4:
        return "Necessary";
      case 5:
        return "Very necessary";
    }
  };
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    let row = {};
    const user = await Models.User.findById(answer.userId);
    const resultInMicro = dataFromMicro.find(
      item => item[2].toLowerCase().trim() === user.email.toLowerCase().trim()
    );

    (answer.questions || []).forEach(({ responses }) => {
      const { question1, question2, question3, question4, question5 } = responses;

      if (question1) {
        row["question1"] = `${question1.value === 1 ? "Yes" : "No"} ${
          question1.value === 1 ? `- ${question1.explain}` : ""
        }`;
      }

      // 2
      if (question2) {
        Object.entries(question2).forEach(([key, { value, explain }]) => {
          row[key] = getNecessaryByValue(value);
        });
      }

      // 3
      if (question3) {
        Object.entries(question3).forEach(([key, { value, explain }]) => {
          row[key] = getNecessaryByValue(value);
        });
      }

      // 4
      if (question4) {
        Object.entries(question4).forEach(([key, { value, explain }]) => {
          row[`question4${key}`] = getNecessaryByValue(value);
        });
      }

      // 5
      if (question5) {
        Object.entries(question5).forEach(([key, { value, explain }]) => {
          row[`question5${key}`] = getNecessaryByValue(value);
        });
      }
    });

    rows.push({
      stt: i + 1,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      isCompleted: (answer.questions || []).length === 5 ? "x" : "",
      comment: answer.comment,
      time: resultInMicro ? resultInMicro[1] : "",
      ...row
    });
  }

  const csvWriter = createCsvWriter({
    path: "./question-stats.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
}
// getStat();
async function getStat() {
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
    ...Object.keys(DATA_TYPES).map((title, i) => ({
      id: `question1${i + 1}`,
      title: `1. ${title}`
    })),
    ...Object.keys(DATA_PURPOSES).map((title, i) => ({
      id: `question2${i + 1}`,
      title: `2. ${title}`
    })),
    ...Object.keys(QUESTION3).map((title, i) => ({
      id: `question3${i + 1}`,
      title: `3. ${title}`
    })),
    ...Object.keys(QUESTION4).map((title, i) => ({
      id: `question4${i + 1}`,
      title: `4. ${title}`
    }))
  ];

  let rows = [];
  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/CSVReport_17bc748481c2_B_Page#1_With_PageSize#5000.csv");
  const answers = await Models.Answer.find({
    // questions: { $size: 5 }
  });

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);
    const resultInMicro = dataFromMicro.find(
      item => item[2].toLowerCase().trim() === user.email.toLowerCase().trim()
    );

    let row = {};
    // 1
    Object.entries(answer.survey.question1).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    // 2
    Object.entries(answer.survey.question2).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    // 3
    Object.entries(answer.survey.question3).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    // 4
    Object.entries(answer.survey.question4).map(([key, { value, explain }], i) => {
      row[key] = `${value === 1 ? "Yes" : value === 0 ? "No" : "Maybe"} - ${explain}`;
    });

    rows.push({
      stt: i + 1,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      ...row
    });
  }

  const csvWriter = createCsvWriter({
    path: "./survey-stats.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
}
// getAppSurvey();
async function getAppSurvey() {
  const apps = await Models.App.find({
    appInfo: { $exists: true },
    "appInfo.dataSafety.sections": { $exists: true, $ne: [] }
  });

  const appSurveys = _.chunk(apps, 5);

  await Models.AppSurvey.deleteMany();

  await Promise.map(appSurveys, async apps => {
    if (apps.length < 5) return;
    return Models.AppSurvey.create({
      apps: apps.map((app, stt) => ({ stt: stt + 1, appId: app.id }))
    });
  });

  console.log("DONE");
}
async function getAppInfo(url) {
  const html = await getContentFromUrl(url);
  const $cheerio = await cheerio.load(html);

  const desc = $cheerio(".bARER[data-g-id='description']").html();
  const contacts = [];
  $cheerio("#developer-contacts .VfPpkd-WsjYwc").each(function(i, elem) {
    const title = $cheerio(this)
      .find(".pZ8Djf .xFVDSb")
      .text();

    const content = $cheerio(this)
      .find(".pZ8Djf .pSEeg")
      .text();

    contacts.push({
      title,
      content
    });
  });

  return {
    desc,
    contacts
  };
}
async function getDataSafety(url) {
  const html = await getContentFromUrl(url);
  const $cheerio = await cheerio.load(html);

  const desc = $cheerio(".RGUlu").html();

  let result = {
    desc,
    sections: []
  };
  $cheerio(".Mf2Txd").each(function(i, elem) {
    const $section = $cheerio(this);
    const title = $section.find(".q1rIdc").text();
    const content = $section.find(".ivTO9c").text();
    const icon = $section.find("img").attr("src");

    const section = {
      title,
      content,
      icon,
      children: []
    };

    const $children = $section.find(".XgPdwe div[jscontroller='ojPjfd']");

    if ($children.length) {
      $children.each(function(i, elem) {
        const $item = $cheerio(this);

        const title = $item.find(".aFEzEb").text();
        const content = $item.find(".fozKzd").text();
        const icon = $item.find("img").attr("src");

        // console.log(" +", title);
        const $purposeTitles = $item.find(".pcmFvf");
        const $purposeContents = $item.find(".FnWDne");

        const purposes = [];
        $purposeTitles.each(function(i, elem) {
          const $purposeTitle = $cheerio(this);

          purposes.push({
            title: $purposeTitle.find(".qcuwR").text(),
            isOptional: $purposeTitle.text().includes("Optional"),
            content: $purposeContents.eq(i).text()
          });
        });

        section.children.push({
          title,
          content,
          icon,
          purposes
        });
      });
    } else {
      $section.find(".XgPdwe .Vwijed").each(function(i, elem) {
        const $item = $cheerio(this);

        const title = $item.find(".aFEzEb").text();
        const content = $item.find(".fozKzd").text();

        section.children.push({
          title,
          content,
          purposes: []
        });
      });
    }

    result.sections.push(section);
  });

  return result;
}
async function getContentFromUrl(url) {
  try {
    const browser = await puppeteer.launch({
      // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      executablePath: "/usr/bin/chromium-browser"
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000 * 5);

    await page.goto(url, { waitUntil: "networkidle0" });

    const data = await page.evaluate(() => document.querySelector("html").outerHTML);

    await browser.close();

    return data;
  } catch (err) {
    throw err;
    // console.error(err);
    // return "";
  }
}
