(function () {
  const storagePrefix = "academyReviewComments:v1:";
  const state = {
    comments: [],
    selected: new Set(),
    status: "all",
    priority: "all",
    query: "",
    editingId: null,
  };

  const ui = {
    summary: document.querySelector("[data-reviews-summary]"),
    list: document.querySelector("[data-reviews-list]"),
    search: document.querySelector("[data-review-search]"),
    status: document.querySelector("[data-review-status]"),
    priority: document.querySelector("[data-review-priority]"),
    selectedCount: document.querySelector("[data-review-selected-count]"),
    selectVisible: document.querySelector("[data-review-select-visible]"),
    clearSelection: document.querySelector("[data-review-clear-selection]"),
    createReport: document.querySelector("[data-review-create-report]"),
    report: document.querySelector("[data-review-report]"),
    reportOutput: document.querySelector("[data-review-report-output]"),
    copyReport: document.querySelector("[data-review-copy-report]"),
  };

  load();
  bind();
  render();

  function bind() {
    ui.search.addEventListener("input", function () {
      state.query = ui.search.value.trim().toLowerCase();
      render();
    });

    ui.status.addEventListener("change", function () {
      state.status = ui.status.value;
      render();
    });

    ui.priority.addEventListener("change", function () {
      state.priority = ui.priority.value;
      render();
    });

    ui.selectVisible.addEventListener("click", function () {
      getVisibleComments().forEach(function (comment) {
        state.selected.add(comment.id);
      });
      render();
    });

    ui.clearSelection.addEventListener("click", function () {
      state.selected.clear();
      render();
    });

    ui.createReport.addEventListener("click", function () {
      const selected = getSelectedComments();
      ui.report.hidden = selected.length === 0;
      ui.reportOutput.value = buildAgentReport(selected);
      ui.report.scrollIntoView({ block: "start", behavior: "smooth" });
    });

    ui.copyReport.addEventListener("click", function () {
      const text = ui.reportOutput.value;
      const done = function () {
        ui.copyReport.textContent = "Copied";
        window.setTimeout(function () {
          ui.copyReport.textContent = "Copy report";
        }, 1400);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(done);
        });
        return;
      }

      fallbackCopy(done);
    });
  }

  function load() {
    state.comments = loadAllComments();
    state.selected.forEach(function (id) {
      if (!state.comments.some(function (comment) { return comment.id === id; })) {
        state.selected.delete(id);
      }
    });
  }

  function loadAllComments() {
    const comments = [];

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith(storagePrefix)) {
        continue;
      }

      try {
        const pageComments = JSON.parse(localStorage.getItem(key) || "[]");
        pageComments.forEach(function (comment) {
          comments.push(normalizeComment(comment, key));
        });
      } catch (error) {
        // Ignore malformed browser review data.
      }
    }

    return comments.sort(sortComments);
  }

  function normalizeComment(comment, storageKey) {
    const pageFromKey = storageKey.slice(storagePrefix.length) || "index.html";
    const pagePath = comment.pagePath || pageFromKey;
    const file = pagePath.split("/").filter(Boolean).pop() || comment.pageId || pageFromKey || "index.html";

    return {
      id: comment.id || "",
      storageKey,
      status: comment.status || "open",
      priority: normalizePriority(comment.priority),
      file,
      pageId: comment.pageId || pageFromKey,
      pageTitle: comment.pageTitle || comment.pageId || pageFromKey,
      pagePath,
      targetLabel: comment.targetLabel || "Page",
      targetSelector: cleanSelector(comment.targetSelector || ""),
      targetElement: comment.targetElement || "",
      targetText: comment.targetText || "",
      body: comment.body || "",
      createdAt: comment.createdAt || "",
    };
  }

  function sortComments(a, b) {
    const statusRank = { open: 0, resolved: 1, archived: 2 };
    const priorityRank = { high: 0, medium: 1, low: 2 };

    return (
      (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9) ||
      (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9) ||
      a.file.localeCompare(b.file) ||
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  function normalizePriority(priority) {
    if (priority === "high" || priority === "medium" || priority === "low") {
      return priority;
    }

    return "medium";
  }

  function priorityLabel(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }

  function cleanSelector(selector) {
    return selector.replace(/\.review-candidate-hover/g, "");
  }

  function render() {
    const visible = getVisibleComments();
    renderSummary();
    renderSelection();
    renderList(visible);
  }

  function renderSummary() {
    const open = state.comments.filter(function (comment) { return comment.status === "open"; }).length;
    const resolved = state.comments.filter(function (comment) { return comment.status === "resolved"; }).length;
    const high = state.comments.filter(function (comment) { return comment.priority === "high"; }).length;
    const pages = new Set(state.comments.map(function (comment) { return comment.file; })).size;

    ui.summary.innerHTML = "";
    [
      ["Total", state.comments.length],
      ["Open", open],
      ["Resolved", resolved],
      ["High priority", high],
      ["Pages", pages],
    ].forEach(function (item) {
      const stat = document.createElement("div");
      stat.className = "reviews-stat";
      stat.innerHTML = "<strong></strong><span></span>";
      stat.querySelector("strong").textContent = item[1];
      stat.querySelector("span").textContent = item[0];
      ui.summary.append(stat);
    });
  }

  function renderSelection() {
    const selected = getSelectedComments();
    ui.selectedCount.textContent = selected.length + " selected";
    ui.createReport.disabled = selected.length === 0;
  }

  function renderList(comments) {
    ui.list.innerHTML = "";

    if (!comments.length) {
      const empty = document.createElement("div");
      empty.className = "reviews-empty";
      empty.textContent = "No reviews match this view.";
      ui.list.append(empty);
      return;
    }

    comments.forEach(function (comment) {
      ui.list.append(createCard(comment));
    });
  }

  function createCard(comment) {
    const card = document.createElement("article");
    card.className = "reviews-card" + (comment.status === "resolved" ? " is-resolved" : "");

    const select = document.createElement("label");
    select.className = "reviews-card-select";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selected.has(comment.id);
    checkbox.setAttribute("aria-label", "Select review");
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        state.selected.add(comment.id);
      } else {
        state.selected.delete(comment.id);
      }
      renderSelection();
    });
    select.append(checkbox);

    const body = document.createElement("div");
    body.className = "reviews-card-body";

    if (state.editingId === comment.id) {
      body.append(createEditForm(comment));
      card.append(select, body);
      return card;
    }

    const top = document.createElement("div");
    top.className = "reviews-card-top";
    const title = document.createElement("h2");
    title.className = "reviews-card-title";
    title.textContent = comment.body;
    const chips = document.createElement("div");
    chips.className = "reviews-chips";
    chips.append(
      chip(comment.status, "status-" + comment.status),
      chip(priorityLabel(comment.priority), "priority-" + comment.priority),
      chip(comment.file, "")
    );
    top.append(title, chips);

    const target = document.createElement("div");
    target.className = "reviews-target";
    appendTargetLine(target, "Page", comment.pageTitle);
    appendTargetLine(target, "Target", comment.targetLabel);
    appendTargetLine(target, "Selector", comment.targetSelector || "Not captured");

    const actions = document.createElement("div");
    actions.className = "reviews-card-actions";
    const go = document.createElement("a");
    go.className = "reviews-link-button";
    go.href = buildJumpHref(comment);
    go.textContent = "Go to element";
    const status = document.createElement("button");
    status.className = "reviews-button";
    status.type = "button";
    status.textContent = comment.status === "resolved" ? "Unresolve" : "Resolve";
    status.addEventListener("click", function () {
      updateStatus(comment, comment.status === "resolved" ? "open" : "resolved");
    });
    const edit = document.createElement("button");
    edit.className = "reviews-button";
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", function () {
      state.editingId = comment.id;
      render();
    });
    actions.append(go, edit, status);

    body.append(top, target, actions);
    card.append(select, body);

    return card;
  }

  function createEditForm(comment) {
    const form = document.createElement("form");
    form.className = "reviews-edit-form";

    const title = document.createElement("h2");
    title.className = "reviews-card-title";
    title.textContent = "Edit review";

    const textarea = document.createElement("textarea");
    textarea.className = "reviews-edit-textarea";
    textarea.value = comment.body;
    textarea.required = true;

    const row = document.createElement("div");
    row.className = "reviews-edit-row";
    const label = document.createElement("label");
    label.textContent = "Priority";
    const priority = document.createElement("select");
    priority.className = "reviews-edit-priority";
    priority.dataset.priority = comment.priority;
    [
      ["low", "Low"],
      ["medium", "Medium"],
      ["high", "High"],
    ].forEach(function (option) {
      const item = document.createElement("option");
      item.value = option[0];
      item.textContent = option[1];
      item.selected = option[0] === comment.priority;
      priority.append(item);
    });
    priority.addEventListener("change", function () {
      priority.dataset.priority = priority.value;
    });
    label.append(priority);
    row.append(label);

    const target = document.createElement("div");
    target.className = "reviews-target";
    appendTargetLine(target, "Page", comment.pageTitle);
    appendTargetLine(target, "Target", comment.targetLabel);

    const actions = document.createElement("div");
    actions.className = "reviews-card-actions";
    const cancel = document.createElement("button");
    cancel.className = "reviews-button";
    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", function () {
      state.editingId = null;
      render();
    });
    const save = document.createElement("button");
    save.className = "reviews-button primary";
    save.type = "submit";
    save.textContent = "Save";
    actions.append(cancel, save);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!textarea.value.trim()) {
        textarea.focus();
        return;
      }
      updateReview(comment, {
        body: textarea.value.trim(),
        priority: priority.value,
      });
    });

    form.append(title, textarea, row, target, actions);
    return form;
  }

  function chip(text, className) {
    const element = document.createElement("span");
    element.className = "reviews-chip " + (className || "");
    element.textContent = text;
    return element;
  }

  function appendTargetLine(parent, label, value) {
    const line = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    const content = label === "Selector" ? document.createElement("code") : document.createElement("span");
    content.textContent = value;
    line.append(strong, content);
    parent.append(line);
  }

  function getVisibleComments() {
    return state.comments.filter(function (comment) {
      const haystack = [
        comment.body,
        comment.targetLabel,
        comment.targetText,
        comment.file,
        comment.pageTitle,
        comment.priority,
        comment.status,
      ].join(" ").toLowerCase();

      return (
        (state.status === "all" || comment.status === state.status) &&
        (state.priority === "all" || comment.priority === state.priority) &&
        (!state.query || haystack.includes(state.query))
      );
    });
  }

  function getSelectedComments() {
    return state.comments.filter(function (comment) {
      return state.selected.has(comment.id);
    });
  }

  function updateStatus(comment, status) {
    updateReview(comment, { status });
  }

  function updateReview(comment, updates) {
    const stored = JSON.parse(localStorage.getItem(comment.storageKey) || "[]");
    const updated = stored.map(function (item) {
      if (item.id !== comment.id) {
        return item;
      }
      return Object.assign({}, item, updates);
    });
    localStorage.setItem(comment.storageKey, JSON.stringify(updated));
    state.editingId = null;
    load();
    render();
  }

  function buildJumpHref(comment) {
    const path = comment.pagePath && comment.pagePath !== "/" ? comment.pagePath : comment.file;
    const separator = path.includes("?") ? "&" : "?";
    return path + separator + "reviewComment=" + encodeURIComponent(comment.id);
  }

  function buildAgentReport(comments) {
    if (!comments.length) {
      return "No selected reviews.";
    }

    const lines = [
      "# Review Fix Brief",
      "",
      "Please fix the selected review items in this repository. Keep changes scoped, preserve the existing visual system, and verify affected pages locally.",
      "",
      "Selected reviews: " + comments.length,
      "",
    ];

    comments.forEach(function (comment, index) {
      lines.push(
        "## " + String(index + 1) + ". " + comment.body,
        "- Status: " + comment.status,
        "- Priority: " + priorityLabel(comment.priority),
        "- File: " + comment.file,
        "- Target: " + comment.targetLabel,
        "- Selector: " + (comment.targetSelector || "Not captured"),
        "- Target text fallback: " + (comment.targetText || "Not captured"),
        ""
      );
    });

    return lines.join("\n");
  }

  function fallbackCopy(done) {
    ui.reportOutput.focus();
    ui.reportOutput.select();
    document.execCommand("copy");
    done();
  }
})();
