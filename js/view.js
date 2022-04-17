const url = new URL(document.location);
const query = url.searchParams.get('query');
const articleFrame = document.querySelector('.content');


if (!query) FatalError('There is no query');

let buffer = document.createElement('iframe');
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
    LoadMathJax();
};

buffer.src = query + '/index.html'

document.body.appendChild(buffer);