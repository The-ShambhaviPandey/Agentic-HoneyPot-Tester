# Agentic Honeypot Tester

CLI-based automated benchmarking tool for evaluating agentic honeypot APIs across scripted scam scenarios.

Designed for structured detection, intelligence extraction, and engagement scoring during the India AI Impact Hackathon 2026 (HCL / GUVI) — Grand Finale, India AI Impact Summit 2026.

**Built by The Defenders**

---

## Demo

![Watch the demo here](https://github.com/user-attachments/assets/cd9ac95d-0c5e-45f4-b0ba-c9f686f64d96)


---

## Overview

This repository provides a CLI tester (`tester.js`) and a set of scripted scam scenarios (`scenarios.js`) used to evaluate agentic honeypot APIs.

The tester simulates scammer messages, sends them to a honeypot endpoint, listens for a final intelligence payload via a local callback server, and generates a structured performance score.

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
- Local callback server for final payload capture
- Automated scoring breakdown and summary
- Verbose debugging mode

---

## Tech Stack

- Node.js 18+ (recommended for native `fetch`)
- ECMAScript modules
- Built-in `http` module
- dotenv (environment configuration)

---

## Project Structure

```
honeypot-tester.html   (optional UI / notes)
package.json           (project metadata & scripts)
scenarios.js           (scripted scam scenarios & mappings)
tester.js              (CLI tester + callback server)
```

---

## Installation

### 1. Clone

```
git clone <repo-url>
cd <repo-folder>
```

### 2. Install Dependencies

```
npm install
```

---

## Environment Variables

If your honeypot requires an API key, create a `.env` file:

```
HONEYPOT_API_KEY=your_api_key_here
```

Alternatively, pass it via CLI flag.

---

## Usage

Run the tester against your honeypot endpoint:

```
node tester.js --url https://your-honeypot.example.com/endpoint
```

### Optional Flags

- `--key <apiKey>` — Provide API key
- `--scenario <scenarioId>` — Run a single scenario
- `--port <n>` — Callback server port (default: 3333)
- `--timeout <ms>` — Per-request timeout (default: 30000)
- `--wait <s>` — Wait time for final callback (default: 60)
- `--verbose` — Print full request/response JSON

### Example

```
node tester.js --url https://honeypot.example.com/turn --scenario bank_kyc_freeze
```

When started, the tester prints a callback URL such as:

```
http://<your-machine-ip>:3333/callback
```

Configure this value in your honeypot as:

```
FINAL_CALLBACK_URL
```

---

## Execution Flow

1. Tester sends scam message → honeypot endpoint
2. Honeypot responds per-turn
3. Conversation completes
4. Honeypot POSTs final intelligence payload → tester callback server
5. Tester evaluates and scores performance

---

## Integration Contract

### Per-turn Request (Sent by Tester)

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

---

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

If `status` is omitted, structure points are deducted.

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

Defined in `scenarios.js`:

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

- Honeypot must be reachable from tester machine
- Callback port must be available
- Node.js 18+ recommended
- Scoring rules are strict for benchmarking consistency

---

## Post-Hackathon Disclaimer

This repository has been updated after the conclusion of the India AI Impact Hackathon 2026.

The current version reflects architectural and structural changes made based on independent design decisions and optimization goals. As a result, this implementation may no longer strictly adhere to original hackathon submission constraints, evaluation rubrics, or capped competition conditions.

The system has been refined beyond hackathon limitations to better represent long-term design, maintainability, and benchmarking standards.

---

BUILT WITH ❤️ BY THE DEFENDERS
