import prisma from "../config/prismaClient.js";

export async function listProperties(req, res) {
  const { location, transaction, type, take = 20, skip = 0 } = req.query;
  const where = {};
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (transaction) where.transaction = transaction;
  if (type) where.type = type;

  const properties = await prisma.property.findMany({
    where,
    take: Number(take),
    skip: Number(skip),
    orderBy: { createdAt: "desc" },
  });
  res.json(properties);
}

export async function getProperty(req, res) {
  const { id } = req.params;
  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) return res.status(404).json({ error: "Imóvel não encontrado" });
  res.json(prop);
}

export async function createProperty(req, res) {
  const { title, description, price, location, transaction, type } = req.body;

  // Pega URLs do Cloudinary
  const images = req.files?.map((f) => f.path) || [];

  // Converte price para Float ou mantém null se inválido
  const parsedPrice =
    price !== undefined && price !== null && price !== ""
      ? parseFloat(price)
      : null;

  const prop = await prisma.property.create({
    data: {
      title,
      description,
      price: isNaN(parsedPrice) ? null : parsedPrice,
      location,
      transaction,
      type,
      images,
    },
  });

  res.status(201).json(prop);
}

export async function updateProperty(req, res) {
  const { id } = req.params;
  const payload = req.body;

  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) return res.status(404).json({ error: "Imóvel não encontrado" });

  // Mantém as imagens já salvas + novas do Cloudinary
  let images = prop.images ?? [];
  if (req.files && req.files.length) {
    const newImages = req.files.map((f) => f.path);
    images = [...images, ...newImages];
  }

  // Converte price para Float se existir, senão mantém o preço atual
  const parsedPrice =
    payload.price !== undefined &&
    payload.price !== null &&
    payload.price !== ""
      ? parseFloat(payload.price)
      : prop.price;

  const updated = await prisma.property.update({
    where: { id },
    data: {
      ...payload,
      price: isNaN(parsedPrice) ? prop.price : parsedPrice,
      images,
    },
  });

  res.json(updated);
}

export async function deleteProperty(req, res) {
  const { id } = req.params;
  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) return res.status(404).json({ error: "Imóvel não encontrado" });

  // Apenas remove o registro, imagens continuam no Cloudinary
  await prisma.property.delete({ where: { id } });
  res.json({ ok: true });
}
