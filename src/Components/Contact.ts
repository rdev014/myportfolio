import { useEffect, useRef, useState } from "react";
import type React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget: string;
  timeline: string;
  website: string; 
};

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    budget: "",
    timeline: "",
    website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

  /* ========= GSAP entrance animation ========= */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const r = sectionRef.current!;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 75%", once: true },
      });
      tl.from(r.querySelector("[data-kicker]"), { y: 18, opacity: 0, duration: 0.5, ease: "power3.out" })
        .from(r.querySelector("[data-title]"), { y: 24, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.25")
        .from(r.querySelectorAll("[data-sub]"), { y: 16, opacity: 0, duration: 0.55, ease: "power3.out", stagger: 0.08 }, "-=0.3")
        .from(r.querySelectorAll("[data-form], [data-side]"), {
          y: 28,
          opacity: 0,
          scale: 0.96,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.1,
        }, "-=0.2");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ========= 3D tilt effect ========= */
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };
  const onLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    const el = cardRef.current!;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  };

  /* ========= field update helper ========= */
  const setField =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  /* ========= form validation ========= */
  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!form.subject.trim()) next.subject = "Add a subject.";
    if (!form.message.trim() || form.message.trim().length < 10) next.message = "Message must be at least 10 characters.";
    if (!form.budget) next.budget = "Select a budget.";
    if (!form.timeline) next.timeline = "Select a timeline.";
    if (form.website) next.website = "Bot detected.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ========= submission logic ========= */
  const FORMSPREE_ENDPOINT = "";
  const EMAILJS = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (form.website) return;

    setStatus("loading");
    setServerMsg("");

    try {
      if (EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey) {
        throw new Error("EmailJS not configured. Set envs to enable.");
      } else if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(`Formspree error: ${res.status}`);
      } else {
        throw new Error("No submit method configured.");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "", budget: "", timeline: "", website: "" });
      setErrors({});
    } catch (err: any) {
      setStatus("error");
      setServerMsg(err?.message || "Something went wrong.");
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-[#0b0d10]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Header */}
        <header className="mb-12">
          <span data-kicker className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
            Contact
          </span>
          <h1 data-title className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Let’s build something great together
          </h1>
          <p data-sub className="mt-2 max-w-2xl text-zinc-400">
            Share your project details or just say hello. I’ll respond within 24 hours.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Form card */}
          <div className="lg:col-span-7">
            <div
              ref={cardRef}
              data-form
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#0e1116] ring-1 ring-white/10 transition-transform duration-200"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))",
                boxShadow: "0 40px 60px -28px rgba(0,0,0,0.6), 0 12px 24px -12px rgba(0,0,0,0.5)",
              }}
            >
              {/* glare effect */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), transparent 60%)",
                  mixBlendMode: "screen",
                }}
              />

              <form onSubmit={onSubmit} className="relative z-10 space-y-5 p-6 sm:p-8">
                {/* Honeypot */}
                <input type="text" name="website" value={form.website} onChange={setField("website")} className="hidden" aria-hidden />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" id="name" value={form.name} onChange={setField("name")} error={errors.name} placeholder="Your name" />
                  <Field label="Email" id="email" type="email" value={form.email} onChange={setField("email")} error={errors.email} placeholder="you@domain.com" />
                </div>

                <Field label="Subject" id="subject" value={form.subject} onChange={setField("subject")} error={errors.subject} placeholder="What’s this about?" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField label="Budget" id="budget" value={form.budget} onChange={setField("budget")} error={errors.budget} options={[
                    { label: "Select budget", value: "" },
                    { label: "$1k – $3k", value: "1-3k" },
                    { label: "$3k – $6k", value: "3-6k" },
                    { label: "$6k – $10k", value: "6-10k" },
                    { label: "$10k+", value: "10k+" },
                  ]} />
                  <SelectField label="Timeline" id="timeline" value={form.timeline} onChange={setField("timeline")} error={errors.timeline} options={[
                    { label: "Select timeline", value: "" },
                    { label: "ASAP", value: "asap" },
                    { label: "2–4 weeks", value: "2-4w" },
                    { label: "1–2 months", value: "1-2m" },
                    { label: "Flexible", value: "flex" },
                  ]} />
                </div>

                <Field label="Message" id="message" as="textarea" value={form.message} onChange={setField("message")} error={errors.message} placeholder="Tell me about your project, goals, and success criteria…" rows={6} />

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
                    className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition disabled:opacity-50"
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

                {status === "error" && serverMsg && <p className="mt-2 text-sm text-red-400">{serverMsg}</p>}
                {status === "success" && <p className="mt-2 text-sm text-emerald-400">Thanks! I’ll reach out shortly.</p>}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside
            data-side
            className="relative isolate rounded-2xl border border-white/10 bg-[#0e1116] p-6 ring-1 ring-white/10 lg:col-span-5"
            style={{ boxShadow: "0 20px 30px -20px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5)" }}
          >
            <div className="relative z-10 space-y-6">
              <div>
                <div className="text-sm font-semibold text-white">Direct</div>
                <p className="mt-1 text-sm text-zinc-400">Prefer email? Reach me directly.</p>
                <a href="mailto:you@example.com" className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white ring-1 ring-white/10">
                  you@example.com <MailIcon />
                </a>
              </div>

              <div>
                <div className="text-sm font-semibold text-white">Schedule</div>
                <p className="mt-1 text-sm text-zinc-400">Book a quick 20-min call.</p>
                <a
                  href="https://calendly.com/your-handle/intro-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#11151b] px-3 py-1.5 text-xs text-zinc-300 ring-1 ring-white/10 transition hover:text-white"
                >
                  Calendly <ArrowIcon />
                </a>
              </div>

              <div>
                <div className="text-sm font-semibold text-white">Social</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <SocialLink href="https://github.com/yourname" label="GitHub" />
                  <SocialLink href="https://www.linkedin.com/in/yourname" label="LinkedIn" />
                  <SocialLink href="https://twitter.com/yourname" label="Twitter/X" />
                  <SocialLink href="https://yourdomain.com" label="Website" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
