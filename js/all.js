const url = new URL(document.location);
const query = url.searchParams.get('query');
const holder = document.querySelector(".result-holder");


function DoesCollideWith(articleObj, query) {
    article = articleObj.name.toLowerCase();
    query = query.toLowerCase();
    
    if (article.includes(query)) return true;
    
    for(let i = 0; i <= article.length - query.length; i += 1) {
        let substr = article.substring(i, query.length);
        let similarity = stringSimilarity.compareTwoStrings(substr, query);
        if (similarity >= 0.8) return true;
    }
    
    return false;
}

function GetAllCollidedArticles(query) {
    return articles.filter(
        article => DoesCollideWith(article, query)
    );
}

function MakeArticleTile(target) {
    let tile = document.createElement('a');
    tile.className = 'article-tile';
    tile.setAttribute('smooth', true);
    tile.setAttribute('href', `javascript:TransitionTo("view.html?query=${target.index}")`);
    tile.innerHTML += `<span class="name">${target.name}</span>`;
    tile.innerHTML += `<span class="date"><b>Дата:</b> ${target.date}</span>`;
    tile.innerHTML += `<span class="author"><b>Автор:</b> ${target.author}</span>`;
    return tile;
}

function AppendTilesForArticles(articles) {
    articles.forEach(a => holder.appendChild(MakeArticleTile(a)));
}

if (query) {
    document.querySelector(".search-params").style.display = "flex";
    document.querySelector(".search-params p b").textContent = `"${query}"`;
    document.title = "Косинус | Поиск статей";
    document.querySelector(".catalog-header").style.display = "none";

    let collided = GetAllCollidedArticles(query);

    if (collided.length == 0)
        document.querySelector(".failure-msg").style.display = "block";
    else if(collided.length == 1)
        document.location = `view.html?query=${collided[0].index}`;
    else
        AppendTilesForArticles(collided);

} else
    AppendTilesForArticles(articles);

