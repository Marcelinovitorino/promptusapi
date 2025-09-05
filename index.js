import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import propertyRoutes from './routes/propertyRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import prisma from './config/prismaClient.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('./uploads'));

app.use('/properties', propertyRoutes);
app.use('/contacts', contactRoutes);
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
