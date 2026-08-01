const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting data migration for dynamic categories...');

  // 1. Create Default Categories
  const defaultCategories = [
    { name: 'User', slug: 'visitor', iconName: 'user', pinColor: '#3b82f6', displayOrder: 1 },
    { name: 'Driver', slug: 'driver', iconName: 'truck', pinColor: '#2563eb', displayOrder: 2 },
    { name: 'Workshop', slug: 'workshop', iconName: 'wrench', pinColor: '#10b981', displayOrder: 3 },
    { name: 'Oil Change', slug: 'oil', iconName: 'droplet', pinColor: '#f59e0b', displayOrder: 4 }
  ];

  const dbCategories = {};

  for (const cat of defaultCategories) {
    const createdCat = await prisma.serviceType.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        iconName: cat.iconName,
        pinColor: cat.pinColor,
        displayOrder: cat.displayOrder
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        iconName: cat.iconName,
        pinColor: cat.pinColor,
        displayOrder: cat.displayOrder,
        isActive: true
      }
    });
    dbCategories[cat.slug] = createdCat.id;
    console.log(`Seeded/Upserted category: ${cat.name} (ID: ${createdCat.id})`);
  }

  // 2. Fetch all users
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} existing users. Migrating relationships...`);

  let updatedCount = 0;
  for (const user of users) {
    const userRoleStr = user.role.toLowerCase();
    
    // Map string role to new ServiceType id
    let targetTypeId = null;
    if (userRoleStr === 'driver') {
      targetTypeId = dbCategories['driver'];
    } else if (userRoleStr === 'workshop') {
      targetTypeId = dbCategories['workshop'];
    } else if (userRoleStr === 'oil') {
      targetTypeId = dbCategories['oil'];
    } else if (userRoleStr === 'visitor') {
      targetTypeId = dbCategories['visitor'];
    }

    if (targetTypeId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { serviceTypeId: targetTypeId }
      });
      updatedCount++;
    }
  }

  console.log(`Successfully migrated ${updatedCount} users to dynamic categories!`);
}

main()
  .catch((e) => {
    console.error('Error seeding and migrating data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
