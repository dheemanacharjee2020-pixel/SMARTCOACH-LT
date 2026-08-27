import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { internalCompanyDatabase, seedUsers, sessionEvaluations } from "./server/db";
import { researchCompanyWithGemini, analyzeResumeWithGemini, generateInterviewQuestions, critiqueAnswerWithGemini, evaluateFullSessionWithGemini } from "./server/gemini";
import { UserProfile } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parsing
  app.use(express.json({ limit: "10mb" }));

  // In-memory dynamic companies cache
  const companyCache = { ...internalCompanyDatabase };
  // In-memory user store
  const userStore: Record<string, UserProfile> = { ...seedUsers };

  // ==========================================
  // AUTH ROUTES
  // ==========================================
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, userId } = req.body;
      let user = Object.values(userStore).find(u => (email && u.email.toLowerCase() === email.toLowerCase()) || (userId && u.id === userId));
      
      if (!user) {
        // Auto create guest user if valid email provided
        const newId = `user_${Date.now()}`;
        user = {
          id: newId,
          name: email ? email.split('@')[0] : 'Candidate',
          email: email || 'candidate@example.com',
          isReturningUser: false
        };
        userStore[newId] = user;
      }

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    try {
      const { name, email } = req.body;
      const newId = `user_${Date.now()}`;
      const user: UserProfile = {
        id: newId,
        name: name || 'New Candidate',
        email: email || 'candidate@example.com',
        isReturningUser: false
      };
      userStore[newId] = user;
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/auth/update-profile", (req, res) => {
    try {
      const { userId, resumeText, resumeFileName, companyName, roleTitle, jobDescription, atsScore } = req.body;
      if (userId && userStore[userId]) {
        userStore[userId] = {
          ...userStore[userId],
          ...(resumeText !== undefined && { savedResumeText: resumeText }),
          ...(resumeFileName !== undefined && { savedResumeFileName: resumeFileName }),
          ...(companyName !== undefined && { savedCompanyName: companyName }),
          ...(roleTitle !== undefined && { savedRoleTitle: roleTitle }),
          ...(jobDescription !== undefined && { savedJobDescription: jobDescription }),
          ...(atsScore !== undefined && { savedAtsScore: atsScore }),
          isReturningUser: true,
          lastSessionDate: new Date().toISOString().split('T')[0]
        };
        res.json({ success: true, user: userStore[userId] });
      } else {
        res.status(404).json({ success: false, error: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // COMPANY LOOKUP & RESEARCH
  // ==========================================
  app.post("/api/company/lookup", async (req, res) => {
    try {
      const { companyName } = req.body;
      if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
        return res.status(400).json({ success: false, error: "Company name is required." });
      }

      const key = companyName.trim().toLowerCase();

      // 1. Check internal database / cache first
      if (companyCache[key]) {
        return res.json({
          success: true,
          company: companyCache[key],
          cached: true
        });
      }

      // Check partial match in internal database
      const partialMatch = Object.keys(companyCache).find(k => k === key || key.includes(k) || k.includes(key));
      if (partialMatch) {
        return res.json({
          success: true,
          company: companyCache[partialMatch],
          cached: true
        });
      }

      // 2. Perform web research via Gemini
      console.log(`Researching company online: ${companyName}`);
      const researched = await researchCompanyWithGemini(companyName.trim());

      if (!researched.verified || researched.source === 'not_found') {
        return res.json({
          success: false,
          status: 'not_found',
          message: `We were unable to locate verified corporate data or public interview benchmarks for "${companyName}". To ensure rigorous, company-authentic coaching, interview preparation cannot proceed without verified company data. Please check the spelling or enter the official entity name.`
        });
      }

      // Cache the verified company so future lookups hit internal DB first
      companyCache[key] = researched;

      res.json({
        success: true,
        company: researched,
        cached: false
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // ATS RESUME ANALYZER
  // ==========================================
  app.post("/api/ats/analyze", async (req, res) => {
    try {
      const { resumeText, jobDescription, companyProfile, threshold = 60 } = req.body;
      if (!resumeText || !jobDescription) {
        return res.status(400).json({ success: false, error: "Resume text and Job Description are required." });
      }

      const result = await analyzeResumeWithGemini(
        resumeText,
        jobDescription,
        companyProfile || {
          name: "Target Company",
          industry: "Technology",
          description: "Target enterprise organization",
          interviewStyle: "Standard behavioral and technical interviews",
          keyValues: ["Excellence", "Collaboration"],
          coreTechOrSkills: ["Problem Solving"],
          source: "db",
          verified: true
        },
        Number(threshold) || 60
      );

      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // INTERVIEW QUESTIONS GENERATION
  // ==========================================
  app.post("/api/interview/questions", async (req, res) => {
    try {
      const { roleTitle, jobDescription, companyProfile, resumeText, focusArea } = req.body;
      const questions = await generateInterviewQuestions(
        roleTitle || "Senior Software Engineer",
        jobDescription || "Standard job responsibilities",
        companyProfile || {
          name: "Target Company",
          industry: "Technology",
          description: "Enterprise",
          interviewStyle: "STAR behavioral & systems design",
          keyValues: ["Impact", "Ownership"],
          coreTechOrSkills: ["Architecture"],
          source: "db",
          verified: true
        },
        resumeText || "",
        focusArea
      );

      res.json({ success: true, questions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // ANSWER CRITIQUE & SPEECH ANALYSIS
  // ==========================================
  app.post("/api/interview/critique", async (req, res) => {
    try {
      const { question, userTranscript, speechMetrics, language = 'en', companyName = 'Target Company' } = req.body;
      if (!question || !userTranscript) {
        return res.status(400).json({ success: false, error: "Question and transcript are required." });
      }

      const critique = await critiqueAnswerWithGemini(
        question,
        userTranscript,
        speechMetrics || {
          wpm: 125,
          paceStatus: 'Optimal',
          confidenceScore: 85,
          clarityScore: 90,
          fillerWordsCount: 2,
          fillerWordsList: ['um', 'like'],
          durationSeconds: 45,
          pauseCount: 3
        },
        language,
        companyName
      );

      res.json({ success: true, critique });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // FULL SESSION EVALUATION & SUCCESS PROBABILITY
  // ==========================================
  app.post("/api/interview/evaluate", async (req, res) => {
    try {
      const { companyName, roleTitle, answers, userId } = req.body;
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ success: false, error: "Answers array is required." });
      }

      const evaluation = await evaluateFullSessionWithGemini(
        companyName || "Target Company",
        roleTitle || "Target Role",
        answers
      );

      if (userId) {
        evaluation.userId = userId;
      }
      evaluation.sessionDate = new Date().toISOString().split('T')[0];

      // Save evaluation in session map
      sessionEvaluations.set(evaluation.id, evaluation);

      res.json({ success: true, evaluation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // INTERVIEW SESSIONS HISTORY
  // ==========================================
  app.get("/api/interview/history", (req, res) => {
    try {
      const { userId } = req.query;
      let allSessions = Array.from(sessionEvaluations.values());

      if (userId) {
        const userFiltered = allSessions.filter(s => s.userId === userId);
        if (userFiltered.length > 0) {
          allSessions = userFiltered;
        }
      }

      // Sort chronologically ascending for trend line charts
      allSessions.sort((a, b) => {
        const dateA = new Date(a.timestamp || a.sessionDate || 0).getTime();
        const dateB = new Date(b.timestamp || b.sessionDate || 0).getTime();
        return dateA - dateB;
      });

      res.json({
        success: true,
        sessions: allSessions,
        totalSessions: allSessions.length
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "SmartCoach LT Backend", timestamp: new Date().toISOString() });
  });

  // ==========================================
  // VITE MIDDLEWARE (DEV) & STATIC SERVING (PROD)
  // ==========================================
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
    console.log(`SmartCoach LT server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
