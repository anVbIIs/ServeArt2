# Plan Wdrożenia — Rozróżnienie Profili (Twórca vs Entuzjasta)

Niniejszy plan opisuje wprowadzenie podziału profili użytkowników w **ServeArt** na dwie główne role: **Twórca** (produkuje dzieła, przyjmuje zamówienia, tworzy oferty) oraz **Entuzjasta** (odbiorca, pasjonat, zbieracz rzemiosła).

---

## Krótki Opis Zmian

Aplikacja będzie teraz rozróżniać użytkowników i dostosowywać interfejs w zależności od wybranej roli:
1. **Onboarding / Pierwsze Uruchomienie**: Nowe okienko modalne blokujące interfejs przy pierwszym wejściu (lub po wyczyszczeniu danych), pytające użytkownika: *"W jakim charakterze tu jesteś?"* z dwoma wyborami (Twórca / Entuzjasta). Wybór ten jest zapisywany w `localStorage`.
2. **Przełącznik w Ustawieniach**: W ustawieniach konta (zębatka) pod powiadomieniami dodajemy przełącznik profilu. Umożliwia on natychmiastowe przejście z Entuzjasty na Twórcę i odwrotnie, automatycznie aktualizując interfejs.
3. **Plakietki Ról w Społeczności i na Profilu**: Obok nazw użytkowników w postach społeczności, komentarzach, wynikach wyszukiwania oraz na nagłówku profilu pojawi się fioletowa plakietka `Twórca` lub turkusowa `Entuzjasta`.
4. **Ograniczenia Funkcjonalne Entuzjasty**:
   * Brak przycisku „Złóż zamówienie” na profilu Entuzjasty.
   * Brak sekcji „Zakres oferty” na profilu Entuzjasty.
   * Zablokowanie zakładki „Dodaj” (ekran wstawiania produktów) – zamiast formularza dodawania, Entuzjasta zobaczy ładny komunikat z wyjaśnieniem i przyciskiem przekierowującym do Ustawień w celu przełączenia roli.
5. **„Zajawki” zamiast Kompetencji**:
   * Zmiana nazwy sekcji tagów na profilu: dla Twórcy to „Specjalizacje i Tagi”, dla Entuzjasty – „Moje zajawki”.
   * Zmiana checklisty w zakładce Współpraca: dla Twórcy to „Szukane kompetencje partnerskie”, dla Entuzjasty – „Moje zajawki / Zainteresowania” (mechanizm zapisu w bazie `soughtProfessions` pozostaje spójny pod kątem dopasowywania ofert).

---

## Proponowane Zmiany w Plikach

### [MODIFY] [index.html](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/index.html)

#### 1. Struktura HTML (Markupy Modalne i Sekcje)
* **[NEW] Onboarding Modal**: Dodanie kontenera `#modal-onboarding` na samym dole pliku (obok innych modalnych overlayów). Kontener z tłem `backdrop-blur-md bg-black/60` i dwiema kartami wyboru roli:
  * *Twórca*: Z ikoną palety malarskiej (`palette`) i markowym fioletem.
  * *Entuzjasta*: Z ikoną serca (`favorite`) i turkusem.
* **[MODIFY] Settings Modal (`#modal-app-settings`)**: Dodanie sekcji „Rodzaj profilu w społeczności” pod powiadomieniami z ikoną, tytułem profilu i przełącznikiem (`#setting-role-toggle`) sterującym rolą.
* **[MODIFY] Profile Edit Modal (`#modal-edit-profile`)**: Wrap sekcji zakresu oferty w `#edit-offering-inputs-wrapper` i dodanie `id="edit-tags-label"` do nagłówka tagów w celu dynamicznego dostosowywania etykiet.
* **[MODIFY] Screen Add (`#screen-add`)**: Podział ekranu na dwa kontenery: `#add-screen-creator-view` (tradycyjny formularz) oraz `#add-screen-enthusiast-view` (szklana karta blokująca z komunikatem zachęcającym do zostania Twórcą).
* **[MODIFY] Profile Page Tags Title**: Dodanie `id="profile-tags-title"` do nagłówka `Specjalizacje i Tagi` na profilu.

#### 2. Logika JavaScript
* **Dynamiczne Inicjowanie Roli**: Odczytywanie domyślnej roli z `localStorage` (`localStorage.getItem('serveart_user_role') || 'twórca'`) przy inicjalizacji `STATE.currentUser`.
* **Wywołanie Onboardingu**: W sekcji uruchomieniowej dodanie sprawdzenia `!localStorage.getItem('serveart_onboarded_role')` w celu wyświetlenia modalu onboardingu.
* **Funkcje Pomocnicze Badges**:
  * `getUserRoleLabel(username)`: Pobiera tekst roli (twórca/entuzjasta) dla wybranego użytkownika (sprawdza `STATE.currentUser` oraz bazę `STATE.creators`).
  * `getUserRoleBadge(username)`: Generuje kod HTML małej, kolorowej plakietki na podstawie pobranej roli.
* **Integracja Plakietek**:
  * Modyfikacja `renderCommunityFeed()` w celu wstrzyknięcia plakietek ról przy nazwach autorów postów oraz w komentarzach.
  * Modyfikacja `runSearch()` (w sekcji wyszukiwania artystów) w celu dodania plakietki przy nazwisku na kafelkach wyników.
  * Modyfikacja `openCreatorProfileSim(name)` i `openOwnProfile()` w celu dodania plakietki przy nazwisku w nagłówku profilowym.
* **Dostosowywanie Karty Profilu**:
  * Ukrywanie/pokazywanie przycisku „Złóż zamówienie” na profilu za pomocą klas `hidden` w zależności od roli właściciela profilu.
  * Ukrywanie/pokazywanie sekcji „Zakres oferty” (`#profile-offering-card`) na profilu.
  * Dynamiczna zmiana tytułu tagów: "Specjalizacje i Tagi" vs "Moje zajawki".
  * Dynamiczna zmiana etykiet checklisty w zakładce Współpraca (`renderCoopCompetencyCheckboxes`).
* **Przełącznik w Ustawieniach**:
  * Aktualizacja `openAppSettings()` w celu ustawienia właściwego stanu przełącznika roli i odświeżenia UI (ikony i opisu) w modalnym oknie.
  * Obsługa `toggleSettingRole(toggle)` zmieniająca w czasie rzeczywistym wygląd opcji w oknie ustawień.
  * Aktualizacja `saveAppSettings()` zapisująca rolę w `STATE.currentUser.role` oraz `localStorage` i automatycznie aktualizująca domyślny opis zawodu ("Entuzjasta Rzemiosła" vs "Kolekcjoner i Twórca Rzemiosła").
* **Blokada Ekranu Dodawania (`switchTab('add')`)**:
  * Kontrola widoczności `#add-screen-creator-view` i `#add-screen-enthusiast-view` in zależności od aktywnej roli użytkownika.

---

## Plan Weryfikacji (Verification Plan)

### Weryfikacja Manualna
1. **Test Pierwszego Uruchomienia (Onboarding)**:
   * Wyczyszczenie `localStorage` (lub otwarcie w nowej sesji) – po załadowaniu powinien pojawić się pełnoekranowy modal pytający o charakter uczestnictwa.
   * Wybranie „Entuzjasta” – modal powinien zniknąć, a w nagłówku profilu po kliknięciu „Profil” powinna pojawić się plakietka `Entuzjasta`.
2. **Test Blokad u Entuzjasty**:
   * Przejście do zakładki **Dodaj** – zamiast formularza dodawania nowego dzieła, powinien pojawić się estetyczny komunikat o blokadzie dla entuzjastów z przyciskiem przekierowania.
   * Przejście do innego twórcy w Explore feed (np. Anna Kowalska) – na jej profilu widzimy przycisk „Złóż zamówienie” (bo jest Twórcą).
   * Kliknięcie na swój profil (Jan Kowalski) – na zakładce Współpraca checklista powinna nazywać się „Moje zajawki / Zainteresowania”, a tytulik tagów pod bio: „Moje zajawki”.
3. **Test Przełączenia w Ustawieniach**:
   * Kliknięcie ikony zębatki w prawym górnym rogu.
   * Przełączenie przełącznika na „Profil Twórcy” (toggle włącza fioletowy akcent) i zatwierdzenie.
   * Zweryfikowanie, czy zakładka **Dodaj** jest teraz w pełni odblokowana z formularzem wstawiania dzieła.
   * Zweryfikowanie, czy typ profilu na stronie profilowej zmienił się na `Twórca`, a tytulik tagów zmienił się na „Specjalizacje i Tagi”.
4. **Test Plakietek Społecznościowych**:
   * Przejście do zakładek **Społeczność** (Community) – zweryfikowanie, czy przy autorach postów i w komentarzach widnieją poprawne, kolorowe plakietki ról.
