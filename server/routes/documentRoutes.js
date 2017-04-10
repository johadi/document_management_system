import { docCtrl } from '../controllers';
import auth from '../middlewares/auth';
import utils from '../middlewares/utils';

const documentRoute = (router) => {
  router.route('/documents')
    .get(auth.verifyToken, auth.verifyAdmin, docCtrl.getAllDocuments)
    .post(auth.verifyToken, utils.isValidDocumentBody, docCtrl.createDocument);

  router.route('/documents/:id')
    .get(auth.verifyToken, utils.isValidRequestId, docCtrl.getOneDocument)
    .patch(auth.verifyToken, utils.isValidRequestId,
      utils.isValidDocumentBody, docCtrl.updateDocument)
    .put(auth.verifyToken, utils.isValidRequestId,
      utils.isValidDocumentBody, docCtrl.updateDocument)
    .delete(auth.verifyToken, utils.isValidRequestId, docCtrl.deleteDocument);
};

export default documentRoute;
