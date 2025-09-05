import express from 'express';
import { listProperties, getProperty, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerConfig.js';

const router = express.Router();

router.get('/', listProperties);
router.get('/:id', getProperty);
router.post('/', authenticate, upload.array('images', 6), createProperty);
router.put('/:id', authenticate, upload.array('images', 6), updateProperty);
router.delete('/:id', authenticate, deleteProperty);

export default router;
