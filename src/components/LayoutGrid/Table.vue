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
            <b-table-column v-for="(value, key) in props.row" :field="key" :label="key" :key="key" centered sortable>
                {{ value }}
            </b-table-column>
        </template>

        <div slot="bottom-left">
            <strong>Export:  </strong>

            <a :href="json" download="data.json">
                <span class="icon">
                    <i class="mdi mdi-download mdi-18px"></i>
                </span>
                <span>json</span>
            </a>

            <a :href="csv" download="data.csv">
                <span class="icon">
                    <i class="mdi mdi-download mdi-18px"></i>
                </span>
                <span>csv</span>
            </a>
        </div>
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
        },
        computed: {
            csv() {
                if (this.data.length > 0) {
                    const [first] = this.data,
                        keys = Object.keys(first);

                    const replacer = (key, value) => value === null ? '' : value;
                    const data = this.data.reduce((ite, cur) => {
                        ite += '\r\n';
                        ite += keys.map(key => JSON.stringify(cur[key], replacer)).join(',');

                        return ite;
                    }, keys.join(','));

                    return `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`;
                }
            },
            json() {
                return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.data))}`;
            }
        }
    }
</script>

<style scoped>

</style>
