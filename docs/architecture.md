# Architecture

InterviewAceAI uses a monorepo with a React/Vite client and Express/TypeScript API. MongoDB is accessed through Mongoose. AI business logic depends on an `AIProvider` abstraction so providers can be changed without coupling controllers to a vendor.
