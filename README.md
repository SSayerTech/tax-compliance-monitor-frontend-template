# Tax Compliance Monitor — Frontend Exercise

**Estimated time:** ~3h core · ~4h with bonus tasks

---

## About this exercise

You are extending an existing Nuxt 3 dashboard for a tax compliance system used by tax analysts
to review the risk profile of Chilean businesses. The risk visualization module is already live.
Your job is to restructure the detail view into a tabbed layout, complete a stubbed section in an
existing component, and add three new data sections.

The backend is fully live and returning real data. **Run the app and explore it before writing
anything.** Understanding what exists and how it's built is part of the exercise.

You are free to modify any file in this repository. Restructure, rename, or improve anything you
feel should be better — the existing code is a starting point, not a constraint.

---

## Setup

```bash
npm install
cp .env.example .env   # set API_BASE to the backend URL
npm run dev
```

### Environment variables

| Variable | Description |
| -------- | ----------- |
| `API_BASE` | Backend URL (e.g. `http://localhost:3001`) |

The backend must be running before starting the frontend.

---

## Types alignment

The `src/types/` directory holds the frontend counterparts of the backend data shapes. Before
implementing, inspect the backend type definitions and replicate the relevant shapes in
`src/types/` so that field names and formats match exactly what the API returns.

---

## What's already built

### What you'll see when you run the app

The landing page is a taxpayer selector. Picking a taxpayer navigates to a detail view that shows
three risk score cards — an overall score (large), a VAT score, and an income tax score (compact)
— followed by two historical trend charts (risk scores over time and exposure over time). Below the
charts there is a **Risk Factors** section that is currently empty: the component has a stub in
place of a real implementation.

There is no navigation, no invoices, and no monitoring data yet.

### Reference files

Study these before writing anything:

| File | What it shows |
| ---- | ------------- |
| `composables/useRiskApi.ts` | API call pattern: `useRuntimeConfig`, `handleApiError`, `ApiResponse<T>` |
| `composables/useRiskData.ts` | State management: `loading`, `error`, and data refs around async fetches |
| `types/risk.ts` | How API response shapes are typed |
| `utils/format.ts` | `formatCurrency()` and `formatDate()` — use these for all amounts and dates |
| `pages/taxpayer/[id].vue` | The detail view you will extend |
| `components/risk/` | Reference for component design and composition patterns |
| `components/__tests__/` | Existing tests — follow this pattern for Bonus A |
| `composables/__tests__/` | Existing composable tests |

---

## What to implement

Story 1 defines the layout shell. Story 2 completes the existing stub. Stories 3–5 add new
data sections — do them in any order once the layout is in place.

---

### Story 1: Dashboard layout `~30 min`

The detail page currently renders the risk profile as a single scrollable view. You are about to
add three more sections of data. Before building them, define the structure that will hold
everything: a tabbed or clearly sectioned layout organizing the risk profile, risk exposure,
invoices, and monitoring config into distinct, navigable areas.

Getting this right first means each subsequent story drops naturally into its own slot.

**Acceptance criteria:**

- The detail view has a clear top-level navigation structure — tabs or equivalent — covering all four sections: risk profile, risk exposure, invoices, monitoring
- The existing risk components (score cards, trend charts) are intact and rendered under the risk profile section
- Switching between sections does not trigger additional network requests if the data was already fetched
- A new user landing on the page can orient themselves without instructions

---

### Story 2: Risk factors `~30 min`

The risk profile already shows score cards and trend charts. The historical data also contains risk
events — specific incidents that drove score changes, such as late filings or missing declarations.
`components/risk/DataTrends.vue` has a stub where this section should render. The analyst needs to
see which events occurred, when, and why they matter.

Risk events come from `HistoricalRiskData.events` (see `types/risk.ts`). Each `RiskEvent` has:
`type` (`LATE_FILING` | `MISSING_DECLARATION` | `RISK_INCREASE`), `description: string`, and
`exposure: number`. Events in the history are grouped by period.

**Acceptance criteria:**

- Risk events are displayed, grouped by period
- Event types are visually distinct — `LATE_FILING`, `MISSING_DECLARATION`, and `RISK_INCREASE` are immediately distinguishable at a glance
- Each event shows its description and exposure amount
- Periods with no events are not shown; if the entire history has no events, an appropriate empty state is displayed

---

### Story 3: Invoice section `~45 min`

An analyst reviewing a taxpayer needs to know which invoices involve counterparts currently on the
SII blocked list. This is the most operationally sensitive data on the page: a single flagged
invoice can affect the taxpayer's standing. The `siiRisk` flag is computed live at query time — it
is never stored on the invoice itself, so it always reflects the current blocked list.

**`GET /api/invoices/:taxpayerId`**

Query params (both optional): `type` (`EMITIDA` | `RECIBIDA`), `status` (`VIGENTE` | `ANULADA` | `PENDIENTE`)

```json
{
  "data": [
    {
      "taxpayerId": "TP001",
      "folio": "F-TP001-00002",
      "type": "EMITIDA",
      "rutCounterpart": "80567890-1",
      "counterpartName": "Empresa con observaciones SII",
      "amount": 4017495,
      "date": "2026-05-21T00:00:00.000Z",
      "status": "VIGENTE",
      "siiRisk": true,
      "firstSeenAt": "2026-05-21T00:00:00.000Z",
      "lastUpdatedAt": "2026-05-21T00:00:00.000Z"
    }
  ],
  "totals": {
    "emitidas": { "count": 3, "amount": 20614029 },
    "recibidas": { "count": 3, "amount": 18913233 },
    "atRisk": 3
  }
}
```

**Acceptance criteria:**

- Invoices are listed with at minimum: folio, type, counterpart name and RUT, amount, date, status
- `siiRisk: true` invoices are visually distinct and immediately identifiable — a user scanning the list should notice them without reading every row
- The `totals` summary (emitidas, recibidas, at-risk count) is visible without scrolling through the full list
- Filtering by `type` and/or `status` works and updates the list
- Loading and error states are handled

---

### Story 4: Monitoring section `~30 min`

Each taxpayer has a monitoring schedule that controls when the system queries the SII for new
invoice data. An analyst needs to see at a glance whether monitoring is active, how often it runs,
and when it last executed. This is a read-only view.

**`GET /api/monitoring/:taxpayerId`**

```json
{
  "taxpayerId": "TP001",
  "active": false,
  "frequency": "DAILY",
  "startHour": 8,
  "endHour": 9,
  "dayOfWeek": null,
  "dayOfMonth": null,
  "queryCount": 0,
  "lastExecutedAt": null,
  "nextScheduledAt": null
}
```

**Acceptance criteria:**

- All config fields are displayed: active status, frequency, schedule window (`startHour`–`endHour`), query count, last executed, next scheduled
- Fields that are `null` show a meaningful empty state rather than the word "null"
- `dayOfWeek` and `dayOfMonth` are shown only when relevant (WEEKLY and MONTHLY respectively)
- Loading and error states are handled

---

### Story 5: Risk exposure `~30 min`

The risk profile tab shows pre-computed scores stored in the database. This endpoint provides a
complementary live view: how many invoices currently involve blocked counterparts, the total amount
at stake, and the resulting risk tier. Because it is computed at query time from live data, it can
diverge from the stored score — and that divergence is itself informative to the analyst.

**`GET /api/risk/:taxpayerId/exposure`**

```json
{
  "taxpayerId": "TP001",
  "totalInvoices": 6,
  "atRiskCount": 3,
  "atRiskAmount": 12500000,
  "atRiskRate": 0.5,
  "riskLevel": "HIGH"
}
```

**Acceptance criteria:**

- All exposure fields are displayed: total invoices, at-risk count, at-risk amount, at-risk rate, risk level
- `riskLevel` uses the same color system as the existing risk score components
- Loading and error states are handled

---

## Bonus tasks

### Bonus A — Tests `~40 min`

Add tests following the existing pattern in `components/__tests__/` and
`composables/__tests__/`.

Suggested coverage:

- Invoice composable: correct URL construction with filters, response mapping, error handling
- Monitoring composable: null field handling, correct state after a successful fetch
- Risk exposure composable: correct metrics mapping, error handling
- A component with meaningful visual behavior (e.g. the `siiRisk` indicator renders correctly)

### Bonus B — Code quality `~45 min`

Improve the engineering quality of the codebase beyond what the core stories require. Some
directions worth considering: eliminating duplication across the new composables, shared error
handling, stronger TypeScript patterns, state management with Pinia.

This is intentionally open-ended. Document what you changed and why in your PR description —
the reasoning matters as much as the diff.

---

## Evaluation criteria

Working implementations are the baseline. Beyond that:

| Area | What we look for |
| ---- | ---------------- |
| **Integration** | New code fits naturally into the existing codebase — same patterns, same conventions |
| **UX clarity** | Information is easy to scan; `siiRisk` invoices stand out; null/empty states are meaningful |
| **Component design** | Reasonable separation, reuse where it makes sense, not over-engineered |
| **Type safety** | API responses typed; no `any`; types defined before or alongside components |
| **Git usage** | Frequent commits with clear messages; one logical unit of work per commit |

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run test` | Unit tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

---

## Project structure

```text
components/
├── risk/              # Existing components — reference and extend as needed
│   └── DataTrends.vue # Risk factors section is stubbed — implement in Story 2
└── __tests__/         # Existing tests — follow this pattern for Bonus A
composables/           # Follow useRiskApi / useRiskData patterns
└── __tests__/
pages/
├── index.vue                  # Taxpayer selector
└── taxpayer/[id].vue          # Detail view — restructure and extend this
types/                 # Define new type shapes here
utils/                 # formatCurrency, formatDate
```

---

## License & Contributing

This repository is provided for assessment purposes only.

To submit your solution:

1. Clone this repository to your own GitHub account
2. Implement the tasks on a dedicated branch
3. Share repository access with [@ofvera](https://github.com/ofvera) when ready for review
