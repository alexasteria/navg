const BACK_LINK = 'http://localhost:3030/';
//const BACK_LINK = 'https://mysterious-garden-57052.herokuapp.com/';

const BACKEND = {
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
    }
};

export {BACKEND};