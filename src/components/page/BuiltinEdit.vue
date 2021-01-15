<template>
    <div class="table">
        <!-- <div>User {{ $route.params.id }}</div> -->
        <!-- <el-row>
            <el-col :span="16"
                    style="border:3px solid rgb(189, 189, 189)">
                <el-container>
                    <editor
                            style="font-size: 15px"
                            v-model="funcData"
                            @init="editorInit"
                            lang="python"
                            theme="monokai"
                            width="100%"
                            height="1000px"
                            :options="{
                                 enableSnippets:true,
                                 enableBasicAutocompletion: true,
                                 enableLiveAutocompletion: true
                             }"
                    >
                    </editor>
                </el-container>
            </el-col>
        </el-row> -->

        <el-row>
            <editor
                style="font-size: 15px"
                v-model="content"
                @init="editorInit"
                lang="python"
                theme="monokai"
                width="100%"
                height="600px"
                :options="{
                        enableSnippets:true,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true
                    }">

            </editor>
        </el-row>

        <el-row class="btn_class">
            <el-button type="primary" size="medium" style="margin-right: 10px;" @click="saveBuiltin">保存</el-button>
            <el-button type="danger" size="medium" @click="toIndexPage">回到主页</el-button>
        </el-row>

    </div>
</template>

<script>
    import { builtins_code, builtins_update } from '../../api/api';
    
    export default {
        beforeRouteEnter (to, from, next) {
            // 在路由跳转页面实例化之前被调用, 此时还没有this实例, 但是可以通过next的回调中获取实例的引用
            // console.log("before route enter")
            // console.log(to);
            next(vm => {
                vm.debugtalk_id = vm.$route.params.id;
                // console.log("id = ", vm.debugtalk_id);
                vm.getCode();
            });
            next()
        },
        beforeRouteUpdate (to, from, next) {
            // 路由在同组件之间更新之前被调用
            this.debugtalk_id = to.params.id;
            // console.log("before route update")
            // console.log(to);
            // console.log("id = ", this.debugtalk_id);
            this.getCode();
            next()
        },
        // beforeRouteLeave (to, from, next) {
        //     // 页面离开切换到其他组件之间被调用
        //     console.log("before route leave")
        //     next()
        // },
        // props: ['id'],
        components: {
            editor: require('vue2-ace-editor'),
        },
        name: 'basetable',
        data() {
            return {
                content: '',
                debugtalk_id: null
            }
        },
        methods: {
            editorInit() {
                require('brace/ext/language_tools');
                require('brace/mode/python');
                require('brace/theme/monokai');
                require('brace/snippets/python');
            },
            // 获取内置函数源码
            getCode() {
                // alert('1111')
                // builtins_code(this.$route.params.id)
                // builtins_code(this.id)
                builtins_code(this.debugtalk_id)
                .then(response => {
                    this.content = response.data.debugtalk;
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
            },
            // 更新指定的内置函数源码
            saveBuiltin() {
                // builtins_update(this.$route.params.id, this.content)
                // builtins_update(this.id, this.content)
                builtins_update(this.debugtalk_id, this.content)
                .then(response => {
                    this.$message.success('更新成功');
                    // this.$router.go(-1);
                })
                .catch(error => {
                    this.$message.error('服务器错误');
                })
            },
            // 返回主页
            toIndexPage() {
                this.$router.push({name: 'index'})
            }
        },
        // mounted() {
        //     this.getCode();
        // },
        // created() {
        //     this.getCode();
        // },
    }
</script>

<style scoped>
    .btn_class{
        margin-top: 10px;
    }

</style>
