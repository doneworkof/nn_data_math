let low = Math.max(2, articles.length - 1)
let count = getRandomInt(low, articles.length - 1)
let available = range(0, articles.length - 1);
let targets = [];
const articleFrame = document.querySelector('.content');

while (count > 0) {
    let availableIdx = getRandomInt(0, available.length - 1);
    let idx = available.splice(availableIdx, 1)
    targets.push(articles[idx]);
    count -= 1;
}

const buffer = document.createElement('iframe');
buffer.className = 'hidden-frame';

buffer.onerror = () => {
    FatalError('Invalid query');
};

buffer.onload = () => {
    let bufferDocument = buffer.contentWindow.document;
    let article = bufferDocument.querySelector('.article');
    if (!article) FatalError('Invalid query');
    articleFrame.appendChild(article);
    ProcessArticle(article);
    if (targets.length == 0) {
        LoadMathJax();
        return;
    }
    articleFrame.innerHTML += '<hr>';
    buffer.src = targets.shift().index + '/index.html';
};

buffer.src = targets.shift().index + '/index.html';

document.body.appendChild(buffer);