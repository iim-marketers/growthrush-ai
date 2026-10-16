@AGENTS.md

# Database conventions

- When a table stores a reference id to another record that has a human-readable name or title (a user, business, plan, etc.), also store that label in a column next to the id, e.g. `plan_id` + `plan_name`. Users have no name, so store `user_phone` alongside `user_id`.
- Write the label wherever the id is written. If it is a point-in-time record (an order, a purchase), keep the label as it was at that moment.
