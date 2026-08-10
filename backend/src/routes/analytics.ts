import { Router } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { Interview } from '../models/Interview';
const r=Router();
r.get('/summary',auth,async(req:AuthRequest,res)=>{
  const items=await Interview.find({userId:req.userId}).sort({createdAt:1});
  const done=items.filter(x=>x.status==='completed');
  const scores=done.map(x=>x.report?.overall ?? x.overallScore ?? 0);
  const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
  res.json({success:true,data:{readiness:avg,interviewsCompleted:done.length,questionsAnswered:items.reduce((n,x)=>n+x.questions.filter(q=>typeof q.score==='number').length,0),averageScore:avg,trend:done.map(x=>({date:x.createdAt,score:x.report?.overall ?? x.overallScore ?? 0}))}});
});
export default r;
