import { PrismaClient } from '@prisma/client';
import bcrypt           from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  console.log('🌱 Seeding database...');

  // ── CATEGORIES ──────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where:  { slug: 'native-monogram' },
      update: {},
      create: { name: 'Native Monogram', slug: 'native-monogram', type: 'design' },
    }),
    prisma.category.upsert({
      where:  { slug: 'native-normal' },
      update: {},
      create: { name: 'Native Normal', slug: 'native-normal', type: 'design' },
    }),
    prisma.category.upsert({
      where:  { slug: 'agbada' },
      update: {},
      create: { name: 'Agbada', slug: 'agbada', type: 'design' },
    }),
    prisma.category.upsert({
      where:  { slug: 'english' },
      update: {},
      create: { name: 'English Wear', slug: 'english', type: 'design' },
    }),
  ]);

  // Build category ID map
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // ── DESIGNS ─────────────────────────────────────────────────
  const designsData = [
    { name: 'Ankara Senator',     number: 'TBF-003', badge: '',        categoryId: catMap['native-normal']   },
    { name: 'Agbada',      number: 'TBF-004', badge: 'popular', categoryId: catMap['agbada']          },
    { name: 'English Senator',    number: 'TBF-006', badge: 'new',     categoryId: catMap['english']         },
  ];

  for (const design of designsData) {
    await prisma.design.upsert({
      where:  { number: design.number },
      update: {},
      create: design,
    });
  }

  // ── PRODUCTS ─────────────────────────────────────────────────
  const productsData = [
    { name: 'Ankara Senator',  badge: 'new',     tags: 'Ankara,Senator,Formal',  categoryId: catMap['natives']         },
    { name: 'Agbada', badge: '',        tags: 'Monogram,Custom',         categoryId: catMap['agbada-product']  },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where:  { name: product.name },
      update: {},
      create: product,
    });
  }

  // ── ADMIN ACCOUNT ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@1234!', 12);

  await prisma.admin.upsert({
    where:  { email: 'treshblinkybill@gmail.com' },
    update: {},
    create: {
      email: 'treshblinkybill@gmail.com',
      passwordHash,
      name:  'Admin',
    },
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());