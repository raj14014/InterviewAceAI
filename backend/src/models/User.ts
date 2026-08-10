import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true},passwordHash:{type:String,required:true},role:{type:String,enum:['user','admin'],default:'user'},profile:{education:String,degree:String,skills:[String],projects:[String],experience:String,certifications:[String],targetRole:String,targetCompanies:[String],yearsOfExperience:Number,goals:[String]}},{timestamps:true});
export const User=mongoose.model('User',schema);
