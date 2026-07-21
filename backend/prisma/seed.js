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
    prisma.category.upsert({
      where:  { slug: 'natives' },
      update: {},
      create: { name: 'Natives', slug: 'natives', type: 'product' },
    }),
    prisma.category.upsert({
      where:  { slug: 'english-product' },
      update: {},
      create: { name: 'English Wear', slug: 'english-product', type: 'product' },
    }),
    prisma.category.upsert({
      where:  { slug: 'agbada-product' },
      update: {},
      create: { name: 'Agbada', slug: 'agbada-product', type: 'product' },
    }),
  ]);

  console.log(`✅ ${categories.length} categories created`);

  // Build category ID map
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // ── DESIGNS ─────────────────────────────────────────────────
  const designsData = [
    { name: 'Royal Monogram I',   number: 'TBF-001', badge: 'new',     categoryId: catMap['native-monogram'] },
    { name: 'Classic Billfits',   number: 'TBF-002', badge: 'popular', categoryId: catMap['native-monogram'] },
    { name: 'Ankara Senator',     number: 'TBF-003', badge: '',        categoryId: catMap['native-normal']   },
    { name: 'Agbada Royale',      number: 'TBF-004', badge: 'popular', categoryId: catMap['agbada']          },
    { name: 'Aso-Oke Grand',      number: 'TBF-005', badge: '',        categoryId: catMap['native-normal']   },
    { name: 'English Senator',    number: 'TBF-006', badge: 'new',     categoryId: catMap['english']         },
    { name: 'Elite Monogram II',  number: 'TBF-007', badge: '',        categoryId: catMap['native-monogram'] },
    { name: 'Corporate Fit',      number: 'TBF-008', badge: 'new',     categoryId: catMap['english']         },
    { name: 'Grand Agbada',       number: 'TBF-009', badge: '',        categoryId: catMap['agbada']          },
    { name: 'Kaftan Classic',     number: 'TBF-010', badge: '',        categoryId: catMap['native-normal']   },
  ];

  for (const design of designsData) {
    await prisma.design.upsert({
      where:  { number: design.number },
      update: {},
      create: design,
    });
  }
  console.log(`✅ ${designsData.length} designs created`);

  // ── PRODUCTS ─────────────────────────────────────────────────
  const productsData = [
    { name: 'Ankara Senator',  badge: 'new',     tags: 'Ankara,Senator,Formal',  categoryId: catMap['natives']         },
    { name: 'Aso-Oke Grand',   badge: '',        tags: 'Aso-Oke,Grand',           categoryId: catMap['natives']         },
    { name: 'Dashiki Royale',  badge: 'bespoke', tags: 'Dashiki,Casual',          categoryId: catMap['natives']         },
    { name: 'Kaftan Classic',  badge: '',        tags: 'Kaftan,Relaxed',          categoryId: catMap['natives']         },
    { name: 'Isi-Agu Senator', badge: '',        tags: 'Isi-Agu,Formal',          categoryId: catMap['natives']         },
    { name: 'Corporate Suit',  badge: 'new',     tags: 'Suit,Corporate',          categoryId: catMap['english-product'] },
    { name: 'English Senator', badge: '',        tags: 'Senator,Smart',           categoryId: catMap['english-product'] },
    { name: 'Slim Fit Blazer', badge: 'new',     tags: 'Blazer,Slim',             categoryId: catMap['english-product'] },
    { name: 'Dinner Jacket',   badge: '',        tags: 'Dinner,Formal',           categoryId: catMap['english-product'] },
    { name: 'Agbada Royale',   badge: 'new',     tags: 'Royal,Premium',           categoryId: catMap['agbada-product']  },
    { name: 'Grand Agbada',    badge: 'bespoke', tags: 'Grand,Bespoke',           categoryId: catMap['agbada-product']  },
    { name: 'Monogram Agbada', badge: '',        tags: 'Monogram,Custom',         categoryId: catMap['agbada-product']  },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where:  { name: product.name },
      update: {},
      create: product,
    });
  }
  console.log(`✅ ${productsData.length} products created`);

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

  console.log('✅ Admin account created');
  console.log('   Email:    treshblinkybill@gmail.com');
  console.log('   Password: Admin@1234!');
  console.log('   ⚠️  Change this password after first login!\n');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());