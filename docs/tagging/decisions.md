# Tagging decisions

Record non-obvious accepted and rejected taxonomy decisions here. Routine facet
assignments belong in the generated catalog rather than this log.

## `ai` is a capability

**Accepted:** Assign `ai` the `capability` facet.

`ai` describes functionality a project provides rather than its implementation
ecosystem or delivery category. It remains the stable exclusion anchor for the
`noai` deployment described in [the No AI edition](../features/noai-app.md).
Changing its meaning would alter which projects that deployment surfaces.

## Categories describe project landscapes

**Accepted:** A category represents a coherent project landscape or
recognizable project family. Projects may carry multiple categories when they
have multiple meaningful identities.

Being broad enough to support comparison or a yearly ranking is a strong signal
for a top-level category. It is not a strict threshold: a niche can remain a
narrower category beneath a broader one.

`test`, `test-framework`, `chart`, and `fullstack` are categories under this
definition. `test` represents the broad Testing landscape, while
`test-framework` represents a narrower project family.

## Categories may inherit from categories

**Accepted:** Allow `category -> category` parent relationships when the child
is a strict subset of the parent.

The earlier rule treated all categories as leaves and allowed them to inherit
only from capabilities or properties. That restriction conflated a tag's role
with its position in the hierarchy and prevented valid relationships such as
`test-framework -> test`. Categories may now form broad-to-narrow hierarchies;
the single-parent, strict-subset, and no-cycle rules still apply.

## `design-system` is a capability

**Accepted:** Assign `design-system` the `capability` facet.

For Best of JS, the tag means support for building or providing a design
system. Best of JS does not catalog design-system definitions as a standalone
project landscape, so the tag cuts across project categories such as component
libraries and build tools.

## Initial parent examples

These decisions establish the subset test used during proposal review. They do
not activate parent relationships in production.

- **Accept `nextjs -> react`:** Next.js is built on React, so membership in the
  Next.js ecosystem necessarily implies membership in the React ecosystem.
- **Accept `test-framework -> test`:** Every testing framework belongs to the
  broader Testing category.
- **Reject `redux -> react`:** Redux can be used independently of React, which
  is a concrete counterexample to subset inheritance.
- **Reject `automation -> test`:** Automation includes workflows unrelated to
  testing. Projects that automate deployment or business processes are
  counterexamples.
- **Reject `baas -> self-hosted`:** A backend-as-a-service may be hosted only by
  its provider, so the category does not necessarily have the self-hosted
  property.
