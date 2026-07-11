export const jobCategories = [
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

// ฟังก์ชั่นสำหรับแปลงโครงสร้างจาก Array ซ้อนกันให้กลายเป็น list แบบแบนราบ (Flat) เพื่อนำไปเข้า Database ได้ง่ายๆ
export const flattenJobPositions = () => {
  const result: { category: string; title: string }[] = [];
  jobCategories.forEach(group => {
    group.titles.forEach(title => {
      result.push({ category: group.category, title });
    });
  });
  return result;
};
