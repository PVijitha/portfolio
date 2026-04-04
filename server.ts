import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const EXPERIENCE_FILE = path.join(DATA_DIR, "experience.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-portfolio-key";

// Ensure data and upload directories exist
async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const initFile = async (file: string, defaultData: any) => {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
    }
  };

  const sampleProjects = [
    {
      id: "1",
      title: "Healthcare Workflow Optimization",
      description:
        "A comprehensive UI/UX redesign for a US-based hospital management system, focusing on intuitive healthcare workflows.",
      category: "Web",
      tags: ["Healthcare", "UI/UX", "React", "Tailwind"],
      // imageUrl: healthcareImg,
      caseStudy: {
        problem:
          "Complex healthcare workflows were causing task inefficiency and user frustration among medical staff.",
        research:
          "Conducted stakeholder interviews and user journey mapping to simplify complex interactions.",
        wireframes:
          "Developed high-fidelity wireframes in Figma focusing on accessibility and visual hierarchy.",
        finalUI:
          "Implemented a clean, accessible interface using Tailwind CSS and DevExtreme UI components.",
        outcome:
          "Significantly improved task efficiency and received positive feedback during client walkthroughs.",
        gallery: [
          "https://picsum.photos/seed/health1/800/600",
          "https://picsum.photos/seed/health2/800/600",
        ],
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Community Forum Platform",
      description:
        "A responsive and accessible forum interface built with React and Zustand, optimizing performance and user engagement.",
      category: "Web",
      tags: ["Community", "React", "Zustand", "React Query"],
      // imageUrl: forumImg,
      caseStudy: {
        problem:
          "The existing forum platform had poor mobile usability and slow data loading times.",
        research:
          "Identified redundant network requests and performance bottlenecks in global state handling.",
        wireframes:
          "Redesigned the mobile experience to ensure a 40% improvement in usability scores.",
        finalUI:
          "Integrated React Query for optimized data fetching and Zustand for lightweight state management.",
        outcome:
          "Reduced boilerplate by 30% and significantly enhanced overall platform responsiveness.",
        gallery: ["https://picsum.photos/seed/forum1/800/600"],
      },
      createdAt: new Date().toISOString(),
    },
  ];

  const sampleExperience = [
    {
      id: "1",
      company: "Experion Technologies",
      role: "Software Engineer",
      period: "04/2024 - Present",
      description:
        "Led end-to-end UI/UX design and development for a US-based healthcare hospital project. Created scalable design systems and integrated backend services using RESTful APIs, Zustand, and React Query.",
    },
    {
      id: "2",
      company: "Experion Technologies",
      role: "Associate Software Engineer",
      period: "04/2023 - 04/2024",
      description:
        "Developed responsive interfaces for a Forum project using Tailwind CSS and React. Achieved a 40% improvement in mobile usability and reduced boilerplate by 30% using Zustand.",
    },
    {
      id: "3",
      company: "Experion Technologies",
      role: "Associate Trainee Engineer",
      period: "12/2022 - 04/2023",
      description:
        "Developed a full-stack Individual Development Planner (IDP) using .NET, Angular, and SQL. Delivered a fully functional feature within two months.",
    },
  ];

  await initFile(PROJECTS_FILE, sampleProjects);
  await initFile(EXPERIENCE_FILE, sampleExperience);
  await initFile(MESSAGES_FILE, []);

  // Default admin: admin / password123
  const hashedPassword = await bcrypt.hash("password123", 10);
  await initFile(ADMIN_FILE, { username: "admin", password: hashedPassword });
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

async function startServer() {
  await ensureDirs();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = JSON.parse(await fs.readFile(ADMIN_FILE, "utf-8"));

    if (
      username === admin.username &&
      (await bcrypt.compare(password, admin.password))
    ) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, "utf-8"));
    res.json(projects);
  });

  app.post("/api/projects", authenticateToken, async (req, res) => {
    const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, "utf-8"));
    const newProject = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    res.status(201).json(newProject);
  });

  app.put("/api/projects/:id", authenticateToken, async (req, res) => {
    const projects = JSON.parse(await fs.readFile(PROJECTS_FILE, "utf-8"));
    const index = projects.findIndex((p: any) => p.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ message: "Project not found" });

    projects[index] = {
      ...projects[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    res.json(projects[index]);
  });

  app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
    let projects = JSON.parse(await fs.readFile(PROJECTS_FILE, "utf-8"));
    projects = projects.filter((p: any) => p.id !== req.params.id);
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    res.sendStatus(204);
  });

  // Experience
  app.get("/api/experience", async (req, res) => {
    const experience = JSON.parse(await fs.readFile(EXPERIENCE_FILE, "utf-8"));
    res.json(experience);
  });

  app.post("/api/experience", authenticateToken, async (req, res) => {
    const experience = JSON.parse(await fs.readFile(EXPERIENCE_FILE, "utf-8"));
    const newItem = { ...req.body, id: uuidv4() };
    experience.push(newItem);
    await fs.writeFile(EXPERIENCE_FILE, JSON.stringify(experience, null, 2));
    res.status(201).json(newItem);
  });

  app.delete("/api/experience/:id", authenticateToken, async (req, res) => {
    let experience = JSON.parse(await fs.readFile(EXPERIENCE_FILE, "utf-8"));
    experience = experience.filter((e: any) => e.id !== req.params.id);
    await fs.writeFile(EXPERIENCE_FILE, JSON.stringify(experience, null, 2));
    res.sendStatus(204);
  });

  // Messages
  app.post("/api/messages", async (req, res) => {
    const messages = JSON.parse(await fs.readFile(MESSAGES_FILE, "utf-8"));
    const newMessage = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    res.status(201).json({ message: "Message sent successfully" });
  });

  app.get("/api/messages", authenticateToken, async (req, res) => {
    const messages = JSON.parse(await fs.readFile(MESSAGES_FILE, "utf-8"));
    res.json(messages);
  });

  // Uploads
  app.post(
    "/api/upload",
    authenticateToken,
    upload.single("image"),
    (req, res) => {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });
      res.json({ url: `/uploads/${req.file.filename}` });
    },
  );

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
