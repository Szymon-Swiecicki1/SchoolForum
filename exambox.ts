/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetCurrentUser, IsAdmin, customConfirm } from "./auth";

export interface ExamAnswer {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  content: string;
  date: string;
  isCorrect: boolean; // Flag if helpful/vouched by others
}

export interface ExamQuestion {
  id: string;
  classId: string; // "1LO", "2LO", "3LO", "4LO", "Ogólne"
  subjectId: string; // "Matematyka", "Fizyka", etc
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  authorEmail?: string;
  date: string;
  answers: ExamAnswer[];
}

// Prepopulated curriculum topics
const INITIAL_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: "ex_q_1",
    classId: "2LO",
    subjectId: "Matematyka",
    title: "Rozkład wielomianu W(x) = x^3 - 3x^2 - 4x + 12 na czynniki",
    content: "Zupełnie zapomniałam, jak rozkładać wielomiany trzeciego stopnia metodą grupowania wyrazów. Czy ktoś mógłby rozpisać to zadanie krok po kroku?",
    authorName: "Anna Laskowska",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    date: "2026-05-21 11:20",
    answers: [
      {
        id: "ex_a_1a",
        authorName: "Krzysztof Kowalczyk",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
        content: "Grupujesz pierwsze dwa i ostatnie dwa wyrazy: \n W(x) = x^2(x - 3) - 4(x - 3).\nTeraz wyciągasz wspólny nawias (x - 3) przed całość:\n W(x) = (x - 3)(x^2 - 4).\nNa koniec rozbijasz x^2 - 4 ze wzoru skróconego mnożenia: (x-2)(x+2).\nOstatecznie: W(x) = (x - 3)(x - 2)(x + 2). Gotowe!",
        date: "2026-05-21 12:10",
        isCorrect: true
      }
    ]
  },
  {
    id: "ex_q_2",
    classId: "4LO",
    subjectId: "Biologia",
    title: "Obliczanie częstości genotypów z prawa Hardy'ego-Weinberga",
    content: "Mamy w populacji 16% jasnowłosych (cecha recesywna dd). Jak obliczyć procent heterozygot (Dd) w tej populacji zgodnie z prawem Hardy'ego-Weinberga?",
    authorName: "Jan Brzechwa",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    date: "2026-05-20 09:40",
    answers: [
      {
        id: "ex_a_2a",
        authorName: "Zofia Wiśniewska",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        content: "q^2 (częstość homozygot recesywnych) = 0.16, więc q (częstość allelu d) = pierwiastek(0.16) = 0.4.\nPonieważ p + q = 1, to p (allelu D) = 1 - 0.4 = 0.6.\nCzęstość heterozygot to 2pq:\n2 * 0.6 * 0.4 = 0.48, czyli 48% populacji stanowią heterozygoty Dd.",
        date: "2026-05-20 10:15",
        isCorrect: true
      }
    ]
  },
  {
    id: "ex_q_3",
    classId: "1LO",
    subjectId: "Fizyka",
    title: "Jak znaleźć prędkość końcową w ruchu jednostajnie przyspieszonym?",
    content: "Mam dane: droga S = 50m, czas t = 5s, prędkość początkowa v0 = 0 m/s. Potrzebuję obliczyć przyspieszenie a i prędkość końcową v. Pomocy, jutro kartkówka!",
    authorName: "Michał Szpak",
    authorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop",
    date: "2026-05-19 19:00",
    answers: []
  }
];

export const SUBJECT_LIST = [
  "Polski",
  "Matematyka",
  "Angielski",
  "Historia",
  "Fizyka",
  "Chemia",
  "Biologia",
  "Geografia",
  "Informatyka",
  "WOS"
];

// Tracking variables for currently selected filters
let selectedClass: string | null = null;
let selectedSubject: string | null = null;

export function GetExamQuestions(): ExamQuestion[] {
  const data = localStorage.getItem("sf_exams_questions");
  if (!data) {
    localStorage.setItem("sf_exams_questions", JSON.stringify(INITIAL_EXAM_QUESTIONS));
    return INITIAL_EXAM_QUESTIONS;
  }
  try {
    return JSON.parse(data);
  } catch (_) {
    return INITIAL_EXAM_QUESTIONS;
  }
}

export function SaveExamQuestions(questions: ExamQuestion[]): void {
  localStorage.setItem("sf_exams_questions", JSON.stringify(questions));
}

export function SetSelectedClassAndSubject(classId: string, subjectId: string | null): void {
  selectedClass = classId;
  selectedSubject = subjectId;
}

export function AddExamQuestion(classId: string, subjectId: string, title: string, content: string): ExamQuestion | null {
  const currentUser = GetCurrentUser();
  const muted = JSON.parse(localStorage.getItem("sf_muted_users") || "[]");
  if (muted.includes(currentUser.email.toLowerCase())) {
    alert("BŁĄD: Twoje konto zostało wyciszone przez administratora i nie możesz zadawać pytań.");
    return null;
  }
  const list = GetExamQuestions();

  const newQ: ExamQuestion = {
    id: "ex_q_" + Date.now(),
    classId,
    subjectId,
    title,
    content,
    authorName: currentUser.fullname,
    authorAvatar: currentUser.avatar,
    authorEmail: currentUser.email,
    date: new Date().toISOString().replace("T", " ").substring(0, 16),
    answers: []
  };

  list.unshift(newQ);
  SaveExamQuestions(list);
  return newQ;
}

export function AddExamAnswer(questionId: string, content: string): ExamQuestion | null {
  const currentUser = GetCurrentUser();
  const muted = JSON.parse(localStorage.getItem("sf_muted_users") || "[]");
  if (muted.includes(currentUser.email.toLowerCase())) {
    alert("BŁĄD: Twoje konto zostało wyciszone przez administratora i nie możesz dodawać odpowiedzi.");
    return null;
  }
  const list = GetExamQuestions();
  const qIndex = list.findIndex(q => q.id === questionId);
  if (qIndex === -1) return null;

  const newAns: ExamAnswer = {
    id: "ex_a_" + Date.now(),
    authorName: currentUser.fullname,
    authorAvatar: currentUser.avatar,
    authorEmail: currentUser.email,
    content,
    date: new Date().toISOString().replace("T", " ").substring(0, 16),
    isCorrect: false
  };

  list[qIndex].answers.push(newAns);
  SaveExamQuestions(list);
  return list[qIndex];
}

export function SetCheckedAnswer(questionId: string, answerId: string): ExamQuestion | null {
  const list = GetExamQuestions();
  const qIndex = list.findIndex(q => q.id === questionId);
  if (qIndex === -1) return null;

  const q = list[qIndex];
  q.answers.forEach(a => {
    if (a.id === answerId) {
      a.isCorrect = !a.isCorrect; // Toggle state
    }
  });

  list[qIndex] = q;
  SaveExamQuestions(list);
  return q;
}

/**
 * Renders the Exam module view entirely
 */
export function RenderExamsModule(): void {
  // Setup Class tab status markers dynamically
  const tabsContainer = document.getElementById("exams_class_tabs_container");
  const classesList = ["1LO", "2LO", "3LO", "4LO", "Ogólne"];

  if (tabsContainer) {
    tabsContainer.innerHTML = classesList.map(cls => {
      const isClassSelected = cls === selectedClass;

      // Generate the internal animated subject selectors
      const hoverSubjectsHtml = SUBJECT_LIST.map(sub => {
        const isSubSelected = (cls === selectedClass) && (sub === selectedSubject);
        const activeSubStyles = isSubSelected 
          ? "bg-blue-600 text-white font-extrabold shadow-sm"
          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80";

        return `
          <button class="exam-sub-hover-btn px-2.5 py-1.5 rounded-lg text-[10px] text-left transition-all font-bold cursor-pointer ${activeSubStyles}" data-class="${cls}" data-subject="${sub}">
            ${sub}
          </button>
        `;
      }).join("");

      const bgClassStyles = isClassSelected
        ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-[#ffffff] shadow-xs"
        : "text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-transparent";

      return `
        <div class="relative group/class flex-grow">
          <!-- Main Class Tab Trigger -->
          <button class="w-full py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${bgClassStyles} exam-class-tab" data-class="${cls}">
            ${cls}
          </button>
          
          <!-- Animated Hover Bar of Subjects -->
          <div class="absolute left-1/2 -translate-x-1/2 top-full pt-2 hidden group-hover/class:block z-50 w-52 text-left">
            <div class="grid grid-cols-2 gap-1 p-2 bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl animate-in fade-in slide-in-from-top-1 duration-150">
              <div class="col-span-2 text-[8px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1.5 pb-1 leading-none">Wybierz przedmiot:</div>
              ${hoverSubjectsHtml}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind subject select click handlers inside the interactive hover-belts
    document.querySelectorAll(".exam-sub-hover-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const cls = (e.currentTarget as HTMLElement).getAttribute("data-class");
        const sub = (e.currentTarget as HTMLElement).getAttribute("data-subject");
        if (cls && sub) {
          selectedClass = cls;
          selectedSubject = sub;
          RenderExamsModule();
        }
      });
    });

    // Bind primary button click handlers to activate main class tab
    document.querySelectorAll(".exam-class-tab").forEach(tab => {
      tab.addEventListener("click", (e) => {
        const cls = (e.currentTarget as HTMLElement).getAttribute("data-class");
        if (cls) {
          selectedClass = cls;
          selectedSubject = null; // show selection help initially
          RenderExamsModule();
        }
      });
    });
  }

  // Handle Subjects Grid status rendering
  const chatContainer = document.getElementById("exams_chat_container");

  // Handle active mini-forum board
  if (!selectedSubject) {
    if (chatContainer) {
      chatContainer.innerHTML = `
        <div class="text-center rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-850 p-8 sm:p-12 space-y-4 shadow-2xs">
          <div class="w-14 h-14 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 text-xl font-bold animate-pulse">
            🔍
          </div>
          <h3 class="font-extrabold text-slate-900 dark:text-white text-base">Wybierz Przedmiot z Menu</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Najedź kursorem myszy na dowolną klasę u góry (np. <strong class="text-slate-700 dark:text-slate-300">1LO</strong> lub <strong class="text-slate-700 dark:text-slate-300">Ogólne</strong>), a następnie wybierz przedmiot z animowanego paska, który się rozwinie!
          </p>
        </div>
      `;
      chatContainer.classList.remove("hidden");
    }
    return;
  }

  if (chatContainer) {
    chatContainer.classList.remove("hidden");
    
    // Fetch filtered questions
    const allQ = GetExamQuestions();
    const filteredQ = allQ.filter(q => q.classId === selectedClass && q.subjectId === selectedSubject);
    let questionsFeedHtml = "";
    const currentUser = GetCurrentUser();
    const isAdminUser = IsAdmin();

    if (filteredQ.length === 0) {
      questionsFeedHtml = `
        <div class="py-10 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800">
          <p class="text-xs text-slate-500 dark:text-slate-400">Brak pytań w tej kategorii. Bądź pierwszą osobą, która poprosi o pomoc!</p>
        </div>
      `;
    } else {
      questionsFeedHtml = filteredQ.map(q => {
        const answersHtml = q.answers.map(ans => {
          const isAnswerOwner = ans.authorEmail && ans.authorEmail.toLowerCase() === currentUser.email.toLowerCase();
          const eligibleToDeleteAnswer = isAnswerOwner || isAdminUser;

          return `
            <div class="p-4 rounded-xl border ${ans.isCorrect ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-500/5 dark:bg-emerald-950/20' : 'border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-[#121a2c]/65'} flex gap-3.5 relative">
              <img src="${ans.authorAvatar}" alt="avatar" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 view-user-profile-trigger cursor-pointer hover:opacity-85 transition-opacity" data-user-email="${ans.authorEmail || ''}" />
              <div class="space-y-1.5 min-w-0 flex-grow">
                <!-- Top Row Header -->
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold text-xs text-slate-900 dark:text-slate-150 leading-tight view-user-profile-trigger cursor-pointer hover:underline" data-user-email="${ans.authorEmail || ''}">${ans.authorName}</span>
                    <span class="text-[9px] text-slate-500 dark:text-slate-400 font-bold leading-none">${ans.date}</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0 select-none">
                    <!-- Toggle Helpful Marker Button -->
                    <button class="toggle-correct-answer-btn px-2.5 py-1 rounded-lg border text-[10px] font-extrabold cursor-pointer transition-all ${ans.isCorrect ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500'}" data-question-id="${q.id}" data-answer-id="${ans.id}">
                      ${ans.isCorrect ? '✓ Pomocna' : 'Oznacz jako pomocną'}
                    </button>
                    ${eligibleToDeleteAnswer ? `
                      <button class="delete-answer-btn p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500 hover:text-rose-650 cursor-pointer text-xs" data-question-id="${q.id}" data-answer-id="${ans.id}" title="Usuń tę odpowiedź">
                        🗑️
                      </button>
                    ` : ""}
                  </div>
                </div>
                <!-- Content text with custom high readability classes in light & dark mode -->
                <p class="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">${ans.content}</p>
              </div>
            </div>
          `;
        }).join("");

        const isQuestionOwner = q.authorEmail && q.authorEmail.toLowerCase() === currentUser.email.toLowerCase();
        const eligibleToDeleteQuestion = isQuestionOwner || isAdminUser;

        return `
          <!-- Question card -->
          <div class="p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-4 bg-white dark:bg-[#0c1424] shadow-xs">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5 view-user-profile-trigger cursor-pointer hover:opacity-85 transition-opacity" data-user-email="${q.authorEmail || ''}">
                <img src="${q.authorAvatar}" alt="Avatar" class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0" />
                <div>
                  <div class="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-tight">${q.authorName}</div>
                  <div class="text-[9px] text-slate-550 dark:text-slate-400 mt-0.5 leading-none font-bold">${q.date}</div>
                </div>
              </div>
              <span class="px-2.5 py-1.5 rounded-xl bg-blue-100/60 dark:bg-blue-950/50 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                ${q.classId} &middot; ${q.subjectId}  
              </span>
            </div>

            <div class="space-y-1">
              <h3 class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">${q.title}</h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">${q.content}</p>
            </div>

            <!-- Action bar for comment collapse and deleting questions -->
            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-850 text-xs font-semibold select-none">
              <button class="toggle-answers-btn flex items-center gap-1.5 text-slate-550 dark:text-slate-450 hover:text-blue-500 transition-colors cursor-pointer font-extrabold" data-question-id="${q.id}">
                💬 <span>Odpowiedzi i rozwiązania (${q.answers.length})</span>
              </button>
              
              <!-- Delete trigger for authorized users -->
              ${eligibleToDeleteQuestion ? `
                <button class="delete-question-btn p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 hover:text-red-650 cursor-pointer text-xs flex items-center gap-1 font-bold" data-question-id="${q.id}" title="Usuń to pytanie">
                  <span>🗑️ Usuń</span>
                </button>
              ` : ""}
            </div>

            <!-- Nested answers (collapsible box: hidden by default unless clicked) -->
            <div id="answers_box_${q.id}" class="answers-section-box space-y-2.5 pt-3 border-t border-slate-105 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 p-3 rounded-2xl hidden">
              <span class="block text-[10px] font-extrabold uppercase tracking-wide text-slate-705 dark:text-slate-300">Pomocne odpowiedzi (${q.answers.length})</span>
              <div class="space-y-2.5 mt-2">
                ${answersHtml.length > 0 ? answersHtml : '<p class="text-[10px] text-slate-450 italic pl-1">Brak odpowiedzi w tej chwili. Bądź pierwszym, który pomoże!</p>'}
              </div>
            </div>

            <!-- Post New Answer Form -->
            <form class="add-exam-answer-form flex gap-2 items-center pt-2" data-question-id="${q.id}">
              <input type="text" placeholder="Wytłumacz zadanie i pomóż..." class="answer-input-field flex-grow px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              <button type="submit" class="p-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer">Odpowiedz</button>
            </form>
          </div>
        `;
      }).join("");
    }

    chatContainer.innerHTML = `
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
        <div>
          <span class="text-xs font-semibold text-slate-400">Pytania z działu:</span>
          <h2 class="text-md sm:text-lg font-extrabold text-[#204ec1] dark:text-[#5c8eff] leading-snug">${selectedClass} &middot; ${selectedSubject}</h2>
        </div>
        <button id="close_exams_chat_btn" class="text-xs font-bold text-slate-450 hover:text-slate-800 dark:hover:text-white hover:underline cursor-pointer">Resetuj Wybór</button>
      </div>

      <!-- Add post form -->
      <form id="add_exam_question_form" class="space-y-3 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
        <span class="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest leading-none">Zadaj nowe pytanie / dodaj problem</span>
        
        <div class="space-y-2">
          <input type="text" id="exam_q_form_title" placeholder="Czego dotyczy pytanie? (np. Problem z zadaniem 3 - trygonometria)" class="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none" required />
          <textarea id="exam_q_form_content" rows="2" placeholder="Przepisz równanie lub opisz szczegółowo swój błąd..." class="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none" required></textarea>
        </div>

        <div class="flex justify-end pt-1">
          <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow shadow-blue-500/10 cursor-pointer">Wyślij Pytanie</button>
        </div>
      </form>

      <!-- Questions lists feed -->
      <div class="space-y-3.5 pt-3">
        ${questionsFeedHtml}
      </div>
    `;

    // Bind sub-chat control elements
    const closeChatBtn = document.getElementById("close_exams_chat_btn");
    if (closeChatBtn) {
      closeChatBtn.addEventListener("click", () => {
        selectedSubject = null;
        RenderExamsModule();
      });
    }

    // Submit new exam question
    const qForm = document.getElementById("add_exam_question_form") as HTMLFormElement;
    if (qForm) {
      qForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const titleInput = document.getElementById("exam_q_form_title") as HTMLInputElement;
        const contentInput = document.getElementById("exam_q_form_content") as HTMLTextAreaElement;
        
        if (selectedClass && selectedSubject && titleInput && contentInput) {
          const added = AddExamQuestion(selectedClass, selectedSubject, titleInput.value.trim(), contentInput.value.trim());
          if (added) {
            titleInput.value = "";
            contentInput.value = "";
            RenderExamsModule();
          }
        }
      });
    }

    // Submit individual answers
    document.querySelectorAll(".add-exam-answer-form").forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentForm = e.currentTarget as HTMLFormElement;
        const qId = currentForm.getAttribute("data-question-id");
        const ansInput = currentForm.querySelector(".answer-input-field") as HTMLInputElement;

        if (qId && ansInput && ansInput.value.trim().length > 0) {
          const added = AddExamAnswer(qId, ansInput.value.trim());
          if (added) {
            ansInput.value = "";
            RenderExamsModule();
            
            // Automatically keep active collapsed box open
            const targetBox = document.getElementById(`answers_box_${qId}`);
            if (targetBox) targetBox.classList.remove("hidden");
          }
        }
      });
    });

    // Toggle check stars / helper badge
    document.querySelectorAll(".toggle-correct-answer-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const qId = (e.currentTarget as HTMLElement).getAttribute("data-question-id");
        const aId = (e.currentTarget as HTMLElement).getAttribute("data-answer-id");
        if (qId && aId) {
          SetCheckedAnswer(qId, aId);
          RenderExamsModule();
          
          const targetBox = document.getElementById(`answers_box_${qId}`);
          if (targetBox) targetBox.classList.remove("hidden");
        }
      });
    });

    // Toggle Collapsible Answers
    document.querySelectorAll(".toggle-answers-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const qId = (e.currentTarget as HTMLElement).getAttribute("data-question-id");
        if (qId) {
          const targetBox = document.getElementById(`answers_box_${qId}`);
          if (targetBox) {
            targetBox.classList.toggle("hidden");
          }
        }
      });
    });

    // Delete entire Question
    document.querySelectorAll(".delete-question-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const qId = (e.currentTarget as HTMLElement).getAttribute("data-question-id");
        if (qId) {
          customConfirm("USUWANIE PYTANIA", "Czy na pewno chcesz usunąć to pytanie z paska zadań?", () => {
            const list = GetExamQuestions();
            const filtered = list.filter(q => q.id !== qId);
            SaveExamQuestions(filtered);
            RenderExamsModule();
          });
        }
      });
    });

    // Delete single Answer reply
    document.querySelectorAll(".delete-answer-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const qId = (e.currentTarget as HTMLElement).getAttribute("data-question-id");
        const aId = (e.currentTarget as HTMLElement).getAttribute("data-answer-id");
        if (qId && aId) {
          customConfirm("USUWANIE ODPOWIEDZI", "Czy na pewno chcesz usunąć tę odpowiedź pomocną?", () => {
            const list = GetExamQuestions();
            const qIdx = list.findIndex(q => q.id === qId);
            if (qIdx !== -1) {
              list[qIdx].answers = list[qIdx].answers.filter(a => a.id !== aId);
              SaveExamQuestions(list);
              RenderExamsModule();
              
              const targetBox = document.getElementById(`answers_box_${qId}`);
              if (targetBox) targetBox.classList.remove("hidden");
            }
          });
        }
      });
    });

    // Fire user profile popup triggers inside questions dynamically
    if (typeof (window as any).BindUserProfileTriggersGlobal === "function") {
      (window as any).BindUserProfileTriggersGlobal();
    }
  }
}

/**
 * Hook initializer to setup class selections
 */
export function InitExamsController(): void {
  // Select user default class from their preferences dynamically
  const user = GetCurrentUser();
  selectedClass = user.schoolClass || "2LO";
  selectedSubject = "Matematyka";

  RenderExamsModule();
}
