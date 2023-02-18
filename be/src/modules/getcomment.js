const gplay = require("google-play-scraper");
const path = require("path");
const _ = require("lodash");
const fs = require("fs");
const { Promise } = require("bluebird");
import natural from "natural";
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();
const csv = require("csvtojson");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

require("dotenv").config({ path: path.join(__dirname, "../../.env") });
require("../configs/mongoose.config");

const Models = require("../models");
import Services from "../services";

main();
async function main() {
  await Promise.all([
    // getAppId(),
    // getCommentFromCHplay()
    // step2(),
    updatePredict()
  ]);

  // await getTranningSet();
  // await getTestingSet();

  // const result = await Promise.all([
  //   Models.default.Comment.count({
  //     isRelatedRail3: true
  //   }),
  //   Models.default.Comment.count({
  //     scores: { $exists: true }
  //   })
  // ]);

  // console.log(1, result);
  console.log("DONE");
}

async function updatePredict() {
  let comments = [];
  const apps = await Models.default.App.find({
    needRunBert: true
  });

  do {
    comments = await Models.default.Comment.aggregate([
      {
        $match: {
          appId: {
            $in: _.map(apps, "_id")
          },
          isRelatedRail3: true,
          scores: { $exists: false }
        }
      },
      { $sample: { size: 100000 } },
      { $project: { comment: 1 } }
    ]).allowDiskUse(true);

    await Promise.map(
      comments,
      async comment => {
        let predictionRes = await Services.PredictionLabel.getPredictLabel([
          {
            id: 1,
            text: comment.comment
          }
        ]);

        const scores = predictionRes?.[0].scores;

        if (_.isEmpty(scores)) return;

        await Models.default.Comment.updateOne(
          {
            _id: comment._id
          },
          {
            scores
          }
        );
        return;
      },
      { concurrency: 5 }
    );
  } while (comments.length);
}

async function getAppId() {
  const apps = await Models.default.App.find({
    $or: [
      {
        appIdCHPlay: { $exists: false }
      },
      { appIdCHPlay: null },
      { appIdCHPlay: "" }
    ]
  }).select("appName appIdCHPlay");

  await Promise.map(
    apps,
    async app => {
      try {
        const [appCHPLAY] = await gplay.search({
          term: app.appName,
          num: 1
        });

        await Models.default.App.updateOne(
          {
            _id: app.id
          },
          {
            appIdCHPlay: appCHPLAY.appId
          }
        );
      } catch (err) {
        console.log(err.message);
      }

      return;
    },
    { concurrency: 1 }
  );
}
var stt = 0;
async function getCommentFromCHplay() {
  let apps = [];
  do {
    global.gc();

    apps = await Models.default.App.aggregate([
      {
        $match: {
          appIdCHPlay: { $exists: true },
          isGotCommentV2: { $exists: false }
        }
      },
      { $sample: { size: 4 } },
      { $project: { appIdCHPlay: 1 } }
    ]);

    await Promise.map(apps, updateApp, {
      concurrency: 4
    });
  } while (apps.length);

  console.log("DONE getCommentFromCHplay");
}

async function updateApp(app) {
  console.log(++stt, app._id);
  try {
    let comments = [];

    let commentChunk = {};
    const limit = 3000;
    do {
      commentChunk = await gplay.reviews({
        appId: app.appIdCHPlay,
        sort: gplay.sort.RATING,
        num: limit,
        paginate: true,
        nextPaginationToken: commentChunk.nextPaginationToken || null
      });

      comments = [
        ...comments,
        ...(commentChunk.data || []).map(item => ({
          ...item,
          appId: app._id,
          comment: item.text,
          rating: item.scoreText
        }))
      ];
    } while (commentChunk.nextPaginationToken);

    await Models.default.Comment.insertMany(comments);

    await Models.default.App.updateOne(
      {
        _id: app._id
      },
      {
        isGotCommentV2: true
      }
    );
  } catch (error) {
    console.log(error);
  }
  return;
}

// get related
async function step2() {
  // await Models.default.Comment.deleteMany({ comment: null });

  let comments = [];
  do {
    comments = await Models.default.Comment.aggregate([
      {
        $match: {
          isRelatedRail3: { $exists: false }
        }
      },
      { $sample: { size: 5000000 } },
      { $project: { comment: 1 } }
    ]).allowDiskUse(true);

    await Promise.map(
      comments,
      comment => {
        if (!comment.comment) return;
        const result = getRelatedForStep2(comment.comment);

        return Models.default.Comment.updateOne(
          {
            _id: comment._id
          },
          {
            ...result
          }
        );
      },
      {
        concurrency: 500
      }
    );
  } while (comments.length);

  console.log("DONE step2");
}

function getKeywordsStem() {
  const keywords = [
    "Privacy",
    "Secure",
    "Personal",
    "Malicious",
    "Phishing",
    "Steal",
    "Security",
    "Permission",
    "Virus",
    "Access",
    "Fishing",
    "Thief",
    "Safe",
    "Identity",
    "Malware",
    "Fishy",
    "Stealth",
    "Creepy",
    "collect data",
    "share data",
    "location",
    "privacy policy",
    "third party",
    "other part",
    "3rd part"
  ];

  let stems;
  function _getKeywordsStem() {
    if (stems) return stems;

    return (stems = keywords.map(item =>
      item
        .split(" ")
        .map(stemmer.stem)
        .join(" ")
    ));
  }

  return _getKeywordsStem();
}

function getRelatedForStep2(comment) {
  const commentStem = tokenizer
    .tokenize(comment)
    .filter(item => !!item)
    .map(stemmer.stem)
    .join(" ");

  const keywordStem = getKeywordsStem();
  const isRelatedRail3 = keywordStem.some(item => {
    if (commentStem.includes(item)) {
      console.log(item);
      return true;
    }
  });

  return {
    isRelatedRail3
  };
}

async function getTranningSet() {
  let dataCSVSP = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/SP_TRAINING.csv");

  let dataCSVPermission = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/PERMISSION_TRAINING.csv");

  let dataCSVCollection = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/DATA_COLLECTION_TRAINING.csv");

  let dataCSVSharing = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/DATA_SHARING_TRAINING.csv");

  let combinedFiles = [];

  dataCSVSP.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = combinedFiles.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      combinedFiles.push({
        comment: comment.trim(),
        SPLabel: label === "Y" ? 1 : 0,
        permissionLabel: 0,
        dataCollectionLabel: 0,
        dataSharingLabel: 0
      });
    } else {
      combinedFiles.push({
        comment: comment.trim(),
        SPLabel: label === "Y" ? 1 : 0,
        permissionLabel: 0,
        dataCollectionLabel: 0,
        dataSharingLabel: 0
      });
    }
  });

  dataCSVPermission.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = combinedFiles.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      combinedFiles[rowIndex] = {
        ...combinedFiles[rowIndex],
        permissionLabel: label === "Y" ? 1 : 0
      };
    } else {
      combinedFiles.push({
        comment: comment.trim(),
        permissionLabel: label === "Y" ? 1 : 0
      });
    }
  });

  dataCSVCollection.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = combinedFiles.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      combinedFiles[rowIndex] = {
        ...combinedFiles[rowIndex],
        dataCollectionLabel: label === "Y" ? 1 : 0
      };
    } else {
      combinedFiles.push({
        comment: comment.trim(),
        dataCollectionLabel: label === "Y" ? 1 : 0
      });
    }
  });

  dataCSVSharing.forEach(item => {
    const [, comment, label] = item;

    const rowIndex = combinedFiles.findIndex(item => item.comment === comment.trim());

    if (~rowIndex) {
      combinedFiles[rowIndex] = {
        ...combinedFiles[rowIndex],
        dataSharingLabel: label === "Y" ? 1 : 0
      };
    } else {
      combinedFiles.push({
        comment: comment.trim(),
        dataSharingLabel: label === "Y" ? 1 : 0
      });
    }
  });

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
      id: "SPLabel",
      title: "SPLabel"
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
    },
    {
      id: "temp2",
      title: "temp2"
    }
  ];

  const training = combinedFiles.map((item, index) => {
    return {
      ...item,
      id: index + 1,
      comment_text: item.comment,
      temp1: 0,
      temp2: 0
    };
  });

  const csvWriter = createCsvWriter({
    path: "./training.csv",
    header
  });
  csvWriter.writeRecords(training);
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
  const comments = await Models.default.Comment.find({
    isRelatedRail3: true
  });

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
