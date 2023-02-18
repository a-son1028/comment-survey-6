import { Router } from "express";
const router = Router();
import Controllers from "../controllers";
import Validators from "../validators";
import Middlewares from "../middlewares";

// const validateInputMiddleware = Middlewares.Validation.validateInput;
const creationValidator = Validators.Auth.create();
router.get("/login", Controllers.Auth.login);
router.get("/signup", Controllers.Auth.signup);

router.post("/signup", creationValidator, Controllers.Auth.signupHandle);
router.post(
  "/login",
  // [creationValidator, validateInputMiddleware],
  Controllers.Auth.loginHandle
);


export default router;
