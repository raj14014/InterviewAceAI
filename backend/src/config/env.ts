import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/interviewaceai'),
  JWT_SECRET: z.string().min(8).default('dev-only-change-me'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  AI_PROVIDER: z.enum(['mock','openai','gemini','anthropic']).default('mock'),
  OPENAI_API_KEY: z.string().optional(), OPENAI_MODEL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(), GEMINI_MODEL: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(), ANTHROPIC_MODEL: z.string().optional()
});

export const env = schema.parse(process.env);
