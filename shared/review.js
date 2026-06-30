(function () {
  const storagePrefix = "academyReviewComments:v1:";
  const pageId = getPageId();
  const storageKey = storagePrefix + pageId;
  const root = document.documentElement;
  let comments = loadComments();
  let panelOpen = false;
  let selecting = false;
  let selectedTarget = null;
  let hoveredTarget = null;
  let filter = "all";
  let reopenPanelAfterSelection = false;

  const ui = createUi();
  render();
  handleReviewDeepLink();

  window.addEventListener("scroll", updatePins, { passive: true });
  window.addEventListener("resize", updatePins);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("mouseover", onHover, true);
  document.addEventListener("click", onDocumentClick, true);

  function getPageId() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function loadComments() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveComments() {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  }

  function createUi() {
    const toggle = document.createElement("button");
    toggle.className = "review-toggle";
    toggle.type = "button";
    toggle.dataset.reviewUi = "true";
    toggle.setAttribute("aria-label", "Add a review comment");
    toggle.textContent = "Add Review";
    toggle.addEventListener("click", startSelecting);

    const panelTab = document.createElement("button");
    panelTab.className = "review-panel-tab";
    panelTab.type = "button";
    panelTab.dataset.reviewUi = "true";
    panelTab.setAttribute("aria-label", "Open review panel");
    panelTab.innerHTML = 'Reviews <span class="review-toggle-count">0</span>';
    panelTab.addEventListener("click", togglePanel);

    const selectbar = document.createElement("div");
    selectbar.className = "review-selectbar";
    selectbar.dataset.reviewUi = "true";
    selectbar.hidden = true;
    selectbar.innerHTML = '<span>Click the page item you want to comment on. Press Esc to cancel.</span><button type="button">Cancel</button>';

    const compose = document.createElement("form");
    compose.className = "review-compose review-compose-window";
    compose.dataset.reviewUi = "true";
    compose.hidden = true;
    compose.innerHTML = [
      '<div class="review-compose-head">',
      '  <div>',
      '    <div class="review-compose-title">New comment</div>',
      '    <div class="review-target-label"></div>',
      '  </div>',
      '  <button class="review-window-close" type="button" aria-label="Cancel comment">x</button>',
      '</div>',
      '<div class="review-compose-fields">',
      '  <label>Priority<select class="review-priority" data-priority="medium"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>',
      '</div>',
      '<textarea class="review-textarea" placeholder="Write a comment" required></textarea>',
      '<div class="review-compose-actions">',
      '  <button class="review-secondary" type="button">Cancel</button>',
      '  <button class="review-submit" type="submit">Save</button>',
      '</div>',
    ].join("");

    const panel = document.createElement("aside");
    panel.className = "review-panel";
    panel.dataset.reviewUi = "true";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = [
      '<div class="review-panel-header">',
      '  <h2 class="review-panel-title">Review</h2>',
      '  <button class="review-panel-close" type="button" aria-label="Close review panel">x</button>',
      '</div>',
      '<div class="review-panel-body">',
      '  <div class="review-comments-view">',
      '    <div class="review-actions">',
      '      <button class="review-add" type="button">Add comment</button>',
      '      <select class="review-filter" aria-label="Filter comments">',
      '        <option value="all">All</option>',
      '        <option value="open">Open</option>',
      '        <option value="resolved">Resolved</option>',
      '      </select>',
      '    </div>',
      '    <div class="review-list"></div>',
      '  </div>',
      '</div>',
    ].join("");

    document.body.append(toggle, panelTab, selectbar, panel, compose);

    const close = panel.querySelector(".review-panel-close");
    const add = panel.querySelector(".review-add");
    const filterControl = panel.querySelector(".review-filter");
    const composeCancel = compose.querySelector(".review-secondary");
    const composeClose = compose.querySelector(".review-window-close");
    const selectCancel = selectbar.querySelector("button");

    close.addEventListener("click", closePanel);
    add.addEventListener("click", startSelecting);
    selectCancel.addEventListener("click", function () {
      stopSelecting({ reopenPanel: reopenPanelAfterSelection });
    });
    filterControl.addEventListener("change", function () {
      filter = filterControl.value;
      render();
    });
    compose.querySelector(".review-priority").addEventListener("change", function (event) {
      event.target.dataset.priority = event.target.value;
    });
    composeCancel.addEventListener("click", resetCompose);
    composeClose.addEventListener("click", resetCompose);
    compose.addEventListener("submit", saveComment);

    return {
      toggle,
      panelTab,
      count: panelTab.querySelector(".review-toggle-count"),
      selectbar,
      panel,
      add,
      compose,
      priority: compose.querySelector(".review-priority"),
      targetLabel: compose.querySelector(".review-target-label"),
      textarea: compose.querySelector(".review-textarea"),
      commentsView: panel.querySelector(".review-comments-view"),
      list: panel.querySelector(".review-list"),
    };
  }

  function togglePanel() {
    if (selecting) {
      stopSelecting({ reopenPanel: reopenPanelAfterSelection });
      return;
    }

    panelOpen ? closePanel() : openPanel();
  }

  function openPanel() {
    panelOpen = true;
    ui.panel.classList.add("open");
    ui.panel.setAttribute("aria-hidden", "false");
    render();
  }

  function closePanel() {
    panelOpen = false;
    stopSelecting();
    resetCompose();
    ui.panel.classList.remove("open");
    ui.panel.setAttribute("aria-hidden", "true");
    clearPins();
  }

  function startSelecting() {
    if (selecting) {
      stopSelecting({ reopenPanel: reopenPanelAfterSelection });
      return;
    }

    resetCompose();
    reopenPanelAfterSelection = panelOpen;
    selecting = true;
    panelOpen = false;
    ui.panel.classList.remove("open");
    ui.panel.setAttribute("aria-hidden", "true");
    ui.toggle.classList.add("is-hidden");
    ui.panelTab.classList.add("is-hidden");
    ui.add.classList.add("is-selecting");
    ui.add.textContent = "Select item";
    ui.selectbar.hidden = false;
    document.body.classList.add("review-selecting");
    clearPins();
  }

  function stopSelecting(options) {
    selecting = false;
    ui.add.classList.remove("is-selecting");
    ui.add.textContent = "Add comment";
    ui.selectbar.hidden = true;
    ui.toggle.classList.remove("is-hidden");
    ui.panelTab.classList.remove("is-hidden");
    document.body.classList.remove("review-selecting");
    clearHover();

    if (options && options.reopenPanel) {
      openPanel();
    }

    reopenPanelAfterSelection = false;
  }

  function onHover(event) {
    if (!selecting || event.target.closest("[data-review-ui]")) {
      return;
    }

    const target = getTarget(event.target);
    if (target === hoveredTarget) {
      return;
    }

    clearHover();
    hoveredTarget = target;
    if (hoveredTarget) {
      hoveredTarget.classList.add("review-candidate-hover");
    }
  }

  function clearHover() {
    if (hoveredTarget) {
      hoveredTarget.classList.remove("review-candidate-hover");
      hoveredTarget = null;
    }
  }

  function onDocumentClick(event) {
    const reviewUi = event.target.closest("[data-review-ui]");

    if (!selecting && panelOpen && !reviewUi) {
      closePanel();
      return;
    }

    if (!selecting || reviewUi) {
      return;
    }

    const target = getTarget(event.target);
    if (!target) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selectedTarget = describeTarget(target);
    stopSelecting();
    showCompose(target);
  }

  function getTarget(rawTarget) {
    const reviewTarget = rawTarget.closest("[data-review-id]");
    if (reviewTarget) {
      return reviewTarget;
    }

    const card = rawTarget.closest(".asset-card, .icon-card, .result-card");
    if (card) {
      return card;
    }

    return rawTarget.closest("section, article, h1, h2, h3, p, img, a, button, li, td, th, main");
  }

  function describeTarget(element) {
    const reviewId = element.getAttribute("data-review-id");
    const targetText = compactText(element.textContent).slice(0, 240);
    const label =
      element.getAttribute("data-review-label") ||
      element.getAttribute("aria-label") ||
      element.getAttribute("alt") ||
      element.getAttribute("title") ||
      targetText ||
      element.tagName.toLowerCase();

    return {
      key: reviewId ? "review:" + reviewId : getSelector(element),
      selector: reviewId ? '[data-review-id="' + cssEscape(reviewId) + '"]' : getSelector(element),
      label: label.slice(0, 90),
      text: targetText,
      element: getElementHint(element),
    };
  }

  function compactText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function getSelector(element) {
    if (element.id) {
      return "#" + cssEscape(element.id);
    }

    const parts = [];
    let current = element;

    while (current && current !== document.body && parts.length < 5) {
      let part = current.tagName.toLowerCase();
      const classes = Array.from(current.classList).filter(function (className) {
        return !className.startsWith("review-");
      });
      if (classes.length) {
        part += "." + classes.slice(0, 2).map(cssEscape).join(".");
      }

      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(function (child) {
          return child.tagName === current.tagName;
        });
        if (siblings.length > 1) {
          part += ":nth-of-type(" + (siblings.indexOf(current) + 1) + ")";
        }
      }

      parts.unshift(part);
      current = current.parentElement;
    }

    return parts.join(" > ");
  }

  function getElementHint(element) {
    let hint = element.tagName.toLowerCase();
    if (element.id) {
      hint += "#" + element.id;
    }
    const classes = Array.from(element.classList).filter(function (className) {
      return !className.startsWith("review-");
    });
    if (classes.length) {
      hint += "." + classes.slice(0, 3).join(".");
    }

    return hint;
  }

  function cssEscape(value) {
    if (window.CSS && window.CSS.escape) {
      return window.CSS.escape(value);
    }

    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function showCompose(target) {
    ui.compose.hidden = false;
    ui.targetLabel.innerHTML = "Target: <strong></strong>";
    ui.targetLabel.querySelector("strong").textContent = selectedTarget.label;
    ui.priority.value = "medium";
    ui.priority.dataset.priority = "medium";
    ui.textarea.value = "";
    positionCompose(target);
    ui.textarea.focus();
  }

  function resetCompose() {
    selectedTarget = null;
    ui.compose.hidden = true;
    ui.priority.value = "medium";
    ui.priority.dataset.priority = "medium";
    ui.textarea.value = "";
    ui.compose.style.left = "";
    ui.compose.style.top = "";
  }

  function positionCompose(target) {
    const rect = target.getBoundingClientRect();
    const gap = 12;
    const margin = 12;
    const width = Math.min(360, window.innerWidth - margin * 2);
    const height = Math.min(260, window.innerHeight - margin * 2);
    let left = rect.right + gap;
    let top = Math.max(margin, rect.top);

    if (left + width > window.innerWidth - margin) {
      left = rect.left - width - gap;
    }

    if (left < margin) {
      left = Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin));
    }

    if (top + height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - height - margin);
    }

    ui.compose.style.left = left + "px";
    ui.compose.style.top = top + "px";
  }

  function saveComment(event) {
    event.preventDefault();
    const body = ui.textarea.value.trim();
    if (!body || !selectedTarget) {
      return;
    }

    comments.unshift({
      id: "comment-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      pageId,
      pageTitle: document.title || pageId,
      pagePath: window.location.pathname,
      targetKey: selectedTarget.key,
      targetSelector: selectedTarget.selector,
      targetLabel: selectedTarget.label,
      targetText: selectedTarget.text,
      targetElement: selectedTarget.element,
      priority: ui.priority.value,
      body,
      status: "open",
      createdAt: new Date().toISOString(),
    });

    saveComments();
    resetCompose();
    render();
    openPanel();
  }

  function render() {
    const openCount = comments.filter(function (comment) {
      return comment.status === "open";
    }).length;

    ui.count.textContent = String(openCount);
    ui.count.hidden = openCount === 0;

    const visible = comments.filter(function (comment) {
      return filter === "all" || comment.status === filter;
    });

    if (!visible.length) {
      ui.list.innerHTML = '<div class="review-empty">No comments in this view.</div>';
      updatePins();
      return;
    }

    ui.list.innerHTML = "";
    visible.forEach(function (comment) {
      const item = document.createElement("article");
      item.className = "review-comment" + (comment.status === "resolved" ? " is-resolved" : "");
      item.innerHTML = [
        '<div class="review-comment-top">',
        '  <span class="review-comment-status"></span>',
        '  <span class="review-comment-priority"></span>',
        '</div>',
        '<div class="review-comment-body"></div>',
        '<div class="review-comment-date"></div>',
        '<div class="review-comment-actions">',
        '  <button class="review-comment-action" type="button" data-action="jump">Jump</button>',
        '  <button class="review-comment-action" type="button" data-action="status"></button>',
        '  <button class="review-comment-action" type="button" data-action="delete">Delete</button>',
        '</div>',
      ].join("");

      const priority = normalizePriority(comment.priority);
      item.querySelector(".review-comment-status").textContent = comment.status;
      item.querySelector(".review-comment-priority").textContent = priorityLabel(priority);
      item.querySelector(".review-comment-priority").classList.add("priority-" + priority);
      item.querySelector(".review-comment-body").textContent = comment.body;
      item.querySelector(".review-comment-date").textContent = formatDate(comment.createdAt);
      item.querySelector('[data-action="status"]').textContent = comment.status === "resolved" ? "Unresolve" : "Resolve";
      item.querySelector('[data-action="jump"]').addEventListener("click", function () {
        jumpToComment(comment);
      });
      item.querySelector('[data-action="status"]').addEventListener("click", function () {
        toggleStatus(comment.id);
      });
      item.querySelector('[data-action="delete"]').addEventListener("click", function () {
        deleteComment(comment.id);
      });

      ui.list.append(item);
    });

    updatePins();
  }

  function normalizePriority(priority) {
    if (priority === "low" || priority === "medium" || priority === "high") {
      return priority;
    }

    return "medium";
  }

  function priorityLabel(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value));
    } catch (error) {
      return "";
    }
  }

  function toggleStatus(id) {
    comments = comments.map(function (comment) {
      if (comment.id !== id) {
        return comment;
      }

      return Object.assign({}, comment, {
        status: comment.status === "resolved" ? "open" : "resolved",
      });
    });
    saveComments();
    render();
  }

  function deleteComment(id) {
    comments = comments.filter(function (comment) {
      return comment.id !== id;
    });
    saveComments();
    render();
  }

  function jumpToComment(comment) {
    const target = findTarget(comment);
    if (!target) {
      return;
    }

    target.scrollIntoView({ block: "center", behavior: "smooth" });
    target.classList.add("review-highlight");
    window.setTimeout(function () {
      target.classList.remove("review-highlight");
    }, 1300);
  }

  function handleReviewDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("reviewComment");
    if (!id) {
      return;
    }

    const comment = comments.find(function (item) {
      return item.id === id;
    });
    if (!comment) {
      return;
    }

    filter = "all";
    window.setTimeout(function () {
      openPanel();
      jumpToComment(comment);
    }, 250);
  }

  function findTarget(comment) {
    const selectors = [
      comment.targetSelector,
      comment.targetSelector ? comment.targetSelector.replace(/\.review-candidate-hover/g, "") : "",
    ].filter(Boolean);

    for (const selector of selectors) {
      try {
        const target = document.querySelector(selector);
        if (target) {
          return target;
        }
      } catch (error) {
        // Try the next fallback selector.
      }
    }

    const fallbackText = comment.targetText || comment.targetLabel;
    if (fallbackText) {
      const text = fallbackText.slice(0, 80);
      const candidates = Array.from(document.querySelectorAll("section, article, h1, h2, h3, p, a, button, li, td, th"));
      return candidates.find(function (element) {
        return compactText(element.textContent).includes(text);
      }) || null;
    }

    return null;
  }

  function updatePins() {
    clearPins();

    if (!panelOpen) {
      return;
    }

    const byTarget = new Map();
    comments.forEach(function (comment) {
      if (filter !== "all" && comment.status !== filter) {
        return;
      }

      const target = findTarget(comment);
      if (!target) {
        return;
      }

      const key = comment.targetSelector;
      if (!byTarget.has(key)) {
        byTarget.set(key, { target, comments: [] });
      }
      byTarget.get(key).comments.push(comment);
    });

    byTarget.forEach(function (entry) {
      const rect = entry.target.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return;
      }

      const pin = document.createElement("button");
      const allResolved = entry.comments.every(function (comment) {
        return comment.status === "resolved";
      });
      pin.type = "button";
      pin.className = "review-pin" + (allResolved ? " is-resolved" : "");
      pin.dataset.reviewUi = "true";
      pin.textContent = String(entry.comments.length);
      pin.style.left = Math.min(window.innerWidth - 34, Math.max(8, rect.right - 12)) + "px";
      pin.style.top = Math.min(window.innerHeight - 34, Math.max(8, rect.top + 8)) + "px";
      pin.addEventListener("click", function () {
        entry.target.scrollIntoView({ block: "center", behavior: "smooth" });
        entry.target.classList.add("review-highlight");
        window.setTimeout(function () {
          entry.target.classList.remove("review-highlight");
        }, 1300);
      });
      document.body.append(pin);
    });
  }

  function clearPins() {
    document.querySelectorAll(".review-pin").forEach(function (pin) {
      pin.remove();
    });
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      if (selecting) {
        stopSelecting({ reopenPanel: reopenPanelAfterSelection });
      } else if (!ui.compose.hidden) {
        resetCompose();
      } else if (panelOpen) {
        closePanel();
      }
    }
  }
})();
