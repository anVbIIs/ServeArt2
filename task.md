# Tasks - Supabase Auth Integration

- `[x]` Step 1: Create `supabase-auth-sync.js` with signUp, signIn, signOut, and session listener functions
- `[x]` Step 2: Add HTML/CSS markup for `#modal-auth` (Logowanie / Rejestracja) in `index.html`
- `[x]` Step 3: Implement client-side password validation (uppercase, lowercase, number, special char, min 8 chars) and password confirmation in `#modal-auth`
- `[x]` Step 4: Implement guest check helper `requireAuth(actionCallback)` and integrate it into:
  - Wishlist/Save actions (`toggleSavedItem`)
  - Custom order commissions (`openCommissionModal`)
  - Community posting (`submitCommunityPost`) and commenting (`submitComment`)
  - Tab switching (`switchTab`) for "Dodaj", "Wiadomości", and own "Profil"
- `[x]` Step 5: Add a "Wyloguj się" (Log out) button in settings panel in `index.html`
- `[x]` Step 6: Modify `window.onload` to initialize `initAuthListener` and hook into state/UI updates on auth state changes
- `[x]` Step 7: Verify manual authentication flows and update walkthrough
