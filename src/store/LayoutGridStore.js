/* eslint-disable */
import {
    cloneLayoutItem,
    calculateXYI,
    findLayoutItemIndex,
} from '../utils';

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
    DELETE_LAYOUT_ITEM({layout, layoutCache}, index) {
        const i = layout[index].i;
        const _index = layoutCache.findIndex(x => x.i === i);
        if (_index !== -1) {
            layoutCache.splice(_index, 1);
        }

        layout.splice(index, 1);
    },
    EXPAND_LAYOUT_ITEM({layout, layoutCache}, index) {
        if (layout[index].w === 12) return;

        layoutCache.push(layout[index]);
        let layoutItem = cloneLayoutItem(layout, index);

        layoutItem.x = 0;
        layoutItem.w = 12;

        layout.splice(index, 1, layoutItem);
    },
    COLLAPSE_LAYOUT_ITEM({layout, layoutCache}, i) {
        const index = findLayoutItemIndex(layoutCache, i);
        const _index = findLayoutItemIndex(layout, i);

        layout.splice(_index, 1, layoutCache[index]);
        layoutCache.splice(index, 1);
    },
    DELETE_LAYOUT_ITEM_IN_CACHE({layout, layoutCache}, i) {
        const index = findLayoutItemIndex(layoutCache, i);
        if (index !== -1) {
            layoutCache.splice(index, 1);
        }
    },
    SET_LAYOUT(state, layout) {
        state.layout.length = 0;
        state.layoutCache.length = 0;

        for (let i = 0, l = layout.length; i < l; i += 1) {
            state.layout.push(layout[i]);
        }
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
    HAS_LAYOUT({layout}) {
        return layout.length > 0;
    },
    GET_LAYOUT(state) {
        return state.layout;
    },
    GET_LAYOUT_CONFIG(state) {
        const layout = state.layout,
            LayoutConfig = [];

        for (let i = 0, l = layout.length; i < l; i += 1) {
            const layoutItem = cloneLayoutItem(layout, i);

            switch (layoutItem.is) {
                case 'd3-pie':
                case 'd3-horizontal-bar':
                case 'd3-vertical-bar':
                case 'd3-line':
                case 'd3-timeline':
                case 'd3-timelion':
                case 'd3-multi-line':
                case 'd3-area':
                    layoutItem.data.data = [];
                    break;
                case 'd3-sankey-circular':
                    layoutItem.data.nodes = [];
                    layoutItem.data.links = [];
                    break;
                case 'd3-metric':
                case 'd3-circle':
                    layoutItem.data.data = null;
                    break;
                case 'd3-l-heat':
                    layoutItem.data.data = [];
                    layoutItem.data.indoorMaps = [];
                    break;
                case 'd3-l-choropleth':
                    layoutItem.data.data = {
                        type: 'FeatureCollection',
                        features: []
                    };
                    layoutItem.data.indoorMaps = [];
                    break;
                default:
                    layoutItem.data = null;
                    break;
            }

            delete layoutItem.moved;
            LayoutConfig.push(layoutItem);
        }

        return LayoutConfig;
    }
};


export default {
    namespaced,
    state,
    mutations,
    getters
};
