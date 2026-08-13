/** The persistent night field behind product workspaces — flat, matching
 * the đèn pin prototype's plain canvas rather than an ambient glow wash. */
export function WorkspaceBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-background" />
  );
}
