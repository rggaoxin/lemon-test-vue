<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 接口管理</el-breadcrumb-item>
                <el-breadcrumb-item>接口列表</el-breadcrumb-item>
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

                <el-table-column prop="name" label="接口名称" width="250">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>接口名: {{ scope.row.name }}</p>
                            <p>用例数: {{ scope.row.testcases }}</p>
                            <p>配置数: {{ scope.row.configures }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                            </div>
                        </el-popover>
                </template>
                </el-table-column>

                <el-table-column prop="tester" label="测试人员" width="100" align="center">
                </el-table-column>

                <el-table-column prop="project" label="所属项目" width="250">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleRun(scope.$index, scope.row)">运行</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑接口" :visible.sync="editVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="接口名称">
                    <el-input v-model="form.name" clearable></el-input>
                </el-form-item>

                <el-form-item label="测试人员">
                    <el-input v-model="form.tester" clearable></el-input>
                </el-form-item>

                <el-form-item label="所属项目">
                    <el-input v-model="form.project" disabled></el-input>
                </el-form-item>

                <el-form-item label="简要描述">
                    <el-input v-model="form.desc" clearable></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="删除接口" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 运行项目弹出框 -->
        <el-dialog title="运行接口" :visible.sync="runVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="运行环境">

                    <el-select v-model="env_id" clearable placeholder="请选择">
                        <el-option
                            v-for="item in envs_id_names"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="runVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmRun">运 行</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { interfaces_list, delete_interface, edit_interface, envs_names, run_by_interface } from '../../api/api';
import { O_RDONLY } from 'constants';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,    // 当前页
                page_size: 10,  // 每页显示的数量
                total_nums: 1, // 数据总条数

                multipleSelection: [],
                // select_cate: '',
                select_word: '',
                del_list: [],
                // is_search: false,
                editVisible: false,   // 新增项目弹框是否显示标识
                delVisible: false,    // 删除项目弹框是否显示标识
                runVisible: false,    // 运行项目弹框是否显示标识
                form: {},

                project_idx: -1,   // 在tableData数组中的索引值 
                project_id: -1,    // 在数据库中的真实索引值

                idx: -1,   // 在tableData数组中的索引值 
                id: -1,    // 在数据库中的真实索引值
                
                env_id: '',
                envs_id_names: [],  // 返回的环境变量数据
            }
        },
        created() {
            this.getData();     // 获取接口数据
            this.getEnvsIdNames();  // 获取环境变量ID和名称
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
                            d.project.indexOf(this.select_word) > -1 ||
                            d.tester.indexOf(this.select_word) > -1
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
                this.page_size = val;
                this.getData();
            },
            getData() {

                interfaces_list({
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
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;   // 当前修改的数据, 在tableData数组中的索引值
                this.id = row.id;   // 当前修改的数据在数据库中的真实索引值
                this.form = row;
                this.editVisible = true;
            },
            handleRun(index, row) {
                this.idx = index;   // 当前修改的数据, 在tableData数组中的索引值
                this.id = row.id;   // 当前修改的数据在数据库中的真实索引值
                this.form = row;
                this.runVisible = true;
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
                    delete_interface(this.multipleSelection[i].id)
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
            // 保存编辑
            saveEdit() {
                // var datas = this.form;
                var datas = Object.assign({}, this.form);
                delete datas.project;
                edit_interface(this.id, datas)
                .then(response => {
                    this.editVisible = false;
                    this.$message.success(`修改【 ${this.form.name} 】成功`);
                    if(this.tableData[this.idx].id === this.id){
                        this.$set(this.tableData, this.idx, this.form);
                    }else{
                        for(let i = 0; i < this.tableData.length; i++){
                            if(this.tableData[i].id === this.id){
                                this.$set(this.tableData, i, this.form);
                                return ;
                            }
                        }
                    }
                })
                .catch(error => {
                    this.editVisible = false;
                    this.$message.error('服务器错误');
                })

            },
            // 确定删除
            deleteRow(){
                delete_interface(this.id)
                .then(response => {
                    // 项目删除成功
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
            // 获取所有环境变量的ID和名称
            getEnvsIdNames(){
                envs_names()
                .then(response => {
                    this.envs_id_names = response.data;   // 将返回的环境变量数据赋值给envs_id_names
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
            },
            // 
            confirmRun(){
                run_by_interface(this.id, this.env_id)
                .then(response => {
                    // console.log(response.data);
                    this.$router.push({ path: `/reports_view/${response.data.id}` })
                })
                .catch(error => {
                    // console.log(error);
                    if (typeof error === 'object' && error.hasOwnProperty('msg') ){
                        this.$message.error(error.msg);
                    } else {
                        this.$message.error('服务器错误');
                    }
                })
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
