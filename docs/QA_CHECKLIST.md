# Budgeify — QA Checklist

## Build & Lint
- [ ] `npm run build` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run typecheck` passes with 0 errors
- [ ] No `console.log` in production code

## PWA
- [ ] manifest.json valid and referenced
- [ ] Icons (192, 512) exist and load
- [ ] Apple touch icon exists
- [ ] Theme color matches app theme

## Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] All interactive elements keyboard-accessible
- [ ] ARIA labels on non-text elements
- [ ] Focus indicators visible

## Performance
- [ ] First Load JS < 150kB
- [ ] No layout shift on data load (skeletons)
- [ ] Animations at 60fps

## Security
- [ ] No secrets in client bundle
- [ ] CSP headers configured
- [ ] Auth middleware on protected routes

## Deployment
- [ ] Vercel build succeeds
- [ ] Environment variables set
- [ ] Error boundary catches crashes
