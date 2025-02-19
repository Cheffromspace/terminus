import React from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Jonathan Flatt',
  description: 'Portfolio of DevOps and automation projects, featuring custom development tools, CI/CD pipelines, and AI-assisted development solutions.',
  openGraph: {
    title: 'Projects | Jonathan Flatt',
    description: 'Portfolio of DevOps and automation projects, featuring custom development tools, CI/CD pipelines, and AI-assisted development solutions.',
    type: 'website',
    url: 'https://jonathanflatt.dev/projects',
  },
  alternates: {
    canonical: 'https://jonathanflatt.dev/projects',
  }
};

export default function ProjectsPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Projects',
            description: 'Portfolio of DevOps and automation projects',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: [
                {
                  '@type': 'SoftwareSourceCode',
                  name: 'Project Title',
                  description: 'Project description goes here',
                  programmingLanguage: ['Python', 'JavaScript'],
                  codeRepository: 'https://github.com/chefFromSpace',
                  author: {
                    '@type': 'Person',
                    name: 'Jonathan Flatt'
                  }
                }
              ]
            }
          })
        }}
      />
      <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-8">Projects</h1>
      
      <div className="grid gap-8">
        {/* Project Template */}
        <div 
          className="p-8 border border-[var(--border)] rounded-lg"
          itemScope 
          itemType="https://schema.org/SoftwareSourceCode"
        >
          <h2 className="text-3xl font-semibold mb-4" itemProp="name">Project Title</h2>
          <p className="text-lg text-[var(--comment)] mb-6" itemProp="description">
            Project description goes here
          </p>
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Key Features</h3>
            <ul className="list-disc list-inside text-[var(--comment)] space-y-2" itemProp="featureList">
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
              itemProp="codeRepository"
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
    </>
  );
}
