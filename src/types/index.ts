import * as z from "zod";
import {
  formSchema,
  headerSchema,
  methodsEnum,
} from "../modules/form/resolvers";

export type FormState = z.infer<typeof formSchema>;

export type Methods = z.infer<typeof methodsEnum>;

export type Header = z.infer<typeof headerSchema>;
