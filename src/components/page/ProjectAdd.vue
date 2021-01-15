<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 项目管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <el-form-item label="项目名称" prop="name" required>
                        <el-input v-model="form.name" suffix-icon="el-icon-menu" @focus="clearValidate('name')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="负责人" prop="leader" required>
                        <el-input v-model="form.leader" suffix-icon="el-icon-s-custom" @focus="clearValidate('leader')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="测试人员" prop="tester" required>
                        <el-input v-model="form.tester" suffix-icon="el-icon-user-solid" @focus="clearValidate('tester')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="开发人员" prop="programmer" required>
                        <el-input v-model="form.programmer" suffix-icon="el-icon-user-solid" @focus="clearValidate('programmer')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="发布应用" prop="publish_app" required>
                        <el-input v-model="form.publish_app" suffix-icon="el-icon-s-promotion" @focus="clearValidate('publish_app')" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="简要描述" prop="desc">
                        <el-input type="textarea" rows="4" v-model="form.desc" clearable></el-input>
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
    import { add_project, projects_names } from '../../api/api';

    export default {
        name: 'baseform',
        data: function(){
            var validateName = (rule, value, callback) => {
                var len = value.length;
                if(len <= 0){
                    callback(new Error('请输入项目名称'));
                } else {
                    for (let index = 0; index < this.project_names.length; index++) {
                        var element = this.project_names[index];
                        if (element.name === value) {
                            // alert(element.name);
                            callback(new Error('项目名称已存在'));
                            break
                        }
                    }
                    callback();
                }
            };
            return {
                form: {
                    name: '',           // 项目名称
                    leader: '',         // 项目负责人
                    tester: '',         // 项目测试人员
                    programmer: '',     // 开发人员
                    publish_app: '',    // 发布应用
                    desc: '',     // 简要描述
                },
                rules: {
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    leader: [
                        { required: true, message: '请输入项目负责人', trigger: 'blur' }
                    ],
                    tester: [
                        { required: true, message: '请输入测试人员', trigger: 'blur' }
                    ],
                    programmer: [
                        { required: true, message: '请输入开发人员', trigger: 'blur' }
                    ],
                    publish_app: [
                        { required: true, message: '请输入发布应用', trigger: 'blur' }
                    ],
                },
                project_names: []
            }
        },
        created() {
            this.getProjectNames();
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let that = this;
                        add_project(this.form)
                        .then((response)=> {
                            this.$message.success('新增项目成功！');
                            // 1秒钟之后, 执行刷新
                            setInterval(function () {
                                that.$router.go();
                            }, 1000);
                            // this.$refs['form'].resetFields();   // 清空提示信息
                        })
                        .catch(error => {
                            console.log(error);
                            this.$message.error('服务器错误');
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
            }
        }
    }
</script>