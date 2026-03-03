# 🚀 GETTING STARTED - Web Page Evaluation Engine

Welcome! This guide gets you up and running in 5 minutes.

## Prerequisites
- Node.js (v14 or higher)
- npm
- Two URLs to compare (expected design and student submission)

## 1️⃣ Installation (30 seconds)

```bash
cd e:\Hackathon\Enum
npm install
```

That's it! Playwright will be installed automatically.

## 2️⃣ First Evaluation (1 minute)

### Option A: Command Line
```bash
node src/index.js https://expected.com https://student.com
```

Output:
```
🔍 Starting evaluation...
📱 Loading pages with viewport 1440x900...
🌳 Extracting DOM structure...
🎨 Extracting computed styles...
📐 Extracting layout geometry...
⚖️  Comparing pages...
📊 Calculating scores...
✅ Evaluation complete!
  Verdict: PASS
```

### Option B: Test Server (with local pages)
```bash
node src/example.js
```

Creates two test pages locally and evaluates them.

### Option C: JavaScript Code
```javascript
import { evaluatePages, printResult } from './src/index.js';

const result = await evaluatePages(
  'https://expected.com',
  'https://student.com'
);

printResult(result);
console.log(JSON.stringify(result, null, 2));
```

## 3️⃣ Understanding the Output

### Verdict
```
final_verdict: "PASS"  ✅ Meets all requirements
final_verdict: "FAIL"  ❌ Does not meet requirements
```

### Similarities (0-100)
- **structure_similarity**: % of elements matched
- **css_similarity**: CSS property accuracy
- **layout_similarity**: Position/dimension accuracy

### Scores (0-20 each)
| Score | Meaning |
|-------|---------|
| 20 | Perfect match |
| 18+ | Excellent |
| 15+ | Good |
| 12+ | Acceptable |
| <12 | Needs work |

### Total Score (0-120)
| Score | Grade |
|-------|-------|
| 100+ | Exceptional |
| 85+ | **PASS** ✅ |
| 75+ | Good effort |
| <75 | Needs improvement |

### Hard Failures
If `hard_fail_reason` is not null:
- **MISSING_CORE_COMPONENTS** - Critical elements missing
- **STRUCTURE_SIMILARITY_BELOW_THRESHOLD** - Structure < 80%
- **PRIMARY_CTA_COLOR_MISMATCH** - Button color doesn't match

## 4️⃣ Common Scenarios

### Scenario 1: Student Page is Almost Identical
```
Verdict: PASS ✅
Total Score: 108/120
Reason: High similarity across all metrics, no hard failures
```

### Scenario 2: Student Page Missing a Button
```
Verdict: FAIL ❌
Total Score: 45/120
hard_fail_reason: "MISSING_CORE_COMPONENTS"
Reason: Critical button element is missing
```

### Scenario 3: Student Page Has Styling Issues
```
Verdict: FAIL ❌
Total Score: 72/120
hard_fail_reason: null
Reason: Total score < 85 due to color/spacing mismatches
```

### Scenario 4: Student Page is Completely Different
```
Verdict: FAIL ❌
Total Score: 20/120
hard_fail_reason: "STRUCTURE_SIMILARITY_BELOW_THRESHOLD"
Reason: Structure similarity < 80%
```

## 5️⃣ Next Steps

### Learn More
- **Quick Reference:** See [QUICKREF.md](QUICKREF.md)
- **Algorithm Details:** See [ALGORITHM.md](ALGORITHM.md)
- **API Reference:** See [API.md](API.md)

### Use in Production
```javascript
// Batch evaluation of submissions
const submissions = [
  'https://student1.com',
  'https://student2.com',
  'https://student3.com'
];

const expected = 'https://expected.com';

for (const url of submissions) {
  const result = await evaluatePages(expected, url);
  console.log(`${url}: ${result.final_verdict} (${result.total_score}/120)`);
}
```

### Customize for Your Needs
Edit `src/scorer.js` to adjust:
- Scoring weights
- Tolerance thresholds
- Hard failure rules
- Pass/fail cutoffs

## 📊 Example Output

```json
{
  "structure_similarity": 92.5,
  "css_similarity": 89.3,
  "layout_similarity": 85.7,
  "layout_score": 16.8,
  "spacing_score": 17.2,
  "typography_score": 18.5,
  "color_score": 16.9,
  "component_score": 20.0,
  "structure_score": 18.5,
  "total_score": 108.4,
  "hard_fail_reason": null,
  "final_verdict": "PASS"
}
```

## ❓ Troubleshooting

### Q: "Network idle timeout"
**A:** The engine waits up to 30 seconds. If you see this warning, the page loaded but slow resources were pending. The engine continues normally.

### Q: "Page failed to load"
**A:** Check that URLs are accessible and don't require authentication.

### Q: "Missing elements always get 0 on component score"
**A:** Yes - component score is binary (20 if all present, 0 if any missing). This is a hard failure if critical elements missing.

### Q: "Why isn't my score higher?"
**A:** Check:
- Color differences (RGB ±30 tolerance)
- Position differences (±15px tolerance)
- Font sizes (±2px tolerance)
- Margin/padding (±5px tolerance)

## 🎯 Performance Tips

- Run evaluations sequentially (one at a time) for reliability
- For batch processing, use a queue system
- Each evaluation takes 15-30 seconds
- Parallel evaluations possible but require separate browser instances

## 📝 Examples in Code

See [src/advanced-examples.js](src/advanced-examples.js) for:
1. Basic evaluation with file output
2. Batch evaluation of multiple submissions
3. Custom result processing and analysis
4. Comparing against multiple expected designs
5. Detailed diagnostic report generation

## ✨ You're Ready!

Start evaluating:
```bash
node src/index.js https://expected.com https://student.com
```

For detailed documentation, see [MANIFEST.md](MANIFEST.md).

---

**Questions?** Check the documentation files:
- Setup issues → [SETUP.md](SETUP.md)
- Algorithm questions → [ALGORITHM.md](ALGORITHM.md)
- Function details → [API.md](API.md)
- Quick lookup → [QUICKREF.md](QUICKREF.md)
