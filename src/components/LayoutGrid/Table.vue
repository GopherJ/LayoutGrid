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
            <b-table-column v-for="(value, key) in props.row" :field="key" :label="key" centered>
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
                type: Boolean
            },
            narrowed: {
                type: Boolean
            },
            focusable: {
                type: Boolean
            },
            hoverable: {
                type: Boolean
            },
            striped: {
                type: Boolean
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
