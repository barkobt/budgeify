# Budgeify — Oracle AI Advisor Architecture

## Current State
The AI assistant is a static chatbot with hardcoded responses. No real data analysis.

## Target Architecture (Sprint 3)

### Layer 1: Data Access
- Read user's expenses, incomes, goals from Zustand/DB
- Aggregate by category, time period, trends

### Layer 2: Heuristics Engine (Deterministic)
- Spending trend analysis (MoM comparison)
- Savings rate calculation
- Category dominance detection
- Anomaly detection (unusual spending spikes)
- Budget health score (0-100)
- Weekly/monthly summary generation

### Layer 3: Insight Generation
- Proactive insights (not just reactive)
- Confidence estimation per insight
- "Explain like I'm 5" mode
- Turkish language output

### Layer 4: Optional LLM (Enhancement Only)
- Only for natural language explanation
- Heuristics provide all numbers
- Falls back to template-based text if no API key
- Never hallucinates financial data

## Key Principle
All calculations are deterministic. The LLM layer only provides wording.
