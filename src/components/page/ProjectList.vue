<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>项目列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <!-- <el-select v-model="select_cate" placeholder="筛选项目" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select> -->
                <el-input v-model="select_word" placeholder="输入筛选关键词" class="handle-input mr10"></el-input>
                <!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <!-- <el-table-column prop="date" label="日期" sortable width="150">
                </el-table-column> -->

                <el-table-column prop="name" label="项目名称" width="250">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>项目名: {{ scope.row.name }}</p>
                            <p>接口数: {{ scope.row.interfaces }}</p>
                            <p>套件数: {{ scope.row.testsuits }}</p>
                            <p>用例数: {{ scope.row.testcases }}</p>
                            <p>配置数: {{ scope.row.configures }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                            </div>
                        </el-popover>
                </template>
                </el-table-column>

                <el-table-column prop="leader" label="项目负责人" width="100" align="center">
                </el-table-column>

                <el-table-column prop="publish_app" label="应用名称" width="250">
                </el-table-column>

                <el-table-column prop="tester" label="测试人员" width="100" align="center">
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" sortable align="center">
                </el-table-column>

                <!-- <el-table-column prop="address" label="地址" :formatter="formatter">
                </el-table-column> -->
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
        <el-dialog title="编辑项目" :visible.sync="editVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <!-- <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item> -->
                <el-form-item label="项目名称">
                    <el-input v-model="form.name" clearable></el-input>
                </el-form-item>

                <el-form-item label="项目负责人">
                    <el-input v-model="form.leader" clearable></el-input>
                </el-form-item>

                <el-form-item label="测试人员">
                    <el-input v-model="form.tester" clearable></el-input>
                </el-form-item>

                <el-form-item label="开发人员">
                    <el-input v-model="form.programmer" clearable></el-input>
                </el-form-item>

                <el-form-item label="应用名称">
                    <el-input v-model="form.publish_app" clearable></el-input>
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
        <el-dialog title="删除项目" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 运行项目弹出框 -->
        <el-dialog title="运行项目" :visible.sync="runVisible" width="30%" center>
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="运行环境">
                    <!-- <el-select v-model="form.region" placeholder="请选择">
                        <el-option key="bbk" label="步步高" value="bbk"></el-option>
                        <el-option key="xtc" label="小天才" value="xtc"></el-option>
                        <el-option key="imoo" label="imoo" value="imoo"></el-option>
                    </el-select> -->

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
    import { projects_list, delete_project, edit_project, envs_names, run_by_project } from '../../api/api';
    // import { delimiter } from 'path';
    // import func from '../../../vue-temp/vue-editor-bridge';
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
                // form: {
                //     name: '',
                //     date: '',
                //     address: ''
                // },
                form: {},

                project_idx: -1,   // 在tableData数组中的索引值 
                project_id: -1,    // 在数据库中的真实索引值
                
                env_id: '',
                envs_id_names: [],  // 返回的环境变量数据
            }
        },
        created() {
            this.getData();     // 获取项目数据
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
                        // if (d.publish_app.indexOf(this.select_cate) > -1 &&
                        //     (d.name.indexOf(this.select_word) > -1 ||
                        //         d.publish_app.indexOf(this.select_word) > -1)
                        // ) {
                        //     return d;
                        // }
                        if (d.name.indexOf(this.select_word) > -1 ||
                            d.publish_app.indexOf(this.select_word) > -1 ||
                            d.leader.indexOf(this.select_word) > -1 ||
                            d.programmer.indexOf(this.select_word) > -1 ||
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
            // 获取 easy-mock 的模拟数据
            getData() {
                // fetchData({
                //     page: this.cur_page
                // }).then((res) => {
                //     this.tableData = res.list;
                // })

                projects_list({
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
                this.project_idx = index;   // 当前修改的数据, 在tableData数组中的索引值
                this.project_id = row.id;   // 当前修改的数据在数据库中的真实索引值
                // this.form = {
                //     id: row.id,
                //     name: row.name,
                //     date: row.date,
                //     address: row.address
                // }
                this.form = row;
                this.editVisible = true;
            },
            handleRun(index, row) {
                this.project_idx = index;   // 当前修改的数据, 在tableData数组中的索引值
                this.project_id = row.id;   // 当前修改的数据在数据库中的真实索引值
                this.form = row;
                this.runVisible = true;
            },
            handleDelete(index, row) {
                // console.log('index: ' + index);
                // console.log('项目名: ' + row.name);
                // console.log('项目ID: ' + row.id);

                this.project_idx = index;
                this.project_id = row.id;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                    // alert(this.multipleSelection[i].id)
                    delete_project(this.multipleSelection[i].id)
                    .then(response => {
                        // 项目删除成功
                        
                    })
                    .catch(error => {
                        this.$message.error('服务器错误');
                    })
                }

                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                // console.log(val);
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                edit_project(this.project_id, this.form)
                .then(response => {
                    this.editVisible = false;
                    this.$message.success(`修改【 ${this.form.name} 】成功`);
                    if(this.tableData[this.project_idx].id === this.project_id){
                        this.$set(this.tableData, this.project_idx, this.form);
                    }else{
                        for(let i = 0; i < this.tableData.length; i++){
                            if(this.tableData[i].id === this.project_id){
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

                // this.editVisible = false;
                // this.$message.success(`修改第 ${this.idx+1} 行成功`);
                // if(this.tableData[this.project_idx].id === this.project_id){
                //     this.$set(this.tableData, this.project_idx, this.form);
                // }else{
                //     for(let i = 0; i < this.tableData.length; i++){
                //         if(this.tableData[i].id === this.project_id){
                //             this.$set(this.tableData, i, this.form);
                //             return ;
                //         }
                //     }
                // }
            },
            // 确定删除
            deleteRow(){
                // this.$message.success('删除成功');
                // this.delVisible = false;
                delete_project(this.project_id)
                .then(response => {
                    // 项目删除成功
                    this.$message.success('删除成功');
                    this.delVisible = false;
                    if(this.tableData[this.project_idx].id === this.project_id){
                        this.tableData.splice(this.project_idx, 1);
                    }else{
                        for(let i = 0; i < this.tableData.length; i++){
                            if(this.tableData[i].id === this.project_id){
                                this.tableData.splice(i, 1);
                                return ;
                            }
                        }
                    }
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })

                // if(this.tableData[this.idx].id === this.id){
                //     this.tableData.splice(this.idx, 1);
                // }else{
                //     for(let i = 0; i < this.tableData.length; i++){
                //         if(this.tableData[i].id === this.id){
                //             this.tableData.splice(i, 1);
                //             return ;
                //         }
                //     }
                // }
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
                run_by_project(this.project_id, this.env_id)
                .then(response => {
                    // console.log(response.data);   // 通过项目运行用例
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
            // del_project: function(pro_id) {
            //     delete_project(pro_id)
            //     .then(response => {
            //         // 项目删除成功
            //         if(this.tableData[this.project_idx].id === this.project_id){
            //             this.tableData.splice(this.project_idx, 1);
            //         }else{
            //             for(let i = 0; i < this.tableData.length; i++){
            //                 if(this.tableData[i].id === this.project_id){
            //                     this.tableData.splice(i, 1);
            //                     return ;
            //                 }
            //             }
            //         }
            //         this.$message.success('删除成功');
            //         this.delVisible = false;
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         this.$message.error('服务器错误');
            //     })
            // }
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
