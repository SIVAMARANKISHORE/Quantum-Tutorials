export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Design",
  "Operations",
  "Legal",
];

export const ROLES = {
  Engineering: ["Software Engineer", "Senior Engineer", "Tech Lead", "Engineering Manager", "DevOps Engineer"],
  Marketing: ["Marketing Analyst", "Content Strategist", "SEO Specialist", "Brand Manager", "CMO"],
  Sales: ["Sales Rep", "Account Executive", "Sales Manager", "VP of Sales", "Business Developer"],
  "Human Resources": ["HR Generalist", "Recruiter", "HR Manager", "Talent Specialist", "CHRO"],
  Finance: ["Financial Analyst", "Accountant", "Finance Manager", "CFO", "Controller"],
  Design: ["UX Designer", "UI Designer", "Product Designer", "Design Lead", "Creative Director"],
  Operations: ["Operations Analyst", "Project Manager", "COO", "Process Specialist", "Ops Manager"],
  Legal: ["Legal Counsel", "Compliance Officer", "Attorney", "Paralegal", "General Counsel"],
};

export const STATUS_OPTIONS = ["Active", "Inactive", "On Leave"];

export const initialEmployees = [
  { id: 1, name: "Arjun Sharma", email: "arjun.sharma@corp.com", phone: "+91 98765 43210", department: "Engineering", role: "Tech Lead", status: "Active", salary: 95000, joinDate: "2020-03-15", avatar: "AS", location: "Bangalore", gender: "Male" },
  { id: 2, name: "Priya Nair", email: "priya.nair@corp.com", phone: "+91 91234 56789", department: "Design", role: "Product Designer", status: "Active", salary: 78000, joinDate: "2021-07-01", avatar: "PN", location: "Mumbai", gender: "Female" },
  { id: 3, name: "Rohan Mehta", email: "rohan.mehta@corp.com", phone: "+91 87654 32109", department: "Marketing", role: "Brand Manager", status: "Active", salary: 72000, joinDate: "2019-11-20", avatar: "RM", location: "Delhi", gender: "Male" },
  { id: 4, name: "Sneha Patel", email: "sneha.patel@corp.com", phone: "+91 76543 21098", department: "Finance", role: "Financial Analyst", status: "On Leave", salary: 68000, joinDate: "2022-01-10", avatar: "SP", location: "Ahmedabad", gender: "Female" },
  { id: 5, name: "Vikram Singh", email: "vikram.singh@corp.com", phone: "+91 65432 10987", department: "Sales", role: "Sales Manager", status: "Active", salary: 82000, joinDate: "2018-06-05", avatar: "VS", location: "Hyderabad", gender: "Male" },
  { id: 6, name: "Anjali Rao", email: "anjali.rao@corp.com", phone: "+91 54321 09876", department: "Human Resources", role: "HR Manager", status: "Active", salary: 70000, joinDate: "2020-09-14", avatar: "AR", location: "Chennai", gender: "Female" },
  { id: 7, name: "Karan Gupta", email: "karan.gupta@corp.com", phone: "+91 43210 98765", department: "Engineering", role: "Software Engineer", status: "Active", salary: 65000, joinDate: "2023-02-28", avatar: "KG", location: "Pune", gender: "Male" },
  { id: 8, name: "Meera Krishnan", email: "meera.krishnan@corp.com", phone: "+91 32109 87654", department: "Legal", role: "Legal Counsel", status: "Inactive", salary: 90000, joinDate: "2017-05-30", avatar: "MK", location: "Kochi", gender: "Female" },
  { id: 9, name: "Aditya Kumar", email: "aditya.kumar@corp.com", phone: "+91 21098 76543", department: "Operations", role: "Project Manager", status: "Active", salary: 75000, joinDate: "2021-04-18", avatar: "AK", location: "Kolkata", gender: "Male" },
  { id: 10, name: "Divya Shetty", email: "divya.shetty@corp.com", phone: "+91 10987 65432", department: "Design", role: "UX Designer", status: "Active", salary: 71000, joinDate: "2022-08-22", avatar: "DS", location: "Bangalore", gender: "Female" },
  { id: 11, name: "Rahul Joshi", email: "rahul.joshi@corp.com", phone: "+91 99887 76655", department: "Engineering", role: "DevOps Engineer", status: "Active", salary: 88000, joinDate: "2019-01-07", avatar: "RJ", location: "Noida", gender: "Male" },
  { id: 12, name: "Kavya Reddy", email: "kavya.reddy@corp.com", phone: "+91 88776 65544", department: "Marketing", role: "SEO Specialist", status: "Active", salary: 58000, joinDate: "2023-06-12", avatar: "KR", location: "Hyderabad", gender: "Female" },
  { id: 13, name: "Siddharth Bose", email: "siddharth.bose@corp.com", phone: "+91 77665 54433", department: "Finance", role: "Accountant", status: "On Leave", salary: 60000, joinDate: "2021-12-01", avatar: "SB", location: "Kolkata", gender: "Male" },
  { id: 14, name: "Ishaan Tiwari", email: "ishaan.tiwari@corp.com", phone: "+91 66554 43322", department: "Sales", role: "Account Executive", status: "Active", salary: 63000, joinDate: "2022-03-09", avatar: "IT", location: "Lucknow", gender: "Male" },
  { id: 15, name: "Nandini Desai", email: "nandini.desai@corp.com", phone: "+91 55443 32211", department: "Human Resources", role: "Recruiter", status: "Active", salary: 55000, joinDate: "2023-09-01", avatar: "ND", location: "Surat", gender: "Female" },
];

export const AVATAR_COLORS = [
  "#6C63FF", "#FF6584", "#43D9AD", "#F7B731", "#FC5C65",
  "#20BF6B", "#778CA3", "#EB3B5A", "#3867D6", "#8854D0",
  "#0FB9B1", "#F7B731", "#A55EEA", "#4B7BEC", "#2BCBBA",
];

export function getAvatarColor(id) {
  return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
}
