"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({ scrollTrigger: { trigger: r, start: "top 70%", once: true } });
      tl.from(r.querySelector("[data-kicker]"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out" })
        .from(r.querySelector("[data-title]"), { y: 18, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.2")
        .from(r.querySelector("[data-sub]"), { y: 12, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
        .from(r.querySelector("[data-form]"), { y: 24, opacity: 0, scale: 0.985, duration: 0.55, ease: "power3.out" }, "-=0.1");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // 3D tilt on form card
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  };
  const onLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    const el = cardRef.current!;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  const setField =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!form.subject.trim()) next.subject = "Add a short subject.";
    if (!form.message.trim() || form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerMsg("");

    try {
      // Replace with your endpoint or Formspree/EmailJS if not using an API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err: any) {
      setStatus("error");
      setServerMsg(err?.message || "Something went wrong. Please try again or email me directly.");
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-[#0b0d10]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Header */}
        <header className="mb-10 text-center">
          <span
            data-kicker
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300"
          >
            Contact
          </span>
          <h1 data-title className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Let’s build something great together
          </h1>
          <p data-sub className="mx-auto mt-2 max-w-2xl text-zinc-400">
            Tell me about your project or say hello. I’ll get back within 24 hours.
          </p>
        </header>

        {/* Centered form card */}
        <div className="mx-auto max-w-2xl">
          <div
            ref={cardRef}
            data-form
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#0e1116] ring-1 ring-white/10"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))",
              boxShadow:
                "0 42px 60px -28px rgba(0,0,0,0.65), 0 16px 30px -16px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
              transition: "transform 160ms ease",
            }}
          >
            {/* shadow catcher */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 -bottom-8 -top-6 -z-10"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 65%, rgba(0,0,0,0.6), rgba(0,0,0,0.28) 45%, transparent 70%)",
                filter: "blur(18px)",
              }}
            />
            {/* inner bevel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5)" }}
            />
            {/* glare */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 60%)",
                mixBlendMode: "screen",
              }}
            />

            <form onSubmit={onSubmit} className="relative z-10 space-y-4 p-5 sm:p-6">
              <Field
                label="Name"
                id="name"
                value={form.name}
                onChange={setField("name")}
                error={errors.name}
                placeholder="Your name"
              />

              <Field
                label="Email"
                id="email"
                type="email"
                value={form.email}
                onChange={setField("email")}
                error={errors.email}
                placeholder="you@domain.com"
              />

              <Field
                label="Subject"
                id="subject"
                value={form.subject}
                onChange={setField("subject")}
                error={errors.subject}
                placeholder="What’s this about?"
              />

              <Field
                label="Message"
                id="message"
                as="textarea"
                value={form.message}
                onChange={setField("message")}
                error={errors.message}
                placeholder="Tell me about your project, goals, and success criteria…"
                rows={6}
              />

              {/* Submit */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-[11px] text-zinc-500">
                  I’ll reply within 24 hours. Or email me at{" "}
                  <a href="mailto:you@example.com" className="text-zinc-300 underline underline-offset-2">
                    you@example.com
                  </a>
                  .
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition disabled:opacity-50"
                  style={{ transform: "translate3d(var(--tx,0), var(--ty,0), 0) scale(var(--scale,1))" }}
                  onMouseMove={(e) => magnetMove(e.currentTarget as HTMLElement, e)}
                  onMouseLeave={(e) => magnetReset(e.currentTarget as HTMLElement)}
                >
                  {status === "loading" ? (
                    <>
                      <Spinner /> Sending…
                    </>
                  ) : status === "success" ? (
                    <>
                      <CheckIcon /> Sent!
                    </>
                  ) : (
                    <>
                      Send message <ArrowIcon />
                    </>
                  )}
                </button>
              </div>

              {/* Server message */}
              <div aria-live="polite" className="min-h-[20px]">
                {status === "error" && serverMsg && (
                  <p className="mt-2 text-sm text-red-400" role="alert">
                    {serverMsg}
                  </p>
                )}
                {status === "success" && (
                  <p className="mt-2 text-sm text-emerald-400" role="status">
                    Thanks! I’ll reach out shortly.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Field component ============ */
function Field(props: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  as?: "textarea";
  rows?: number;
}) {
  const InputTag = props.as === "textarea" ? "textarea" : "input";
  return (
    <label htmlFor={props.id} className="block">
      <div className="mb-1 text-xs font-medium text-zinc-400">{props.label}</div>
      <div className="relative">
        <InputTag
          id={props.id}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          rows={(props.as === "textarea" && props.rows) || undefined}
          type={props.type || (props.as ? undefined : "text")}
          className="w-full rounded-xl border border-white/10 bg-[#0f1319] px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-white/20"
        />
        {/* focus accent */}
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/0 transition-[ring] focus-within:ring-white/20" />
      </div>
      {props.error && <p className="mt-1 text-xs text-red-400">{props.error}</p>}
    </label>
  );
}

/* ============ Small UI helpers ============ */
function magnetMove(el: HTMLElement, e: React.MouseEvent) {
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty("--tx", `${x * 6}px`);
  el.style.setProperty("--ty", `${y * 6}px`);
  el.style.setProperty("--scale", "1.015");
}
function magnetReset(el: HTMLElement) {
  el.style.setProperty("--tx", `0px`);
  el.style.setProperty("--ty", `0px`);
  el.style.setProperty("--scale", "1");
}

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />;
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-emerald-400" fill="currentColor" aria-hidden>
      <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80" fill="currentColor" aria-hidden>
      <path d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8 8-8z" />
    </svg>
  );
}