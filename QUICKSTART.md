# 🚀 START HERE - Quick Start Guide

## ✨ 30 Seconds to Evaluation

### Step 1: Start Server (5 seconds)
```bash
npm start
```

**Expected Output:**
```
✅ Server running at http://localhost:3000
```

### Step 2: Open Browser (1 second)
Click here → http://localhost:3000

Or copy and paste:
```
http://localhost:3000
```

### Step 3: Paste Expected Design URL (10 seconds)
Example:
```
https://www.google.com
```

### Step 4: Paste Your Code (10 seconds)
Example React code:
```jsx
export default function Example() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Hello World</h1>
      <p>My design</p>
    </div>
  );
}
```

### Step 5: Click Evaluate (5 seconds)
Wait for results...

**Done!** 🎉 You'll see:
- ✅ Similarity metrics
- ✅ Detailed scores
- ✅ Pass/Fail verdict
- ✅ Recommendations

---

## 📊 What You'll See

```
═══════════════════════════════════
        ✅ PASS (or ❌ FAIL)
───────────────────────────────────

Structure:  92.5%  ████████████████░░
CSS:        89.3%  ███████████████░░░
Layout:     85.7%  █████████████░░░░░

Scores: Layout 17.5/20 | Spacing 18.2/20 | ...
Total:  110.6/120

═══════════════════════════════════
```

---

## 🎯 What Can I Test?

✅ **React Apps** - Full support
✅ **Vue Apps** - Full support
✅ **Angular Apps** - Full support
✅ **Plain HTML** - Full support
✅ **Any Framework** - Works!

---

## 🎓 Example Codes

### Simple Button
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Button</title>
  </head>
  <body>
    <button style="padding: 10px 20px; background: blue; color: white;">
      Click Me
    </button>
  </body>
</html>
```

### React Counter
```jsx
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}
```

### React Form
```jsx
import React, { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('');
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Contact</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        style={{ width: '100%', padding: '10px' }}
      />
      <button style={{ marginTop: '10px', width: '100%' }}>
        Submit
      </button>
    </div>
  );
}
```

---

## ❓ Common Questions

**Q: Do I need to install anything else?**
A: No! Everything is already installed. Just `npm start`

**Q: Can I test my own website?**
A: Yes! Paste your URL as "Expected Design URL"

**Q: Does it work offline?**
A: Yes! Works completely offline after server starts

**Q: How long does evaluation take?**
A: 3-10 seconds depending on complexity

**Q: Can I download the results?**
A: Yes! Click "Download JSON" button

**Q: What if I get an error?**
A: Read [FIXES_SUMMARY.md](FIXES_SUMMARY.md) for troubleshooting

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| [FRONTEND.md](FRONTEND.md) | Web UI guide |
| [REACT_SUPPORT.md](REACT_SUPPORT.md) | React guide |
| [ALGORITHM.md](ALGORITHM.md) | How it works |
| [API.md](API.md) | REST API docs |

---

## ⚡ Pro Tips

1. **Use Quick Examples**
   - Click "Quick Examples" buttons to auto-fill sample code

2. **Copy Results**
   - Click "Copy JSON" to share with team

3. **Test Multiple Times**
   - Reset form and try again to improve

4. **Check Feedback**
   - Read recommendations to fix issues

5. **Use Inspector**
   - Right-click → Inspect to debug styling

---

## 🎓 For Teachers

1. **Create assignment:** "Match this design" with a URL
2. **Students submit:** Paste their React/HTML code
3. **Instant feedback:** Scores and recommendations
4. **Share results:** Download and email JSON to students
5. **Track progress:** Compare scores over time

---

## 💡 Troubleshooting

**Can't access http://localhost:3000?**
```bash
# Stop old server
Stop-Process -Name "node" -Force

# Start new server
npm start
```

**Getting "timeout" error?**
```
- Check if website is loading properly
- Try a simpler example first
- Make sure URL is correct
```

**Getting low similarity?**
```
- Check layout first
- Make sure styles match exactly
- Review computed styles in DevTools
```

---

## 🚀 Next Steps

1. ✅ `npm start` - Start server
2. ✅ Open http://localhost:3000 - Open browser
3. ✅ Paste code - Enter your design
4. ✅ Click evaluate - Get results
5. ✅ Download results - Share with team

---

## 📞 Need Help?

**For React:**
→ See [REACT_SUPPORT.md](REACT_SUPPORT.md)

**For Web UI:**
→ See [FRONTEND.md](FRONTEND.md)

**For API:**
→ See [API.md](API.md)

**For Errors:**
→ See [FIXES_SUMMARY.md](FIXES_SUMMARY.md)

**For Everything:**
→ See [STATUS.md](STATUS.md)

---

## ✨ You're Ready!

```bash
npm start
```

Then open:
```
http://localhost:3000
```

Paste your code and start evaluating! 🎉

---

**Happy coding!** 🚀
