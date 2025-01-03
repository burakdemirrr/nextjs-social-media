const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete all data in order to respect foreign key constraints
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.tweet.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();

  console.log('Database has been reset');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 