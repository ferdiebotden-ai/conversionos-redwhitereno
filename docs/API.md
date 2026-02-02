# API Documentation

Complete reference for all API endpoints in the Lead-to-Quote Engine.

---

## Base URL

```
Production: https://leadquoteenginev2.vercel.app
Local: http://localhost:3000
```

---

## Authentication

### Public Endpoints
Most endpoints are public and require no authentication:
- Marketing pages
- Quote assistant chat
- Visualizer
- Lead submission

### Protected Endpoints
Admin endpoints require authentication via Supabase Auth JWT:
```
Authorization: Bearer <supabase-jwt-token>
```

---

## AI Endpoints

### POST /api/ai/chat
Stream chat responses for the quote assistant.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I want to renovate my kitchen" }
  ],
  "sessionId": "optional-session-id",
  "photos": ["base64-encoded-image-optional"]
}
```

**Response:**
Streaming text response (Server-Sent Events format)

**Rate Limit:** 10 requests/minute per IP

---

### POST /api/ai/visualize
Generate design concept images using Gemini.

**Request:**
```json
{
  "image": "base64-encoded-image",
  "roomType": "kitchen",
  "style": "modern-farmhouse",
  "constraints": "Keep existing cabinets, update countertops"
}
```

**Response:**
```json
{
  "success": true,
  "visualizations": [
    {
      "id": "uuid",
      "url": "https://...",
      "prompt": "Generated prompt used"
    }
  ]
}
```

**Rate Limit:** 5 requests/minute per IP

---

## Lead Management

### POST /api/leads
Submit a new lead from the quote assistant.

**Request:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "phone": "519-555-1234",
  "address": "123 Main St",
  "postalCode": "N5A 1A1",
  "city": "Stratford",
  "province": "ON",
  "projectType": "kitchen",
  "areaSqft": 200,
  "timeline": "3-6 months",
  "budgetBand": "40000-60000",
  "finishLevel": "standard",
  "goalsText": "More counter space and modern look",
  "chatTranscript": [...],
  "scopeJson": {...},
  "uploadedPhotos": ["url1", "url2"],
  "sessionId": "uuid",
  "source": "website",
  "confidenceScore": 0.85
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "uuid",
  "message": "Lead created successfully"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error
- `429` - Rate limited

---

### GET /api/leads/[id]
Get lead details (admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "uuid",
  "status": "new",
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "projectType": "kitchen",
  "createdAt": "2026-02-02T10:00:00Z",
  "chatTranscript": [...],
  "scopeJson": {...},
  "uploadedPhotos": [...],
  "quoteDrafts": [...]
}
```

---

### PATCH /api/leads/[id]
Update lead information (admin only).

**Request:**
```json
{
  "status": "reviewing",
  "ownerNotes": "Called back, interested in premium finish"
}
```

**Response:**
```json
{
  "success": true,
  "lead": {...}
}
```

---

### GET /api/leads/[id]/audit
Get audit log for a lead (admin only).

**Query Parameters:**
- `limit` - Number of entries (default: 20, max: 100)
- `offset` - Pagination offset

**Response:**
```json
{
  "logs": [
    {
      "id": "uuid",
      "action": "status_change",
      "oldValues": {"status": "new"},
      "newValues": {"status": "reviewing"},
      "createdAt": "2026-02-02T10:30:00Z",
      "userId": "admin-uuid"
    }
  ],
  "total": 5
}
```

---

## Quote Management

### GET /api/quotes/[leadId]
Get quote drafts for a lead (admin only).

**Response:**
```json
{
  "quotes": [
    {
      "id": "uuid",
      "version": 1,
      "lineItems": [...],
      "tierGood": {...},
      "tierBetter": {...},
      "tierBest": {...},
      "subtotal": 45000,
      "contingencyAmount": 4500,
      "hstAmount": 6435,
      "total": 55935,
      "depositRequired": 27967.50,
      "status": "draft"
    }
  ]
}
```

---

### POST /api/quotes/[leadId]
Create or update a quote draft (admin only).

**Request:**
```json
{
  "lineItems": [
    {
      "category": "cabinetry",
      "description": "Premium cabinets",
      "quantity": 1,
      "unitPrice": 12000
    }
  ],
  "assumptions": ["Existing plumbing stays in place"],
  "exclusions": ["Appliances not included"],
  "contingencyPercent": 10,
  "hstPercent": 13,
  "depositPercent": 50,
  "validityDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "quote": {...}
}
```

---

### GET /api/quotes/[leadId]/pdf
Generate PDF quote (admin only).

**Query Parameters:**
- `quoteId` - Specific quote version (optional, uses latest if not provided)

**Response:**
PDF file download (application/pdf)

---

### POST /api/quotes/[leadId]/send
Send quote email to customer (admin only).

**Request:**
```json
{
  "quoteId": "uuid",
  "customMessage": "Hi Sarah, here's your quote as discussed. Let me know if you have questions!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quote sent to sarah@example.com",
  "sentAt": "2026-02-02T11:00:00Z"
}
```

---

## Session Management

### POST /api/sessions/save
Save an in-progress chat session.

**Request:**
```json
{
  "email": "sarah@example.com",
  "messages": [...],
  "extractedData": {...},
  "state": "in_progress"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "resumeUrl": "https://.../estimate/resume?token=..."
}
```

---

### GET /api/sessions/[id]
Resume a chat session.

**Query Parameters:**
- `token` - Resume token from email

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "email": "sarah@example.com",
    "messages": [...],
    "extractedData": {...},
    "state": "in_progress",
    "expiresAt": "2026-02-09T10:00:00Z"
  }
}
```

---

## Visualizations

### POST /api/visualizations
Save a generated visualization.

**Request:**
```json
{
  "leadId": "optional-lead-id",
  "originalImage": "url",
  "generatedImages": ["url1", "url2", "url3", "url4"],
  "roomType": "kitchen",
  "style": "modern-farmhouse",
  "constraints": "..."
}
```

**Response:**
```json
{
  "success": true,
  "visualizationId": "uuid",
  "shareUrl": "https://.../visualizer/share/..."
}
```

---

### GET /api/visualizations/[id]
Get a saved visualization.

**Response:**
```json
{
  "visualization": {
    "id": "uuid",
    "originalImage": "url",
    "generatedImages": [...],
    "roomType": "kitchen",
    "style": "modern-farmhouse",
    "createdAt": "2026-02-02T10:00:00Z"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Not authorized for this action |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `AI_SERVICE_ERROR` | 502 | AI service unavailable |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/ai/chat | 10 | 1 minute |
| /api/ai/visualize | 5 | 1 minute |
| /api/leads | 5 | 1 minute |
| All other endpoints | 60 | 1 minute |

---

## Webhooks

### Lead Created Webhook (Future)

**Payload:**
```json
{
  "event": "lead.created",
  "timestamp": "2026-02-02T10:00:00Z",
  "data": {
    "leadId": "uuid",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "projectType": "kitchen"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Submit a lead
const response = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    projectType: 'kitchen',
    // ... other fields
  })
});

const data = await response.json();
```

### cURL

```bash
# Get lead details (admin)
curl -H "Authorization: Bearer $JWT_TOKEN" \
  https://leadquoteenginev2.vercel.app/api/leads/123

# Generate PDF
curl -H "Authorization: Bearer $JWT_TOKEN" \
  https://leadquoteenginev2.vercel.app/api/quotes/123/pdf \
  --output quote.pdf
```

---

## Testing

Use these endpoints for testing:

```bash
# Health check
curl https://leadquoteenginev2.vercel.app/api/health

# Test AI chat (without streaming)
curl -X POST https://leadquoteenginev2.vercel.app/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

---

*For questions or issues, refer to the README.md or contact the development team.*
