# Tagging decisions

Record non-obvious accepted and rejected taxonomy decisions here. Routine facet
assignments belong in the generated catalog rather than this log.

## `ai` is a capability

**Accepted:** Assign `ai` the `capability` facet.

`ai` describes functionality a project provides rather than its implementation
ecosystem or delivery category. It remains the stable exclusion anchor for the
`noai` deployment described in [the No AI edition](../features/noai-app.md).
Changing its meaning would alter which projects that deployment surfaces.

## `ai` covers the AI ecosystem

**Accepted:** Widen `ai` from "built-in AI/LLM integrations" to projects that
build, run, or extend AI systems, including protocols and extensions for AI
assistants.

The `noai` deployment should hide the whole AI ecosystem, not only projects
that call a model. MCP servers and agent skills extend AI systems without
shipping an LLM integration of their own, so the narrow definition let them
through. This is the deliberate change of meaning the previous entry warns
about.

Specialized AI tags reach the deployment through parent edges rather than a
longer list of excluded tags: the `noai` deployment keeps excluding `ai` only,
and every specialized AI tag has `ai` as its parent.

## `mcp` is a category

**Accepted:** Move `mcp` from `ecosystem` to `category`, with `ai` as its
parent.

MCP servers, clients, and SDKs form a recognizable project family rather than a
platform projects are built for. As an ecosystem, `mcp` could not have a
capability parent. With the wider `ai` meaning, every MCP project belongs to
the AI ecosystem, including those that ship no AI features of their own, such
as `mcp-ui`.

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

## Technical dependency is decided case by case

**Accepted:** "Built on top of" does not by itself justify a parent
relationship. Each such pair is discussed individually, weighing how the
community and the catalog treat the two tags and what users expect to find
under the parent.

- **Not now: `react-native -> react`.** React Native uses React, but it is
  widely seen as its own ecosystem, and the catalog agrees: only 5 of 73 React
  Native projects carry `react`. Inheriting would add 68 mobile-only projects
  to React pages and rankings. Projects that support both carry both tags
  directly. Revisit if expectations change.
- **Proposed: `nextjs -> react`.** Next.js projects are React web projects, so
  they match what users expect under React.
