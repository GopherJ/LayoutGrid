import _ from 'lodash';




/**
 *
 * @param layout
 * @param idx
 * @returns {layout}
 */
const cloneLayoutItem = (layout, idx) => {
    return _.cloneDeep(layout[idx]);
};




/**
 *
 * @param layout
 */
const clearLayout = (layout) => {
    layout.length = 0;
};




/**
 *
 * clone layout from layout to layoutCache when resize
 * @param layout
 * @param layoutCache
 */
const cloneLayout = (layout, layoutCache) => {
    clearLayout(layoutCache);

    for (let i = 0, l = layout.length; i < l; i += 1) {
        layoutCache.push(cloneLayoutItem(layout, i))
    }

    clearLayout(layout);
};




/**
 *
 * @param layout
 * @param i
 * @returns {*}
 */
const findLayoutItemIndex = (layout, i) => {
    return layout.findIndex(el => el.i === i);
};




/**
 *
 * @param layoutItem
 * @returns {{x: *, y: *, w: *, h: *, i: *}}
 */
const getLayoutItemPos = (layoutItem) => {
    const { x, y, w, h, i } = layoutItem;

    return {x, y, w, h, i};
};




/**
 *
 * @param l1
 * @param l2
 * @returns {boolean}
 */
const isCollided = (l1, l2) => {
    if (l1 === l2) return false;
    if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
    if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
    if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
    if (l1.y >= l2.y + l2.h) return false; // l1 is below l2

    return true; // boxes overlap
};




/**
 *
 * @param layout
 * @returns {number}
 */
const maxY = (layout) => {
    let _maxY = 0;

    layout.forEach(l => {
        const y = l.y + l.h;
        if (y > _maxY) {
            _maxY = y;
        }
    });
    return _maxY;
};






/**
 *
 * @param layout
 * @param layoutItem
 * @returns {*|boolean}
 */
const hasCollidedItem = (layout, layoutItem) => {
    return layout.some(el => isCollided(el, layoutItem));
};




/**
 *
 * @param layout
 * @param layoutItem
 */
const verticalCompact = (layout, layoutItem) => {
    if (hasCollidedItem(layout, layoutItem)) {
        while(hasCollidedItem(layout, layoutItem)) {
            layoutItem.y += 1;
        }
    }

    else {
        while (!hasCollidedItem(layout, layoutItem) && layoutItem.y > 0) {
            layoutItem.y -= 1;
        }

        layoutItem.y += 1;
    }
};




/**
 *
 * @param layout
 * @returns {string}
 */
const maxI = (layout) => {
    return layout.length === 0
        ? '0'
        : (Math.max(...layout.map(el => Number.parseInt(el.i, 10))) + 1).toString();
};




/**
 *
 * @param layout
 * @param w
 * @param h
 * @returns {{x: *, y: *, w: *, h: *, i}}
 */
const calculateXYI = (layout, {w, h}) => {
    // when w is smaller than 1
    if (w < 1) {
        w = 1;
    }
    // when w is greater than 12
    if (w > 12) {
        w = 12;
    }

    // when h is smaller than 1
    if (h < 1) {
        h = 1;
    }

    // initialisation
    let x, y, i = maxI(layout);

    // there is no other layoutItem
    if (layout.length === 0) {
        x = y = 0;

        return {
            x, y, i, w, h
        };
    }

    // compare with the last layoutItem
    const lastItem = layout[layout.length - 1];

    // try
    x = lastItem.x + lastItem.w;
    y = lastItem.y;

    const l = {
        x, y, i, w, h
    };

    if (l.x + w > 12) {
        l.x = 0;
        l.y = lastItem.y + lastItem.h;

        verticalCompact(layout, l);
    } else {
        verticalCompact(layout, l);
    }

    return l;
};



export {
    cloneLayoutItem,
    cloneLayout,
    clearLayout,
    isCollided,
    hasCollidedItem,
    verticalCompact,
    calculateXYI,
    findLayoutItemIndex,
    getLayoutItemPos,
    maxY,
    maxI
};
