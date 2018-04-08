<template>
    <div :class="{ 'dashboard-grid-background' : background }" class="dashboard-grid">
        <grid-layout
            :layout="layout"
            :row-height="rowHeight"
            :margin="margin"
            :is-draggable="editable"
            :is-resizable="editable"
            @layout-updated="(n) => $emit('updated', n)">
            <grid-item
                v-for="(l, idx) of layout"
                :x="l.x"
                :y="l.y"
                :w="l.w"
                :h="l.h"
                :i="l.i"
                @resize="(i, h, w) => $emit('resize', i, h, w)"
                @move="(i, x, y) => $emit('move', i, x, y)"
                @moved="(i, x, y) => $emit('moved', i, x, y)"
                @resized="(i, h, w, hpx, wpx) => $emit('resized', i, h, w, hpx, wpx)"
                :key="l.i">
                <div class="dashboard-container"
                     :class="{ 'dashboard-container-border': editable }">
                    <div class="dashboard-header">
                        <div class="level is-mobile">
                            <div class="level-left" style="margin: 0 auto;">
                                <div class="level-item">
                                    <span class="dashboard-header-title">
                                        {{ l.title || l.name }}
                                    </span>
                                </div>
                            </div>

                            <div class="level-right" v-if="editable">
                                <div class="level-item">
                                    <span v-show="!hasLayoutItemExpanded"
                                          class="icon"
                                          @click.stop="EXPAND_LAYOUT_ITEM(idx);
                                          hasLayoutItemExpanded = true;">
                                        <i class="mdi mdi-arrow-expand mdi-16px"></i>
                                    </span>
                                    <span v-show="hasLayoutItemExpanded"
                                          class="icon"
                                          @click.stop="COLLAPSE_LAYOUT_ITEM();
                                          hasLayoutItemExpanded = false;">
                                        <i class="mdi mdi-arrow-collapse mdi-16px"></i>
                                    </span>
                                </div>
                                <div class="level-item">
                                    <span class="icon"
                                          @click="$emit('edit', l)">
                                        <i class="mdi mdi-pencil mdi-16px"></i>
                                    </span>
                                </div>
                                <div class="level-item">
                                    <span class="icon"
                                          v-show="!hasLayoutItemExpanded"
                                          @click.stop="DELETE_LAYOUT_ITEM(idx);">
                                        <i class="mdi mdi-close-outline mdi-16px"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-content" style="width: 100%;" :style="{ height : `${height(l.h)} !important` }">
                        <component
                            :is="l.name && l.data ? l.name : 'emotion-sad'"
                            style="width: 100%; height: 100%;"
                            v-bind="l.data || null">
                        </component>
                    </div>
                </div>
            </grid-item>
        </grid-layout>
    </div>
</template>

<script>
/* eslint-disable */
import VueGridLayout from 'vue-grid-layout';
import { mapMutations, mapState } from 'vuex';

export default {
    name: 'layout-grid',
    data() {
        return {
            hasLayoutItemExpanded: false,
        };
    },
    props: {
        editable: {
            type: Boolean,
            default: false,
        },
        margin: {
            type: Array,
            default: () => [0, 0],
        },
        background: {
            type: Boolean,
            default: true,
        },
        rowHeight: {
            type: Number,
            default: 100,
        }
    },
    methods: {
        height(h) {
            return `${h * 100 - 24.5}px`;
        },
        heightWithPadding(h) {
            return `${h * 100 - 15 - 24.5}px`;
        },
        ...mapMutations('LayoutGrid', [
            'EXPAND_LAYOUT_ITEM',
            'DELETE_LAYOUT_ITEM',
            'COLLAPSE_LAYOUT_ITEM'
        ])
    },
    computed: {
        ...mapState('LayoutGrid', [
            'layout'
        ])
    },
    components: {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        EmotionSad: {
            template: `
                <div style="display: flex; justify-content: center; align-items: center;">
                    <span class="icon" style="transform: scale(2, 2); opacity: .1;">
                          <i class="mdi mdi-emoticon-sad mdi-48px"></i>
                    </span>
                </div>
            `
        }
    }
}
</script>

<style scoped>
    .dashboard-grid-background {
        border: 1px solid #dbdbdb;
        border-radius: 3px;
        background-color: rgba(211, 211, 211, .1);
    }

    .dashboard-container {
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .dashboard-container-border {
        /*https://codepen.io/Hawkun/pen/rsIEp*/
        box-shadow:
            2px 0 0 0 #888,
            0 2px 0 0 #888,
            2px 2px 0 0 #888,   /* Just to fix the corner */
            2px 0 0 0 #888 inset,
            0 2px 0 0 #888 inset;
    }

    .dashboard-header {
        flex-wrap: wrap;
    }

    .dashboard-header-title {
        font-weight: 600;
        font-family: inherit;
        font-size: 1.1rem;
        opacity: .5;
        word-break: break-all;
        word-wrap: break-word;
    }

    .dashboard-content {
        align-self: center;

        padding-top: 0;
        padding-left: 15px;
        padding-right: 15px;
        padding-bottom: 15px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon {
        transition: .3s opacity;
        opacity: .4;
        cursor: pointer;
    }

    .icon:hover {
        opacity: 1;
    }

    .dashboard-grid >>> .vue-grid-item.vue-grid-placeholder {
        display: none;
        opacity: 1;
        transition: none;
        z-index: 1;
    }
</style>
