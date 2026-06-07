import { PrismaClient } from "@prisma/client";
import { products } from "../lib/products";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@atyakart.com";
const ADMIN_PHONE = process.env.ADMIN_PHONE ?? "+919999999999";

async function main() {
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN" },
    create: {
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      name: "AtyaKart Admin",
      role: "ADMIN",
    },
  });
  console.log(`Admin user ready: ${ADMIN_EMAIL} / ${ADMIN_PHONE}`);

  const count = await prisma.product.count();
  if (count === 0) {
    for (const p of products) {
      await prisma.product.create({
        data: {
          category: p.category,
          brand: p.brand,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          discountPercent: p.discountPercent,
          rating: p.rating,
          reviewCount: p.reviewCount,
          badge: p.badge,
          emoji: p.emoji,
          isNew: p.isNew,
          tags: JSON.stringify(p.tags),
          sizes: JSON.stringify(p.sizes),
          description: p.description,
        },
      });
    }
    console.log(`Seeded ${products.length} products into the database.`);
  } else {
    console.log(`Products table already has ${count} rows — skipping seed.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
