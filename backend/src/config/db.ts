import mongoose from 'mongoose'; import {env} from './env';
export async function connectDB(){await mongoose.connect(env.MONGODB_URI); console.log('MongoDB connected');}
export function dbState(){return mongoose.connection.readyState===1?'connected':'disconnected';}
