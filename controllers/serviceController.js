import prisma from '../config/prismaClient.js';

export async function listServices(req, res) {
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(services);
}

export async function createService(req, res) {
  const { title, body, price } = req.body;
  const service = await prisma.service.create({ data: { title, body, price: price ? Number(price) : null } });
  res.status(201).json(service);
}

export async function updateService(req, res) {
  const { id } = req.params;
  const payload = req.body;
  const service = await prisma.service.update({ where: { id }, data: { ...payload, price: payload.price ? Number(payload.price) : undefined } });
  res.json(service);
}

export async function deleteService(req, res) {
  const { id } = req.params;
  await prisma.service.delete({ where: { id } });
  res.json({ ok: true });
}
