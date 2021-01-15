<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 配置管理</el-breadcrumb-item>
                <el-breadcrumb-item>配置列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="输入筛选关键词" class="handle-input mr10"></el-input>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="name" label="配置名称" width="250">
                </el-table-column>

                <el-table-column prop="interface.project" label="所属项目" width="250">
                </el-table-column>

                <el-table-column prop="interface.name" label="所属接口" width="250">
                </el-table-column>

                <el-table-column prop="author" label="编辑人员" width="100" align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="linkTo(scope.row.id)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"
                               @size-change="handleSizeChange" :page-sizes="[4, 5, 8, 10, 20]"
                               layout="total, sizes, prev, pager, next, jumper" :total="total_nums"
                               :page-size="page_size">
                </el-pagination>
            </div>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="删除配置" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { configures_list, delete_configure } from '../../api/api';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,    // 当前页
                page_size: 10,  // 每页显示的数量
                total_nums: 1, // 数据总条数

                multipleSelection: [],
                select_word: '',
                del_list: [],
                editVisible: false,
                delVisible: false,
                runVisible: false,
                form: {},

                idx: -1,   // 在tableData数组中的索引值
                id: -1,    // 在数据库中的真实索引值
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.name.indexOf(this.select_word) > -1 ||
                            d.interface.project.indexOf(this.select_word) > -1 ||
                            d.interface.name.indexOf(this.select_word) > -1 ||
                            d.author.indexOf(this.select_word) > -1
                        ) {
                            return d;
                        }
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
                // console.log('val', val);
                this.page_size = val;
                this.getData();
            },
            getData() {
                configures_list({
                    'page': this.cur_page,
                    'size': this.page_size
                })
                    .then(response => {
                        this.tableData = response.data.results;
                        this.cur_page = response.data.current_page_num || 1;
                        this.total_nums = response.data.count || 1;
                    })
            },
            search() {
                this.is_search = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                    delete_testcase(this.multipleSelection[i].id)
                        .then(response => {

                        })
                        .catch(error => {
                            this.$message.error('服务器错误');
                        })
                }

                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
                delete_configure(this.id)
                    .then(response => {
                        this.$message.success('删除成功');
                        this.delVisible = false;
                        if(this.tableData[this.idx].id === this.id){
                            this.tableData.splice(this.idx, 1);
                        }else{
                            for(let i = 0; i < this.tableData.length; i++){
                                if(this.tableData[i].id === this.id){
                                    this.tableData.splice(i, 1);
                                    return ;
                                }
                            }
                        }
                    })
                    .catch(error => {
                        this.$message.error('服务器错误');
                    })
            },
            linkTo(id) {
                this.$router.push({ path: `/configures_edit/${id}` });
            },
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
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
