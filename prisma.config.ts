import { defineConfig } from '@prisma/config';

function withSsl(url?: string): string | undefined {
  if (!url) return url;
  // Ensure sslmode=require for external connections; Render internal URLs often already enforce SSL.
  return url.includes('sslmode=') ? url : (url.includes('?') ? `${url}&sslmode=require` : `${url}?sslmode=require`);
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: withSsl(process.env.DATABASE_URL!)
  }
});
