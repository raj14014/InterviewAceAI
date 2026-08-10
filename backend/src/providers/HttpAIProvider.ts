import { AIProvider, InterviewContext } from './AIProvider';

async function jsonFetch(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const body = await response.text();
  if (!response.ok) throw new Error(`AI provider error ${response.status}: ${body.slice(0, 500)}`);
  try { return JSON.parse(body); } catch { throw new Error('AI provider returned invalid JSON'); }
}

export class HttpAIProvider implements AIProvider {
  constructor(private readonly provider: 'openai' | 'gemini' | 'anthropic', private readonly key: string) {}

  private async prompt(prompt: string): Promise<string> {
    if (this.provider === 'openai') {
      const data = await jsonFetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: {'Content-Type':'application/json', Authorization:`Bearer ${this.key}`},
        body: JSON.stringify({model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: 0.2, messages:[{role:'system',content:'You are an interview preparation assistant. Return concise, practical answers.'},{role:'user',content:prompt}]})
      });
      return data.choices?.[0]?.message?.content || '';
    }
    if (this.provider === 'gemini') {
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
      const data = await jsonFetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(this.key)}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})
      });
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
    const data = await jsonFetch('https://api.anthropic.com/v1/messages', {
      method:'POST', headers:{'Content-Type':'application/json','x-api-key':this.key,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',max_tokens:800,messages:[{role:'user',content:prompt}]})
    });
    return data.content?.[0]?.text || '';
  }

  async analyzeResume(text:string) { return this.parseJson(await this.prompt(`Analyze this resume. Return JSON with atsScore,resumeScore,skills,strengths,weaknesses,missingKeywords,missingSkills,formattingIssues,recommendations. Resume:\n${text.slice(0,18000)}`)); }
  async analyzeJob(text:string, resumeText='') { return this.parseJson(await this.prompt(`Compare resume and job description. Return JSON with requiredSkills,preferredSkills,responsibilities,qualifications,technologies,experienceRequirements,keywords,roleCategory,match where match has score,skillGaps,strengths,weaknesses,topics. JOB:\n${text.slice(0,12000)}\nRESUME:\n${resumeText.slice(0,12000)}`)); }
  async generateQuestion(ctx:InterviewContext, history:string[]) { return this.prompt(`Generate one ${ctx.difficulty} ${ctx.type} interview question for ${ctx.targetRole}. Do not repeat these: ${history.join(' | ')}`); }
  async evaluateAnswer(question:string, answer:string) { return this.parseJson(await this.prompt(`Evaluate an interview answer. Return JSON with score,technicalCorrectness,relevance,completeness,communication,problemSolving,strengths,weaknesses,missingConcepts,improvedAnswer,followUpQuestion,recommendedTopics. Question: ${question}\nAnswer: ${answer}`)); }
  private parseJson(text:string) { const cleaned=text.replace(/^```json\s*/i,'').replace(/```$/,'').trim(); try{return JSON.parse(cleaned);}catch{return {score:0,raw:text};} }
}
