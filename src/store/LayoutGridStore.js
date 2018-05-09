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
    UPDATE_LAYOUT_ITEM({layout}, payload) {
        const {index, layoutItem} = payload;

        Object.assign(layout[index], layoutItem);
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
    },
    SEARCH_LAYOUT_ITEM(state, searchString) {
        const re = new RegExp(searchString, 'i');
        const layout = state.layout;

        for (let i = 0, l = layout.length; i < l; i += 1) {
            const layoutItem = layout[i];

            if (re.test(layoutItem.title) || re.test(layoutItem.is) || re.test(layoutItem.i)) {
                Object.assign(layoutItem, {
                    show: true
                });
            } else {
                Object.assign(layoutItem, {
                    show: false
                });
            }
        }
    }
};

const getters = {
    HAS_LAYOUT(state) {
        return state.layout.length > 0;
    },
    GET_LAYOUT(state) {
        return state.layout;
    },
    GET_LAYOUT_CONFIG(state) {
        const layout = state.layout,
            layoutConfig = [];

        for (let i = 0, l = layout.length; i < l; i += 1) {
            const layoutItem = cloneLayoutItem(layout, i);

            switch (layoutItem.is) {
                case 'd3-pie':
                case 'd3-bar':
                case 'd3-line':
                case 'd3-timeline':
                case 'd3-timelion':
                case 'd3-multi-line':
                    layoutItem.data.data = [];

                    layoutConfig.push(layoutItem);
                    break;
                case 'd3-sankey-circular':
                    layoutItem.data.nodes = [];
                    layoutItem.data.links = [];

                    layoutConfig.push(layoutItem);
                    break;
                case 'd3-metric':
                    layoutItem.data.data = null;

                    layoutConfig.push(layoutItem);
                    break;
                default:
                    layoutItem.data = null;

                    layoutConfig.push(layoutItem);
                    break;
            }
        }

        return layoutConfig;
    }
};


export default {
    namespaced,
    state,
    mutations,
    getters
};
