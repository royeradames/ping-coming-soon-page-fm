"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { emailSchema } from "../../lib/email";

const firstMessage = (errors: readonly unknown[]) => {
  for (const error of errors) {
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return error.message;
  }
  return undefined;
};

/* The input deliberately has no name attribute: if JavaScript is off, a native submit carries no address anywhere, not even into the URL. */
export function NotifyForm() {
  const input = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validationLogic: revalidateLogic({ mode: "submit", modeAfterSubmission: "change" }),
    onSubmit: ({ formApi }) => {
      setChecked(true);
      formApi.reset();
    },
    onSubmitInvalid: () => input.current?.focus(),
  });

  return (
    <form
      className="notify-form"
      noValidate
      aria-label="Get notified when Ping launches"
      onSubmit={event => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email" validators={{ onDynamic: emailSchema }}>
        {field => {
          const error = firstMessage(field.state.meta.errors);
          return (
            <div className="email-field">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                ref={input}
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your email address…"
                value={field.state.value}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "email-error demo-note" : "demo-note"}
                onBlur={field.handleBlur}
                onChange={event => {
                  setChecked(false);
                  field.handleChange(event.target.value);
                }}
              />
              <p id="email-error" className="email-error" aria-live="polite">{error}</p>
            </div>
          );
        }}
      </form.Field>
      <button type="submit">Notify Me</button>
      <p id="demo-note" className="demo-note" role="status">
        {checked ? "That address looks right. Demo only: nothing was sent or saved." : "Demo only: nothing is sent."}
      </p>
    </form>
  );
}
