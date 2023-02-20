import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import "../configs/mongoose.config";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import Models from "../models";
import { Promise } from "bluebird";
import _ from "lodash";

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

getAppSurvey();
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
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000 * 60);

    await page.goto(url, { waitUntil: "networkidle0" });

    const data = await page.evaluate(() => document.querySelector("html").outerHTML);

    await browser.close();

    return data;
  } catch (err) {
    console.error(err);
    return "";
  }
}
