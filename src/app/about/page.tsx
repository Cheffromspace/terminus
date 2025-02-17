import React from "react";

export default function AboutPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">About Me</h1>
      
      <section className="mb-12">
        <p className="text-lg text-[var(--comment)] mb-6">
          I&apos;m a DevOps engineer passionate about creating bespoke tooling that enhances 
          developer workflows. My focus lies at the intersection of ergonomic design 
          and efficient automation, with a particular interest in leveraging AI to 
          develop better software.
        </p>
        <p className="text-lg text-[var(--comment)] mb-6">
          Through my work, I strive to bridge the gap between complex systems and 
          user-friendly interfaces, creating tools that make development more 
          intuitive and enjoyable.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Areas of Focus</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border border-[var(--border)] rounded-lg">
            <h3 className="text-xl font-medium mb-4">DevOps & Tooling</h3>
            <ul className="space-y-2 text-[var(--comment)]">
              <li>• Custom Development Tools</li>
              <li>• Automation Workflows</li>
              <li>• CI/CD Pipelines</li>
              <li>• Infrastructure as Code</li>
            </ul>
          </div>
          <div className="p-6 border border-[var(--border)] rounded-lg">
            <h3 className="text-xl font-medium mb-4">AI & Development</h3>
            <ul className="space-y-2 text-[var(--comment)]">
              <li>• AI-Assisted Development</li>
              <li>• Developer Experience</li>
              <li>• Tool Ergonomics</li>
              <li>• System Design</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Writing & Projects</h2>
        <p className="text-lg text-[var(--comment)] mb-6">
          I write about DevOps practices, tool development, and the intersection of AI 
          and software development. My blog posts and projects explore ways to make 
          development more efficient and enjoyable through better tooling and processes.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/chefFromSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            data-nav-item
          >
            GitHub Profile
          </a>
        </div>
      </section>
    </div>
  );
}
