# Contributing to Rafiq Al-Muslim

Thank you for your interest in contributing to **Rafiq Al-Muslim**!

Rafiq Al-Muslim is an open-source Islamic companion application focused on providing a useful, accessible, and reliable experience for Quran reading, Quran audio, translations, Tafsir, Hadith, prayer times, Qibla, Azkar, and other Islamic tools.

We welcome bug fixes, improvements, documentation updates, accessibility improvements, performance improvements, and new features.

## Before You Start

Please:

1. Search existing issues before opening a new one.
2. For significant feature changes, open an issue first to discuss the idea.
3. Keep pull requests focused on one purpose.
4. Do not include secrets, API keys, tokens, or private credentials.
5. Verify that your changes do not introduce inaccurate or misleading Islamic content.
6. Follow the existing project structure and coding conventions.
7. Test your changes before submitting a pull request.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- A modern web browser

Check your installed versions:

```bash
node -v
npm -v
git --version
```

### Fork the Repository

Fork the repository to your GitHub account and clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/rafiq-almuslim.git
cd rafiq-almuslim
```

Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/hassan9810/rafiq-almuslim.git
```

Verify your remotes:

```bash
git remote -v
```

### Install Dependencies

Install the project dependencies:

```bash
npm install
```

### Start the Development Server

Start the development server using the project's configured command:

```bash
npm run dev
```

The application will be available at the local URL shown in your terminal.

## Development Workflow

Before starting work, make sure your local repository is up to date:

```bash
git checkout main
git pull upstream main
```

Create a dedicated branch for your change:

```bash
git checkout -b feature/your-feature-name
```

Make your changes and test them locally.

Check the current status:

```bash
git status
```

Review your changes:

```bash
git diff
```

Run the project's available validation commands before submitting your contribution.

For example:

```bash
npm run build
```

If the project provides linting or testing commands, run those as well.

## Branch Naming

Use clear and descriptive branch names.

### Features

```text
feature/quran-bookmarks
feature/quran-search
feature/qibla-improvements
feature/hadith-search
feature/audio-player
```

### Bug Fixes

```text
fix/prayer-time-calculation
fix/audio-playback
fix/quran-rendering
fix/mobile-navigation
```

### Performance

```text
perf/quran-page
perf/search-results
perf/audio-loading
```

### Documentation

```text
docs/update-readme
docs/contributing-guide
docs/api-documentation
```

### Refactoring

```text
refactor/quran-service
refactor/audio-player
refactor/search
```

Keep branch names short, descriptive, and related to the actual change.

## Commit Messages

Use clear and concise commit messages.

The following prefixes are recommended:

```text
feat:
fix:
docs:
refactor:
perf:
test:
chore:
style:
```

Examples:

```text
feat: add Quran bookmarks
fix: resolve Quran audio playback issue
fix: correct prayer time display
docs: update installation instructions
refactor: improve Quran search service
perf: optimize Quran page rendering
chore: update dependencies
```

Avoid vague commit messages such as:

```text
update
changes
fix stuff
new changes
final
final final
```

A commit message should clearly describe what was changed.

## Pull Requests

Before opening a Pull Request, make sure:

- The project builds successfully.
- The affected functionality has been tested.
- Your branch contains only relevant changes.
- No secrets or credentials are included.
- Documentation has been updated when necessary.
- Islamic content has been verified when applicable.

### Pull Request Description

A good Pull Request should explain:

1. What was changed.
2. Why the change was needed.
3. How the change was implemented.
4. How it was tested.
5. Any known limitations or follow-up work.

For UI changes, include screenshots or screen recordings when useful.

### Keep Pull Requests Focused

Prefer small, focused Pull Requests.

Avoid combining unrelated changes such as:

```text
Add Qibla feature
+
Redesign Quran page
+
Refactor audio player
+
Update dependencies
+
Rewrite README
```

Instead, create separate Pull Requests for unrelated changes.

Focused Pull Requests are easier to review, test, and maintain.

## Islamic Content Accuracy

Rafiq Al-Muslim deals with Quranic, Hadith, Tafsir, Azkar, and other Islamic content.

Because accuracy is especially important in this area, contributors should take additional care when adding or modifying religious content.

### Quran

When working with Quranic text:

- Preserve the original Arabic text accurately.
- Do not modify Quran text without strong justification.
- Verify changes against a reliable and recognized source.
- Be especially careful with Arabic characters, diacritics, verse numbers, and formatting.
- Do not introduce accidental typographical changes.
- Test rendering in both desktop and mobile layouts.

### Translations

When working with translations:

- Clearly identify the translation source.
- Preserve attribution where required.
- Do not present an unofficial translation as an authoritative source.
- Avoid changing established translations without documenting the reason.

### Tafsir

When working with Tafsir:

- Preserve the original source and attribution.
- Do not merge personal interpretation into source material.
- Clearly distinguish between source content and application-generated explanations.

### Hadith

When adding Hadith content:

- Use reliable and appropriately attributed sources.
- Preserve collection and reference information.
- Do not fabricate or alter Hadith text.
- Avoid presenting uncertain information as definitively authentic.
- Preserve grading or classification information when available from the source.

### Azkar and Other Islamic Content

When adding Azkar, supplications, or other religious content:

- Use a reliable source.
- Preserve the original Arabic text.
- Include source or reference information when available.
- Avoid adding unverified claims about religious rewards or authenticity.

### General Principle

When you are unsure about the accuracy or source of religious content, do not guess.

Document the source and discuss the change through an issue or Pull Request before adding it.

## External APIs and Data Sources

Rafiq Al-Muslim may use external APIs, datasets, audio providers, Quran resources, Hadith resources, prayer-time services, or other third-party services.

When adding or modifying an external data source:

- Document the source when appropriate.
- Follow the provider's terms of use.
- Follow applicable licensing requirements.
- Preserve required attribution.
- Do not expose API keys or private credentials.
- Handle API failures gracefully.
- Avoid unnecessary API requests.
- Respect rate limits.
- Provide sensible fallback behavior when possible.

### API Keys and Secrets

Never commit secrets directly into the repository.

Do not add:

```text
API_KEY=actual-secret
SECRET_KEY=actual-secret
ACCESS_TOKEN=actual-token
PASSWORD=actual-password
```

Use environment variables or the project's established configuration mechanism instead.

If you accidentally expose a secret, revoke or rotate it immediately.

## UI, Accessibility, and Localization

Rafiq Al-Muslim is intended to support users across different devices and languages.

Contributions should preserve:

- Responsive design.
- Mobile usability.
- Desktop usability.
- Arabic RTL support.
- English LTR support.
- Keyboard accessibility.
- Appropriate color contrast.
- Readable typography.
- Touch-friendly controls.
- Clear navigation.
- Consistent spacing and visual hierarchy.

### Arabic and RTL

When modifying UI components that contain Arabic content:

- Test the interface in RTL mode.
- Check text alignment.
- Check icons and directional controls.
- Verify navigation behavior.
- Make sure Arabic text does not overlap other UI elements.
- Test different screen sizes.

### English and LTR

Changes should also be tested in English LTR mode when the affected component supports both languages.

Avoid hardcoding layout assumptions that only work in one direction.

## Quran Text and Typography

Quran text requires particular attention to rendering quality.

When modifying Quran-related components:

- Test Arabic shaping.
- Test diacritics.
- Check verse boundaries.
- Check verse numbers.
- Check line wrapping.
- Test different font sizes.
- Test mobile and desktop layouts.
- Ensure translations remain visually separated from Quran text.
- Avoid introducing visual overlap between Arabic and translated content.

If a change affects Quran rendering, screenshots are strongly recommended in the Pull Request.

## Audio

When modifying Quran audio or other audio functionality:

- Test playback.
- Test pause and resume.
- Test seeking where supported.
- Test changing reciters.
- Test different Surahs.
- Handle unavailable audio resources gracefully.
- Avoid unnecessary audio downloads.
- Test behavior on mobile devices where possible.

If an external audio provider is used, verify that the implementation follows its usage and licensing requirements.

## Prayer Times and Location-Based Features

When working on prayer times, Qibla, or location-related features:

- Clearly distinguish calculated values from externally provided values.
- Test different locations and time zones where applicable.
- Consider daylight-saving behavior where relevant.
- Handle unavailable location permissions gracefully.
- Never assume a user's location when it has not been provided.
- Avoid exposing or storing unnecessary location information.

## Performance

Performance improvements are welcome, especially for frequently used features such as:

- Quran reading.
- Quran search.
- Audio playback.
- Hadith search.
- Large lists.
- Navigation.
- Initial application loading.

When optimizing performance:

- Measure before and after when possible.
- Avoid premature optimization.
- Avoid unnecessary re-renders.
- Avoid unnecessary API requests.
- Avoid loading large resources when they are not needed.
- Preserve existing functionality while improving performance.

Do not sacrifice correctness, accessibility, or reliability for small performance gains.

## Reporting Bugs

If you find a bug, first search the existing issues to make sure it has not already been reported.

When reporting a bug, include:

- A clear description.
- Steps to reproduce the problem.
- Expected behavior.
- Actual behavior.
- Device information.
- Operating system.
- Browser and version.
- App version or commit when relevant.
- Screenshots or recordings when useful.

A good bug report should allow another developer to reproduce the problem.

### Example

```text
Title:
[Bug]: Quran audio stops after changing Surah

Steps:
1. Open the Quran reader.
2. Start playing a Surah.
3. Navigate to another Surah.
4. Start playback.

Expected:
The new Surah should begin playing.

Actual:
Audio stops and does not start again.

Environment:
Browser: Chrome
OS: Windows 11
Device: Desktop
```

## Feature Requests

Feature requests are welcome.

Before requesting a feature, search existing issues to make sure the idea has not already been proposed.

A useful feature request should explain:

### The Problem

What problem are users experiencing?

### The Proposed Solution

What should Rafiq Al-Muslim do differently?

### User Benefit

How would the feature improve the experience?

### Alternatives Considered

What alternative solutions or workarounds have been considered?

For large or architectural features, please open an issue before implementing the feature so the approach can be discussed.

## Code Style and Quality

Follow the existing coding conventions of the project.

When contributing:

- Prefer readable and maintainable code.
- Keep functions focused.
- Avoid unnecessary duplication.
- Reuse existing utilities and components when appropriate.
- Avoid unnecessary dependencies.
- Keep naming descriptive.
- Remove unused code and imports.
- Avoid unrelated refactoring.
- Add comments when they explain non-obvious decisions rather than obvious code.

Do not rewrite existing code simply because you prefer a different style unless the change is relevant to the contribution.

## Dependencies

Before adding a new dependency:

1. Check whether the functionality can be implemented using existing dependencies.
2. Consider the dependency's maintenance status.
3. Review its license.
4. Consider its bundle size and performance impact.
5. Check for known security issues.
6. Make sure the dependency is necessary.

Avoid adding dependencies for small functionality that can reasonably be implemented without them.

## Testing

Test the affected functionality before opening a Pull Request.

Depending on the change, testing may include:

- Desktop browser testing.
- Mobile browser testing.
- Arabic RTL testing.
- English LTR testing.
- Different screen sizes.
- Different browsers.
- Audio playback.
- Network failure scenarios.
- API failure scenarios.
- Permission-denied scenarios.
- Empty states.
- Loading states.
- Error states.

For UI changes, include screenshots when they help reviewers understand the change.

## Documentation

If your contribution changes how users or developers interact with the project, update the relevant documentation.

Examples include:

- README changes.
- Installation instructions.
- Configuration instructions.
- API documentation.
- Feature documentation.
- Development instructions.

Documentation should remain accurate and consistent with the current implementation.

## Security

Never commit:

- API keys.
- Access tokens.
- Passwords.
- Private keys.
- Database credentials.
- Personal information.
- Other sensitive configuration.

For security vulnerabilities, please follow the instructions in [`SECURITY.md`](SECURITY.md) rather than creating a public issue.

## Questions and Discussions

If you are unsure about an implementation approach, open an issue or discussion before making a large change.

For significant changes, it is better to discuss the approach first than to spend time implementing something that may not fit the project's direction.

When asking for help, provide enough context for others to understand:

- What you are trying to accomplish.
- What you have already tried.
- What you expected to happen.
- What actually happened.
- Relevant error messages or screenshots.

## Respectful Collaboration

Contributors are expected to communicate respectfully and constructively.

Please:

- Be respectful of other contributors.
- Focus criticism on the code or proposal, not the person.
- Assume good intentions.
- Provide constructive feedback.
- Be open to alternative approaches.
- Keep discussions focused on improving the project.

## Thank You

Thank you for taking the time to contribute to **Rafiq Al-Muslim**.

Whether you are fixing a bug, improving the Quran reading experience, adding a feature, improving accessibility, fixing documentation, or helping with performance, every meaningful contribution helps make the project better for its users.

We appreciate your contribution! 🤍
