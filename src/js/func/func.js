const BACK_LINK = process.env.REACT_APP_BACK_LINK;

export const BACKEND = {
    users: {
        auth: BACK_LINK+'users/auth/',
        like: BACK_LINK+'users/like/'
    },
    message: BACK_LINK+'users/message/',
    masters: {
        all: BACK_LINK+'masters/',
        onID: BACK_LINK+'masters/',
        category: BACK_LINK+'masters/category/',
        vkuid: BACK_LINK+'masters/vkuid/',
        subscribers: BACK_LINK+'masters/subscribe/',
        onarrayid: BACK_LINK+'masters/onarrayid/',
        connect: BACK_LINK+'masters/connect/'
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
        onMasterId: BACK_LINK+'comment/master/',
        moderation: BACK_LINK+'comment/moderation/'
    },
    vkapi: {
        uploadPhoto: BACK_LINK+'vkapi/uploadPhoto/',
        savePhoto: BACK_LINK+'vkapi/savePhoto/',
        savePhotoFindModels: BACK_LINK+'vkapi/savePhotoFindModels/',
        getCities: BACK_LINK+'vkapi/getCities',
        isMember: BACK_LINK+'vkapi/isMember',
        getAlbum: BACK_LINK+'vkapi/getAlbum',
        delPhoto: BACK_LINK+'vkapi/delPhoto/',
    },
    category: {
        getAll: BACK_LINK+'category/'
    },
    logs: {
        params: BACK_LINK+'logs/params/'
    },
    sendmessage: BACK_LINK+'sendmessage',
    moder: BACK_LINK+'masters/moderation/',
    moderCom: BACK_LINK+'comment/moderation/',
};