export const ACTION_CHANGE_MASTERS_LIST = 'ACTION_CHANGE_MASTERS_LIST';
export const ACTION_CHANGE_TARGET_CATEGORY = 'ACTION_CHANGE_TARGET_CATEGORY';
export const ACTION_CHANGE_TARGET_CITY = 'ACTION_CHANGE_TARGET_CITY';
export const ACTION_CHANGE_MASTERSLIST_SCROLL = 'ACTION_CHANGE_MASTERSLIST_SCROLL';
export const ACTION_CHANGE_FINDMODELS_LIST = 'ACTION_CHANGE_FINDMODELS_LIST';
export const ACTION_CHANGE_FINDMODELS_SCROLL = 'ACTION_CHANGE_FINDMODELS_SCROLL';
export const LOGIN_USER = 'LOGIN_USER';
export const SET_MASTER = 'SET_MASTER';

const initialState = {
    loginStatus: false,
    user: {},
    master: {},
    mastersList: [],
    mastersListScroll: 0,
    targetCategory: '',
    targetCity: '',
    findModelsList: [],
    findModelsListScroll: 0
};

export const rootReducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case ACTION_CHANGE_MASTERS_LIST:
            return {...state, mastersList: action.payload};
        case ACTION_CHANGE_TARGET_CATEGORY:
            return {...state, targetCategory: action.payload, mastersList: []};
        case ACTION_CHANGE_TARGET_CITY:
            let changeCity = state.user;
            changeCity.location.city = action.payload;
            return {...state, targetCity: action.payload, mastersList: [], user: changeCity};
        case ACTION_CHANGE_MASTERSLIST_SCROLL:
            return {...state, mastersListScroll: action.payload};
        case ACTION_CHANGE_FINDMODELS_LIST:
            return {...state, findModelsList: action.payload};
        case ACTION_CHANGE_FINDMODELS_SCROLL:
            return {...state, findModelsListScroll: action.payload};
        case LOGIN_USER:
            return {...state, loginStatus: true, user: action.payload, targetCity:action.payload.location.city};
        case SET_MASTER:
            let changeIsMaster = state.user;
            changeIsMaster.isMaster = true;
            return {...state, master: action.payload, user: changeIsMaster};
    }
    return state;
};