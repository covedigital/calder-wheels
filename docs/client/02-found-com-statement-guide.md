# Found.com — Payment Schedule Statement Setup Guide

**Purpose**: How to issue a statement in Found.com that reflects the Calder Wheels payment schedule.

---

## Background

Found.com is a business banking + invoicing platform. You've already used it to send an invoice and receive the $4,350 wire. To reflect the full payment schedule as a formal statement, use Found's **Invoice + Milestone** workflow.

---

## Method 1: Create Individual Milestone Invoices (Recommended)

Create four separate invoices in Found, each representing a milestone. This is the cleanest approach — the client sees each milestone as a separate invoice, payment is tracked per milestone, and Found's "Invoices" tab serves as your statement.

### Steps:

1. **Log into Found.com** → navigate to **Invoices**

2. **Create Invoice #1 — Kickoff** (already sent & paid)
   - Line item: `Calder Wheels — Commerce & Integration Platform — Kickoff Milestone`
   - Amount: $4,350.00
   - Mark as **Paid** (since you received the wire)

3. **Create Invoice #2 — Design & System Approval**
   - Line item: `Calder Wheels — Design & System Approval Milestone`
   - Amount: $4,350.00
   - Status: **Draft** (send when milestone is reached)
   - Set due date ~15 days from issuance

4. **Create Invoice #3 — Functional Beta**
   - Line item: `Calder Wheels — Functional Beta Milestone`
   - Amount: $3,625.00
   - Status: **Draft**

5. **Create Invoice #4 — Production Launch**
   - Line item: `Calder Wheels — Production Launch Milestone`
   - Amount: $2,175.00
   - Status: **Draft**

### Found's Statement/Report View

Found generates a **transaction history / invoice report** automatically. To share a formal statement with the client:
- Go to **Invoices** → select all four invoices → **Export** as PDF
- Or go to **Reports** → generate an invoice activity report for the date range

Found also lets you add a **note** to each invoice. Add a consistent note like:
> *"Calder Wheels — Commerce & Integration Platform. Milestone [N] of 4 per signed agreement."*

---

## Method 2: Single "Payment Schedule" Statement (Non-Invoice)

If you prefer a single document rather than individual invoices:

1. Go to Found **Documents** or **Notes** section
2. Create a new document titled: "Calder Wheels — Payment Schedule"
3. Copy the payment schedule table from `01-payment-receipt-statement.md`
4. Export/Save as PDF
5. Send to client as a reference document alongside the invoices

---

## Method 3: Found + Spreadsheet Hybrid

Export Found's invoice log to CSV and combine with a manual schedule:

1. In Found, go to **Invoices** → **Export** → CSV
2. Open in Google Sheets / Excel
3. Add a "Payment Schedule" tab with the full milestone table
4. Share as a Google Sheet or export as PDF

---

## Recommendations

| Approach | Best For |
|---|---|
| Individual milestone invoices | Cleanest — each milestone is a separate transaction |
| Single statement PDF | Simple overview alongside invoices |
| Spreadsheet hybrid | Client wants to see payments vs. schedule in one view |

**I recommend Method 1** — individual invoices per milestone. This makes Found your complete invoicing record, and the client always knows exactly which milestone they're paying for.