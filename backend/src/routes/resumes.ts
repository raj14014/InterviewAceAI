import {Router} from 'express';
import multer from 'multer';
import {auth,AuthRequest} from '../middleware/auth';
import {Resume} from '../models/Resume';
import {getAIProvider} from '../providers';
import {ok,fail} from '../utils/response';

const r=Router();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024},fileFilter:(_,f,cb)=>cb(null,['application/pdf','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.mimetype))});

r.post('/analyze',auth,upload.single('resume'),async(req:AuthRequest,res)=>{
  if(!req.file)return fail(res,'FILE_REQUIRED','Resume file is required');
  // The production parser should extract PDF/DOCX text before AI analysis.
  // Text files are handled directly; binary formats receive a clear fallback.
  const isText=req.file.mimetype==='text/plain';
  const text=isText?req.file.buffer.toString('utf8'):String(req.body.text||'');
  if(!text.trim())return fail(res,'TEXT_REQUIRED','For PDF/DOCX uploads, provide extracted text or configure the document parser service');
  const analysis=await getAIProvider().analyzeResume(text);
  const doc=await Resume.create({userId:req.userId,filename:req.file.originalname,text,analysis});
  return ok(res,doc,'Resume analyzed',201);
});
r.get('/',auth,async(req:AuthRequest,res)=>ok(res,await Resume.find({userId:req.userId}).sort({createdAt:-1})));
export default r;
