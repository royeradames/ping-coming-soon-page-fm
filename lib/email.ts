import * as z from "zod";

export const emptyEmailMessage = "Whoops! It looks like you forgot to add your email";
export const invalidEmailMessage = "Please provide a valid email address";

/* The challenge's rule: an address must look like name@host.tld. */
export const emailSchema = z.string().trim().min(1, emptyEmailMessage).pipe(z.email(invalidEmailMessage));
