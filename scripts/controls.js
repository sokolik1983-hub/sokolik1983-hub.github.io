const mainMenuLi = document.querySelectorAll('.main-menu li'),
    backLink = document.querySelector('.back-link p'),
    content = document.querySelector('.content'),
    wrapper = document.querySelector('.wrapper'),
    socialBox = document.querySelector('.social-box'),
    contentAbout = document.querySelector('.content__about'),
    jsProjects = document.querySelector('.js-projects'),
    reactProjects = document.querySelector('.react-projects'),
    myWorks = document.querySelector('.my-works'),
    contentImg = document.querySelector('.content__img'),
    contentInfo = document.querySelector('.content__info');

let backLinkWidth = backLink.getBoundingClientRect().width;
//Кнопка "назад" за экраном
backLink.style.transform = `translateX(${-backLinkWidth * 2}px)`;


let contentStyleTop = innerHeight * 0.8; //Высота блока контента, когда он видим

let backLinkLeft; //переменная для передачи в аниме джэс
let mainMenuLiStyle; //переменная для передачи в аниме джэс


if (innerWidth <768) {
    backLinkLeft = (innerWidth * 0.5) - (backLinkWidth); //вычисляем положение кнопки "назад" на мобильных устройствах и передаём в аниме.js
    mainMenuLi.forEach(item => {
        mainMenuLiStyle = innerWidth * 0.5 - item.getBoundingClientRect().width;
        item.style.transform = `translateX(${mainMenuLiStyle}px)`;
        content.style.width = innerWidth * 0.9 + 'px';
        content.style.height = innerHeight * 0.65 + 'px';
        return contentStyleTop = innerHeight * 0.78; //Высота блока контента, когда он видим
    });
} else if(innerWidth >=768) {
    backLinkLeft = innerWidth * .05
    mainMenuLi.forEach(item => {
        item.style.transform = `translateX(${innerWidth * .05}px`;
        mainMenuLiStyle = innerWidth * .05;
        console.log( content.style.width)
    });
    //Контейнер контента определяем стили для блока и библиотеки аниме джес

    content.style.width = canvas.width * 0.75 + 'px';
    content.style.height = innerHeight * 0.75 + 'px';

}


const showContent = () => {
    anime({
        targets: '.main-menu li',
        translateX: -400,
        delay: function(el, i, l) {
            return (l - i)* 100;
        },
    });
    anime({
        targets: '.content',
        translateY: -contentStyleTop,
        easing: 'easeInOutSine',
        duration: 500

    });
    anime({
        targets: '.back-link p',
        translateX: backLinkLeft,

    });
};

const hideContent = () => {
    anime({
        targets: '.main-menu li',
        translateX: mainMenuLiStyle,
        delay: function(el, i, l) {
            return i * 100;
        },
    });
    anime({
        targets: '.back-link p',
        translateX: -250,

    });
    anime({
        targets: '.content',
        translateY: 870,
        easing: 'easeInOutSine',
        duration: 500

    });
    contentAbout.classList.add('d-none');
    jsProjects.classList.add('d-none');
    reactProjects.classList.add('d-none');
    myWorks.classList.add('d-none');
}
const showRequestContent = (event) => {
    let dataNum = event.target.getAttribute('data-value');
    switch(dataNum) {
        case '1':
            contentAbout.classList.remove('d-none');
            contentInfo.style.top = contentImg.getBoundingClientRect().height + 'px'; //в мобильной версии двигаем блок вниз на высоту блока с фото
            break;
        case '2':
            reactProjects.classList.remove('d-none');
            break;
        case '3':
            jsProjects.classList.remove('d-none');
            break;
        case '4':
            myWorks.classList.remove('d-none');
            break;
    }
}

mainMenuLi.forEach(item => {
    item.addEventListener('click', event => {
        showContent();
        showRequestContent(event);

    })
});
backLink.addEventListener('click', hideContent);

//Даём класс картинке с фото, при ховере соц. иконок
socialBox.addEventListener('mouseover', () => wrapper.classList.add('hover'));
socialBox.addEventListener('mouseout', () => wrapper.classList.remove('hover'));



//Скрипты для табов в разделе "проекты"
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const panes = $$(".tab-pane");

const tabActive = $(".tab-item.active");
const line = $(".tabs .line");

line.style.left = tabActive.offsetLeft + "px";
line.style.width = tabActive.offsetWidth + "px";

tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");

        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";

        this.classList.add("active");
        pane.classList.add("active");
    };
});



