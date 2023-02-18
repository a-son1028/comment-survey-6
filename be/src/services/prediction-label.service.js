import axios from "axios";
class PredictionLabel {
  constructor() {
    this.API = axios.create({
      baseURL: "http://localhost:8001",
      timeout: 1000 * 60 * 5
    });
  }

  async getPredictLabel(payload) {
    try {
      const response = await this.API.post("/classifier", {
        texts: payload
      });

      return response.data;
    } catch (e) {
      console.log("ERROR getPredictLabel with message: " + e.message);
      return null;
    }
  }
}

export default PredictionLabel;
