//const BACK_LINK = 'http://localhost:3030/';
const BACK_LINK = 'https://mysterious-garden-57052.herokuapp.com/';

export const BACKEND = {
    users: BACK_LINK+'users',
    masters: {
        all: BACK_LINK+'masters/',
        onID: BACK_LINK+'masters/',
        category: BACK_LINK+'masters/category/',
        vkuid: BACK_LINK+'masters/vkuid/'
    },
    favs: {
        new: BACK_LINK+'favs/',
        master: BACK_LINK+'favs/master/',
        user: BACK_LINK+'favs/user/'
    },
    findModel: {
        new: BACK_LINK+'findmodel/',
        onMasterId: BACK_LINK+'findmodel/onMasterId/',
        onCity: BACK_LINK+'findmodel/onCity/'
    },
    comment: {
        new: BACK_LINK+'comment/master/',
        onMasterId: BACK_LINK+'comment/master/'
    },
    vkapi: {
        uploadPhoto: BACK_LINK+'vkapi/uploadPhoto/',
        savePhoto: BACK_LINK+'vkapi/savePhoto/'
    },
    category: {
        getAll: BACK_LINK+'category/'
    }
};
export function postData(url = '', data = {}) {
    // Значения по умолчанию обозначены знаком *
    fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
        .then(data)
        .then(response => console.log(response.json())); // парсит JSON ответ в Javascript объект

}