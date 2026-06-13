# Task List - Web App Profile Layout Restructuring

- `[x]` Step 1: Restructure profile cover/avatar card layout in `index.html` with responsive split classes
- `[x]` Step 2: Move action buttons block (`#profile-action-buttons`) to the top card and rename custom button to "Złóż zamówienie"
- `[x]` Step 3: Remove duplicate action buttons block from the bottom of the screen section
- `[x]` Step 4: Add Tip Modal markup (`#modal-tip`) with 5 PLN preset and "Stałe wsparcie" toggle in `index.html`
- `[x]` Step 5: Implement paint bubbles animation script and CSS animations
- `[x]` Step 6: Implement Follow/Tip script controllers and active toggling logic (including monthly support)
- `[x]` Step 7: Update profile view loaders (`openCreatorProfileSim` & `openOwnProfile`) to toggle follow/tip states
- `[x]` Step 8: Fix layout overlap of name and action buttons onto the background cover image (napisy są na nim)
  - `[x]` Remove `-mt-14` from the outer profile card details row container
  - `[x]` Add `-mt-14 md:-mt-16` strictly to the avatar wrapper div block
- `[x]` Step 9: Remove avatar crop shape buttons from the main profile header section
- `[x]` Step 10: Relocate the avatar crop shape configurator to the Edit Profile settings modal (`#modal-edit-profile`)
  - `[x]` Implement a Status Premium simulation toggle switch
  - `[x]` Build the interactive avatar shape selector in the Edit Profile modal (tab "Dane profilu")
  - `[x]` Implement interactive lock overlay for standard users with upgrade notification prompts
  - `[x]` Persist selected custom shape and premium status in `STATE.currentUser` and apply upon save or creator view
- `[x]` Step 11: Move the "O mnie" (About Me) tab section to the main profile page
  - `[x]` Replace the "Przyjmuję zlecenia custom" availability banner with the new "O mnie" profile details card (Bio + Specialization Tags + Reviews)
  - `[x]` Remove the "O mnie" subtab button from the navigation bar (reducing to 5 tabs)
  - `[x]` Remove the redundant old `#profile-subtab-about` container block from HTML
  - `[x]` Add a quick "Edytuj" button to the "O mnie" header, visible only for own profile, to open the edit modal
  - `[x]` Clean up all JS references to the availability banner, exclusions text, and the obsolete tab to avoid runtime exceptions
- `[x]` Step 12: Split the top profile header card into two responsive columns (Left: Info, Right: Offering & Actions)
  - `[x]` Left side: Keep avatar (partially overlapping banner cover), badges, location (city), name, and details
  - `[x]` Right side top: Add "Zakres oferty" card displaying up to 5 custom bullet points of creator offerings
  - `[x]` Right side bottom: Move contact / order CTA action buttons
  - `[x]` Edit Profile Modal: Add 5 customizable text inputs for the user to edit their offering bullet points
  - `[x]` Dynamic State: Save and persist offering list in `STATE` and dynamically render it on profile loading
- `[x]` Step 13: Split the main top card into two completely separate cards (floats) styled like other item tiles, separated by spacing
- `[x]` Step 14: Place the "Wiadomość" and "Złóż zamówienie" CTA buttons side-by-side (obok siebie) instead of stacked, and style them to fit elegantly inside the right-hand card
- `[x]` Step 15: Add ability to open creator profiles from cooperation card headers in the Discover tab
- `[x]` Step 16: Implement "Zlecenie" (Commission/Order) listing type in the B2 Cooperation modal, enabling both creators and regular users to post it, with dynamic label toggles, card badges, own profile tabs, and chat headers
- `[x]` Step 17: Verify all changes manually and update walkthrough
- `[x]` Step 18: Restrict the saved wishlist section ("Zapisane") to be private to the logged-in user, adding lock icons and privacy badges in both the profile tab and the global saved lists modal.
- `[x]` Step 19: Modify the hover interaction on creator profiles inside the cooperation proposals list to remove text underlining and implement a pop/scale-up effect on the avatar and name.
- `[x]` Step 20: Prevent cooperation settings manipulation on other creators' profiles by conditionally hiding matching settings panels, checklists, and own edit controls, and displaying a read-only list with a "Skontaktuj się" CTA instead.
- `[x]` Step 21: Redesign the cooperation listings display under the profile tab as beautiful, vertical cards/tiles in a responsive grid matching the Discover feed styling, using the 150-character truncated preview.
- `[x]` Step 22: Update the truncation limit in Discover/Odkrywaj feed to 150 characters and expand database mock descriptions (Anna Kowalska, Marek Zieliński) to test it.
- `[x]` Step 23: Implement a details modal popup (#modal-coop-detail) modeled after the order form layout (responsive bottom drawer on mobile, centered on desktop, scrollable up to 90vh) to present full cooperation details.
- `[x]` Step 24: Fix cooperation settings leakage and prevent editing someone else's listings by validating listing ownership (`coop.creator === STATE.currentUser.name`) in details modal.
- `[x]` Step 25: Display the cooperation listings section for other users as a centered bubble/modal popup (`#modal-coop-profile-section`) over a blurred background of the rest of the profile, hiding settings panels.
- `[x]` Step 26: Truncate explore feed cooperation card descriptions to 150 characters and make cards clickable to open the centered detail modal popup, removing inline description expansion.
- `[x]` Step 27: Enforce 150-character truncation on all preview cards across the profile cooperation tab and profile listings modal (`openCoopProfileSectionModal`), so the full description is only shown inside `#modal-coop-detail`.
- `[x]` Step 28: Fix the undefined `count` variable in `renderProfileCooperationTab` that caused runtime javascript crashes when viewing profile cooperation lists.
- `[x]` Step 29: Position active tabs at the left edge (pl-0) and use a straight vertical left border for the first tab and rounded concave flares for other transitions. Fixed CSS calc syntax error and implemented a 1px vertical overlap to eliminate subpixel rendering gaps.







