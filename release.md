# Release Strategy for Forkroom

## Versioning Scheme
Forkroom follows [Semantic Versioning (SemVer)](https://semver.org/):
- **MAJOR**: Incompatible API or breaking user experience changes.
- **MINOR**: Backward-compatible functionality additions.
- **PATCH**: Backward-compatible bug fixes.

## Release Process
1. **Validation**: Ensure all unit, integration, and E2E tests are passing.
2. **Changelog**: Append version details into `CHANGELOG.md`.
3. **Tagging**: Create git tag matching `v*.*.*` and push to main.
4. **Automation**: GitHub actions triggers the release workflow, building static assets.
