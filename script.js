const API_KEY = "13d12bde92a93bae3a87fe1636d7edb5"; // 👈 Replace this!
const url = "https://gnews.io/api/v4/top-headlines?country=in&lang=en&apikey=" + API_KEY;

window.addEventListener('load', () => fetchNews("India"));

async function fetchNews(query) {
    try {
        const res = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&apikey=${API_KEY}`);
        const data = await res.json();
        console.log(data);
        bindData(data.articles || []); // Fallback if no articles
    } catch (error) {
        console.error("Error fetching news:", error);
        bindData([]); // Show empty state on error
    }
}

function bindData(articles) {
    const cardcontainer = document.getElementById('card-container');
    const newstemplate = document.getElementById('template-news');
    cardcontainer.innerHTML = "";

    // Show empty state if no articles
    if (articles.length === 0) {
        cardcontainer.innerHTML = `
            <div class="empty-state">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No news">
                <h3>No articles found</h3>
                <p>Try searching for something else or check back later.</p>
            </div>
        `;
        return;
    }

    articles.forEach(article => {
        if (!article.image) return; // Skip if no image
        const cardclone = newstemplate.content.cloneNode(true);
        fillDatainCard(cardclone, article);
        cardcontainer.appendChild(cardclone);
    });
}

function fillDatainCard(cardclone, article) {
    const newsimg = cardclone.querySelector('#news-img');
    const newstitle = cardclone.querySelector('#title');
    const newssource = cardclone.querySelector('#source');
    const newsdesc = cardclone.querySelector('#news-description');

    newsimg.src = article.image || 'https://via.placeholder.com/400x200'; // Fallback image
    newstitle.innerHTML = article.title;
    newsdesc.innerHTML = article.description || "No description available.";

    const date = new Date(article.publishedAt).toLocaleString('en-US', { 
        timeZone: 'Asia/Jakarta',
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    
    newssource.innerHTML = `${article.source?.name || "Unknown source"} • ${date}`;

    cardclone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Rest of your existing code (nav, search, etc.) stays the same 👇
let curSelectNav = null;
function onNav(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectNav?.classList.remove('active');
    curSelectNav = navItem;
    curSelectNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectNav?.classList.remove('active');
    curSelectNav = null;
});

// Press "Enter" to search
searchText.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        curSelectNav?.classList.remove('active');
        curSelectNav = null;
    }
});