<div align="center">

# 🤖 AI Prompts

**Your one-stop collection of frequently used prompts for AI interactions**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![npm version](https://img.shields.io/badge/version-2.1.0-blue)](https://github.com/kud/ai-prompts)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/kud/ai-prompts/pulls)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/kud/ai-prompts)

[Features](#-features) •
[Installation](#-installation) •
[Usage](#-usage) •
[Available Prompts](#-available-prompts) •
[Contributing](#-contributing)

</div>

---

## 📋 Overview

AI Prompts is a curated compilation of **32 powerful prompts** designed for seamless AI interactions. Currently optimized for **Raycast** and **Espanso**, with support for more platforms coming soon.

## ✨ Features

- 🎯 **32+ Ready-to-Use Prompts** - From code review to creative writing
- 🚀 **Raycast Integration** - Fully optimized for Raycast AI
- ⚡ **Espanso Integration** - Lightning-fast text expansion with `??ai.` triggers
- 🧪 **Well Tested** - Comprehensive test suite with Vitest
- 📝 **Type Safe** - JSDoc annotations for better IDE support
- 🎨 **Linting & Formatting** - ESLint and Prettier configured
- 🌍 **Community Driven** - Open for contributions and improvements

## 🚀 Installation

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Quick Start

```bash
# Clone the repository
git clone https://github.com/kud/ai-prompts.git

# Navigate to directory
cd ai-prompts

# Install dependencies
npm install

# Build the prompts
npm run build
```

## 💻 Usage

### 🎯 Raycast

1. Build the prompts with `npm run build`
2. Import the JSON files from `dist/raycast/` into Raycast
3. Use the prompts directly in Raycast AI

### ⚡ Espanso

1. **Install Espanso** (if not already installed)

   ```bash
   # Visit https://espanso.org/install/ for installation instructions
   ```

2. **Copy AI Prompts configuration**

   ```bash
   npm run build
   cp dist/espanso/index.yml ~/.config/espanso/match/ai-prompts.yml
   ```

3. **Restart Espanso**

   ```bash
   espanso restart
   ```

4. **Start using prompts**
   - Type `??ai.` followed by the prompt name
   - Example: `??ai.fix-spelling-and-grammar`
   - All triggers use the format: `??ai.<prompt-name>`

## 📚 Available Prompts

<details>
<summary><b>📝 Writing & Communication (9 prompts)</b></summary>

- `fix-spelling-and-grammar` - Correct spelling, grammar, and punctuation
- `improve-writing` - Enhance overall writing quality
- `write-10-alternatives` - Generate 10 alternative phrasings
- `write-speech-notes` - Create structured speech notes
- `tl-dr` - Summarize text concisely
- `summarize-and-sympathise-text` - Summarize with empathetic tone
- `explain-this-in-english-and-translate-it` - Explain and translate content
- `ask-question` - Generate insightful questions
- `ask-for-reviews` - Request feedback professionally

</details>

<details>
<summary><b>🎭 Tone Adjustments (10 prompts)</b></summary>

- `change-tone-to-polite` - Convert to polite tone
- `change-tone-to-optimistic` - Make text more optimistic
- `change-tone-to-question` - Rephrase as questions
- `change-tone-to-i` - Change perspective to first person
- `change-tone-to-posh` - Elevate to sophisticated language
- `change-tone-to-royal` - Transform to royal/formal style
- `change-tone-to-slang` - Convert to casual slang
- `change-tone-to-vulgar` - Make text more informal/crude
- `change-tone-to-politically-correct` - Adjust to PC language
- `answer-with-neutral` - Provide neutral responses

</details>

<details>
<summary><b>💻 Development & Code (3 prompts)</b></summary>

- `find-bugs-in-code` - Identify and fix code issues
- `act-as-a-skilled-software-engineer` - Expert software engineering advice
- `generate-gh-issue-command` - Create GitHub issue commands

</details>

<details>
<summary><b>🎨 Creative & Productivity (6 prompts)</b></summary>

- `add-relevant-emoji-prefix` - Add emojis at the start
- `add-relevant-emoji-suffix` - Add emojis at the end
- `generate-ical` - Create iCalendar events
- `generate-lunch-poll` - Create lunch poll options
- `prompt-generator` - Generate AI prompts
- `anwser-with-small-talk` - Respond with casual conversation

</details>

<details>
<summary><b>🤝 Role Play & Discussion (4 prompts)</b></summary>

- `act-as-a-debater` - Argue multiple perspectives
- `act-as-a-judge` - Provide balanced judgments
- `debate-topic` - Facilitate structured debates
- `what-s-your-role` - Clarify AI role and capabilities

</details>

## 🛠️ Development

```bash
# Run in development mode (auto-rebuild on changes)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🤝 Contributing

We believe in the power of community! Contributions are welcome and appreciated.

### How to Contribute

1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/amazing-prompt`)
3. **Add** your prompt as a YAML file in `prompts/`
4. **Test** your changes (`npm test`)
5. **Commit** your changes (`git commit -m 'feat: add amazing prompt'`)
6. **Push** to the branch (`git push origin feature/amazing-prompt`)
7. **Open** a Pull Request

### Prompt YAML Schema

```yaml
title: Your Prompt Title
prompt: |
  Your prompt text here
  Use {argument name=variable} for user inputs
  Use {selection} for selected text
creativity: low|medium|high
icon: stars
model: raycast-auto
```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/config changes

## 🗺️ Roadmap

- [ ] GitHub Actions CI/CD pipeline
- [ ] Additional platform integrations (Alfred, Keyboard Maestro)
- [ ] Prompt categorization and tagging system
- [ ] Interactive prompt builder
- [ ] Community prompt ratings
- [ ] Prompt analytics and usage stats
- [ ] Multi-language support

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details

## 🙏 Support

If you find this project helpful:

- ⭐ Star the repository
- 🐛 Report bugs via [issues](https://github.com/kud/ai-prompts/issues)
- 💡 Suggest new prompts or features
- 🤝 Contribute with pull requests

---

<div align="center">
Made with ❤️ by the community
</div>
