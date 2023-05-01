import Models from "../models";
import _ from "lodash";
import replaceall from "replaceall";
import mongoose from "mongoose";
import rq from "request-promise";
import Utils from "../utils";
import Services from "../services";
import * as constants from "../utils/constants";
class SurveyController {
  async success(req, res, next) {
    try {
      const user = req.user;
      let answer = await Models.Answer.findOne({
        userId: user.id
      });

      if (!answer || !answer.testing5) return;

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
      const _renderTraining = async questionIds => {
        const questions = await Models.Question.find({
          _id: { $in: questionIds }
        });

        res.json(questions);
      };

      const _renderTesting = async (user, trainingQuestionIds, questionIds, type) => {
        const testingQuestions = await Models.Question.find({
          _id: { $in: questionIds }
        });

        const answer = await Models.Answer.findOne({
          userId: user.id
        });

        const questions = await Utils.Function.getOurPredictionType(
          trainingQuestionIds,
          testingQuestions,
          answer,
          type
        );
        res.json(questions);
      };

      const user = req.user;
      const refreshUser = await Models.User.findById(user.id);
      const appSurvey = await Models.AppSurvey.findById(user.appSurveyId);

      const currentStage = req.query.currentStage || refreshUser.currentStage;
      if (currentStage === constants.STAGES.training1) {
        const questionIds = appSurvey.questionIds.slice(0, 10);
        return await _renderTraining(questionIds);
      }
      if (currentStage === constants.STAGES.training2) {
        const questionIds = appSurvey.questionIds.slice(16, 26);
        return await _renderTraining(questionIds);
      }
      if (currentStage === constants.STAGES.training3) {
        const questionIds = appSurvey.questionIds.slice(32, 42);
        return await _renderTraining(questionIds);
      }
      if (currentStage === constants.STAGES.training4) {
        const questionIds = appSurvey.questionIds.slice(48, 58);
        return await _renderTraining(questionIds);
      }
      if (currentStage === constants.STAGES.training5) {
        const questionIds = appSurvey.questionIds.slice(64, 74);
        return await _renderTraining(questionIds);
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

        return await _renderTesting(refreshUser, trainingQuestionIds, questionIds, "type1");
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

        return await _renderTesting(refreshUser, trainingQuestionIds, questionIds, "type2");
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

        return await _renderTesting(refreshUser, trainingQuestionIds, questionIds, "type3");
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

        return await _renderTesting(refreshUser, trainingQuestionIds, questionIds, "type4");
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

        return await _renderTesting(refreshUser, trainingQuestionIds, questionIds, "type5");
      }

      const questionIds = refreshUser.questionIds;
      const questions = await Models.Question.find({
        _id: { $in: questionIds }
      });

      res.render("survey/templates/survey-question", {
        questions,
        currentStage: user.currentStage
      });
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
      const { responses, time, currentStage } = req.body;
      let answer = await Models.Answer.findOne({
        userId: user.id
      });

      if (!answer)
        answer = await Models.Answer.create({
          userId: user.id,
          questions: []
        });

      // update anwsers
      await Models.Answer.updateOne(
        {
          _id: answer.id
        },
        {
          $set: {
            [currentStage]: responses,
            [`${currentStage}Time`]: time
          }
        }
      );

      const nextStage = Utils.Function.getNextStage(currentStage);

      await Models.User.updateOne(
        {
          _id: user.id
        },
        {
          $set: {
            currentStage: nextStage
          }
        }
      );

      res.json({ message: "Updated successfully" });
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
