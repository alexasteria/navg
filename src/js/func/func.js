//const BACK_LINK = 'http://localhost:3030/';
const BACK_LINK = 'https://mysterious-garden-57052.herokuapp.com/';

export const BACKEND = {
    users: BACK_LINK+'users',
    message: BACK_LINK+'users/message/',
    masters: {
        all: BACK_LINK+'masters/',
        onID: BACK_LINK+'masters/',
        category: BACK_LINK+'masters/category/',
        vkuid: BACK_LINK+'masters/vkuid/',
        subscribers: BACK_LINK+'masters/subscribe/',
        onarrayid: BACK_LINK+'masters/onarrayid/'
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
    },
    logs: {
        params: BACK_LINK+'logs/params/'
    }
};