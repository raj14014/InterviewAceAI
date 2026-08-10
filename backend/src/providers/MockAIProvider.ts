import { AIProvider, InterviewContext } from './AIProvider';

const skills = ['JavaScript','TypeScript','React','Node.js','Express','MongoDB','SQL','Python','Java','AWS','Docker','Git','REST'];

export class MockAIProvider implements AIProvider {
  async analyzeResume(text: string) {
    const lower = text.toLowerCase();
    const detected = skills.filter((s) => lower.includes(s.toLowerCase()));
    const atsScore = Math.min(98, 50 + detected.length * 4 + Math.min(12, Math.floor(text.length / 500)));
    return {
      atsScore,
      resumeScore: Math.min(100, atsScore + 2),
      skills: detected,
      strengths: ['Technical skills were detected successfully', 'Profile can be tailored to a target role'],
      weaknesses: ['Add measurable outcomes to projects and experience'],
      missingKeywords: ['impact', 'metrics', 'ownership'],
      missingSkills: [], formattingIssues: [],
      recommendations: ['Quantify project impact', 'Add role-specific keywords', 'Use concise action-oriented bullets']
    };
  }

  async analyzeJob(text: string, resumeText = '') {
    const lower = text.toLowerCase();
    const resume = resumeText.toLowerCase();
    const requiredSkills = skills.filter((s) => lower.includes(s.toLowerCase()));
    const skillGaps = requiredSkills.filter((s) => !resume.includes(s.toLowerCase()));
    const matched = requiredSkills.filter((s) => resume.includes(s.toLowerCase()));
    const score = requiredSkills.length ? Math.max(20, Math.round((matched.length / requiredSkills.length) * 100)) : 60;
    return {
      requiredSkills, preferredSkills: [],
      responsibilities: ['Build reliable software', 'Collaborate with engineering teams'],
      qualifications: [], technologies: requiredSkills,
      experienceRequirements: [], keywords: requiredSkills,
      roleCategory: 'Software Engineering',
      match: { score, skillGaps, strengths: matched, weaknesses: skillGaps, topics: [...new Set([...requiredSkills, 'problem solving', 'system design'])] }
    };
  }

  async generateQuestion(ctx: InterviewContext, history: string[]) {
    const templates = [
      `Explain a challenging ${ctx.targetRole} problem you solved, your approach, trade-offs, and result.`,
      `How would you design a scalable solution for a ${ctx.targetRole} use case? Explain components, data flow, bottlenecks, and trade-offs.`,
      `Describe a production bug or failure you handled. How did you diagnose it and prevent recurrence?`,
      `Explain one technical decision in a recent project and why you chose it over alternatives.`
    ];
    const available = templates.filter((q) => !history.includes(q));
    const question = available[history.length % Math.max(1, available.length)] || templates[history.length % templates.length];
    return `${ctx.type} · ${ctx.difficulty}: ${question}`;
  }

  async evaluateAnswer(question: string, answer: string) {
    const length = answer.trim().split(/\s+/).filter(Boolean).length;
    const score = Math.max(20, Math.min(96, 40 + Math.min(50, Math.floor(length / 2))));
    return {
      score, technicalCorrectness: score, relevance: Math.min(100, score + 3),
      completeness: Math.min(100, score + 1), communication: Math.min(100, score + 5),
      problemSolving: score,
      strengths: length > 50 ? ['Good level of detail'] : ['Concise response'],
      weaknesses: length < 30 ? ['Add concrete examples and reasoning'] : ['Make the structure more explicit'],
      missingConcepts: [],
      improvedAnswer: 'Structure the response with context, approach, trade-offs, implementation details, and measurable result.',
      followUpQuestion: 'What trade-off did you consider most carefully, and why?',
      recommendedTopics: ['Structured communication', 'Problem solving']
    };
  }
}
