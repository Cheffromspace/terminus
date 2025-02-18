---
title: "Testing Mermaid Diagrams"
date: 2024-02-15
publishDate: 2025-02-20T12:00:00Z
slug: test-mermaid
description: "A demonstration of Mermaid diagram rendering capabilities"
---

# Testing Mermaid Diagrams

Below is a sample flowchart created with Mermaid:

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B
    C --> E[End]
```

And here's a sequence diagram:

```mermaid
sequenceDiagram
    participant User
    participant Blog
    participant API
    User -> Blog: View Post
    Blog -> API: Fetch Content
    API --> Blog: Return Content
```
