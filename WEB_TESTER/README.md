# HoneyTrap Web Tester

Browser-based automated benchmarking tool for evaluating agentic honeypot APIs across scripted scam scenarios.

Designed for structured detection, intelligence extraction, and engagement scoring during the India AI Impact Hackathon 2026 (HCL / GUVI) — Grand Finale, India AI Impact Summit 2026.

**Built by The Defenders**

---

## Demo

![Watch the demo here](https://github.com/user-attachments/assets/cd9ac95d-0c5e-45f4-b0ba-c9f686f64d96)

---

## Overview

This repository provides a web-based tester (`server.js` + `index.html`) and a set of scripted scam scenarios for evaluating agentic honeypot APIs.

The tester simulates scammer messages via a browser UI, proxies them through an Express server to a honeypot endpoint, receives final intelligence payload via HTTP callback, and generates a structured performance score.

---

## Key Features

- Scripted scam scenarios:
  - Bank fraud
  - UPI scams
  - Job fraud
  - Crypto scams
  - Utility disconnections
  - Refund fraud
  - Loan scams
  - Tech support scams
  - Delivery phishing

- Per-turn request/response validation
- Timing measurements
- HTTP callback receiver for final payload capture
- Automated scoring breakdown and summary
- Browser-based UI with stop button
- One-click Render deployment

---

## Tech Stack

- Node.js 18+ (Express server)
- ECMAScript modules
- Vanilla JavaScript (no frameworks)
- dotenv (environment configuration)

---

## Project Structure

```
honeytrap-web/
├── server.js       (Express server + callback receiver)
├── index.html      (browser UI)
├── package.json    (project metadata & scripts)
└── render.yaml     (deployment config)
```

---

## Installation

### 1. Clone

```
git clone <repo-url>
cd honeytrap-web
```

### 2. Install Dependencies

```
npm install
```

---

## Environment Variables

Set `ALLOWED_ORIGIN=*` for production (Render deployment).

---

## Usage

### Local Development

```
node server.js
```

Open [http://localhost:3000](http://localhost:3000)

1. Paste honeypot endpoint URL
2. Select scenario
3. Click **▶ RUN SELECTED**

### Production Deployment

1. Push to GitHub
2. Deploy via [render.com](https://render.com) using `render.yaml`
3. Copy public callback URL from **📬 Callback** tab

Configure honeypot:

```
FINAL_CALLBACK_URL=https://your-tester.onrender.com/api/callback
```

---

## Execution Flow

1. Browser sends scam message → Express proxy → honeypot endpoint
2. Honeypot responds per-turn (proxied back to browser)
3. Conversation completes
4. Honeypot POSTs final intelligence payload → Express `/api/callback`
5. Browser polls `/api/poll/:sessionId` for results
6. Tester evaluates and scores performance

---

## Integration Contract

### Per-turn Request (Proxied by Tester)

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

### Per-turn Response (Expected from Honeypot)

Minimum requirement: human-readable reply in `reply` (or `message` / `text`).

Continue session:

```json
{
  "status": "success",
  "reply": "No, this wasn't me. Please tell me more.",
  "sessionId": "ht-..."
}
```

Close session:

```json
{
  "status": "success",
  "reply": null
}
```

---

### Final Payload (Callback to Tester)

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
  },
  "agentNotes": "Detected phishing attempt."
}
```

### Required Fields

- `sessionId` (must match tester session)
- `scamDetected`
- `extractedIntelligence` (arrays may be empty but must exist)

---

## Fake Data Mapping

Defined in frontend scenarios:

- `bankAccount` → `bankAccounts`
- `upiId` → `upiIds`
- `phoneNumber` → `phoneNumbers`
- `phishingLink` → `phishingLinks`
- `emailAddress` → `emailAddresses`

---

## Scoring Methodology

Each scenario is scored out of 100:

- Detection — 20 pts
- Intelligence Extraction — 40 pts
- Engagement — 20 pts
- Structure & Schema Compliance — 20 pts

### Sample Output

```
Scenario: bank_kyc_freeze
Detection: PASS (20/20)
Intelligence: 30/40
Engagement: 18/20
Structure: 20/20
Total Score: 88/100
```

---

## Known Limitations

- Honeypot must be reachable from tester server
- Render free tier sleeps after 15 min inactivity
- Browser polling (1s intervals) for callback results
- Node.js 18+ required
- Scoring rules are strict for benchmarking consistency

---

## Post-Hackathon Disclaimer

This repository has been updated after the conclusion of the India AI Impact Hackathon 2026.

The current version reflects architectural and structural changes made based on independent design decisions and optimization goals. As a result, this implementation may no longer strictly adhere to original hackathon submission constraints, evaluation rubrics, or capped competition conditions.

The system has been refined beyond hackathon limitations to better represent long-term design, maintainability, and benchmarking standards.

---

**BUILT WITH ❤️ BY THE DEFENDERS**
