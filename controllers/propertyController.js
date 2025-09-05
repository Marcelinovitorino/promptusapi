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
  const {
    title,
    description,
    price,
    location,
    transaction,
    type,
    bedrooms,
    bathrooms,
    area,
  } = req.body;

  // URLs vindas do Cloudinary
  const images = req.files?.map((f) => f.path) || [];

  const parsedPrice =
    price !== undefined && price !== null && price !== ""
      ? parseFloat(price)
      : null;

  const parsedBedrooms =
    bedrooms !== undefined && bedrooms !== null && bedrooms !== ""
      ? parseInt(bedrooms)
      : null;

  const parsedBathrooms =
    bathrooms !== undefined && bathrooms !== null && bathrooms !== ""
      ? parseInt(bathrooms)
      : null;

  const parsedArea =
    area !== undefined && area !== null && area !== ""
      ? parseFloat(area)
      : null;

  const prop = await prisma.property.create({
    data: {
      title,
      description,
      price: isNaN(parsedPrice) ? null : parsedPrice,
      location,
      transaction,
      type,
      bedrooms: isNaN(parsedBedrooms) ? null : parsedBedrooms,
      bathrooms: isNaN(parsedBathrooms) ? null : parsedBathrooms,
      area: isNaN(parsedArea) ? null : parsedArea,
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

  let images = prop.images ?? [];
  if (req.files && req.files.length) {
    const newImages = req.files.map((f) => f.path);
    images = [...images, ...newImages];
  }

  const parsedPrice =
    payload.price !== undefined &&
    payload.price !== null &&
    payload.price !== ""
      ? parseFloat(payload.price)
      : prop.price;

  const parsedBedrooms =
    payload.bedrooms !== undefined &&
    payload.bedrooms !== null &&
    payload.bedrooms !== ""
      ? parseInt(payload.bedrooms)
      : prop.bedrooms;

  const parsedBathrooms =
    payload.bathrooms !== undefined &&
    payload.bathrooms !== null &&
    payload.bathrooms !== ""
      ? parseInt(payload.bathrooms)
      : prop.bathrooms;

  const parsedArea =
    payload.area !== undefined && payload.area !== null && payload.area !== ""
      ? parseFloat(payload.area)
      : prop.area;

  const updated = await prisma.property.update({
    where: { id },
    data: {
      ...payload,
      price: isNaN(parsedPrice) ? prop.price : parsedPrice,
      bedrooms: isNaN(parsedBedrooms) ? prop.bedrooms : parsedBedrooms,
      bathrooms: isNaN(parsedBathrooms) ? prop.bathrooms : parsedBathrooms,
      area: isNaN(parsedArea) ? prop.area : parsedArea,
      images,
    },
  });

  res.json(updated);
}

export async function deleteProperty(req, res) {
  const { id } = req.params;
  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) return res.status(404).json({ error: "Imóvel não encontrado" });

  await prisma.property.delete({ where: { id } });
  res.json({ ok: true });
}
