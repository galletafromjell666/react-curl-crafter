import * as z from "zod";

export const headerSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const methodsEnum = z.enum(["GET", "DELETE", "PUT", "POST", "PATCH"]);

export const formSchema = z.object({
  method: methodsEnum,
  url: z.string().min(1),
  data: z.string().optional(),
  headers: z.array(headerSchema).optional().default([]),
});
