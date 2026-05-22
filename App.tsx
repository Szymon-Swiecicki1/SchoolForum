<!DOCTYPE html>
<html lang="pl" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Polityka Prywatności - SchoolForum</title>
    <link rel="stylesheet" href="/css/style.css">
    <script>
        // Synchronize theme with localStorage
        const cachedTheme = localStorage.getItem('theme') || 'dark';
        if (cachedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    </script>
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12 transition-all duration-300">
        <!-- Header -->
        <div class="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-indigo-600 dark:text-blue-400 font-bold text-xl tracking-tight mb-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                    SchoolForum
                </div>
                <h1 id="privacy_policy_title" class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Polityka Prywatności</h1>
                <p id="entry_date" class="text-sm text-slate-500 dark:text-slate-400 mt-2">Data wejścia w życie: 21 maja 2026 r.</p>
            </div>
            <a href="/index.html" class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-blue-400 hover:underline">
                Powrót do logowania
            </a>
        </div>

        <!-- Content -->
        <div class="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            <section class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">1. Administrator Danych Osobowych</h2>
                <p>
                    Administratorem Państwa danych osobowych jest <strong>I Liceum Ogólnokształcące im. Mikołaja Kopernika</strong> z siedzibą przy ul. Szkolnej 42, 00-001 Warszawa (zwane dalej "Szkołą"). Kontakt z Administratorem jest możliwy drogą mailową pod adresem: <a href="mailto:admin@schoolforum.example.com" class="text-blue-500 hover:underline">admin@schoolforum.example.com</a> lub pisemnie na adres siedziby Szkoły.
                </p>
                <p>
                    Administrator wyznaczył Inspektora Ochrony Danych (IOD), z którym można się skontaktować we wszystkich sprawach dotyczących przetwarzania danych osobowych oraz korzystania z praw związanych z przetwarzaniem danych: <a href="mailto:iod@schoolforum.example.com" class="text-blue-500 hover:underline">iod@schoolforum.example.com</a>.
                </p>
            </section>

            <section class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">2. Jakie dane są zbierane?</h2>
                <p>Korzystanie z platformy SchoolForum wymaga uwierzytelnienia. Zbieramy następujące kategorie danych osobowych:</p>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Dane identyfikacyjne z Google OAuth 2.0:</strong> Imię, nazwisko, adres e-mail, identyfikator użytkownika Google (Google ID) oraz adres URL zdjęcia profilowego.</li>
                    <li><strong>Dane z profilu użytkownika:</strong> Klasa (wybrana przez użytkownika), krótki opis bio oraz spersonalizowane zdjęcie profilowe (jeśli zostało przesłane bezpośrednio).</li>
                    <li><strong>Treści generowane przez użytkownika:</strong> Tytuły i treść postów na forum, zapytania egzaminacyjne, komentarze, polubienia oraz informacje o zapisanych postach.</li>
                    <li><strong>Załączniki i pliki:</strong> Dokumenty edukacyjne w formatach PDF lub DOCX, wgrane przez użytkownika na forum lub w sekcji przykładowych egzaminów.</li>
                    <li><strong>Dane techniczne i diagnostyczne:</strong> Adres IP, pliki cookies, preferencje systemowe (np. wybrany motyw graficzny: jasny/ciemny oraz ustawienia powiadomień).</li>
                </ul>
            </section>

            <section class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">3. Cel i podstawa prawna przetwarzania danych</h2>
                <p>Państwa dane osobowe są przetwarzane w następujących celach:</p>
                <div class="grid gap-3 sm:grid-cols-2 mt-2">
                    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div class="font-semibold text-slate-900 dark:text-white">Uwierzytelnienie i dostęp</div>
                        <p class="text-sm mt-1">Umożliwienie bezpiecznego logowania przez Google OAuth oraz weryfikacja statutu ucznia (Art. 6 ust. 1 lit. b RODO).</p>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-805 border border-slate-200 dark:border-slate-700">
                        <div class="font-semibold text-slate-900 dark:text-white">Działanie Forum i edukacja</div>
                        <p class="text-sm mt-1">Publikowanie postów, zadawanie pytań egzaminacyjnych, pobieranie materiałów i wzajemna pomoc naukowa (Art. 6 ust. 1 lit. f RODO).</p>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-805 border border-slate-200 dark:border-slate-700">
                        <div class="font-semibold text-slate-900 dark:text-white">Zarządzanie kontem</div>
                        <p class="text-sm mt-1">Personalizacja profilu użytkownika, zapamiętywanie ustawień wyglądu i powiadomień (Art. 6 ust. 1 lit. a RODO - zgoda dobrowolna).</p>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-805 border border-slate-200 dark:border-slate-700">
                        <div class="font-semibold text-slate-900 dark:text-white">Bezpieczeństwo i regulamin</div>
                        <p class="text-sm mt-1">Zapobieganie spamowi, mowie nienawiści, oszustwom oraz egzekwowanie postanowień Regulaminu (Art. 6 ust. 1 lit. f RODO).</p>
                    </div>
                </div>
            </section>

            <section class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">4. Okres przechowywania danych</h2>
                <p>
                    Dane są przechowywane przez okres aktywności konta użytkownika na platformie. W przypadku decyzji o usunięciu konta przez użytkownika, jego dane profilowe zostają trwale usunięte z bazy danych w ciągu 30 dni. Treści opublikowane przez użytkownika (posty, komentarze, pliki) mogą zostać zanonimizowane lub usunięte, zależnie od wyboru użytkownika i wymogów administracyjnych dotyczących integralności bazy danych. Dane logowania i sesji są usuwane automatycznie po wygaśnięciu sesji lub wylogowaniu.
                </p>
            </section>

            <section class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">5. Prawa użytkownika zgodnie z RODO</h2>
                <p>W związku z przetwarzaniem danych osobowych przysługują Państwu następujące prawa:</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Prawo dostępu:</strong> Możliwość uzyskania od Administratora kopii przetwarzanych danych osobowych.</li>
                    <li><strong>Prawo do sprostowania:</strong> Możliwość poprawienia swoich danych bezpośrednio w sekcji "Konto" lub żądanie ich edycji.</li>
                    <li><strong>Prawo do usunięcia ("prawo do bycia zapomnianym"):</strong> Możliwość całkowitego usunięcia konta oraz powiązanych danych.</li>
                    <li><strong>Prawo do ograniczenia przetwarzania:</strong> Prawo do żądania wstrzymania operacji na danych w określonych okolicznościach.</li>
                    <li><strong>Prawo do wycofania zgody:</strong> Wycofanie zgody na RODO oraz dostosowanie widoczności profilu w Ustawieniach w dowolnym momencie.</li>
                    <li><strong>Prawo do skargi:</strong> Prawo wniesienia skargi do organu nadzorczego (Prezesa Urzędu Ochrony Danych Osobowych - PUODO), jeśli uznają Państwo, że przetwarzanie danych narusza przepisy prawa.</li>
                </ul>
            </section>

            <section class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">6. Pliki Cookies i pamięć lokalna</h2>
                <p>
                    Platforma SchoolForum stosuje pliki cookies oraz mechanizmy pamięci lokalnej przeglądarki (<code>localStorage</code>) wyłącznie w celach technicznych i funkcjonalnych: do utrzymania zalogowanej sesji użytkownika, zapisania wybranego motywu graficznego (ciemny/jasny) oraz zachowania preferencji powiadomień i lokalnego stanu filtrów forum. Nie stosujemy ciasteczek śledzących ani reklamowych firm trzecich.
                </p>
            </section>

            <section class="space-y-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">7. Bezpieczeństwo danych</h2>
                <p>
                    Stosujemy nowoczesne, wysokie standardy ochrony danych, w tym certyfikaty SSL/TLS do szyfrowania transmisji danych, mechanizmy autoryzacji Google OAuth 2.0 bez ujawniania hasła oraz regularne kontrole dostępu personelu administracyjnego w celu minimalizowania ryzyka wycieku danych.
                </p>
            </section>
        </div>

        <!-- Footer -->
        <div class="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 text-center text-xs text-slate-400">
            &copy; 2026 SchoolForum. Wszelkie prawa zastrzeżone. Dedykowane dla uczniów liceum.
        </div>
    </div>
</body>
</html>
