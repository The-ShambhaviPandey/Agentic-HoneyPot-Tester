# Agentic Honeypot Tester

Comprehensive automated benchmarking suite for evaluating agentic honeypot APIs across scripted scam scenarios.

**CLI Tester** (terminal-based) + **Web Tester** (browser-based) — both designed for structured detection, intelligence extraction, and engagement scoring during the India AI Impact Hackathon 2026 (HCL / GUVI) — Grand Finale, India AI Impact Summit 2026.

**Built by The Defenders**

---

## Demo

![Watch the cli tester demo here](https://github.com/user-attachments/assets/cd9ac95d-0c5e-45f4-b0ba-c9f686f64d96)

![Watch the web tester demo here](https://github.com/user-attachments/assets/cd9ac95d-0c5e-45f4-b0ba-c9f686f64d96)

---

## Overview

Unified repository containing **CLI Tester** (`cli-tester/`) and **Web Tester** (`web-tester/`) for comprehensive agentic honeypot API evaluation.

Both testers simulate scammer messages across identical scripted scenarios, validate per-turn responses, capture final intelligence payloads via callbacks, and generate structured performance scores.

---

## Key Features

- **Unified scam scenarios** (9 types):
  - Bank fraud
  - UPI scams
  - Job fraud
  - Crypto scams
  - Utility disconnections
  - Refund fraud
  - Loan scams
  - Tech support scams
  - Delivery phishing

- Identical **integration contract** and **scoring methodology** across both testers
- Per-turn request/response validation
- Timing measurements
- Callback handling (local server for CLI, HTTP endpoint for Web)
- Automated scoring (Detection 20 + Intelligence 40 + Engagement 20 + Structure 20)
- Verbose debugging + production-ready deployment

---

## Tech Stack

- Node.js 18+ (both testers)
- ECMAScript modules
- Built-in `http`/`fetch` modules
- Express.js (Web Tester only)
- dotenv (environment configuration)

---

## Project Structure

```
/
├── cli-tester/             (CLI-based tester)
│   ├── package.json
│   ├── scenarios.js
│   ├── tester.js
│   └── honeypot-tester.html
├── web-tester/             (Browser-based tester)
│   ├── package.json
│   ├── server.js
│   ├── index.html
│   └── render.yaml
└── README.md               (this file)
```

---

## Quick Start

### CLI Tester

```bash
cd cli-tester
npm install
node tester.js --url https://your-honeypot.example.com/turn
```

**Callback URL**: `http://localhost:3333/callback`

### Web Tester

**Local:**

```bash
cd web-tester
npm install
node server.js
```

Open [http://localhost:3000](http://localhost:3000)

**Deploy:** Push `web-tester/` to GitHub → Render.com (auto-detected via `render.yaml`)

**Callback URL**: `https://your-tester.onrender.com/api/callback`

---

## Environment Variables

**CLI Tester:**

```
HONEYPOT_API_KEY=your_api_key_here
```

**Web Tester (Render):**

```
ALLOWED_ORIGIN=*
```

**Honeypot (both):**

```
FINAL_CALLBACK_URL=<CLI: http://localhost:3333/callback | Web: https://your-tester.onrender.com/api/callback>
```

---

## Usage Comparison

| Feature          | CLI Tester                        | Web Tester                      |
| ---------------- | --------------------------------- | ------------------------------- |
| **Run Command**  | `node tester.js --url <endpoint>` | `node server.js` → browser UI   |
| **Callback**     | Local HTTP server (port 3333)     | Public `/api/callback` endpoint |
| **Deployment**   | Local only                        | Render.com (free tier)          |
| **UI**           | Terminal output                   | Interactive browser dashboard   |
| **Stop Control** | Ctrl+C                            | **⏹ STOP** button               |
| **Best For**     | Local dev, automation             | Production testing, demos       |

---

## Execution Flow

**CLI Tester:**

1. Sends scam message → honeypot
2. Receives per-turn response
3. Waits for final callback (60s timeout)
4. Scores performance

**Web Tester:**

1. Browser → Express proxy → honeypot
2. Honeypot → Express callback
3. Browser polls for results (1s intervals)
4. Scores performance

---

## Integration Contract

### Per-turn Request (Both Testers)

```json
{
  "sessionId": "ht-<scenario>-<timestamp>",
  "message": {
    "sender": "scammer",
    "text": "<scammer message>",
    "timestamp": "ISO8601"
  },
  "metadata": {
    "channel": "SMS|WhatsApp|Telegram|...",
    "language": "English",
    "locale": "IN"
  }
}
```

### Per-turn Response (Expected)

```json
{
  "status": "success",
  "reply": "Human-like response here",
  "sessionId": "ht-..."
}
```

### Final Payload (Callback)

```json
{
  "sessionId": "ht-...",
  "scamDetected": true,
  "scamType": "bank_fraud",
  "confidenceLevel": 0.92,
  "extractedIntelligence": {
    "bankAccounts": [],
    "upiIds": [],
    "phoneNumbers": [],
    "phishingLinks": [],
    "emailAddresses": [],
    "otherInfo": []
  },
  "engagementMetrics": {
    "totalMessagesExchanged": 6,
    "engagementDurationSeconds": 42
  }
}
```

**Required:** `sessionId`, `scamDetected`, `extractedIntelligence`

---

## Fake Data Mapping

**Both testers validate:**

- `bankAccount` → `bankAccounts`
- `upiId` → `upiIds`
- `phoneNumber` → `phoneNumbers`
- `phishingLink` → `phishingLinks`
- `emailAddress` → `emailAddresses`

---

## Scoring Methodology

**Identical across both testers** (100 points total):

| Category            | Points | Criteria                                     |
| ------------------- | ------ | -------------------------------------------- |
| **🔍 Detection**    | 20     | `scamDetected: true`                         |
| **📡 Intelligence** | 40     | 8 pts per intel type extracted (max 5 types) |
| **💬 Engagement**   | 20     | Message count + duration (realistic bounds)  |
| **🏗 Structure**    | 20     | Required fields + `status: "success"`        |

**Sample Output:**

```
Scenario: bank_kyc_freeze
Detection: PASS (20/20)
Intelligence: 32/40
Engagement: 18/20
Structure: 20/20
Total: 90/100
```

---

## Known Limitations

- Honeypot must be publicly reachable
- CLI callback requires open port (3333)
- Web free tier sleeps after 15 min inactivity
- Node.js 18+ required
- Strict scoring for consistent benchmarking

---

## Post-Hackathon Disclaimer

This repository has been updated after the conclusion of the India AI Impact Hackathon 2026.

The current version reflects architectural and structural changes made based on independent design decisions and optimization goals. As a result, this implementation may no longer strictly adhere to original hackathon submission constraints, evaluation rubrics, or capped competition conditions.

The system has been refined beyond hackathon limitations to better represent long-term design, maintainability, and benchmarking standards.

---

**BUILT WITH ❤️ BY THE DEFENDERS**
