import express from 'express';
import { createContact, listContacts } from '../controllers/contactController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', createContact);
router.get('/', authenticate, listContacts);
export default router;
