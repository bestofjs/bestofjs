# Tagging decisions

Record non-obvious accepted and rejected taxonomy decisions here. Routine facet
assignments belong in the generated catalog rather than this log.

## `ai` is a capability

**Accepted:** Assign `ai` the `capability` facet.

`ai` describes functionality a project provides rather than its implementation
ecosystem or delivery category. It remains the stable exclusion anchor for the
`noai` deployment described in [the No AI edition](../features/noai-app.md).
Changing its meaning would alter which projects that deployment surfaces.

## Initial parent examples

These decisions establish the subset test used during proposal review. They do
not activate parent relationships in production.

- **Accept `nextjs -> react`:** Next.js is built on React, so membership in the
  Next.js ecosystem necessarily implies membership in the React ecosystem.
- **Accept `assertion -> test`:** Assertion libraries exist to express and
  evaluate test expectations, so the category necessarily provides the test
  capability.
- **Reject `redux -> react`:** Redux can be used independently of React, which
  is a concrete counterexample to subset inheritance.
- **Reject `automation -> test`:** Automation includes workflows unrelated to
  testing. Projects that automate deployment or business processes are
  counterexamples.
- **Reject `baas -> self-hosted`:** A backend-as-a-service may be hosted only by
  its provider, so the category does not necessarily have the self-hosted
  property.
