<template>
    <div>
        <el-row :gutter="50">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ user.username }}</div>
                            <div>{{ user.role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">用户创建时间：<span>{{ user.date_joined }}</span></div>
                    <div class="user-info-list">上次登录时间：<span>{{ user.last_login }}</span></div>
                </el-card>
                <el-card shadow="hover" style="height:180px;">
                    <div slot="header" class="clearfix">
                        <span>用例执行比率</span>
                    </div>
                    <span>成功率</span>
                    <el-progress :text-inside="true" :stroke-width="24" :percentage="statistics.success_rate" status="success">
                    </el-progress>
                    <span>失败率</span>
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="statistics.fail_rate" status="exception">
                    </el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="60" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-s-claim grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'projects_list' }"
                                            class="grid-num">
                                        {{ statistics.projects_count }}
                                    </router-link>
                                    <div>项目总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-tag grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'interfaces_list' }"
                                            class="grid-num">
                                        {{ statistics.interfaces_count }}
                                    </router-link>
                                    <div>接口总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-row :gutter="60" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-hot grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'testcases_list' }"
                                            class="grid-num">
                                        {{ statistics.testcases_count }}
                                    </router-link>
                                    <div>用例总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-4">
                                <i class="el-icon-files grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'testsuites_list' }"
                                            class="grid-num">
                                        {{ statistics.testsuits_count }}
                                    </router-link>
                                    <div>套件总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-row :gutter="60" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-apps grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'configures_list' }"
                                            class="grid-num">
                                        {{ statistics.configures_count }}
                                    </router-link>
                                    <div>配置总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-s-open grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'envs_list' }"
                                            class="grid-num">
                                        {{ statistics.envs_count }}
                                    </router-link>
                                    <div>环境变量总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-row :gutter="60" class="mgb20">
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-tools grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'builtin_list' }"
                                            class="grid-num">
                                        {{ statistics.debug_talks_count }}
                                    </router-link>
                                    <div>内置函数总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-4">
                                <i class="el-icon-s-marketing grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <router-link
                                            :to="{ name: 'reports_list' }"
                                            class="grid-num">
                                        {{ statistics.reports_count }}
                                    </router-link>
                                    <div>测试报告总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { summary } from '../../api/api';

    export default {
        beforeRouteEnter (to, from, next) {
            // 在路由跳转页面实例化之前被调用, 此时还没有this实例, 但是可以通过next的回调中获取实例的引用
            next(vm => {
                vm.getData();
            });
            next()
        },
        name: 'dashboard',
        data() {
            return {
                user: Object,
                statistics: Object,

            }
        },
        created(){
            this.getData();
        },
        methods: {
            getData() {
                summary()
                    .then(response => {
                        this.user = response.data.user;
                        this.statistics = response.data.statistics;
                    })
                    .catch(error => {
                        this.$message.error('服务器错误');
                    })
            }
        }
    }

</script>


<style scoped>
    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(100, 213, 114);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 106, 33);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 106, 33);
    }

    .grid-con-4 .grid-con-icon {
        background: rgb(242, 174, 202);
    }

    .grid-con-4 .grid-num {
        color: rgb(242, 174, 202);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }


</style>
