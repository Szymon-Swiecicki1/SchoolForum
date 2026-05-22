/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolUser {
  email: string;
  fullname: string;
  avatar: string;
  bio: string;
  schoolClass: string;
  bookmarkedPosts: string[]; // List of post IDs
  joinedDate: string;
  role?: "admin" | "student";
}

// Default simulated user based on metadata and general defaults
export const DEFAULT_USER: SchoolUser = {
  email: "szymonherb1234@gmail.com",
  fullname: "Szymon Wiśniewski",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  bio: "Uczeń 2 klasy o profilu biologiczno-chemicznym. Interesuję się genetyką, biologią komórkową i naukami ścisłymi.",
  schoolClass: "2LO",
  bookmarkedPosts: [],
  joinedDate: "2026-05-21",
  role: "student"
};

/**
 * Checks if the user is currently logged in.
 */
export function IsLoggedIn(): boolean {
  return localStorage.getItem("sf_logged_in") === "true";
}

/**
 * Gets the current logged in user from localStorage.
 */
export function GetCurrentUser(): SchoolUser {
  const data = localStorage.getItem("sf_user");
  let user: SchoolUser = DEFAULT_USER;
  if (data) {
    try {
      user = JSON.parse(data);
    } catch (_) {
      user = DEFAULT_USER;
    }
  }
  if (user && user.email && user.email.toLowerCase() === "szymonherb1234@gmail.com") {
    user.role = "admin";
  }
  return user;
}

/**
 * Saves the user state to localStorage.
 */
export function SaveUser(user: SchoolUser): void {
  if (user && user.email && user.email.toLowerCase() === "szymonherb1234@gmail.com") {
    user.role = "admin";
  }
  localStorage.setItem("sf_user", JSON.stringify(user));
  
  // Sync to general user registry
  const allUsers = GetAllRegisteredUsers();
  const index = allUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (index !== -1) {
    allUsers[index] = { ...allUsers[index], fullname: user.fullname, avatar: user.avatar, bio: user.bio, schoolClass: user.schoolClass, role: user.role };
  } else {
    allUsers.push(user);
  }
  SaveAllRegisteredUsers(allUsers);
}

/**
 * Retrieves the list of all registered users on the platform.
 */
export function GetAllRegisteredUsers(): SchoolUser[] {
  const data = localStorage.getItem("sf_all_registered_users");
  if (data) {
    try {
      return JSON.parse(data);
    } catch (_) {}
  }
  
  // High fidelity default platform members
  const defaultList: SchoolUser[] = [
    {
      email: "szymonherb1234@gmail.com",
      fullname: "Szymon Wiśniewski",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
      bio: "Uczeń 2LO o profilu biologiczno-chemicznym. Interesuję się biochemią, genetyką molekularną i neurobiologią.",
      schoolClass: "2LO",
      role: "admin",
      bookmarkedPosts: [],
      joinedDate: "2026-03-12"
    },
    {
      email: "natalia99@szkola.edu.pl",
      fullname: "Natalia Kowalska",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      bio: "Maniaczka języka polskiego i literatury romantycznej. Uwielbiam pisać wypracowania i wymieniać się notatkami.",
      schoolClass: "3LO",
      role: "student",
      bookmarkedPosts: [],
      joinedDate: "2026-04-01"
    },
    {
      email: "kamil_fizyka@wp.pl",
      fullname: "Kamil Zawadzki",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      bio: "Fizyka to moja pasja! Przygotowuję się do olimpiady krajowej. Chętnie pomogę w zadaniach z kinematyki.",
      schoolClass: "4LO",
      role: "student",
      bookmarkedPosts: [],
      joinedDate: "2026-04-10"
    },
    {
      email: "aneta.lewandowska@interia.pl",
      fullname: "Aneta Lewandowska",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
      bio: "Uczennica klasy pierwszej o profilu matematyczno-informatycznym. Zawsze optymistycznie nastawiona do szkoły!",
      schoolClass: "1LO",
      role: "student",
      bookmarkedPosts: [],
      joinedDate: "2026-05-02"
    }
  ];
  
  localStorage.setItem("sf_all_registered_users", JSON.stringify(defaultList));
  return defaultList;
}

/**
 * Persists the registered users database in localStorage.
 */
export function SaveAllRegisteredUsers(users: SchoolUser[]): void {
  localStorage.setItem("sf_all_registered_users", JSON.stringify(users));
}

/**
 * Automatically make user email admin if matching or if session has unlocked it.
 */
export function IsAdmin(): boolean {
  if (localStorage.getItem("sf_admin_mode_locked") === "true") {
    return false;
  }
  const u = GetCurrentUser();
  if (u && (u.role === "admin" || (u.email && u.email.toLowerCase() === "szymonherb1234@gmail.com"))) return true;
  return localStorage.getItem("sf_session_admin_unlocked") === "true";
}

/**
 * Performs mock Google OAuth sign-in, caching the user state.
 */
export function SignInWithGoogle(customEmail?: string, adminCode?: string): void {
  const code = adminCode ? adminCode.trim() : "";
  const email = customEmail && customEmail.includes("@") ? customEmail : DEFAULT_USER.email;

  // Check if banned
  const banned = JSON.parse(localStorage.getItem("sf_banned_users") || "[]");
  if (banned.includes(email.toLowerCase())) {
    alert(`LOGOWANIE ZABLOKOWANE:\nKonto o adresie ${email} zostało zbanowane przez administratora platformy systemowej.`);
    return;
  }

  let finalUser: SchoolUser = { ...DEFAULT_USER };

  if (code === "ADMIN2026") {
    finalUser = {
      email: "admin@schoolforum.pl",
      fullname: "Administrator Systemu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
      bio: "Główny administrator i moderator platformy SchoolForum.",
      schoolClass: "Ogólne",
      role: "admin",
      bookmarkedPosts: [],
      joinedDate: new Date().toISOString().substring(0, 10)
    };
  } else {
    // Extract name prefix for realistic full name
    let namePart = email.split("@")[0];
    namePart = namePart.split(/[._-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    if (!namePart || namePart.trim().length === 0) {
      namePart = DEFAULT_USER.fullname;
    }

    // Merge saved or create new
    const saved = localStorage.getItem("sf_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        finalUser = { ...parsed, email: email, fullname: namePart };
      } catch (_) {
        finalUser.email = email;
        finalUser.fullname = namePart;
      }
    } else {
      finalUser.email = email;
      finalUser.fullname = namePart;
    }

    // Automatically make user email admin if matching
    if (email.toLowerCase() === "szymonherb1234@gmail.com") {
      finalUser.role = "admin";
      finalUser.bio = "Główny administrator i moderator platformy SchoolForum.";
    } else {
      finalUser.role = "student";
    }
  }

  localStorage.setItem("sf_logged_in", "true");
  localStorage.setItem("sf_user", JSON.stringify(finalUser));
  localStorage.removeItem("sf_admin_mode_locked");
  
  // Register or update in general registry database
  const allUsers = GetAllRegisteredUsers();
  const index = allUsers.findIndex(u => u.email.toLowerCase() === finalUser.email.toLowerCase());
  if (index !== -1) {
    allUsers[index] = { ...allUsers[index], fullname: finalUser.fullname, avatar: finalUser.avatar, schoolClass: finalUser.schoolClass, role: finalUser.role };
  } else {
    allUsers.push(finalUser);
  }
  SaveAllRegisteredUsers(allUsers);
  
  // Clean redirect to dashboard
  window.location.href = "app.html";
}

/**
 * Logs out the user and cleans localStorage flags.
 */
export function LogOutUser(): void {
  localStorage.removeItem("sf_logged_in");
  localStorage.removeItem("sf_session_admin_unlocked");
  window.location.href = "index.html";
}

// INITIALIZATION LOGIC FOR INDEX.HTML (LANDING PAGE)
if (typeof window !== "undefined" && (window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/"))) {
  document.addEventListener("DOMContentLoaded", () => {
    // Check if already logged in and auto-redirect
    if (IsLoggedIn()) {
      const currentUser = GetCurrentUser();
      const banned = JSON.parse(localStorage.getItem("sf_banned_users") || "[]");
      if (banned.includes(currentUser.email.toLowerCase())) {
        localStorage.removeItem("sf_logged_in");
      } else {
        window.location.href = "app.html";
        return;
      }
    }

    // Bind Google Sign In Button
    const googleBtn = document.getElementById("google_login_btn");
    const emailInput = document.getElementById("user_email_input") as HTMLInputElement;
    const adminInput = document.getElementById("admin_code_input") as HTMLInputElement;

    if (googleBtn) {
      googleBtn.addEventListener("click", () => {
        const customEmail = emailInput ? emailInput.value.trim() : "";
        const adminCode = adminInput ? adminInput.value.trim() : "";
        SignInWithGoogle(customEmail, adminCode);
      });
    }

    // Bind Terms and Privacy Modal opening triggers
    const triggerPrivacy = document.getElementById("trigger_privacy_modal");
    const triggerTerms = document.getElementById("trigger_terms_modal");
    const modalPrivacy = document.getElementById("privacy_modal");
    const modalTerms = document.getElementById("terms_modal");
    const closePrivacy = document.getElementById("close_privacy_modal");
    const closeTerms = document.getElementById("close_terms_modal");

    if (triggerPrivacy && modalPrivacy) {
      triggerPrivacy.addEventListener("click", (e) => {
        e.preventDefault();
        modalPrivacy.classList.remove("hidden");
      });
    }
    if (triggerTerms && modalTerms) {
      triggerTerms.addEventListener("click", (e) => {
        e.preventDefault();
        modalTerms.classList.remove("hidden");
      });
    }
    if (closePrivacy && modalPrivacy) {
      closePrivacy.addEventListener("click", () => modalPrivacy.classList.add("hidden"));
      modalPrivacy.addEventListener("click", (e) => {
        if (e.target === modalPrivacy) modalPrivacy.classList.add("hidden");
      });
    }
    if (closeTerms && modalTerms) {
      closeTerms.addEventListener("click", () => modalTerms.classList.add("hidden"));
      modalTerms.addEventListener("click", (e) => {
        if (e.target === modalTerms) modalTerms.classList.add("hidden");
      });
    }

    // Toggle Config Guide collapsible panel
    const toggleGuideBtn = document.getElementById("toggle_config_guide");
    const guideContent = document.getElementById("config_guide_content");
    const chevronIcon = document.getElementById("chevron_icon");

    if (toggleGuideBtn && guideContent && chevronIcon) {
      toggleGuideBtn.addEventListener("click", () => {
        const isHidden = guideContent.classList.contains("hidden");
        if (isHidden) {
          guideContent.classList.remove("hidden");
          chevronIcon.classList.add("rotate-180");
        } else {
          guideContent.classList.add("hidden");
          chevronIcon.classList.remove("rotate-180");
        }
      });
    }

    // Theme Selector functionality
    const themeBtn = document.getElementById("theme_toggle_btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }
      });
    }
  });
}

/**
 * Modern non-blocking stylish custom confirmation dialog replacing native window.confirm inside iframes.
 */
export function customConfirm(title: string, message: string, onConfirm: () => void): void {
  // Clear existing if any
  const existing = document.getElementById("custom_confirm_modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "custom_confirm_modal";
  overlay.className = "fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-75";

  overlay.innerHTML = `
    <div class="w-full max-w-sm bg-white dark:bg-[#0c1424] border border-slate-205 dark:border-slate-800 rounded-3xl overflow-hidden p-6 space-y-4.5 shadow-2xl animate-in zoom-in-95 duration-100">
      <div class="flex items-center gap-2.5 text-rose-500 font-extrabold text-sm sm:text-base">
        <span class="text-lg">⚠️</span>
        <h3 class="text-slate-900 dark:text-white">${title}</h3>
      </div>
      <p class="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-semibold">${message.replace(/\n/g, "<br>")}</p>
      <div class="flex items-center justify-end gap-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-850">
        <button id="custom_confirm_cancel" type="button" class="cursor-pointer px-4.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-205 text-xs font-bold transition-all">Anuluj</button>
        <button id="custom_confirm_ok" type="button" class="cursor-pointer px-5 py-2 rounded-xl bg-red-650 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-500/10 hover:shadow-red-550/20">Potwierdź</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const cancelBtn = overlay.querySelector("#custom_confirm_cancel");
  const okBtn = overlay.querySelector("#custom_confirm_ok");

  const close = () => {
    overlay.remove();
  };

  cancelBtn?.addEventListener("click", close);
  okBtn?.addEventListener("click", () => {
    close();
    onConfirm();
  });
}

