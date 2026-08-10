import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit';
import {env} from './config/env'; import {connectDB,dbState} from './config/db';
import auth from './routes/auth'; import resumes from './routes/resumes'; import interviews from './routes/interviews'; import users from './routes/users'; import jobs from './routes/jobs'; import analytics from './routes/analytics'; import practice from './routes/practice';
export const app=express();
app.disable('x-powered-by'); app.use(helmet()); app.use(cors({origin:env.CLIENT_URL,credentials:true})); app.use(express.json({limit:'1mb'})); app.use(rateLimit({windowMs:15*60*1000,max:200,standardHeaders:true,legacyHeaders:false}));
app.get('/health',(_,res)=>res.json({success:true,data:{api:'ok',database:dbState(),environment:env.NODE_ENV}})); app.get('/api/health',(_,res)=>res.json({success:true,data:{api:'ok',database:dbState(),environment:env.NODE_ENV}}));
app.use('/api/auth',auth); app.use('/api/resumes',resumes); app.use('/api/interviews',interviews); app.use('/api/users',users); app.use('/api/jobs',jobs); app.use('/api/analytics',analytics); app.use('/api/practice',practice);
app.use((err:any,_req:any,res:any,_next:any)=>{console.error(err);res.status(err.status||500).json({success:false,error:{code:'INTERNAL_ERROR',message:env.NODE_ENV==='production'?'Internal server error':err.message||'Internal server error'}})});
if(require.main===module){connectDB().then(()=>app.listen(env.PORT,()=>console.log(`API listening on ${env.PORT}`))).catch(e=>{console.error('Database unavailable:',e);process.exit(1);});}
