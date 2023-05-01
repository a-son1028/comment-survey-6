import csv from "csvtojson";
import _ from "lodash";
import fs from "fs";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

import Services from "../services";

main();

async function main() {
  await getTranningData();

  await getEMAccuracy();

  console.log("DONE");
}
async function getTranningData() {
  const [[, ...Y_VariablesData], Marco, Meso_factors, Mico] = await Promise.all([
    await csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/Y_Variables_1.csv"),
    await csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/individual/abc/comment-survey-5/be/pre-process-Marco.csv"),
    await csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/Meso_factors.csv"),
    await csv({
      noheader: true,
      output: "csv"
    }).fromFile("/Users/a1234/Downloads/Mico_1.csv")
  ]);
  const headerFile = [
    {
      id: "case",
      title: "PassengerId"
    },
    {
      id: "in-relation",
      title: "Survived"
    }
  ];
  const rowsFile = [];

  const functionMergeFile = data => {
    const [header, ...rows] = data;
    rows.forEach(row => {
      let newRow = {};
      let caseId;
      row.forEach((value, index) => {
        const headerName = header[index];
        if (headerName.toLowerCase() === "case") {
          caseId = value;
        }
        const isExistedHeader = headerFile.some(item => item.title === headerName);
        if (!isExistedHeader && headerName.toLowerCase() !== "case") {
          headerFile.push({
            id: _.kebabCase(headerName),
            title: headerName
          });
        }

        newRow[_.kebabCase(headerName)] = value;
      });

      if (caseId) {
        const Y_VariablesDataRow = Y_VariablesData.find(row => row[0] === caseId);

        const label = Y_VariablesDataRow[6];
        newRow["in-relation"] = label;
      }
      rowsFile.push(newRow);
    });
  };

  functionMergeFile(Marco);
  //   functionMergeFile(Meso_factors);
  //   functionMergeFile(Mico);

  const trainingRows = rowsFile.splice(0, Math.round(rowsFile.length * 0.8));
  const testingRows = rowsFile;

  const traningValue = trainingRows.map(Object.values);
  const testingValue = testingRows.map(Object.values).map(item => {
    item[item.length - 1] = "-1";
    return item;
  });

  const result = await Services.Prediction.getPredictGradientBoostingRegressor({
    train: traningValue,
    test: testingValue
  });

  const realLabels = testingRows.map(Object.values).map(item => item[item.length - 1]);
  //   console.log(realLabels);

  let newRows = [];
  const newHeader = [
    {
      id: "predict",
      title: "predict"
    },
    {
      id: "real",
      title: "real"
    }
  ];
  result.forEach((item, index) => {
    newRows.push({
      predict: item[0] == "0" ? "0" : "1",
      real: realLabels[index]
    });
  });

  const csvWriter = createCsvWriter({
    path: "./result-Marco.csv",
    header: newHeader
  });
  csvWriter.writeRecords(newRows);
  //     const csvWriter1 = createCsvWriter({
  //       path: "./training-Marco.csv",
  //       header: headerFile
  //     });
  //   csvWriter1.writeRecords(trainingRows);

  //   const csvWriter2 = createCsvWriter({
  //     path: "./testing-Marco.csv",
  //     header: headerFile
  //   });
  //   csvWriter2.writeRecords(testingRows);

  //   console.log(_.uniq(_.map(trainingRows, "shooter-first-name")).length);
  //   fs.writeFileSync("./header-Marco.txt", JSON.stringify(_.map(headerFile, "title")));
}
async function getEMAccuracy() {
  const testResult = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("./result-Marco.csv");

  let X = 0,
    Y = 0,
    Z = 0,
    W = 0;
  testResult.forEach((item, index) => {
    if (index !== 0 && testResult[index]) {
      const predictLabel = Number(item[0]);
      const label = Number(item[1]);

      if (predictLabel === 0 && label === 0) X++;
      else if (predictLabel === 1 && label === 0) Y++;
      else if (predictLabel === 0 && label === 1) Z++;
      else if (predictLabel === 1 && label === 1) W++;
    }
  });

  const PrecisionBenign = X / (X + Z);
  const RecallBenign = X / (X + Y);
  const F1Benign = (2 * (PrecisionBenign * RecallBenign)) / (PrecisionBenign + RecallBenign);

  const Accuracy = (X + W) / (X + Y + Z + W);

  const headerAccuracy = [
    {
      id: "name",
      title: ""
    },
    {
      id: "begin",
      title: ""
    }
  ];

  const rowsAccuracy = [
    {
      name: "Percision",
      begin: PrecisionBenign
    },
    {
      name: "Recall",
      begin: RecallBenign
    },
    {
      name: "F1",
      begin: F1Benign
    },
    {
      name: "Accuracy",
      begin: Accuracy
    }
  ];

  const csvWriterAccuracy = createCsvWriter({
    path: "Marco-Accuracy.csv",
    header: headerAccuracy
  });
  await csvWriterAccuracy.writeRecords(rowsAccuracy);

  console.log("DONE");
}
