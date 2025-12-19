# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Gemini CLI** is an open-source terminal application that brings the power of Google's Gemini AI directly into your command line. It features:

- Interactive AI-powered chat with context awareness
- Built-in tools for file operations, shell commands, web fetching, and more
- Model Context Protocol (MCP) server integration for extensibility
- Multi-sandbox support (Docker, Podman, macOS Seatbelt) for safe command execution
- Cross-platform support (macOS, Linux, Windows)

This is a monorepo using **npm workspaces** with multiple packages contributing to a single bundled CLI application.

## Project Structure

```
gemini-cli/
├── packages/
│   ├── cli/              # User-facing CLI (React + Ink terminal UI)
│   ├── core/             # Backend logic (Gemini API, tools, state management)
│   ├── test-utils/       # Shared testing utilities and mocks
│   ├── vscode-ide-companion/  # VS Code extension companion
│   ├── a2a-server/       # Agent-to-agent communication server
│   └── agent-nft/        # NFT agent integration
├── integration-tests/    # End-to-end tests
├── scripts/              # Build, release, and development scripts
├── docs/                 # User and developer documentation
└── bundle/               # Final bundled executable (generated)
```

### Core Architecture

The system separates **frontend** (CLI) from **backend** (core):

1. **`packages/core`** - Backend that orchestrates:
   - Communication with the Gemini API (`@google/genai` SDK)
   - Tool registration and execution (file system, shell, web tools)
   - Prompt construction and conversation state
   - MCP server management
   - Telemetry and error handling

2. **`packages/cli`** - User interface that handles:
   - Terminal rendering with React and Ink
   - User input processing and command routing
   - Conversation history management
   - Theme and UI customization
   - Configuration file reading

3. **Interaction Flow**:
   - User input → CLI package → Core package → Gemini API
   - Tool requests from API → Core executes → Results back to API
   - Final response → CLI renders to terminal

## Development Commands

### Setup & Installation

```bash
# Install dependencies (uses npm workspaces)
npm install

# Link the CLI for development (optional, for testing 'gemini' command)
npm link packages/cli
```

### Build & Bundling

```bash
# Build all packages (TypeScript → JavaScript)
npm run build

# Build everything including sandbox container
npm run build:all

# Bundle for distribution (generates bundle/gemini.js)
npm run bundle

# Start from source after building
npm run start

# Debug mode with Node inspector
npm run debug
```

### Testing

```bash
# Run all unit tests (Vitest)
npm run test

# Run tests with coverage
npm run test:workspaces  # Individual packages

# E2E integration tests (requires GEMINI_API_KEY)
npm run test:e2e

# Integration tests with different sandbox modes
npm run test:integration:sandbox:none      # No sandbox
npm run test:integration:sandbox:docker    # Docker sandboxing
```

### Code Quality

```bash
# Full preflight check (build + tests + lint + typecheck)
npm run preflight

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Type checking
npm run typecheck
```

### Individual Package Commands

Each package (`packages/core`, `packages/cli`, etc.) has its own scripts:

```bash
cd packages/core
npm run test          # Test only core
npm run lint          # Lint only core
npm run build         # Build only core
npm run typecheck     # Type check only core
```

## Code Standards & Conventions

### From GEMINI.md (Existing Project Conventions)

**Before any changes, run the full validation**:
```bash
npm run preflight
```

This ensures your code passes all quality gates before submission.

### TypeScript/JavaScript Practices

1. **Prefer Plain Objects over Classes**
   - Use TypeScript interfaces with plain objects (functional style)
   - Reduces boilerplate and improves React integration
   - Easier serialization and data flow

2. **Use ES Module Syntax for Encapsulation**
   - Prefer `import`/`export` boundaries over class visibility modifiers
   - Unexported symbols are naturally private; exported ones are public
   - Promotes clearer module contracts

3. **Avoid `any` Types; Prefer `unknown`**
   - Never use `any` without strong justification
   - Use `unknown` with type narrowing for unsafe values
   - Type assertions (`as Type`) should be rare and documented

4. **Type Narrowing in Switch Statements**
   - Use the `checkExhaustive()` helper in default clauses
   - Located in `packages/cli/src/utils/checks.ts`
   - Ensures all enum/union cases are handled

5. **Embrace Functional Array Methods**
   - Use `.map()`, `.filter()`, `.reduce()`, `.slice()`, etc.
   - Promotes immutability and declarative code
   - More readable than imperative loops

### React Component Guidelines (Ink-based Terminal UI)

- Use **functional components with Hooks** (`useState`, `useEffect`, etc.)
- No class components
- Terminal UI rendered with **Ink** (React for terminal)
- Test terminal components with `ink-testing-library` and `render()`
- Assert on `lastFrame()` output

### Testing Framework: Vitest

**Key Conventions**:

- **Test File Location**: `*.test.ts` (logic) or `*.test.tsx` (components), co-located with source
- **Setup/Teardown**: Use `beforeEach()` and `afterEach()`
- **Mocking Order**: Place `vi.mock()` calls **at the very top** of test files (before imports) for module-level constants

**Common Mocks**:
```typescript
// Mock Node.js built-ins (os, fs, path, child_process)
vi.mock('os', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, homedir: vi.fn() };
});

// Mock external SDKs (@google/genai, @modelcontextprotocol/sdk)
vi.mock('@google/genai');

// Create mock functions
const mockFn = vi.fn().mockResolvedValue('result');
vi.spyOn(obj, 'method').mockReturnValue('value');
```

**Async Testing**:
- Use `async/await` with promises
- Use `vi.useFakeTimers()` for timer-based logic
- Test rejections with `await expect(promise).rejects.toThrow()`

### Commit Message Style

Follow **Conventional Commits** (as enforced by linting):

```
feat(package): Short description of new feature
fix(package): Short description of bug fix
docs: Documentation updates
refactor(package): Code restructuring without behavior change
test(package): Test additions or updates
chore: Build, dependencies, or tooling updates
```

**Example**:
```
feat(core): Add support for MCP server auto-discovery
fix(cli): Prevent terminal flickering during large outputs
```

## Important File Locations

| File/Directory | Purpose |
|---|---|
| `packages/core/src/core/` | Gemini API client, prompt builder, state management |
| `packages/core/src/services/` | Tools (file system, shell, web fetching, MCP) |
| `packages/core/src/telemetry/` | Analytics and monitoring |
| `packages/cli/src/commands/` | Command handlers (chat, config, extensions, etc.) |
| `packages/cli/src/ui/` | Ink React components for terminal UI |
| `integration-tests/` | E2E tests with actual API calls |
| `docs/` | User documentation (commands, config, auth, etc.) |
| `scripts/` | Build, release, and dev automation |
| `.github/workflows/` | CI/CD pipeline (lint, test, build, release) |

## Time Tracking with TOCK ⏱️

**TOCK** is a real-time activity tracker integrated from ADAM that enables **accurate time estimation** and **token optimization**.

### Quick Setup

Run the automated setup script:

```bash
bash scripts/setup-tock.sh
```

Then enable time tracking:

```bash
source .env.tock
```

You're ready! The time tracking is now active. ✅

### Manual Setup (if needed)

1. **Enable TOCK environment variables** in your `.env.tock`:

```bash
# Path to TOCK binary
export TOCK_BIN="/home/ichigo/alexandria/ADAM/tock/tock"

# Path to activity tracking file (gemini-cli specific)
export TOCK_FILE="/home/ichigo/alexandria/ADAM/digital-twin-data/gemini-cli-activities.txt"

# Enable time tracking in Claude Code
export TOCK_ENABLED=true
```

2. **Create gemini-cli activities file** (first time only):

```bash
touch /home/ichigo/alexandria/ADAM/digital-twin-data/gemini-cli-activities.txt
source .env.tock
```

### Usage During Development

**Start tracking when you begin work:**
```bash
${TOCK_BIN} -f ${TOCK_FILE} start -p "gemini-cli" -d "Build and test core package"
```

**Stop when finished:**
```bash
${TOCK_BIN} -f ${TOCK_FILE} stop
```

**View current activity:**
```bash
${TOCK_BIN} -f ${TOCK_FILE} current
```

**View today's activities:**
```bash
${TOCK_BIN} -f ${TOCK_FILE} report --today
```

### Why TOCK Matters

- ✅ **Real-time estimates** - Know actual duration instead of guessing "2-3 weeks"
- ✅ **Token optimization** - Adjust token allocation based on real execution time
- ✅ **Faster execution** - Precise time data = smarter planning = fewer wasted tokens
- ✅ **No overhead** - Lightweight plaintext tracking, human-readable logs

### Integration with Claude Code

When Claude Code is aware of TOCK tracking:
1. Estimates are based on actual observed times, not blind guesses
2. Task planning adapts to real execution speed
3. Token usage is optimized per task duration
4. No bloat or unnecessary processing

**Result**: Faster work, lower token cost, accurate planning. 🚀

---

## Development Workflow

### Adding a New Feature

1. **Create an issue** for discussion (or PR linked to existing issue)
2. **Identify which package(s)** are affected:
   - Core logic → modify `packages/core`
   - CLI/UI logic → modify `packages/cli`
   - Both → update both and ensure proper interface contracts
3. **Write/update tests** alongside your code
4. **Run preflight checks**:
   ```bash
   npm run preflight
   ```
5. **Create a focused PR** with clear description linking the issue

### Debugging

**VS Code Debugging**:
```bash
# Start debug mode (pauses at startup)
npm run debug

# Or press F5 in VS Code (uses .vscode/launch.json)
```

Then attach debugger via Chrome DevTools (`chrome://inspect`) or VS Code's Attach configuration.

**Environment Setup** (`.env` file):
```
DEBUG=1                    # Enable verbose logging
GEMINI_SANDBOX=docker      # Use Docker for sandboxing
GEMINI_API_KEY=sk-...      # API key for authentication
```

## Build Pipeline & Artifacts

### What Gets Built

```
npm run bundle
  ├── Transpiles TypeScript → JavaScript
  ├── Bundles with esbuild into single entry point
  ├── Generates bundle/gemini.js (executable)
  └── Includes all runtime dependencies and assets
```

### Sandbox Container

The CLI can safely execute user commands in isolated containers:

```bash
npm run build:sandbox    # Builds Docker image from Dockerfile
GEMINI_SANDBOX=docker npm run test:e2e
```

Sandbox modes:
- `GEMINI_SANDBOX=false` - No sandboxing (dev mode)
- `GEMINI_SANDBOX=docker` - Docker-based isolation
- `GEMINI_SANDBOX=podman` - Podman-based isolation
- Default (macOS) - Native Seatbelt sandboxing

## CI/CD Pipeline

Automated workflows in `.github/workflows/`:

- **ci.yml**: Linting, tests, build on every PR/push
- **e2e.yml**: End-to-end integration tests with real API calls
- **docs-page-action.yml**: Auto-generate documentation
- **publish-release.yml**: Automated release to NPM and GitHub

**Release Tags**:
- `latest` - Stable weekly releases (Tuesdays 20:00 UTC)
- `preview` - Weekly preview before stable (Tuesdays 23:59 UTC)
- `nightly` - Daily builds from main branch (00:00 UTC)

## Key Dependencies

| Package | Purpose |
|---|---|
| `@google/genai` | Gemini API SDK |
| `@modelcontextprotocol/sdk` | MCP server protocol |
| `react` + `ink` | Terminal UI rendering |
| `yargs` | CLI argument parsing |
| `vitest` | Testing framework |
| `esbuild` | Bundling and transpiling |
| `typescript` | Type checking |
| `prettier` | Code formatting |
| `eslint` | Linting |

## Common Gotchas & Tips

1. **Mock ordering matters**: Place `vi.mock()` calls at the very top of test files, before other imports
2. **Workspace dependencies**: Packages reference each other via `file:` paths in `package.json` (not npm registry)
3. **Build first**: Always run `npm run build` before `npm run start` after making changes
4. **API key required for integration tests**: Set `GEMINI_API_KEY` to run `npm run test:e2e`
5. **Node version**: Development requires Node.js ~20.19.0 (use nvm to manage); production accepts Node 20+
6. **Sandbox container**: Building takes time; use `GEMINI_SANDBOX=false` for faster local development
7. **Preflight is your friend**: Before submitting PR, always run `npm run preflight` to catch all issues at once

## Documentation Map

| Document | Purpose |
|---|---|
| `README.md` | Project overview, installation, quick start |
| `CONTRIBUTING.md` | Contribution process, PR guidelines, development setup |
| `GEMINI.md` | AI-assisted development conventions (self-awareness, testing, React, Git) |
| `docs/architecture.md` | Deep dive into CLI and Core architecture |
| `docs/cli/commands.md` | All CLI commands and flags |
| `docs/cli/configuration.md` | Configuration options and environment variables |
| `docs/tools/` | Documentation for built-in tools (file system, shell, web, MCP) |
| `docs/integration-tests.md` | Integration testing framework details |

## Release Process

Releases follow a cadence; contributors don't need to manually release:

1. **Commit to main** with conventional commit messages
2. **CI validates** all changes (lint, test, build)
3. **Automated scripts** handle versioning, tagging, and publishing to NPM
4. **Release workflows** publish to `latest`, `preview`, or `nightly` tags

See `docs/releases.md` for detailed release schedule.

---

**Quick Summary**: This is a TypeScript/Node.js monorepo building a Gemini AI CLI. Focus on writing functional, type-safe code; use plain objects over classes; write tests with Vitest; run `npm run preflight` before submitting changes; and always link PRs to existing issues.
