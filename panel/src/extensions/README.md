# CPXXP panel extensions

New CPXXP-only features should be implemented as isolated components and registered in
`registry.tsx`. Available slots cover header actions, the lower server sidebar, and the
areas immediately before and after routed page content.

This keeps feature code out of txAdmin's upstream components, reducing conflicts when a
new txAdmin release is merged. An extension may use the existing hooks, API helpers and
permission checks, but it must not bypass txAdmin authorization.
