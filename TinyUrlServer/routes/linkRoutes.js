import express from 'express';
import * as linkController from '../controllers/linkController.js';
import * as authController from '../controllers/authController.js'; // Assuming your protect middleware is here
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes below this middleware will be protected
router.use(authController.protect);
router.get('/mylinks', protect, linkController.getMyLinks);

router
  .route('/')
  .post(linkController.createLink)
  .get(linkController.getMyLinks);

router
  .route('/:id')
  .get(linkController.getLink)
  .patch(linkController.updateLink)
  .delete(linkController.deleteLink);

router.get('/:id/stats', linkController.getLinkStats);

export default router;