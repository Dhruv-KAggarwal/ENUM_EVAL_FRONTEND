# Quick Reference Guide

## Installation & Setup

```bash
cd e:\Hackathon\Enum
npm install
```

## Basic Usage

### Command Line
```bash
# Compare two URLs
node src/index.js <expected-url> <student-url>

# Example
node src/index.js https://design.example.com https://student.example.com

# With local test servers
node src/example.js
```

### Programmatic Usage
```javascript
import { evaluatePages, printResult } from './src/index.js';

const result = await evaluatePages(
  'https://expected.com',
  'https://student.com'
);

console.log(JSON.stringify(result, null, 2));
printResult(result);
```

## Output Interpretation

| Field | Meaning | Range |
|-------|---------|-------|
| structure_similarity | % of elements matched | 0-100 |
| css_similarity | CSS property accuracy | 0-100 |
| layout_similarity | Position/dimension accuracy | 0-100 |
| layout_score | Layout category score | 0-20 |
| spacing_score | Margin/padding accuracy | 0-20 |
| typography_score | Font properties match | 0-20 |
| color_score | Color accuracy | 0-20 |
| component_score | Critical elements present | 0-20 |
| structure_score | Overall structure match | 0-20 |
| total_score | Sum of all scores | 0-120 |
| hard_fail_reason | Failure code (if any) | null or code |
| final_verdict | Overall result | PASS or FAIL |

## Verdict Rules

**PASS if:**
- total_score ≥ 85 AND
- hard_fail_reason = null

**FAIL if:**
- hard_fail_reason ≠ null OR
- total_score < 85

## Hard Failure Codes

```
MISSING_CORE_COMPONENTS
  ↳ Required buttons, forms, or links are missing

STRUCTURE_SIMILARITY_BELOW_THRESHOLD
  ↳ Structure similarity < 80%

PRIMARY_CTA_COLOR_MISMATCH
  ↳ Primary button color differs significantly (RGB > 60)
```

## Similarity Thresholds

| Property | Tolerance | Deduction |
|----------|-----------|-----------|
| Font-size | ±2px | -2 per px |
| Font-weight | Exact | -5 |
| Color RGB | ±30/channel | -0.2 per diff |
| Position | ±15px | Major deduction |
| Dimensions | ±15px | Major deduction |
| Margin/Padding | ±5px | Major deduction |

## Score Interpretation

```
20/20 = Perfect (category matches exactly)
18/20 = Excellent (90%)
16/20 = Good (80%)
14/20 = Satisfactory (70%)
12/20 = Marginal (60%)
10/20 = Below average (50%)
<10/20 = Critical issues
```

## Category Focus Areas

**Layout** → Position & spacing accuracy
↳ Check: Element positioning, overflow, floats

**Spacing** → Margin & padding consistency
↳ Check: Gaps between elements, box model

**Typography** → Font properties
↳ Check: Font sizes, weights, line heights

**Color** → Text & background colors
↳ Check: Text color, background color matches

**Component** → Required UI elements
↳ Check: Buttons, forms, links presence

**Structure** → DOM hierarchy
↳ Check: Element count, nesting, relationships

## Common Issues & Solutions

**❌ Structure Similarity < 80%**
- ✓ Verify all expected HTML elements are present
- ✓ Check element hierarchy and nesting
- ✓ Look for hidden or display:none elements

**❌ Layout Score < 15**
- ✓ Check element positioning (margins, positioning)
- ✓ Verify layout is within ±15px tolerance
- ✓ Review flexbox/grid properties

**❌ Spacing Score < 15**
- ✓ Adjust margin and padding values
- ✓ Ensure consistency with design spacing
- ✓ Check box model (border-box vs content-box)

**❌ Typography Score < 15**
- ✓ Verify font-size matches (within ±2px)
- ✓ Check font-weight values
- ✓ Ensure fonts are loaded before extraction

**❌ Color Score < 15**
- ✓ Verify text colors match expected RGB
- ✓ Check background colors (±30 RGB tolerance)
- ✓ Ensure no CSS filters affecting colors

**❌ Component Score = 0**
- ✓ Add or fix buttons, forms, links
- ✓ Verify elements have correct classes/IDs
- ✓ Check elements are visible (not hidden)

## Testing Examples

### Test with Example Server
```bash
node src/example.js
```
Creates two identical pages and evaluates them.
Expected output: total_score ≈ 120 (very high)

### Batch Evaluation
```javascript
import { evaluatePages } from './src/index.js';

const submissions = ['url1', 'url2', 'url3'];
const expected = 'https://expected.com';

for (const url of submissions) {
  const result = await evaluatePages(expected, url);
  console.log(`${url}: ${result.final_verdict} (${result.total_score}/120)`);
}
```

### Validation Testing
```javascript
import { validateResult } from './src/test-utils.js';

const result = await evaluatePages(url1, url2);
const validation = validateResult(result);

if (validation.valid) {
  console.log('✅ Result structure valid');
} else {
  console.log('❌ Errors:', validation.errors);
}
```

## Performance Expectations

| Operation | Time | Resources |
|-----------|------|-----------|
| Single evaluation | 15-30 sec | 150-200 MB |
| Batch (10 submissions) | 3-5 min | 500-1000 MB |
| Parallel (4 instances) | 2 min | 800 MB |

## File Reference

```
src/index.js           → Main entry point
src/extractor.js       → Data extraction
src/comparator.js      → Element matching & similarity
src/scorer.js          → Scoring & verdict
src/example.js         → Test server demo
src/advanced-examples.js → Usage patterns
src/test-utils.js      → Testing utilities
```

## Advanced Features

### Custom Result Processor
```javascript
import { evaluatePages } from './src/index.js';

const result = await evaluatePages(url1, url2);

// Process results
if (result.layout_score < 15) {
  console.log('⚠️  Layout issues detected');
}

// Get assessment
const assessment = {
  EXCEPTIONAL: result.total_score >= 110,
  EXCELLENT: result.total_score >= 100,
  GOOD: result.total_score >= 85,
  NEEDS_WORK: result.total_score < 85,
};
```

### Compare Multiple Versions
```javascript
const designs = ['v1', 'v2', 'v3'];
const student = 'submission';

const results = await Promise.all(
  designs.map(design => 
    evaluatePages(design, student)
  )
);

// Find best match
const best = results.reduce((a, b) => 
  a.total_score > b.total_score ? a : b
);
```

## Customization

### Change Scoring Weights
Edit `src/scorer.js` → `calculateScores()` function
- Adjust tolerance values
- Change penalty multipliers
- Modify category importance

### Add New Metrics
1. Add to `src/extractor.js` → `extractComputedStyles()`
2. Update comparison in `src/comparator.js`
3. Add scoring in `src/scorer.js`
4. Update output in `compileEvaluationResult()`

### Change Tolerances
Edit `src/comparator.js`:
- Font-size tolerance: Line ~170 (currently ±2px)
- Color threshold: Line ~180 (currently ±30)
- Position tolerance: Line ~250 (currently ±15px)

## Troubleshooting

**Timeout Issues**
- Increase timeout in `evaluatePages()` (currently 30s)
- Check network connection
- Verify URLs are accessible

**Missing Elements**
- Verify elements are visible (no display:none)
- Check z-index and overflow properties
- Ensure lazy-loading content is loaded

**Color Mismatches**
- Verify RGB color values in computed styles
- Check for CSS filters/overlays
- Ensure proper color inheritance

**Performance Issues**
- Run single evaluations instead of batch
- Increase wait timeout between pages
- Close other applications

## Support

For detailed information, see:
- [README.md](README.md) - Quick start
- [SETUP.md](SETUP.md) - Installation & features
- [ALGORITHM.md](ALGORITHM.md) - Complete algorithm
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Implementation details

---

**Ready to use!** Start with:
```bash
node src/index.js <expected-url> <student-url>
```
