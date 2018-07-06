/* eslint-disable */
import LayoutGrid from './components/LayoutGrid';
import LayoutGridStore from './store/LayoutGridStore';

const install = (Vue, options = {}) => {
    if (options.store) {
        options.store.registerModule('LayoutGrid', LayoutGridStore);
    }

    Vue.component(LayoutGrid.name, LayoutGrid);
};

export default {
    install
};

export {
    LayoutGrid,
    LayoutGridStore
};

