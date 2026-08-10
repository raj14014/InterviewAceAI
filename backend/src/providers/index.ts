import { MockAIProvider } from './MockAIProvider';
import { HttpAIProvider } from './HttpAIProvider';
import { AIProvider } from './AIProvider';
import { env } from '../config/env';

export function getAIProvider(): AIProvider {
  if (env.AI_PROVIDER === 'mock') return new MockAIProvider();
  if (env.AI_PROVIDER === 'openai' && env.OPENAI_API_KEY) return new HttpAIProvider('openai', env.OPENAI_API_KEY);
  if (env.AI_PROVIDER === 'gemini' && env.GEMINI_API_KEY) return new HttpAIProvider('gemini', env.GEMINI_API_KEY);
  if (env.AI_PROVIDER === 'anthropic' && env.ANTHROPIC_API_KEY) return new HttpAIProvider('anthropic', env.ANTHROPIC_API_KEY);
  throw new Error(`AI_PROVIDER=${env.AI_PROVIDER} requires its API key`);
}
