<template>
    <div class="login-wrap">
        <img src="../../assets/img/logo.png" alt="logo">
        <div class="ms-login">
            <div class="ms-title">用户登录</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名" @focus="clearValidate('username')">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" 
                    @keyup.enter.native="submitForm('ruleForm')" @focus="clearValidate('password')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item prop="remember_me">
                    <el-input type="checkbox" v-model="ruleForm.remember_me">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="remember_me">
                    <el-radio-group v-model="ruleForm.remember_me">
                        <el-radio label="记住我"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item prop="remember_me" label="选择开关">
                    <el-switch v-model="ruleForm.remember_me"></el-switch>
                </el-form-item> -->

                <el-form-item label="记住我" class="remember_me" size="mini">
                    <el-switch v-model="ruleForm.remember_me"></el-switch>
                    <el-link type="info" :underline="false" class="register_link" href="/register">没有账号？点击注册</el-link>
                </el-form-item>

                <!-- <el-link :underline="false">没有账号？点击注册</el-link> -->

                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips" v-show="err_info">{{ err_msg }}</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    // import cookie from '../../static/js/cookie';
    import { login } from '../../api/api'

    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    remember_me: false,
                },
                err_info: false,    // 是否显示错误提示
                err_msg: '',         // 具体错误提示
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                // alert(1111);
                this.$refs[formName].validate((valid) => {
                    // alert("valid: " + valid);
                    if (valid) {
                        // localStorage.setItem('ms_username',this.ruleForm.username);
                        // this.$router.push('/');
                        var that = this;
                        login(this.ruleForm)
                        .then((response)=> {
                            // console.log(response);
                            //本地存储用户信息
                            // cookie.setCookie('username', response.data.username, 1);
                            // cookie.setCookie('user_id', response.data.user_id, 1);
                            // cookie.setCookie('token', response.data.token, 1);

                            // 使用浏览器本地存储保存token
                            if (that.remember_me) {
                                // 记住登录
                                sessionStorage.clear();
                                localStorage.token = response.data.token;
                                localStorage.user_id = response.data.user_id;
                                localStorage.username = response.data.username;
                            } else {
                                // 未记住登录
                                localStorage.clear();
                                sessionStorage.token = response.data.token;
                                sessionStorage.user_id = response.data.user_id;
                                sessionStorage.username = response.data.username;
                            }

                            //存储在store
                            // 更新store数据
                            // that.$store.dispatch('setInfo');
                            //跳转到首页页面
                            // console.log(that.$router)
                            // alert(1111);
                            // that.$router.push({ name: 'index'})
                            that.$router.push({ name: 'dashboard'})
                        })
                            .catch(error => {
                                // console.log(error)
                                if("non_field_errors" in error && error.status_code == 400) {
                                    // that.err_msg = error.non_field_errors[0];
                                    that.err_msg = '用户名或密码错误';
                                }

                                if (error.response) {
                                    that.err_msg = '服务器异常';
                                } else if (error.request){
                                    // that.err_msg = error.message;
                                    that.err_msg = "网络异常";

                                }

                                // if("username" in error){
                                //     that.err_msg = error.username[0];
                                // }
                                // if("password" in error){
                                //     that.err_msg = error.password[0];
                                // }
                                // console.log(error)

                                // if (error.response && error.response.status == 400) {
                                //     that.err_msg = '用户名或密码错误';
                                // } else if (error.response) {
                                //     that.err_msg = '服务器错误';
                                // } else if (error.request){
                                //     that.err_msg = error.message;
                                // }

                                that.err_info = true;
                            });
                                
                    } else {
                        // console.log('error submit!!');
                        this.err_msg = '参数有误';
                        this.err_info = true;
                        return false;
                    }
                });
            },
            clearValidate(prop_value) {
                this.$refs['ruleForm'].clearValidate(prop_value);
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/bg1.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:25px;
        /* color: rgb(43, 155, 33); */
        color: #E4E7ED;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#F56C6C;
    }
    .register_link{
        padding-left: 70px;
        /* color: #E4E7ED; */
    }
    .remember_me >>> .el-form-item__label {
        /* color: #409EFF; */
        color: #E4E7ED;
    }
</style>