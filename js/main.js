(function() {
    // Variables
    var head = document.head;
    // Work section variables
    var work = document.getElementById("work");
    var offsetWork = work.offsetTop;
    var images = work.querySelectorAll(".img");
    images = Array.prototype.slice.call(images);
    var gallery = document.getElementById("gallery");
    var fullImg = document.getElementById("full-image");
    var currentImg = null;
    // Footer variables
    var footer = document.getElementById("footer");
    var offsetFooter = window.scrollMaxY - 100;
    // Menu variables
    var menu = document.getElementById("menu");
    var circleMenu = document.querySelectorAll("#main-menu .btns .circle-menu");
    var selItemMenu = null;

    function setStyle(elm, prop, val) {
        elm.style[prop] = val;
        if (prop == "animation") {
            elm.style.animationFillMode = "forwards";
        }
    }

    // Slide in function
    function slideIn() {
        var offsetTop = window.pageYOffset;
        if ( offsetTop >= (offsetWork - 300) ) {
            var columns = work.querySelectorAll(".col");
            var limits = [];
            columns.forEach(function(col) {
                var images = col.querySelectorAll(".img");
                limits.push(images.length);
            });
            var delay = 0;
            images.forEach(function(img, index) {
                if (index < limits[0]) {
                    setStyle(
                        img,
                        "animation",
                        "0.5s slide-to-right ease-in-out " + delay + "s"
                    );
                } else if ( ( index >= limits[0] ) &&
                ( index < (limits[0] + limits[1]) ) ) {
                    setStyle(
                        img,
                        "animation",
                        "0.5s slide-to-top ease-in-out " + delay + "s");
                } else {
                    setStyle(
                        img,
                        "animation",
                        "0.5s slide-to-left ease-in-out " + delay + "s");
                }
                delay += 0.12;
            });
            window.removeEventListener("scroll", slideIn);
        }
    }

    function setCircleMenuStyle(elm, prop, val) {
        var style;
        if (!head.querySelector("style")) {
            style = document.createElement("style");
            head.appendChild(style);
        } else {
            style = head.querySelector("style");
        }

        style.textContent = "#main-menu .circle-menu[href='" +
        elm.getAttribute("href") + "']:after { display: none; }";

        setStyle(elm, prop, val);
    }

    function removeCircleMenuStyle(elm) {
        if (!elm) {
            return;
        }
        elm.removeAttribute("style");
        var style = head.querySelector("style");
        if (style) {
            style.textContent = "";
        }
    }

    function toggleMenuItem() {
        var scroll = this.pageYOffset;
        if (scroll >= offsetWork && scroll < offsetFooter) {
            removeCircleMenuStyle(selItemMenu);
            selItemMenu = circleMenu[1];
            setCircleMenuStyle(selItemMenu, "left", "100px");
        } else if (scroll >= offsetFooter) {
            removeCircleMenuStyle(selItemMenu);
            selItemMenu = circleMenu[2];
            setCircleMenuStyle(selItemMenu, "left", "100px");
        } else {
            removeCircleMenuStyle(selItemMenu);
        }
    }

    function openMenu(e) {
        e.preventDefault();
        var menuButtons = document.querySelector(".btns");

        menuButtons.classList.toggle("open");
    }

    function rightClick(e) { e.preventDefault(); }

    function loadImage(url) {
        // Creates the loading icon
        fullImg.style.opacity = 0;
        var load = document.querySelector("#loading");
        if (!load) {
            load = document.createElement("i");
            load.setAttribute("id", "loading");
            load.classList.add("fa", "fa-spinner");
            gallery.appendChild(load);
        }

        fullImg.setAttribute("src", url);
        fullImg.addEventListener("load", function loadImage() {
            gallery.removeChild(load);
            fullImg.style.opacity = 1;
            this.removeEventListener("load", loadImage);
        });
    }

    function imgEvent(e) {
        e.preventDefault();
        currentImg = this;
        var url = this.getAttribute("data-url");

        loadImage(url);

        gallery.style.display = "flex"
    }

    function changeImage(i, e) {
        e.preventDefault();
        var url = fullImg.getAttribute("src");
        var img = document.querySelector(".img[data-url='" + url + "']");
        var index = images.indexOf(img);
        index += i;
        if (i > 0 && index >= images.length) {
            index = 0;
        }
        if (i < 0 && index < 0) {
            index = images.length - 1;
        }
        url = images[index].getAttribute("data-url");
        loadImage(url);
    }

    // Window scroll events
    window.addEventListener("load", function() {
        console.log("Loaded");
        slideIn(); // Images animation if the scroll is greater than offset
        toggleMenuItem(); // Menu animation if the scroll is greater than offset
        var deviceScreen = window.screen.availWidth;
        // Gallery btns
        var closeBtn = document.getElementById("close-btn");
        var leftBtn = document.getElementById("backward-btn");
        var rightBtn = document.getElementById("forward-btn");

        // Gallery buttons events
        rightBtn.addEventListener("click", changeImage.bind(null, 1));
        leftBtn.addEventListener("click", changeImage.bind(null, -1));
        closeBtn.addEventListener("click", function(e) {
            e.preventDefault();
            gallery.style.display = "none";
        });
        fullImg.addEventListener("contextmenu", rightClick);
        // Add events to see the full image
        images.forEach(function(img) {
            img.addEventListener("contextmenu", rightClick);
            img.addEventListener("click", imgEvent);
        });
        menu.addEventListener("click", openMenu);
        window.addEventListener("scroll", slideIn);
        if (deviceScreen > 1024) {
            window.addEventListener("scroll", toggleMenuItem);
        }
    });
}())
