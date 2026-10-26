import { describe, expect, it } from "vitest";
import { buildMailto, validateContact } from "@/components/Contact";
import { featuredProjects, profile } from "@/data/content";

describe("profile contact details", () => {
  it("shows the real phone, email and LinkedIn", () => {
    expect(profile.phone).toBe("+91 89710 95311");
    expect(profile.email).toBe("adithya.bk01@gmail.com");
    expect(profile.linkedin).toBe("https://www.linkedin.com/in/adithya-10102004bk");
    expect(profile.github).toBe("https://github.com/Adithyabk01");
  });
});

describe("contact form", () => {
  it("mailto goes to adithya.bk01@gmail.com with name in subject and details in body", () => {
    const url = buildMailto({ name: "Jane", email: "jane@x.com", message: "Hello there friend" });
    expect(url.startsWith("mailto:adithya.bk01@gmail.com?")).toBe(true);
    const q = new URLSearchParams(url.split("?")[1]);
    expect(q.get("subject")).toContain("Jane");
    expect(q.get("body")).toContain("jane@x.com");
    expect(q.get("body")).toContain("Hello there friend");
  });
  it("rejects invalid email", () => {
    expect(validateContact({ name: "Jane", email: "nope", message: "Hello there friend" }).email).toBeTruthy();
  });
});

describe("private repos", () => {
  it("SmartPave and Typing Arena have no GitHub/Live links", () => {
    for (const id of ["smartpave", "typing-arena"]) {
      const p = featuredProjects.find((x) => x.id === id)!;
      expect(p.privateRepo).toBe(true);
      expect(p.github).toBeUndefined();
      expect(p.live).toBeUndefined();
    }
  });
});

describe("academic project badge", () => {
  it("marks Kisan Sethu and MediRead as academic projects, not SmartPave", () => {
    const badge = (id: string) => featuredProjects.find((x) => x.id === id)?.badge;
    expect(badge("kisan-sethu")).toBe("Academic project");
    expect(badge("mediread")).toBe("Academic project");
    expect(badge("smartpave")).toBeUndefined();
  });
});
