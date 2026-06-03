// Vercel serverless entry point.
// Re-exports the configured Express app so all /api/* requests
// are handled by the same router the local dev server uses.
export { default } from "../src/server";
