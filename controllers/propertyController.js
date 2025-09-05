import prisma from '../config/prismaClient.js';
import fs from 'fs';
import path from 'path';

export async function listProperties(req, res) {
  const { location, transaction, type, take = 20, skip = 0 } = req.query;
  const where = {};
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (transaction) where.transaction = transaction;
  if (type) where.type = type;

  const properties = await prisma.property.findMany({ where, take: Number(take), skip: Number(skip), orderBy: { createdAt: 'desc' } });
  res.json(properties);
}

export async function getProperty(req, res) {
  const { id } = req.params;
  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) return res.status(404).json({ error: 'Imóvel não encontrado' });
  res.json(prop);
}

export async function createProperty(req, res) {
  const { title, description, price, location, transaction, type } = req.body;
  const images = [];
  if (req.files && req.files.length) {
    req.files.forEach(f => images.push(`/uploads/${f.filename}`));
  }
  const prop = await prisma.property.create({ data: { title, description, price: price ? Number(price) : null, location, transaction, type, images } });
  res.status(201).json(prop);
}

export async function updateProperty(req, res) {
  const { id } = req.params;
  const payload = req.body;
  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) return res.status(404).json({ error: 'Imóvel não encontrado' });

  const images = prop.images ?? [];
  if (req.files && req.files.length) {
    req.files.forEach(f => images.push(`/uploads/${f.filename}`));
  }

  const updated = await prisma.property.update({ where: { id }, data: { ...payload, price: payload.price ? Number(payload.price) : prop.price, images } });
  res.json(updated);
}

export async function deleteProperty(req, res) {
  const { id } = req.params;
  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) return res.status(404).json({ error: 'Imóvel não encontrado' });

  if (prop.images && prop.images.length) {
    prop.images.forEach(imgPath => {
      try {
        const full = path.join(process.cwd(), imgPath.replace(/^\//,''));
        if (fs.existsSync(full)) fs.unlinkSync(full);
      } catch (err) {}
    });
  }
  await prisma.property.delete({ where: { id } });
  res.json({ ok: true });
}
