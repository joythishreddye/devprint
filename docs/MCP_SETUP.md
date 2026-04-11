# Playwright MCP Integration — Setup Guide

## What is Playwright MCP?

The [Playwright MCP server](https://github.com/anthropics/mcp-server-playwright) connects Claude Code to a real browser via the Model Context Protocol (MCP). This gives Claude Code the ability to:

- **Navigate** to any URL and interact with web pages
- **Click** buttons, fill forms, and select options
- **Take screenshots** of pages for visual verification
- **Read page content** and extract text from elements
- **Run accessibility checks** using browser DevTools
- **Test user flows** interactively without writing test scripts first

For DevPrint, this means Claude Code can directly browse the running app, verify UI components render correctly, test the comparison flow end-to-end, and catch visual regressions — all within the conversation.

## Prerequisites

- Node.js 18+ installed
- Playwright browsers installed (`npx playwright install chromium`)
- Claude Code CLI installed

## Setup

### 1. Install Playwright browsers (if not already done)

```bash
npx playwright install chromium
```

### 2. Add the Playwright MCP server

The configuration is already committed to the repo in `.mcp.json`. If you need to re-add it manually:

```bash
claude mcp add -s project playwright -- npx @playwright/mcp@latest
```

This creates/updates `.mcp.json` at the project root:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {}
    }
  }
}
```

### 3. Verify the connection

```bash
claude mcp list
```

You should see:

```
playwright: npx @playwright/mcp@latest - ✓ Connected
```

## Available MCP Tools

Once connected, Claude Code gains access to these browser tools:

| Tool | Description |
|------|-------------|
| `browser_navigate` | Navigate to a URL |
| `browser_click` | Click an element on the page |
| `browser_type` | Type text into an input field |
| `browser_screenshot` | Capture a screenshot of the current page |
| `browser_get_text` | Extract text content from the page |
| `browser_select` | Select an option from a dropdown |
| `browser_hover` | Hover over an element |
| `browser_wait` | Wait for an element or condition |
| `browser_evaluate` | Run JavaScript in the browser console |

## Example Workflows

### 1. Visual Verification of UI Components

Start the dev server, then ask Claude Code to browse the app:

```
> Start the dev server and navigate to the technologies page.
> Verify that technology cards render with name, category, and GitHub stars.
```

Claude Code will use `browser_navigate` to go to `localhost:3000/technologies`, take a screenshot, and verify the UI.

### 2. Testing the Comparison Flow

```
> Navigate to the compare page and select React and Vue for comparison.
> Take a screenshot of the comparison results.
```

### 3. Accessibility Quick Check

```
> Navigate to the homepage and check if all images have alt text
> and all buttons are keyboard-accessible.
```

### 4. Form Testing

```
> Go to the sign-up page, try submitting an empty form,
> and verify that validation errors appear.
```

## Troubleshooting

| Issue | Solution |
|-------|---------|
| MCP shows "Disconnected" | Run `claude mcp list` to check status. Re-add with `claude mcp add -s project playwright -- npx @playwright/mcp@latest` |
| Browser not found | Run `npx playwright install chromium` |
| Timeout errors | Ensure the dev server is running on `localhost:3000` before using browser tools |
| Permission denied | Check `.claude/settings.json` allows `Bash(npx playwright*)` |

## How This Fits Into DevPrint Development

The Playwright MCP integration complements our existing testing setup:

- **Vitest** (unit/component tests) — automated, runs in CI
- **Playwright test runner** (`npm run test:e2e`) — scripted E2E tests, runs in CI
- **Playwright MCP** (this integration) — interactive browser testing during development, used in Claude Code conversations

The MCP layer is most valuable during development for quick visual checks, exploratory testing, and debugging UI issues without leaving the Claude Code session.
