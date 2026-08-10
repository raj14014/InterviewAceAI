import mongoose,{Schema} from 'mongoose';
const S=new Schema({userId:{type:Schema.Types.ObjectId,ref:'User',index:true},title:String,company:String,text:String,analysis:Schema.Types.Mixed,match:Schema.Types.Mixed},{timestamps:true});
export const JobDescription=mongoose.model('JobDescription',S);
