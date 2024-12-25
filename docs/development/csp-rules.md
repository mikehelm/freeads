# Content Security Policy (CSP) Rules

## Core Principles

1. **CSP Configuration Location**
   - ALWAYS define CSP in `index-dev.html` for development
   - NEVER set CSP headers in Vite plugins or server middleware
   - Keep production CSP separate in `index.html`

2. **Required CSP Directives**
   ```html
   default-src 'self';
   script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.metamask.io;
   style-src 'self' 'unsafe-inline';
   connect-src 'self' ws: wss: http: https: data:;
   img-src 'self' data: https:;
   font-src 'self' data:;
   frame-src 'self' https://*.metamask.io;
   object-src 'none';
   base-uri 'self';
   ```

3. **Plugin Management**
   - Debug plugins should ONLY log headers
   - NEVER override CSP in plugins
   - Use try-catch blocks in all plugin code

## Server Management Rules

1. **Before Server Restart**
   - Check for running processes: `lsof -i :3000`
   - Use `pkill -f "node"` carefully
   - Wait 1000ms before starting new server

2. **Server Start Sequence**
   - Kill existing processes
   - Wait for port release
   - Start with `npm run dev`
   - Verify server is running

3. **Error Prevention**
   - Monitor server logs for CSP violations
   - Keep CSP directives updated with new requirements
   - Document all CSP changes in git commits

## MetaMask Integration

1. **Required Permissions**
   - Allow MetaMask domains
   - Enable eval for Web3
   - Allow WebSocket connections
   - Permit frame access

2. **Testing Protocol**
   - Verify MetaMask connection
   - Check for CSP errors in console
   - Test wallet interactions
   - Validate transaction flows

## Development Guidelines

1. **CSP Modifications**
   - Document reason for any CSP changes
   - Test thoroughly after modifications
   - Keep development and production CSP in sync
   - Review security implications

2. **Error Handling**
   - Log all CSP violations
   - Implement proper error boundaries
   - Maintain detailed error documentation
   - Regular security audits

## Troubleshooting Steps

1. **CSP Errors**
   - Check browser console for specific violations
   - Verify CSP meta tag in HTML
   - Confirm all required domains are whitelisted
   - Test with minimal CSP first

2. **Server Issues**
   - Clear port conflicts
   - Check for zombie processes
   - Verify Vite configuration
   - Review plugin interactions

Remember: Security and stability must be balanced in development. Always err on the side of security when making CSP decisions.
