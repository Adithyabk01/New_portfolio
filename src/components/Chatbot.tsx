import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  ArrowUpRight,
  Download,
} from "lucide-react";
import {
  profile,
  about,
  resumes,
  skillGroups,
  featuredProjects,
  journey,
  certifications,
} from "@/data/content";
import { scrollToSection } from "@/lib/store";

interface ActionChip {
  label: string;
  icon?: "nav" | "link" | "download";
  onClick: () => void;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  chips?: ActionChip[];
  timestamp: Date;
}

const INITIAL_SUGGESTIONS = [
  "🚀 What projects has Adithya built?",
  "💡 What are his AI/ML & Web skills?",
  "🎓 Tell me about his education & background",
  "📄 How can I download his resumes?",
  "📬 How do I get in touch?",
];

function generateBotResponse(rawInput: string): { text: string; chips?: ActionChip[] } {
  const query = rawInput.toLowerCase().trim();

  // 1. Resumes
  if (query.includes("resume") || query.includes("cv") || query.includes("download")) {
    return {
      text: `Adithya has two tailored resumes available:\n\n• **SDE Resume**: Focuses on Full-Stack engineering, React, TypeScript, Next.js, FastAPI & distributed systems.\n• **AI/ML Resume**: Emphasizes machine learning pipelines, LLM/NLP products, Llama3, scikit-learn & data modeling.`,
      chips: [
        {
          label: "Download SDE Resume",
          icon: "download",
          onClick: () => window.open(resumes[0].href, "_blank"),
        },
        {
          label: "Download AI/ML Resume",
          icon: "download",
          onClick: () => window.open(resumes[1].href, "_blank"),
        },
        {
          label: "View Contact Details",
          icon: "nav",
          onClick: () => scrollToSection("contact"),
        },
      ],
    };
  }

  // 2. Education & Academic Background
  if (
    query.includes("education") ||
    query.includes("college") ||
    query.includes("school") ||
    query.includes("academic") ||
    query.includes("degree") ||
    query.includes("cgpa") ||
    query.includes("puc") ||
    query.includes("sslc") ||
    query.includes("marks") ||
    query.includes("study") ||
    query.includes("pes")
  ) {
    const academicsList = about.academicBackground
      ? about.academicBackground
          .map((a) => `• **${a.institution}**\n  *${a.degree}* — Score: **${a.score}**\n  ${a.detail}`)
          .join("\n\n")
      : "";

    return {
      text: `Here is Adithya's complete academic background:\n\n🎓 **Undergraduate Degree (Current)**:\n• **${about.college}**\n  ${about.degree}\n  Period: ${about.period} | CGPA: **${about.cgpa}**\n\n📚 **Pre-University & High School**:\n${academicsList}`,
      chips: [
        {
          label: "Jump to About Section",
          icon: "nav",
          onClick: () => scrollToSection("about"),
        },
        {
          label: "View Skills",
          icon: "nav",
          onClick: () => scrollToSection("skills"),
        },
      ],
    };
  }

  // 3. Specific Project: Kisan Sethu
  if (query.includes("kisan") || query.includes("sethu") || query.includes("farm") || query.includes("agri")) {
    const p = featuredProjects.find((x) => x.id === "kisan-sethu");
    return {
      text: `🌾 **${p?.title || "Kisan Sethu"}** (${p?.subtitle})\n\n${p?.description}\n\n**Key Highlights**:\n${p?.highlights.map((h) => `• ${h}`).join("\n")}\n\n**Tech Stack**: ${p?.stack.join(", ")}`,
      chips: [
        {
          label: "Jump to Kisan Sethu",
          icon: "nav",
          onClick: () => scrollToSection("projects"),
        },
        ...(p?.github
          ? [
              {
                label: "View on GitHub",
                icon: "link" as const,
                onClick: () => window.open(p.github, "_blank"),
              },
            ]
          : []),
      ],
    };
  }

  // 4. Specific Project: RecoverAI
  if (query.includes("recover") || query.includes("recoverai") || query.includes("razorpay")) {
    const p = featuredProjects.find((x) => x.id === "recoverai");
    return {
      text: `💳 **${p?.title || "RecoverAI"}** (${p?.subtitle})\n\n${p?.description}\n\n**Key Highlights**:\n${p?.highlights.map((h) => `• ${h}`).join("\n")}\n\n**Tech Stack**: ${p?.stack.join(", ")}`,
      chips: [
        {
          label: "Jump to Projects",
          icon: "nav",
          onClick: () => scrollToSection("projects"),
        },
        ...(p?.github
          ? [
              {
                label: "View on GitHub",
                icon: "link" as const,
                onClick: () => window.open(p.github, "_blank"),
              },
            ]
          : []),
      ],
    };
  }

  // 5. Specific Project: MediRead
  if (query.includes("mediread") || query.includes("medical") || query.includes("report")) {
    const p = featuredProjects.find((x) => x.id === "mediread");
    return {
      text: `🏥 **${p?.title || "MediRead"}** (${p?.subtitle})\n\n${p?.description}\n\n**Key Highlights**:\n${p?.highlights.map((h) => `• ${h}`).join("\n")}\n\n**Tech Stack**: ${p?.stack.join(", ")}`,
      chips: [
        {
          label: "Jump to Projects",
          icon: "nav",
          onClick: () => scrollToSection("projects"),
        },
        ...(p?.github
          ? [
              {
                label: "View on GitHub",
                icon: "link" as const,
                onClick: () => window.open(p.github, "_blank"),
              },
            ]
          : []),
      ],
    };
  }

  // 6. General Projects
  if (query.includes("project") || query.includes("build") || query.includes("app") || query.includes("work")) {
    const list = featuredProjects.map((p) => `• **${p.title}**: ${p.subtitle} (${p.stack.slice(0, 3).join(", ")})`).join("\n");
    return {
      text: `Adithya has built **8+ production-grade projects** across Full-Stack, AI/ML, and Data systems:\n\n${list}\n\nPlus platforms like **SmartPave**, **The Typing Arena**, **KrishiMitra**, and **Cancer Cell Prediction (ML)**.`,
      chips: [
        {
          label: "Explore All Projects",
          icon: "nav",
          onClick: () => scrollToSection("projects"),
        },
        {
          label: "Adithya's GitHub (19 Repos)",
          icon: "link",
          onClick: () => window.open(profile.github, "_blank"),
        },
      ],
    };
  }

  // 7. Skills & Tech Stack
  if (
    query.includes("skill") ||
    query.includes("stack") ||
    query.includes("tech") ||
    query.includes("language") ||
    query.includes("python") ||
    query.includes("react") ||
    query.includes("typescript") ||
    query.includes("ai") ||
    query.includes("ml") ||
    query.includes("fastapi")
  ) {
    const groups = skillGroups.map((g) => `• **${g.name}**: ${g.skills.join(", ")}`).join("\n");
    return {
      text: `Here is a breakdown of Adithya's technical toolkit:\n\n${groups}\n\nHe specializes in connecting high-performance TypeScript & Python backends with intelligent LLM/NLP workflows.`,
      chips: [
        {
          label: "View Interactive 3D Skills Orbit",
          icon: "nav",
          onClick: () => scrollToSection("skills"),
        },
        {
          label: "View Projects",
          icon: "nav",
          onClick: () => scrollToSection("projects"),
        },
      ],
    };
  }

  // 8. Experience & Journey
  if (
    query.includes("experience") ||
    query.includes("intern") ||
    query.includes("journey") ||
    query.includes("hackathon") ||
    query.includes("sih")
  ) {
    const items = journey.slice(0, 4).map((j) => `• **${j.title}** (${j.org}) — *${j.date}*${j.detail ? `\n  ${j.detail}` : ""}`).join("\n");
    return {
      text: `Key career highlights & milestones:\n\n${items}\n\nAdithya also qualified for **Smart India Hackathon (SIH) 2025** and competed in the Razorpay Buildathon!`,
      chips: [
        {
          label: "View Complete Journey",
          icon: "nav",
          onClick: () => scrollToSection("journey"),
        },
        {
          label: "Check Certifications",
          icon: "nav",
          onClick: () => scrollToSection("journey"),
        },
      ],
    };
  }

  // 9. Certifications
  if (query.includes("certif") || query.includes("course") || query.includes("credential")) {
    const list = certifications.map((c) => `• ${c}`).join("\n");
    return {
      text: `Adithya holds **${certifications.length}+ verified certifications**:\n\n${list}`,
      chips: [
        {
          label: "View Journey & Badges",
          icon: "nav",
          onClick: () => scrollToSection("journey"),
        },
      ],
    };
  }

  // 10. Contact / Reach out
  if (
    query.includes("contact") ||
    query.includes("email") ||
    query.includes("hire") ||
    query.includes("phone") ||
    query.includes("reach") ||
    query.includes("connect") ||
    query.includes("linkedin") ||
    query.includes("location")
  ) {
    return {
      text: `You can reach out to Adithya directly through:\n\n📧 **Email**: ${profile.email}\n📱 **Phone**: ${profile.phone}\n📍 **Location**: ${profile.location}\n💼 **LinkedIn**: [Profile](${profile.linkedin})\n🐙 **GitHub**: [Profile](${profile.github})\n\nFeel free to drop a message through the contact form!`,
      chips: [
        {
          label: "Go to Contact Form",
          icon: "nav",
          onClick: () => scrollToSection("contact"),
        },
        {
          label: "Open LinkedIn",
          icon: "link",
          onClick: () => window.open(profile.linkedin, "_blank"),
        },
      ],
    };
  }

  // 11. About / Who is Adithya
  if (
    query.includes("about") ||
    query.includes("who is") ||
    query.includes("intro") ||
    query.includes("summary") ||
    query.includes("bio") ||
    query.includes("name")
  ) {
    return {
      text: `**${profile.name}** is a **${profile.roles.join(" · ")}** based in ${profile.location}.\n\n"${profile.tagline}"\n\nHe is pursuing his ${about.degree} at ${about.college} with a CGPA of **${about.cgpa}**, and has built 8+ production-ready platforms combining modern web architecture with practical AI systems.`,
      chips: [
        {
          label: "Read Full Bio",
          icon: "nav",
          onClick: () => scrollToSection("about"),
        },
        {
          label: "Download Resumes",
          icon: "download",
          onClick: () => window.open(resumes[0].href, "_blank"),
        },
      ],
    };
  }

  // 12. Greetings
  if (query.match(/^(hi|hello|hey|yo|greetings|hola|sup|good morning|good evening)/)) {
    return {
      text: `Hello! 👋 Welcome to Adithya's portfolio. I'm his virtual assistant here to help you explore his work, skills, and background.\n\nWhat would you like to know more about?`,
      chips: [
        {
          label: "Featured Projects",
          icon: "nav",
          onClick: () => scrollToSection("projects"),
        },
        {
          label: "Technical Skills",
          icon: "nav",
          onClick: () => scrollToSection("skills"),
        },
        {
          label: "Academic Background",
          icon: "nav",
          onClick: () => scrollToSection("about"),
        },
        {
          label: "Contact Adithya",
          icon: "nav",
          onClick: () => scrollToSection("contact"),
        },
      ],
    };
  }

  // Fallback
  return {
    text: `I'd love to help with that! You can ask me anything about Adithya's **projects** (like Kisan Sethu or RecoverAI), **technical skills** (React, Python, AI/ML), **education**, **internships**, or **how to contact him**.`,
    chips: [
      {
        label: "Projects",
        icon: "nav",
        onClick: () => scrollToSection("projects"),
      },
      {
        label: "AI/ML & Web Skills",
        icon: "nav",
        onClick: () => scrollToSection("skills"),
      },
      {
        label: "Education & CGPA",
        icon: "nav",
        onClick: () => scrollToSection("about"),
      },
      {
        label: "Get in Touch",
        icon: "nav",
        onClick: () => scrollToSection("contact"),
      },
    ],
  };
}

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lIdx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={lIdx} className="block min-h-[1.25em]">
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </span>
    );
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: `Hi there! 👋 I'm **Adithya's AI Assistant**.\n\nAsk me anything about his full-stack & AI/ML projects, skills, education, or get in touch directly!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isTyping) return;

    setHasInteracted(true);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Natural typing delay simulation
    setTimeout(() => {
      const { text: responseText, chips } = generateBotResponse(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: responseText,
        chips,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: `Chat reset! ✨ What else would you like to know about Adithya?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              aria-label="Open AI Assistant Chat"
              className="group relative flex h-14 items-center gap-2.5 rounded-full border border-border/80 bg-background/85 px-4 py-2.5 text-foreground shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-accent hover:shadow-[0_0_30px_rgba(79,227,240,0.3)] glow-primary"
            >
              {/* Pulse Indicator */}
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-accent">
                <Bot className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              </div>

              <span className="hidden font-medium text-sm sm:inline-block">
                Chat with AI
              </span>

              {!hasInteracted && (
                <span className="absolute -top-2 -right-1 rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent-foreground shadow-md animate-pulse">
                  NEW
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chatbot Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="flex h-[560px] max-h-[82vh] w-[92vw] max-w-[410px] flex-col overflow-hidden rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-5 py-3.5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent p-[1px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Adithya AI Assistant
                    </h3>
                    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span>Online</span>
                      <span>·</span>
                      <span className="text-accent">Portfolio Guide</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    title="Clear chat"
                    className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Clear chat history"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Close"
                    className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-thumb]:rounded-full">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.sender === "bot" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground font-medium shadow-md"
                          : "border border-border/70 bg-muted/60 text-foreground backdrop-blur-sm"
                      }`}
                    >
                      {renderFormattedText(m.text)}

                      {/* Interactive Action Chips */}
                      {m.chips && m.chips.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                          {m.chips.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                chip.onClick();
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent transition-all duration-150 hover:bg-accent hover:text-accent-foreground active:scale-95"
                            >
                              <span>{chip.label}</span>
                              {chip.icon === "link" && <ArrowUpRight className="h-3 w-3" />}
                              {chip.icon === "download" && <Download className="h-3 w-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {m.sender === "user" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-muted/50 px-3.5 py-2.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Starter Suggestion Pills (if few messages) */}
              {messages.length <= 2 && (
                <div className="border-t border-border/40 bg-muted/20 px-4 py-2">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Suggested Questions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sug)}
                        className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-left text-xs text-foreground/90 transition hover:border-accent hover:bg-muted/80 hover:text-accent"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 border-t border-border/60 bg-muted/30 p-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about skills, projects, contact..."
                  className="flex-1 rounded-full border border-border/80 bg-background/80 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
