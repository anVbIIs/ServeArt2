# Plan Wdrożenia (Implementation Plan) — Artoteka

Niniejszy dokument przedstawia techniczny plan wdrożenia platformy Artoteka na rynku polskim. Obejmuje proponowany stos technologiczny, architekturę usług, podział prac programistycznych na komponenty oraz plan weryfikacji kodu.

---

## 1. Rekomendowany Stos Technologiczny (Tech Stack)

Aby zapewnić stabilność transakcyjną, elastyczność taksonomii tagów oraz doskonałe działanie aplikacji na urządzeniach mobilnych i desktopach, rekomendujemy poniższy stos:

```
+-------------------------------------------------------------------+
|                            FRONTEND                               |
|  - Web / SEO: Next.js (React) + TailwindCSS (premium styling)    |
|  - Mobile App: React Native (Expo) (dzielenie typów i logiki)     |
+-------------------------------------------------------------------+
|                            BACKEND                                |
|  - API Server: Node.js (TypeScript) z NestJS lub Express          |
|  - Kolejki Zadań: BullMQ + Redis (przetwarzanie wideo, maile)     |
+-------------------------------------------------------------------+
|                         BAZY DANYCH                               |
|  - Rdzeń: PostgreSQL (zarządzany przez Prisma ORM)               |
|  - Elastyczny: MongoDB (Tagi, logi weryfikacji, czat)             |
+-------------------------------------------------------------------+
|                        USŁUGI ZEWNĘTRZNE                          |
|  - Media: AWS S3 + AWS Elemental MediaConvert (transkodowanie)    |
|  - Płatności i Escrow: Stripe lub Przelewy24 / PayU               |
|  - Dostawy: InPost ShipX API (Paczkomaty i kurierzy w Polsce)     |
+-------------------------------------------------------------------+
```

---

## 2. Podział Prac i Komponenty Systemowe

Wdrożenie platformy zostanie podzielone na 6 głównych komponentów. Poniżej opisano szczegółowo zakres zmian dla każdego z nich.

---

### Komponent 1: Baza Danych i Środowisko (Artoteka Schema)
Skonfigurowanie kontenerów deweloperskich, schematu Prisma oraz połączeń z MongoDB.

#### [NEW] [docker-compose.yml](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/docker-compose.yml)
Plik konfiguracyjny lokalnego środowiska deweloperskiego (PostgreSQL, MongoDB, Redis).

#### [NEW] [schema.prisma](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/prisma/schema.prisma)
Definicje tabel relacyjnych `User`, `CreatorProfile`, `Listing` (z kolumnami `profession`, `item_type`, `colors` i `materials` jako JSONB), `Workshop`, `WorkshopBooking` zgodnie z projektem DDL.

#### Zadania programistyczne:
1. Uruchomienie lokalnych baz danych przez Docker Compose.
2. Inicjalizacja Prisma, wykonanie pierwszej migracji bazy PostgreSQL (`npx prisma migrate dev`).
3. Konfiguracja połączeń Mongoose/MongoDB dla kolekcji `Tags` i `VerificationLogs`.

---

### Komponent 2: Autoryzacja i Dwuprofilowość
Implementacja rejestracji i uwierzytelniania (JWT/OAuth) z podziałem na profil kupującego i twórcy.

#### [NEW] [auth.controller.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/auth/auth.controller.ts)
Endpointy rejestracji (`/api/v1/auth/register`), logowania (`/api/v1/auth/login`) oraz odświeżania tokenów.

#### [NEW] [profile.controller.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/profiles/profile.controller.ts)
Zarządzanie profilem rzemieślnika (edycja bio, zawodu/profesji, miasta, województwa, statusu "otwarty na customy" oraz listy wykluczeń).

#### Zadania programistyczne:
1. Wdrożenie szyfrowania haseł (bcrypt) i walidacji adresów e-mail.
2. Stworzenie formularza onboardingowego w aplikacji frontendowej z interaktywną mapą Polski do wyboru województwa/miasta.

---

### Komponent 3: Weryfikacja „Proof of Process” i Dodawanie Ofert
Moduł pozwalający na dodawanie ofert i wymuszający przesłanie wideo z procesu tworzenia jako zabezpieczenie anty-dropshippingowe.

#### [NEW] [listing.controller.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/listings/listing.controller.ts)
Obsługa tworzenia oferty (`POST /api/v1/listings`) za pomocą przesyłania plików multipart/form-data z polami `colors`, `materials`, `item_type`, `category`.

#### [NEW] [video-processor.service.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/verify/video-processor.service.ts)
Serwis działający asynchronicznie za pomocą BullMQ. Pobiera wideo z tymczasowego katalogu, uruchamia FFmpeg celem ekstrakcji metadanych (GPS, data utworzenia pliku) oraz kompresji wideo do formatu zoptymalizowanego pod mobile (H.264 MP4).

#### Zadania programistyczne:
1. Konfiguracja bucketu AWS S3 (lub lokalnego odpowiednika MinIO dla testów) na pliki wideo i zdjęcia.
2. Integracja FFmpeg w kontenerze backendowym.
3. Blokowanie publikacji oferty, jeśli pole wideo procesu jest puste lub nie przeszło podstawowej walidacji kontenera pliku.

---

### Komponent 4: Algorytm Trust Score i Wyszukiwarka Dwukierunkowa
Implementacja logiki wyliczającej pozycjonowanie na bazie zaufania twórcy oraz chmury tagów i wyszukiwarki (Przedmioty / Zawody).

#### [NEW] [trust-score.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/algorithms/trust-score.ts)
Kod obliczający oceny rzemieślników wg zaimplementowanego wzoru matematycznego.

#### [NEW] [search.controller.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/search/search.controller.ts)
Wyszukiwarka oparta o SQL JOIN zintegrowana z agregacją tagów niszowych, materiałów i kolorów. Obsługuje dwa tryby wyszukiwania: `items` (przedmioty, kolory, materiały) i `jobs` (artysta, profesja).

#### Zadania programistyczne:
1. Wdrożenie harmonogramu zadań (CronJob w NestJS), który co 24 godziny przelicza `trust_score` dla wszystkich twórców na podstawie ich czasu reakcji i opóźnień wysyłek.
2. Zaimplementowanie mechanizmu raportowania ofert przez kupujących (gdy podejrzewają dropshipping z Temu). Przekroczenie 3 unikalnych flag wysyła ofertę do moderatora i obniża tymczasowo Trust Score twórcy.

---

### Komponent 5: Płatności Escrow i Dostawy (InPost)
Bezpieczny system transakcyjny chroniący kupującego i sprzedającego.

#### [NEW] [payment.controller.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/payments/payment.controller.ts)
Integracja z API płatności. Środki kupującego są blokowane (Status: ESCROW_HELD) i uwalniane na konto twórcy dopiero po statusie doręczenia przesyłki.

#### [NEW] [delivery.service.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/delivery/delivery.service.ts)
Integracja z API InPost ShipX. Generowanie etykiet kurierskich bezpośrednio w aplikacji, monitoring statusu paczki (doręczono -> wyzwalacz uwolnienia płatności).

#### Zadania programistyczne:
1. Obsługa Webhooków płatności i logistyki.
2. Automatyczne powiadomienia e-mail i push po zmianie statusu paczki.

---

### Komponent 6: Warsztaty i Subskrypcje Premium
Zarządzanie wydarzeniami stacjonarnymi oraz płatnymi kontami rzemieślników.

#### [NEW] [workshop.controller.ts](file:///c:/Users/meyrem/Desktop/Aplikacja%20dla%20artyst%C3%B3w/src/workshops/workshop.controller.ts)
Endpointy do dodawania warsztatów oraz kupowania na nie biletów.

#### Zadania programistyczne:
1. Integracja cyklicznych płatności Stripe Billing dla subskrybentów Premium.
2. Wdrożenie dynamicznego motywu wizualnego na frontendzie (odczyt pola `premium_color_theme` i aplikowanie go dynamicznie w CSS profilu twórcy).

---

## 3. Plan Weryfikacji (Verification Plan)

### Testy Automatyczne (Automated Tests)

1.  **Testy Jednostkowe Algorytmu (Unit Tests):**
    Uruchomienie testów weryfikujących poprawność wyliczania wag algorytmu Trust Score:
    ```bash
    npm run test src/algorithms/trust-score.spec.ts
    ```

2.  **Testy Integracyjne Wyszukiwarki Dwukierunkowej:**
    Sprawdzenie zapytań SQL dla trybu `items` i `jobs`:
    *   Wyszukanie "wazon" powinno zwrócić dzieła ceramiczne Karoliny Nowak.
    *   Wyszukanie "stolarz" powinno zwrócić profil Marka Wiśniewskiego.
    *   Filtrowanie po kolory ("terracotta") i materiał ("miedź") powinno zwrócić pasujące oferty.

3.  **Testy Integracyjne Weryfikacji Wideo (Integration Tests):**
    Symulacja przesyłania niepoprawnego pliku wideo i sprawdzenie, czy API odrzuca publikację.

### Weryfikacja Manualna (Manual Verification)

1.  **Ścieżka Twórcy:**
    *   Rejestracja nowego konta rzemieślnika.
    *   Dodanie oferty z wyborem kolorystyki ("butelkowa zieleń") i materiałów ("wełna merino") z uploadem wideo z procesu.
2.  **Ścieżka Kupującego:**
    *   Filtrowanie zaawansowane w wyszukiwarce i przełączanie trybu "Szukaj Przedmiotów" / "Szukaj Zawodów".
    *   Wysłanie zapytania o custom oraz rezerwacja warsztatów.
