<template>
    <div class="layout-grid" ref="LayoutGrid">

        <grid-layout
            :layout="layout"
            :row-height="rowHeight"
            :margin="margin"
            :is-draggable="editable"
            :is-resizable="editable"
            @layout-updated="(n) => onLayoutUpdated(n)">

            <grid-item
                v-for="(l, idx) of layout"
                :x="l.x"
                :y="l.y"
                :w="l.w"
                :h="l.h"
                :i="l.i"
                :min-w="minW"
                @resize="(i, h, w) => onResize(i, h, w)"
                @move="(i, x, y) => $emit('move', i, x, y)"
                @moved="(i, x, y) => $emit('moved', i, x, y)"
                @resized="(i, h, w, hpx, wpx) => onResized(i, h, w, hpx, wpx)"
                drag-allow-from=".layout-grid-item-header-title"
                drag-ignore-from=".layout-grid-item-content"
                v-if="l.show"
                :key="l.i">

                <div class="layout-grid-item" :class="{ 'layout-grid-item-border': editable }">

                    <div class="layout-grid-item-header">
                        <div class="level is-mobile">

                            <div class="level-left">
                                <div class="level-item">
                                    <span class="layout-grid-item-header-title">
                                        {{ l.title || null }}
                                    </span>
                                </div>
                            </div>

                            <div class="level-right" v-if="editable">
                                <div class="level-item">
                                    <span v-show="!hasLayoutItemExpanded"
                                          class="icon">
                                        <i class="mdi mdi-arrow-expand mdi-18px"
                                           @click.stop="EXPAND_LAYOUT_ITEM(idx);
                                          hasLayoutItemExpanded = true;"></i>
                                    </span>

                                    <span v-show="hasLayoutItemExpanded"
                                          class="icon">
                                        <i class="mdi mdi-arrow-collapse mdi-18px"
                                           @click.stop="COLLAPSE_LAYOUT_ITEM();
                                          hasLayoutItemExpanded = false;"></i>
                                    </span>
                                </div>

                                <div class="level-item">
                                    <span class="icon">
                                        <i class="mdi mdi-pencil mdi-18px" @click="onEdit(l.i)"></i>
                                    </span>
                                </div>

                                <div class="level-item">
                                    <span class="icon"
                                          v-show="!hasLayoutItemExpanded">
                                        <i class="mdi mdi-close-outline mdi-18px"
                                           @click.stop="DELETE_LAYOUT_ITEM(idx);"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="layout-grid-item-content" :style="{ height : `${GetHeight(l.h) }` }">

                        <component
                            :ref="GetRef(l.i)"
                            :is="canRender(l) ? l.is : 'emotion'"
                            v-bind="canRender(l) ? l.data : null">
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
    import {mapMutations, mapState} from 'vuex';
    import Emotion from './Emotion';

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
                default: () => [0, 0]
            },
            rowHeight: {
                type: Number,
                default: 100,
            },
            minW: {
                type: Number,
                default: 1
            }
        },
        methods: {
            GetHeight(h) {
                return `${h * this.rowHeight - 30}px`;
            },
            GetRef(i) {
                return `LayoutGridItem${i}`;
            },
            ...mapMutations('LayoutGrid', [
                'EXPAND_LAYOUT_ITEM',
                'DELETE_LAYOUT_ITEM',
                'COLLAPSE_LAYOUT_ITEM',
            ]),
            onResize(i, h, w) {
                this.$emit('resize', i, h, w);

                // dynamic component
                if (this.$refs[this.GetRef(i)][0].safeDraw) {
                    this.$refs[this.GetRef(i)][0].safeDraw();
                }
            },
            onResized(i, h, w, hpx, wpx) {
                this.$emit('resized', i, h, w, hpx, wpx);

                // dynamic component
                if (this.$refs[this.GetRef(i)][0].safeDraw) {
                    this.$refs[this.GetRef(i)][0].safeDraw();
                }
            },
            onLayoutUpdated(n) {
                this.$emit('updated', n);
            },
            onEdit(i) {
                this.$emit('edit', i);

                // design for https://github.com/GopherJ/Vs
                if (this.$root) {
                    this.$root.$emit('layout-item-edit', {
                        i,
                        payload: null
                    });
                }
            },
            canRender(l) {
                // design for https://github.com/GopherJ/Vs
                switch (l.is) {
                    case 'd3-pie':
                    case 'd3-bar':
                    case 'd3-line':
                    case 'd3-timeline':
                    case 'd3-timelion':
                    case 'd3-multi-line':
                    case 'd3-table':
                        return l.data.data.length > 0;
                    case 'd3-sankey-circular':
                        return l.data.nodes.length > 0 && l.data.links.length > 0;
                    case 'd3-metric':
                    case 'd3-circle':
                        return typeof l.data.data === 'number' || typeof l.data.data === 'string';
                    default:
                        return l.is && l.data;
                }
            },
        },
        computed: {
            ...mapState('LayoutGrid', [
                'layout'
            ])
        },
        components: {
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem,
            Emotion
        },
        mounted() {
            this.unwatch =  this.$watch(vm => vm.layout.length, function (n, o) {
                // item added or updated
                if (n >= o) {
                    window.dispatchEvent(new Event('resize'));
                }
            });
        },
        beforeDestroy() {
            this.unwatch();
        }
    }
</script>

<style scoped>
    .layout-grid-item {
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-between;

        overflow: hidden;
    }

    .layout-grid-item-border {
        /*border: 2px dashed #888;*/

        /*https://codepen.io/Hawkun/pen/rsIEp*/
        box-shadow: 2px 0 0 0 #e4e4e4,
        0 2px 0 0 #e4e4e4,
        2px 2px 0 0 #e4e4e4,
        2px 0 0 0 #e4e4e4 inset,
        0 2px 0 0 #e4e4e4 inset;
    }

    .layout-grid-item-header {
        height: 30px;
    }

    .layout-grid-item-header-title {
        font-weight: 600;
        font-family: inherit;
        font-size: 1.1rem;

        opacity: .5;

        word-break: break-all;
        word-wrap: break-word;

        position: relative;
        left: 2px;
    }

    .layout-grid-item-content {
        align-self: center;

        padding-top: 0;
        padding-left: 15px;
        padding-right: 15px;

        /*for emotion*/
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;

        width: 100%;

        overflow: hidden;
    }

    .icon {
        transition: .3s opacity;
        opacity: .4;
        cursor: pointer;
    }

    .icon:hover {
        opacity: 1;
    }
</style>

<style>
    .vue-grid-item.vue-grid-placeholder {
        display: none;
    }


    .vue-grid-item > .vue-resizable-handle {
        background-position: unset;
    }
</style>
