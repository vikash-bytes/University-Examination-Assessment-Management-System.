const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ==========================================
   In-Memory Database
========================================== */

let depts = [
  { id: 1, name: "Computer Science", code: "CS", head: "Dr. Smith", created_at: new Date("2024-01-10") },
  { id: 2, name: "Mathematics", code: "MATH", head: "Dr. Jones", created_at: new Date("2024-01-12") },
  { id: 3, name: "Physics", code: "PHY", head: "Dr. Brown", created_at: new Date("2024-01-15") },
];

let users = [
  { id: 1, name: "Admin User", email: "admin@uni.edu", password: "demo123", role: "admin", status: "active", created_at: new Date("2024-01-01") },
  { id: 2, name: "Alice Johnson", email: "student@uni.edu", password: "demo123", role: "student", department_id: 1, status: "active", created_at: new Date("2024-01-05") },
  { id: 3, name: "Prof. Williams", email: "teacher@uni.edu", password: "demo123", role: "teacher", department_id: 1, status: "active", created_at: new Date("2024-01-03") },
  { id: 4, name: "Bob Chen", email: "bob@uni.edu", password: "demo123", role: "student", department_id: 2, status: "active", created_at: new Date("2024-01-06") },
  { id: 5, name: "Dr. Patel", email: "patel@uni.edu", password: "demo123", role: "teacher", department_id: 2, status: "active", created_at: new Date("2024-01-04") },
  { id: 6, name: "Carol Davis", email: "carol@uni.edu", password: "demo123", role: "student", department_id: 1, status: "active", created_at: new Date("2024-01-07") },
];

let courses = [
  { id: 1, name: "Data Structures & Algorithms", code: "CS301", department_id: 1, teacher_id: 3, credits: 4, description: "Fundamental data structures and algorithms.", created_at: new Date("2024-01-15") },
  { id: 2, name: "Linear Algebra", code: "MATH201", department_id: 2, teacher_id: 5, credits: 3, description: "Vectors, matrices, and linear transformations.", created_at: new Date("2024-01-16") },
  { id: 3, name: "Introduction to Programming", code: "CS101", department_id: 1, teacher_id: 3, credits: 3, description: "Basics of programming with Python.", created_at: new Date("2024-01-17") },
];

let enrollments = [
  { id: 1, student_id: 2, course_id: 1, enrolled_at: new Date("2024-01-20") },
  { id: 2, student_id: 2, course_id: 3, enrolled_at: new Date("2024-01-20") },
  { id: 3, student_id: 4, course_id: 2, enrolled_at: new Date("2024-01-21") },
  { id: 4, student_id: 6, course_id: 1, enrolled_at: new Date("2024-01-21") },
  { id: 5, student_id: 6, course_id: 3, enrolled_at: new Date("2024-01-22") },
];

let exams = [
  {
    id: 1, title: "Midterm Exam - DSA", course_id: 1, teacher_id: 3,
    start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    end_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    duration: 120, total_marks: 100, pass_marks: 40, status: "published",
    instructions: "Answer all questions. No negative marking.", created_at: new Date("2024-02-01"),
  },
  {
    id: 2, title: "Quiz 1 - Introduction", course_id: 3, teacher_id: 3,
    start_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    end_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    duration: 60, total_marks: 50, pass_marks: 25, status: "published",
    instructions: "Open book quiz.", created_at: new Date("2024-02-02"),
  },
  {
    id: 3, title: "Linear Algebra Midterm", course_id: 2, teacher_id: 5,
    start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    end_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    duration: 180, total_marks: 100, pass_marks: 50, status: "draft",
    instructions: "Show all working.", created_at: new Date("2024-02-03"),
  },
];

let questions = [
  { id: 1, exam_id: 1, text: "What is the time complexity of binary search?", type: "mcq", marks: 10, options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct_option: 1 },
  { id: 2, exam_id: 1, text: "Which data structure uses LIFO?", type: "mcq", marks: 10, options: ["Queue", "Stack", "Array", "Tree"], correct_option: 1 },
  { id: 3, exam_id: 1, text: "Explain the difference between BFS and DFS.", type: "essay", marks: 20, options: null, correct_option: null },
  { id: 4, exam_id: 1, text: "What does the following code output: print([1,2,3][1])?", type: "short_answer", marks: 10, options: null, correct_option: null },
  { id: 5, exam_id: 1, text: "Merge sort has a worst case complexity of O(n log n).", type: "true_false", marks: 10, options: ["True", "False"], correct_option: 0 },
  { id: 6, exam_id: 2, text: "Python is a statically typed language.", type: "true_false", marks: 10, options: ["True", "False"], correct_option: 1 },
  { id: 7, exam_id: 2, text: "Which keyword is used to define a function in Python?", type: "mcq", marks: 10, options: ["func", "def", "function", "define"], correct_option: 1 },
  { id: 8, exam_id: 2, text: "What is the output of: 2 ** 3 in Python?", type: "short_answer", marks: 10, options: null, correct_option: null },
  { id: 9, exam_id: 3, text: "What is the determinant of the identity matrix?", type: "mcq", marks: 10, options: ["0", "1", "-1", "undefined"], correct_option: 1 },
  { id: 10, exam_id: 3, text: "Explain eigenvalues and eigenvectors.", type: "essay", marks: 30, options: null, correct_option: null },
];

let submissions = [
  {
    id: 1, exam_id: 1, student_id: 2, status: "submitted",
    answers: { 1: 1, 2: 1, 3: "BFS explores level by level using a queue. DFS goes deep first using a stack.", 4: "2", 5: 0 },
    score: 70, graded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    feedback: "Good understanding of core concepts. Improve DFS explanation.",
  },
  {
    id: 2, exam_id: 1, student_id: 6, status: "submitted",
    answers: { 1: 1, 2: 1, 3: "BFS uses queue, DFS uses stack.", 4: "2", 5: 0 },
    score: 55, graded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 110 * 60 * 1000),
    feedback: "Needs more detail in essay answers.",
  },
];

let logs = [
  { id: 1, user_id: 1, user_name: "Admin User", user_role: "admin", action: "System initialized", created_at: new Date(Date.now() - 5 * 60 * 1000) },
  { id: 2, user_id: 3, user_name: "Prof. Williams", user_role: "teacher", action: "Created exam: Midterm Exam - DSA", created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: 3, user_id: 2, user_name: "Alice Johnson", user_role: "student", action: "Submitted exam: Midterm Exam - DSA", created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000) },
  { id: 4, user_id: 3, user_name: "Prof. Williams", user_role: "teacher", action: "Published results for: Midterm Exam - DSA", created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: 5, user_id: 1, user_name: "Admin User", user_role: "admin", action: "Added teacher: Dr. Patel", created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
];

let nextId = { dept: 4, user: 7, course: 4, exam: 4, question: 11, submission: 3, log: 6 };

/* ==========================================
   Helper Functions
========================================== */

const addLog = (userId, userName, userRole, action) => {
  logs.push({ id: nextId.log++, user_id: userId, user_name: userName, user_role: userRole, action, created_at: new Date() });
};

const authenticate = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return null;
  }
  const token = auth.split(" ")[1];
  const parts = token.split("-");
  if (parts.length < 2) { res.status(401).json({ success: false, message: "Invalid token" }); return null; }
  const userId = parseInt(parts[1]);
  const user = users.find(u => u.id === userId);
  if (!user) { res.status(401).json({ success: false, message: "User not found" }); return null; }
  return user;
};

/* ==========================================
   Auth Routes
========================================== */

app.get("/", (req, res) => res.json({ message: "University Exam System API 🚀" }));

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (user.password !== password) return res.status(401).json({ success: false, message: "Invalid password" });
  if (user.status !== "active") return res.status(403).json({ success: false, message: "Account is inactive" });
  const token = `token-${user.id}-${Date.now()}`;
  addLog(user.id, user.name, user.role, `User logged in`);
  res.json({ success: true, message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email, role: user.role, department_id: user.department_id } });
});

app.get("/auth/me", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.put("/auth/change-password", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { current_password, new_password } = req.body;
  if (user.password !== current_password) return res.status(400).json({ success: false, message: "Current password is incorrect" });
  user.password = new_password;
  res.json({ success: true, message: "Password changed successfully" });
});

/* ==========================================
   Admin Routes
========================================== */

app.get("/admin/dashboard", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const students = users.filter(u => u.role === "student");
  const teachers = users.filter(u => u.role === "teacher");

  // Last 7 days registrations
  const registrations = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
    return {
      date: label,
      students: users.filter(u => u.role === "student" && new Date(u.created_at).toDateString() === d.toDateString()).length,
      teachers: users.filter(u => u.role === "teacher" && new Date(u.created_at).toDateString() === d.toDateString()).length,
    };
  });

  const exams_by_dept = depts.map(d => ({
    dept: d.code,
    count: exams.filter(e => courses.find(c => c.id === e.course_id)?.department_id === d.id).length,
  }));

  res.json({
    stats: { students: students.length, teachers: teachers.length, departments: depts.length, courses: courses.length, exams: exams.length, submissions: submissions.length },
    registrations,
    exams_by_dept,
    recent_activity: logs.slice(-10).reverse(),
  });
});

// Departments
app.get("/admin/departments", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const result = depts.map(d => ({
    ...d,
    teacher_count: users.filter(u => u.role === "teacher" && u.department_id === d.id).length,
    student_count: users.filter(u => u.role === "student" && u.department_id === d.id).length,
    course_count: courses.filter(c => c.department_id === d.id).length,
  }));
  res.json({ success: true, departments: result });
});

app.post("/admin/departments", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { name, code, head } = req.body;
  if (!name || !code) return res.status(400).json({ success: false, message: "Name and code are required" });
  const dept = { id: nextId.dept++, name, code, head: head || "", created_at: new Date() };
  depts.push(dept);
  addLog(user.id, user.name, user.role, `Created department: ${name}`);
  res.status(201).json({ success: true, department: dept });
});

app.put("/admin/departments/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const dept = depts.find(d => d.id === parseInt(req.params.id));
  if (!dept) return res.status(404).json({ success: false, message: "Department not found" });
  Object.assign(dept, req.body);
  addLog(user.id, user.name, user.role, `Updated department: ${dept.name}`);
  res.json({ success: true, department: dept });
});

app.delete("/admin/departments/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const idx = depts.findIndex(d => d.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Department not found" });
  const name = depts[idx].name;
  depts.splice(idx, 1);
  addLog(user.id, user.name, user.role, `Deleted department: ${name}`);
  res.json({ success: true, message: "Department deleted" });
});

// Teachers
app.get("/admin/teachers", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { search } = req.query;
  let result = users.filter(u => u.role === "teacher");
  if (search) result = result.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  result = result.map(t => ({
    ...t, password: undefined,
    department_name: depts.find(d => d.id === t.department_id)?.name || "N/A",
    course_count: courses.filter(c => c.teacher_id === t.id).length,
    exam_count: exams.filter(e => e.teacher_id === t.id).length,
  }));
  res.json({ success: true, teachers: result });
});

app.post("/admin/teachers", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { name, email, password, department_id } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email, password required" });
  if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: "Email already exists" });
  const teacher = { id: nextId.user++, name, email, password, role: "teacher", department_id: parseInt(department_id), status: "active", created_at: new Date() };
  users.push(teacher);
  addLog(user.id, user.name, user.role, `Added teacher: ${name}`);
  res.status(201).json({ success: true, teacher: { ...teacher, password: undefined } });
});

app.put("/admin/teachers/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const teacher = users.find(u => u.id === parseInt(req.params.id) && u.role === "teacher");
  if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
  const { name, email, department_id } = req.body;
  if (name) teacher.name = name;
  if (email) teacher.email = email;
  if (department_id) teacher.department_id = parseInt(department_id);
  addLog(user.id, user.name, user.role, `Updated teacher: ${teacher.name}`);
  res.json({ success: true, teacher: { ...teacher, password: undefined } });
});

// Students
app.get("/admin/students", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { search } = req.query;
  let result = users.filter(u => u.role === "student");
  if (search) result = result.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  result = result.map(s => ({
    ...s, password: undefined,
    department_name: depts.find(d => d.id === s.department_id)?.name || "N/A",
    enrolled_courses: enrollments.filter(e => e.student_id === s.id).length,
  }));
  res.json({ success: true, students: result });
});

app.post("/admin/students", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { name, email, password, department_id } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email, password required" });
  if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: "Email already exists" });
  const student = { id: nextId.user++, name, email, password, role: "student", department_id: parseInt(department_id), status: "active", created_at: new Date() };
  users.push(student);
  addLog(user.id, user.name, user.role, `Added student: ${name}`);
  res.status(201).json({ success: true, student: { ...student, password: undefined } });
});

app.put("/admin/users/:id/status", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const target = users.find(u => u.id === parseInt(req.params.id));
  if (!target) return res.status(404).json({ success: false, message: "User not found" });
  target.status = req.body.status;
  addLog(user.id, user.name, user.role, `Set ${target.name} status to ${target.status}`);
  res.json({ success: true, message: "Status updated" });
});

// Admin Courses
app.get("/admin/courses", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const result = courses.map(c => ({
    ...c,
    department_name: depts.find(d => d.id === c.department_id)?.name || "N/A",
    teacher_name: users.find(u => u.id === c.teacher_id)?.name || "N/A",
    student_count: enrollments.filter(e => e.course_id === c.id).length,
  }));
  res.json({ success: true, courses: result });
});

app.post("/admin/courses/assign", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { name, code, department_id, teacher_id, credits, description } = req.body;
  if (!name || !code) return res.status(400).json({ success: false, message: "Name and code required" });
  const course = { id: nextId.course++, name, code, department_id: parseInt(department_id), teacher_id: parseInt(teacher_id), credits: parseInt(credits) || 3, description: description || "", created_at: new Date() };
  courses.push(course);
  addLog(user.id, user.name, user.role, `Created course: ${name}`);
  res.status(201).json({ success: true, course });
});

// Logs
app.get("/admin/logs", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { role, search } = req.query;
  let result = [...logs].reverse();
  if (role) result = result.filter(l => l.user_role === role);
  if (search) result = result.filter(l => l.action.toLowerCase().includes(search.toLowerCase()) || l.user_name.toLowerCase().includes(search.toLowerCase()));
  res.json({ success: true, logs: result });
});

/* ==========================================
   Teacher Routes
========================================== */

app.get("/teacher/dashboard", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const myCourses = courses.filter(c => c.teacher_id === user.id);
  const myExams = exams.filter(e => e.teacher_id === user.id);
  const studentIds = new Set(enrollments.filter(e => myCourses.map(c => c.id).includes(e.course_id)).map(e => e.student_id));
  const mySubmissions = submissions.filter(s => myExams.map(e => e.id).includes(s.exam_id));
  const pendingGrading = mySubmissions.filter(s => s.status === "submitted" && !s.graded_at).length;

  const recentExam = myExams.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  let score_distribution = [];
  if (recentExam) {
    const subs = submissions.filter(s => s.exam_id === recentExam.id && s.score != null);
    const ranges = [{ range: "0-20", min: 0, max: 20 }, { range: "21-40", min: 21, max: 40 }, { range: "41-60", min: 41, max: 60 }, { range: "61-80", min: 61, max: 80 }, { range: "81-100", min: 81, max: 100 }];
    score_distribution = ranges.map(r => ({ range: r.range, count: subs.filter(s => s.score >= r.min && s.score <= r.max).length }));
  }

  res.json({
    stats: { courses: myCourses.length, exams: myExams.length, students: studentIds.size, pending_grading: pendingGrading },
    recent_exams: myExams.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    score_distribution,
  });
});

app.get("/teacher/courses", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const result = courses.filter(c => c.teacher_id === user.id).map(c => ({
    ...c,
    department_name: depts.find(d => d.id === c.department_id)?.name || "N/A",
    student_count: enrollments.filter(e => e.course_id === c.id).length,
    exam_count: exams.filter(e => e.course_id === c.id).length,
  }));
  res.json({ success: true, courses: result });
});

app.post("/teacher/courses", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { name, code, description, credits } = req.body;
  if (!name || !code) return res.status(400).json({ success: false, message: "Name and code required" });
  const course = { id: nextId.course++, name, code, description: description || "", credits: parseInt(credits) || 3, teacher_id: user.id, department_id: user.department_id, created_at: new Date() };
  courses.push(course);
  addLog(user.id, user.name, user.role, `Created course: ${name}`);
  res.status(201).json({ success: true, course });
});

app.put("/teacher/courses/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const course = courses.find(c => c.id === parseInt(req.params.id) && c.teacher_id === user.id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  Object.assign(course, req.body);
  res.json({ success: true, course });
});

// Exams
app.get("/teacher/exams", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const result = exams.filter(e => e.teacher_id === user.id).map(e => ({
    ...e,
    course_name: courses.find(c => c.id === e.course_id)?.name || "N/A",
    question_count: questions.filter(q => q.exam_id === e.id).length,
    submission_count: submissions.filter(s => s.exam_id === e.id).length,
  }));
  res.json({ success: true, exams: result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) });
});

app.get("/teacher/exams/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.id));
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  res.json({ success: true, exam: { ...exam, questions: questions.filter(q => q.exam_id === exam.id) } });
});

app.post("/teacher/exams", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const { title, course_id, start_time, end_time, duration, total_marks, pass_marks, instructions } = req.body;
  if (!title || !course_id) return res.status(400).json({ success: false, message: "Title and course required" });
  const exam = { id: nextId.exam++, title, course_id: parseInt(course_id), teacher_id: user.id, start_time: new Date(start_time), end_time: new Date(end_time), duration: parseInt(duration) || 60, total_marks: parseInt(total_marks) || 100, pass_marks: parseInt(pass_marks) || 40, instructions: instructions || "", status: "draft", created_at: new Date() };
  exams.push(exam);
  addLog(user.id, user.name, user.role, `Created exam: ${title}`);
  res.status(201).json({ success: true, exam });
});

app.put("/teacher/exams/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.id) && e.teacher_id === user.id);
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  const { status, ...rest } = req.body;
  Object.assign(exam, rest);
  if (status) { exam.status = status; addLog(user.id, user.name, user.role, `Published exam: ${exam.title}`); }
  res.json({ success: true, exam });
});

app.delete("/teacher/exams/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const idx = exams.findIndex(e => e.id === parseInt(req.params.id) && e.teacher_id === user.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Exam not found" });
  const title = exams[idx].title;
  exams.splice(idx, 1);
  addLog(user.id, user.name, user.role, `Deleted exam: ${title}`);
  res.json({ success: true, message: "Exam deleted" });
});

// Questions
app.post("/teacher/exams/:examId/questions", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.examId) && e.teacher_id === user.id);
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  const { text, type, marks, options, correct_option } = req.body;
  const q = { id: nextId.question++, exam_id: exam.id, text, type, marks: parseInt(marks) || 10, options: options || null, correct_option: correct_option != null ? parseInt(correct_option) : null };
  questions.push(q);
  res.status(201).json({ success: true, question: q });
});

app.put("/teacher/exams/:examId/questions/:qId", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const q = questions.find(q => q.id === parseInt(req.params.qId) && q.exam_id === parseInt(req.params.examId));
  if (!q) return res.status(404).json({ success: false, message: "Question not found" });
  Object.assign(q, req.body);
  res.json({ success: true, question: q });
});

app.delete("/teacher/exams/:examId/questions/:qId", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const idx = questions.findIndex(q => q.id === parseInt(req.params.qId) && q.exam_id === parseInt(req.params.examId));
  if (idx === -1) return res.status(404).json({ success: false, message: "Question not found" });
  questions.splice(idx, 1);
  res.json({ success: true, message: "Question deleted" });
});

// Submissions / Grading
app.get("/teacher/exams/:examId/submissions", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.examId));
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  const result = submissions.filter(s => s.exam_id === exam.id).map(s => ({
    ...s,
    student_name: users.find(u => u.id === s.student_id)?.name || "Unknown",
    student_email: users.find(u => u.id === s.student_id)?.email || "",
  }));
  res.json({ success: true, submissions: result, exam });
});

app.put("/teacher/submissions/:subId/grade", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const sub = submissions.find(s => s.id === parseInt(req.params.subId));
  if (!sub) return res.status(404).json({ success: false, message: "Submission not found" });
  sub.score = parseInt(req.body.score);
  sub.feedback = req.body.feedback || "";
  sub.graded_at = new Date();
  sub.status = "graded";
  const exam = exams.find(e => e.id === sub.exam_id);
  addLog(user.id, user.name, user.role, `Graded submission for: ${exam?.title || "exam"}`);
  res.json({ success: true, submission: sub });
});

app.post("/teacher/exams/:examId/publish", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.examId) && e.teacher_id === user.id);
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  exam.status = "published";
  addLog(user.id, user.name, user.role, `Published results for: ${exam.title}`);
  res.json({ success: true, message: "Results published" });
});

// Analytics
app.get("/teacher/exams/:examId/analytics", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.examId));
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  const subs = submissions.filter(s => s.exam_id === exam.id && s.score != null);
  const scores = subs.map(s => s.score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const max = scores.length ? Math.max(...scores) : 0;
  const min = scores.length ? Math.min(...scores) : 0;
  const pass_count = scores.filter(s => s >= exam.pass_marks).length;
  const ranges = [{ range: "0-20", min: 0, max: 20 }, { range: "21-40", min: 21, max: 40 }, { range: "41-60", min: 41, max: 60 }, { range: "61-80", min: 61, max: 80 }, { range: "81-100", min: 81, max: 100 }];
  const distribution = ranges.map(r => ({ range: r.range, count: scores.filter(s => s >= r.min && s <= r.max).length }));

  res.json({
    success: true,
    exam: { ...exam, course_name: courses.find(c => c.id === exam.course_id)?.name },
    stats: { total_submissions: subs.length, avg_score: avg, max_score: max, min_score: min, pass_count, fail_count: subs.length - pass_count, pass_rate: subs.length ? Math.round((pass_count / subs.length) * 100) : 0 },
    score_distribution: distribution,
    submissions: subs.map(s => ({ student_name: users.find(u => u.id === s.student_id)?.name, score: s.score, submitted_at: s.submitted_at })),
  });
});

/* ==========================================
   Student Routes
========================================== */

app.get("/student/dashboard", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const myEnrollments = enrollments.filter(e => e.student_id === user.id);
  const myCourseIds = myEnrollments.map(e => e.course_id);
  const myExams = exams.filter(e => myCourseIds.includes(e.course_id) && e.status === "published");
  const now = new Date();
  const upcoming = myExams.filter(e => new Date(e.end_time) > now);
  const mySubmissions = submissions.filter(s => s.student_id === user.id && s.score != null);
  const avg_score = mySubmissions.length ? Math.round(mySubmissions.reduce((a, b) => a + b.score, 0) / mySubmissions.length) : null;

  const recent_results = mySubmissions.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)).slice(0, 5).map(s => {
    const exam = exams.find(e => e.id === s.exam_id);
    const course = courses.find(c => c.id === exam?.course_id);
    return { id: s.id, exam_title: exam?.title, course_name: course?.name, score: s.score, total_marks: exam?.total_marks };
  });

  const upcoming_exams = upcoming.slice(0, 5).map(e => ({
    ...e, course_name: courses.find(c => c.id === e.course_id)?.name,
  }));

  res.json({
    stats: { courses: myCourseIds.length, upcoming_exams: upcoming.length, completed_exams: mySubmissions.length, avg_score },
    upcoming_exams,
    recent_results,
  });
});

app.get("/student/courses", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const myEnrollments = enrollments.filter(e => e.student_id === user.id);
  const result = myEnrollments.map(enr => {
    const course = courses.find(c => c.id === enr.course_id);
    const teacher = users.find(u => u.id === course?.teacher_id);
    return { ...course, teacher_name: teacher?.name, enrolled_at: enr.enrolled_at };
  }).filter(Boolean);
  res.json({ success: true, courses: result });
});

app.get("/student/exams", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const myCourseIds = enrollments.filter(e => e.student_id === user.id).map(e => e.course_id);
  const result = exams.filter(e => myCourseIds.includes(e.course_id) && e.status === "published").map(e => {
    const sub = submissions.find(s => s.exam_id === e.id && s.student_id === user.id);
    return { ...e, course_name: courses.find(c => c.id === e.course_id)?.name, submission: sub ? { status: sub.status, score: sub.score } : null };
  });
  res.json({ success: true, exams: result.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)) });
});

app.get("/student/exams/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.id));
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  const qs = questions.filter(q => q.exam_id === exam.id).map(q => ({ ...q, correct_option: undefined })); // hide answers
  res.json({ success: true, exam: { ...exam, questions: qs, course_name: courses.find(c => c.id === exam.course_id)?.name } });
});

app.post("/student/exams/:id/start", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.id));
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  const existing = submissions.find(s => s.exam_id === exam.id && s.student_id === user.id);
  if (existing) return res.json({ success: true, submission_id: existing.id });
  addLog(user.id, user.name, user.role, `Started exam: ${exam.title}`);
  res.json({ success: true });
});

app.post("/student/exams/:id/submit", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const exam = exams.find(e => e.id === parseInt(req.params.id));
  if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
  const existing = submissions.find(s => s.exam_id === exam.id && s.student_id === user.id);
  if (existing) return res.status(400).json({ success: false, message: "Already submitted" });

  const { answers } = req.body;

  // Auto-grade MCQ and true/false
  let auto_score = 0;
  questions.filter(q => q.exam_id === exam.id).forEach(q => {
    if ((q.type === "mcq" || q.type === "true_false") && q.correct_option != null) {
      const ans = answers[q.id];
      if (parseInt(ans) === q.correct_option) auto_score += q.marks;
    }
  });

  const sub = { id: nextId.submission++, exam_id: exam.id, student_id: user.id, status: "submitted", answers, score: auto_score, submitted_at: new Date(), graded_at: null, feedback: "" };
  submissions.push(sub);
  addLog(user.id, user.name, user.role, `Submitted exam: ${exam.title}`);
  res.json({ success: true, submission: sub, auto_score });
});

app.get("/student/results", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const result = submissions.filter(s => s.student_id === user.id).map(s => {
    const exam = exams.find(e => e.id === s.exam_id);
    const course = courses.find(c => c.id === exam?.course_id);
    return { ...s, exam_title: exam?.title, course_name: course?.name, total_marks: exam?.total_marks, pass_marks: exam?.pass_marks };
  });
  res.json({ success: true, results: result.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)) });
});

app.get("/student/results/:id", (req, res) => {
  const user = authenticate(req, res);
  if (!user) return;
  const sub = submissions.find(s => s.id === parseInt(req.params.id) && s.student_id === user.id);
  if (!sub) return res.status(404).json({ success: false, message: "Result not found" });
  const exam = exams.find(e => e.id === sub.exam_id);
  const course = courses.find(c => c.id === exam?.course_id);
  const qs = questions.filter(q => q.exam_id === sub.exam_id);
  res.json({ success: true, result: { ...sub, exam_title: exam?.title, course_name: course?.name, total_marks: exam?.total_marks, pass_marks: exam?.pass_marks, questions: qs } });
});

/* ==========================================
   Start Server
========================================== */

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
