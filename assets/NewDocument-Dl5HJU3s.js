import{r as m,j as e,u as g}from"./index-CDeHuMG-.js";import{D as x,S as y}from"./DocumentEditor-CreIR_X5.js";import{F as p,C as v,c as f,j as b,d as S,B as j,u as D}from"./formatTime-RbwsIM6d.js";import{S as w,I as N,B as r,H as d,L as T}from"./Header-CsgSJB0s.js";import{A as u}from"./ActionBar-BENlnRyB.js";import"./switch-bjCWLv5e.js";const C=[{id:"blank",name:"Blank Article",description:"Start with a clean slate",icon:"📄",content:"",tags:[]},{id:"blog-post",name:"Blog Post",description:"Write a blog post or article",icon:"📝",content:`# Your Blog Post Title

## Introduction

Write an engaging introduction that hooks your readers and gives them a preview of what's to come.

## Main Content

### Section 1

Share your main points here. Use clear headings to organize your thoughts.

### Section 2

Continue developing your ideas. Consider using:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- \`code snippets\` for technical content
- [Links](https://example.com) to reference sources

### Section 3

Add more sections as needed to fully explore your topic.

## Conclusion

Wrap up your post with a strong conclusion that summarizes your key points and leaves readers with something to think about.

---

*What are your thoughts on this topic? Feel free to share your perspective!*`,tags:["blog","article"]},{id:"meeting-notes",name:"Meeting Notes",description:"Document meeting discussions and action items",icon:"📋",content:`# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}  
**Time:** [Meeting Time]  
**Attendees:** [List attendees]  
**Meeting Type:** [Team Meeting / Project Review / etc.]

## Agenda

1. [Agenda item 1]
2. [Agenda item 2]
3. [Agenda item 3]

## Discussion Points

### Topic 1
- Key discussion points
- Decisions made
- Concerns raised

### Topic 2
- Key discussion points
- Decisions made
- Concerns raised

## Action Items

| Task | Assigned To | Due Date | Status |
|------|-------------|----------|--------|
| [Task description] | [Name] | [Date] | [ ] |
| [Task description] | [Name] | [Date] | [ ] |

## Next Steps

- [Next step 1]
- [Next step 2]
- [Next step 3]

## Next Meeting

**Date:** [Next meeting date]  
**Time:** [Next meeting time]  
**Agenda Preview:** [Brief overview of next meeting topics]`,tags:["meeting","notes","work"]},{id:"project-proposal",name:"Project Proposal",description:"Outline a new project or initiative",icon:"🚀",content:`# Project Proposal: [Project Name]

## Executive Summary

Provide a brief overview of the project, its objectives, and expected outcomes.

## Problem Statement

Clearly define the problem or opportunity this project addresses.

## Proposed Solution

### Overview
Describe your proposed solution and how it addresses the problem.

### Key Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

### Technical Approach
Outline the technical implementation strategy.

## Project Scope

### In Scope
- [Item 1]
- [Item 2]
- [Item 3]

### Out of Scope
- [Item 1]
- [Item 2]

## Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1: Planning | [Duration] | [Deliverables] |
| Phase 2: Development | [Duration] | [Deliverables] |
| Phase 3: Testing | [Duration] | [Deliverables] |
| Phase 4: Launch | [Duration] | [Deliverables] |

## Resources Required

### Team
- [Role 1]: [Description]
- [Role 2]: [Description]

### Budget
- [Budget item 1]: [Cost]
- [Budget item 2]: [Cost]
- **Total:** [Total cost]

## Success Metrics

- [Metric 1]: [Target]
- [Metric 2]: [Target]
- [Metric 3]: [Target]

## Risks and Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| [Risk 1] | [High/Medium/Low] | [High/Medium/Low] | [Strategy] |
| [Risk 2] | [High/Medium/Low] | [High/Medium/Low] | [Strategy] |

## Conclusion

Summarize why this project should be approved and the expected benefits.`,tags:["project","proposal","business"]},{id:"technical-documentation",name:"Technical Article",description:"Write about technical processes or systems",icon:"⚙️",content:`# Technical Documentation: [System/Process Name]

## Overview

Brief description of the system, process, or technology being documented.

## Architecture

### System Components
- **Component 1**: Description and purpose
- **Component 2**: Description and purpose
- **Component 3**: Description and purpose

### Data Flow
Describe how data flows through the system.

## Installation & Setup

### Prerequisites
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### Installation Steps

1. **Step 1**: Description
   \`\`\`bash
   # Example command
   npm install package-name
   \`\`\`

2. **Step 2**: Description
   \`\`\`bash
   # Example command
   git clone repository-url
   \`\`\`

3. **Step 3**: Description

### Configuration

\`\`\`json
{
  "setting1": "value1",
  "setting2": "value2"
}
\`\`\`

## Usage

### Basic Usage

\`\`\`javascript
// Example code
const example = new ExampleClass();
example.doSomething();
\`\`\`

### Advanced Usage

\`\`\`javascript
// More complex example
const advanced = new AdvancedClass({
  option1: 'value1',
  option2: 'value2'
});
\`\`\`

## API Reference

### Method 1
- **Description**: What this method does
- **Parameters**: 
  - \`param1\` (string): Description
  - \`param2\` (number): Description
- **Returns**: Description of return value
- **Example**:
  \`\`\`javascript
  const result = method1('value', 42);
  \`\`\`

## Troubleshooting

### Common Issues

**Issue 1**: Description of the problem
- **Cause**: Why this happens
- **Solution**: How to fix it

**Issue 2**: Description of the problem
- **Cause**: Why this happens
- **Solution**: How to fix it

## Contributing

Guidelines for contributing to this project or system.

## Changelog

### Version 1.0.0
- Initial release
- Feature 1 added
- Feature 2 added`,tags:["technical","documentation","development"]},{id:"research-paper",name:"Research Article",description:"Academic or professional research article",icon:"🔬",content:`# Research Paper Title

**Author(s):** [Your Name]  
**Date:** ${new Date().toLocaleDateString()}  
**Institution/Organization:** [Your Institution]

## Abstract

Provide a concise summary of your research, including the problem, methodology, key findings, and conclusions. Keep this to 150-250 words.

## 1. Introduction

### 1.1 Background
Provide context and background information on your research topic.

### 1.2 Problem Statement
Clearly define the research problem or question you're addressing.

### 1.3 Objectives
- Primary objective: [Main goal]
- Secondary objectives:
  - [Objective 1]
  - [Objective 2]
  - [Objective 3]

### 1.4 Scope and Limitations
Define what your research covers and any limitations.

## 2. Literature Review

### 2.1 Previous Research
Summarize relevant previous research and studies.

### 2.2 Research Gap
Identify gaps in existing research that your study addresses.

## 3. Methodology

### 3.1 Research Design
Describe your research approach and design.

### 3.2 Data Collection
Explain how you collected your data.

### 3.3 Analysis Methods
Describe the methods used to analyze your data.

## 4. Results

### 4.1 Key Findings
Present your main findings clearly and objectively.

### 4.2 Data Analysis
Provide detailed analysis of your results.

## 5. Discussion

### 5.1 Interpretation of Results
Interpret your findings in the context of your research questions.

### 5.2 Implications
Discuss the implications of your findings.

### 5.3 Limitations
Acknowledge any limitations in your study.

## 6. Conclusion

Summarize your key findings and their significance. Suggest areas for future research.

## References

1. [Reference 1]
2. [Reference 2]
3. [Reference 3]

## Appendices

### Appendix A: [Title]
[Additional supporting material]`,tags:["research","academic","paper"]},{id:"tutorial",name:"Tutorial/How-to Guide",description:"Step-by-step instructional content",icon:"📚",content:`# How to [Task/Skill Name]: A Complete Guide

## Introduction

Welcome to this comprehensive guide on [topic]. By the end of this tutorial, you'll be able to [learning outcome].

### What You'll Learn
- [Skill/concept 1]
- [Skill/concept 2]
- [Skill/concept 3]

### Prerequisites
- [Prerequisite 1]
- [Prerequisite 2]
- [Prerequisite 3]

### Time Required
Approximately [X] minutes/hours

## Getting Started

### What You'll Need
- [Tool/resource 1]
- [Tool/resource 2]
- [Tool/resource 3]

## Step-by-Step Instructions

### Step 1: [First Step Title]

**Goal:** [What this step accomplishes]

1. [Detailed instruction 1]
2. [Detailed instruction 2]
3. [Detailed instruction 3]

> **💡 Tip:** [Helpful tip or best practice]

**Expected Result:** [What should happen after this step]

### Step 2: [Second Step Title]

**Goal:** [What this step accomplishes]

1. [Detailed instruction 1]
2. [Detailed instruction 2]

\`\`\`
# Example code or command
example command here
\`\`\`

> **⚠️ Warning:** [Important warning or caution]

### Step 3: [Third Step Title]

Continue with additional steps as needed...

## Common Mistakes to Avoid

- **Mistake 1:** [Description]
  - **Why it happens:** [Explanation]
  - **How to avoid:** [Solution]

- **Mistake 2:** [Description]
  - **Why it happens:** [Explanation]
  - **How to avoid:** [Solution]

## Troubleshooting

### Problem 1: [Issue description]
**Solution:** [How to fix it]

### Problem 2: [Issue description]
**Solution:** [How to fix it]

## Advanced Tips

Once you've mastered the basics, try these advanced techniques:

1. [Advanced tip 1]
2. [Advanced tip 2]
3. [Advanced tip 3]

## Conclusion

Congratulations! You've successfully learned [skill/topic]. 

### What's Next?
- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]

### Additional Resources
- [Resource 1]: [Link or description]
- [Resource 2]: [Link or description]
- [Resource 3]: [Link or description]

---

*Did this tutorial help you? Share your experience and any questions in the comments!*`,tags:["tutorial","guide","education"]}];function k({onSelectTemplate:t}){const[i,o]=m.useState(""),a=C.filter(s=>s.name.toLowerCase().includes(i.toLowerCase())||s.description.toLowerCase().includes(i.toLowerCase())||s.tags.some(n=>n.toLowerCase().includes(i.toLowerCase())));return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold mb-2",children:"Choose a Template"}),e.jsx("p",{className:"text-muted-foreground",children:"Start with a template or create a blank article"})]}),e.jsxs("div",{className:"relative max-w-md mx-auto",children:[e.jsx(w,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"}),e.jsx(N,{placeholder:"Search templates...",value:i,onChange:s=>o(s.target.value),className:"pl-10"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:a.map(s=>e.jsx(A,{template:s,onSelect:()=>t(s)},s.id))}),a.length===0&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx(p,{className:"h-12 w-12 text-muted-foreground mx-auto mb-4"}),e.jsx("p",{className:"text-muted-foreground",children:"No templates found matching your search."})]})]})}function A({template:t,onSelect:i}){return e.jsxs(v,{className:"hover:shadow-md transition-shadow cursor-pointer group",onClick:i,children:[e.jsxs(f,{className:"pb-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"text-2xl",children:t.icon}),e.jsx("div",{className:"flex-1",children:e.jsx(b,{className:"text-lg group-hover:text-primary transition-colors",children:t.name})})]}),e.jsx("p",{className:"text-sm text-muted-foreground",children:t.description})]}),e.jsxs(S,{className:"pt-0",children:[t.tags.length>0&&e.jsx("div",{className:"flex flex-wrap gap-1 mb-4",children:t.tags.map(o=>e.jsx(j,{variant:"outline",className:"text-xs",children:o},o))}),t.content&&e.jsx("div",{className:"text-xs text-muted-foreground mb-4",children:e.jsxs("p",{className:"line-clamp-3",children:[t.content.substring(0,120),"..."]})}),e.jsx(r,{className:"w-full",variant:"outline",children:"Use Template"})]})]})}function W(){const t=g(),{user:i}=D(),[o,a]=m.useState(null),s=c=>{a(c)},n=()=>{o?a(null):t("/")};return i?e.jsxs("div",{className:"min-h-screen bg-gray-50 dark:bg-gray-900 pb-8",children:[e.jsx(d,{}),o?e.jsx(x,{templateContent:o.content,renderActions:({handleSaveDraft:c,handlePublish:h,isPublishing:l})=>e.jsx("div",{className:"container mx-auto px-4 py-6 max-w-6xl",children:e.jsxs(u,{showBackButton:!0,onBack:n,backButtonText:"Back to Templates",children:[e.jsxs(r,{variant:"outline",onClick:c,disabled:l,children:[e.jsx(y,{className:"h-4 w-4 mr-2"}),"Save Draft"]}),e.jsxs(r,{onClick:h,disabled:l,children:[e.jsx(p,{className:"h-4 w-4 mr-2"}),"Publish"]})]})})}):e.jsxs("div",{className:"container mx-auto px-4 py-8",children:[e.jsx(u,{showBackButton:!0,onBack:n,backButtonText:"Back to Dashboard"}),e.jsx(k,{onSelectTemplate:s})]})]}):e.jsxs("div",{className:"min-h-screen bg-gray-50 dark:bg-gray-900",children:[e.jsx(d,{}),e.jsx("div",{className:"flex items-center justify-center min-h-[calc(100vh-200px)]",children:e.jsxs("div",{className:"text-center max-w-md mx-auto px-4",children:[e.jsx("h1",{className:"text-2xl font-bold mb-4",children:"Create New Article"}),e.jsx("p",{className:"text-muted-foreground mb-6",children:"You need to connect your Nostr account to create articles."}),e.jsx(T,{className:"max-w-60 mx-auto mb-4"}),e.jsx(r,{variant:"outline",onClick:()=>t("/"),children:"Browse Articles Instead"})]})})]})}export{W as default};
