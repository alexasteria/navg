import {
    ACTION_CHANGE_MASTERS_LIST,
    ACTION_CHANGE_TARGET_CATEGORY,
    ACTION_CHANGE_TARGET_CITY,
    ACTION_CHANGE_MASTERSLIST_SCROLL,
    ACTION_CHANGE_FINDMODELS_LIST,
    ACTION_CHANGE_FINDMODELS_SCROLL
} from "./reducers";

export const changeMastersList = (newMastersList) => {
    console.log('in ACTION_CHANGE_MASTERS_LIST', newMastersList);
    return {
        type: ACTION_CHANGE_MASTERS_LIST,
        payload: newMastersList
    };
};

export const changeTargetCategory = (newTargetCategory) => {
    console.log('in ACTION_CHANGE_TARGET_CATEGORY', newTargetCategory);
    return {
        type: ACTION_CHANGE_TARGET_CATEGORY,
        payload: newTargetCategory
    };
};

export const changeTargetCity = (newTargetCity) => {
    console.log('in ACTION_CHANGE_TARGET_CITY', newTargetCity);
    return {
        type: ACTION_CHANGE_TARGET_CITY,
        payload: newTargetCity
    };
};

export const changeMasterslistScroll = (newScroll) => {
    console.log('in ACTION_CHANGE_MASTERSLIST_SCROLL', newScroll);
    return {
        type: ACTION_CHANGE_MASTERSLIST_SCROLL,
        payload: newScroll
    };
};

export const changeFindModelsList = (newFindModelsList) => {
    console.log('in ACTION_CHANGE_FINDMODELS_LIST', newFindModelsList);
    return {
        type: ACTION_CHANGE_FINDMODELS_LIST,
        payload: newFindModelsList
    };
};

export const changeFindModelsListScroll = (newFindModelsListScroll) => {
    console.log('in ACTION_CHANGE_FINDMODELS_SCROLL', newFindModelsListScroll);
    return {
        type: ACTION_CHANGE_FINDMODELS_SCROLL,
        payload: newFindModelsListScroll
    };
};