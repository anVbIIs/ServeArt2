-- SUPABASE SETUP SCHEMA FOR SERVEART
-- Wklej poniższy kod w Supabase SQL Editor (w zakładce SQL Editor -> New Query), aby stworzyć tabele i wgrać początkowe dane.

-- 1. Tabela PROFILES (Profile użytkowników i twórców)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    avatar TEXT,
    city TEXT,
    rating NUMERIC DEFAULT 5.0,
    profession TEXT,
    main_specialization TEXT,
    bio TEXT,
    exclusions TEXT,
    joined TEXT DEFAULT to_char(now(), 'FMMonth FMYYYY'),
    is_premium BOOLEAN DEFAULT FALSE,
    avatar_shape TEXT DEFAULT 'circle',
    tags TEXT[] DEFAULT '{}',
    custom_min_budget NUMERIC DEFAULT 0,
    custom_max_budget NUMERIC DEFAULT 0,
    custom_delivery_time TEXT,
    banner TEXT DEFAULT 'gradient-1',
    offering TEXT[] DEFAULT '{}',
    sought_professions TEXT[] DEFAULT '{}',
    role TEXT DEFAULT 'twórca',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Włączenie RLS (Row Level Security) dla tabeli profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Zezwalaj na odczyt wszystkim" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Zezwalaj na modyfikację własnego profilu" ON public.profiles
    FOR ALL USING (true); -- W pełnej wersji produkcyjnej powiążemy to z auth.uid()


-- 2. Tabela LISTINGS (Dzieła / Produkty)
CREATE TABLE IF NOT EXISTS public.listings (
    id TEXT PRIMARY KEY DEFAULT 'l_' || gen_random_uuid(),
    creator_name TEXT NOT NULL REFERENCES public.profiles(name) ON UPDATE CASCADE ON DELETE CASCADE,
    title TEXT NOT NULL,
    price TEXT,
    image TEXT,
    tags TEXT[] DEFAULT '{}',
    category TEXT,
    item_type TEXT,
    materials TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    is_ai_free BOOLEAN DEFAULT FALSE,
    is_handmade BOOLEAN DEFAULT TRUE,
    description TEXT,
    process_pics TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zezwalaj na odczyt wszystkim" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Zezwalaj na modyfikację wszystkim" ON public.listings FOR ALL USING (true);


-- 3. Tabela POSTS (Posty w społeczności)
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY DEFAULT 'post_' || gen_random_uuid(),
    creator_name TEXT NOT NULL REFERENCES public.profiles(name) ON UPDATE CASCADE ON DELETE CASCADE,
    profession TEXT,
    avatar TEXT,
    text TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    likes INTEGER DEFAULT 0,
    date TEXT,
    channel_id TEXT DEFAULT 'malarstwo',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zezwalaj na odczyt wszystkim" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Zezwalaj na modyfikację wszystkim" ON public.posts FOR ALL USING (true);


-- 4. Tabela COMMENTS (Komentarze do postów)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zezwalaj na odczyt wszystkim" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Zezwalaj na modyfikację wszystkim" ON public.comments FOR ALL USING (true);


-- 5. Tabela COOPERATIONS (Oferty współpracy)
CREATE TABLE IF NOT EXISTS public.cooperations (
    id TEXT PRIMARY KEY DEFAULT 'c_' || gen_random_uuid(),
    creator_name TEXT NOT NULL REFERENCES public.profiles(name) ON UPDATE CASCADE ON DELETE CASCADE,
    city TEXT,
    avatar TEXT,
    description TEXT NOT NULL,
    sought_professions TEXT[] DEFAULT '{}',
    profession TEXT,
    share_location BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cooperations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zezwalaj na odczyt wszystkim" ON public.cooperations FOR SELECT USING (true);
CREATE POLICY "Zezwalaj na modyfikację wszystkim" ON public.cooperations FOR ALL USING (true);


-- 6. Tabela MESSAGES (Wiadomości na czacie)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_partner TEXT NOT NULL REFERENCES public.profiles(name) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zezwalaj na odczyt wszystkim" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Zezwalaj na modyfikację wszystkim" ON public.messages FOR ALL USING (true);


-- =========================================================================
-- WGRANIE POCZĄTKOWYCH DANYCH TESTOWYCH (MOCK DATA) Z PROTOTYPU
-- =========================================================================

-- Dane dla PROFILES
INSERT INTO public.profiles (name, avatar, city, rating, profession, main_specialization, bio, exclusions, joined, is_premium, avatar_shape, tags, custom_min_budget, custom_max_budget, custom_delivery_time, banner, offering, role)
VALUES 
(
    'Anna Kowalska', 
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCbIDMmyRq579SSViGJZuDXmWafXlN4NN-Zxg5O9AguNdR22TRo-NdN5dFVR11KdjhIZcYuu_3NDzCDMo4edD6oj_mqlNS5dcJNQZlgRt9_Ytb_LoYaUBenu4emp-rBcuUc9eaqfeDWfEsJIKFSmAihQPjePt1UwgLz0OXGokeo-vbUPapxqFWywjZXUbAfmP6Bqq8xzOdxpRm6lDLrVM2DEMJV6h4w4d2ufAsq0MrZBogLVSmNx0bme3o5BTu2Y7u5fMod-xguXm8',
    'Toruń', 
    4.98, 
    'Malarz / Rzemieślnik Płótna', 
    'Malarz', 
    'Contemporary abstract landscape painter based in Toruń. I utilize natural pigments and hand-stretched linen canvases.',
    'Biżuterii metalowej, rzeźb wielkogabarytowych powyżej 1m.',
    'Marzec 2023',
    TRUE,
    'rhombus',
    ARRAY['Malarstwo', 'Acrylic', 'MixedMedia', 'PłótnoLniane'],
    300,
    1500,
    '10 - 20 dni roboczych',
    'gradient-1',
    ARRAY['Obrazy olejne i akrylowe na płótnie', 'Portrety na zamówienie (custom)', 'Lekcje rysunku i malarstwa', 'Złocenia ram płatkami złota', 'Renowacja obrazów i płócien'],
    'twórca'
),
(
    'Marek Zieliński',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ0fhjrzvsMQ-uF0knD74twrPXfNqfb66A7_1W3iEpiD_a5znfh105QyfBtpYF1uBQrmpEXIUU70r6I_pCcsSeIYG6lPWRiTrjBpQHm_KOAfvMQ8rDtiAWYf0NqaTutx3Bb9jRDqHUH8ft58sUDfiMBG0HylHoBrisI5c4YUVXMcQq0XV71ztPbEaWu3Y4hnCPzJ5CKxXtE8IxMPn-GEUtsJAdUrpIlsEmIYr2O2xerS-VwPGYrKYYfJxvQ5I1dh5dvhEC6C5Db1Y',
    'Gdańsk',
    4.85,
    'Artysta Ceramiki',
    'Garncarz',
    'Glina i ogień. Ręcznie toczona ceramika dekoracyjna i użytkowa inspirowana kolorytem Bałtyku.',
    'Szydełkowania, mebli drewnianych.',
    'Czerwiec 2022',
    FALSE,
    'circle',
    ARRAY['Garncarstwo', 'Ceramika', 'Glina'],
    100,
    600,
    '7 - 14 dni roboczych',
    'gradient-2',
    ARRAY['Wazony i patery kamionkowe', 'Kubki i czarki do herbaty', 'Naczynia użytkowe na zamówienie', 'Zdobienie ceramiki pod projekt', 'Warsztaty garncarskie weekendowe'],
    'twórca'
),
(
    'Anna z Lasu',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0JdvCha_HbwhqpBqhXnrtIKXvccvn0NYG5kaiD6aWztamYV2a-s2Hha1Gy8fRd2C2iKX0tVQJMRRngyQc6R85Wog898KqOJd57VLQhA9VRZW9JpLv-expTtCOmjk3zHJzg-3ilXxVHTS_UFj7GrtzS3RfyEw_qOewiprLIWCqsaipjd9vhqKDXyslosTq22F0hADLjQ7c4358e4jllQT611TfDxKPtUjC1c1R1EBv_5288I4CWZhhnbeu-z0o3UJ5bSvDq7zEpU',
    'Bieszczady',
    4.90,
    'Jubiler / Metaloplastyka',
    'Jubiler',
    'Biżuteria z surowej miedzi, cyny i bieszczadzkich minerałów. Każdy naszyjnik jest kuty ręcznie.',
    'Szydełkowania, murów obronnych.',
    'Styczeń 2024',
    TRUE,
    'square',
    ARRAY['Jubilerstwo', 'Miedź', 'Bursztyn', 'Metaloplastyka'],
    150,
    800,
    '5 - 10 dni roboczych',
    'gradient-3',
    ARRAY['Naszyjniki z surowej miedzi', 'Pierścionki z bieszczadzkim bursztynem', 'Kute cynowe bransolety artystyczne', 'Ozdoby ścienne i panele metalowe', 'Indywidualne projekty biżuterii'],
    'twórca'
),
(
    'Marek Wiśniewski',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCdzWF219RbLeFe5fSAK4OpluiKZ1v9gFE-BPdP9HuTG2nkQ6gcE4uK2Qe8EmRtsO7isTGJtfc-PV7E2DgyUitUGQKipfcyus117fYiMN-Q7dEGRiFPLyCjhrdDVLpucP_W0kCUZ_42_qYOZV-kCGAx6EXS2hERQs2E498kLLqKnsGO2CJgFN3GT8I6PjYJWknj6w1diTWdR3W81Ivhzpi448ar0feYpUqejDoVipt3T4OeBYyaCFt0UsStL6YBEixKrTdTVfDB640',
    'Zakopane',
    4.80,
    'Stolarz artystyczny',
    'Stolarz',
    'Stolarka artystyczna i rustykalna. Drewno dębowe pozyskiwane wyłącznie z wiatrołomów tatrzańskich.',
    'Malarstwa, biżuterii drobnokrystalicznej.',
    'Listopad 2021',
    FALSE,
    'circle',
    ARRAY['Stolarstwo', 'DrewnoDębowe', 'MebleCustom'],
    500,
    4000,
    '20 - 30 dni roboczych',
    'gradient-2',
    ARRAY['Stoły jadalniane z litego dębu', 'Rustykalne ramy rzeźbione', 'Elementy wykończenia z tatrzańskiego drewna', 'Stoły loftowe z elementami metalu', 'Renowacja drewnianych mebli zabytkowych'],
    'twórca'
),
(
    'Jan Kowalski',
    '',
    'Wrocław',
    5.00,
    'Kolekcjoner i Twórca Rzemiosła',
    '',
    'Miłośnik polskiego rzemiosła i handmade. Zbieram unikalną ceramikę oraz malarstwo współczesne.',
    'Seryjnej produkcji, dropshippingu, masowej biżuterii, taśmowej stolarki',
    'Maj 2026',
    FALSE,
    'circle',
    ARRAY['Kolekcja', 'Ceramika', 'Rękodzieło'],
    300,
    1500,
    '10 - 20 dni roboczych',
    'gradient-5',
    ARRAY['Ręcznie toczone wazy ceramiczne', 'Stoły dębowe w stylu industrialnym', 'Warsztaty z toczenia na kole', 'Unikalne kafle ścienne handmade', 'Projekty mebli na indywidualny wymiar'],
    'twórca'
)
ON CONFLICT (name) DO NOTHING;

-- Dane dla LISTINGS
INSERT INTO public.listings (id, creator_name, title, price, image, tags, category, item_type, materials, colors, is_ai_free, is_handmade, description, process_pics)
VALUES
(
    'l_1',
    'Anna Kowalska',
    'Głębia Wisły',
    '800 PLN',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBNxiGqRmrT0BnFa0VajC4uWPqDuyzTW1L2PP0iyb5jhlOj-wNCDR6DISYwyBKq5yREWSGDxK0yQseD39iLpYYyENBUG_eM9AZYhgVS09-uUJ2-9PWYrgvnxxRj5ueVGS34TDpgBnmhlk1EU0PV8fFSf23LHfSJqVYqNJZlaDTDpXjfPE5RdizpnvU0abIMbhVkI_b7BdcGNpf_eTe2xvuI17AxPWC_pYXeXrJ_VPyfykcIz2fjTBslRWHhhrQB30urS4HufF9z4Ro',
    ARRAY['Akryl', 'Wisła', 'Płótno', 'Toruń', 'Piasek', 'Rzeka'],
    'Malarstwo',
    'obraz',
    ARRAY['Płótno lniane', 'Farby akrylowe'],
    ARRAY['odcienie niebieskiego', 'czarny'],
    TRUE,
    TRUE,
    'Interpretacja toruńskiego nabrzeża. Ręcznie malowany obraz na płótnie lnianym, wykorzystujący lokalne pigmenty oraz drobnoziarnisty piasek rzeczny.',
    ARRAY[
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBsSmBEWV8ruWkQ6hl4RKCTk5w6Ytw8nPWSYCEw8FzdAHropocCeLS3hJz2-ThseoN1rdtqUXog8l4l5HtHHnJfRQmY8ZBHVrYnuHBZJIGkJQYSOwdAhi3uXToE4zN0B5mWp0S1ytTxnukI7cLzHi3M0l11xC8GIT2Ly7fjjIQbGqMP5NRER8wcvaZLr7AGZwi_VCSs-WLtMXwIYmgOdIzrLz84Vzk1TSZM4smQ31hUTZ9hwM6T1qnLUCYGO66PGaK4DKTMkwfX9mA',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDK8W0udcEz56jTxTUMX8wghDTMV8kV-N0HZooShETYuSiqRIHQmDMZWP-FpCbtcISWpk9XReXN62hmvAhasBsulOb0Xh_ObIWxx-VtolJGiDKBrIdCMyD7ySOT9JWw0mtUaAwG9tYwVhc1xEt-uzrkEweoHeqvs6TQs1NTtceOGSswd5meIpbzQ2-_MOHT__N5RmyHeo6X9j0nKuPZUE3dAowrukN0y5WBmltpEv_XYRll9anCAz1coK2i_vKwiD0FUgPkcLCECBk',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBNxiGqRmrT0BnFa0VajC4uWPqDuyzTW1L2PP0iyb5jhlOj-wNCDR6DISYwyBKq5yREWSGDxK0yQseD39iLpYYyENBUG_eM9AZYhgVS09-uUJ2-9PWYrgvnxxRj5ueVGS34TDpgBnmhlk1EU0PV8fFSf23LHfSJqVYqNJZlaDTDpXjfPE5RdizpnvU0abIMbhVkI_b7BdcGNpf_eTe2xvuI17AxPWC_pYXeXrJ_VPyfykcIz2fjTBslRWHhhrQB30urS4HufF9z4Ro'
    ]
),
(
    'l_2',
    'Marek Zieliński',
    'Wazon ''Bałtyk'' Oceaniczny',
    '150 PLN',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBnW7BIDPVv45JaQHbhtqkfS0mqunOdEJFITTTWDSJVn4RPOhwvvLEKa6MaNXbzWCxcPeGB09M2HlCL8GqqYkDrRRQ0GZhKfiXU8LLlfbu8u7HBXfAP5Y5vBGX1wdgcCm13pzCjTXgBPmoekZxCSL5pB_ED3cIa05-7U4mdlzTY6BGl4MumFbgdJx9-RnKHH01JEMRojpqndsysPH5iS24-loW44ScpSqNpvFKKzok6vpHnARAGSnPM_Nx7k-L7VojJJJVvXdgxTeM',
    ARRAY['Glina', 'Szkliwo', 'Bałtyk', 'Wazon', 'Kamionka', 'Fale'],
    'Garncarstwo',
    'wazon',
    ARRAY['Glina kamionkowa'],
    ARRAY['odcienie niebieskiego', 'szarości'],
    TRUE,
    TRUE,
    'Wazon ceramiczny z głęboko fakturowym szkliwem reaktywnym. Kolory spienionej fali morskiej.',
    ARRAY[
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7T7UUm66w1_rIgk9ElTmtCixnOaYr_Lgpg-MsF0xCNYSRp7s5joR2X5Q99oDtaohBucflaRg-IeHAhrWObvWQOvDcrNOyPAp-i7mGPJ1BR0pmk7vCX1R2cIRWJwRnF9_G8PgFOTB40JT79FMiKl64R9H0S05CUZxMbZ9sqvrNWEMQ4AdCqHl36RcstF3LSOJeXYQ1d0QQmGLO_HS0jqmLf2Kk4yFl0gpFXoCWx5gzrqpjGy3mocWKUVZ0IlhdUTw8KJy3EgX8qc',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAkbBgGQEnLZ6LTJI_4PUi6kHyrYiiazUPJxCZWmZgXQnkxYjr0tsRmrbvBI9z0a7INY_a6sk2n9OqkZwTtMp_uc3OwSjOxId6SdUjfz8s7ChPyo67He0_8FuEIuFexNfQ2S1IKOwFYRQ3ndTttcBUBfUCs8uO5MbX97qyHMhHAaDAE72F-rxkAufr5pXvm6ScUICPMP1ZaHh6ageD-UdRLmFaaxz36fHsRQiTU0PzWB_E6jVmcsb1aVBGVO5c_hoxj6btu9F2yl80',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBnW7BIDPVv45JaQHbhtqkfS0mqunOdEJFITTTWDSJVn4RPOhwvvLEKa6MaNXbzWCxcPeGB09M2HlCL8GqqYkDrRRQ0GZhKfiXU8LLlfbu8u7HBXfAP5Y5vBGX1wdgcCm13pzCjTXgBPmoekZxCSL5pB_ED3cIa05-7U4mdlzTY6BGl4MumFbgdJx9-RnKHH01JEMRojpqndsysPH5iS24-loW44ScpSqNpvFKKzok6vpHnARAGSnPM_Nx7k-L7VojJJJVvXdgxTeM'
    ]
),
(
    'l_3',
    'Anna z Lasu',
    'Naszyjnik Solarny',
    '320 PLN',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBVhuAQ0W9AeJKFQ73yh4jIR74N_MZ9p9LV1vTFeAaItiaock5bA123PxizkpM-U1LuHLl6WaZHIBfTRZl0ZgGXx1JBz6hwzGiVYTfu8L2X2zV3bzQpNxu_uExvLLcgy8a9hveoS56Sc8dgTVKbIfjc5ZKnJcNoGcskNgtViYMd5awgp_02j-KfjmwNbNiWV5X49uBXq02uOQp86V4UknwOZgsTTHuMF70x2vHpb6-yD1Cu88mSEboVdLkabVq_Qf5kE6ecHJe7JOA',
    ARRAY['Miedź', 'Bursztyn', 'Naszyjnik', 'Biżuteria', 'Kucie', 'Słońce'],
    'Jubilerstwo',
    'naszyjnik',
    ARRAY['Miedź', 'Bursztyn'],
    ARRAY['wielokolorowy'],
    FALSE,
    TRUE,
    'Ręcznie kuty naszyjnik z miedzi patynowanej z osadzonym naturalnym bryłkowym bursztynem bałtyckim.',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuBVhuAQ0W9AeJKFQ73yh4jIR74N_MZ9p9LV1vTFeAaItiaock5bA123PxizkpM-U1LuHLl6WaZHIBfTRZl0ZgGXx1JBz6hwzGiVYTfu8L2X2zV3bzQpNxu_uExvLLcgy8a9hveoS56Sc8dgTVKbIfjc5ZKnJcNoGcskNgtViYMd5awgp_02j-KfjmwNbNiWV5X49uBXq02uOQp86V4UknwOZgsTTHuMF70x2vHpb6-yD1Cu88mSEboVdLkabVq_Qf5kE6ecHJe7JOA']
),
(
    'l_4',
    'Marek Wiśniewski',
    'Dębowa deska rustykalna',
    '120 PLN',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIsx22JiGfPs0qQlnYku-fYtQQ7sbx2rHpvZt55lKhyHoGJp39_q6ZvGZTXwR3LDMxNnr5tsc9ePwN5rqE-re7FnM9v1mmbBZ69TjO8mNgQE2w-Ncc079eQwiUpsI8XHFJuwLIBYGY_pYkZgA-jjJa1tcdCdLqj_t5iE7gbbt9O07mPZe5FnITCvnQthywuQNaoibaBY11EE95PrAYbFwedlBidRoyIqfN58dDPbH2NzwWK0ybZI3MnX8SceOaT5MNmanNE4Dqbh4',
    ARRAY['Dąb', 'Drewno', 'Deska', 'Rustykalny', 'Serwowanie', 'Rękodzieło'],
    'Stolarstwo',
    'deska',
    ARRAY['Drewno dębowe'],
    ARRAY['szarości', 'biały'],
    FALSE,
    TRUE,
    'Impregnowana naturalnymi woskami dębowa deska do serwowania o nieregularnym, zachowanym brzegu drzewa (oflisa).',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuCIsx22JiGfPs0qQlnYku-fYtQQ7sbx2rHpvZt55lKhyHoGJp39_q6ZvGZTXwR3LDMxNnr5tsc9ePwN5rqE-re7FnM9v1mmbBZ69TjO8mNgQE2w-Ncc079eQwiUpsI8XHFJuwLIBYGY_pYkZgA-jjJa1tcdCdLqj_t5iE7gbbt9O07mPZe5FnITCvnQthywuQNaoibaBY11EE95PrAYbFwedlBidRoyIqfN58dDPbH2NzwWK0ybZI3MnX8SceOaT5MNmanNE4Dqbh4']
)
ON CONFLICT (id) DO NOTHING;

-- Dane dla POSTS
INSERT INTO public.posts (id, creator_name, profession, avatar, text, images, likes, date, channel_id, tags)
VALUES
(
    'post_1',
    'Anna Kowalska',
    'Malarstwo / Rzemieślnik Płótna',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCbIDMmyRq579SSViGJZuDXmWafXlN4NN-Zxg5O9AguNdR22TRo-NdN5dFVR11KdjhIZcYuu_3NDzCDMo4edD6oj_mqlNS5dcJNQZlgRt9_Ytb_LoYaUBenu4emp-rBcuUc9eaqfeDWfEsJIKFSmAihQPjePt1UwgLz0OXGokeo-vbUPapxqFWywjZXUbAfmP6Bqq8xzOdxpRm6lDLrVM2DEMJV6h4w4d2ufAsq0MrZBogLVSmNx0bme3o5BTu2Y7u5fMod-xguXm8',
    'Przygotowania do naciągania nowego płótna lnianego pod toruński pejzaż. Używam wyłącznie tradycyjnych metod stolarskich do łączenia krosien.',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuBsSmBEWV8ruWkQ6hl4RKCTk5w6Ytw8nPWSYCEw8FzdAHropocCeLS3hJz2-ThseoN1rdtqUXog8l4l5HtHHnJfRQmY8ZBHVrYnuHBZJIGkJQYSOwdAhi3uXToE4zN0B5mWp0S1ytTxnukI7cLzHi3M0l11xC8GIT2Ly7fjjIQbGqMP5NRER8wcvaZLr7AGZwi_VCSs-WLtMXwIYmgOdIzrLz84Vzk1TSZM4smQ31hUTZ9hwM6T1qnLUCYGO66PGaK4DKTMkwfX9mA'],
    24,
    'Dziś, 09:15',
    'malarstwo',
    ARRAY['porada', 'inspiracja']
),
(
    'post_2',
    'Marek Zieliński',
    'Artysta Ceramiki / Kamionka',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7T7UUm66w1_rIgk9ElTmtCixnOaYr_Lgpg-MsF0xCNYSRp7s5joR2X5Q99oDtaohBucflaRg-IeHAhrWObvWQOvDcrNOyPAp-i7mGPJ1BR0pmk7vCX1R2cIRWJwRnF9_G8PgFOTB40JT79FMiKl64R9H0S05CUZxMbZ9sqvrNWEMQ4AdCqHl36RcstF3LSOJeXYQ1d0QQmGLO_HS0jqmLf2Kk4yFl0gpFXoCWx5gzrqpjGy3mocWKUVZ0IlhdUTw8KJy3EgX8qc',
    'Pierwszy etap toczenia wazonu ''Bałtyk'' na kole garncarskim. Glina kamionkowa z lokalnych złóż toruńskich - niezwykle plastyczna i trwała.',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuAkbBgGQEnLZ6LTJI_4PUi6kHyrYiiazUPJxCZWmZgXQnkxYjr0tsRmrbvBI9z0a7INY_a6sk2n9OqkZwTtMp_uc3OwSjOxId6SdUjfz8s7ChPyo67He0_8FuEIuFexNfQ2S1IKOwFYRQ3ndTttcBUBfUCs8uO5MbX97qyHMhHAaDAE72F-rxkAufr5pXvm6ScUICPMP1ZaHh6ageD-UdRLmFaaxz36fHsRQiTU0PzWB_E6jVmcsb1aVBGVO5c_hoxj6btu9F2yl80'],
    18,
    'Wczoraj, 17:40',
    'ceramika',
    ARRAY['wena', 'motywacja']
)
ON CONFLICT (id) DO NOTHING;

-- Dane dla COMMENTS
INSERT INTO public.comments (post_id, author, text, time)
VALUES
('post_1', 'Jan Kowalski', 'Doskonały wybór krosien, bardzo profesjonalne podejście!', '2 godz. temu'),
('post_1', 'Marek Zieliński', 'Tradycyjne krosna to podstawa stabilności obrazu. Trzymam kciuki!', '1 godz. temu'),
('post_2', 'Anna z Lasu', 'Toczenie to prawdziwa magia rzemiosła. Piękna symetria!', '3 godz. temu');

-- Dane dla COOPERATIONS
INSERT INTO public.cooperations (id, creator_name, city, avatar, description, sought_professions, profession, share_location)
VALUES
(
    'c_user_default',
    'Jan Kowalski',
    'Wrocław',
    '',
    'Projektuję nowoczesne stoły i krzesła w stylu loftowym. Poszukuję rzemieślnika artysty ceramika do stworzenia unikalnych kafli glinianych, które zostaną wbudowane bezpośrednio w drewniane blaty moich projektów meblarskich.',
    ARRAY['Ceramik', 'Garncarstwo', 'Artysta Ceramiki'],
    'Projektant Mebli',
    TRUE
),
(
    'c_1',
    'Anna Kowalska',
    'Toruń',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCbIDMmyRq579SSViGJZuDXmWafXlN4NN-Zxg5O9AguNdR22TRo-NdN5dFVR11KdjhIZcYuu_3NDzCDMo4edD6oj_mqlNS5dcJNQZlgRt9_Ytb_LoYaUBenu4emp-rBcuUc9eaqfeDWfEsJIKFSmAihQPjePt1UwgLz0OXGokeo-vbUPapxqFWywjZXUbAfmP6Bqq8xzOdxpRm6lDLrVM2DEMJV6h4w4d2ufAsq0MrZBogLVSmNx0bme3o5BTu2Y7u5fMod-xguXm8',
    'Tworzę tradycyjne, wielkoformatowe płótna pejzażowe, inspirowane głębią polskich lasów oraz dziką naturą doliny Wisły. W mojej codziennej pracy kładę ogromny nacisk na autentyczność, stosując wyłącznie sprawdzone, historyczne techniki gruntowania i naciągania lnu. Każdy pejzaż powstaje przez wiele tygodni, wymagając niezwykłej precyzji oraz skupienia. Poszukuję partnera rzemieślnika do wykonania rzeźbionych ram z litego drewna dębowego lub lipowego. Zależy mi na tym, aby ramy były unikalne, zdobione motywami roślinnymi lub abstrakcyjnymi reliefami, które podkreślą mistyczny charakter moich dzieł. Idealny kandydat powinien mieć doświadczenie w snycerstwie, cierpliwość do pracy z detalami oraz pasję do wydobywania naturalnego piękna drewna. Chciałabym stworzyć spójną kolekcję, gdzie rama i obraz stanowią nierozerwalną całość artystyczną. Zapewniam pełne wsparcie koncepcyjne, regularną komunikację na każdym etapie oraz uczciwy podział zysków ze sprzedaży gotowych kompletów na wystawach i w galerii ServeArt. Jeśli kochasz zapach drewna i chcesz stworzyć coś wyjątkowego, zapraszam serdecznie do kontaktu i wspólnego projektowania tej niesamowitej kolekcji.',
    ARRAY['Stolarz artystyczny', 'Stolarstwo'],
    'Malarstwo',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Dane dla MESSAGES
INSERT INTO public.messages (chat_partner, sender, text, time)
VALUES
('Anna Kowalska', 'Anna Kowalska', 'Dzień dobry! Cieszę się, że interesuje Cię obraz ''Głębia Wisły''.', 'Wczoraj, 18:24'),
('Anna Kowalska', 'buyer', 'Dzień dobry, czy rama jest w cenie obrazu?', 'Wczoraj, 18:30'),
('Anna Kowalska', 'Anna Kowalska', 'Jasne, mogę dostosować rozmiar ramy. Kiedy planujesz zakup?', 'Wczoraj, 18:32'),
('Marek Wiśniewski', 'Marek Wiśniewski', 'Witaj. Przyjąłem zlecenie na wykonanie rustykalnego stołu.', 'Dziś, 09:12'),
('Marek Wiśniewski', 'buyer', 'Świetnie, kiedy mogę spodziewać się pierwszych zdjęć z prac stolarskich?', 'Dziś, 09:40'),
('Marek Wiśniewski', 'Marek Wiśniewski', 'Status: W produkcji. Rozpocząłem struganie nóg. Prześlę fotki pod koniec dnia.', 'Dziś, 10:45');
