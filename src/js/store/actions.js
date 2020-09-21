import {
    ACTION_CHANGE_MASTERS_LIST,
    ACTION_CHANGE_TARGET_CATEGORY,
    ACTION_CHANGE_TARGET_CITY,
    ACTION_CHANGE_TARGET_COUNTRY,
    ACTION_CHANGE_MASTERSLIST_SCROLL,
    ACTION_CHANGE_FINDMODELS_LIST,
    ACTION_CHANGE_FINDMODELS_SCROLL,
    ACTION_CHANGE_ACTIVE_MASTER_ON_MASTERS,
    ACTION_CHANGE_ACTIVE_MASTER_ON_FINDMODELS,
    ACTION_CHANGE_ACTIVE_MASTER_ON_FAVS,
    LOGIN_USER,
    SET_MASTER,
    SET_LAUNCH_PARAMS,
    GO_TO,
    GO_FORWARD,
    CHANGE_STORY,
    CHANGE_ACTIVE_VIEW_LK,
    REG_SET,
    SET_FILTER
} from "./reducers"

export const setMaster = master => {
    console.log('SET_MASTER')
    return {
        type: SET_MASTER,
        payload: master
    }
}

export const loginUser = (user) => {
    console.log('LOGIN_USER')
    return {
        type: LOGIN_USER,
        payload: user
    }
}

export const changeMastersList = (newMastersList) => {
    console.log('in ACTION_CHANGE_MASTERS_LIST')
    return {
        type: ACTION_CHANGE_MASTERS_LIST,
        payload: newMastersList
    }
}

export const changeTargetCategory = (newTargetCategory) => {
    console.log('in ACTION_CHANGE_TARGET_CATEGORY')
    return {
        type: ACTION_CHANGE_TARGET_CATEGORY,
        payload: newTargetCategory
    }
}

export const changeTargetCity = (newTargetCity) => {
    console.log('in ACTION_CHANGE_TARGET_CITY')
    return {
        type: ACTION_CHANGE_TARGET_CITY,
        payload: newTargetCity
    }
}

export const changeTargetCountry = (newTargetCountry) => {
    console.log('in ACTION_CHANGE_TARGET_COUNTRY')
    return {
        type: ACTION_CHANGE_TARGET_COUNTRY,
        payload: newTargetCountry
    }
}

export const changeMasterslistScroll = (newScroll) => {
    console.log('in ACTION_CHANGE_MASTERSLIST_SCROLL')
    return {
        type: ACTION_CHANGE_MASTERSLIST_SCROLL,
        payload: newScroll
    }
}

export const changeFindModelsList = (newFindModelsList) => {
    console.log('in ACTION_CHANGE_FINDMODELS_LIST')
    return {
        type: ACTION_CHANGE_FINDMODELS_LIST,
        payload: newFindModelsList
    }
}

export const changeFindModelsListScroll = (newFindModelsListScroll) => {
    console.log('in ACTION_CHANGE_FINDMODELS_SCROLL')
    return {
        type: ACTION_CHANGE_FINDMODELS_SCROLL,
        payload: newFindModelsListScroll
    }
}

export const changeActiveMasterOnMasters = (NewActiveMaster) => {
    console.log('in ACTION_CHANGE_ACTIVE_MASTER_ON_MASTERS')
    return {
        type: ACTION_CHANGE_ACTIVE_MASTER_ON_MASTERS,
        payload: NewActiveMaster
    }
}

export const changeActiveMasterOnFindModels = (NewActiveMaster) => {
    console.log('in ACTION_CHANGE_ACTIVE_MASTER_ON_FINDMODELS')
    return {
        type: ACTION_CHANGE_ACTIVE_MASTER_ON_FINDMODELS,
        payload: NewActiveMaster
    }
}

export const changeActiveMasterOnFavs = (NewActiveMaster) => {
    console.log('in ACTION_CHANGE_ACTIVE_MASTER_ON_FAVS')
    return {
        type: ACTION_CHANGE_ACTIVE_MASTER_ON_FAVS,
        payload: NewActiveMaster
    }
}

export const changeLaunchParams = (params) => {
    console.log('in SET_LAUNCH_PARAMS')
    return {
        type: SET_LAUNCH_PARAMS,
        payload: params
    }
}

export const goTo = (story, panel) => {
    return {
        type: GO_TO,
        payload: {story: story, panel: panel}
    }
}

export const goForward = (story) => {
    return {
        type: GO_FORWARD,
        payload: {story: story}
    }
}

export const changeStory = (story) => {
    return {
        type: CHANGE_STORY,
        payload: story
    }
}

export const changeActiveViewLk = (activeView) => {
    return {
        type: CHANGE_ACTIVE_VIEW_LK,
        payload: activeView
    }
}

export const regSetInvite = (data) => {
    return {
        type: REG_SET,
        payload: data
    }
}

export const setFilter = (filter) => {
    return {
        type: SET_FILTER,
        payload: filter
    }
}