/* eslint-disable */
import {
    cloneLayoutItem,
    cloneLayout,
    calculateXYI,
    findLayoutItemIndex,
} from '../utils';

import _ from 'lodash';

const namespaced = true;

const state = {
    layoutCache: [],
    layout: []
};

const mutations = {
    ADD_LAYOUT_ITEM({layout}, payload) {
        layout.push(Object.assign(payload, calculateXYI(layout, payload)));
    },
    EDIT_LAYOUT_ITEM({layout}, layoutItem) {
        const index = findLayoutItemIndex(layout, layoutItem.i);

        layout.splice(index, 1, layoutItem);
    },
    DELETE_LAYOUT_ITEM({layout}, index) {
        layout.splice(index, 1);
    },
    EXPAND_LAYOUT_ITEM({layout, layoutCache}, index) {
        let layoutItem = cloneLayoutItem(layout, index);

        layoutItem.x = 0;
        layoutItem.y = 0;
        layoutItem.w = 12;

        cloneLayout(layout, layoutCache);
        layout.push(layoutItem);
    },
    COLLAPSE_LAYOUT_ITEM({layout, layoutCache}) {
        cloneLayout(layoutCache, layout);
    },
    SET_LAYOUT(state, layout) {
        state.layout = _.cloneDeep(layout);
    }
};

const getters = {
    HAS_LAYOUT(state) {
        return state.layout.length > 0;
    },
    GET_LAYOUT(state) {
        return _.cloneDeep(state.layout);
    }
};


export default {
    namespaced,
    state,
    mutations,
    getters
};
