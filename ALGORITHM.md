/**
 * ARCHITECTURE & ALGORITHM DOCUMENTATION
 * 
 * Web Page Evaluation Engine
 * Complete breakdown of system design, algorithms, and scoring logic
 */

/**
 * ============================================================================
 * SYSTEM ARCHITECTURE
 * ============================================================================
 * 
 * The engine is organized into 4 independent modules:
 * 
 * 1. EXTRACTOR (extractor.js)
 *    └─ Responsibility: Extract raw data from pages
 *    └─ Methods:
 *       - extractDomStructure() → Array<Element>
 *       - extractComputedStyles() → Map<ElementIdx, Styles>
 *       - extractLayoutGeometry() → Map<ElementIdx, Rect>
 *       - preparePageForExtraction() → void
 * 
 * 2. COMPARATOR (comparator.js)
 *    └─ Responsibility: Match elements and calculate similarities
 *    └─ Methods:
 *       - matchElements() → Map<ActualIdx, ExpectedIdx>
 *       - calculateStructureSimilarity() → 0-100
 *       - calculateCssSimilarity() → 0-100
 *       - calculateLayoutSimilarity() → 0-100
 *       - identifyCriticalComponents() → Array<Idx>
 *       - allCriticalComponentsPresent() → boolean
 * 
 * 3. SCORER (scorer.js)
 *    └─ Responsibility: Calculate scores and determine verdict
 *    └─ Methods:
 *       - calculateScores() → ScoreBreakdown
 *       - checkHardFailures() → string|null
 *       - determineFinalVerdict() → 'PASS'|'FAIL'
 *       - compileEvaluationResult() → FinalResult
 * 
 * 4. ORCHESTRATOR (index.js)
 *    └─ Responsibility: Coordinate workflow and browser management
 *    └─ Methods:
 *       - evaluatePages() → Promise<Result>
 *       - printResult() → void
 * 
 * 
 * ============================================================================
 * STEP-BY-STEP EXECUTION FLOW
 * ============================================================================
 * 
 * 1. BROWSER LAUNCH
 *    └─ chromium.launch({ headless: true })
 *    └─ Create identical viewports: 1440x900
 *    └─ Navigate to both URLs
 * 
 * 2. PAGE PREPARATION
 *    └─ Inject CSS to disable animations/transitions
 *    └─ Wait for network idle (max 30s)
 *    └─ Wait additional 500ms for lazy content
 * 
 * 3. DATA EXTRACTION
 *    ├─ DOM Structure
 *    │  └─ Traverse document.documentElement recursively
 *    │  └─ Record: tagName, id, classList, textContent, depth, parent/child IDs
 *    │  └─ Include only visible elements (getBoundingClientRect width/height > 0)
 *    │
 *    ├─ Computed Styles
 *    │  └─ Query all elements: document.querySelectorAll('*')
 *    │  └─ For each: window.getComputedStyle(element)
 *    │  └─ Parse: fontSize, fontWeight, color, backgroundColor, margin/padding,
 *    │            display, position, width, height, borderRadius, textAlign
 *    │  └─ Parse colors to {r, g, b, a} format
 *    │  └─ Parse margin/padding to {top, right, bottom, left}
 *    │
 *    └─ Layout Geometry
 *       └─ Query all elements: document.querySelectorAll('*')
 *       └─ For each: element.getBoundingClientRect()
 *       └─ Extract: x, y, width, height (all rounded)
 *       └─ Include only visible elements
 * 
 * 4. ELEMENT MATCHING
 *    └─ Strategy 1: ID Matching (HIGHEST PRIORITY)
 *       └─ If actualElement.id === expectedElement.id → MATCH
 *       └─ Prevents re-use (marks as consumed)
 *    
 *    └─ Strategy 2: Class + Tag Matching (SECOND PRIORITY)
 *       └─ If classList identical AND tagName identical → MATCH
 *       └─ Prevents re-use
 *    
 *    └─ Strategy 3: DOM Position Fallback (THIRD PRIORITY)
 *       └─ Match by same depth level
 *       └─ Only if not already matched by higher priority
 * 
 * 5. SIMILARITY CALCULATIONS
 *    
 *    A. Structure Similarity (0-100)
 *       └─ Formula: (matched_elements / total_expected_elements) × 100
 *       └─ Example: 45 matched / 50 expected = 90%
 *    
 *    B. CSS Similarity (0-100)
 *       └─ For each matched element pair:
 *          ├─ Compare fontSize (tolerance: ±2px)
 *          ├─ Compare fontWeight (exact match)
 *          ├─ Compare color (RGB threshold: ±30 per channel)
 *          ├─ Compare backgroundColor (RGB threshold: ±30 per channel)
 *          ├─ Compare display (exact match)
 *          ├─ Compare margin/padding (tolerance: ±5px)
 *          └─ Deductions: up to 100 points total per element
 *       └─ Average across all matched elements
 *    
 *    C. Layout Similarity (0-100)
 *       └─ For each matched element pair:
 *          ├─ Compare x position (tolerance: ±15px)
 *          ├─ Compare y position (tolerance: ±15px)
 *          ├─ Compare width (tolerance: ±15px)
 *          └─ Compare height (tolerance: ±15px)
 *       └─ Count mismatches (deviations beyond tolerance)
 *       └─ If mismatch% > 5%: apply additional penalty
 *       └─ Formula: base_similarity - (mismatch_percentage × 0.5)
 * 
 * 6. SCORING BREAKDOWN (0-20 EACH CATEGORY)
 *    
 *    A. Layout Score
 *       └─ Base: (layout_similarity / 100) × 20
 *       └─ Cap Rule: If layout_similarity < 95%, cap at 15
 *       └─ Rationale: Penalize > 5% mismatch
 *    
 *    B. Spacing Score
 *       └─ Average margin + padding accuracy
 *       └─ Tolerance: ±10px combined difference
 *          - 0-10px diff: +20 points
 *          - 10-30px diff: +10-20 points
 *          - >30px diff: progressively reduced
 *    
 *    C. Typography Score
 *       └─ Font size accuracy (±2px tolerance)
 *       └─ Font weight matching
 *       └─ Deduction: -10 for weight mismatch, -2 per px font diff
 *    
 *    D. Color Score
 *       └─ Text color matching (RGB ±30 tolerance)
 *       └─ Background color matching (RGB ±30 tolerance)
 *       └─ Deduction: -0.2 per RGB difference
 *    
 *    E. Component Score
 *       └─ 20 if all critical components present
 *       └─ 0 if any critical component missing
 *       └─ Critical: <button>, <a>, <input>, <textarea>, <select>, <form>
 *                    or elements with classes containing: btn, cta, submit, link
 *    
 *    F. Structure Score
 *       └─ Base: (structure_similarity / 100) × 20
 *       └─ Direct mapping: 90% similarity = 18/20
 * 
 * 7. HARD FAILURE CHECKS
 *    
 *    Failure 1: Core Components Missing
 *       └─ Condition: !allCriticalComponentsPresent()
 *       └─ Reason Code: 'MISSING_CORE_COMPONENTS'
 *       └─ Verdict: INSTANT FAIL
 *    
 *    Failure 2: Structure Similarity Below Threshold
 *       └─ Condition: structureSimilarity < 80%
 *       └─ Reason Code: 'STRUCTURE_SIMILARITY_BELOW_THRESHOLD'
 *       └─ Verdict: INSTANT FAIL
 *    
 *    Failure 3: Primary CTA Color Mismatch
 *       └─ Condition: Find button/CTA with background (a > 0)
 *       └─ Check if backgroundColor RGB difference > 60
 *       └─ Reason Code: 'PRIMARY_CTA_COLOR_MISMATCH'
 *       └─ Verdict: INSTANT FAIL
 * 
 * 8. FINAL VERDICT
 *    
 *    Rule 1: If hard_fail_reason exists
 *       └─ Verdict: FAIL (regardless of score)
 *    
 *    Rule 2: If total_score >= 85 AND no hard failures
 *       └─ Verdict: PASS
 *    
 *    Rule 3: Otherwise
 *       └─ Verdict: FAIL
 * 
 * 
 * ============================================================================
 * ELEMENT MATCHING DETAILED ALGORITHM
 * ============================================================================
 * 
 * Purpose: Identify which elements in the student submission correspond to
 * elements in the expected design, despite potential differences.
 * 
 * Pseudo-code:
 * 
 * function matchElements(expected, actual):
 *   matches = {}
 *   usedExpectedIndices = Set()
 *   
 *   // PASS 1: ID Matching
 *   expectedById = createIndex(expected, by: elementId)
 *   for actualIdx, actualEl in actual:
 *     if actualEl.elementId in expectedById:
 *       expectedIdx = expectedById[actualEl.elementId]
 *       matches[actualIdx] = expectedIdx
 *       usedExpectedIndices.add(expectedIdx)
 *   
 *   // PASS 2: Class + Tag Matching
 *   for actualIdx, actualEl in actual:
 *     if actualIdx already in matches:
 *       continue
 *     classKey = sort(actualEl.classList).join('|') + actualEl.tagName
 *     for expectedIdx, expectedEl in expected:
 *       if expectedIdx in usedExpectedIndices:
 *         continue
 *       expectedKey = sort(expectedEl.classList).join('|') + expectedEl.tagName
 *       if classKey == expectedKey:
 *         matches[actualIdx] = expectedIdx
 *         usedExpectedIndices.add(expectedIdx)
 *         break
 *   
 *   // PASS 3: DOM Position Fallback
 *   for actualIdx, actualEl in actual:
 *     if actualIdx already in matches:
 *       continue
 *     depthMatches = filter(expected, e => e.depth == actualEl.depth 
 *                                        && e not in usedExpectedIndices)
 *     if depthMatches.length > 0:
 *       expectedIdx = depthMatches[0]
 *       matches[actualIdx] = expectedIdx
 *       usedExpectedIndices.add(expectedIdx)
 *   
 *   return matches
 * 
 * 
 * ============================================================================
 * SIMILARITY CALCULATION FORMULAS
 * ============================================================================
 * 
 * 1. STRUCTURE SIMILARITY
 *    
 *    Base Formula:
 *    structure_sim = (matched_count / total_expected_count) × 100
 *    
 *    Example:
 *    - Expected: 50 elements
 *    - Matched: 45 elements
 *    - Result: 45/50 × 100 = 90%
 * 
 * 2. CSS SIMILARITY
 *    
 *    For each matched pair (expected_style, actual_style):
 *    
 *    score = 100
 *    
 *    // Font size: tolerance ±2px
 *    fontDiff = |expected.fontSize - actual.fontSize|
 *    if fontDiff > 2:
 *      score -= min(15, fontDiff × 2)
 *    
 *    // Font weight: must match
 *    if expected.fontWeight != actual.fontWeight:
 *      score -= 5
 *    
 *    // Color: tolerance ±30 per channel
 *    colorDiff = |exp.color.r - act.color.r| + 
 *                |exp.color.g - act.color.g| +
 *                |exp.color.b - act.color.b|
 *    if colorDiff > 30:
 *      score -= min(20, colorDiff / 5)
 *    
 *    // Similar for backgroundColor
 *    
 *    // Margin & Padding: tolerance ±5px per side
 *    marginDiff = sum of |exp.margin[side] - act.margin[side]| × 4
 *    paddingDiff = sum of |exp.padding[side] - act.padding[side]| × 4
 *    if marginDiff > 5:
 *      score -= min(15, marginDiff / 2)
 *    if paddingDiff > 5:
 *      score -= min(15, paddingDiff / 2)
 *    
 *    // Display: must match
 *    if expected.display != actual.display:
 *      score -= 10
 *    
 *    element_score = max(0, score)
 *    
 *    css_similarity = average(element_score for all matched pairs)
 * 
 * 3. LAYOUT SIMILARITY
 *    
 *    For each matched pair (expected_rect, actual_rect):
 *    
 *    mismatch = false
 *    score = 100
 *    
 *    // Position: tolerance ±15px
 *    xDiff = |expected.x - actual.x|
 *    yDiff = |expected.y - actual.y|
 *    if xDiff > 15 or yDiff > 15:
 *      mismatch = true
 *      score -= min(30, max(xDiff, yDiff) / 2)
 *    
 *    // Dimensions: tolerance ±15px
 *    widthDiff = |expected.width - actual.width|
 *    heightDiff = |expected.height - actual.height|
 *    if widthDiff > 15 or heightDiff > 15:
 *      mismatch = true
 *      score -= min(30, (widthDiff + heightDiff) / 4)
 *    
 *    element_score = max(0, score)
 *    
 *    base_similarity = average(element_score for all matched pairs)
 *    
 *    // Apply mismatch penalty
 *    mismatch_percentage = (mismatch_count / total_matched) × 100
 *    if mismatch_percentage > 5:
 *      base_similarity -= mismatch_percentage × 0.5
 *    
 *    layout_similarity = max(0, min(100, base_similarity))
 * 
 * 
 * ============================================================================
 * TOLERANCE THRESHOLDS
 * ============================================================================
 * 
 * Property              Tolerance    Threshold  Penalty
 * ─────────────────────────────────────────────────────
 * Font Size            ±2px           2px        2× per px
 * Font Weight          Exact match    N/A        -5 points
 * Color (RGB/channel)  ±30            30         ÷5 difference
 * Position (x, y)      ±15px          15px       ÷2 difference
 * Dimension (w, h)     ±15px          15px       ÷4 combined diff
 * Margin/Padding       ±5px           5px        ÷2 combined diff
 * Display              Exact match    N/A        -10 points
 * Background Color     ±30 (CTA)      60 (CTA)   Hard fail if > 60
 * Layout Mismatch %    > 5%           5%         -0.5× percentage
 * 
 * 
 * ============================================================================
 * SCORE MAPPING TO PERCENTAGE
 * ============================================================================
 * 
 * Each score is out of 20:
 * 
 * Score  Percentage   Grade
 * ─────────────────────────
 * 20     100%         Perfect
 * 18     90%          Excellent
 * 16     80%          Good
 * 14     70%          Satisfactory
 * 12     60%          Marginal
 * 10     50%          Below Average
 * 0      0%           Critical
 * 
 * Total Score (0-120):
 * 120    Perfect match
 * 100    ~83% average across categories
 * 85     Passing threshold
 * 60     Failing
 * 
 * 
 * ============================================================================
 * RULES & CONSTRAINTS
 * ============================================================================
 * 
 * 1. Never output 100 (% similarity) unless pages are pixel-perfect identical
 * 2. Never output 20 (per category score) unless category is perfect
 * 3. Hard failures always result in FAIL verdict
 * 4. PASS requires: total_score >= 85 AND no hard failures
 * 5. Layout score capped at 15 if mismatch > 5%
 * 6. All calculations use deterministic math (no randomization)
 * 7. Element visibility = width > 0 AND height > 0 from getBoundingClientRect
 * 8. Color matching uses RGB, not hex (computed values)
 * 9. Animations/transitions are disabled via injected CSS
 * 10. Both pages use identical viewport size (1440x900)
 * 
 * 
 * ============================================================================
 * EXAMPLE SCENARIO
 * ============================================================================
 * 
 * Expected page:
 * - 50 visible elements
 * - button#primary-cta with blue background (#0066cc)
 * 
 * Student page:
 * - 48 visible elements (2 missing)
 * - button#primary-cta with blue background (#0066cc)
 * 
 * Results:
 * 
 * 1. Element Matching
 *    - Matched 48 of 48 actual elements
 *    - 2 expected elements unmatched
 *    - Match quality: 48/50 = 96%
 * 
 * 2. Similarities
 *    - Structure: (48/50) × 100 = 96% ✓ (>80%)
 *    - CSS: Average across 48 pairs = 94%
 *    - Layout: Average across 48 pairs = 92%
 * 
 * 3. Critical Components
 *    - button#primary-cta present: ✓
 *    - Colors match: ✓
 *    - All required: ✓
 * 
 * 4. Scores
 *    - Layout: 92/100 × 20 = 18.4 (< 5% mismatch, not capped)
 *    - Spacing: 17.2
 *    - Typography: 18.9
 *    - Color: 19.1
 *    - Component: 20
 *    - Structure: 19.2
 *    Total: 112.8/120
 * 
 * 5. Hard Failures
 *    - Missing components: ✗ (all present)
 *    - Structure < 80%: ✗ (96% > 80%)
 *    - CTA color mismatch: ✗ (0 RGB diff)
 *    → No hard failures
 * 
 * 6. Verdict
 *    - Total: 112.8 >= 85 ✓
 *    - No failures ✓
 *    → PASS
 * 
 */

export const ALGORITHM_DOCUMENTATION = true;
