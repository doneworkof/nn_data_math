/*

<div class="img-collection" collection="img/aspirin.webp,img/aspirin.webp,obama,test,meme,test2,aspirin4">
    <div class="view">
        <input type="button">
        <div class="img-box">
            <img>
        </div>
        <input type="button">
    </div>
        <div class="img-previews"></div>
    </div>
</div>

*/




class ImageCollection {
    constructor(id, element) {
        this.element = element;
        this.element.id = id;

        // Fucking Collection
        let images = Array.from(element.children);
        this.collection = images.map(x => x.src);
        this.element.innerHTML = '';
        this.position = 0;

        // Attaching view element
        let view = document.createElement('div');
        view.className = 'view';
        this.element.appendChild(view);
        
        let imgBox = document.createElement('div');
        imgBox.className = 'img-box';
        view.appendChild(imgBox);

        this.mainImg = document.createElement('img');
        this.mainImg.onerror = ImgError;
        imgBox.appendChild(this.mainImg);

        //setting buttons

        [1, -1].forEach(velocity => {
            let button = document.createElement('input');
            button.type = 'button';
            button.onclick = () => this.Move(velocity);
            view.insertBefore(button, view.firstChild);
        });
        
        //setting img previews 
        this.previewsHolder = document.createElement('div');
        this.previewsHolder.className = 'img-previews';
        this.element.appendChild(this.previewsHolder);

        this.collection.forEach(imgPath => {
            var img = document.createElement("img");
            img.src = imgPath;
            img.onerror = ImgError;
            img.onclick = () => {
                var index = -1;
                for(var a = 0; a < this.previewsHolder.children.length;a+=1)
                    if(this.previewsHolder.children[a] == img) index = a;
                if(index < 0) return;
                this.ToggleSelect(this.position,false);
                this.position = index;
                this.ToggleSelect(this.position,true);
                this.ScrollTo(this.position,1);
                this.UpdateImage();
            };
            this.previewsHolder.appendChild(img);
        });
        if(this.previewsHolder.clientWidth < this.collection.length * 50 + (this.collection.length-1)*8)
            this.previewsHolder.style.justifyContent="flex-start";
        this.UpdateImage();
        this.ToggleSelect(0,true);
    }
    Move(step) {
        this.ToggleSelect(this.position,false);
        this.position = this.FixPosition(this.position + step);
        this.ToggleSelect(this.position, true);
        this.ScrollTo(this.position, step);
        this.UpdateImage();
    }
    ScrollTo(index,step) {
        if(index == this.collection.length - 1)
            this.previewsHolder.scrollLeft = this.previewsHolder.scrollWidth;
        else if(index == 0)
            this.previewsHolder.scrollLeft = 0;
        else
            this.previewsHolder.children[index+step].scrollIntoView();
    }
    FixPosition(pos) {
        return pos < 0? this.collection.length - 1 : (pos >= this.collection.length? 0 : pos);
    }
    ToggleSelect(id,state) {
        this.previewsHolder.children[id].style.outline = state? "1px solid black" : "none";
    }

    UpdateImgResizing() {
        let view = this.element.querySelector(".view");
        if(view.clientWidth < 450) 
            view.style.height = (450 * (view.clientWidth / 450)) + "px";

        var ratio = this.mainImg.naturalWidth/this.mainImg.naturalHeight;
        if(ratio >= 1.35)
            this.mainImg.style.width = "100%";
        else
            this.mainImg.style.width = (view.clientHeight * ratio)+"px";

    }

    UpdateImage() {
        this.position = this.FixPosition(this.position);
        this.mainImg.src = this.collection[this.position];

        if(this.mainImg.complete) this.UpdateImgResizing();
        else this.mainImg.onload = () => this.UpdateImgResizing();
    }
}

class FitObject {
    constructor(element) {
        this.Element = element;
        this.Element.id = "fitobj"+FitObjects.length;
        //Чтобы функция выполнялась не относительно картинки,
        //а относительно класса.
        this.Element.onload = () => this.OnLoad();
        if(this.Element.complete && !this.InitialSize) this.OnLoad();
    }

    Reset() {
        if(!this.InitialSize) {
            this.Element.style.border = "3px solid red";
        }
        this.Element.style.width = this.InitialSize.width + "px";
        this.Element.style.height = this.InitialSize.height + "px";
    }

    OnLoad() {
        if(this.InitialSize)return;
        var res = this.Element.getAttribute('res');
        var persp = this.Element.getAttribute('persp');
    
        if(persp) this.Element.style.objectPosition = persp;
    
        var raw = res.split('x');
        var width = raw[0] == '_'? NaN : parseInt(raw[0]);
        var height = raw[1] == '_'? NaN : parseInt(raw[1]);
    
        if(!width && !height) {
            width = this.Element.naturalWidth;
            height = this.Element.naturalHeight;
        }
        else if(!width && height)
            width = this.Element.naturalWidth * (height / this.Element.naturalHeight);
        else if(width && !height)
            height = this.Element.naturalHeight * (width / this.Element.naturalWidth);
        
        this.Element.style.width = width + "px";
        this.Element.style.height = height + "px";
        this.Element.style.minHeight = Math.ceil(height * 0.75) + "px";
        this.InitialSize = {"width":width,"height":height};
        setTimeout(() => function(obj){obj.Element.style.animation = "appear .4s ease-in-out forwards"}(this),this.Id*30);
        if(this.onLoad) this.onLoad();
        this.Update();
    }

    Update() {
        if(!this.InitialSize) return;
        var parentWidth = this.Element.parentElement.clientWidth;
        var width = this.Element.clientWidth;
        var height = this.Element.clientHeight;
        if(parentWidth <= this.InitialSize.width || width / parentWidth >= 0.5) {
            this.Element.style.width = parentWidth + 'px';
            this.Element.style.height =  this.InitialSize.height *  parentWidth / this.InitialSize.width + 'px';
        }
        if(document.body.clientWidth > 600 && this.Element.clientWidth > this.InitialSize.width)
            this.Reset();

    }

    Scale(scaleX, scaleY) {
        if(!this.InitialSize) return;
        this.InitialSize.width *= scaleX;
        this.InitialSize.height *= scaleY;
        this.Element.style.width = this.Element.clientWidth * scaleX + "px";
        this.Element.style.height = this.Element.clientHeight * scaleY + "px";
        this.Update();
    }
} 

function FitObjectsReset() {
    FitObjects.forEach(fitobj => {
        fitobj.Reset();
    });
}

function SmartResizing() {
    if(Device() == "desktop" && screen.width == window.innerWidth) {
        FitObjectsReset();
        return;
    }
    FitObjects.forEach(fitobj => {
        fitobj.Update();
    });
}

function GetFitObjectById(id) {
    return FitObjects[parseInt(id.slice(6,id.length))];
}

let ImageCollections = [];
let FitObjects = [];

function ProcessImageCollections(article) {
    let collections = article.querySelectorAll(".img-collection");

    for(let a = 0; a < collections.length; a += 1)
        ImageCollections.push(new ImageCollection(a, collections[a]));

    window.addEventListener("resize",() => {
        ImageCollections.forEach(imgcollection => {
            imgcollection.UpdateImgResizing();
        });
    }); 
}

function ProcessVideoPlayers(article) {
    var players = article.querySelectorAll("iframe[youtube]");

    players.forEach(player => {
        var res = player.getAttribute("res").split("x");
        var youtube = player.getAttribute("youtube");
        player.style.width = res[0]+"px";
        player.style.height = res[1]+"px";
        player.src = "https://www.youtube.com/embed/" + youtube;
    });
}

function ProcessFloatingBoxes(article) {
    var fbs = article.querySelectorAll(".floatingBox");
    if(fbs.length < 2) return;
    var lastRight = fbs[0].classList.contains("right");
    for(var a = 1; a < fbs.length;a+=1) {
        if(lastRight) {
            if(fbs[a].classList.contains("right")) fbs[a].classList.remove("right");
            lastRight = false;
            continue;
        }
        fbs[a].classList.add("right");
        lastRight = true;
    }
}

function ProcessSmartResizing(article) {
    var targets = article.querySelectorAll("[res]");
    targets.forEach(target => {
        if(target.getAttribute("leavealone")) return;
        FitObjects.push(new FitObject(target));
    });

    window.addEventListener("resize", SmartResizing);

    document.addEventListener("visibilitychange", function() {
        if(!document.hidden) SmartResizing();
    });
}

function ProcessCodeBlocks(article) {
    let codeblocks = article.querySelectorAll('.codeblock');
    
    for(let i = 0; i < codeblocks.length; i += 1) {
        codeblocks[i].id = 'codeblock' + i;
        let editor = ace.edit(codeblocks[i].id);
        editor.setTheme('ace/theme/chrome');
        editor.session.setMode('ace/mode/python');
        if(codeblocks[i].getAttribute('readonly')) {
            editor.session.setUseWorker(false);
            editor.setShowPrintMargin(false);
            editor.setReadOnly(true);
        }
        let height = codeblocks[i].getAttribute('height');
        if (height)
            codeblocks[i].style.height = height + 'px';
    }
}

function ProcessArticle(article) {
    ProcessSmartResizing(article);
    ProcessImageCollections(article);
    ProcessVideoPlayers(article);
    ProcessFloatingBoxes(article);
    ProcessCodeBlocks(article);
}