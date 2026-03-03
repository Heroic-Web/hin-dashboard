# hin Frontend Website

> Clean, modern marketing website for hin - Open Source Affiliate Platform

This directory contains the static frontend website for hin, built with HTML, CSS, and vanilla JavaScript. Designed with a Tolt.io-inspired aesthetic.

## 🌐 Live Demo

- **Website**: [https://hin.com](https://hin.com)
- **Application**: [https://app.hin.com](https://app.hin.com)
- **Repository**: [https://github.com/Heroic-Web/hin-dashboard](https://github.com/Heroic-Web/hin-dashboard)

## 📁 Structure

```
frontend/
├── index.html          # Landing page
├── features.html       # Features showcase
├── pricing.html        # Pricing & comparison
├── docs.html          # Documentation
├── styles.css         # Main stylesheet (Tolt.io inspired)
├── script.js          # Interactive functionality
├── sitemap.xml        # SEO sitemap
├── robots.txt         # Crawler instructions
├── manifest.json      # PWA manifest
├── humans.txt         # Credits & tech stack
├── security.txt       # Security disclosure
├── .htaccess          # Apache configuration
└── README.md          # This file
```

## 🎨 Design Features

- **Clean & Minimal**: Tolt.io-inspired design language
- **Responsive**: Mobile-first, works on all devices
- **Fast Loading**: Optimized CSS/JS, no heavy frameworks
- **Smooth Animations**: Subtle fade-ins and transitions
- **SEO Optimized**: Comprehensive meta tags and structured data
- **Accessible**: WCAG 2.1 compliant

## 🚀 Deployment

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

The frontend is pure HTML/CSS/JS, so it can be deployed anywhere:

**Netlify:**
```bash
# Drag and drop the 'frontend' folder to Netlify
# Or use Netlify CLI:
cd frontend
netlify deploy --prod
```

**Vercel:**
```bash
# Deploy using Vercel CLI:
cd frontend
vercel --prod
```

**GitHub Pages:**
```bash
# Push to gh-pages branch:
git subtree push --prefix frontend origin gh-pages
```

### Option 2: Apache/Nginx Server

Copy files to your web server root:

```bash
# Apache
cp -r frontend/* /var/www/html/

# Nginx
cp -r frontend/* /usr/share/nginx/html/
```

### Option 3: With Main Application

The frontend can be served alongside the Next.js application by placing files in the `public` directory.

## 🔧 Configuration

### Update URLs

Current domains configured:
- **Marketing site**: `https://hin.com`
- **Application**: `https://app.hin.com`

If deploying to different domains, update:
- `sitemap.xml` - All `<loc>` tags
- `robots.txt` - Sitemap URL
- `manifest.json` - `start_url` and `scope`
- `security.txt` - Canonical URL
- All HTML files - Meta tags and canonical links

### Customize Branding

1. **Colors** - Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #10b981;      /* Main brand color */
    --primary-dark: #059669;  /* Hover state */
    /* ... other colors ... */
}
```

2. **Logo** - Replace SVG in navigation across all HTML files

3. **Content** - Update text in HTML files

## 📊 SEO Optimization

### Included SEO Features

✅ **Meta Tags**
- Title, description, keywords
- Open Graph (Facebook)
- Twitter Cards
- Canonical URLs

✅ **Structured Data**
- Sitemap.xml
- Robots.txt
- Humans.txt
- Security.txt
- Manifest.json

✅ **Performance**
- Gzip compression (.htaccess)
- Browser caching
- Optimized assets
- Lazy loading images

✅ **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader friendly

### SEO Checklist

Before deploying, verify:

- [ ] Update all URLs to your domain
- [ ] Add Google Search Console verification
- [ ] Add Google Analytics (optional)
- [ ] Generate favicon.ico and app icons
- [ ] Test mobile responsiveness
- [ ] Check page load speed (aim for <3s)
- [ ] Validate HTML (W3C Validator)
- [ ] Test all internal links
- [ ] Submit sitemap to search engines
- [ ] Set up SSL certificate (HTTPS)

## 🎯 Pages Overview

### 1. Landing Page (`index.html`)
- Hero section with value proposition
- Feature highlights (6 cards)
- Social proof statistics
- Pricing overview
- Comparison table
- Call-to-action sections

### 2. Features Page (`features.html`)
- Detailed feature categories:
  - Affiliate Management
  - Advanced Tracking
  - Flexible Commissions
  - Communication Tools
  - Developer Features
- Visual feature cards with icons

### 3. Pricing Page (`pricing.html`)
- Self-hosted (Free) vs Managed ($29/mo)
- Feature comparison table
- hin vs Competitors
- FAQ accordion
- Clear CTAs

### 4. Documentation (`docs.html`)
- Sidebar navigation
- Quick start guide
- Installation instructions
- API reference
- Deployment guides
- Code examples

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript (ES6+)** - Vanilla JS, no dependencies
- **Design System** - Tolt.io-inspired
- **Typography** - System fonts for performance
- **Icons** - Custom SVG icons

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security

Security features implemented:

- **Content Security Policy** headers
- **X-Frame-Options** (prevent clickjacking)
- **X-Content-Type-Options** (MIME sniffing)
- **Referrer-Policy** (privacy)
- **Security.txt** for responsible disclosure

## 🤝 Contributing

To contribute to the frontend:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across browsers
5. Submit a pull request

### Development Workflow

```bash
# Clone repository
git clone https://github.com/Heroic-Web/hin-dashboard.git
cd hin/frontend

# Make changes
# Test in browser (live server recommended)

# Validate HTML
# https://validator.w3.org/

# Check accessibility
# https://wave.webaim.org/
```

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details.

## 🆘 Support

- **Documentation**: [docs.html](./docs.html)
- **GitHub Issues**: [github.com/hin/hin/issues](https://github.com/Heroic-Web/hin-dashboard/issues)
- **Community**: [GitHub Discussions](https://github.com/Heroic-Web/hin-dashboard/discussions)
- **Email**: hello@hin.com

## 📈 Analytics (Optional)

To add analytics, insert before `</head>`:

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

## 🎉 Credits

- **Built By**: hin Team
- **Community Contributors**: See [CONTRIBUTORS.md](../CONTRIBUTORS.md)

---

**Made with ❤️ by the hin community**

[⭐ Star us on GitHub](https://github.com/Heroic-Web/hin-dashboard) | [🐛 Report Bug](https://github.com/Heroic-Web/hin-dashboard/issues) | [💡 Request Feature](https://github.com/Heroic-Web/hin-dashboard/discussions)
