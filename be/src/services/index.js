import AuthenticationService from "./authentication.service";
import TokenService from "./token.service";
import Prediction from "./prediction.service";
import PredictionLabel from "./prediction-label.service";

class Service {
  constructor() {
    this.Authentication = new AuthenticationService();
    this.Prediction = new Prediction();
    // this.Token = new TokenService();
    this.PredictionLabel = new PredictionLabel();
  }
}
export default new Service();
