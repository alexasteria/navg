const BACK_LINK = 'http://localhost:3030/';
const BACKEND = {
    users: BACK_LINK+'users',
    masters: {
        all: BACK_LINK+'masters/',
        category: BACK_LINK+'masters/category/',
        vkuid: BACK_LINK+'masters/vkuid/'
    },
    favs: {
        new: BACK_LINK+'favs/',
        master: BACK_LINK+'favs/master/'
    }
};

export {BACKEND};