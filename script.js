const searchPages = [
  {
    title: "Prototype 1",
    url: "prototype-1.html",
    summary: "First holder test with USB access, board fit, feedback, pros, cons, photos, hinges, buttons, and airflow notes.",
  },
  {
    title: "Prototype 2",
    url: "prototype-2.html",
    summary: "Improved holder test with wider USB cutout, raised side supports, wire clearance, stronger walls, and final design planning.",
  },
  {
    title: "Final Design",
    url: "final-design.html",
    summary: "Finished ESP32-C3 Zero holder with cable access, pin clearance, smoother edges, board grip, airflow, and final improvements.",
  },
];

const feedbackKey = "esp32-holder-feedback";

function getFeedback() {
  try {
    return JSON.parse(localStorage.getItem(feedbackKey)) || [];
  } catch {
    return [];
  }
}

function saveFeedback(items) {
  localStorage.setItem(feedbackKey, JSON.stringify(items));
}

function setupSearch() {
  const searchInput = document.querySelector("[data-search-input]");
  const resultsList = document.querySelector("[data-search-results]");
  const cards = document.querySelectorAll("[data-search-card]");

  if (!searchInput || !resultsList) {
    return;
  }

  const renderResults = () => {
    const query = searchInput.value.trim().toLowerCase();
    const matches = searchPages.filter((page) =>
      `${page.title} ${page.summary}`.toLowerCase().includes(query)
    );

    cards.forEach((card) => {
      const searchText = card.dataset.searchCard.toLowerCase();
      card.hidden = query !== "" && !searchText.includes(query);
    });

    resultsList.innerHTML = "";

    if (query === "") {
      resultsList.innerHTML = "<p>Type a keyword to search the project pages.</p>";
      return;
    }

    if (matches.length === 0) {
      resultsList.innerHTML = "<p>No matching pages found. Try USB, airflow, pins, feedback, or final.</p>";
      return;
    }

    matches.forEach((page) => {
      const item = document.createElement("a");
      item.className = "search-result";
      item.href = page.url;
      item.innerHTML = `<strong>${page.title}</strong><span>${page.summary}</span>`;
      resultsList.appendChild(item);
    });
  };

  searchInput.addEventListener("input", renderResults);
  renderResults();
}

function setupFeedbackForm() {
  const form = document.querySelector("[data-feedback-form]");
  const feedbackList = document.querySelector("[data-feedback-list]");
  const status = document.querySelector("[data-feedback-status]");

  if (!form || !feedbackList || !status) {
    return;
  }

  const renderFeedback = () => {
    const submissions = getFeedback();
    feedbackList.innerHTML = "";

    if (submissions.length === 0) {
      feedbackList.innerHTML = "<p>No feedback submitted yet.</p>";
      return;
    }

    submissions.slice(0, 5).forEach((entry) => {
      const item = document.createElement("article");
      const meta = document.createElement("div");
      const name = document.createElement("strong");
      const page = document.createElement("span");
      const message = document.createElement("p");

      item.className = "feedback-item";
      name.textContent = entry.name;
      page.textContent = entry.page;
      message.textContent = entry.message;

      meta.append(name, page);
      item.append(meta, message);
      feedbackList.appendChild(item);
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const entry = {
      name: formData.get("name").toString().trim(),
      page: formData.get("page").toString(),
      message: formData.get("message").toString().trim(),
      submittedAt: new Date().toISOString(),
    };

    const submissions = [entry, ...getFeedback()];
    saveFeedback(submissions);
    form.reset();
    status.textContent = "Thanks, your feedback has been submitted.";
    renderFeedback();
  });

  renderFeedback();
}

setupSearch();
setupFeedbackForm();
