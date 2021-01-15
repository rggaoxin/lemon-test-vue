<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 套件管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增套件</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <el-form-item label="套件名称" prop="name" required>
                        <el-input v-model="form.name" suffix-icon="el-icon-menu" @focus="clearValidate('name')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="选择项目" prop="project_id" required>
                        <el-select v-model="form.project_id" placeholder="请选择" @change="getInterfacesByProjectID(form.project_id)">
                            <el-option v-for="(item, key) in project_names" :key="key" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="选择接口" prop="include" required>
                        <div class="drag-box">
                            <div class="drag-box-item">
                                <div class="item-title">待选接口</div>
                                <draggable v-model="unselected" :options="dragOptions">
                                    <transition-group tag="div" class="item-ul">
                                        <div v-for="item in unselected" class="drag-list" :key="item.id">
                                            {{ item.name }}
                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>

                            <div class="drag-box-item">
                                <div class="item-title">已选接口</div>
                                <draggable v-model="selected" :options="dragOptions" @change="changeResult()">
                                    <transition-group tag="div" class="item-ul">
                                        <div v-for="item in selected" class="drag-list" :key="item.id">
                                            {{ item.name }}
                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                        <el-button @click="resetForm('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import { add_testsuite, projects_names, interfaces_by_project_id} from '../../api/api';

    export default {
        name: 'baseform',
        data: function(){
            return {
                form: {
                    name: '',           // 套件名称
                    project_id: '',    // 项目ID
                    include: '[]',     // 接口ID列表字符串
                },
                rules: {
                    name: [
                        { required: true, message: '请输入套件名称', trigger: 'blur' }
                    ],
                    project_id: [
                        { required: true, message: '请选择所属项目', trigger: 'blur' }
                    ],
                },
                project_names: [],
                dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                unselected: [],
                selected: [],
            }
        },
        // watch: {
        //    selected: function() {
        //         var len = this.selected.length;
        //         var text = "[";
        //         for (var i = 0; i < len; i++) {
        //             console.log(this.selected[i].id);
        //             if (i == len-1) {
        //                 text += this.selected[i].id + "]";
        //             } else {
        //                 text += this.selected[i].id + ", ";
        //             }
                    
        //         }
        //         if (len == 0){
        //             text = "[]";
        //         }
        //        this.form.include = text;
        //        console.log(this.form.include)
        //    } 
        // },
        components:{
            draggable
        },
        created() {
            this.getProjectNames();
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let that = this;
                        add_testsuite(this.form)
                        .then((response)=> {
                            this.$message.success('新增套件成功！');
                            // this.$refs['form'].resetFields();   // 清空提示信息
                            // this.selected = [];
                            // this.unselected = [];
                            // 1秒钟之后, 执行刷新
                            setInterval(function () {
                                that.$router.go();
                            }, 1000);

                        })
                        .catch(error => {
                            if (typeof error === 'object' && error.hasOwnProperty('name')) {
                                this.$message.error('套件名称已存在');
                            } else {
                                // console.log(error);
                                this.$message.error('服务器错误');
                            }
                            
                        });
                                
                    } else {
                        this.$message.error('参数有误');
                        return false;
                    }
                });
            },
            clearValidate(prop_value) {
                this.$refs['form'].clearValidate(prop_value);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();   // 清空表单
            },
            getProjectNames() {
                projects_names()
                .then((response)=> {
                    this.project_names = response.data;
                })
                .catch(error => {
                    that.$message.error('服务器错误');
                });
            },
            removeHandle(event){
                console.log(event);
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },
            getInterfacesByProjectID(pro_id){
                interfaces_by_project_id(pro_id)
                .then((response)=> {
                    this.unselected = response.data;
                })
                .catch(error => {
                    that.$message.error('服务器错误');
                });
            },
            changeResult(){
                var len = this.selected.length;
                var text = "[";
                for (var i = 0; i < len; i++) {
                    if (i === len-1) {
                        text += this.selected[i].id + "]";
                    } else {
                        text += this.selected[i].id + ", ";
                    }
                    
                }
                if (len === 0){
                    text = "[]";
                }
               this.form.include = text;
            },
        }
    }
</script>

<style scoped>
    .drag-box{
        display: flex;
        user-select: none;
    }
    .drag-box-item {
        flex: 1;
        max-width: 330px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        /*height: 500px;*/
        height: 400px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>
