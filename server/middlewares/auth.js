import jwt from 'jsonwebtoken';
import db from '../models/';

//  Secret token for jsonwebtoken
const secret = process.env.JWT_SECRET_TOKEN || 'docman';

export default {

  /**
   * verifyToken - Verifies if a token supplied is valid
   *
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Validity response
   */
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization || req.headers['x-access-token']
      || req.body.token || req.query.token;
    if (!token) {
      return res.status(401)
        .send({
          status: 'fail',
          message: 'Token required to access this route'
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token'
        });
      }
      req.decoded = decoded;
      next();
    });
  },

  /**
   * verifyAdmin - Verifies that the user role supplied is an admin
   *
   * @param  {Object} req  Request Object
   * @param  {Object} res  Response Object
   * @param  {Object} next
   * @returns {Object} Response Object
   */
  verifyAdmin: (req, res, next) => {
    db.Role.findById(req.decoded.RoleId)
      .then((role) => {
        if (role.title.toLowerCase() === 'admin') {
          next();
        } else {
          return res.status(403).json({
            status: 'fail',
            message: 'User is unauthorized for this request.'
          });
        }
      });
  }
};

