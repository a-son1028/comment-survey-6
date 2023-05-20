import "../configs/mongoose.config";
import Models from "../models";
import csv from "csvtojson";
import _, { isObject } from "lodash";
import fs from "fs";
import { ObjectID } from "mongodb";
import * as constants from "../utils/constants";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

import Services from "../services";
import { Promise } from "bluebird";

main();

async function main() {
  // await getTranningData();
  // await getEMAccuracy();

  await Promise.all([
    generateAccuracyReports(),
    generateSatisfiedReports(),
    generateFinalQuestionReports(),
    getParticipantFeedback(),
    partipantInfos(),
    participantCharacteristic()
  ]);

  console.log("DONE");
}

async function participantCharacteristic() {
  const users = await Models.User.find();

  const userGroupByCountries = _.groupBy(users, "country");
  const userGroupByAges = _.groupBy(users, "age");
  const userGroupByGenders = _.groupBy(users, "gender");
  const userGroupByFieldOfWorkTypes = _.groupBy(users, "fieldOfWorkType");

  let content = `* Nationality: (${users.length})\n`;
  Object.entries(userGroupByCountries).forEach(([country, usersByCounty]) => {
    content += `  - ${country}: ${usersByCounty.length}(${(usersByCounty.length / users.length) *
      100}%) \n`;
  });
  content += "\n";

  content += `* Age: (${users.length})\n`;
  Object.entries(userGroupByAges).forEach(([age, usersByAge]) => {
    content += `  - ${age}: ${usersByAge.length}(${(usersByAge.length / users.length) * 100}%) \n`;
  });
  content += "\n";

  content += `* Gender: (${users.length})\n`;
  Object.entries(userGroupByGenders).forEach(([gender, usersByAge]) => {
    content += `  - ${gender}: ${usersByAge.length}(${(usersByAge.length / users.length) *
      100}%) \n`;
  });
  content += "\n";

  content += `* Field of work: (${users.length})\n`;
  Object.entries(userGroupByFieldOfWorkTypes).forEach(([gender, usersByAge]) => {
    content += `  - ${gender}: ${usersByAge.length}(${(usersByAge.length / users.length) *
      100}%) \n`;
  });

  fs.writeFileSync("./report/participant-characteristic.txt", content);
}
async function partipantInfos() {
  const users = await Models.User.find();

  const header = [
    {
      id: "stt",
      title: "STT"
    },
    {
      id: "fullName",
      title: "full name"
    },
    {
      id: "email",
      title: "email"
    },
    {
      id: "age",
      title: "age"
    },
    {
      id: "gender",
      title: "gender"
    },
    {
      id: "fieldOfWorkType",
      title: "field of work"
    },
    {
      id: "education",
      title: "educational quanlification"
    },
    {
      id: "country",
      title: "country"
    }
  ];
  const rows = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    rows.push({
      stt: i + 1,
      ...user.toJSON()
    });
  }

  const csvWriter = createCsvWriter({
    path: "./report/partipant-infos.csv",
    header
  });
  csvWriter.writeRecords(rows);
}
async function getParticipantFeedback() {
  const answers = await Models.Answer.find();

  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/CSVReport_644f697fb36c_B_Page#1_With_PageSize#5000 (1).csv");

  const header = [
    {
      id: "stt",
      title: "STT"
    },
    {
      id: "id",
      title: "ID of microworker"
    },
    {
      id: "email",
      title: "email"
    },
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "finished",
      title: "Finished"
    },
    {
      id: "time",
      title: "Time"
    }
  ];
  const rows = [];

  Array.from({ length: 10 }).forEach((v, i) => {
    header.push({
      id: `training1-Q${i + 1}`,
      title: `training1-Q${i + 1}`
    });
  });
  Array.from({ length: 9 }).forEach((v, i) => {
    header.push({
      id: `testing1-Q${i + 1}`,
      title: `testing1-Q${i + 1}`
    });
  });

  Array.from({ length: 10 }).forEach((v, i) => {
    header.push({
      id: `training2-Q${i + 1}`,
      title: `training2-Q${i + 1}`
    });
  });
  Array.from({ length: 9 }).forEach((v, i) => {
    header.push({
      id: `testing2-Q${i + 1}`,
      title: `testing2-Q${i + 1}`
    });
  });

  Array.from({ length: 10 }).forEach((v, i) => {
    header.push({
      id: `training3-Q${i + 1}`,
      title: `training3-Q${i + 1}`
    });
  });
  Array.from({ length: 9 }).forEach((v, i) => {
    header.push({
      id: `testing3-Q${i + 1}`,
      title: `testing3-Q${i + 1}`
    });
  });

  Array.from({ length: 10 }).forEach((v, i) => {
    header.push({
      id: `training4-Q${i + 1}`,
      title: `training4-Q${i + 1}`
    });
  });
  Array.from({ length: 9 }).forEach((v, i) => {
    header.push({
      id: `testing4-Q${i + 1}`,
      title: `testing4-Q${i + 1}`
    });
  });

  Array.from({ length: 10 }).forEach((v, i) => {
    header.push({
      id: `training5-Q${i + 1}`,
      title: `training5-Q${i + 1}`
    });
  });
  Array.from({ length: 9 }).forEach((v, i) => {
    header.push({
      id: `testing5-Q${i + 1}`,
      title: `testing5-Q${i + 1}`
    });
  });

  for (let i = 0; i < answers.length; i++) {
    const {
      training1 = {},
      training2 = {},
      training3 = {},
      training4 = {},
      training5 = {},
      testing1 = {},
      testing2 = {},
      testing3 = {},
      testing4 = {},
      testing5 = {},
      userId,
      isSatisfied,
      comment
    } = answers[i];

    const user = await Models.User.findById(userId);
    const resultInMicro = dataFromMicro.find(
      item => item[2].toLowerCase().trim() === user.email.toLowerCase().trim()
    );

    const row = {
      stt: i + 1,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      satisfied: [true, false].includes(isSatisfied) ? (isSatisfied ? "Yes" : "No") : "",
      comment: comment || "",
      finished: [true, false].includes(isSatisfied) ? "Yes" : "No",
      time: resultInMicro ? resultInMicro[1] : ""
    };

    Object.values(training1).forEach((value, i) => {
      row[`training1-Q${i + 1}`] = getLabelText(value.allow);
    });
    Object.values(training2).forEach((value, i) => {
      row[`training2-Q${i + 1}`] = getLabelText(value.allow);
    });
    Object.values(training3).forEach((value, i) => {
      row[`training3-Q${i + 1}`] = getLabelText(value.allow);
    });
    Object.values(training4).forEach((value, i) => {
      row[`training4-Q${i + 1}`] = getLabelText(value.allow);
    });
    Object.values(training5).forEach((value, i) => {
      row[`training5-Q${i + 1}`] = getLabelText(value.allow);
    });

    Object.values(testing1).forEach((value, i) => {
      if (isObject(value)) {
        row[`testing1-Q${i + 1}`] = `Agree: ${value.agree == 1 ? "Yes" : "No"} ${
          value.agree == 0
            ? "- " + getLabelText(Number(value.agree == 1 ? value.ourPrediction || 0 : value.allow))
            : ""
        }`;
      }
    });
    Object.values(testing2).forEach((value, i) => {
      if (isObject(value)) {
        row[`testing2-Q${i + 1}`] = `Agree: ${value.agree == 1 ? "Yes" : "No"} ${
          value.agree == 0
            ? "- " + getLabelText(Number(value.agree == 1 ? value.ourPrediction || 0 : value.allow))
            : ""
        }`;
      }
    });
    Object.values(testing3).forEach((value, i) => {
      if (isObject(value)) {
        row[`testing3-Q${i + 1}`] = `Agree: ${value.agree == 1 ? "Yes" : "No"} ${
          value.agree == 0
            ? "- " + getLabelText(Number(value.agree == 1 ? value.ourPrediction || 0 : value.allow))
            : ""
        }`;
      }
    });
    Object.values(testing4).forEach((value, i) => {
      if (isObject(value)) {
        row[`testing4-Q${i + 1}`] = `Agree: ${value.agree == 1 ? "Yes" : "No"} ${
          value.agree == 0
            ? "- " + getLabelText(Number(value.agree == 1 ? value.ourPrediction || 0 : value.allow))
            : ""
        }`;
      }
    });
    Object.values(testing5).forEach((value, i) => {
      if (isObject(value)) {
        row[`testing5-Q${i + 1}`] = `Agree: ${value.agree == 1 ? "Yes" : "No"} ${
          value.agree == 0
            ? "- " + getLabelText(Number(value.agree == 1 ? value.ourPrediction || 0 : value.allow))
            : ""
        }`;
      }
    });

    rows.push(row);
  }

  const csvWriter = createCsvWriter({
    path: "./report/partipant-feedbacks.csv",
    header
  });
  csvWriter.writeRecords(rows);
}

function getLabelText(number) {
  if (number == 1) return "Yes";
  else if (number == 2) return "Maybe";
  else return "No";
}
async function generateFinalQuestionReports() {
  const answers = await Models.Answer.find();

  const header = [
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "comment",
      title: "Comment"
    }
  ];
  const rows = [];
  for (let i = 0; i < answers.length; i++) {
    const { isSatisfied, comment } = answers[i];

    rows.push({
      satisfied: isSatisfied ? "Yes" : "No",
      comment
    });
  }

  const csvWriter = createCsvWriter({
    path: "./report/final-question.csv",
    header
  });
  csvWriter.writeRecords(rows);
}

async function generateSatisfiedReports() {
  const answers = await Models.Answer.find();

  const results = {
    "satisfied-approach-1": {
      0: 0,
      1: 0,
      2: 0
    },
    "satisfied-approach-2": {
      0: 0,
      1: 0,
      2: 0
    },
    "satisfied-approach-3": {
      0: 0,
      1: 0,
      2: 0
    }
  };

  for (let i = 0; i < answers.length; i++) {
    const { testing1, testing2, testing3, testing4, testing5, _id, isSatisfied } = answers[i];
    if (![true, false].includes(isSatisfied)) continue;
    results["satisfied-approach-1"][testing1["satisfied-approach-1"]]++;
    results["satisfied-approach-2"][testing1["satisfied-approach-2"]]++;
    results["satisfied-approach-3"][testing1["satisfied-approach-3"]]++;

    results["satisfied-approach-1"][testing2["satisfied-approach-1"]]++;
    results["satisfied-approach-2"][testing2["satisfied-approach-2"]]++;
    results["satisfied-approach-3"][testing2["satisfied-approach-3"]]++;

    results["satisfied-approach-1"][testing3["satisfied-approach-1"]]++;
    results["satisfied-approach-2"][testing3["satisfied-approach-2"]]++;
    results["satisfied-approach-3"][testing3["satisfied-approach-3"]]++;

    results["satisfied-approach-1"][testing4["satisfied-approach-1"]]++;
    results["satisfied-approach-2"][testing4["satisfied-approach-2"]]++;
    results["satisfied-approach-3"][testing4["satisfied-approach-3"]]++;

    results["satisfied-approach-1"][testing5["satisfied-approach-1"]]++;
    results["satisfied-approach-2"][testing5["satisfied-approach-2"]]++;
    results["satisfied-approach-3"][testing5["satisfied-approach-3"]]++;
  }

  const header = [
    {
      id: "approach",
      title: "Approach"
    },
    {
      id: "result",
      title: "Result"
    }
  ];

  const rows = [
    {
      approach: "Approach 1",
      result: `Yes - ${results["satisfied-approach-1"][1]}; No - ${results["satisfied-approach-1"][0]}; Maybe - ${results["satisfied-approach-1"][2]}`
    },
    {
      approach: "Approach 2",
      result: `Yes - ${results["satisfied-approach-2"][1]}; No - ${results["satisfied-approach-2"][0]}; Maybe - ${results["satisfied-approach-2"][2]}`
    },
    {
      approach: "Approach 3",
      result: `Yes - ${results["satisfied-approach-3"][1]}; No - ${results["satisfied-approach-3"][0]}; Maybe - ${results["satisfied-approach-3"][2]}`
    }
  ];

  const csvWriter = createCsvWriter({
    path: "./report/satisfied.csv",
    header
  });
  csvWriter.writeRecords(rows);
}
async function generateAccuracyReports() {
  const answers = await Models.Answer.find();

  const result = {};
  const getStat = (questions, key) => {
    if (!result[key]) result[key] = [];
    result[key] = [
      ...result[key],
      ...questions.map(item => {
        return {
          predictLabel: Number(item.ourPrediction || 0),
          label: Number(item.agree == 1 ? item.ourPrediction || 0 : item.allow)
        };
      })
    ];
  };
  const updateWithKey = data => {
    return Object.entries(data)
      .map(([questionId, value]) => {
        if (questionId.includes("satisfied")) return null;
        return {
          ...value,
          questionId: questionId.toString(),
          label: Number(value.agree == 1 ? value.ourPrediction || 0 : value.allow)
        };
      })
      .filter(item => item);
  };
  for (let i = 0; i < answers.length; i++) {
    const {
      training1,
      training2,
      training3,
      training4,
      training5,
      testing1,
      testing2,
      testing3,
      testing4,
      testing5,
      _id,
      userId,
      isSatisfied
    } = answers[i];

    if (![true, false].includes(isSatisfied)) continue;

    const user = await Models.User.findById(userId);
    const appSurvey = await Models.AppSurvey.findById(user.appSurveyId);

    const testing1Values = Object.values(testing1 || {});
    const testing2Values = Object.values(testing2 || {});
    const testing3Values = Object.values(testing3 || {});
    const testing4Values = Object.values(testing4 || {});
    const testing5Values = Object.values(testing5 || {});

    const training1WithKey = updateWithKey(training1 || {});
    const training2WithKey = updateWithKey(training2 || {});
    const training3WithKey = updateWithKey(training3 || {});
    const training4WithKey = updateWithKey(training4 || {});
    const training5WithKey = updateWithKey(training5 || {});

    const testing1WithKey = updateWithKey(testing1 || {});
    const testing2WithKey = updateWithKey(testing2 || {});
    const testing3WithKey = updateWithKey(testing3 || {});
    const testing4WithKey = updateWithKey(testing4 || {});
    const testing5WithKey = updateWithKey(testing5 || {});
    const testing1Ids = getQuestionIdByType(constants.STAGES.testing1, appSurvey);
    const testing2Ids = getQuestionIdByType(constants.STAGES.testing2, appSurvey);
    const testing3Ids = getQuestionIdByType(constants.STAGES.testing3, appSurvey);
    const testing4Ids = getQuestionIdByType(constants.STAGES.testing4, appSurvey);
    const testing5Ids = getQuestionIdByType(constants.STAGES.testing5, appSurvey);

    const approach1QuestionIds = [
      ...testing1Ids.slice(0, 3),
      ...testing2Ids.slice(0, 3),
      ...testing3Ids.slice(0, 3),
      ...testing4Ids.slice(0, 3),
      ...testing5Ids.slice(0, 3)
    ].map(item => item.toString());

    const approach2QuestionIds = [
      ...testing1Ids.slice(3, 6),
      ...testing2Ids.slice(3, 6),
      ...testing3Ids.slice(3, 6),
      ...testing4Ids.slice(3, 6),
      ...testing5Ids.slice(3, 6)
    ].map(item => item.toString());

    const approach3QuestionIds = [
      ...testing1Ids.slice(6, 9),
      ...testing2Ids.slice(6, 9),
      ...testing3Ids.slice(6, 9),
      ...testing4Ids.slice(6, 9),
      ...testing5Ids.slice(6, 9)
    ].map(item => item.toString());

    const approach1NewQuestionIds = [
      ...testing1Ids.slice(0, 2),
      ...testing2Ids.slice(0, 2),
      ...testing3Ids.slice(0, 2),
      ...testing4Ids.slice(0, 2),
      ...testing5Ids.slice(0, 2)
    ].map(item => item.toString());

    const approach2NewQuestionIds = [
      ...testing1Ids.slice(5, 6),
      ...testing2Ids.slice(3, 5),
      ...testing3Ids.slice(3, 5),
      ...testing4Ids.slice(3, 5),
      ...testing5Ids.slice(3, 5)
    ].map(item => item.toString());

    const approach3NewQuestionIds = [
      ...testing1Ids.slice(6, 8),
      ...testing2Ids.slice(6, 8),
      ...testing3Ids.slice(6, 8),
      ...testing4Ids.slice(6, 8),
      ...testing5Ids.slice(6, 8)
    ].map(item => item.toString());

    const approach1LastQuestionIds = [
      ...testing1Ids.slice(2, 3),
      ...testing2Ids.slice(2, 3),
      ...testing3Ids.slice(2, 3),
      ...testing4Ids.slice(2, 3),
      ...testing5Ids.slice(2, 3)
    ].map(item => item.toString());

    const approach2LastQuestionIds = [
      ...testing1Ids.slice(5, 6),
      ...testing2Ids.slice(5, 6),
      ...testing3Ids.slice(5, 6),
      ...testing4Ids.slice(5, 6),
      ...testing5Ids.slice(5, 6)
    ].map(item => item.toString());

    const approach3LastQuestionIds = [
      ...testing1Ids.slice(8, 9),
      ...testing2Ids.slice(8, 9),
      ...testing3Ids.slice(8, 9),
      ...testing4Ids.slice(8, 9),
      ...testing5Ids.slice(8, 9)
    ].map(item => item.toString());

    const allTestingQuestions = [
      ...testing1WithKey,
      ...testing2WithKey,
      ...testing3WithKey,
      ...testing4WithKey,
      ...testing5WithKey
    ];
    const allTrainingQuestions = [
      ...training1WithKey,
      ...training2WithKey,
      ...training3WithKey,
      ...training4WithKey,
      ...training5WithKey
    ];
    const approach1Questions = allTestingQuestions.filter(item =>
      approach1QuestionIds.includes(item.questionId)
    );
    const approach2Questions = allTestingQuestions.filter(item =>
      approach2QuestionIds.includes(item.questionId)
    );
    const approach3Questions = allTestingQuestions.filter(item =>
      approach3QuestionIds.includes(item.questionId)
    );

    const approach1NewQuestions = allTestingQuestions.filter(item =>
      approach1NewQuestionIds.includes(item.questionId)
    );
    const approach2NewQuestions = allTestingQuestions.filter(item =>
      approach2NewQuestionIds.includes(item.questionId)
    );
    const approach3NewQuestions = allTestingQuestions.filter(item =>
      approach3NewQuestionIds.includes(item.questionId)
    );

    const approach1LastQuestions = allTestingQuestions.filter(item =>
      approach1LastQuestionIds.includes(item.questionId)
    );
    const approach2LastQuestions = allTestingQuestions.filter(item =>
      approach2LastQuestionIds.includes(item.questionId)
    );
    const approach3LastQuestions = allTestingQuestions.filter(item =>
      approach3LastQuestionIds.includes(item.questionId)
    );

    const {
      similarityApproach1Questions,
      nonSimilarityApproach1Questions
    } = approach1LastQuestions.reduce(
      (acc, question) => {
        const trainingQuestion = allTrainingQuestions.find(
          item => item.questionId === question.questionId
        );

        if (trainingQuestion.allow == question.label)
          acc.similarityApproach1Questions.push(question);
        else acc.nonSimilarityApproach1Questions.push(question);

        return acc;
      },
      {
        similarityApproach1Questions: [],
        nonSimilarityApproach1Questions: []
      }
    );

    const {
      similarityApproach2Questions,
      nonSimilarityApproach2Questions
    } = approach2LastQuestions.reduce(
      (acc, question) => {
        const trainingQuestion = allTrainingQuestions.find(
          item => item.questionId === question.questionId
        );

        if (trainingQuestion.allow == question.label)
          acc.similarityApproach2Questions.push(question);
        else acc.nonSimilarityApproach2Questions.push(question);

        return acc;
      },
      {
        similarityApproach2Questions: [],
        nonSimilarityApproach2Questions: []
      }
    );

    const {
      similarityApproach3Questions,
      nonSimilarityApproach3Questions
    } = approach3LastQuestions.reduce(
      (acc, question) => {
        const trainingQuestion = allTrainingQuestions.find(
          item => item.questionId === question.questionId
        );

        if (trainingQuestion.allow == question.label)
          acc.similarityApproach3Questions.push(question);
        else acc.nonSimilarityApproach3Questions.push(question);

        return acc;
      },
      {
        similarityApproach3Questions: [],
        nonSimilarityApproach3Questions: []
      }
    );

    // Measure the accuracy for the 3 approaches (i.e., 3 question)
    getStat(approach1Questions, "approaches/approach1");

    getStat(approach2Questions, "approaches/approach2");

    getStat(approach3Questions, "approaches/approach3");

    // 2 new test question
    getStat(approach1NewQuestions, "2_new_test_question/approach1");

    getStat(approach2NewQuestions, "2_new_test_question/approach2");

    getStat(approach3NewQuestions, "2_new_test_question/approach3");

    // similarity
    getStat(similarityApproach1Questions, "similarity/approach1");

    getStat(similarityApproach2Questions, "similarity/approach2");

    getStat(similarityApproach3Questions, "similarity/approach3");

    // non-similarity
    getStat(nonSimilarityApproach1Questions, "non-similarity/approach1");

    getStat(nonSimilarityApproach2Questions, "non-similarity/approach2");

    getStat(nonSimilarityApproach3Questions, "non-similarity/approach3");

    // 5 types
    getStat(testing1Values, "types/type1");
    getStat(testing2Values, "types/type2");
    getStat(testing3Values, "types/type3");
    getStat(testing4Values, "types/type4");
    getStat(testing5Values, "types/type5");

    const questionCategories = {};
    const questionActivities = {};
    const questionPeople = {};
    const questionPersonalData = {};
    const questionPurposes = {};

    for (let i = 0; i < Object.entries(testing1).length; i++) {
      const [id, questionValue] = Object.entries(testing1)[i];
      if (ObjectID.isValid(id)) {
        const question = await Models.Question.findById(id);
        const categoryName = question.params[1].categoryName;
        const activity = question.params[0];
        const personalItem = question.params[2];

        // category
        if (!questionCategories[categoryName]) {
          questionCategories[categoryName] = [];
        }
        questionCategories[categoryName].push(questionValue);

        // activity
        if (!questionActivities[activity]) {
          questionActivities[activity] = [];
        }
        questionActivities[activity].push(questionValue);

        // personal data
        if (!questionPersonalData[personalItem]) {
          questionPersonalData[personalItem] = [];
        }
        questionPersonalData[personalItem].push(questionValue);
      }
    }

    for (let i = 0; i < Object.entries(testing2).length; i++) {
      const [id, questionValue] = Object.entries(testing2)[i];
      if (ObjectID.isValid(id)) {
        const question = await Models.Question.findById(id);
        const categoryName = question.params[1].categoryName;
        const activity = question.params[0];
        const personalItem = question.params[2];

        // category
        if (!questionCategories[categoryName]) {
          questionCategories[categoryName] = [];
        }
        questionCategories[categoryName].push(questionValue);

        // activity
        if (!questionActivities[activity]) {
          questionActivities[activity] = [];
        }
        questionActivities[activity].push(questionValue);

        // personal data
        if (!questionPersonalData[personalItem]) {
          questionPersonalData[personalItem] = [];
        }
        questionPersonalData[personalItem].push(questionValue);
      }
    }

    for (let i = 0; i < Object.entries(testing3).length; i++) {
      const [id, questionValue] = Object.entries(testing3)[i];
      if (ObjectID.isValid(id)) {
        const question = await Models.Question.findById(id);
        const activity = question.params[0];
        const person = question.params[2];
        const personalItem = question.params[1];

        // activity
        if (!questionActivities[activity]) {
          questionActivities[activity] = [];
        }
        questionActivities[activity].push(questionValue);

        // person
        if (!questionPeople[person]) {
          questionPeople[person] = [];
        }
        questionPeople[person].push(questionValue);

        // personal data
        if (!questionPersonalData[personalItem]) {
          questionPersonalData[personalItem] = [];
        }
        questionPersonalData[personalItem].push(questionValue);
      }
    }

    for (let i = 0; i < Object.entries(testing4).length; i++) {
      const [id, questionValue] = Object.entries(testing4)[i];
      if (ObjectID.isValid(id)) {
        const question = await Models.Question.findById(id);
        const categoryName = question.params[1].categoryName;
        const personalItem = question.params[0];
        const purpose = question.params[2];

        // category
        if (!questionCategories[categoryName]) {
          questionCategories[categoryName] = [];
        }
        questionCategories[categoryName].push(questionValue);

        // personal data
        if (!questionPersonalData[personalItem]) {
          questionPersonalData[personalItem] = [];
        }
        questionPersonalData[personalItem].push(questionValue);

        // purpose
        if (!questionPurposes[purpose]) {
          questionPurposes[purpose] = [];
        }
        questionPurposes[purpose].push(questionValue);
      }
    }

    for (let i = 0; i < Object.entries(testing5).length; i++) {
      const [id, questionValue] = Object.entries(testing5)[i];
      if (ObjectID.isValid(id)) {
        const question = await Models.Question.findById(id);
        const personalItem = question.params[0];
        const purpose = question.params[2];

        // personal data
        if (!questionPersonalData[personalItem]) {
          questionPersonalData[personalItem] = [];
        }
        questionPersonalData[personalItem].push(questionValue);

        // purpose
        if (!questionPurposes[purpose]) {
          questionPurposes[purpose] = [];
        }
        questionPurposes[purpose].push(questionValue);
      }
    }

    Object.entries(questionCategories).forEach(([itemName, questionValues]) => {
      getStat(questionValues, `category/${itemName}`);
    });
    Object.entries(questionActivities).forEach(([itemName, questionValues]) => {
      getStat(questionValues, `activity/${itemName}`);
    });
    Object.entries(questionPeople).forEach(([itemName, questionValues]) => {
      getStat(questionValues, `people/${itemName}`);
    });
    Object.entries(questionPersonalData).forEach(([itemName, questionValues]) => {
      getStat(questionValues, `personal_data/${itemName}`);
    });
    Object.entries(questionPurposes).forEach(([itemName, questionValues]) => {
      itemName && getStat(questionValues, `purpose/${itemName}`);
    });
  }

  await Promise.all(
    Object.entries(result).map(([fileName, values]) => getEMAccuracy(values, fileName))
  );
}

function getQuestionIdByType(currentStage, appSurvey) {
  if (currentStage === constants.STAGES.training1) {
    const questionIds = appSurvey.questionIds.slice(0, 10);
    return questionIds;
  }
  if (currentStage === constants.STAGES.training2) {
    const questionIds = appSurvey.questionIds.slice(16, 26);
    return questionIds;
  }
  if (currentStage === constants.STAGES.training3) {
    const questionIds = appSurvey.questionIds.slice(32, 42);
    return questionIds;
  }
  if (currentStage === constants.STAGES.training4) {
    const questionIds = appSurvey.questionIds.slice(48, 58);
    return questionIds;
  }
  if (currentStage === constants.STAGES.training5) {
    const questionIds = appSurvey.questionIds.slice(64, 74);
    return questionIds;
  }

  if (currentStage === constants.STAGES.testing1) {
    const trainingQuestionIds = appSurvey.questionIds.slice(0, 10);
    const questionIds = [
      ...appSurvey.questionIds.slice(10, 12),
      ...appSurvey.questionIds.slice(7, 8),

      ...appSurvey.questionIds.slice(12, 14),
      ...appSurvey.questionIds.slice(8, 9),

      ...appSurvey.questionIds.slice(14, 16),
      ...appSurvey.questionIds.slice(9, 10)
    ];

    return questionIds;
  }
  if (currentStage === constants.STAGES.testing2) {
    const trainingQuestionIds = appSurvey.questionIds.slice(16, 26);
    const multiplier = 1;
    const questionIds = [
      ...appSurvey.questionIds.slice(10 + 16 * multiplier, 12 + 16 * multiplier),
      ...appSurvey.questionIds.slice(7 + 16 * multiplier, 8 + 16 * multiplier),

      ...appSurvey.questionIds.slice(12 + 16 * multiplier, 14 + 16 * multiplier),
      ...appSurvey.questionIds.slice(8 + 16 * multiplier, 9 + 16 * multiplier),

      ...appSurvey.questionIds.slice(14 + 16 * multiplier, 16 + 16 * multiplier),
      ...appSurvey.questionIds.slice(9 + 16 * multiplier, 10 + 16 * multiplier)
    ];

    return questionIds;
  }
  if (currentStage === constants.STAGES.testing3) {
    const trainingQuestionIds = appSurvey.questionIds.slice(32, 42);
    const multiplier = 2;
    const questionIds = [
      ...appSurvey.questionIds.slice(10 + 16 * multiplier, 12 + 16 * multiplier),
      ...appSurvey.questionIds.slice(7 + 16 * multiplier, 8 + 16 * multiplier),

      ...appSurvey.questionIds.slice(12 + 16 * multiplier, 14 + 16 * multiplier),
      ...appSurvey.questionIds.slice(8 + 16 * multiplier, 9 + 16 * multiplier),

      ...appSurvey.questionIds.slice(14 + 16 * multiplier, 16 + 16 * multiplier),
      ...appSurvey.questionIds.slice(9 + 16 * multiplier, 10 + 16 * multiplier)
    ];

    return questionIds;
  }
  if (currentStage === constants.STAGES.testing4) {
    const trainingQuestionIds = appSurvey.questionIds.slice(48, 58);
    const multiplier = 3;
    const questionIds = [
      ...appSurvey.questionIds.slice(10 + 16 * multiplier, 12 + 16 * multiplier),
      ...appSurvey.questionIds.slice(7 + 16 * multiplier, 8 + 16 * multiplier),

      ...appSurvey.questionIds.slice(12 + 16 * multiplier, 14 + 16 * multiplier),
      ...appSurvey.questionIds.slice(8 + 16 * multiplier, 9 + 16 * multiplier),

      ...appSurvey.questionIds.slice(14 + 16 * multiplier, 16 + 16 * multiplier),
      ...appSurvey.questionIds.slice(9 + 16 * multiplier, 10 + 16 * multiplier)
    ];

    return questionIds;
  }
  if (currentStage === constants.STAGES.testing5) {
    const trainingQuestionIds = appSurvey.questionIds.slice(64, 74);
    const multiplier = 4;
    const questionIds = [
      ...appSurvey.questionIds.slice(10 + 16 * multiplier, 12 + 16 * multiplier),
      ...appSurvey.questionIds.slice(7 + 16 * multiplier, 8 + 16 * multiplier),

      ...appSurvey.questionIds.slice(12 + 16 * multiplier, 14 + 16 * multiplier),
      ...appSurvey.questionIds.slice(8 + 16 * multiplier, 9 + 16 * multiplier),

      ...appSurvey.questionIds.slice(14 + 16 * multiplier, 16 + 16 * multiplier),
      ...appSurvey.questionIds.slice(9 + 16 * multiplier, 10 + 16 * multiplier)
    ];

    return questionIds;
  }
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
async function getEMAccuracy(testResult, fileName) {
  if (!fileName) return;
  let X = 0,
    Y = 0,
    Z = 0,
    W = 0;
  testResult.forEach((item, index) => {
    const predictLabel = Number(item.predictLabel);
    const label = Number(item.label);

    if (predictLabel === 0 && label === 0) X++;
    else if (predictLabel === 1 && label === 0) Y++;
    else if (predictLabel === 0 && label === 1) Z++;
    else if (predictLabel === 1 && label === 1) W++;
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
    path: `./report/accuracy/${fileName}.csv`,
    header: headerAccuracy
  });
  await csvWriterAccuracy.writeRecords(rowsAccuracy);
}
