import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: String,
  score: Number,
  feedback: mongoose.Schema.Types.Mixed,
  followUp: String
}, { _id: false });

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, default: 'Technical' },
  difficulty: { type: String, default: 'Medium' },
  targetRole: { type: String, default: 'Software Engineer' },
  status: { type: String, enum: ['created', 'active', 'completed'], default: 'created' },
  questions: { type: [questionSchema], default: [] },
  currentIndex: { type: Number, default: 0 },
  overallScore: Number,
  report: {
    overall: Number,
    technical: Number,
    communication: Number,
    relevance: Number,
    completeness: Number,
    problemSolving: Number,
    strengths: [String],
    weaknesses: [String],
    skillGaps: [String],
    recommendedTopics: [String]
  }
}, { timestamps: true });

export const Interview = mongoose.model('Interview', schema);
