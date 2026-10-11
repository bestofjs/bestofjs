# Tagging terminology

## Direct tag

A tag explicitly assigned to a project by a curator and stored in the
project-to-tag relationship. Direct tags record curator intent.

## Effective tag

A direct tag or any ancestor implied by one of the project's direct tags.
Public filtering and other tag-aware reads generally use effective tags.

## Facet

The role a tag plays in the taxonomy. A tag may have one of four facets:
`ecosystem`, `category`, `capability`, or `property`. A tag without a facet is
intentionally or temporarily unfaceted.

## Category

A tag for a coherent project landscape or recognizable project family. A
project may have multiple category identities, and a narrower category may be
a strict subset of a broader category.

## Capability

A tag for functionality that cuts across otherwise different project
categories. A capability describes what a project supports or enables rather
than the project landscape it belongs to.

## Parent relationship

A directed relationship from a child tag to at most one parent tag. It asserts
that every project carrying the child also belongs to the parent. The
relationship expresses a strict subset, not similarity or frequent
co-occurrence.

## Catalog

The deterministic, Git-tracked snapshot of tags and projects generated from the
database. It is evidence for offline review, not the source of curated state.
