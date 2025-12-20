async function loadHomeArticles() {
  const container = document.getElementById("home-articles-list");
  if (!container) return;

  try {
    const res = await fetch("/articole/articles.json");
    if (!res.ok) throw new Error("Cannot load articles.");

    let articles = await res.json();

    // Shuffle + pick 6 (no images → small cards look better in larger sets)
    articles = articles.sort(() => Math.random() - 0.5).slice(0, 6);

    container.innerHTML = "";

    articles.forEach(a => {
      const card = document.createElement("div");
      card.className = "article-card";

      card.innerHTML = `
        <a href="/articole/${a.slug}/">
          <div class="article-card-title">${a.title}</div>
          <div class="article-card-excerpt">${a.excerpt}</div>
        </a>
      `;

      container.appendChild(card);
    });

  } catch (e) {
    container.innerHTML = `
      <p style="text-align:center; padding:1rem; color:#777;">
        Momentan nu putem afișa articolele recomandate.
      </p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadHomeArticles);
