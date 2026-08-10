export type InterviewContext = {
  type: string;
  difficulty: string;
  targetRole: string;
  resumeText?: string;
  jobText?: string;
};

export interface AIProvider {
  analyzeResume(text: string): Promise<any>;
  analyzeJob(text: string, resumeText?: string): Promise<any>;
  generateQuestion(ctx: InterviewContext, history: string[]): Promise<string>;
  evaluateAnswer(question: string, answer: string): Promise<any>;
}
