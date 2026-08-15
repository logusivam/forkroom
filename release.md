# Release Strategy for Forkroom

## Versioning Scheme
Forkroom follows [Semantic Versioning (SemVer)](https://semver.org/):
- **MAJOR**: Incompatible API or breaking user experience changes.
- **MINOR**: Backward-compatible functionality additions.
- **PATCH**: Backward-compatible bug fixes.

## Release Process
1. **Automation**: Upon push or merge to the `main` branch, the `Release` workflow automatically executes.
2. **Version Bump**: The workflow runs `standard-version` which analyzes the Conventional Commits since the last release to determine the next SemVer version.
3. **Changelog**: `CHANGELOG.md` is automatically updated with the list of changes (features, bug fixes, chore, etc.).
4. **Git Updates**: The bumped version in `package.json` and the updated `CHANGELOG.md` are committed and pushed back to the `main` branch with the new version tag.
5. **GitHub Release**: A GitHub Release matching the tag is published automatically.
