const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    cheapestTicket = document.querySelector('#cheapest-ticket'),
    otherCheapTickets = document.querySelector('#other-cheap-tickets');

const obj = {
    key: 'value',
    'key two': 'value2',
    key3: false,
    key4: {
        a: 1,
        b: 'dva',
    },
    keyNext: ['array', 5, {a: 1, b: 2}, [true, false, 0]],
}

//Данные
// http://api.travelpayouts.com/data/ru/cities.json
// 		./database/cities.json
const citiesApi = 'https://api.allorigins.win/raw?url=https://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    apiKEY = '0d957685c6bf0fff4924547d548feffa',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 20; //кол-во вариантов на страницу
console.log(citiesApi)
let city = []; //список городов, получаем с API

//Запрос в авиасейлс по городам
const getData = (url, callback, reject = console.error) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            reject(request.status)
        }
    })



    request.send();
}

//функция показываем отфильтрованные города в выпадающем списке
const showCity = (input, list) => {
    list.textContent = ''; //очищаем список, после каждого ввода
    if (input.value !== '') { //условие, когда инпут непустой показываем список городов, когда пустой функция не срабатывает
        const filterCity = city.filter((item) => { //новый массив для фильтрованного списка
            const fixItem = item.name.toLowerCase(); //приводим все названия городов к нижнему регистру
            return fixItem.startsWith(input.value.toLowerCase()); //приводим введённый в инпуте символ к нижнему регистру, далее если айтем содержит элемент ввода в инпут-- возвращаем в новый массив
            //Также startWith выводит значение в выпадающем меню с первой введённой буквы,а не по всему слову, например в инпуте пишем "М" и нам выводятся города, начинающиеся с буквы "М"
        })
        filterCity.forEach((item) => { //в фильтрованном массиве создаём лишку для списка
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
}
//функция вставляем кликнутый ли (выбранный город) в значение инпут
const enterCityInput = (event, input, list) => {
    const target = event.target; //определяем кликнутый ли
    if (target.tagName.toLowerCase() === 'li') { // проверяем ли , ли это
        input.value = target.textContent; //вставляем значение ли в инпут
        list.textContent = '';//убираем выпадающее меню
    }
    ;
}
//Вместо кодов города в вёрстке, выводим название городов
const getNameCity = (code) => { //получаем код города от функции, вызываемой в вёрстке
    const objCity = city.find((item) => item.code === code); //ищем в массиве городов city совпадение по коду
    console.log(objCity);
    return objCity.name;//когда совпадение найдено, возвращаем в вёсртку название города вместо кода
}
//Формируем ссылку с заказом на авиасейлс
const  getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/'
    link += data.origin;
    const date = new Date(data.depart_date);

    const day = date.getDate();

    const month = date.getMonth()+1;

    link += day < 10 ? '0' + day : day; //добавляем ноль перед днём, если индекс дня меньше 10
    console.log(date.getDate(),date.getMonth()+1);

    link += month < 10 ? '0' + month : month; //добавляем ноль перед месяцем, если индекс месяца меньше 10

    link += data.destination; //Добавляем в ссылку город прибытия

    link += 1; //в классификации по авиабилетам, 1 в конце это значит летит 1 взрослый(в программе по умолчанию летает 1 взрослый)

    return link;
}


//В вёрстку строки самый дешёвый билет, в зависимости от поступивших данных с сервера вставляем строку
const getChanges = (num) => {
    if(num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками'
    } else {
        return 'Без пересадок'
    }
}

//Меняем дату в вёрстке на удобоваримую и более читабельную
const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if(data) {
        deep = `<h3 class="agent">${data.gate}</h3>
<div class="ticket__wrapper">
\t<div class="left-side">
\t\t<a href="${getLinkAviasales(data)}" class="button button__buy" target="_blank">Купить
\t\t\tза ${data.value}₽</a>
\t</div>
\t<div class="right-side">
\t\t<div class="block-left">
\t\t\t<div class="city__from">Вылет из города
\t\t\t\t<span class="city__name">${getNameCity(data.origin)}</span>
\t\t\t</div>
\t\t\t<div class="date">${getDate(data.depart_date)}</div>
\t\t</div>

\t\t<div class="block-right">
\t\t\t<div class="changes">${getChanges(data.number_of_changes)}</div>
\t\t\t<div class="city__to">Город назначения:
\t\t\t\t<span class="city__name">${getNameCity(data.destination)}</span>
\t\t\t</div>
\t\t</div>
\t</div>
</div>` ;
    } else {
        deep ='<h3>На текущую дату билетов нет</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep)



    return ticket;
}
const renderCheapDay = (cheapTicket) => {
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};
const renderCheapYear = (cheapTickets) => {
    cheapTickets.sort((a,b) => { //фильтруем по цене, от самой дешёвой к самой дорогой
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return  0;


    });

    //Более короткий вариант сортировки по числам
    // cheapTickets.sort((a,b) => a.value - b.value);


    //Добавляем 10 самых дешёвых билетов, в секцию дешёвые билеты на другие даты
    for (let i=0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]); //запускаем функцию создания верстки
        otherCheapTickets.append(ticket); //добавляем в нужную секцию
    }

    console.log(cheapTickets)
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices; //Забираем из data все рейсы из заданных городов
    const cheapTicketDay = cheapTicketYear.filter((item) => { //Фильтруем рейсы на сегодняшнее число
        return item.depart_date === date;
    });
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
}


//Обработчики событий

//Манипуляции с городами в инпуте ввода "откуда"
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom); //передаём в функцию нужный инпут и нужный выпадающий список
});
//Манипуляции с городами в инпуте ввода "откуда"
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo); //передаём в функцию нужный инпут и нужный выпадающий список
});

//Кликаем по выпавшему списку и вставляем значение в инпут велью "откуда"
dropdownCitiesFrom.addEventListener('click', (event) => {
    enterCityInput(event, inputCitiesFrom, dropdownCitiesFrom);
});
//Кликаем по выпавшему списку и вставляем значение в инпут велью "куда"
dropdownCitiesTo.addEventListener('click', (event) => {
    enterCityInput(event, inputCitiesTo, dropdownCitiesTo);
});
//При удачной отправке формы, создаётся объект с параметрами заказа
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();


    cheapestTicket.textContent =''; //очищаем поля результатов поиска, после каждого нового запроса
    otherCheapTickets.textContent =''; //очищаем поля результатов поиска, после каждого нового запроса
    const cityFrom = city.find((item) => {
        return inputCitiesFrom.value === item.name  //Возвращаем , когда находим совпадение данных из инпута с данными из city
    })
    const cityFind = city.find((item) => {
        return inputCitiesTo.value === item.name //Возвращаем , когда находим совпадение данных из инпута с данными из city
    })

    const formData = {
        from: cityFrom, //код города
        to: cityFind,
        when: inputDateDepart.value
    }

    if(formData.from && formData.to) { //Проверяем введённые названия городов в инпутах, если нет такого названия, то алерт!!
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${apiKEY}`

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);

        }, error => {
            // alert('В этом направлении нет рейсов');
            console.error('Ошибка', error)
        })
    } else {
        alert('Введите название города!!')
    }
})


//Вызовы функций
//получаем данные о перелётах и фильтруем
getData(citiesApi, (data) => {
    console.log(data)
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
    city.sort((a,b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return  0;
    });
}, (e) => {
    // alert('В этом направлениии нет рейсов!');
    console.log('Ошибка11', e);
});

