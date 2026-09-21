# Tagging conventions

## Facets

- **Ecosystem** identifies the technology community or platform a project is
  built for, such as React or Vue.
- **Category** identifies what kind of project it is, such as a test framework
  or state-management library.
- **Capability** identifies what a project enables someone to do, such as test,
  authentication, or AI.
- **Property** identifies a defining characteristic, such as self-hosted.

Leave a tag unfaceted when its role is unresolved. Do not choose a facet merely
to make it eligible for a parent relationship.

## Inheritance and composition

Use a parent relationship only when every project carrying the child must also
belong to the parent. For example, `nextjs -> react` is inheritance because a
Next.js project necessarily belongs to the React ecosystem.

Use direct tags in composition when the concepts are independent. A project may
carry both `automation` and `test`, but neither concept necessarily implies the
other.

A tag has at most one parent. When a compound concept appears to require two
independent parents, prefer direct-tag composition or reconsider the tag rather
than introducing multiple inheritance.

## Valid edges

Parent edges are limited to:

- `ecosystem -> ecosystem`
- `category -> capability`
- `category -> property`

Capabilities and properties cannot be children. Categories cannot be parents.
Unfaceted tags cannot participate in an edge. An edge must not create a direct
or transitive cycle.

## Proposal review

Every facet proposal must cover each existing tag or list it as explicitly
deferred. Separate high-confidence assignments from ambiguous ones. For each
ambiguous tag, state the proposed facet, a plausible alternative, and the reason
for choosing between them. Recommend a rename or split when no facet describes
the tag honestly.

Every parent proposal must include the child and parent codes and facets, the
edge-validity result, evidence that every child-tagged project belongs to the
parent, representative projects, and any counterexamples. State explicitly
when no counterexample was found. A concrete counterexample overrides
convenience; a genuine toss-up may proceed only when none exists.

Call out the expected behavioral impact of an edge. This is especially
important for ancestors such as `ai`, because inherited membership changes
search, counts, rankings, related tags, and deployment exclusions.

Facet assignment alone does not change public filtering. Activating a parent
relationship does and therefore requires a separate rollout.
