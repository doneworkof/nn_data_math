const main = document.querySelector('main');
const debug = true;
const popup = document.querySelector(".popup");
let popupContent = null;
const mathjax_url = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML';
const menuList = [
    {
        'title': 'Главная страница',
        'href': 'index.html',
        'icon': 'img/icon-home.png'
    },
    {
        'title': 'Все статьи',
        'href': 'all.html',
        'icon': 'img/article.png'
    },
    {
        'title': 'Случайная статья',
        'script': OpenRandomArticle,
        'icon': 'img/random.png'
    },
    {
        'title': 'Предложить статью',
        'script': () => {},
        'icon': 'img/suggest.png'
    },
    {
        'title': 'Савелий',
        'href': 'view.html?query=nn_saveliy',
        'icon': 'img/s_icon.png'
    },
    {
        'title': 'О сайте',
        'script': () => { TogglePopup(true, '.popup-about') }, 
        'icon':'img/about.png'
    }
];

function strweight(str) {
    for(var a = 0; a < str.length;a+=1)
        if(![' ', /\n/].includes(str[a])) return true;
    return false;
}

function FatalError(msg) {
    location.href = "error.html?code="+msg;
}

function Freeze(object, time) {
    if(Array.isArray(object)) {
        object.forEach(obj => Freeze(obj,time));
        return;
    }
    object.style.pointerEvents = "none";
    setTimeout(() => {
        object.style.pointerEvents = "all";
    },time);
}

function IsPopupContentSide() {
    return popupContent.classList.contains("side");
}

function TogglePopup(state, content) {
    //freeze menu
    Freeze(document.querySelector(".menu"), 250);
    switch (state) {
        case true:
            if(popupContent) {
                if(popupContent.classList.contains('sidemenu'))
                    CloseBurgerMenu();
                else TogglePopup(false);
                setTimeout(() => TogglePopup(state, content), 250);
                return;
            }
            ToggleContent(content? content : ":first-child");
            popupContent = content? popup.querySelector(content) : popup.children[0]; 
            popupContent.style.animation = (IsPopupContentSide()? "Side" : "") + "ContentOpen .25s ease-out forwards";
            popup.style.animation = "OpenPopup .25s ease-out forwards";
            document.body.classList.add("disableScrollbar");
            break;
        case false:
            popupContent.style.animation = (IsPopupContentSide()? "Side" : "") + "ContentClose .25s ease-out forwards";
            popup.style.animation = "ClosePopup .25s ease-out forwards";
            setTimeout(() => document.body.classList.remove("disableScrollbar"), 250);
            popupContent = null;    
            break;
        case null:
            TogglePopup(popupContent != popup.querySelector(content), content);
            break;
        default:
            break;
    }
}

function ToggleContent(query) {
    for(var a = 0; a < popup.children.length;a+=1) popup.children[a].style.display = "none";
    if(query == "-all") return;
    var content = popup.querySelector(query);
    content.style.display = "flex";
    popupContent = content;
}

function OpenBurgerMenu() {
    if(popupContent && popupContent.classList.contains("sidemenu")) {
        CloseBurgerMenu();
        return;
    }
    TogglePopup(true,'.sidemenu');
    setTimeout(() => document.querySelector("input.burger").classList.add('close'),30);
}   

function CloseBurgerMenu() {
    TogglePopup(false);
    var burgerbutt = document.querySelector("input.burger");
    burgerbutt.classList.remove('close');
}

let defaultPopupWindows = popup.querySelectorAll(".popup-window:not(.side)");
function UpdateDPW() {
    defaultPopupWindows.forEach(window => {
        if(document.body.clientWidth <= 630 && !window.classList.contains('side'))
            window.classList.add('side');
        else if(document.body.clientWidth > 630 && window.classList.contains('side'))
            window.classList.remove('side');
    });
}

window.addEventListener('resize', UpdateDPW);
UpdateDPW();

function IsPopupChild(element) {
    for(var a = 0; a < popup.children.length;a+=1)
        if(popup.children[a].contains(element)) return true;
    return false;
}

if(popup) {
    popup.onclick = function(event){
        if(event.target.classList.contains("popup-window") || IsPopupChild(event.target) || popupContent.classList.contains('lock')) return;
        else if(popupContent.classList.contains('sidemenu')) {
            CloseBurgerMenu();
            return;
        }
        TogglePopup(false);
    };
    document.addEventListener("keydown",function(ev) {
        if(ev.key == "Escape" && popupContent)TogglePopup(false);
    });
}

function ImgError() {
    this.src = "img/default.png";
}

function Device() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua))
        return "tablet";
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua))
        return "mobile";
    return "desktop";
}

function Search() {
    var query = searchfield.value;
    if(query.length > 30) {
        alert("Слишком много символов!");
        return;
    } else if(!strweight(query)) return;
    TransitionTo("all.html?query="+query);
}

const searchfield = document.querySelector(".search .inputfield");
if(searchfield)searchfield.addEventListener("keydown",function(ev) {
    if(ev.keyCode == 13) Search();
});

function TransitionTo(addr) {
    document.body.style.pointerEvents = "none";

    function MainAnimation() {   
        document.querySelector("main").style.animation = "disappear 0.15s ease-in";
        setTimeout(() => {
            document.location = addr;
        }, 150);
    }

    if(popupContent) {
        TogglePopup(false);
        setTimeout(MainAnimation,250);
    }
    else MainAnimation();
}

function ProcessSmoothLinks(parent) {
    parent.querySelectorAll("a[smooth]").forEach(link => {
        link.href = "javascript:TransitionTo('"+link.href+"')";
    });
}

function ProcessInputfieldTypes(parent) {
    var numericonly = parent.querySelectorAll("input[numericonly]");
    numericonly.forEach(target => target.onkeydown = function(ev){
        return (['0','1','2','3','4','5','6','7','8','9'].indexOf(ev.key) > -1 || ev.keyCode == 8);
    });
    var lettersonly = parent.querySelectorAll("input[lettersonly]");
    lettersonly.forEach(target => target.onkeydown = function(ev) {
        return ['0','1','2','3','4','5','6','7','8','9'].indexOf(ev.key) == -1;
    });
}

function ProcessMenuList() {
    let page = location.href.split('/').pop();
    let list = document.querySelector('.sidemenu .menulist');
    menuList.forEach(item => {
        let button = document.createElement('a');
        switch(item.path) {
            case undefined:
                button.addEventListener('click', item.script);
                break
            default:
                if (item.path == page) return;
                button.setAttribute('href', item.path);
                button.setAttribute('smooth', true);
                break
        }
        button.innerHTML = `<li><img src="${item.icon}">${item.title}</li>`
        list.appendChild(button);
    });
}

let overDelay = false;

function StartLoading(element,delay) {
    return setTimeout(() => {
        element.classList.add('loading');
        overDelay = true;
    }, delay);
}

function EndLoading(startingThread, element,endfunc) {
    if(overDelay) {
        element.classList.add("end-loading");
        setTimeout(() => {
            element.classList.remove("loading");
            element.classList.remove("end-loading");
            if(endfunc) endfunc();
        },150);
    }
    else {
        clearTimeout(startingThread);
        if(endfunc)endfunc();
    }
    overDelay = null;
}

function LoadMathJax() {
    let script = document.createElement('script');
    script.src = mathjax_url;
    document.body.appendChild(script);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function OpenRandomArticle() {
    let idx = getRandomInt(0, articles.length - 1);
    let target = articles[idx];
    TransitionTo(`view.html?query=${target.index}`)
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
}

if(Device() == 'desktop')
    document.body.style.overflowY = "overlay";


ProcessMenuList()
ProcessInputfieldTypes(document);
ProcessSmoothLinks(document);