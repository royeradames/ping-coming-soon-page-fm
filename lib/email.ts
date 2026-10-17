import * as z from "zod/mini";
import en from "zod/v4/locales/en.js";

// Zod Mini ships no messages; load the English ones classic Zod uses so built-in issues read the same.
z.config(en());

export const emptyEmailMessage = "Whoops! It looks like you forgot to add your email";
export const invalidEmailMessage = "Please provide a valid email address";

/* The challenge's rule: an address must look like name@host.tld. */
export const emailSchema = z.pipe(
  z.string().check(z.trim(), z.minLength(1, emptyEmailMessage)),
  z.email(invalidEmailMessage),
);
