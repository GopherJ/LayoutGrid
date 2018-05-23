<template>
    <b-table
        :data="data"
        :bordered="bordered"
        :striped="striped"
        :narrowed="narrowed"
        :hoverable="hoverable"
        :focusable="focusable"
        paginated
        :per-page="perPage">
        <template slot-scope="props">
            <b-table-column v-for="(value, key) in props.row" :field="key" :label="key" :key="key" centered>
                {{ value }}
            </b-table-column>
        </template>
    </b-table>
</template>

<script>
    export default {
        name: 'table',
        props: {
            data: {
                type: Array,
                required: true
            },
            bordered: {
                type: Boolean,
                default: true
            },
            narrowed: {
                type: Boolean,
                default: false
            },
            focusable: {
                type: Boolean
            },
            hoverable: {
                type: Boolean
            },
            striped: {
                type: Boolean,
                default: true
            },
            perPage: {
                type: Number,
                default: 5
            }
        }
    }
</script>

<style scoped>

</style>
