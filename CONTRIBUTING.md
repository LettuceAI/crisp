# Contributing

This repository values changes that are easy to review, consistent with the existing design language, and maintainable after merge.

## Community

- If possible, join the project's Discord server and stay aware of what the community is asking for and experiencing.
- Pay attention to recurring pain points, common workflows, and feature requests.
- Do not build only from local assumptions. Use community feedback to guide priorities and validate decisions.

## Commit Messages

- Use Conventional Commits format for commit messages.
- Prefer clear, scoped messages such as:
  `feat: add SecretInput`
  `fix(sheet): keep the scrim under the handle while dragging`
  `refactor: share the choice mark between ChoiceCard and ListRow`
  `docs: describe the Tailwind source setup`
  `chore(release): v0.2.0`

## AI Usage

- AI tools may be used as an assistive tool, but not as a substitute for engineering judgment.
- Contributors must understand the code they submit, be able to explain it, and verify that it is correct.
- Do not submit code produced through vibe coding, blind prompting, or trial-and-error generation without real understanding of the implementation.
- Treat AI output like untrusted code until it has been reviewed and validated properly.
- Do not submit large AI-generated changes that you cannot maintain yourself.

## Before Opening a Pull Request

- Keep the change focused. Do not combine unrelated fixes or refactors in one pull request.
- If the work is large, changes how a widely used component looks, or adds a new component, discuss it first.
- Update every component a token or shared pattern touches, not only the one you started from.
- Run `bun run typecheck`, `bun run lint` and `bun run build` before opening a pull request.
- Include screenshots or a recording for anything visual, on desktop and on a phone-sized layout.

## After Opening a Pull Request

- Expect requests for changes. Review quality and long-term maintainability matter more than getting a feature merged quickly.
- Call out tradeoffs, assumptions, and incomplete areas clearly.
- Keep the branch up to date if the pull request becomes stale.

## Design Guidelines

- Keep the existing design language. Componentize and polish; do not propose a redesign inside a component change.
- Every component works on desktop and on a touch-first phone layout. Navigation and overlays adapt; nothing is mobile-only or desktop-only unless its doc comment says why.
- The bottom sheet (`Sheet`, the app's bottom menu) is the signature overlay. Do not replace it with dialogs or popovers for actions on an item.
- Draw from tokens: `text-fg`, `bg-fill`, `border-line`, the semantic colors, `control-*` heights and the icon size ladder in `icon`. A value that is not a token is a token to add, not a one-off.
- Motion comes from the presets in `motion` (`settle`, `quick`, `sheetIn`, …) and respects `prefers-reduced-motion`.
- Write Tailwind v4 canonical class names; do not introduce v3 spellings.

## Coding Guidelines

- Follow existing patterns before introducing new abstractions.
- Prefer the simplest change that fits the codebase cleanly.
- Avoid broad refactors unless they are necessary for the work being done.
- Keep components focused and reasonably small; compose rather than add modes.
- Write code that is easy to trace during review.
- Add comments only when they explain non-obvious intent. Each component carries a doc comment saying what it is for and when to reach for something else instead.
- Avoid dead code, placeholder code, and temporary local-environment workarounds.
- Every interactive element is reachable by keyboard and has an accessible name; hit areas meet 44px on touch.

## Public API

- Everything ships through `src/index.ts`. Export new components from `src/components/index.ts`; export hooks and helpers from the entry point by name, not with `export *`, so the surface stays deliberate.
- Runtime dependencies stay external. Adding one is a discussion, not a side effect of a feature.
- Breaking a prop is a major release; note it in the pull request so the release notes carry it.

## Releasing

Maintainers run the **Release** workflow with a bump type. It verifies the build, bumps `package.json`, tags `vX.Y.Z`, and creates a GitHub release with generated notes; the **Publish to npm** workflow then builds from the tag and publishes with provenance.
