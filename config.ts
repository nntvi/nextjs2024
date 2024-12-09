import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_API: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
});
if (!configProject.success) {
  console.log(process.env);

  throw new Error("Missing NEXT_PUBLIC_API_ENDPOINT");
}
const envConfig = configProject.data;
export default envConfig;
