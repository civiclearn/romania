function getCurrentSlugFromPath() {
  // URL format: /articole/<slug>/index.html
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("articole");
  if (idx === -1 || idx === parts.length - 1) return null;
  return parts[idx + 1];
}

async function renderRelatedArticles() {
  const container = document.getElementById("related-articles");
  if (!container) return;

  const currentSlug = getCurrentSlugFromPath();

  try {
    const response = await fetch("/articole/articles.json");
    if (!response.ok) throw new Error("Nu pot încărca articolele.");
    let articles = await response.json();

    // Exclude the current article
    articles = articles.filter(a => a.slug !== currentSlug);

    // Randomize + pick 4
    articles = articles.sort(() => Math.random() - 0.5).slice(0, 4);

    // Build HTML
    if (articles.length === 0) {
      container.innerHTML = "";
      return;
    }

    const listItems = articles
      .map(a => `<li><a href="/articole/${a.slug}/">${a.title}</a></li>`)
      .join("");

    container.innerHTML = `
      <h2>Articole similare</h2>
      <ul>${listItems}</ul>
    `;
  } catch (e) {
    container.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", renderRelatedArticles);
