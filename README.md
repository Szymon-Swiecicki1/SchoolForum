# Instrukcja Obsługi, Kompilacji i Konfiguracji SchoolForum

Niniejszy przewodnik zawiera szczegółowe instrukcje krok po kroku niezbędne do uruchomienia, konfiguracji i wdrożenia platformy **SchoolForum**.

---

## 1. Instalacja Node.js oraz TypeScript

Aby przygotować środowisko lokalne do kompilacji i uruchomienia plików TypeScript (`.ts`):

1. **Instalacja Node.js:**
   - Wejdź na oficjalną stronę [nodejs.org](https://nodejs.org/).
   - Pobierz wersję rekomendowaną dla większości użytkowników (wersja **LTS**).
   - Przejdź przez standardowy instalator systemu Windows, macOS lub Linux.
   - Po instalacji otwórz terminal (lub CMD) i sprawdź poprawność instalacji komendami:
     ```bash
     node -v
     npm -v
     ```

2. **Instalacja TypeScript:**
   - Zainstaluj kompilator TypeScript globalnie na swoim komputerze za pomocą pakietu `npm`:
     ```bash
     npm install -g typescript
     ```
   - Aby zweryfikować poprawność instalacji kompilatora `tsc`, wpisz:
     ```bash
     tsc -v
     ```

---

## 2. Kompilacja plików TypeScript do JavaScript

Kompilacja plików o rozszerzeniu `.ts` z folderu `ts/` do modułów `.js` możliwa jest na dwa sposoby:

### Sposób A: Standardowa ręczna kompilacja przy użyciu `tsc`
Wywołaj polecenie w katalogu głównym projektu:
```bash
tsc ts/*.ts --outDir js --target es2022 --module esnext
```
*Spowoduje to przetłumaczenie kodu TS i zapisanie plików `.js` w folderze `js/`.*

### Sposób B: Automatyczna kompilacja w tle (Tryb Watch)
Aby kompilator automatycznie nasłuchiwał zmian w plikach i kompilował je w czasie rzeczywistym, uruchom:
```bash
tsc ts/*.ts --outDir js --target es2022 --module esnext --watch
```

---

## 3. Konfiguracja Google OAuth 2.0 w Google Cloud Console

Aby przycisk **"Zaloguj się przez Google"** działał w pełni z Twoją własną domeną, uzyskaj **Client ID** wykonując poniższe kroki:

1. Przejdź pod adres: [Google Cloud Console](https://console.cloud.google.com/) i zaloguj się kontem Google.
2. Utwórz nowy projekt szkolny: kliknij wybór projektów w lewym górnym rogu i naciśnij **Nowy Projekt (New Project)**. Nazwij go *SchoolForum*.
3. Przejdź do: **Interfejsy API i usługi (APIs & Services)** &rarr; **Ekran zgody OAuth (OAuth consent screen)**:
   - Wybierz typ **External (Zewnętrzny)** (bądź *Internal*, jeżeli Twoja szkoła posiada Google Workspace dla uczniów).
   - Wpisz nazwę aplikacji: *SchoolForum Kopernik*.
   - Podaj adres wsparcia (Twój e-mail) oraz adres do kontaktu dla deweloperów.
   - Zaakceptuj domyślne ustawienia i kliknij *Zapisz*.
4. Dodaj wymagane **Zakresy (Scopes)**:
   - Kliknij *Dodaj lub usuń zakresy (Add or remove scopes)*.
   - Zaznacz: `.../auth/userinfo.email`, `.../auth/userinfo.profile` oraz `openid`.
5. Przejdź do: **Dane uwierzytelniające (Credentials)** &rarr; **Utwórz dane uwierzytelniające &rarr; Identyfikator klienta OAuth (OAuth client ID)**:
   - Wybierz typ aplikacji: **Aplikacja internetowa (Web application)**.
   - **Autoryzowane źródła JavaScript (Authorized JavaScript origins):**
     Dodaj adresy, spod których wolno wywołać logowanie, np:
     - `http://localhost:3000` (lokalny port deweloperski)
     - `http://127.0.0.1:5500` (domyślny port Live Server w VS Code)
     - `https://twoja-domena.netlify.app`
   - **Autoryzowane identyfikatory URI przekierowania (Authorized redirect URIs):**
     Dodaj analogiczne adresy kończące się przekierowaniem (często tożsamy z adresem głównym lub plikiem docelowym, np. `http://localhost:3000/app.html`).
6. Kliknij **Utwórz (Create)**.
7. Skopiuj wygenerowany **Identyfikator klienta (Client ID)** i wklej go do pliku `ts/auth.ts` w celu pełnej integracji z systemem Google.

---

## 4. Uruchamianie lokalne (Live Server w VS Code)

Aby przetestować aplikację lokalnie na komputerze bez problemów z polityką CORS dla modułów ES6:

1. Otwórz folder projektu w programie **Visual Studio Code**.
2. Zainstaluj wtyczkę **Live Server** (autorstwa *Ritwick Dey*) z zakładki Extensions (`Ctrl+Shift+X` lub `Cmd+Shift+X`).
3. Otwórz plik `index.html`.
4. Kliknij przycisk **"Go Live"** widoczny w prawym dolnym rogu paska stanu VS Code, bądź kliknij prawym przyciskiem myszy na plik `index.html` i wybierz *Open with Live Server*.
5. Twoja domyślna przeglądarka otworzy aplikację pod adresem `http://127.0.0.1:5500/index.html`.

---

## 5. Darmowe wdrożenie na Netlify lub GitHub Pages

### Opcja A: Wdrożenie na Netlify (Zalecane — najszybsze)
1. Zarejestruj się za darmo na [netlify.com](https://www.netlify.com/).
2. Przygotuj strukturę produkcyjną i upewnij się, że pliki `.js` są skompilowane.
3. Przejdź do panelu Netlify, wybierz sekcję **Sites (Strony)** i przeciągnij cały folder deweloperski (w tym skompilowane pliki) na pole uploadu.
4. Netlify udostępni Ci natychmiast bezpieczną publiczną domenę z obsługą protokołu HTTPS (np. `https://kopernik-forum.netlify.app`), którą możesz podpiąć pod panel Google Cloud Console.

### Opcja B: Wdrożenie na GitHub Pages
1. Utwórz nowe repozytorium na swoim profilu GitHub.
2. Wyślij pliki do repozytorium:
   ```bash
   git init
   git add .
   git commit -m "Inicjalizacja SchoolForum"
   git remote add origin https://github.com/twoj-login/schoolforum.git
   git branch -M main
   git push -u origin main
   ```
3. W ustawieniach repozytorium (*Settings* &rarr; *Pages*):
   - W sekcji **Build and deployment** wybierz źródło: `Deploy from a branch`.
   - Jako gałąź wybierz `main` oraz folder `/ (root)`. Kliknij *Save*.
4. Po paru minutach strona będzie dostępna pod adresem: `https://twoj-login.github.io/schoolforum/`.

---

## 6. Integracja z Firebase Firestore i Storage (Opcjonalnie)

Jeżeli chcesz przenieść dane z pamięci lokalnej przeglądarki (`localStorage`) do prawdziwej, darmowej bazy danych Google Cloud:

1. Wejdź na [Firebase Console](https://console.firebase.google.com/) i załóż projekt, łącząc go z projektem Google Cloud Console.
2. Dodaj usługę **Cloud Firestore** w trybie testowym lub produkcyjnym.
3. Dodaj usługę **Firebase Storage** (niezbędną do trwałego przechowywania archiwów PDF/DOCX przesyłanych przez uczniów).
4. Kliknij ikonę koła zębatego (Ustawienia projektu) &rarr; Dodaj aplikację internetową (Web App) i skopiuj konfigurację SDK:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "schoolforum-db.firebaseapp.com",
     projectId: "schoolforum-db",
     storageBucket: "schoolforum-db.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
5. Zainstaluj Firebase w projekcie:
   ```bash
   npm install firebase
   ```
6. Zamień w plikach `ts/forum.ts`, `ts/exams.ts` i `ts/files.ts` odczyt/zapis z `localStorage` na wywołania asynchroniczne Firestore:
   ```typescript
   import { initializeApp } from "firebase/app";
   import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);

   // Przykład zapisu do chmury:
   await addDoc(collection(db, "posts"), newPost);
   ```
