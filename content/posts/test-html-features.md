---
title: "HTML Test Page"
date: "2024-02-16"
description: "A comprehensive test page for HTML features in Markdown"
---

# HTML Features Test Page

This page demonstrates HTML features that can be used within Markdown content.

## Basic HTML Elements

### Text Formatting

<p>Regular paragraph with <em>emphasis</em> and <strong>strong</strong> text.</p>
<p>Text with <mark>highlighting</mark> and <sub>subscript</sub> and <sup>superscript</sup>.</p>

### Semantic Elements

<article>
  <header>
    <h1>Article Title</h1>
    <p>Article metadata</p>
  </header>
  <section>
    <h2>Section Heading</h2>
    <p>Section content</p>
  </section>
  <footer>
    <p>Article footer</p>
  </footer>
</article>

## Advanced Features

### Custom Styling

<div style="padding: 1rem; background-color: var(--background-secondary); border-radius: 0.5rem;">
  <h3>Styled Container</h3>
  <p>Content with custom styling using CSS variables</p>
</div>

### Interactive Elements

<details>
  <summary>Click to expand</summary>
  <p>Hidden content that can be toggled</p>
</details>

<button onclick="alert('Button clicked!')">Interactive Button</button>

### Embedded Content

<figure>
  <img src="https://via.placeholder.com/300" alt="Example image">
  <figcaption>Figure with caption</figcaption>
</figure>

### Tables with HTML

<table>
  <thead>
    <tr>
      <th colspan="2">Complex Table Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">Cell spanning rows</td>
      <td>Regular cell</td>
    </tr>
    <tr>
      <td>Another cell</td>
    </tr>
  </tbody>
</table>

### Forms (Non-functional, for testing)

<form>
  <fieldset>
    <legend>Form Elements</legend>
    <div>
      <label for="text-input">Text Input:</label>
      <input type="text" id="text-input" disabled placeholder="Disabled input">
    </div>
    <div>
      <label for="select-input">Select:</label>
      <select id="select-input" disabled>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    </div>
  </fieldset>
</form>

### Definition Lists

<dl>
  <dt>Definition Term</dt>
  <dd>Definition description</dd>
  <dt>Another Term</dt>
  <dd>Another description</dd>
</dl>

### Progress and Meters

<div>
  <label>Progress:</label>
  <progress value="70" max="100">70%</progress>
</div>

<div>
  <label>Meter:</label>
  <meter value="0.6">60%</meter>
</div>

### Accessibility Features

<div role="alert" aria-live="polite">
  This is an ARIA live region
</div>

<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="#" aria-current="page">Home</a></li>
    <li><a href="#">Section</a></li>
    <li>Current Page</li>
  </ol>
</nav>

### Custom Data Attributes

<div data-test="value" data-custom-attr="example">
  Element with custom data attributes
</div>

### Responsive Elements

<picture>
  <source media="(min-width: 800px)" srcset="https://via.placeholder.com/800x400">
  <source media="(min-width: 400px)" srcset="https://via.placeholder.com/400x200">
  <img src="https://via.placeholder.com/200x100" alt="Responsive image">
</picture>

This page helps test HTML rendering capabilities and styling consistency across the blog.
