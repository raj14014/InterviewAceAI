import { Router } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { Interview } from '../models/Interview';
import { getAIProvider } from '../providers';
import { ok, fail } from '../utils/response';

const r = Router();

r.get('/', auth, async (req:AuthRequest,res) => ok(res, await Interview.find({userId:req.userId}).sort({createdAt:-1})));
r.get('/:id', auth, async (req:AuthRequest,res) => {
  const i = await Interview.findOne({_id:req.params.id,userId:req.userId});
  if (!i) return fail(res,'NOT_FOUND','Interview not found',404);
  return ok(res,i);
});

r.post('/', auth, async (req:AuthRequest,res) => {
  const type = req.body.mode || req.body.type || 'Technical';
  const difficulty = req.body.difficulty || 'Medium';
  const targetRole = req.body.targetRole || 'Software Engineer';
  const i = await Interview.create({userId:req.userId,type,difficulty,targetRole,status:'active'});
  const q = await getAIProvider().generateQuestion({type,difficulty,targetRole},[]);
  i.questions.push({id:`q-${Date.now()}`,question:q});
  await i.save();
  return ok(res,i,'Interview created',201);
});

r.post('/:id/answer', auth, async (req:AuthRequest,res) => {
  const i = await Interview.findOne({_id:req.params.id,userId:req.userId});
  if (!i) return fail(res,'NOT_FOUND','Interview not found',404);
  if (i.status !== 'active') return fail(res,'INTERVIEW_COMPLETE','Interview is already completed');
  const questionId = req.body.questionId || i.questions[i.currentIndex]?.id;
  const answer = String(req.body.answer || '').trim();
  const q = i.questions.find(x => x.id === questionId) || i.questions[i.currentIndex];
  if (!q) return fail(res,'NO_QUESTION','No active question');
  if (!answer) return fail(res,'ANSWER_REQUIRED','Answer is required');
  const evaluation = await getAIProvider().evaluateAnswer(q.question,answer);
  q.answer = answer; q.score = evaluation.score; q.feedback = evaluation; q.followUp = evaluation.followUpQuestion;
  i.currentIndex = Math.min(i.currentIndex + 1, i.questions.length);
  if (i.currentIndex < 5) {
    const next = await getAIProvider().generateQuestion({type:i.type!,difficulty:i.difficulty!,targetRole:i.targetRole!}, i.questions.map(x=>x.question));
    i.questions.push({id:`q-${Date.now()}`,question:next});
  }
  await i.save();
  return ok(res,{evaluation,nextQuestion:i.questions[i.currentIndex]?.question || null,completed:i.currentIndex>=5},'Answer evaluated');
});

r.post('/:id/complete', auth, async (req:AuthRequest,res) => {
  const i = await Interview.findOne({_id:req.params.id,userId:req.userId});
  if (!i) return fail(res,'NOT_FOUND','Interview not found',404);
  const scored = i.questions.filter(q => typeof q.score === 'number');
  const avg = scored.length ? Math.round(scored.reduce((a,q)=>a+(q.score || 0),0)/scored.length) : 0;
  i.overallScore = avg; i.status = 'completed';
  i.report = {overall:avg,technical:avg,communication:avg,relevance:avg,completeness:avg,problemSolving:avg,
    strengths:['Interview completed','AI feedback generated'], weaknesses:avg<70?['Add more concrete examples and reasoning']:['Continue refining structure'],
    skillGaps:[], recommendedTopics:['Structured communication','Problem solving']};
  await i.save(); return ok(res,i,'Interview completed');
});
export default r;
