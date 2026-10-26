import { Github, ExternalLink, Lock } from "lucide-react";
import type { Project } from "@/data/content";
import { btnSmall } from "./ui-bits";

export default function ProjectLinks({ p }: { p: Project }) {
  if (p.privateRepo) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <Lock className="h-3.5 w-3.5" /> Private repo
      </span>
    );
  }
  if (!p.github && !p.live) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {p.github && (
        <a href={p.github} target="_blank" rel="noopener noreferrer" className={btnSmall} onClick={(e) => e.stopPropagation()} aria-label={`${p.title} on GitHub`}>
          <Github className="h-4 w-4" /> GitHub
        </a>
      )}
      {p.live && (
        <a href={p.live} target="_blank" rel="noopener noreferrer" className={btnSmall} onClick={(e) => e.stopPropagation()} aria-label={`${p.title} live site`}>
          <ExternalLink className="h-4 w-4" /> Live
        </a>
      )}
    </div>
  );
}
