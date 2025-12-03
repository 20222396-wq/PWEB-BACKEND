import 'dotenv/config';
import { defineConfig } from '@prisma/config';

function withSsl(url?: string): string {
  if (!url) return '';
  // Ensure sslmode=require for external connections; Render internal URLs often already enforce SSL.
  return url.includes('sslmode=') ? url : (url.includes('?') ? `${url}&sslmode=require` : `${url}?sslmode=require`);
}

const dbUrl = process.env.DATABASE_URL;
const finalUrl = withSsl(dbUrl);

if (!finalUrl) {
  // Provide a clearer message when running CLI commands like `prisma studio`
  throw new Error('DATABASE_URL no encontrado. Define la variable en .env o configura `datasource.url` en prisma.config.ts');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: finalUrl,
  },
});
