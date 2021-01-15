<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 内置函数</el-breadcrumb-item>
                <el-breadcrumb-item>函数列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="输入筛选关键词" class="handle-input mr10"></el-input>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" stripe>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="project" label="项目名称" >
                </el-table-column>

                <el-table-column prop="name" label="内置函数名" align="center">
                    

                    <template slot-scope="scope">
                        <el-link icon="el-icon-edit" type="primary" @click="linkTo(scope.row.id)">{{ scope.row.name }}</el-link>
                        <!-- <router-link :to="{ path: `/builtin_edit/${id}` }">
                            {{ scope.row.name }}
                        </router-link> -->
                        <!-- <router-link :to="{ name: 'builtin_edit',  params: { id: scope.row.id }}">
                            {{ scope.row.name }}
                        </router-link> -->
                        <!-- { name: 'user', params: { userId: 123 }} -->
                </template>
                </el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" 
                @size-change="handleSizeChange" :page-sizes="[4, 5, 8, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper" :total="total_nums" :page-size="page_size">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import { builtins_list } from '../../api/api';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,    // 当前页
                page_size: 10,  // 每页显示的数量
                total_nums: 1, // 数据总条数

                select_word: '',

                project_idx: -1,   // 在tableData数组中的索引值 
                project_id: -1,    // 在数据库中的真实索引值
                
            }
        },
        created() {
            this.getData();     // 获取项目数据
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    if (d.name.indexOf(this.select_word) > -1 ||
                        d.project.indexOf(this.select_word) > -1
                    ) {
                        return d;
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleSizeChange(val) {
                this.page_size = val;
                this.getData();
            },
            getData() {

                builtins_list({
                    'page': this.cur_page,
                    'size': this.page_size
                })
                .then(response => {
                    this.tableData = response.data.results;
                    this.cur_page = response.data.current_page_num || 1;
                    this.total_nums = response.data.count || 1;
                })
            },
            linkTo(id) {
                // console.log(id);
                this.$router.push({ path: `/builtin_edit/${id}` });
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
