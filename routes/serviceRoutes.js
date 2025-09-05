import express from 'express';
import { listServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listServices);
router.post('/', authenticate, createService);
router.put('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);

export default router;
