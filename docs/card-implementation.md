# Digital Business Card Implementation Guide

## Overview

This document details the implementation of the digital business card component used in the dtslib platform.

## Design System

### CSS Variables

```css
:root {
  --bg: #0A0A0A;
  --bg-card: #111111;
  --bg-elevated: #1A1A1A;
  --gold: #D4AF37;
  --gold-dim: rgba(212,175,55,.15);
  --text: #FFFFFF;
  --text-secondary: rgba(255,255,255,.85);
  --text-muted: rgba(255,255,255,.6);
  --border: rgba(255,255,255,.1);
  --border-gold: rgba(212,175,55,.3);
}
```

### Typography

- **Display Font**: `'Cormorant Garamond', serif` - Used for names and titles
- **Body Font**: `'Inter', -apple-system, sans-serif` - Used for general text
- **Mono Font**: `'JetBrains Mono', monospace` - Used for codes and technical info

## Card Structure

### HTML Structure

```html
<div class="card-container">
  <div class="card">
    <div class="card-header">
      <div class="logo-area"><!-- Logo --></div>
      <div class="title-area"><!-- Name & Title --></div>
    </div>
    <div class="card-body">
      <div class="contact-grid"><!-- Contact items --></div>
    </div>
    <div class="card-footer">
      <div class="action-buttons"><!-- Actions --></div>
    </div>
  </div>
</div>
```

### Contact Grid Item

```html
<div class="contact-item" onclick="copyToClipboard('value')">
  <span class="contact-icon">📧</span>
  <div class="contact-info">
    <span class="contact-label">Email</span>
    <span class="contact-value">email@example.com</span>
  </div>
</div>
```

## Animations

### Card Entry Animation

```css
@keyframes cardEntry {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card {
  animation: cardEntry 0.6s ease-out;
}
```

### Shimmer Effect

```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.card-header::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212,175,55,.1),
    transparent
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}
```

### Logo Pulse

```css
@keyframes logoPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,.4); }
  50% { box-shadow: 0 0 0 8px rgba(212,175,55,0); }
}

.logo {
  animation: logoPulse 2s ease-in-out infinite;
}
```

## Interactive Features

### Copy to Clipboard

```javascript
function copyToClipboard(text, type) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${type} copied!`);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(`${type} copied!`);
  });
}
```

### Toast Notification

```javascript
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
```

### vCard Generation

```javascript
function saveContact() {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Name
ORG:Company
TITLE:Title
TEL:+82-10-0000-0000
EMAIL:email@example.com
URL:https://example.com
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contact.vcf';
  a.click();
  URL.revokeObjectURL(url);
}
```

## QR Code Integration

```javascript
function generateQR() {
  const url = window.location.href;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  document.getElementById('qrImage').src = qrApi;
}
```

## Responsive Design

### Mobile Breakpoints

```css
/* Base - Mobile First */
.card {
  width: 100%;
  max-width: 400px;
  padding: 24px;
}

/* Small devices */
@media (max-width: 380px) {
  .card {
    padding: 20px;
  }
  
  .contact-grid {
    gap: 8px;
  }
}

/* Landscape orientation */
@media (max-height: 600px) and (orientation: landscape) {
  .card-container {
    padding: 10px;
  }
}
```

## PWA Support

### Manifest Reference

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0A0A0A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

## Print Styles

```css
@media print {
  body {
    background: white;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .action-buttons {
    display: none;
  }
}
```

## Accessibility

- All interactive elements have `role` attributes
- Touch targets are minimum 44x44px
- Color contrast meets WCAG AA standards
- Focus states are visible
- Screen reader friendly labels

## Performance

- No external JavaScript dependencies
- Inline critical CSS
- Lazy-loaded QR code
- Minimal DOM elements
- GPU-accelerated animations
