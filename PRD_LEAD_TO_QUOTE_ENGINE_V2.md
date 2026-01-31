# Product Requirements Document: AI-Native Renovation Lead-to-Quote Engine

**Version:** 2.0 Enhanced
**Date:** January 31, 2026
**Author:** Claude (Cowork Mode) + Existing PRD Synthesis
**Primary Builder:** Claude Code (Opus 4.5)
**Target Client:** Red White Reno (Initial) → Productized SaaS (Scale)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [User Personas & Journeys](#2-user-personas--journeys)
3. [Feature 1: AI Quote Assistant](#3-feature-1-ai-quote-assistant)
4. [Feature 2: AI Design Visualizer](#4-feature-2-ai-design-visualizer)
5. [Feature 3: Marketing Website](#5-feature-3-marketing-website)
6. [Feature 4: Admin Dashboard](#6-feature-4-admin-dashboard)
7. [Technical Architecture](#7-technical-architecture)
8. [AI Behavior Specification](#8-ai-behavior-specification)
9. [User Experience Specification](#9-user-experience-specification)
10. [Design System](#10-design-system)
11. [Development Phases](#11-development-phases)
12. [Security & Compliance](#12-security--compliance)
13. [Testing Strategy](#13-testing-strategy)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

### 1.1 Problem Statement (Why)

Homeowners seeking renovation quotes face three critical friction points:

1. **Waiting Time:** Traditional quote requests take 2-7 days for initial response
2. **Visualization Gap:** Homeowners struggle to imagine the finished result, creating decision paralysis
3. **Information Asymmetry:** Without ballpark pricing, homeowners cannot assess project feasibility before committing time to consultations

For contractors like Red White Reno:
- Manual quote generation consumes 2-3 hours per lead
- High abandonment on basic contact forms (only 2-3% conversion)
- Difficulty differentiating from competitors with identical websites

### 1.2 Solution Overview (What)

An AI-native web platform featuring:

| Feature | Description | Competitive Edge |
|---------|-------------|------------------|
| **AI Quote Assistant** | Conversational intake → instant ballpark estimate | 5 minutes vs 5 days |
| **AI Design Visualizer** | Photo upload → photorealistic "after" renders | Block Renovation-quality for SMB contractors |
| **Instant Feedback Loop** | Visualizer affects estimate in real-time | Unique in market |
| **Owner Dashboard** | Human-in-the-loop quote refinement | Maintains quality control |

### 1.3 Success Metrics

| Metric | Current Baseline | Target | Measurement |
|--------|------------------|--------|-------------|
| Visitor-to-Lead Conversion | 2-3% | 8%+ | Analytics: visitors vs completed intakes |
| Intake Completion Rate | N/A | ≥70% | intake_started vs lead_submitted events |
| Time-to-Initial Response | 24-48 hours | <2 hours | Lead submission → quote sent timestamps |
| Quote Preparation Time (Owner) | 2-3 hours | <10 minutes | Draft creation → quote sent timestamps |
| Monthly Lead Volume | 5-8 | 25-40 | Database count |
| Quote Accuracy | N/A | ±15% of final | Post-project comparison |

### 1.4 Non-Goals (What We're NOT Building)

- Full project management system (use existing tools)
- CRM with email sequences (integrate with Mailchimp/HubSpot later)
- Payment processing/invoicing (out of scope for v1)
- 3D walkthrough or AR visualization (photo-to-photo only)
- Contractor marketplace (single contractor per deployment)
- Real-time collaboration/chat with contractor

---

## 2. User Personas & Journeys

### 2.1 Primary Persona: The Homeowner (Sarah)

**Demographics:**
- Age: 38-55
- Homeowner in suburban Ontario
- Household income: $100K-$200K
- Decision-maker (or co-decision-maker with spouse)
- Comfortable with technology but not an early adopter

**Goals:**
- Get a realistic idea of renovation costs before committing time
- Visualize what the finished space could look like
- Find a trustworthy, professional contractor
- Make an informed decision without pressure

**Frustrations:**
- "I filled out 5 contact forms and heard back from 2"
- "Every contractor gives wildly different prices"
- "I can't picture what 'modern farmhouse' actually looks like in MY kitchen"
- "I wasted a whole Saturday with a contractor who quoted double my budget"

**Tech Behavior:**
- Uses smartphone for initial research (60% of sessions)
- Switches to desktop for detailed planning
- Takes photos with phone and expects to upload directly
- Expects responses within hours, not days

### 2.2 Secondary Persona: The Contractor/Owner (Michel)

**Demographics:**
- Age: 45-60
- Owner/operator of small renovation company
- 15+ years experience
- Manages 2-4 active projects simultaneously
- Has basic computer skills but limited time

**Goals:**
- Spend less time on unqualified leads
- Provide accurate quotes faster
- Focus on actual renovation work, not paperwork
- Win jobs against larger competitors

**Frustrations:**
- "I spend 3 hours on a quote and never hear back"
- "Customers have unrealistic expectations for their budget"
- "I get calls at dinner asking for ballpark numbers"
- "Young customers expect instant everything"

**Tech Behavior:**
- Checks email on phone throughout day
- Prefers simple interfaces with minimal clicks
- Wants to review AI work, not create from scratch
- Uses QuickBooks for invoicing (integration potential)

### 2.3 User Journey Map: Homeowner Quote Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HOMEOWNER QUOTE JOURNEY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AWARENESS         CONSIDERATION           DECISION           ACTION        │
│      │                   │                    │                  │          │
│      ▼                   ▼                    ▼                  ▼          │
│  ┌───────┐          ┌───────┐           ┌───────┐          ┌───────┐       │
│  │Google │          │Browse │           │ Get   │          │Contact│       │
│  │Search │─────────▶│Website│──────────▶│Quote  │─────────▶│ for   │       │
│  │"kitchen│          │Gallery│           │ & See │          │Consult│       │
│  │ reno" │          │       │           │Visual │          │       │       │
│  └───────┘          └───────┘           └───────┘          └───────┘       │
│      │                   │                    │                  │          │
│      ▼                   ▼                    ▼                  ▼          │
│  TOUCHPOINT:        TOUCHPOINT:          TOUCHPOINT:        TOUCHPOINT:    │
│  - SEO              - Hero section       - AI Quote         - Email with   │
│  - Google Ads       - Services           - AI Visualizer    - formal quote │
│  - Referral         - Portfolio          - Instant estimate - Phone call   │
│                     - Reviews                               - Site visit   │
│                                                                              │
│  EMOTION:           EMOTION:             EMOTION:           EMOTION:        │
│  Curious,           Evaluating,          Excited,           Committed,     │
│  Uncertain          Comparing            Informed           Confident      │
│                                                                              │
│  FRICTION:          FRICTION:            FRICTION:          FRICTION:       │
│  "Which             "Is this             "Is estimate       "Will they     │
│  contractor?"       trustworthy?"        realistic?"        show up?"      │
│                                                                              │
│  SOLUTION:          SOLUTION:            SOLUTION:          SOLUTION:       │
│  Strong SEO,        Social proof,        Clear disclaimers, Fast response, │
│  Clear CTA          Real photos          Range estimates    Professionalism│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 User Journey Map: Contractor Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTRACTOR DASHBOARD JOURNEY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  NOTIFICATION        REVIEW              REFINE             SEND            │
│      │                 │                   │                  │             │
│      ▼                 ▼                   ▼                  ▼             │
│  ┌───────┐         ┌───────┐          ┌───────┐         ┌───────┐          │
│  │ Email │         │ View  │          │ Edit  │         │ Send  │          │
│  │ Alert │────────▶│ Lead  │─────────▶│ Quote │────────▶│ to    │          │
│  │ "New  │         │Details│          │ Draft │         │Client │          │
│  │ Lead" │         │       │          │       │         │       │          │
│  └───────┘         └───────┘          └───────┘         └───────┘          │
│      │                 │                   │                  │             │
│      ▼                 ▼                   ▼                  ▼             │
│  • Lead name        • Contact info      • Adjust line     • Preview PDF   │
│  • Project type     • Photos            • Change prices   • Confirm send  │
│  • AI confidence    • Visualizations    • Add/remove      • Track status  │
│  • Link to dash     • Chat transcript   • Add notes       • Follow-up     │
│                     • AI scope          • Save draft      • Mark won/lost │
│                     • AI draft quote    •                 •               │
│                                                                              │
│  TIME: <1 min       TIME: 2-3 min       TIME: 3-5 min     TIME: 1 min     │
│                                                                              │
│  TOTAL FLOW: <10 MINUTES (vs 2-3 hours manual)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Feature 1: AI Quote Assistant

### 3.1 Overview

The AI Quote Assistant is a conversational interface that guides homeowners through a structured intake process, collecting project details and generating instant preliminary estimates. Unlike form-based competitors, this uses natural conversation with adaptive follow-up questions.

**Competitive Differentiation:**
- Handoff.ai requires photo/video upload → generates estimate (no conversation)
- Block Renovation uses form-based input → matches with contractors
- Our approach: Conversational AI that feels like talking to a helpful estimator

### 3.2 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| QA-US-001 | Homeowner | Upload a photo and describe my project in natural language | I don't have to fill out tedious forms |
| QA-US-002 | Homeowner | Get an instant ballpark estimate | I can assess feasibility before committing time |
| QA-US-003 | Homeowner | Save my progress and return later | I can gather more info without losing my work |
| QA-US-004 | Homeowner | See how different choices affect the estimate | I can make informed trade-off decisions |
| QA-US-005 | Contractor | Receive a structured summary of the lead's needs | I can prepare for conversations efficiently |
| QA-US-006 | Contractor | See the AI's reasoning for the estimate | I can adjust confidently |

### 3.3 Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| QA-001 | Display conversational chat interface with message bubbles | Must Have | Messages render with proper styling, timestamps |
| QA-002 | Support image upload with preview, compression, and validation | Must Have | Images compressed to <2MB, preview shown, invalid files rejected with message |
| QA-003 | Stream AI responses in real-time using Vercel AI SDK | Must Have | Text appears progressively, typing indicator shown |
| QA-004 | Ask adaptive follow-up questions based on project type | Must Have | Kitchen → asks about cabinets, appliances; Bathroom → asks about fixtures, layout |
| QA-005 | Generate structured JSON output from conversation | Must Have | All required fields populated, validated against schema |
| QA-006 | Calculate and display preliminary estimate range | Must Have | Shows low-high range with ±15% variance disclosed |
| QA-007 | Capture contact information (name, email, phone) | Must Have | Validates email format, phone format (Canadian) |
| QA-008 | Display progress indicator showing conversation stage | Should Have | "Step 2 of 5" or progress bar |
| QA-009 | Provide quick-reply buttons for common responses | Should Have | Buttons for project types, timeline options, budget ranges |
| QA-010 | Save/resume functionality via email magic link | Should Have | Session persists for 7 days |
| QA-011 | Allow voice input on mobile (speech-to-text) | Should Have (v1.5) | Uses browser native speech API |
| QA-012 | Connect visualization to estimate (if user used visualizer first) | Should Have | Visualizer selections flow into quote context |

### 3.4 Conversation Flow State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI QUOTE ASSISTANT STATE MACHINE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐                                                                │
│  │  START  │                                                                │
│  └────┬────┘                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────┐    photo uploaded    ┌─────────────┐                          │
│  │ WELCOME │─────────────────────▶│ PHOTO_ANALYSIS│                         │
│  │         │                      │              │                          │
│  │ • Greet │    no photo          └──────┬───────┘                          │
│  │ • Prompt│◀──────────┐                 │                                  │
│  │   photo │           │                 │ room type identified             │
│  └────┬────┘           │                 ▼                                  │
│       │                │         ┌─────────────┐                            │
│       │ skip photo     │         │ PROJECT_TYPE │                           │
│       └────────────────┴────────▶│              │                           │
│                                  │ • Kitchen    │                           │
│                                  │ • Bathroom   │                           │
│                                  │ • Basement   │                           │
│                                  │ • Other      │                           │
│                                  └──────┬───────┘                           │
│                                         │                                    │
│              ┌──────────────────────────┴──────────────────────────┐        │
│              │                          │                          │        │
│              ▼                          ▼                          ▼        │
│      ┌───────────┐              ┌───────────┐              ┌───────────┐   │
│      │ KITCHEN   │              │ BATHROOM  │              │ BASEMENT  │   │
│      │ _QUESTIONS│              │ _QUESTIONS│              │ _QUESTIONS│   │
│      │           │              │           │              │           │   │
│      │ • Layout  │              │ • Full/   │              │ • Finished│   │
│      │ • Cabinets│              │   Partial │              │   purpose │   │
│      │ • Counter │              │ • Tub/    │              │ • Egress  │   │
│      │ • Applianc│              │   Shower  │              │ • Ceiling │   │
│      │ • Floor   │              │ • Vanity  │              │ • Flooring│   │
│      └─────┬─────┘              └─────┬─────┘              └─────┬─────┘   │
│            │                          │                          │         │
│            └──────────────────────────┴──────────────────────────┘         │
│                                       │                                     │
│                                       ▼                                     │
│                               ┌───────────────┐                             │
│                               │ SCOPE_SUMMARY │                             │
│                               │               │                             │
│                               │ • Size (sqft) │                             │
│                               │ • Finish level│                             │
│                               │ • Timeline    │                             │
│                               │ • Budget range│                             │
│                               └───────┬───────┘                             │
│                                       │                                     │
│                                       ▼                                     │
│                               ┌───────────────┐                             │
│                               │ ESTIMATE      │                             │
│                               │ _DISPLAY      │                             │
│                               │               │                             │
│                               │ • Show range  │                             │
│                               │ • Breakdown   │                             │
│                               │ • Disclaimers │                             │
│                               └───────┬───────┘                             │
│                                       │                                     │
│                                       ▼                                     │
│                               ┌───────────────┐                             │
│                               │ CONTACT       │                             │
│                               │ _CAPTURE      │                             │
│                               │               │                             │
│                               │ • Name        │                             │
│                               │ • Email       │                             │
│                               │ • Phone       │                             │
│                               │ • Address     │                             │
│                               └───────┬───────┘                             │
│                                       │                                     │
│                                       ▼                                     │
│                               ┌───────────────┐                             │
│                               │ COMPLETION    │                             │
│                               │               │                             │
│                               │ • Confirmation│                             │
│                               │ • Next steps  │                             │
│                               │ • Save lead   │                             │
│                               │ • Notify owner│                             │
│                               └───────────────┘                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Edge Cases & Error Handling

| Scenario | Detection | Response |
|----------|-----------|----------|
| User uploads non-image file | MIME type check | "Please upload a photo (JPG, PNG, HEIC)" |
| User uploads image >10MB | File size check | "This image is too large. I'll compress it for you." (auto-compress) |
| AI cannot identify room type from photo | Low confidence score | "I'm not sure what type of room this is. Could you tell me?" |
| User provides unrealistic budget | Budget vs scope mismatch | "For [scope], typical costs are [range]. Would you like to adjust your expectations or your scope?" |
| User goes off-topic | Intent classification | "I'm here to help with renovation quotes. [redirect to last question]" |
| User provides incomplete info | Required field check | "I need a bit more detail about [missing info] to give you an accurate estimate." |
| API timeout | Error catch | "Give me a moment to think... [retry]" |
| Session expires | 7-day TTL | Email with magic link to resume |
| User abandons mid-flow | intake_abandoned event | Save partial data, trigger follow-up email if email collected |

### 3.6 UI/UX Wireframe Description

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Services | Projects | About | [Get Quote - CTA]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────┐ ┌──────────────────┐  │
│  │                                          │ │ YOUR ESTIMATE    │  │
│  │  ┌────────────────────────────────────┐ │ │                  │  │
│  │  │ 🤖 Hi! I'm your renovation         │ │ │ Project Type:    │  │
│  │  │    assistant. Upload a photo       │ │ │ Kitchen ✓        │  │
│  │  │    of your space to get started!   │ │ │                  │  │
│  │  └────────────────────────────────────┘ │ │ Size: ~200 sqft  │  │
│  │                                          │ │                  │  │
│  │  ┌────────────────────────────────────┐ │ │ Finish: Standard │  │
│  │  │ [User's photo displayed here]      │ │ │                  │  │
│  │  │                                    │ │ │ ───────────────  │  │
│  │  │    📷                              │ │ │                  │  │
│  │  └────────────────────────────────────┘ │ │ ESTIMATE:        │  │
│  │                                          │ │ $25,000-$32,000  │  │
│  │  ┌────────────────────────────────────┐ │ │                  │  │
│  │  │ 🤖 Great photo! This looks like a │ │ │ Materials: $15k  │  │
│  │  │    kitchen with [analysis]...      │ │ │ Labor: $10k      │  │
│  │  └────────────────────────────────────┘ │ │ HST: $3,250      │  │
│  │                                          │ │                  │  │
│  │  ┌────────────────────────────────────┐ │ │ * Preliminary    │  │
│  │  │ 👤 I want new cabinets, quartz     │ │ │   estimate only  │  │
│  │  │    counters, and modern lighting   │ │ │                  │  │
│  │  └────────────────────────────────────┘ │ └──────────────────┘  │
│  │                                          │                       │
│  │  ┌────────────────────────────────────┐ │  Progress: ████░░ 60% │
│  │  │ Type your message...          📎 🎤│ │                       │
│  │  └────────────────────────────────────┘ │                       │
│  │                                          │                       │
│  │  Quick Replies:                          │                       │
│  │  [Full remodel] [Partial update] [Paint]│                       │
│  │                                          │                       │
│  └─────────────────────────────────────────┘                       │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌───────────────────────────────────┐
│  ☰  Red White Reno  [Get Quote]   │
├───────────────────────────────────┤
│                                   │
│  Progress: ████░░░░ Step 3 of 5   │
│                                   │
│  ┌─────────────────────────────┐  │
│  │ 🤖 AI Assistant             │  │
│  │                             │  │
│  │ Great! For a kitchen        │  │
│  │ remodel, I have a few       │  │
│  │ questions to give you an    │  │
│  │ accurate estimate.          │  │
│  │                             │  │
│  │ What changes are you        │  │
│  │ planning?                   │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │ [  Full remodel           ] │  │
│  │ [  Cabinets + counters    ] │  │
│  │ [  Cosmetic updates       ] │  │
│  │ [  Something else...      ] │  │
│  └─────────────────────────────┘  │
│                                   │
│  ─────────────────────────────── │
│                                   │
│  Your Estimate:                   │
│  $25,000 - $32,000               │
│  (updates as you answer)         │
│                                   │
├───────────────────────────────────┤
│  [📎] Type or speak...      [🎤] │
└───────────────────────────────────┘

Note: Input fixed at bottom (thumb zone)
      Quick reply buttons are large (48px min)
      Estimate sticky at bottom of chat
```

---

## 4. Feature 2: AI Design Visualizer

### 4.1 Overview

The AI Design Visualizer allows homeowners to upload a photo of their current space and receive photorealistic "after" images showing potential renovation outcomes. This uses Nano Banana Pro (Gemini 3 Pro Image) with structure-preserving parameters to maintain room geometry while applying new styles.

**Competitive Reference:**
- Block Renovation Renovation Studio: [blockrenovation.com/renovation-planning](https://www.blockrenovation.com/renovation-planning)
- ReRoom AI: [reroom.ai](https://reroom.ai/)
- RoomGPT: [roomgpt.io](https://www.roomgpt.io/)

**Our Differentiation:**
- Integrated with quote assistant (visualizations influence estimate)
- Contractor-branded output (not generic tool)
- Multiple concepts generated per request (not single image)

### 4.2 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| VIS-US-001 | Homeowner | Upload a photo and see multiple design options | I can explore different styles before deciding |
| VIS-US-002 | Homeowner | Specify constraints like "keep my cabinets" | The visualization is realistic for my situation |
| VIS-US-003 | Homeowner | Compare before/after with an interactive slider | I can clearly see the transformation |
| VIS-US-004 | Homeowner | Take my visualization to the quote assistant | The contractor knows exactly what I want |
| VIS-US-005 | Homeowner | Download and share my visualizations | I can discuss with family/spouse |
| VIS-US-006 | Contractor | See what the customer visualized | I can align expectations from the start |

### 4.3 Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| VIS-001 | Support image upload with preview and validation | Must Have | Accepts JPG/PNG/HEIC, shows preview, validates dimensions |
| VIS-002 | Provide room type selection (kitchen, bath, etc.) | Must Have | Dropdown or card selection with icons |
| VIS-003 | Provide style selection (Modern, Farmhouse, etc.) | Must Have | Visual style cards with example thumbnails |
| VIS-004 | Allow optional constraints input | Should Have | Text field for "keep cabinets", "change flooring only" |
| VIS-005 | Generate 3-4 concept images per request | Must Have | Multiple variations returned within 90 seconds |
| VIS-006 | Display loading animation during generation | Must Have | Progress indicator or animation with estimated time |
| VIS-007 | Display before/after comparison with interactive slider | Must Have | Draggable divider reveals transformation |
| VIS-008 | Allow users to download generated images | Must Have | Download button, watermarked with company logo |
| VIS-009 | Link to AI Quote Assistant with visualization attached | Must Have | "Get a Quote for This Design" button |
| VIS-010 | Allow re-generation with modified parameters | Should Have | "Try Again" with different style/constraints |
| VIS-011 | Display AI disclaimer on all generated images | Must Have | Visible overlay or caption |
| VIS-012 | Capture email for users who don't proceed to quote | Should Have | Modal before download asking for email |

### 4.4 Style Options

| Style | Description | Visual Characteristics |
|-------|-------------|------------------------|
| **Modern** | Clean lines, minimal ornamentation | Flat-panel cabinets, neutral colors, stainless steel |
| **Farmhouse** | Warm, rustic, welcoming | Shaker cabinets, wood tones, apron sink |
| **Traditional** | Classic, timeless, detailed | Raised-panel cabinets, crown molding, warm wood |
| **Contemporary** | Bold, current trends | Mixed materials, statement lighting, unique finishes |
| **Scandinavian** | Light, airy, functional | White/light wood, minimal hardware, clean surfaces |
| **Transitional** | Blend of traditional and modern | Neutral palette, simple profiles, updated classics |

### 4.5 Generation Parameters (for Nano Banana Pro)

```typescript
// API call structure for visualization
const visualizationConfig = {
  model: 'gemini-3-pro-image-preview',
  structureReferenceStrength: 0.85, // High: preserve room geometry
  styleStrength: 0.4, // Moderate: apply style without overwhelming
  referenceImages: [userUploadedImage], // Can accept up to 14 reference images
  prompt: buildVisualizationPrompt(roomType, style, constraints),
  outputCount: 4, // Generate 4 variations
  resolution: '1920x1080', // HD output
  responseModalities: ['image', 'text'] // Include text description
};
```

### 4.6 UI/UX Wireframe Description

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Services | Projects | [Visualize] | [Get Quote]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Envision Your Renovation                                          │
│  Upload a photo and see your space transformed                     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  STEP 1: Upload Your Photo                                   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │                                                      │   │  │
│  │  │     📷 Drag & drop your photo here                   │   │  │
│  │  │         or click to browse                           │   │  │
│  │  │                                                      │   │  │
│  │  │     Tip: Wide shot from corner works best            │   │  │
│  │  │                                                      │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  STEP 2: Select Room Type                                    │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │  │
│  │  │ 🍳     │ │ 🛁     │ │ 🛋️     │ │ 🏠     │ │ 🌳     │    │  │
│  │  │Kitchen │ │Bathroom│ │ Living │ │Basement│ │Exterior│    │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │  │
│  │                                                              │  │
│  │  STEP 3: Choose Your Style                                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │  │
│  │  │ [image] │ │ [image] │ │ [image] │ │ [image] │        │  │
│  │  │ Modern  │ │Farmhouse│ │ Classic │ │ Scandi  │        │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │  │
│  │                                                              │  │
│  │  STEP 4: Any Constraints? (Optional)                         │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ e.g., "Keep existing cabinets, change countertops"   │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │                    [✨ Generate Visualization]               │  │
│  │                                                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

**Results Display:**
```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Your Visualization is Ready! ✨                                    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   BEFORE ◀────────────[|||]────────────▶ AFTER               │ │
│  │                                                               │ │
│  │   ┌─────────────────────────────────────────────────────┐   │ │
│  │   │                                                     │   │ │
│  │   │                                                     │   │ │
│  │   │          [ Interactive Before/After Slider ]        │   │ │
│  │   │                                                     │   │ │
│  │   │                                                     │   │ │
│  │   └─────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │   ⚠️ AI-generated visualization for inspiration only.         │ │
│  │      Actual results depend on site conditions.                │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  More Concepts:                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                      │
│  │[thumb1]│ │[thumb2]│ │[thumb3]│ │[thumb4]│                      │
│  │ ✓     │ │        │ │        │ │        │  (click to view)     │
│  └────────┘ └────────┘ └────────┘ └────────┘                      │
│                                                                     │
│  [📥 Download]  [🔄 Try Different Style]  [💰 Get Quote for This] │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Feature 3: Marketing Website

### 5.1 Site Map

```
redwhitereno.com/
├── / (Home)
├── /services
│   ├── /kitchen
│   ├── /bathroom
│   ├── /basement
│   └── /flooring
├── /projects (Gallery)
├── /about
├── /process
├── /reviews
├── /estimate (AI Quote Assistant)
├── /visualizer (AI Design Visualizer)
├── /contact
├── /privacy
└── /admin/* (Protected)
```

### 5.2 Page Requirements

| Page | Key Elements | Priority |
|------|--------------|----------|
| **Home** | Hero with CTA, AI features promo, services grid, testimonials, portfolio teaser | Must Have |
| **Services/[type]** | Service description, photo gallery, pricing indicators, CTA to estimate | Must Have |
| **Projects** | Before/after gallery with filtering by type, lightbox view | Must Have |
| **About** | Company story, team, licenses, values | Must Have |
| **Process** | 5-step renovation process, timeline expectations | Should Have |
| **Reviews** | Google Reviews embed, curated testimonials | Must Have |
| **Estimate** | AI Quote Assistant (full feature) | Must Have |
| **Visualizer** | AI Design Visualizer (full feature) | Must Have |
| **Contact** | Form (backup), phone, email, address, map | Must Have |
| **Privacy** | Privacy policy including AI disclosure | Must Have |

### 5.3 SEO Requirements

| Requirement | Implementation |
|-------------|----------------|
| Semantic HTML | Proper H1-H6 hierarchy, main/article/section tags |
| Meta Tags | Unique title (<60 chars) and description (<155 chars) per page |
| Local SEO | Schema.org LocalBusiness, Service markup |
| Sitemap | Auto-generated sitemap.xml |
| Robots | robots.txt allowing all, disallow /admin |
| Core Web Vitals | LCP <2.5s, FID <100ms, CLS <0.1 |
| Mobile-First | Responsive design, mobile-optimized images |

---

## 6. Feature 4: Admin Dashboard

### 6.1 Overview

The Admin Dashboard is the human-in-the-loop control center where the owner reviews AI-generated quotes before sending to clients. This ensures quality control while maintaining the speed benefits of AI assistance.

### 6.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| ADMIN-001 | Email/password authentication | Must Have |
| ADMIN-002 | Dashboard overview with key metrics | Must Have |
| ADMIN-003 | Lead list with filtering, sorting, search | Must Have |
| ADMIN-004 | Lead detail view with all captured data | Must Have |
| ADMIN-005 | Editable quote form with line items | Must Have |
| ADMIN-006 | Good/Better/Best tier support | Should Have |
| ADMIN-007 | Auto-calculate totals (subtotal, HST, deposit) | Must Have |
| ADMIN-008 | PDF quote generation | Must Have |
| ADMIN-009 | Send quote via email | Must Have |
| ADMIN-010 | Status tracking (New → Sent → Won/Lost) | Must Have |
| ADMIN-011 | Audit log of all changes | Must Have |
| ADMIN-012 | Email notifications for new leads | Must Have |

### 6.3 Lead Status Workflow

```
[NEW] → [DRAFT_READY] → [NEEDS_CLARIFICATION] → [SENT] → [WON/LOST]
   │          │                    │               │
   │          │                    │               └── Client accepted/declined
   │          │                    └── Missing info, follow-up needed
   │          └── AI draft generated, ready for owner review
   └── Just submitted, processing
```

---

## 7. Technical Architecture

### 7.1 Technology Stack

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| **Frontend** | Next.js (App Router) | 16.x | Best-in-class React framework, RSC support |
| **Styling** | Tailwind CSS | 4.x | Utility-first, mobile-first, rapid development |
| **UI Components** | shadcn/ui | Latest | Accessible, customizable, Tailwind-native |
| **Database** | Supabase (PostgreSQL) | Latest | RLS, real-time, Canadian region |
| **Storage** | Supabase Storage | Latest | Private buckets for user uploads |
| **Auth** | Supabase Auth | Latest | Email/password, magic links |
| **AI Chat** | OpenAI GPT-5.2 | Latest | Best conversation quality |
| **AI Vision** | OpenAI GPT-5.2 Vision | Latest | Photo analysis for room detection |
| **AI Image Gen** | Google Gemini 3 Pro Image | Latest | Structure-preserving visualization |
| **Email** | Resend | Latest | Transactional email, templates |
| **Deployment** | Vercel | Latest | Zero-config Next.js deployment |
| **Analytics** | PostHog or Plausible | Latest | Privacy-friendly, custom events |

### 7.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        FRONTEND (Next.js 16)                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │  Marketing   │  │  AI Quote    │  │  AI Design Visualizer    │  │   │
│  │  │  Pages       │  │  Assistant   │  │  (Nano Banana Pro)       │  │   │
│  │  │              │  │              │  │                          │  │   │
│  │  │ • Home       │  │ • Chat UI    │  │ • Upload UI              │  │   │
│  │  │ • Services   │  │ • Streaming  │  │ • Style selector         │  │   │
│  │  │ • Gallery    │  │ • Quick reply│  │ • Before/After slider    │  │   │
│  │  │ • Contact    │  │ • Progress   │  │ • Download               │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    ADMIN DASHBOARD                            │  │   │
│  │  │  • Lead Management  • Quote Editor  • PDF Generation        │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                      │
│                                       ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   API ROUTES (Next.js Route Handlers)               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │  /api/leads  │  │  /api/ai/    │  │  /api/ai/visualize       │  │   │
│  │  │              │  │     chat     │  │                          │  │   │
│  │  │ • POST new   │  │              │  │ • POST generate          │  │   │
│  │  │ • GET list   │  │ • POST stream│  │ • GET status             │  │   │
│  │  │ • PATCH upd  │  │ • GET hist   │  │                          │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │  /api/quotes │  │  /api/email  │  │  /api/upload             │  │   │
│  │  │              │  │              │  │                          │  │   │
│  │  │ • Generate   │  │ • Send quote │  │ • Image upload           │  │   │
│  │  │ • PDF render │  │ • Notify own │  │ • Compression            │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                       │                                      │
│                ┌──────────────────────┼──────────────────────┐              │
│                ▼                      ▼                      ▼              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │     Supabase     │  │      OpenAI      │  │  Google Gemini   │          │
│  │                  │  │                  │  │                  │          │
│  │ • PostgreSQL DB  │  │ • GPT-5.2 Chat   │  │ • Gemini 3 Pro   │          │
│  │ • Row Level Sec  │  │ • GPT-5.2 Vision │  │   Image (Nano    │          │
│  │ • Storage Bucket │  │ • Streaming API  │  │   Banana Pro)    │          │
│  │ • Auth           │  │ • Struct Output  │  │ • Image Gen      │          │
│  │ • Real-time      │  │                  │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                       │                                      │
│                                       ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          EXTERNAL SERVICES                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │    Resend    │  │   Vercel     │  │     PostHog              │  │   │
│  │  │              │  │              │  │                          │  │   │
│  │  │ • Email send │  │ • Hosting    │  │ • Analytics              │  │   │
│  │  │ • Templates  │  │ • Edge funcs │  │ • Event tracking         │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Database Schema

```sql
-- =============================================
-- LEADS TABLE: Core lead/quote request storage
-- =============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Status Management
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new', 'draft_ready', 'needs_clarification', 'sent', 'won', 'lost'
  )),

  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT DEFAULT 'Stratford',
  province TEXT DEFAULT 'ON',

  -- Project Details
  project_type TEXT CHECK (project_type IN (
    'kitchen', 'bathroom', 'basement', 'flooring', 'painting', 'exterior', 'other'
  )),
  area_sqft INTEGER,
  timeline TEXT CHECK (timeline IN (
    'asap', '1_3_months', '3_6_months', '6_plus_months', 'just_exploring'
  )),
  budget_band TEXT CHECK (budget_band IN (
    'under_15k', '15k_25k', '25k_40k', '40k_60k', '60k_plus', 'not_sure'
  )),
  finish_level TEXT CHECK (finish_level IN ('economy', 'standard', 'premium')),
  goals_text TEXT,

  -- AI-Generated Data
  chat_transcript JSONB, -- Full conversation history
  scope_json JSONB, -- Structured extraction from conversation
  quote_draft_json JSONB, -- AI-generated quote
  confidence_score NUMERIC(3,2), -- 0.00 to 1.00
  ai_notes TEXT, -- AI's reasoning/concerns

  -- Files
  uploaded_photos TEXT[], -- Array of storage URLs
  generated_concepts TEXT[], -- Array of visualization URLs
  quote_pdf_url TEXT,

  -- Tracking
  source TEXT DEFAULT 'website', -- website, referral, etc.
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  session_id UUID,

  -- Admin
  owner_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  last_contacted_at TIMESTAMPTZ,
  follow_up_date DATE
);

-- =============================================
-- QUOTE DRAFTS TABLE: Detailed quote information
-- =============================================
CREATE TABLE quote_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,

  -- Quote Content
  line_items JSONB NOT NULL, -- Array of {description, category, quantity, unit, unit_price, total}

  -- Tiered Pricing (optional)
  tier_good JSONB,
  tier_better JSONB,
  tier_best JSONB,

  -- Assumptions & Exclusions
  assumptions TEXT[],
  exclusions TEXT[],
  special_notes TEXT,
  recommended_next_step TEXT,

  -- Totals
  subtotal NUMERIC(10,2),
  contingency_percent NUMERIC(4,2) DEFAULT 10.00,
  contingency_amount NUMERIC(10,2),
  hst_percent NUMERIC(4,2) DEFAULT 13.00,
  hst_amount NUMERIC(10,2),
  total NUMERIC(10,2),
  deposit_percent NUMERIC(4,2) DEFAULT 50.00,
  deposit_required NUMERIC(10,2),

  -- Validity
  validity_days INTEGER DEFAULT 30,
  expires_at DATE,

  -- Delivery
  sent_at TIMESTAMPTZ,
  sent_to_email TEXT,
  opened_at TIMESTAMPTZ,
  pdf_url TEXT
);

-- =============================================
-- AUDIT LOG: Track all changes
-- =============================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES leads(id),
  action TEXT NOT NULL, -- 'create', 'update', 'send_quote', 'status_change', etc.
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT
);

-- =============================================
-- CHAT SESSIONS: For save/resume functionality
-- =============================================
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',

  email TEXT, -- For magic link resume
  messages JSONB NOT NULL DEFAULT '[]',
  extracted_data JSONB,
  state TEXT DEFAULT 'active', -- active, completed, expired, abandoned

  -- Tracking
  device_type TEXT,
  started_from TEXT -- 'home_cta', 'services_page', 'visualizer', etc.
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access" ON leads
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON quote_drafts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON audit_log
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Chat sessions accessible by session ID (for anonymous users)
CREATE POLICY "Session access" ON chat_sessions
  FOR ALL USING (true); -- Public access controlled by session ID in app logic

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_quote_drafts_lead_id ON quote_drafts(lead_id);
CREATE INDEX idx_audit_log_lead_id ON audit_log(lead_id);
CREATE INDEX idx_chat_sessions_email ON chat_sessions(email);

-- =============================================
-- TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER quote_drafts_updated_at
  BEFORE UPDATE ON quote_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 7.4 API Route Specifications

| Route | Method | Purpose | Auth Required | Input | Output |
|-------|--------|---------|---------------|-------|--------|
| `/api/ai/chat` | POST | Stream chat response | No | `{ messages, images?, sessionId? }` | SSE stream |
| `/api/ai/visualize` | POST | Generate visualizations | No | `{ image, roomType, style, constraints? }` | `{ concepts: string[], processingTime }` |
| `/api/leads` | POST | Create new lead | No | Lead data | `{ id, status }` |
| `/api/leads` | GET | List leads | Admin | Query params | `{ leads, total, page }` |
| `/api/leads/[id]` | GET | Get lead details | Admin | - | Full lead object |
| `/api/leads/[id]` | PATCH | Update lead | Admin | Partial lead | Updated lead |
| `/api/quotes/[leadId]` | GET | Get quote draft | Admin | - | Quote draft |
| `/api/quotes/[leadId]` | PUT | Update quote | Admin | Quote data | Updated quote |
| `/api/quotes/[leadId]/send` | POST | Send quote email | Admin | `{ email, message? }` | `{ sent: true }` |
| `/api/quotes/[leadId]/pdf` | GET | Generate PDF | Admin | - | PDF buffer |
| `/api/upload` | POST | Upload image | No | FormData with file | `{ url }` |
| `/api/sessions` | POST | Create chat session | No | `{ deviceType, startedFrom }` | `{ sessionId }` |
| `/api/sessions/[id]` | GET | Resume session | No | - | Session data |

---

## 8. AI Behavior Specification

### 8.1 Quote Assistant System Prompt

```typescript
const QUOTE_ASSISTANT_SYSTEM_PROMPT = `You are the Red White Reno Quote Assistant, a friendly and professional AI that helps homeowners get preliminary renovation estimates in Stratford, Ontario and surrounding areas.

## Your Role
Guide users through the quote intake process by asking relevant questions about their renovation project. You are warm, helpful, and knowledgeable about home renovations.

## Brand Voice
- Professional yet approachable
- Knowledgeable but not condescending
- Enthusiastic about helping people transform their homes
- Use phrases like "Heart of the home" when discussing kitchens
- Reference local Stratford area when relevant

## Conversation Flow
1. Greet warmly and invite them to share a photo of their space
2. If photo provided, analyze and identify room type and current condition
3. Confirm project type and ask about renovation goals
4. Ask about scope (full remodel vs partial updates)
5. Inquire about material preferences and finish level (economy/standard/premium)
6. Ask about timeline expectations
7. Discuss budget range (provide context: "Kitchens typically range from...")
8. Collect contact information
9. Present preliminary estimate with clear disclaimers

## Question Guidelines
- Ask ONE question at a time
- Keep responses to 2-3 sentences maximum
- Provide helpful context when asking about budget ranges
- Use quick-reply options when appropriate
- Acknowledge user's responses before moving to next question

## Pricing Guidelines (for internal calculation only - NEVER share these directly)
- Kitchen remodel: $150-$300 per sqft depending on finish level
- Bathroom remodel: $200-$400 per sqft depending on scope
- Basement finishing: $40-$80 per sqft depending on features
- Internal labor rate: $85/hour
- Contract labor markup: 15% management fee
- HST: 13% (Ontario)
- Deposit: 50% required

## Estimate Presentation Rules
- ALWAYS present as a RANGE (e.g., "$25,000 - $32,000")
- Apply ±15% variance to calculated values
- Include the standard disclaimer
- Break down into Materials, Labor, and HST
- Mention deposit requirement

## Standard Disclaimer (include with every estimate)
"This is a preliminary AI-generated estimate based on the information you've shared. Final pricing requires an in-person assessment and may vary based on site conditions, material selections, and scope changes. This estimate is valid for 30 days."

## Handling Edge Cases
- If budget seems unrealistic: Gently note typical costs and offer to adjust scope
- If scope is unclear: Ask clarifying questions before estimating
- If off-topic: Politely redirect to renovation discussion
- If frustrated: Offer to have a human follow up directly
- If asking about services not offered: Explain Red White Reno's focus areas

## Contact Collection
When collecting contact info, explain why: "So we can send you a detailed quote and answer any questions, could you share your name, email, and phone number?"

## Visualization Integration
If user mentions they used the visualizer, acknowledge it: "I see you've already visualized your space! That design will be included in your quote for our team to review."

IMPORTANT: Never make binding commitments on pricing. Always frame as preliminary estimates requiring verification.`;
```

### 8.2 Structured Output Schemas (Zod)

```typescript
import { z } from 'zod';

// Lead extraction schema
export const LeadExtractionSchema = z.object({
  projectType: z.enum(['kitchen', 'bathroom', 'basement', 'flooring', 'painting', 'exterior', 'other']),
  scopeDescription: z.string().min(10).max(2000),
  areaSqft: z.number().positive().optional(),
  finishLevel: z.enum(['economy', 'standard', 'premium']).optional(),
  timeline: z.enum(['asap', '1_3_months', '3_6_months', '6_plus_months', 'just_exploring']).optional(),
  budgetBand: z.enum(['under_15k', '15k_25k', '25k_40k', '40k_60k', '60k_plus', 'not_sure']).optional(),
  specialRequirements: z.array(z.string()).optional(),
  concernsOrQuestions: z.array(z.string()).optional(),
  estimatedCostRange: z.object({
    low: z.number().positive(),
    high: z.number().positive(),
    confidence: z.number().min(0).max(1),
    breakdown: z.object({
      materials: z.number(),
      labor: z.number(),
      hst: z.number(),
    }),
  }),
  uncertainties: z.array(z.string()).optional(), // Things AI wasn't sure about
});

// Contact schema
export const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).optional(),
  address: z.string().optional(),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/).optional(),
});

// Room analysis schema (from vision)
export const RoomAnalysisSchema = z.object({
  roomType: z.enum(['kitchen', 'bathroom', 'bedroom', 'living_room', 'basement', 'exterior', 'other']),
  confidence: z.number().min(0).max(1),
  currentCondition: z.enum(['good', 'fair', 'needs_work', 'major_renovation_needed']),
  identifiedFeatures: z.array(z.string()), // e.g., ["dated cabinets", "tile flooring", "single window"]
  estimatedSize: z.string().optional(), // "approximately 12x15 feet"
  suggestedImprovements: z.array(z.string()).optional(),
});

// Quote line item schema
export const QuoteLineItemSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  category: z.enum(['materials', 'labor', 'contract', 'permit', 'other']),
  quantity: z.number().optional(),
  unit: z.string().optional(), // sqft, each, lump sum
  unitPrice: z.number().optional(),
  total: z.number(),
  notes: z.string().optional(),
});

// Full quote schema
export const QuoteSchema = z.object({
  leadId: z.string().uuid(),
  version: z.number().int().positive(),
  lineItems: z.array(QuoteLineItemSchema),
  assumptions: z.array(z.string()),
  exclusions: z.array(z.string()),
  subtotal: z.number(),
  contingencyPercent: z.number().default(10),
  contingencyAmount: z.number(),
  hstPercent: z.number().default(13),
  hstAmount: z.number(),
  total: z.number(),
  depositPercent: z.number().default(50),
  depositRequired: z.number(),
  validityDays: z.number().default(30),
  recommendedNextStep: z.string(),
});
```

### 8.3 Fallback Behaviors

| Scenario | Detection | Fallback Action |
|----------|-----------|-----------------|
| OpenAI API timeout | 30s timeout | Retry once, then show "Taking longer than expected..." with option to leave email |
| OpenAI API error | 5xx status | Show friendly error, offer to email when ready |
| Gemini API timeout | 90s timeout | Show "Generation taking longer than usual", offer email delivery |
| Gemini API error | Any error | Show graceful message, suggest trying different photo |
| Low confidence extraction | confidence < 0.6 | Flag for human review, ask clarifying questions |
| Invalid/offensive image | Content filter | Reject politely: "I can only analyze renovation-related photos" |
| Rate limit hit | 429 status | Queue request, show position in queue |
| Session expired | 7-day TTL | Offer to send magic link to email to resume |

### 8.4 Content Moderation

All uploaded images pass through content moderation:

```typescript
const moderationCheck = async (imageBase64: string) => {
  const result = await openai.moderations.create({
    model: 'omni-moderation-latest',
    input: [{ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }],
  });

  if (result.results[0].flagged) {
    throw new ContentModerationError('Image does not appear to be renovation-related');
  }

  return true;
};
```

---

## 9. User Experience Specification

### 9.1 Loading States

| Context | Loading Treatment | Duration Threshold |
|---------|-------------------|--------------------|
| Chat response | Typing indicator (animated dots) | 0-3s |
| Chat response (long) | "Thinking..." + skeleton message | >3s |
| Photo analysis | "Analyzing your space..." + spinner | 0-10s |
| Visualization generation | Progress bar + tips carousel | 0-90s |
| Quote generation | Skeleton of quote card | 0-5s |
| Page navigation | Top progress bar (NProgress style) | 0-1s |

### 9.2 Error States

| Error Type | Visual Treatment | User Action |
|------------|------------------|-------------|
| Network error | Toast notification + retry button | Retry or refresh |
| Form validation | Inline red border + helper text | Fix and resubmit |
| Upload failed | Modal with retry option | Retry or try different file |
| AI generation failed | Friendly message + alternatives | Try again or contact support |
| Session expired | Modal with email input | Enter email for magic link |
| 500 server error | Full-page error with contact | Contact support |

### 9.3 Onboarding Flow (First-Time User)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONBOARDING FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 1: Landing                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "See Your Renovation Before You Commit"                │   │
│  │                                                          │   │
│  │  Two powerful AI tools to help you plan:                │   │
│  │                                                          │   │
│  │  [🎨 Visualize First]  [💰 Get Quote First]             │   │
│  │                                                          │   │
│  │  Or explore our [Gallery] and [Services]                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│         ┌────────────────┴────────────────┐                    │
│         ▼                                 ▼                    │
│  ┌─────────────┐                  ┌─────────────┐              │
│  │ VISUALIZER  │                  │ QUOTE FLOW  │              │
│  │ Entry Point │                  │ Entry Point │              │
│  │             │                  │             │              │
│  │ Tooltip:    │                  │ Tooltip:    │              │
│  │ "Takes 2min"│                  │ "Takes 5min"│              │
│  │             │                  │             │              │
│  └──────┬──────┘                  └──────┬──────┘              │
│         │                                │                      │
│         │ User completes visualization   │ User completes quote │
│         ▼                                ▼                      │
│  ┌─────────────┐                  ┌─────────────┐              │
│  │ Cross-sell: │                  │ Cross-sell: │              │
│  │ "Get a quote│                  │ "Visualize  │              │
│  │  for this   │                  │  your       │              │
│  │  design?"   │                  │  result?"   │              │
│  └─────────────┘                  └─────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.4 Mobile-Specific Patterns

| Pattern | Implementation |
|---------|----------------|
| **Thumb Zone Navigation** | CTAs in bottom 30% of screen, sticky footer on quote pages |
| **Touch Targets** | Minimum 48x48px for all interactive elements |
| **Swipe Gestures** | Gallery swipe, before/after reveal |
| **Camera Integration** | Direct camera access for photo upload |
| **Sticky Elements** | Floating CTA button, estimate summary bar |
| **Keyboard Handling** | Input field scrolls into view, keyboard avoidance |
| **Orientation** | Lock to portrait for chat, allow landscape for visualizer results |
| **Haptic Feedback** | Subtle vibration on button press (if supported) |

### 9.5 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard Navigation | Full keyboard access, visible focus states |
| Screen Reader | ARIA labels, live regions for chat updates |
| Color Contrast | WCAG AA (4.5:1 for text, 3:1 for large text) |
| Text Scaling | Supports up to 200% zoom without horizontal scroll |
| Motion | Respect prefers-reduced-motion for animations |
| Alt Text | Descriptive alt text for all images |
| Form Labels | Visible labels (not just placeholders) |
| Error Messages | Associated with inputs, announced by screen readers |

---

## 10. Design System

### 10.1 Color Palette

```css
:root {
  /* Primary - Red White Reno Brand */
  --color-primary: #D32F2F;
  --color-primary-hover: #B71C1C;
  --color-primary-light: #FFCDD2;

  /* Neutrals */
  --color-white: #FFFFFF;
  --color-off-white: #F5F5F5;
  --color-gray-100: #EEEEEE;
  --color-gray-200: #E0E0E0;
  --color-gray-300: #BDBDBD;
  --color-gray-500: #757575;
  --color-gray-700: #616161;
  --color-gray-900: #212121;
  --color-slate: #37474F;

  /* Semantic */
  --color-success: #2E7D32;
  --color-warning: #F57C00;
  --color-error: #C62828;
  --color-info: #1565C0;

  /* Status Colors */
  --color-status-new: #1976D2;
  --color-status-draft: #FFA000;
  --color-status-clarify: #E65100;
  --color-status-sent: #388E3C;
  --color-status-won: #1B5E20;
  --color-status-lost: #757575;
}
```

### 10.2 Typography

```css
:root {
  /* Font Family */
  --font-heading: 'Jost', sans-serif;
  --font-body: 'Jost', sans-serif;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### 10.3 Spacing Scale

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

### 10.4 Component Library (shadcn/ui Subset)

Required components from shadcn/ui:

| Component | Usage |
|-----------|-------|
| Button | CTAs, form submissions |
| Input | Text inputs, search |
| Textarea | Description fields |
| Select | Dropdowns for room type, style |
| Checkbox | Opt-ins, multi-select |
| RadioGroup | Single selection |
| Dialog | Modals, confirmations |
| Card | Content containers |
| Badge | Status indicators |
| Progress | Upload progress, generation progress |
| Skeleton | Loading states |
| Toast | Notifications |
| Table | Admin lead list |
| Tabs | Section navigation |
| Avatar | User/AI indicators |
| Slider | Before/after comparison |

### 10.5 Animation Guidelines

```css
/* Transitions */
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease;

/* Use sparingly */
--animation-fade-in: fade-in 300ms ease;
--animation-slide-up: slide-up 300ms ease;
--animation-pulse: pulse 2s infinite;
```

**Animation Rules:**
- Use for meaningful state changes only
- Respect `prefers-reduced-motion`
- Maximum duration: 500ms for micro-interactions
- No auto-playing animations except loading indicators

---

## 11. Development Phases

### Phase 0: Project Setup (Days 1-2)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| DEV-001 | Initialize Next.js 16 project with TypeScript | 1 | None |
| DEV-002 | Configure Tailwind CSS v4 | 1 | DEV-001 |
| DEV-003 | Install and configure shadcn/ui components | 2 | DEV-002 |
| DEV-004 | Set up Supabase project (Canada region) | 2 | None |
| DEV-005 | Create database schema and migrations | 3 | DEV-004 |
| DEV-006 | Configure environment variables and secrets | 1 | DEV-004 |
| DEV-007 | Set up Vercel project and deployment | 2 | DEV-001 |
| DEV-008 | Create CLAUDE.md configuration | 1 | DEV-001 |

### Phase 1: Marketing Website (Days 3-8)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| DEV-009 | Build responsive header with navigation | 3 | DEV-003 |
| DEV-010 | Create homepage hero section | 4 | DEV-009 |
| DEV-011 | Build services grid component | 3 | DEV-009 |
| DEV-012 | Create testimonials section | 2 | DEV-009 |
| DEV-013 | Build footer with contact info | 2 | DEV-009 |
| DEV-014 | Create services index page | 2 | DEV-011 |
| DEV-015 | Build service detail pages (kitchen, bath, basement) | 6 | DEV-014 |
| DEV-016 | Create project gallery with filtering | 6 | DEV-003 |
| DEV-017 | Build about page | 3 | DEV-009 |
| DEV-018 | Create contact page with form | 3 | DEV-003 |
| DEV-019 | Implement SEO components and metadata | 4 | All pages |
| DEV-020 | Add Google Reviews integration | 2 | DEV-009 |

### Phase 2: AI Quote Assistant (Days 9-18)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| DEV-021 | Build chat UI component with message bubbles | 6 | DEV-003 |
| DEV-022 | Implement image upload with compression | 4 | DEV-021 |
| DEV-023 | Create streaming chat API route | 6 | DEV-005 |
| DEV-024 | Develop system prompt and question flow | 6 | DEV-023 |
| DEV-025 | Implement photo analysis with GPT-5.2 Vision | 4 | DEV-023 |
| DEV-026 | Build structured data extraction | 4 | DEV-024 |
| DEV-027 | Create pricing calculation engine | 6 | DEV-026 |
| DEV-028 | Implement lead submission and storage | 4 | DEV-005 |
| DEV-029 | Build progress indicator component | 2 | DEV-021 |
| DEV-030 | Add quick-reply buttons | 2 | DEV-021 |
| DEV-031 | Implement save/resume with magic links | 4 | DEV-028 |
| DEV-032 | Create email notifications for new leads | 3 | DEV-028 |

### Phase 3: AI Design Visualizer (Days 19-26)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| DEV-033 | Build visualizer page layout | 4 | DEV-003 |
| DEV-034 | Create image upload with preview | 3 | DEV-033 |
| DEV-035 | Build room type selector | 2 | DEV-033 |
| DEV-036 | Create style selector with thumbnails | 3 | DEV-033 |
| DEV-037 | Implement constraints input | 2 | DEV-033 |
| DEV-038 | Create Gemini 3 Pro Image API integration | 8 | DEV-033 |
| DEV-039 | Build results display with thumbnails | 4 | DEV-038 |
| DEV-040 | Implement before/after slider component | 6 | DEV-039 |
| DEV-041 | Add download functionality with watermark | 3 | DEV-039 |
| DEV-042 | Create "Get Quote for This" link to chat | 3 | DEV-039, DEV-028 |
| DEV-043 | Build loading states and animations | 3 | DEV-038 |
| DEV-044 | Implement email capture for non-quote users | 2 | DEV-039 |

### Phase 4: Admin Dashboard (Days 27-35)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| DEV-045 | Create admin layout with sidebar | 4 | DEV-003 |
| DEV-046 | Build login page with Supabase Auth | 4 | DEV-005 |
| DEV-047 | Implement route protection middleware | 2 | DEV-046 |
| DEV-048 | Create dashboard overview with metrics | 4 | DEV-047 |
| DEV-049 | Build leads table with sorting/filtering | 6 | DEV-047 |
| DEV-050 | Implement lead search | 2 | DEV-049 |
| DEV-051 | Create lead detail page | 6 | DEV-049 |
| DEV-052 | Build photo gallery component | 3 | DEV-051 |
| DEV-053 | Create chat transcript display | 3 | DEV-051 |
| DEV-054 | Build quote line item editor | 8 | DEV-051 |
| DEV-055 | Implement auto-calculation for totals | 3 | DEV-054 |
| DEV-056 | Create assumptions/exclusions editor | 2 | DEV-054 |
| DEV-057 | Build PDF generation with @react-pdf/renderer | 8 | DEV-054 |
| DEV-058 | Implement "Send Quote" with Resend | 4 | DEV-057 |
| DEV-059 | Create status management workflow | 3 | DEV-051 |
| DEV-060 | Build audit logging | 3 | DEV-059 |

### Phase 5: Testing & Launch (Days 36-42)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| DEV-061 | Cross-browser testing | 4 | All features |
| DEV-062 | Mobile device testing | 4 | All features |
| DEV-063 | Accessibility audit and fixes | 6 | All features |
| DEV-064 | Performance optimization (Lighthouse) | 6 | All features |
| DEV-065 | Security testing | 4 | All features |
| DEV-066 | E2E testing with Playwright | 8 | All features |
| DEV-067 | User acceptance testing | 6 | DEV-066 |
| DEV-068 | Bug fixes and polish | 8 | DEV-067 |
| DEV-069 | Documentation and handoff | 4 | DEV-068 |
| DEV-070 | Production deployment | 4 | DEV-069 |
| DEV-071 | Monitoring and analytics setup | 3 | DEV-070 |

### Total Estimated Hours: ~280 hours (~7 weeks at 40 hrs/week)

---

## 12. Security & Compliance

### 12.1 PIPEDA Compliance (Canadian Privacy)

| Requirement | Implementation |
|-------------|----------------|
| Consent | Clear privacy notice before data collection |
| Purpose limitation | Only collect data necessary for quotes |
| Access rights | User can request their data via email |
| Deletion | Images deleted after 7 days if no quote submitted |
| Retention | Lead data retained 24 months, then anonymized |
| Disclosure | AI processing clearly disclosed |

### 12.2 CASL Compliance (Anti-Spam)

| Requirement | Implementation |
|-------------|----------------|
| Express consent | Unchecked opt-in checkbox for marketing |
| Implied consent | Valid for 24 months from inquiry |
| Unsubscribe | One-click unsubscribe in all emails |
| Sender ID | Company name and address in footer |
| Record keeping | Consent timestamp and source logged |

### 12.3 AI Disclaimers

**Quote Disclaimer (displayed with every estimate):**
> "This is a preliminary AI-generated estimate based on the information you've shared. Final pricing requires an in-person assessment and may vary based on site conditions, material selections, and scope changes. This estimate is not a binding contract."

**Visualization Disclaimer (displayed on all generated images):**
> "AI-generated concept for inspiration only. Actual results depend on structural feasibility, material availability, and design decisions."

### 12.4 Security Measures

| Measure | Implementation |
|---------|----------------|
| HTTPS | Enforced on all routes |
| Row Level Security | Supabase RLS on all tables |
| Input sanitization | Zod validation on all inputs |
| Rate limiting | 10 req/min per IP on AI endpoints |
| CAPTCHA | Cloudflare Turnstile on final submission |
| File validation | MIME type check, size limits on uploads |
| Content moderation | OpenAI moderation API on images |
| Secrets management | Environment variables, never in code |

---

## 13. Testing Strategy

### 13.1 Unit Testing

```typescript
// Example test for pricing calculation
describe('PricingEngine', () => {
  it('calculates kitchen estimate correctly', () => {
    const input = {
      projectType: 'kitchen',
      areaSqft: 200,
      finishLevel: 'standard',
    };

    const result = calculateEstimate(input);

    expect(result.low).toBeGreaterThan(30000);
    expect(result.high).toBeLessThan(60000);
    expect(result.hst).toBe(result.subtotal * 0.13);
  });

  it('applies correct variance', () => {
    const result = calculateEstimate({ ... });
    const variance = (result.high - result.low) / result.low;
    expect(variance).toBeCloseTo(0.30, 1); // ±15% = 30% range
  });
});
```

### 13.2 E2E Test Scenarios (Playwright)

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Quote happy path | Home → Get Quote → Upload → Answer questions → Submit | Lead created, email sent |
| Quote mobile | Same on 375px viewport | All interactions work |
| Visualizer happy path | Home → Visualize → Upload → Select style → Generate | 4 concepts displayed |
| Admin login | Login → View leads → Open lead | Lead details displayed |
| Admin send quote | Open lead → Edit quote → Send | PDF generated, email sent |
| Quote resume | Start quote → Close → Return via magic link | Session restored |

### 13.3 Performance Benchmarks

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | ≥90 | Lighthouse CI |
| Lighthouse Accessibility | ≥95 | Lighthouse CI |
| First Contentful Paint | <1.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Time to Interactive | <3s | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |

---

## 14. Appendices

### 14.1 Competitive Reference Links

**Lead Generation Platforms:**
- [Handoff.ai](https://www.handoff.ai/) - AI estimating for remodelers
- [Snaptimate](https://www.snaptimate.com/) - Instant remodeling estimates
- [Clear Estimates](https://www.clearestimates.com/) - Construction estimating software

**AI Visualization Tools:**
- [Block Renovation Studio](https://www.blockrenovation.com/renovation-planning) - Gold standard for UX
- [ReRoom AI](https://reroom.ai/) - Fast photorealistic renders
- [RoomGPT](https://www.roomgpt.io/) - Simple room redesign

**AI Chatbot Examples:**
- [Predictive Sales AI](https://www.predictivesalesai.com/) - Home services chatbot

### 14.2 Pricing Logic Details

```typescript
// Pricing constants (for system prompt and calculation engine)
const PRICING_GUIDELINES = {
  kitchen: {
    economy: { min: 150, max: 200 },    // per sqft
    standard: { min: 200, max: 275 },
    premium: { min: 275, max: 400 },
  },
  bathroom: {
    economy: { min: 200, max: 300 },
    standard: { min: 300, max: 450 },
    premium: { min: 450, max: 600 },
  },
  basement: {
    economy: { min: 40, max: 55 },
    standard: { min: 55, max: 70 },
    premium: { min: 70, max: 100 },
  },
  flooring: {
    economy: { min: 8, max: 12 },
    standard: { min: 12, max: 18 },
    premium: { min: 18, max: 30 },
  },
  laborRate: 85, // per hour
  contractMarkup: 1.15, // 15%
  hstRate: 0.13,
  depositRate: 0.50,
  contingencyRate: 0.10,
  varianceRate: 0.15, // ±15%
};
```

### 14.3 Glossary

| Term | Definition |
|------|------------|
| **Ballpark Estimate** | Preliminary cost range before detailed assessment |
| **Intake** | Process of collecting project information from homeowner |
| **Finish Level** | Quality tier of materials (economy/standard/premium) |
| **HST** | Harmonized Sales Tax (13% in Ontario) |
| **RLS** | Row Level Security (Supabase database protection) |
| **RSC** | React Server Components |
| **Structure Preservation** | AI maintaining room geometry in visualizations |
| **Thumb Zone** | Bottom portion of mobile screen reachable by thumb |

---

## 15. AI Stack Validation (January 31, 2026)

### 15.1 Validated Technology Choices

The following AI technologies have been researched and validated as of January 31, 2026:

| Component | Technology | Validation Status | Notes |
|-----------|------------|-------------------|-------|
| **Chat AI** | OpenAI GPT-5.2 | VALIDATED | Released Dec 11, 2025. Use GPT-5.2-Instant for real-time chat, GPT-5.2-Thinking for complex extraction. 400K context window, 128K output tokens. |
| **Vision AI** | OpenAI GPT-5.2 Vision | VALIDATED | Multimodal capabilities included in GPT-5.2. Excellent for room analysis and photo interpretation. |
| **Image Gen** | Google Gemini 3 Pro Image (Nano Banana Pro) | VALIDATED | Best for renovation visualization. Supports structure-preserving edits and up to 4K resolution. Use `structureReferenceStrength: 0.85` for room geometry preservation. |
| **Voice Input** | Browser Native Speech API | VALIDATED for v1 | Simple, cost-effective. No additional API costs. |
| **Voice (v2)** | OpenAI Realtime API | FUTURE | $32/1M audio input, $64/1M output tokens. Add in v1.5/v2 for enhanced conversational experience. |
| **Estimation** | Internal Pricing Guidelines | VALIDATED | RSMeans Data ($1,000+/year) is overkill for SMB. Internal guidelines with contractor input are more practical and maintainable. |

### 15.2 Alternative Considerations

| Alternative | Considered For | Decision |
|-------------|----------------|----------|
| Imagen 3 (Vertex AI) | Image generation | Consider for highest photorealistic quality. Requires Vertex AI setup. Gemini 3 Pro Image is simpler for MVP. |
| Claude 3.5 Sonnet | Chat AI | GPT-5.2 selected for consistency with vision/realtime ecosystem. Claude remains viable alternative. |
| ElevenLabs | Voice synthesis | Not needed for v1. Consider for quote read-back in v2. |

### 15.3 API Pricing Reference (as of Jan 2026)

| API | Tier | Price | Est. Monthly Cost |
|-----|------|-------|-------------------|
| GPT-5.2-Instant | Input | $5/1M tokens | ~$15 (500 leads/mo) |
| GPT-5.2-Instant | Output | $20/1M tokens | ~$40 (500 leads/mo) |
| Gemini 3 Pro Image | Generation | $0.02/image | ~$40 (2000 images/mo) |
| Supabase | Free tier | $0 | $0 (up to 500MB) |
| Vercel | Pro | $20/mo | $20 |
| Resend | Free tier | $0 | $0 (100 emails/day) |
| **Total Estimated** | | | **~$115/month** |

### 15.4 Implementation Packages

```bash
# Required AI packages
npm install ai @ai-sdk/openai @ai-sdk/google zod

# Required infrastructure
npm install @supabase/supabase-js @supabase/ssr
npm install resend @react-email/components
```

### 15.5 Model Configuration

```typescript
// lib/ai/config.ts
export const AI_CONFIG = {
  openai: {
    chat: 'gpt-5.2-instant',        // Fast responses
    extraction: 'gpt-5.2-thinking', // Complex reasoning
    vision: 'gpt-5.2-instant',      // Photo analysis
    moderation: 'omni-moderation-latest',
  },
  google: {
    imageGen: 'gemini-3-pro-image-preview', // Nano Banana Pro
  },
  parameters: {
    visualization: {
      structureReferenceStrength: 0.85, // Preserve room geometry
      styleStrength: 0.4,               // Apply style subtly
      outputCount: 4,                   // 4 variations
      resolution: '1920x1080',          // HD output
    },
    chat: {
      maxTokens: 1024,                  // Keep responses concise
      temperature: 0.7,                 // Balanced creativity
    },
    extraction: {
      maxTokens: 2048,                  // Allow detailed extraction
      temperature: 0.3,                 // More deterministic
    },
  },
};
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 21, 2026 | Manus AI | Initial PRD |
| 2.0 | Jan 31, 2026 | Claude (Cowork) | Enhanced with UX specs, AI behavior, competitive insights |
| 2.1 | Jan 31, 2026 | Claude (Cowork) | Added AI Stack Validation section with Jan 2026 research |

---

**End of Document**
