/* eslint-disable */
import utils from '../util/utils';
import _ from 'lodash';

const namespaced = true;

const state = {
    layoutCache: [],
    layout: [],
};

/**
 *
 * @param l1
 * @param l2
 */
const cloneLayout = (l1, l2) => {
    for (let i = 0; i < l1.length; i += 1) {
        l2.push(_.cloneDeep(l1[i]))
    }
};

/**
 *
 * @param l
 */
const clearLayout = (l) => {
    while (l.length !== 0) {
        l.pop();
    }
};

/**
 *
 * @param l
 * @param idx
 * @returns {layoutItem}
 */
const cloneLayoutItem = (l, idx) => {
    if (idx > l.length - 1 || idx < 0) {
        return;
    }
    return _.cloneDeep(l[idx]);
};

/**
 *
 * @param layout
 * @param i
 * @returns {*}
 */
const findLayoutItem = (layout, i) => {
    for (let j = 0; j < layout.length; j++) {
        if (i === layout[j].i) {
            return layout[j];
        }
    }
};

const getLayoutItemPos = (layoutItem) => {
    const { x, y, w, h, i } = layoutItem;

    return {x, y, w, h, i};
};

/**
 *
 * @param layout
 * @returns {layoutItem}
 */
/*TO DO*/
const firstLayoutItemInLastRow = (layout) => {
    if (layout.length === 1) {
        return layout[0];
    }

    for (let i = layout.length - 1; i >= 0; i -= 1) {
       if (layout[i].x === 0) {
           return layout[i];
       }
    }
};

/**
 *
 * @param l1
 * @param l2
 * @returns {boolean}
 */
const collide = (l1, l2) => {
  if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
  if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
  if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
  if (l1.y >= l2.y + l2.h) return false; // l1 is below l2

  return true; // boxes overlap
};

/**
 *
 * @param layout
 * @param l
 * @returns {boolean}
 */
const hasCollideLayoutItem = (layout, l) => {
    for (let i = 0; i < layout.length; i += 1) {
        if (collide(l, layout[i])) {
            return true;
        }
    }
    return false;
};

/**
 *
 * @param layout
 * @returns {number}
 */
const bottom = (layout) => {
    let gridY = 0;
    layout.forEach(l => {
        const y = l.y + l.h;
        if (y > gridY) {
            gridY = y;
        }
    });
    return gridY;
};

/**
 *
 * @param layout
 * @param w
 * @param h
 * @returns {{x: *, y: *, w: *, h: *, i}}
 */
const calculateXYI = (layout, [w, h]) => {
    let x, y, i = layout.length.toString();

    const l = {
        x, y, w, h, i
    };

    // when w is greater than 12
    if (l.w > 12) {
        l.w = 12;
    }

    // there is no other layoutItem
    if (layout.length === 0) {
        l.x = l.y = 0;

        return l;
    }

    // compare with the last layoutItem
    const lastLayoutItem = layout[layout.length - 1];

    l.y = lastLayoutItem.y;
    l.x = lastLayoutItem.x + lastLayoutItem.w;
    if (l.x + l.w > 12) {
        l.x = 0;

        const firstLayoutItem = firstLayoutItemInLastRow(layout);
        if (firstLayoutItem) {
            l.y = firstLayoutItem.y + firstLayoutItem.h;
        }
    }


    // vertically check
    while (hasCollideLayoutItem(layout, l)) {
        l.y += 1;
    }

    return l;
};

const mutations = {
    ADD_LAYOUT_ITEM({ layout }, layoutItem) {
        layout.push(layoutItem);
    },
    EDIT_LAYOUT_ITEM({ layout }, layoutItem, index) {
        layout.splice(index, 1, layoutItem);
    },
    DELETE_LAYOUT_ITEM({ layout }, idx) {
        layout.splice(idx, 1);
    },
    EXPAND_LAYOUT_ITEM({ layout, layoutCache }, idx) {
        cloneLayout(layout, layoutCache);
        let layoutItem = cloneLayoutItem(layout, idx);

        layoutItem.x = 0;
        layoutItem.y = 0;
        layoutItem.w = 12;
        layoutItem.h = bottom(layout);

        clearLayout(layout);
        layout.push(layoutItem);
    },
    COLLAPSE_LAYOUT_ITEM({ layout, layoutCache }) {
        clearLayout(layout);
        cloneLayout(layoutCache, layout);

        clearLayout(layoutCache);
    }
};

const actions = {
    /**
     *
     * @param context
     *
     * @param filters
     * @param name
     * @param aggs
     *
     */
    ADD_ITEM({ state, commit, rootGetters }, { filters, name, title, aggs }) {
        const query = rootGetters['ElsQuery/GET_QUERY'];

        const query_filters_aggs = {
            query, filters, aggs
        };

        utils.GET_DATA_BY_CHART[utils.NAME_FUNC_MAP[name]](query_filters_aggs)
            .then((data) => {
                const layoutItemPos = calculateXYI(state.layout, utils.DEFAULT_W_H(name));

                // every time we need to get the public query
                Reflect.deleteProperty(query_filters_aggs, 'query');

                console.log(JSON.stringify(data))
                const layoutItem = Object.assign({
                    name,
                    title,
                    data,
                }, query_filters_aggs, layoutItemPos);

                commit('ADD_LAYOUT_ITEM', layoutItem);
            });
    },
    /**
     *
     * @param context
     * @param filters
     * @param aggs
     * @param i
     * @constructor
     */
    EDIT_ITEM({ state, commit, rootGetters }, { filters, aggs, i }) {
        const layoutItem = findLayoutItem(state.layout, i);

        const { query, name } = layoutItem;

        const query_filters_aggs = {
            query, filters, aggs
        };

        utils.GET_DATA_BY_CHART[utils.NAME_FUNC_MAP[name]](query_filters_aggs)
            .then((data) => {
                const layoutItemPos = getLayoutItemPos(layoutItem);
                // I cant use rest spread operator here
                const layoutItem = Object.assign({
                    name,
                    data,
                }, query_filters_aggs, layoutItemPos);

                commit('EDIT_LAYOUT_ITEM', layoutItem, Number.parseInt(i, 10));
            });
    }
};

export default {
    namespaced,
    state,
    mutations,
    actions,
};
