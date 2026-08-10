import { Router } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { getAIProvider } from '../providers';

const r = Router();

const codingQuestions = [
  { id:'two-sum', title:'Two Sum', difficulty:'Easy', topic:'Arrays & Hashing', prompt:'Given an integer array nums and a target, return indices of two numbers that add up to target.', hints:['Use a hash map for O(n) lookup.','Store value → index as you scan.'] },
  { id:'valid-parentheses', title:'Valid Parentheses', difficulty:'Easy', topic:'Stack', prompt:'Given a string containing (), {}, and [], determine whether the brackets are balanced and correctly nested.', hints:['Use a stack.','Map each closing bracket to its opening bracket.'] },
  { id:'merge-intervals', title:'Merge Intervals', difficulty:'Medium', topic:'Sorting', prompt:'Given a collection of intervals, merge all overlapping intervals.', hints:['Sort by start time.','Extend the current interval while overlaps continue.'] },
  { id:'lru-cache', title:'LRU Cache', difficulty:'Medium', topic:'Design', prompt:'Design an LRU cache supporting get and put in O(1) average time.', hints:['Combine a hash map with a doubly linked list.','Move recently used nodes to the front.'] },
  { id:'word-ladder', title:'Word Ladder', difficulty:'Hard', topic:'Graphs / BFS', prompt:'Find the shortest transformation sequence from beginWord to endWord using one-letter changes.', hints:['Model transformations as graph edges.','Breadth-first search gives the shortest path.'] }
];

const systemDesignQuestions = [
  {id:'url-shortener', title:'Design a URL Shortener', level:'Intermediate', prompt:'Design a service that converts long URLs into short links and redirects users reliably at high traffic.', focus:['API design','Key generation','Caching','Database scaling','Analytics']},
  {id:'news-feed', title:'Design a Social News Feed', level:'Advanced', prompt:'Design a personalized feed for millions of users with low latency and high write volume.', focus:['Fan-out','Ranking','Caching','Consistency','Sharding']},
  {id:'ride-sharing', title:'Design a Ride Sharing Platform', level:'Advanced', prompt:'Design real-time driver matching, trip tracking, pricing and notifications for a ride-sharing platform.', focus:['Geospatial indexing','Event streaming','Concurrency','Reliability','Observability']}
];

r.get('/coding', auth, (_req,res) => res.json({success:true,data:codingQuestions}));
r.get('/system-design', auth, (_req,res) => res.json({success:true,data:systemDesignQuestions}));

r.post('/evaluate', auth, async (req:AuthRequest,res,next) => {
  try {
    const question = String(req.body.question || '').trim();
    const answer = String(req.body.answer || '').trim();
    if (!question || !answer) return res.status(400).json({success:false,error:{code:'INPUT_REQUIRED',message:'Question and answer are required'}});
    const evaluation = await getAIProvider().evaluateAnswer(question, answer);
    return res.json({success:true,data:{evaluation}});
  } catch (e) { next(e); }
});

r.post('/coach', auth, async (req:AuthRequest,res,next) => {
  try {
    const message = String(req.body.message || '').trim();
    const context = String(req.body.context || 'interview preparation');
    if (!message) return res.status(400).json({success:false,error:{code:'MESSAGE_REQUIRED',message:'Message is required'}});
    const provider = getAIProvider() as any;
    if (typeof provider.coach === 'function') {
      const reply = await provider.coach(message, context);
      return res.json({success:true,data:{reply}});
    }
    return res.json({success:true,data:{reply:`For ${context}, structure your response with: situation, approach, trade-offs, result, and what you learned. Your question was: ${message}`}});
  } catch (e) { next(e); }
});

export default r;
