# 🎯 Complete Usage Guide - CLI vs Web Frontend

Choose the interface that works best for you.

---

## 🖥️ Two Ways to Use the Evaluation Engine

### 1. Command Line Interface (CLI)
**For:** Batch processing, automation, scripts  
**Speed:** Fast  
**Interaction:** Programmatic  

### 2. Web Frontend
**For:** Interactive testing, visual feedback  
**Speed:** Real-time with UI  
**Interaction:** Point-and-click  

---

## 📋 CLI Usage

### Start CLI Mode
```bash
node src/index.js <expected-url> <student-url>
```

### Example 1: Compare Two Real Websites
```bash
node src/index.js https://www.example.com https://student-project.netlify.app
```

**Output:**
```json
{
  "structure_similarity": 95.5,
  "css_similarity": 92.3,
  "layout_similarity": 88.7,
  "layout_score": 17.5,
  "spacing_score": 18.2,
  "typography_score": 19.0,
  "color_score": 16.8,
  "component_score": 20.0,
  "structure_score": 19.1,
  "total_score": 110.6,
  "hard_fail_reason": null,
  "final_verdict": "PASS"
}
```

### Example 2: Batch Evaluation Script
```javascript
// batch-eval.js
import { evaluatePages } from './src/index.js';

const submissions = [
  'https://student1.netlify.app',
  'https://student2.netlify.app',
  'https://student3.netlify.app'
];

const expected = 'https://expected-design.com';

for (const url of submissions) {
  const result = await evaluatePages(expected, url);
  console.log(`${url}: ${result.final_verdict} (${result.total_score}/120)`);
}
```

Run it:
```bash
node batch-eval.js
```

### Example 3: Integration with CI/CD
```bash
#!/bin/bash
# In your CI pipeline

node src/index.js https://expected.com https://staging.com > result.json

# Check verdict
if grep -q "PASS" result.json; then
  echo "✅ Design matches!"
  exit 0
else
  echo "❌ Design mismatch"
  exit 1
fi
```

---

## 🌐 Web Frontend Usage

### Start Web Server
```bash
npm start
```

Then open:
```
http://localhost:3000
```

### Step-by-Step Guide

#### 1. **Enter Expected Design URL**
```
📐 Expected Design URL
┌─────────────────────────────────┐
│ https://example.com/design      │
└─────────────────────────────────┘
```

#### 2. **Paste Your Code**
```
💻 Student Code / HTML
┌─────────────────────────────────┐
│ <!DOCTYPE html>                 │
│ <html>                          │
│   <head>                        │
│     <title>My Site</title>      │
│     <style>                     │
│       body { color: #333; }     │
│     </style>                    │
│   </head>                       │
│   <body>                        │
│     <h1>Hello</h1>             │
│   </body>                       │
│ </html>                         │
└─────────────────────────────────┘
```

#### 3. **Click Evaluate**
```
┌──────────────────────────┐
│ ⚡ Evaluate Code        │
└──────────────────────────┘
```

#### 4. **Review Results**
```
═══════════════════════════════════
             ✅ PASS
───────────────────────────────────

Structure Similarity:  92.5%  ████████████████░░
CSS Similarity:       89.3%  ███████████████░░░
Layout Similarity:    85.7%  █████████████░░░░░

Scores:
  Layout:      17.5/20  ████████████████░░░
  Spacing:     18.2/20  █████████████████░░
  Typography: 19.0/20  ██████████████████░
  Color:       16.8/20  ████████████████░░░
  Component:   20.0/20  ███████████████████
  Structure:   19.1/20  ██████████████████░

Total Score: 110.6/120

═══════════════════════════════════
```

#### 5. **Download or Share**
- **Copy JSON** - Copy results to clipboard
- **Download** - Save results as JSON file
- **Share** - Email or share the JSON

---

## 🎯 Comparison: CLI vs Web

| Feature | CLI | Web |
|---------|-----|-----|
| **Speed** | Very fast | Real-time |
| **Batch processing** | ✅ Yes | ❌ One at a time |
| **Visual feedback** | ❌ No | ✅ Yes |
| **Automation** | ✅ Yes | ❌ No |
| **Sharing results** | 📄 JSON | 📥 Download |
| **Mobile access** | ❌ No | ✅ Yes |
| **No server needed** | ✅ Yes | ❌ Need Express |
| **Learning curve** | Medium | Easy |

---

## 🚀 Quick Start for Both

### CLI (One Command)
```bash
node src/index.js https://expected.com https://student.com
```

### Web (Two Commands)
```bash
npm start
# Open http://localhost:3000
```

---

## 💼 Use Cases

### Case 1: Evaluating a Single Student Submission
**Best:** Web Frontend
1. Student uploads code URL
2. Teacher pastes expected design URL
3. Click evaluate
4. See results immediately
5. Download feedback

### Case 2: Batch Grading (10+ Submissions)
**Best:** CLI Script
```javascript
import { evaluatePages } from './src/index.js';

const students = [
  { name: 'Alice', url: 'https://alice.netlify.app' },
  { name: 'Bob', url: 'https://bob.netlify.app' },
  // ... 50 more students
];

for (const student of students) {
  const result = await evaluatePages(expectedUrl, student.url);
  console.log(`${student.name}: ${result.final_verdict}`);
}
```

### Case 3: Remote Review (Multiple Users)
**Best:** Web Frontend
- Deploy to cloud server
- Share URL with team: `https://myserver.com:3000`
- Anyone can paste code and get feedback
- No installation needed

### Case 4: Integration with Learning Platform
**Best:** API (CLI)
```javascript
// Inside your learning platform
import { evaluatePages } from './evaluation-engine/src/index.js';

app.post('/api/submit-code', async (req, res) => {
  const result = await evaluatePages(
    expectedDesignUrl,
    studentCodeUrl
  );
  
  // Store result in database
  await saveEvaluation(studentId, result);
  
  res.json(result);
});
```

### Case 5: Continuous Integration
**Best:** CLI in Pipeline
```yaml
# .github/workflows/evaluate.yml
- name: Evaluate Design
  run: |
    node src/index.js https://expected.com https://staging.com > result.json
    cat result.json
```

---

## 🔗 Combining Both

### Workflow: Teacher + Students

**Step 1: Teacher Setup**
```bash
# Deploy web frontend
npm start

# Share URL
https://classroom.example.com:3000
```

**Step 2: Students Submit**
- Visit web interface
- Paste their code
- Get instant feedback
- Download results

**Step 3: Teacher Batch Review**
```bash
# Export all student URLs
# Run batch evaluation
node batch-eval.js

# Generate report
node generate-report.js
```

---

## 📊 Result Formats

### CLI Output (JSON)
```bash
node src/index.js url1 url2
```

Output:
```json
{
  "structure_similarity": 95.5,
  "css_similarity": 92.3,
  "layout_similarity": 88.7,
  "layout_score": 17.5,
  "spacing_score": 18.2,
  "typography_score": 19.0,
  "color_score": 16.8,
  "component_score": 20.0,
  "structure_score": 19.1,
  "total_score": 110.6,
  "hard_fail_reason": null,
  "final_verdict": "PASS"
}
```

### Web Output (Downloadable JSON)
Same format as CLI - can be imported into spreadsheets or databases.

---

## 🎓 Educational Setup

### For Teachers
**Use:** Web Frontend + CLI Script

1. **Frontend:** Let students test their code in real-time
2. **CLI:** Run final batch evaluation for grading
3. **Report:** Generate automated feedback reports

### For Students
**Use:** Web Frontend

1. Paste their HTML code
2. Get immediate feedback
3. See scores and recommendations
4. Download results to keep

### For Admins
**Use:** CLI Scripts + API

1. Automate evaluation pipeline
2. Generate reports and analytics
3. Track student progress over time
4. Export data for analysis

---

## 🚀 Your Next Steps

### Option 1: Interactive Testing (Recommended First)
```bash
npm start
# Open http://localhost:3000
# Paste code and test
```

### Option 2: Command Line (Scripting)
```bash
node src/index.js https://expected.com https://student.com
```

### Option 3: Programmatic (Integration)
```javascript
import { evaluatePages } from './src/index.js';
const result = await evaluatePages(url1, url2);
```

---

## 📞 Help & Support

**CLI Issues?** → See [README.md](README.md)

**Web Frontend Issues?** → See [FRONTEND.md](FRONTEND.md)

**Algorithm Questions?** → See [ALGORITHM.md](ALGORITHM.md)

**API Reference?** → See [API.md](API.md)

---

## ✨ You're All Set!

Choose your interface:
- **Interactive?** → `npm start`
- **Scripting?** → `node src/index.js`
- **Programming?** → `import { evaluatePages } from './src/index.js'`

**Happy evaluating!** 🎉
