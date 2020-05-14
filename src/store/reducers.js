export const ACTION_CHANGE_MASTERS_LIST = 'ACTION_CHANGE_MASTERS_LIST';
export const ACTION_CHANGE_TARGET_CATEGORY = 'ACTION_CHANGE_TARGET_CATEGORY';
export const ACTION_CHANGE_TARGET_CITY = 'ACTION_CHANGE_TARGET_CITY';
export const ACTION_CHANGE_MASTERSLIST_SCROLL = 'ACTION_CHANGE_MASTERSLIST_SCROLL';

const initialState = {
    mastersList: [],
    targetCategory: '',
    targetCity: '',
    mastersListScroll: 0
};

export const rootReducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case ACTION_CHANGE_MASTERS_LIST:
            return {...state, mastersList: action.payload};
        case ACTION_CHANGE_TARGET_CATEGORY:
            return {...state, targetCategory: action.payload, mastersList: []};
        case ACTION_CHANGE_TARGET_CITY:
            return {...state, targetCity: action.payload, mastersList: []};
        case ACTION_CHANGE_MASTERSLIST_SCROLL:
            return {...state, mastersListScroll: action.payload};
    }
    return state;
};