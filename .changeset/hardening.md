---
'react-feedback-stars': patch
---

Add a roving tabindex so an unrated group is a single tab stop. Browsers only
collapse a radio group once a radio is checked, so a `precision={0.5}` rating
with no value previously cost keyboard users ten tab stops.
