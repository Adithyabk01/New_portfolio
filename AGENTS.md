<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All portfolio content lives in `src/data/content.ts`; components only render it (single editable source).
- The 3D scene reads mutable `scrollState`/`settings` from `src/lib/store.ts` per frame instead of React state, to avoid re-renders in the render loop.
- Calm mode (user toggle, else system prefers-reduced-motion) swaps 3D for the 2D canvas background and disables smooth scroll and custom cursor.
