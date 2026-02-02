# Go-Live Checklist

Final checklist before launching the Lead-to-Quote Engine for Red White Reno.

---

## Phase 1: Pre-Launch Verification (DEV-069)

### Code Quality
- [x] All unit tests passing (55/55)
- [x] All E2E tests passing (85/85)
- [x] No TypeScript errors (`npm run build` succeeds)
- [x] No ESLint warnings (`npm run lint`)
- [x] No console.log statements in production code
- [x] No debug/test routes accessible

### Security Review
- [x] Debug routes removed (`/test-db`, `/api/debug-auth`)
- [x] Admin role verification working
- [x] RLS policies active on all tables
- [x] Service role key not exposed to client
- [x] Rate limiting active on AI endpoints
- [x] Input validation on all API routes
- [x] File upload restrictions (size, MIME type)

### Environment & Secrets
- [x] Production Supabase project configured
- [x] All API keys are production (not test/development)
- [x] OpenAI API key has sufficient quota
- [x] Google AI API key has image generation enabled
- [x] Resend API key has domain verified
- [x] Environment variables set in Vercel
- [x] No secrets in git history

---

## Phase 2: Database & Backend (DEV-069)

### Database Setup
- [x] Migrations applied to production
- [x] Admin role function created
- [x] Admin user configured
- [x] RLS policies verified
- [x] Connection pooling configured
- [x] Database backups enabled

### API Verification
- [x] `/api/ai/chat` responds correctly
- [x] `/api/ai/visualize` generates images
- [x] `/api/leads` creates leads
- [x] `/api/quotes/[id]/pdf` generates PDFs
- [x] `/api/quotes/[id]/send` sends emails
- [x] Rate limiting working (test 15 rapid requests)

### AI Services
- [x] OpenAI API responding (< 5s latency)
- [x] Gemini image generation working
- [x] Vision API analyzing uploaded photos
- [x] Error handling graceful (fallbacks active)

---

## Phase 3: Frontend Verification (DEV-069)

### Marketing Pages
- [x] Homepage loads (< 2s)
- [x] Services pages complete
- [x] About page has company info
- [x] Contact form validates and submits
- [x] Navigation works on all pages

### Quote Assistant
- [x] Chat interface loads
- [x] Welcome message displays
- [x] Image upload works
- [x] Questions flow logically
- [x] Progress indicator updates
- [x] Quick-reply buttons work
- [x] Lead submits successfully
- [x] Magic link save/resume works

### Design Visualizer
- [x] Page loads with all style options
- [x] Image upload accepts photos
- [x] Room type selector works
- [x] Style thumbnails display
- [x] Generate button triggers AI
- [x] Results show 4 concepts
- [x] Before/after slider works
- [x] Download with watermark works
- [x] "Get Quote for This" links to chat

### Admin Dashboard
- [x] Login page loads
- [x] Authentication works
- [x] Non-admin users blocked
- [x] Dashboard shows metrics
- [x] Leads table loads
- [x] Search and filtering work
- [x] Lead detail page loads
- [x] Photo gallery displays
- [x] Chat transcript renders
- [x] Quote editor works
- [x] PDF generation works
- [x] Send quote email works
- [x] Status changes save
- [x] Audit log displays

---

## Phase 4: Cross-Browser & Device Testing (DEV-067)

### Desktop Browsers
- [x] Chrome (latest)
- [x] Safari (latest)
- [x] Firefox (latest)
- [x] Edge (latest)

### Mobile Devices
- [x] Safari on iPhone (iOS 17+)
- [x] Chrome on iPhone
- [x] Chrome on Android
- [x] Samsung Internet

### Viewport Testing
- [x] 375px (iPhone SE) - mobile
- [x] 390px (iPhone 14) - mobile
- [x] 768px (iPad) - tablet
- [x] 1024px (iPad Pro) - tablet
- [x] 1440px (Desktop)
- [x] 1920px (Large desktop)

### Touch & Interaction
- [x] All buttons >= 44px touch target
- [x] Mobile menu opens/closes
- [x] Forms usable on mobile
- [x] Image upload works on mobile
- [x] Chat interface scrollable

---

## Phase 5: Performance (DEV-064)

### Lighthouse Scores
- [x] Performance >= 90
- [x] Accessibility >= 95
- [x] Best Practices >= 90
- [x] SEO >= 90

### Core Web Vitals
- [x] First Contentful Paint < 1.5s
- [x] Largest Contentful Paint < 2.5s
- [x] Time to Interactive < 3s
- [x] Cumulative Layout Shift < 0.1

### Load Testing
- [x] Homepage loads in < 2s
- [x] Quote page loads in < 3s
- [x] Admin dashboard loads in < 3s
- [x] Images optimized (WebP where possible)

---

## Phase 6: Email & Notifications (DEV-058)

### Email Delivery
- [x] Resend domain verified
- [x] Test email sent successfully
- [x] Quote email template renders correctly
- [x] PDF attachment delivers
- [ ] Email opens tracked (if configured)

### Lead Notifications
- [x] New lead email sends to admin
- [x] Email contains lead summary
- [x] Link to admin dashboard works

### Quote Delivery
- [x] Customer receives quote email
- [x] PDF is readable and branded
- [x] Reply-to address correct
- [x] Unsubscribe link present (if marketing)

---

## Phase 7: Compliance & Legal (DEV-065)

### Privacy (PIPEDA)
- [x] Privacy notice on data collection
- [x] Consent checkbox for marketing
- [ ] Data retention policy documented
- [ ] Right to deletion process documented
- [x] Contact info for privacy requests

### Anti-Spam (CASL)
- [x] Express consent recorded
- [x] Unsubscribe mechanism works
- [x] Sender identification in emails
- [x] Physical address in email footer

### AI Disclaimers
- [x] Quote disclaimer visible
- [x] Visualization disclaimer on images
- [x] "Not a binding contract" language
- [x] "For inspiration only" on visualizations

### Terms & Policies
- [ ] Terms of Service page (if required)
- [ ] Privacy Policy page (if required)
- [ ] Cookie notice (if using analytics)

---

## Phase 8: Monitoring & Analytics (DEV-070)

### Error Tracking
- [ ] Error monitoring tool configured (Sentry/LogRocket)
- [ ] Alerts set up for 5xx errors
- [ ] Alerts for failed AI requests
- [ ] Team notified of alert channels

### Analytics
- [x] Vercel Analytics enabled
- [x] Custom events tracking:
  - [x] Quote started
  - [x] Quote completed
  - [x] Visualization generated
  - [x] Lead submitted
  - [x] Quote sent
  - [x] Quote won/lost

### Uptime Monitoring
- [ ] External uptime monitor active
- [ ] Checks every 5 minutes
- [ ] Alerts sent to team
- [ ] Status page available (optional)

---

## Phase 9: Documentation & Handoff (DEV-068)

### Technical Documentation
- [x] README.md complete
- [x] API documentation created
- [x] Deployment guide complete
- [x] Environment variables documented
- [x] Database schema documented

### User Documentation
- [ ] Admin dashboard guide written
- [ ] Quote workflow explained
- [ ] Visualizer instructions written
- [ ] FAQ document created

### Client Handoff
- [ ] Admin credentials provided
- [ ] Walkthrough scheduled
- [ ] Support contacts provided
- [ ] Bug reporting process explained

---

## Phase 10: Final Launch Steps

### Soft Launch (Internal)
- [x] Test with team/friends (5-10 people)
- [x] Collect feedback
- [x] Fix critical issues
- [x] Verify email delivery

### Client Review
- [ ] Walk through with Red White Reno
- [ ] Get sign-off on branding
- [ ] Verify quote calculations
- [ ] Test email templates

### Public Launch
- [ ] Update main website CTA
- [ ] Announce on social media
- [ ] Add to email signature
- [ ] Update business cards (optional)

---

## Post-Launch Monitoring (Week 1)

### Daily Checks
- [ ] Error logs reviewed
- [ ] Lead volume monitored
- [ ] AI service quotas checked
- [ ] Email delivery rates

### Weekly Reviews
- [ ] Conversion rates (visitor -> lead)
- [ ] Quote completion rates
- [ ] Admin dashboard usage
- [ ] Customer feedback collected

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Technical Lead | | | |
| QA/Testing | | | |
| Client (Red White Reno) | | | |
| Product Owner | | | |

---

## Notes

- **Launch Date Target:** February 2026
- **Soft Launch Date:** Complete
- **Go-Live Announcement:** Pending client review

**Known Issues at Launch:**
- Email open tracking not configured (optional feature)
- External uptime monitoring not set up (recommended: UptimeRobot)
- Privacy Policy/Terms of Service pages pending legal review

**Immediate Post-Launch Priorities:**
1. Set up external uptime monitoring (UptimeRobot or similar)
2. Configure Sentry for error tracking
3. Schedule client walkthrough for admin dashboard training

---

*Last Updated: February 2, 2026*
*Status: Ready for Production Launch*
