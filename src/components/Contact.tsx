import { useState, type FormEvent } from "react";
import { Check, Copy, Download, Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { profile, resumes } from "@/data/content";
import { Magnetic, SectionHeading, btnPrimary, btnSmall } from "./ui-bits";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function validateContact(v: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email.";
  if (v.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  return e;
}

export function buildMailto(v: { name: string; email: string; message: string }) {
  const subject = `Portfolio contact from ${v.name.trim()}`;
  const body = `Name: ${v.name.trim()}\nEmail: ${v.email.trim()}\n\n${v.message.trim()}`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const input =
  "mt-1 w-full rounded-xl border border-input bg-background/70 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none";

export default function Contact() {
  const [v, setV] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateContact(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    window.location.href = buildMailto(v);
    setSent(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = profile.email; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative px-5 py-28 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div className="text-panel p-6 md:p-8">
          <SectionHeading kicker="05 · Contact" title="Let's build something." />
          <p className="text-base text-muted-foreground md:text-lg">Open to internships, collaborations and interesting problems.</p>
          <ul className="mt-8 space-y-4 text-base">
            <li className="flex flex-wrap items-center gap-3">
              <Mail className="h-5 w-5 text-accent" />
              <a href={`mailto:${profile.email}`} className="text-foreground hover:text-accent">{profile.email}</a>
              <button onClick={copy} className={btnSmall} aria-live="polite">
                {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy email</>}
              </button>
            </li>
            <li className="flex flex-wrap items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <a href="tel:+918971095311" className="text-foreground hover:text-accent">{profile.phone}</a>
            </li>
            <li className="flex items-center gap-3"><Linkedin className="h-5 w-5 text-accent" /><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent">linkedin.com/in/adithya-10102004bk</a></li>
            <li className="flex items-center gap-3"><Github className="h-5 w-5 text-accent" /><a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent">github.com/Adithyabk01</a></li>
            <li className="flex items-center gap-3 text-foreground"><MapPin className="h-5 w-5 text-accent" />Mandya, India</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            {resumes.map((r) => (
              <a key={r.href} href={r.href} download className={btnSmall}><Download className="h-4 w-4" /> Download {r.label}</a>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-popover/90 p-6 backdrop-blur-xl md:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center" role="status">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground glow-accent"><Check className="h-8 w-8" /></div>
              <h3 className="mt-5 text-2xl font-bold text-foreground">Thanks, {v.name.trim().split(" ")[0]}!</h3>
              <p className="mt-2 max-w-sm text-base text-muted-foreground">Your email app should have opened with the message ready — just hit send. If it didn't, email me at {profile.email}.</p>
              <button className={`${btnSmall} mt-6`} onClick={() => { setSent(false); setV({ name: "", email: "", message: "" }); }}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              {(["name", "email"] as const).map((f) => (
                <div key={f}>
                  <label htmlFor={`c-${f}`} className="text-sm font-medium text-foreground">{f === "name" ? "Name" : "Email"}</label>
                  <input
                    id={`c-${f}`} type={f === "email" ? "email" : "text"} value={v[f]}
                    autoComplete={f}
                    onChange={(e) => setV({ ...v, [f]: e.target.value })}
                    aria-invalid={!!errors[f]} aria-describedby={errors[f] ? `c-${f}-err` : undefined}
                    className={input} placeholder={f === "name" ? "Your name" : "you@example.com"}
                  />
                  {errors[f] && <p id={`c-${f}-err`} className="mt-1 text-sm text-destructive">{errors[f]}</p>}
                </div>
              ))}
              <div>
                <label htmlFor="c-message" className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  id="c-message" rows={5} value={v.message}
                  onChange={(e) => setV({ ...v, message: e.target.value })}
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-err" : undefined}
                  className={input} placeholder="Tell me about your project…"
                />
                {errors.message && <p id="c-message-err" className="mt-1 text-sm text-destructive">{errors.message}</p>}
              </div>
              <Magnetic><button type="submit" className={btnPrimary}><Send className="h-4 w-4" /> Send message</button></Magnetic>
            </form>
          )}
        </div>
      </div>
      <footer className="mx-auto mt-24 max-w-6xl border-t border-border pt-6 text-center font-mono text-sm text-muted-foreground">
        Designed &amp; built by Adithya B K · © 2026
      </footer>
    </section>
  );
}
