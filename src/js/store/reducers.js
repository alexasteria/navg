export const ACTION_CHANGE_MASTERS_LIST = 'ACTION_CHANGE_MASTERS_LIST'
export const ACTION_CHANGE_TARGET_CATEGORY = 'ACTION_CHANGE_TARGET_CATEGORY'
export const ACTION_CHANGE_TARGET_CITY = 'ACTION_CHANGE_TARGET_CITY'
export const ACTION_CHANGE_TARGET_COUNTRY= 'ACTION_CHANGE_TARGET_COUNTRY'
export const ACTION_CHANGE_MASTERSLIST_SCROLL = 'ACTION_CHANGE_MASTERSLIST_SCROLL'
export const ACTION_CHANGE_FINDMODELS_LIST = 'ACTION_CHANGE_FINDMODELS_LIST'
export const ACTION_CHANGE_FINDMODELS_SCROLL = 'ACTION_CHANGE_FINDMODELS_SCROLL'
export const ACTION_CHANGE_ACTIVE_MASTER_ON_MASTERS = 'ACTION_CHANGE_ACTIVE_MASTER_ON_MASTERS'
export const ACTION_CHANGE_ACTIVE_MASTER_ON_FINDMODELS = 'ACTION_CHANGE_ACTIVE_MASTER_ON_FINDMODELS'
export const ACTION_CHANGE_ACTIVE_MASTER_ON_FAVS = 'ACTION_CHANGE_ACTIVE_MASTER_ON_FAVS'
export const LOGIN_USER = 'LOGIN_USER'
export const SET_MASTER = 'SET_MASTER'
export const SET_LAUNCH_PARAMS = 'SET_LAUNCH_PARAMS'
export const GO_TO = 'GO_TO'
export const GO_FORWARD = 'GO_FORWARD'
export const CHANGE_STORY = 'CHANGE_STORY'
export const CHANGE_ACTIVE_VIEW_LK = 'CHANGE_ACTIVE_VIEW_LK'
export const REG_SET = 'REG_SET'
export const SET_FILTER = 'SET_FILTER'

const initialState = {
    loginStatus: false,
    user: {},
    master: null,
    mastersList: [],
    mastersListScroll: 0,
    targetCategory: '',
    targetCity: '',
    targetCountry: '',
    findModelsList: [],
    findModelsListScroll: 0,
    activeMasterOnMasters: {},
    activeMasterOnFindModels: {},
    activeMasterOnFavs: {},
    params: null,
    activePanelnews: 'news',
    activePanelmasters: 'mastersList',
    activePanelfindmodel: 'findmodel',
    activePanellk: 'lk',
    //activePanelregistration: 'registration',
    newsHistory: ['news'],
    mastersHistory: ['mastersList'],
    findmodelHistory: ['findmodel'],
    lkHistory: ['lk'],
    //registrationHistory: ['registration'],
    activeStory: 'news',
    activeViewLk: 'lk',
    regSet: null,
    filter: []
}

export const rootReducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case ACTION_CHANGE_MASTERS_LIST:
            return {...state, mastersList: action.payload}
        case ACTION_CHANGE_TARGET_CATEGORY:
            return {...state, targetCategory: action.payload, mastersList: []}
        case ACTION_CHANGE_TARGET_CITY:
            let changeCity = state.user
            changeCity.location.city = action.payload
            return {...state, targetCity: action.payload, mastersList: [], findModelsList: [], user: changeCity}
        case ACTION_CHANGE_MASTERSLIST_SCROLL:
            return {...state, mastersListScroll: action.payload}
        case ACTION_CHANGE_FINDMODELS_LIST:
            return {...state, findModelsList: action.payload}
        case ACTION_CHANGE_FINDMODELS_SCROLL:
            return {...state, findModelsListScroll: action.payload}
        case LOGIN_USER:
            return {...state, loginStatus: true, user: action.payload, targetCity: action.payload.location !== undefined ? action.payload.location.city : {id: 1, title: 'Москва'}}
        case SET_MASTER:
            let changeIsMaster = state.user
            changeIsMaster.isMaster = true
            return {...state, master: action.payload, user: changeIsMaster}
        case ACTION_CHANGE_ACTIVE_MASTER_ON_MASTERS:
            return {...state, activeMasterOnMasters: action.payload}
        case ACTION_CHANGE_ACTIVE_MASTER_ON_FINDMODELS:
            return {...state, activeMasterOnFindModels: action.payload}
        case ACTION_CHANGE_ACTIVE_MASTER_ON_FAVS:
            return {...state, activeMasterOnFavs: action.payload}
        case SET_LAUNCH_PARAMS:
            return {...state, params: action.payload}
        case GO_TO:
            let history = state[action.payload.story+'History']
            if (history[history.length-1] !== action.payload.panel) history.push(action.payload.panel)
            if (action.payload.panel === history[0]) history = [action.payload.panel]
            return {...state, ['activePanel'+action.payload.story]: action.payload.panel, [action.payload.story+'History']: history, activeStory: action.payload.story}
        case GO_FORWARD:
            let newhistory = state[action.payload.story+'History']
            newhistory.pop()
            return {...state, [action.payload.story+'History']: newhistory, ['activePanel'+action.payload.story]: newhistory[newhistory.length -1], activeStory: action.payload.story}
        case CHANGE_STORY:
            return {...state, activeStory: action.payload}
        case CHANGE_ACTIVE_VIEW_LK:
            return {...state, activeViewLk: action.payload}
        case REG_SET:
            return {...state, regSet: action.payload}
        case SET_FILTER:
            return {...state, filter: action.payload}

    }
    return state
}