const bcrypt = require('bcryptjs')
const db = require('./db')

const DEMO_USERS = [
  { name: 'Ravi Pandey', email: 'student@skillbridge.in', password: 'password123', role: 'student', college: 'IIT Bombay • B.Tech CSE', skillScore: 72 },
  { name: 'Priya Sharma', email: 'recruiter@skillbridge.in', password: 'password123', role: 'recruiter', company: 'Google India' },
  { name: 'Dr. Amit Kumar', email: 'faculty@skillbridge.in', password: 'password123', role: 'faculty', college: 'IIT Bombay' },
  { name: 'IAS Rajesh Patil', email: 'govt@skillbridge.in', password: 'password123', role: 'govt' },
  { name: 'IIT Bombay Admin', email: 'institution@skillbridge.in', password: 'password123', role: 'institution', college: 'IIT Bombay' },
]

const DEMO_INTERNSHIPS = [
  { title: 'Software Engineer Intern', company: 'Google India', location: 'Bangalore', stipend: '₹80,000/mo', duration: '6 months', skills: ['Python', 'ML', 'TensorFlow'], type: 'AI/ML', status: 'active', logo: '🌐', postedAt: new Date() },
  { title: 'Full Stack Developer Intern', company: 'Flipkart', location: 'Bangalore', stipend: '₹60,000/mo', duration: '3 months', skills: ['React', 'Node.js', 'MongoDB'], type: 'Web Dev', status: 'active', logo: '🛒', postedAt: new Date() },
  { title: 'Data Science Intern', company: 'Microsoft', location: 'Hyderabad', stipend: '₹70,000/mo', duration: '6 months', skills: ['Python', 'SQL', 'Power BI'], type: 'Data', status: 'active', logo: '💻', postedAt: new Date() },
  { title: 'Cloud Engineer Intern', company: 'Amazon AWS', location: 'Pune', stipend: '₹65,000/mo', duration: '4 months', skills: ['AWS', 'Docker', 'Kubernetes'], type: 'Cloud', status: 'active', logo: '☁️', postedAt: new Date() },
  { title: 'UI/UX Design Intern', company: 'Swiggy', location: 'Bangalore', stipend: '₹45,000/mo', duration: '3 months', skills: ['Figma', 'React', 'CSS'], type: 'Design', status: 'active', logo: '🍕', postedAt: new Date() },
  { title: 'Cybersecurity Analyst Intern', company: 'Infosys', location: 'Mysore', stipend: '₹40,000/mo', duration: '6 months', skills: ['Network Security', 'Python', 'Ethical Hacking'], type: 'Security', status: 'active', logo: '🔒', postedAt: new Date() },
]

const DEMO_MENTORS = [
  { name: 'Arjun Mehta', role: 'Senior SDE at Google', skills: ['DSA', 'System Design', 'ML'], rating: 4.9, sessions: 234, avatar: 'A', available: true },
  { name: 'Sneha Iyer', role: 'Data Scientist at Microsoft', skills: ['Python', 'ML', 'Statistics'], rating: 4.8, sessions: 189, avatar: 'S', available: true },
  { name: 'Vikram Rao', role: 'DevOps Lead at Amazon', skills: ['AWS', 'Docker', 'CI/CD'], rating: 4.7, sessions: 156, avatar: 'V', available: false },
  { name: 'Pooja Nair', role: 'Product Manager at Flipkart', skills: ['Product Strategy', 'Analytics', 'UX'], rating: 4.9, sessions: 312, avatar: 'P', available: true },
  { name: 'Rahul Gupta', role: 'Cybersecurity Expert at CERT-In', skills: ['Network Security', 'Pen Testing', 'Compliance'], rating: 4.6, sessions: 98, avatar: 'R', available: true },
  { name: 'Divya Krishnan', role: 'AI Researcher at IISc', skills: ['Deep Learning', 'NLP', 'Computer Vision'], rating: 5.0, sessions: 67, avatar: 'D', available: false },
]

async function seed() {
  try {
    const count = await db.users.count({})
    if (count > 0) { console.log('✅ DB already seeded'); return }

    const insertedUsers = []
    for (const u of DEMO_USERS) {
      const hash = await bcrypt.hash(u.password, 10)
      const inserted = await db.users.insert({
        ...u, password: hash, createdAt: new Date(), verified: true,
        // Give recruiter GSTIN and verified status
        ...(u.role === 'recruiter' ? { gstin: '07AAACG0297N1ZI', companyReg: 'U72200KA1998PTC048417', recruiterVerified: true } : {}),
        // Give student skills
        ...(u.role === 'student' ? { skills: ['Python', 'React', 'JavaScript', 'SQL'], bio: 'Passionate developer from IIT Bombay. Building the future with code.', github: 'github.com/ravipandey', linkedin: 'linkedin.com/in/ravipandey' } : {}),
      })
      insertedUsers.push(inserted)
    }

    const insertedInternships = []
    for (const i of DEMO_INTERNSHIPS) {
      // Link Google internship to recruiter (Priya Sharma = recruiter@skillbridge.in)
      const recruiter = insertedUsers.find(u => u.role === 'recruiter')
      const internship = await db.internships.insert({
        ...i,
        ...(i.company === 'Google India' ? { recruiterId: recruiter?._id } : {}),
      })
      insertedInternships.push(internship)
    }

    for (const m of DEMO_MENTORS) await db.mentors.insert(m)

    // Pre-seed demo applications so all portals are connected
    const student = insertedUsers.find(u => u.role === 'student')
    const googleInternship = insertedInternships.find(i => i.company === 'Google India')
    const flipkartInternship = insertedInternships.find(i => i.company === 'Flipkart')
    const msInternship = insertedInternships.find(i => i.company === 'Microsoft')

    if (student && googleInternship) {
      // Application 1: Shortlisted at Google
      await db.applications.insert({
        studentId: student._id,
        internshipId: googleInternship._id,
        internshipTitle: googleInternship.title,
        company: googleInternship.company,
        status: 'shortlisted',
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      })
      // Shortlisted notification
      await db.notifications.insert({
        userId: student._id,
        type: 'success',
        message: `🎉 You've been shortlisted for "Software Engineer Intern" at Google India! Prepare for the next round.`,
        read: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      })
    }
    if (student && flipkartInternship) {
      // Application 2: Hired at Flipkart
      await db.applications.insert({
        studentId: student._id,
        internshipId: flipkartInternship._id,
        internshipTitle: flipkartInternship.title,
        company: flipkartInternship.company,
        status: 'hired',
        appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      })
      await db.notifications.insert({
        userId: student._id,
        type: 'success',
        message: `🏆 Congratulations! You've been hired for "Full Stack Developer Intern" at Flipkart. Welcome aboard!`,
        read: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      })
    }
    if (student && msInternship) {
      // Application 3: Pending at Microsoft
      await db.applications.insert({
        studentId: student._id,
        internshipId: msInternship._id,
        internshipTitle: msInternship.title,
        company: msInternship.company,
        status: 'pending',
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      })
    }

    // Pre-seed skill assessment for student
    if (student) {
      await db.assessments.insert({
        studentId: student._id,
        skillScores: [
          { skill: 'JavaScript', score: 82 },
          { skill: 'React', score: 74 },
          { skill: 'Python', score: 91 },
          { skill: 'SQL', score: 68 },
          { skill: 'DSA', score: 76 },
          { skill: 'System Design', score: 55 },
        ],
        totalScore: 72,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      })
    }

    console.log('✅ Seeded demo data successfully with connected applications')
  } catch (e) { console.error('Seed error:', e.message) }
}

module.exports = seed
