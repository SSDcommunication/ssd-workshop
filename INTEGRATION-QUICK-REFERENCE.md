# 🔧 IKIGAI Business · Integration Quick Reference

Quick links and configurations for Phase 2 integration.

---

## 🔐 Stripe Setup

**Links:**
- Dashboard: https://dashboard.stripe.com
- Documentation: https://stripe.com/docs
- Testing cards: https://stripe.com/docs/testing

**What to do:**
1. Create account & verify email
2. Create 3 Products:
   - "IKIGAI Business Standard (49€)"
   - "IKIGAI Business Premium (97€)"
   - "IKIGAI Business VIP (197€)"
3. Copy Price IDs to README.md

**Test Card:** `4242 4242 4242 4242` (Exp: any future, CVC: any 3 digits)

**File to update:**
- `/landing-page/ikigai-business/inscription.html` (line ~180)
  - Replace: `pk_test_PLACEHOLDER`
  - With: Your real public key `pk_test_...`

**Environment Variables (.env):**
```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📧 Mailchimp Setup

**Links:**
- Mailchimp: https://mailchimp.com
- Automation Guide: https://mailchimp.com/features/automation
- API Reference: https://mailchimp.com/developer

**What to do:**
1. Create account
2. Create audience "IKIGAI Business"
3. Create 10 campaigns from `EMAIL-SEQUENCE.md`:
   - Day +3: Invitation
   - Day +2: Questions
   - Day +1: Last call
   - Day 0: Confirmation
   - Day -3: Reminder
   - Day -1: Last reminder
   - Day J: Live session (1h before)
   - Day +1: Thank you
   - Day +7: Follow-up
   - Day +30: Upsell VIP

4. Set up automation trigger: "New inscrit IKIGAI"
   - Trigger: Stripe payment completed
   - Action: Send email sequence

**Integration Method:**
- Option A: Zapier → Stripe webhook → Mailchimp
- Option B: Custom backend webhook → Mailchimp API
- Option C: Manual import + scheduled sends (not recommended)

**Environment Variables (.env):**
```
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
MAILCHIMP_AUDIENCE_ID=...
```

---

## 🎥 Zoom Setup

**Links:**
- Zoom: https://zoom.us
- Developer: https://developers.zoom.us
- Meeting Settings: https://zoom.us/profile/setting

**What to do:**
1. Create account (free tier OK for starting)
2. Create recurring meeting:
   - Topic: "IKIGAI Business Workshop"
   - Time: Saturday 2:00 PM (14h00)
   - Duration: 3 hours
   - Recurring: Weekly
   - Video: Host + Participant ON
   - Audio: VoIP only
   - Recording: Cloud
3. Copy meeting link (format: `https://zoom.us/j/[ID]?pwd=[PASSWORD]`)

**Where to paste meeting link:**
- `/landing-page/ikigai-business/confirmation.html` (line ~140)
- `/workshop-delivery/ikigai-business/EMAIL-SEQUENCE.md` (multiple emails)

**Test before launch:**
- Test audio/video as host
- Test screen share
- Test participant join
- Test chat functionality

---

## 🖥️ Backend Deployment

**Deployment options:**
- Vercel (easiest for Node.js): https://vercel.com
- Heroku: https://heroku.com
- Railway: https://railway.app
- AWS Lambda: https://aws.amazon.com

**Setup steps:**
1. Create account on chosen platform
2. Create `server.js` based on `/landing-page/ikigai-business/README.md`
3. Create `.env` with all secrets
4. Deploy and get URL (e.g., `https://ikigai-api.vercel.app`)

**Required endpoints:**
- `POST /api/checkout` — create Stripe session
- `POST /webhook` — handle payment webhook
- `GET /api/status` — check order status (optional)

**Environment variables needed:**
```
NODE_ENV=production
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=... (if using DB)
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
DOMAIN=https://ikigai.studio-styledesign.com
```

**Test before launch:**
- Test inscription form → payment → webhook
- Check Stripe logs for successful webhooks
- Verify emails sent via Mailchimp
- Confirm database logging (if applicable)

---

## 📊 Analytics Setup

### Google Analytics 4

**Links:**
- Setup: https://analytics.google.com
- Tag Manager: https://tagmanager.google.com

**What to do:**
1. Create GA4 property
2. Get Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `/landing-page/ikigai-business/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

4. Create events to track:
   - `diagnostic_clicked` (button click on landing)
   - `inscription_started` (form opened)
   - `payment_completed` (webhook from Stripe)

### Facebook Pixel

**Links:**
- Pixel: https://facebook.com/ads/manager

**What to do:**
1. Create Pixel (format: `123456789`)
2. Add to `/landing-page/ikigai-business/index.html`:
```html
<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  // ... (full code from Facebook)
  fbq('init', '123456789');
  fbq('track', 'PageView');
</script>
```

3. Track events:
   - `ViewContent` (landing page viewed)
   - `InitiateCheckout` (inscription form opened)
   - `Purchase` (payment completed)

### Hotjar

**Links:**
- Hotjar: https://hotjar.com

**What to do:**
1. Create account & site
2. Get tracking code (format: `<script async src="https://static.hotjar.com/c/hotjar-123456.js?sv=..."></script>`)
3. Add to `/landing-page/ikigai-business/index.html`
4. Set up heatmaps for:
   - Landing page (full page)
   - Inscription form
5. Review recordings to find friction points

---

## 🌐 DNS Configuration

**Your domain:** `ikigai.studio-styledesign.com`

**If deployed on Vercel:**
1. Go to Vercel project settings → Domains
2. Add domain `ikigai.studio-styledesign.com`
3. Copy DNS records
4. Update domain registrar DNS records

**Common DNS records needed:**
```
Type: A
Name: ikigai
Value: [Your deployment server IP]

Type: CNAME  
Name: www.ikigai
Value: cname.vercel.com
```

**SSL/TLS:** Automatic (Let's Encrypt on Vercel)

---

## ✅ Pre-Launch Testing Checklist

### Landing Page
- [ ] Page loads in < 3 seconds
- [ ] Mobile responsive (test on phone)
- [ ] "Diagnostic gratuit" link works
- [ ] "S'inscrire" button → inscription page
- [ ] Dark mode toggle works
- [ ] FAQ questions expand/collapse
- [ ] All images load
- [ ] No console errors

### Inscription Page
- [ ] Form fields required validation
- [ ] Radio buttons (plan selection) work
- [ ] Sticky summary updates on plan change
- [ ] Stripe card element loads
- [ ] Payment button clickable
- [ ] Test payment with `4242 4242 4242 4242`
- [ ] Redirects to confirmation page after payment
- [ ] No console errors

### Confirmation Page
- [ ] Displays after successful payment
- [ ] Shows correct plan details
- [ ] Shows session date/time
- [ ] "Check email" button works
- [ ] "Join WhatsApp" button works
- [ ] Dark mode compatible
- [ ] Mobile responsive

### Email Sequence
- [ ] Day 0 email arrives within 5 min of payment
- [ ] All links in emails are clickable
- [ ] Zoom link opens meeting
- [ ] "Confirm email" link in Day 0 works
- [ ] Day -3, -1, J, +1 emails arrive on correct dates
- [ ] Formatting looks good in Gmail, Outlook, mobile

### Workshop Session (Live)
- [ ] Zoom link works at session time
- [ ] Audio/video functional for host
- [ ] Participants can unmute
- [ ] Screen share works
- [ ] Chat functional
- [ ] Worksheet displays correctly on participant screens
- [ ] Recording starts automatically

### Worksheet
- [ ] All textareas are clickable
- [ ] Text input saves (test localStorage)
- [ ] Print preview shows all content
- [ ] Mobile: textareas sized appropriately
- [ ] Dark mode readable
- [ ] Download/print button works

---

## 📱 Social Media Announcement

**LinkedIn Post:**
```
🎯 Trouvez votre positionnement clair en 3h

Rejoignez notre prochain atelier IKIGAI Business — samedi 14h-17h en visio.

Vous repartirez avec:
✓ Votre positionnement unique (une phrase)
✓ Un plan d'action 7-90 jours concret
✓ La clarté qui vous manquait

3 formules selon votre niveau d'accompagnement.

👉 [link to landing page]

#IKIGAI #BusinessStrategy #Positioning
```

**Instagram Story:**
- 3 slides
- Slide 1: "Trouvez votre positionnement clair" + CTA
- Slide 2: "3 formules pour tous les budgets" (pricing cards)
- Slide 3: "Samedi 14h — 3h d'atelier en visio" + link to landing

---

## 🔗 Key Files to Update

| File | Update | Details |
|------|--------|---------|
| `inscription.html` | Line ~180 | Replace `pk_test_PLACEHOLDER` with real Stripe key |
| `confirmation.html` | Line ~140 | Add Zoom meeting link |
| `EMAIL-SEQUENCE.md` | All emails | Add Zoom link to emails |
| `.env` | All keys | Stripe, Mailchimp, Zoom keys |
| `server.js` | Backend | Deploy to Vercel/Heroku |

---

## 🚨 Common Issues & Fixes

**Issue:** Stripe payment fails with "Invalid API key"
- **Fix:** Verify public key in inscription.html matches Stripe dashboard

**Issue:** Emails not sent after payment
- **Fix:** Check webhook logs in Stripe dashboard → Webhooks → Recent events

**Issue:** Zoom link doesn't work
- **Fix:** Verify meeting is active and password is correct

**Issue:** Low conversion rate on inscription
- **Fix:** Add testimonials, reduce form fields, add trust badges

**Issue:** High Stripe error rate
- **Fix:** Enable 3D Secure, check account verification status

---

## 📞 Support

- Stripe Support: support@stripe.com
- Mailchimp Support: https://mailchimp.com/help
- Zoom Support: https://support.zoom.us
- Email: contact.ssdcommunication@gmail.com

---

**Last Updated:** 23 juillet 2026  
**Status:** Ready for Phase 2  
**Recommended Start:** Priority 1 (Stripe) — 1-2 hours setup
