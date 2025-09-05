import prisma from '../config/prismaClient.js';

export async function createContact(req, res) {
  const { name, email, message, phone } = req.body;
  const contact = await prisma.contact.create({ data: { name, email, message, phone } });
  res.status(201).json(contact);
}

export async function listContacts(req, res) {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(contacts);
}
