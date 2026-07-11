require('dotenv').config();
const { PrismaClient } = require('./lib/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const jobCategories = [
  {
    category: "Software & Technology",
    titles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Data Scientist",
      "Data Analyst",
      "DevOps Engineer",
      "Cloud Architect",
      "Mobile Developer (iOS/Android)",
      "QA Tester",
      "System Administrator",
      "AI/ML Engineer",
    ]
  },
  {
    category: "Design & UX/UI",
    titles: [
      "UX/UI Designer",
      "Product Designer",
      "Graphic Designer",
      "Web Designer",
      "Art Director",
      "Motion Graphic Designer"
    ]
  },
  {
    category: "Marketing & Growth",
    titles: [
      "Digital Marketing Manager",
      "SEO/SEM Specialist",
      "Content Writer",
      "Social Media Manager",
      "Performance Marketer",
      "Brand Manager"
    ]
  },
  {
    category: "Business & Management",
    titles: [
      "Product Manager",
      "Project Manager",
      "Business Analyst",
      "Operations Manager",
      "HR Manager",
      "Sales Executive",
      "Account Manager"
    ]
  },
  {
    category: "Finance & Accounting",
    titles: [
      "Accountant",
      "Financial Analyst",
      "Auditor",
      "Investment Banker",
      "Tax Consultant"
    ]
  }
];

const flattenJobPositions = () => {
  const result = [];
  jobCategories.forEach(group => {
    group.titles.forEach(title => {
      result.push({ category: group.category, title });
    });
  });
  return result;
};

async function main() {
  console.log("Starting seed...");
  try {
    const positions = flattenJobPositions();
    let count = 0;
    for (const pos of positions) {
      await prisma.jobPosition.upsert({
        where: { title: pos.title },
        update: {},
        create: { category: pos.category, title: pos.title }
      });
      count++;
    }
    console.log(`Successfully seeded ${count} positions!`);
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
