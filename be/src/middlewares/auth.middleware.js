import Utils from "../utils";
import Services from "../services";
import Models from "../models";
class Authentication {
  async isUser(req, res, next) {
    try {
      const token = req.headers['authorization'];
      // const userId = await Utils.ValidateToken.validate(token);
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      let user = await Services.Authentication.verifyToken(token);
      user = await Models.User.findById(user.id);
      if(!user) return res.status(401).json({ message: 'Invalid token' });

      req.user = user.toJSON();
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default Authentication;
