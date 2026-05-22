/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolUser, GetCurrentUser, IsAdmin, customConfirm } from "./auth";

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: string;
  attachmentType?: "image" | "file" | "gif";
  attachmentUrl?: string;
  attachmentName?: string;
  authorEmail?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  subject: string;
  schoolClass: string;
  fileName: string | null;
  fileSize: string | null;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  date: string;
  likes: number;
  likedBy: string[]; // List of user emails who liked this post
  comments: PostComment[];
}

// Fictional starter posts cleared on user's request. List is set to empty []
const INITIAL_POSTS: ForumPost[] = [];

/**
 * Gets active list of posts, initializing keys if needed.
 */
export function GetForumPosts(): ForumPost[] {
  const data = localStorage.getItem("sf_posts");
  if (!data) {
    localStorage.setItem("sf_posts", JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  try {
    return JSON.parse(data);
  } catch (_) {
    return INITIAL_POSTS;
  }
}

/**
 * Persists the posts set to localStorage.
 */
export function SaveForumPosts(posts: ForumPost[]): void {
  localStorage.setItem("sf_posts", JSON.stringify(posts));
}

/**
 * Adds a new post.
 */
export function AddForumPost(
  title: string,
  content: string,
  subject: string,
  schoolClass: string,
  fileName: string | null = null,
  fileSize: string | null = null
): ForumPost | null {
  const currentUser = GetCurrentUser();
  const muted = JSON.parse(localStorage.getItem("sf_muted_users") || "[]");
  if (muted.includes(currentUser.email.toLowerCase())) {
    alert("BŁĄD: Twoje konto zostało wyciszone przez administratora i nie możesz dodawać nowych postów.");
    return null;
  }
  const posts = GetForumPosts();

  const newPost: ForumPost = {
    id: "post_" + Date.now(),
    title,
    content,
    subject,
    schoolClass,
    fileName,
    fileSize,
    authorName: currentUser.fullname,
    authorEmail: currentUser.email,
    authorAvatar: currentUser.avatar,
    date: new Date().toISOString().replace("T", " ").substring(0, 16),
    likes: 0,
    likedBy: [],
    comments: []
  };

  posts.unshift(newPost);
  SaveForumPosts(posts);
  return newPost;
}

/**
 * Likes or unlikes a post.
 */
export function ToggleLikePost(postId: string, userEmail: string): ForumPost | null {
  const posts = GetForumPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return null;

  const post = posts[postIndex];
  const likedIndex = post.likedBy.indexOf(userEmail);

  if (likedIndex === -1) {
    // Like
    post.likedBy.push(userEmail);
    post.likes += 1;
  } else {
    // Unlike
    post.likedBy.splice(likedIndex, 1);
    post.likes -= 1;
  }

  posts[postIndex] = post;
  SaveForumPosts(posts);
  return post;
}

/**
 * Appends a comment to a post with optional attachments.
 */
export function AddCommentToPost(
  postId: string, 
  commentContent: string,
  attachmentType?: "image" | "file" | "gif",
  attachmentUrl?: string,
  attachmentName?: string
): ForumPost | null {
  const posts = GetForumPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return null;

  const currentUser = GetCurrentUser();
  const muted = JSON.parse(localStorage.getItem("sf_muted_users") || "[]");
  if (muted.includes(currentUser.email.toLowerCase())) {
    alert("BŁĄD: Twoje konto zostało wyciszone przez administratora i nie możesz pisać komentarzy.");
    return null;
  }
  
  const newComment: PostComment = {
    id: "comm_" + Date.now(),
    authorName: currentUser.fullname,
    authorAvatar: currentUser.avatar,
    content: commentContent,
    date: new Date().toISOString().replace("T", " ").substring(0, 16),
    attachmentType,
    attachmentUrl,
    attachmentName,
    authorEmail: currentUser.email
  };

  posts[postIndex].comments.push(newComment);
  SaveForumPosts(posts);
  return posts[postIndex];
}

/**
 * Render the main forum view dynamically.
 */
export function RenderForumFeed(filterClass: string = "all", filterSubject: string = "all"): void {
  const container = document.getElementById("forum_posts_feed");
  if (!container) return;

  const currentUser = GetCurrentUser();
  const posts = GetForumPosts();

  // Apply filters
  const filteredPosts = posts.filter(post => {
    const classMatch = filterClass === "all" || post.schoolClass === filterClass;
    const subjectMatch = filterSubject === "all" || post.subject === filterSubject;
    return classMatch && subjectMatch;
  });

  if (filteredPosts.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800/80">
        <svg class="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="font-extrabold text-slate-700 dark:text-slate-300 text-base">Brak postów</h3>
        <p class="text-xs text-slate-450 mt-1 max-w-xs mx-auto">Żaden uczeń nie dodał jeszcze wpisu spełniającego te kryteria. Bądź pierwszy!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredPosts.map(post => {
    const isLikedByMe = post.likedBy.includes(currentUser.email);
    const hasBookmark = currentUser.bookmarkedPosts.includes(post.id);
    const fileHtml = post.fileName ? `
      <!-- Attachment Badge -->
      <div class="mt-3 flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-2.5 overflow-hidden">
          <div class="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-650 dark:text-orange-400">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div class="overflow-hidden">
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${post.fileName}</div>
            <div class="text-[9px] text-slate-400">${post.fileSize || "Zasób"} &middot; Kliknij, aby pobrać</div>
          </div>
        </div>
        <button type="button" class="download-attachment-btn text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0" data-filename="${post.fileName}">Pobierz</button>
      </div>
    ` : "";

    const commentsHtml = post.comments.map(c => {
      let attachmentHtml = "";
      if (c.attachmentType === "image" && c.attachmentUrl) {
        attachmentHtml = `
          <div class="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-xs shadow-2xs">
            <img src="${c.attachmentUrl}" alt="Załączone zdjęcie" class="w-full h-auto max-h-40 object-cover" />
          </div>
        `;
      } else if (c.attachmentType === "gif" && c.attachmentUrl) {
        attachmentHtml = `
          <div class="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-xs shadow-2xs">
            <img src="${c.attachmentUrl}" alt="Załączony GIF" class="w-full h-auto max-h-40 object-cover" />
          </div>
        `;
      } else if (c.attachmentType === "file" && c.attachmentName) {
        attachmentHtml = `
          <div class="mt-2 flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] w-fit">
            <span class="text-orange-500 text-xs">📄</span>
            <span class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-40">${c.attachmentName}</span>
            <span class="text-[9px] text-slate-400 font-semibold">(Dokument)</span>
          </div>
        `;
      }

      const isCommentWriter = c.authorEmail && c.authorEmail.toLowerCase() === currentUser.email.toLowerCase();
      const eligibleToDeleteComment = isCommentWriter || IsAdmin();

      return `
        <div class="flex gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-105 dark:border-slate-850">
          <img src="${c.authorAvatar}" alt="avatar" class="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 view-user-profile-trigger cursor-pointer hover:opacity-85 transition-opacity" data-user-email="${c.authorEmail || ''}" />
          <div class="space-y-0.5 min-w-0 flex-grow">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs text-slate-800 dark:text-slate-200 leading-none view-user-profile-trigger cursor-pointer hover:underline" data-user-email="${c.authorEmail || ''}">${c.authorName}</span>
              <div class="flex items-center gap-2">
                <span class="text-[9px] text-slate-400 leading-none">${c.date}</span>
                ${eligibleToDeleteComment ? `
                  <button class="delete-comment-btn text-rose-500 hover:text-rose-650 font-bold text-[10px] cursor-pointer" data-post-id="${post.id}" data-comment-id="${c.id}" title="Usuń komentarz">✕</button>
                ` : ""}
              </div>
            </div>
            <p class="text-xs text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">${c.content}</p>
            ${attachmentHtml}
          </div>
        </div>
      `;
    }).join("");

    const isPostOwner = post.authorEmail.toLowerCase() === currentUser.email.toLowerCase();
    const eligibleToDeletePost = isPostOwner || IsAdmin();

    return `
      <!-- Individual Post Card -->
      <article class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4" data-post-id="${post.id}">
        <!-- Top Author Header -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${post.authorAvatar}" alt="Avatar" class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover view-user-profile-trigger cursor-pointer hover:opacity-85 transition-opacity" data-user-email="${post.authorEmail}" />
            <div>
              <div class="font-extrabold text-sm text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                <span class="view-user-profile-trigger cursor-pointer hover:underline" data-user-email="${post.authorEmail}">${post.authorName}</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-[10px] font-bold text-slate-500">${post.schoolClass}</span>
              </div>
              <div class="text-[10px] text-slate-450 mt-0.5">${post.date} &middot; <span class="font-semibold text-blue-600 dark:text-blue-400">${post.subject}</span></div>
            </div>
          </div>

          <!-- Controls (Bookmark + Trash delete) -->
          <div class="flex items-center gap-2">
            ${eligibleToDeletePost ? `
              <button class="delete-post-btn p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 hover:text-red-650 transition-all cursor-pointer text-xs" data-post-id="${post.id}" title="Usuń ten wpis">
                🗑️
              </button>
            ` : ""}
            <button class="bookmark-btn p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer ${hasBookmark ? 'text-amber-500' : ''}" data-post-id="${post.id}">
              <svg class="w-4.5 h-4.5" fill="${hasBookmark ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </button>
          </div>
        </div>

        <!-- Post Content body -->
        <div class="space-y-2">
          <h2 class="text-base sm:text-md font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">${post.title}</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">${post.content}</p>
        </div>

        ${fileHtml}

        <!-- Post Actions Footer (like, share, comments toggler) -->
        <div class="flex items-center gap-6 pt-3 border-t border-slate-105 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none font-bold">
          <!-- Like -->
          <button class="like-btn flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer group ${isLikedByMe ? 'text-red-500' : ''}" data-post-id="${post.id}">
            <svg class="w-4.5 h-4.5" transform group-active:scale-125 transition-transform" fill="${isLikedByMe ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span>${post.likes}</span>
          </button>

          <!-- Comment Count -->
          <button class="toggle-comment-box-btn flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer" data-post-id="${post.id}">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span>Komentarze (${post.comments.length})</span>
          </button>
        </div>

        <!-- Comments Section drawer -->
        <div class="comments-section-box space-y-3 hidden pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <div class="comments-list space-y-2 max-h-60 overflow-y-auto w-full">
            ${commentsHtml}
          </div>

          <!-- Add Comment Input Area -->
          <form class="add-comment-form space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850/50" data-post-id="${post.id}">
            <!-- Media Preview Bar -->
            <div class="comment-media-preview-bar flex items-center gap-2 hidden p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
              <span class="media-preview-icon">📎</span>
              <span class="media-preview-text flex-grow truncate">Brak załącznika</span>
              <button type="button" class="remove-comment-media-btn hover:text-rose-500 font-extrabold px-1.5 cursor-pointer">✕</button>
            </div>

            <div class="flex gap-2 items-center">
              <input type="text" placeholder="Dodaj pomocny komentarz..." class="comment-input-field flex-grow px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium" required />
              
              <!-- Quick Attachment Menu Action Buttons -->
              <div class="flex items-center gap-1.5 shrink-0 select-none">
                <!-- Image Attachment Sim Button -->
                <button type="button" title="Załącz rysunek/zdjęcie" class="attach-comment-image-btn p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-450 hover:text-blue-500 cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs">🖼️</button>
                <!-- File Attachment Sim Button -->
                <button type="button" title="Załącz dokument PDF" class="attach-comment-file-btn p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-455 hover:text-orange-500 cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs">📁</button>
                <!-- GIF Sim Button -->
                <button type="button" title="Załącz GIF lub reakcję" class="attach-comment-gif-btn p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-455 hover:text-pink-500 cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs">🎬</button>
              </div>

              <button type="submit" class="p-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 hover:shadow-lg transition-all shrink-0 cursor-pointer">OK</button>
            </div>
          </form>
        </div>
      </article>
    `;
  }).join("");

  // Bind dynamic click events
  BindForumEvents();
}

/**
 * Attaches real event handlers to generated forum cards.
 */
function BindForumEvents(): void {
  const currentUser = GetCurrentUser();

  // Downloads files simulation
  document.querySelectorAll(".download-attachment-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const filename = (e.currentTarget as HTMLElement).getAttribute("data-filename");
      if (filename) {
        alert(`Rozpoczęto pobieranie pliku: ${filename}`);
      }
    });
  });

  // Infinite likes toggler
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const postId = (e.currentTarget as HTMLElement).getAttribute("data-post-id");
      if (postId) {
        const updated = ToggleLikePost(postId, currentUser.email);
        if (updated) {
          // Re-render feed keeping current filters
          const activeClass = (document.getElementById("filter_class") as HTMLSelectElement)?.value || "all";
          const activeSubject = (document.getElementById("filter_subject") as HTMLSelectElement)?.value || "all";
          RenderForumFeed(activeClass, activeSubject);
        }
      }
    });
  });

  // Toggles the visible comment box drawer
  document.querySelectorAll(".toggle-comment-box-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = (e.currentTarget as HTMLElement).closest("article");
      const box = card?.querySelector(".comments-section-box");
      if (box) {
        box.classList.toggle("hidden");
      }
    });
  });

  // Media Attachment trigger buttons
  document.querySelectorAll(".add-comment-form").forEach(form => {
    const fElement = form as HTMLFormElement;
    const previewBar = fElement.querySelector(".comment-media-preview-bar") as HTMLDivElement;
    const previewText = fElement.querySelector(".media-preview-text") as HTMLSpanElement;
    const previewIcon = fElement.querySelector(".media-preview-icon") as HTMLSpanElement;
    const removeMediaBtn = fElement.querySelector(".remove-comment-media-btn") as HTMLButtonElement;

    // Attach Photo selection
    fElement.querySelector(".attach-comment-image-btn")?.addEventListener("click", () => {
      fElement.setAttribute("data-attachment-type", "image");
      fElement.setAttribute("data-attachment-name", "wykres_geometria_3D.png");
      fElement.setAttribute("data-attachment-url", "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=256&auto=format&fit=crop");
      
      if (previewBar && previewText && previewIcon) {
        previewIcon.textContent = "🖼️";
        previewText.textContent = "Załączono wykres_geometria_3D.png (1.2 MB)";
        previewBar.classList.remove("hidden");
      }
    });

    // Attach Document choice
    fElement.querySelector(".attach-comment-file-btn")?.addEventListener("click", () => {
      fElement.setAttribute("data-attachment-type", "file");
      fElement.setAttribute("data-attachment-name", "notatki_dodatkowe_sprawdzian.pdf");
      fElement.removeAttribute("data-attachment-url");
      
      if (previewBar && previewText && previewIcon) {
        previewIcon.textContent = "📄";
        previewText.textContent = "Załączono notatki_dodatkowe_sprawdzian.pdf (2.4 MB)";
        previewBar.classList.remove("hidden");
      }
    });

    // Attach GIF choice
    fElement.querySelector(".attach-comment-gif-btn")?.addEventListener("click", () => {
      const gifs = [
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZkYWtzcmw0bmdtazVxand1YWhwd2d5Nmc2aWh1N29sbmw0YzRnNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qE1YN7aBOFPRw8E/giphy.gif", // Newton apple
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB0YmVqZHkyZnR1ZWhhbjhldmRtOTNreHJidnlma2oxejF4YWdtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gR0YFZxW5Y1Rj8s/giphy.gif", // Calculation mind
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWdzMHh5NDRraXJnb3g4eWNlM2g5YnVybGNhdHk5am5uMXB4bmI0OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DHqth0hVQAIyk/giphy.gif"  // Einstein tongue Out
      ];
      const selectedGif = gifs[Math.floor(Math.random() * gifs.length)];
      
      fElement.setAttribute("data-attachment-type", "gif");
      fElement.setAttribute("data-attachment-name", "reakcja_nauka.gif");
      fElement.setAttribute("data-attachment-url", selectedGif);
      
      if (previewBar && previewText && previewIcon) {
        previewIcon.textContent = "🎬";
        previewText.textContent = "Załączono reakcja_nauka.gif (GIF)";
        previewBar.classList.remove("hidden");
      }
    });

    // Clear attachment selection
    removeMediaBtn?.addEventListener("click", () => {
      fElement.removeAttribute("data-attachment-type");
      fElement.removeAttribute("data-attachment-name");
      fElement.removeAttribute("data-attachment-url");
      if (previewBar) {
        previewBar.classList.add("hidden");
      }
    });
  });

  // Submit comments
  document.querySelectorAll(".add-comment-form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentForm = e.currentTarget as HTMLFormElement;
      const postId = currentForm.getAttribute("data-post-id");
      const input = currentForm.querySelector(".comment-input-field") as HTMLInputElement;
      
      const attachmentType = currentForm.getAttribute("data-attachment-type") as "image" | "file" | "gif" | undefined;
      const attachmentName = currentForm.getAttribute("data-attachment-name") || undefined;
      const attachmentUrl = currentForm.getAttribute("data-attachment-url") || undefined;

      if (postId && input && input.value.trim().length > 0) {
        const commentContent = input.value.trim();
        const updated = AddCommentToPost(postId, commentContent, attachmentType, attachmentUrl, attachmentName);
        if (updated) {
          input.value = "";
          
          // Reset attributes and preview
          currentForm.removeAttribute("data-attachment-type");
          currentForm.removeAttribute("data-attachment-name");
          currentForm.removeAttribute("data-attachment-url");
          currentForm.querySelector(".comment-media-preview-bar")?.classList.add("hidden");

          const activeClass = (document.getElementById("filter_class") as HTMLSelectElement)?.value || "all";
          const activeSubject = (document.getElementById("filter_subject") as HTMLSelectElement)?.value || "all";
          RenderForumFeed(activeClass, activeSubject);
          
          // Keep the comment box open after rendering
          setTimeout(() => {
            const newCard = document.querySelector(`article[data-post-id="${postId}"]`);
            const newBox = newCard?.querySelector(".comments-section-box");
            if (newBox) {
              newBox.classList.remove("hidden");
            }
          }, 50);
        }
      }
    });
  });

  // Bookmark toggles
  document.querySelectorAll(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const postId = (e.currentTarget as HTMLElement).getAttribute("data-post-id");
      if (postId) {
        const user = GetCurrentUser();
        const bIndex = user.bookmarkedPosts.indexOf(postId);
        if (bIndex === -1) {
          user.bookmarkedPosts.push(postId);
        } else {
          user.bookmarkedPosts.splice(bIndex, 1);
        }
        user.bookmarkedPosts = [...new Set(user.bookmarkedPosts)];
        localStorage.setItem("sf_user", JSON.stringify(user));

        const activeClass = (document.getElementById("filter_class") as HTMLSelectElement)?.value || "all";
        const activeSubject = (document.getElementById("filter_subject") as HTMLSelectElement)?.value || "all";
        RenderForumFeed(activeClass, activeSubject);
      }
    });
  });

  // Delete post
  document.querySelectorAll(".delete-post-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const postId = (e.currentTarget as HTMLElement).getAttribute("data-post-id");
      if (postId) {
        customConfirm("KASOWANIE WPISU", "Czy na pewno chcesz bezpowrotnie usunąć ten wpis z forum?", () => {
          const posts = GetForumPosts();
          const filtered = posts.filter(p => p.id !== postId);
          SaveForumPosts(filtered);
          
          const activeClass = (document.getElementById("filter_class") as HTMLSelectElement)?.value || "all";
          const activeSubject = (document.getElementById("filter_subject") as HTMLSelectElement)?.value || "all";
          RenderForumFeed(activeClass, activeSubject);
        });
      }
    });
  });

  // Delete comment
  document.querySelectorAll(".delete-comment-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const postId = (e.currentTarget as HTMLElement).getAttribute("data-post-id");
      const commentId = (e.currentTarget as HTMLElement).getAttribute("data-comment-id");
      if (postId && commentId) {
        customConfirm("KASOWANIE KOMENTARZA", "Czy na pewno chcesz usunąć ten komentarz?", () => {
          const posts = GetForumPosts();
          const postIndex = posts.findIndex(p => p.id === postId);
          if (postIndex !== -1) {
            posts[postIndex].comments = posts[postIndex].comments.filter(c => c.id !== commentId);
            SaveForumPosts(posts);
            
            const activeClass = (document.getElementById("filter_class") as HTMLSelectElement)?.value || "all";
            const activeSubject = (document.getElementById("filter_subject") as HTMLSelectElement)?.value || "all";
            RenderForumFeed(activeClass, activeSubject);

            // Re-open comments box
            setTimeout(() => {
              const newCard = document.querySelector(`article[data-post-id="${postId}"]`);
              const newBox = newCard?.querySelector(".comments-section-box");
              if (newBox) {
                newBox.classList.remove("hidden");
              }
            }, 50);
          }
        });
      }
    });
  });

  // Call user profile popup bind here!
  if (typeof (window as any).BindUserProfileTriggersGlobal === "function") {
    (window as any).BindUserProfileTriggersGlobal();
  }
}
