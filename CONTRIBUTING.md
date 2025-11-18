# Contributing to AI Prompts

First off, thank you for considering contributing to AI Prompts! It's people like you that make this project such a great tool for the community.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected to see**
- **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how this enhancement would be used**

### Adding New Prompts

We love new prompts! Here's how to add one:

1. **Fork the repository**

2. **Create a new YAML file** in `prompts/` following this naming convention:

   - Use lowercase
   - Separate words with hyphens
   - Be descriptive but concise
   - Example: `fix-spelling-and-grammar.yml`

3. **Follow the YAML schema**:

```yaml
title: Your Prompt Title
prompt: |
  Your prompt text here.

  You can use {argument name=variable} for user inputs.
  You can use {argument name=variable default="default value"} for optional inputs.
  Use {selection} for selected text (Raycast only).

  Be clear and specific in your instructions.
creativity: low|medium|high
icon: stars
model: raycast-auto
```

4. **Test your prompt**:

```bash
npm run build
npm test
```

5. **Commit your changes** using conventional commits:

```bash
git commit -m "feat: add [prompt-name] prompt"
```

6. **Push to your fork** and submit a pull request

### Pull Request Guidelines

- **Keep changes focused** - one feature per PR
- **Follow the existing code style** - run `npm run format` before committing
- **Add tests if applicable**
- **Update documentation** if you're adding new features
- **Use conventional commit messages**:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for test additions/changes
  - `chore:` for maintenance tasks

### Prompt Quality Guidelines

When creating prompts, ensure they:

1. **Are Clear and Specific**

   - Avoid ambiguous instructions
   - Be explicit about what you want the AI to do
   - Include examples when helpful

2. **Are Reusable**

   - Work across different contexts
   - Use placeholders for variable content
   - Avoid overly specific scenarios

3. **Are Well-Documented**

   - Title clearly describes the purpose
   - Prompt text includes context and instructions
   - Use appropriate creativity level

4. **Follow Ethical Guidelines**
   - Don't promote harmful content
   - Respect copyright and intellectual property
   - Be inclusive and respectful

### Creativity Levels

Choose the appropriate creativity level:

- `low` - For factual, deterministic tasks (grammar fixes, translations)
- `medium` - For balanced creative/factual tasks (summarization, explanations)
- `high` - For creative tasks (brainstorming, creative writing)

## 💻 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-prompts.git

# Navigate to directory
cd ai-prompts

# Install dependencies
npm install

# Run development mode (auto-rebuild)
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- **Be respectful** and considerate in your communication
- **Be collaborative** and open to feedback
- **Focus on what is best** for the community
- **Show empathy** towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Publishing others' private information
- Other conduct that could be considered inappropriate

## 🤔 Questions?

Feel free to open an issue with your question, or reach out to the maintainers directly.

## 🙏 Thank You!

Your contributions are what make the open-source community an amazing place to learn, inspire, and create. We truly appreciate your help!

---

**Happy Contributing!** 🎉
