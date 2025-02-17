import React from "react";

export default function ProjectsPage(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">Projects</h1>
      
      <div className="grid gap-8">
        {/* Project Template */}
        <div className="p-8 border border-[var(--border)] rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">Project Title</h2>
          <p className="text-lg text-[var(--comment)] mb-6">
            Project description goes here
          </p>
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-[var(--comment)] space-y-2">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/chefFromSpace"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
              data-nav-item
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Additional project cards can be added here */}
      </div>
    </div>
  );
}
