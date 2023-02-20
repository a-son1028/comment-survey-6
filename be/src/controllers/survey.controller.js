import Models from "../models";
import _ from "lodash";
import replaceall from "replaceall";
import mongoose from "mongoose";
import rq from "request-promise";
import Utils from "../utils";
import Services from "../services";
import constants from "../utils/constants";
class SurveyController {
  async success(req, res, next) {
    try {
      const user = req.user;
      let answer = await Models.Answer.findOne({
        userId: user.id
      });

      if (!answer || answer.questions.length < constants.QUESTION_NUM) return;

      await Models.User.updateOne(
        {
          _id: user.id
        },
        {
          isAnswerd: true
        }
      );

      await Models.AppSurvey.updateOne(
        {
          _id: user.appSurveyId
        },
        {
          isDone: true
        }
      );

      res.json();
    } catch (error) {
      next(error);
    }
  }

  async updateInstruction(req, res, next) {
    const user = req.user;

    const updateUser = await Models.User.updateOne(
      {
        _id: user.id
      },
      {
        $set: {
          isInstruction: true
        }
      }
    );

    res.json(updateUser);
  }
  async getQuestions(req, res, next) {
    try {
      const { user } = req;
      const { appSurveyId } = user;

      let appSurvey = await Models.AppSurvey.findOne({
        ...(appSurveyId
          ? {
              _id: appSurveyId
            }
          : { isSelected: false })
      });

      await appSurvey.updateOne({
        isSelected: true
      });

      if (!appSurveyId) {
        await Models.User.updateOne(
          {
            _id: user.id
          },
          {
            $set: {
              appSurveyId: appSurvey.id
            }
          }
        );
      }

      let apps = await Promise.all(
        _.map(appSurvey.apps, "appId").map(appId => {
          return Models.App.findById(appId).cache(60 * 60 * 24 * 30);
        })
      );

      apps = apps.map((app, stt) => {
        app = app.toJSON();

        app.appInfo.dataSafety.sections = app.appInfo.dataSafety.sections.filter(
          section => section.title !== "Security practices"
        );
        app.stt = stt + 1;
        return app;
      });

      res.json(apps);
    } catch (error) {
      next(error);
    }
  }

  async getComments(req, res, next) {
    try {
      const { user } = req;
      const { appSurveyId } = user;
      const { appId } = req.params;

      let appSurvey = await Models.AppSurvey.findById(appSurveyId);
      const selectedApp = appSurvey.apps.find(app => app.appId.toString() === appId);

      const app = await Models.App.findById(appId)
        .select("appName distance distanceRais3")
        .cache(60 * 60 * 24 * 30);

      (() => {
        if (!app.distance) app.distance = 0.1;
      })();

      let comments = await Models.Comment.find({
        _id: {
          $in: selectedApp.commentIds
        }
      }).cache(60 * 60 * 24 * 30);

      comments = comments.map(comment => {
        comment = comment.toJSON();

        comment.scores.SPLabel = Math.round(comment.scores.SPLabel * 100);
        comment.scores.permissionLabel = Math.round(comment.scores.permissionLabel * 100);
        comment.scores.dataCollectionLabel = Math.round(comment.scores.dataCollectionLabel * 100);
        comment.scores.dataSharingLabel = Math.round(comment.scores.dataSharingLabel * 100);
        return comment;
      });
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  async getAnswer(req, res, next) {
    try {
      const user = req.user;
      let answer = await Models.Answer.findOne({
        userId: user.id
      });

      res.json(answer);
    } catch (error) {
      next(error);
    }
  }

  async updateSurvey(req, res, next) {
    try {
      const user = req.user;
      const { survey } = req.body;
      let answer = await Models.Answer.findOne({
        userId: user.id
      });

      if (!answer)
        answer = await Models.Answer.create({
          userId: user.id,
          survey: null,
          questions: []
        });

      // update anwsers
      await Models.Answer.updateOne(
        {
          _id: answer.id
        },
        {
          $set: {
            survey: survey
          }
        },
        {}
      );

      res.json({
        message: "Updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async handleQuestions(req, res, next) {
    try {
      const user = req.user;
      const { question } = req.body;
      let answer = await Models.Answer.findOne({
        userId: user.id
      });

      if (!answer)
        answer = await Models.Answer.create({
          userId: user.id,
          questions: []
        });

      let newQuestions = answer.questions;
      const oldQuestionIndex = answer.questions.findIndex(
        item => item.appId.toString() === question.appId
      );
      if (~oldQuestionIndex) {
        newQuestions[oldQuestionIndex] = question;
      } else newQuestions.push(question);

      // update anwsers
      await Models.Answer.updateOne(
        {
          _id: answer.id
        },
        {
          $set: {
            questions: newQuestions
          }
        },
        {}
      );

      const currentQuestion =
        newQuestions.length + 1 <= constants.QUESTION_NUM
          ? newQuestions.length + 1
          : constants.QUESTION_NUM;

      await Models.User.updateOne(
        {
          _id: user.id
        },
        {
          $set: {
            currentQuestion
          }
        },
        {}
      );

      res.json(newQuestions);
    } catch (error) {
      next(error);
    }
  }

  async confirm(req, res, next) {
    try {
      const user = req.user;
      const { isSatisfied, isHasComment, comment } = req.body;
      let answer = await Models.Answer.findOne({
        userId: user.id
      });

      if (!answer) throw new Error("Something went wrong");
      // update anwsers
      const updatedData = await Models.Answer.updateOne(
        {
          _id: answer.id
        },
        {
          $set: {
            isSatisfied,
            isHasComment,
            comment
          }
        },
        {}
      );

      res.json(updatedData);
    } catch (error) {
      next(error);
    }
  }
  async getQuestion(req, res, next) {
    try {
      await Utils.Function.retry(async () => {
        const user = req.user;
        const { id, index } = req.params;
        let question = await Models.App.findById(id).cache(60 * 60 * 24 * 30); // 1 month;
        question = question.toJSON();
        question.PPModel = JSON.parse(question.PPModel || "{}");
        question.apisModel = JSON.parse(question.apisModel || "{}");

        const category = Object.entries(constants.categoryGroups).find(item => {
          const subCategories = item[1];

          if (subCategories.includes(question.categoryName)) return true;
          return false;
        })[0];

        if (!question.personalDataTypes || !question.personalDataTypes.length) {
          let apis = await Promise.all(question.nodes.map(Utils.Function.getAPIFromNode));
          apis = _.uniqBy(apis, "name");

          const groupApis = _.groupBy(apis, "parent");

          let personalDataTypes = [];
          for (const personalDataTypeId in groupApis) {
            const parent = await Models.Tree.findById(personalDataTypeId);

            const personalDataTypeApiIds = groupApis[personalDataTypeId];

            const personalDataTypeApis = await Promise.all(
              personalDataTypeApiIds.map(id => Models.Tree.findById(id).cache(60 * 60 * 24 * 30))
            );

            personalDataTypes.push({
              name: parent.name,
              apis: personalDataTypeApis
            });
          }

          question.personalDataTypes = personalDataTypes;
          await Models.App.updateOne({ _id: id }, { $set: { personalDataTypes } });
        }

        question.personalDataTypes = question.personalDataTypes.map(personalDataType => {
          const apis = personalDataType.apis.reduce((acc, item) => {
            const newAPi = Utils.Function.getGroupApi(item);
            if (newAPi) acc.push(newAPi);

            return acc;
          }, []);

          return {
            ...personalDataType,
            ...(Utils.Function.getPersonalDataType(personalDataType) || {}),
            apis: _.uniqBy(apis, "groupName"),
            originalApis: personalDataType.apis
          };
        });

        question.personalDataTypes;

        question.collectionData = JSON.parse(question.collectionData || "[]");
        question.collectionData = question.collectionData.filter(item => item.children.length > 0);
        question.thirdPartyData = JSON.parse(question.thirdPartyData || "[]");
        question.thirdPartyData = question.thirdPartyData.filter(item => item.children.length > 0);

        question.retentionData = JSON.parse(question.retentionData || "[]");

        // Using all collected data to collection
        let collectionCollectedData = {
          name: "Purposes that apply to all the collected data",
          children: [],
          type: "all"
        };
        question.collectionData.map(category => {
          category.children = category.children.filter(child => {
            if (child.meanings.length === 0) {
              const indexChild = collectionCollectedData.children.findIndex(
                item => item.name === category.name
              );
              if (~indexChild) {
                collectionCollectedData.children[indexChild].meanings.push({
                  groupKeyword: child.name,
                  meanings: []
                });
              } else {
                collectionCollectedData.children.push({
                  name: `${category.name}`,
                  meanings: [{ groupKeyword: child.name, meanings: [] }]
                });
              }

              return false;
            }
            return true;
          });
        });
        question.collectionData = question.collectionData.filter(
          category => category.children.length
        );
        if (collectionCollectedData.children.length) {
          question.collectionData.push(collectionCollectedData);
        }

        // Using all collected data to third party
        let thirdPartyCollectedData = {
          name: "Purposes that apply to all the collected data",
          children: [],
          type: "all"
        };
        question.thirdPartyData.map(category => {
          category.children = category.children.filter(child => {
            if (child.meanings.length === 0) {
              const indexChild = thirdPartyCollectedData.children.findIndex(
                item => item.name === category.name
              );
              if (~indexChild) {
                thirdPartyCollectedData.children[indexChild].meanings.push({
                  groupKeyword: child.name,
                  meanings: []
                });
              } else {
                thirdPartyCollectedData.children.push({
                  name: `${category.name}`,
                  meanings: [{ groupKeyword: child.name, meanings: [] }]
                });
              }
              return false;
            }
            return true;
          });
        });
        question.thirdPartyData = question.thirdPartyData.filter(
          category => category.children.length
        );
        if (thirdPartyCollectedData.children.length) {
          question.thirdPartyData.push(thirdPartyCollectedData);
        }

        // add "User profile" to personalDataTypes
        if (question.collectionData.length || question.thirdPartyData.length) {
          question.personalDataTypes.push({
            name: "User profile",
            mean:
              "By accessing this data, the app can collect basic user info (standard info, such as name, age, gender), or identity info, such as phone number, or user’s interests, such as sports, art, gaming, traveling.",
            originalApis: [
              {
                name: "com.google.android.gms.plus"
              },
              {
                name: "com.google.api.services.people.v1"
              },
              {
                name: "com.google.api.services.people.v1.model"
              }
            ],
            apis: [
              {
                groupName: "Account information",
                mean:
                  "The app collects basic personal data such as full name, age, gender, etc, plus information on social network (e.g., work, education, friend list, family members),  or biometric data."
              }
            ]
          });
        }

        let ourPrediction;
        let userAnswer;
        // get answers from user
        const answer = await Models.Answer.findOne({
          userId: user.id
        });
        if (answer && answer.questions && answer.questions.length) {
          const questionData = answer.questions.find(
            questionItem => questionItem.id == question.id
          );
          if (questionData) {
            userAnswer = {};
            questionData.responses.forEach(item => {
              userAnswer[item.name] = item.value;
            });
          }
        }

        const refreshUser = await Models.User.findById(user.id);
        console.time("predict");
        if (index > 10 && index <= 14) {
          const tranningAppIds = refreshUser.questionIds.slice(0, index - 1);
          const tranningApps = await Promise.all(
            tranningAppIds.map(appId => Models.App.findById(appId))
          );
          console.log("Get tranning apps", tranningAppIds);
          const traningSet = tranningApps.map(tranningApp => {
            let { PPModel, apisModel, id } = tranningApp;

            PPModel = JSON.parse(PPModel);
            apisModel = JSON.parse(apisModel);

            const userAnswerQuestion = answer.questions.find(question => question.id === id);
            let questionInstallation = userAnswerQuestion.responses.find(
              item => item.name === "install"
            );
            if (!questionInstallation)
              questionInstallation = userAnswerQuestion.responses.find(
                item => item.name === "agreePredict"
              );

            if (!questionInstallation) throw Error("Answer not found");
            const label = questionInstallation.value;

            return [
              ...Object.values(PPModel).map(item => item.toString()),
              ...Object.values(apisModel).map(item => item.toString()),
              label.toString()
            ];
          });

          const testSet = [
            [
              ...Object.values(question.PPModel).map(item => item.toString()),
              ...Object.values(question.apisModel).map(item => item.toString()),
              "-1"
            ]
          ];
          // get prediction
          ourPrediction = await Services.Prediction.getPredictEM({
            train: traningSet,
            test: testSet
          });
          ourPrediction = ourPrediction[0][0];
        } else if (index > 14 && index <= 18) {
          let tranningAppIds = [];
          if (index > 14 && index <= 16)
            tranningAppIds = [
              ...refreshUser.questionIds.slice(0, 5),
              ...refreshUser.questionIds.slice(14, index - 1)
            ];
          if (index > 16 && index <= 18)
            tranningAppIds = [
              ...refreshUser.questionIds.slice(5, 10),
              ...refreshUser.questionIds.slice(16, index - 1)
            ];
          console.log("Get tranning apps", tranningAppIds);
          const traningSet = await Utils.Function.getTranningData(tranningAppIds, answer);

          const testSet = [
            [
              ...Object.values(question.PPModel).map(item => item.toString()),
              ...Object.values(question.apisModel).map(item => item.toString()),
              "-1"
            ]
          ];

          // get prediction
          ourPrediction = await Services.Prediction.getPredictEM({
            train: traningSet,
            test: testSet
          });
          ourPrediction = ourPrediction[0][0];
        } else if (index > 18 && index <= 22) {
          const tranningAppIds = [
            ...refreshUser.questionIds.slice(0, 10),
            ...refreshUser.questionIds.slice(19 - 1, index - 1)
          ];
          console.log("Get tranning apps", tranningAppIds);
          ourPrediction = await Utils.Function.getOurPredictionApproach3(
            tranningAppIds,
            answer,
            question
          );
        } else if (index > 22 && index <= 26) {
          const tranningAppIds = [
            ...refreshUser.questionIds.slice(0, 10),
            ...refreshUser.questionIds.slice(23 - 1, index - 1)
          ];
          console.log("Get tranning apps", tranningAppIds);
          ourPrediction = await Utils.Function.getOurPredictionApproach4(
            tranningAppIds,
            answer,
            question
          );
        }
        console.timeEnd("predict");
        Utils.Logger.info(`getQuestion Step 3:: Prediction: ${ourPrediction}`);
        question.categoryName = category;

        res.render("survey/templates/survey-question-ajax", {
          question,
          indexQuestion: index,
          userAnswer,
          isAnswered: !!userAnswer,
          ourPrediction
        });
      }, 3);
    } catch (error) {
      next(error);
    }
  }

  async getAppComment(req, res, next) {
    try {
      let { data: apps } = req.body;
      apps = JSON.parse(apps);

      const questions = [];
      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        let question = await Models.App.findById(app.appId).cache(60 * 60 * 24 * 30); // 1 month;
        question = question.toJSON();

        if (!question.personalDataTypes || !question.personalDataTypes.length) {
          let apis = await Promise.all(question.nodes.map(Utils.Function.getAPIFromNode));
          apis = _.uniqBy(apis, "name");

          const groupApis = _.groupBy(apis, "parent");

          let personalDataTypes = [];
          for (const personalDataTypeId in groupApis) {
            const parent = await Models.Tree.findById(personalDataTypeId);

            const personalDataTypeApiIds = groupApis[personalDataTypeId];

            const personalDataTypeApis = await Promise.all(
              personalDataTypeApiIds.map(id => Models.Tree.findById(id))
            );

            personalDataTypes.push({
              name: parent.name,
              apis: personalDataTypeApis
            });
          }

          question.personalDataTypes = personalDataTypes;
          await Models.App.updateOne({ _id: id }, { $set: { personalDataTypes } }).then(
            console.log
          );
        }

        questions.push({
          ...question,
          ...app
        });
      }
      res.render("survey/templates/survey-app-comment-ajax", {
        questions
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      let users = await Models.User.find({}, "email fullName").populate({
        path: "answers",
        select: { _id: 1 }
      });
      let content = "";
      for (let i = 0; i < users.length; i++) {
        const { email, fullName, answers } = users[i];

        if (answers.length > 0) {
          content += `<div>${fullName}-${email}</div>`;
        }
      }
      res.send(content);
    } catch (error) {
      next(error);
    }
  }
}
// (new SurveyController()).getQuestions()
export default SurveyController;
