import Models from "../models";
import Utils from "../utils";
import bcrypt from "bcrypt";
import Services from "../services";
import { validationResult } from "express-validator";

class AuthController {
  async login(req, res, next) {
    try {
      const errors = req.session.errors;
      delete req.session.errors;
      delete req.session.user;

      res.render("auth/login", { errors });
    } catch (error) {
      next(error);
    }
  }

  async signup(req, res, next) {
    try {
      const errors = req.session.errors;
      delete req.session.errors;

      res.render("auth/signup", { isSignedUp: false, errors });
    } catch (error) {
      next(error);
    }
  }

  async signupHandle(req, res, next) {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({
          message: errors.array()[0].msg
        });

      const {
        email,
        fullName,
        education,
        country,
        age,
        gender,
        fieldOfWorkType,
        fieldOfWork,
        hasExperience
      } = req.body;
      // hash password

      let user = await Models.User.create({
        email,
        fullName,
        education,
        country,
        age,
        gender,
        fieldOfWorkType,
        fieldOfWork,
        hasExperience,
        currentQuestion: 1,
        version: "v1"
      });

      if (!user)
        return res.status(400).json({
          message: "Account created failed"
        });

      res.status(200).json({
        message: "Account created successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  async loginHandle(req, res, next) {
    try {
      const { email, pass } = req.body;

      let user = await Models.User.findOne({
        email,
        version: "v1"
      });

      if (!user)
        return res.status(400).json({
          message: "Email is incorrect"
        });

      // generate token
      const token = Services.Authentication.genToken(user.toJSON());

      res.json({
        ...user.toJSON(),
        token
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
