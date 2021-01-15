<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 配置管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs type="border-card">

                <el-tab-pane label="请求信息">

                    <el-tabs style="margin: 0 0 0 10px" v-model="bodyShow">
                        <el-tab-pane label="Headers" name="first">
                            <el-table :data="apiMsgData.header" size="mini" stripe :show-header="false"
                                      class="h-b-e-a-style"
                                      :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value" size="mini" placeholder="value">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="delTableRow('header',scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="Body" name="second" :disabled="apiMsgData.method === 'GET'">
                            <el-form :inline="true" class="demo-form-inline" style="margin-top: 10px">
                                <el-radio-group v-model="apiMsgData.choiceType">
                                    <el-radio label="data">form-data</el-radio>
                                    <el-radio label="json">json</el-radio>
                                    <!--<el-radio label="text">text</el-radio>-->
                                </el-radio-group>
                                <el-button type="primary" size="mini"
                                           v-show="apiMsgData.choiceType === 'json'"
                                           style="margin-left:20px"
                                           @click="formatData()">格式化

                                </el-button>
                            </el-form>
                            <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);"/>

                            <div v-if="apiMsgData.choiceType === 'json'">
                                <div style="border:1px solid rgb(234, 234, 234) ">
                                    <el-container>
                                        <editor
                                                v-contextmenu:contextmenu
                                                style="font-size: 15px"
                                                v-model="apiMsgData.jsonVariable"
                                                @init="editorInit"
                                                lang="json"
                                                theme="chrome"
                                                width="100%"
                                                height="575px"
                                                :options="{}"
                                        >
                                        </editor>
                                    </el-container>

                                </div>
                            </div>
                            <el-table :data="apiMsgData.variable"
                                      size="mini"
                                      stripe
                                      :show-header="false" height="500"
                                      style="background-color: rgb(250, 250, 250)"
                                      v-if="apiMsgData.choiceType === 'data'"
                                      :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                                <el-table-column label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="type" header-align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.param_type" size="mini">
                                            <el-option v-for="item in paramTypes" :key="item" :value="item">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-input v-model="scope.row.value"
                                                      :id="'data_input' + scope.$index "
                                                      type="textarea"
                                                      rows=1
                                                      @focus="showLine('data_input', scope.$index)"
                                                      @input="changeLine()"
                                                      @blur="resetLine()"
                                                      size="mini"
                                                      resize="none" placeholder="value">
                                            </el-input>
                                        </div>

                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="delTableRow('variable',scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="Params" name="third">
                            <el-table :data="apiMsgData.param" size="mini" stripe :show-header="false"
                                      class="h-b-e-a-style"
                                      :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value" size="mini" placeholder="value">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="delTableRow('extract',scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                    <!--</div>-->
                </el-tab-pane>

                <el-tab-pane label="环境变量|参数化|请求钩子">

                    <el-tabs style="margin: 0 0 0 10px" v-model="otherShow">
                        <el-tab-pane label="环境变量" name="first">
                            <el-table :data="apiMsgData.globalVar" size="mini" stripe :show-header="false"
                                      class="h-b-e-a-style"
                                      :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column label="type" header-align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.param_type" size="mini">
                                            <el-option v-for="item in paramTypes" :key="item" :value="item">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value" size="mini" placeholder="value">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="delTableRow('globalVar',scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="参数化" name="second">
                            <el-table :data="apiMsgData.parameterized" size="mini" stripe :show-header="false"
                                      class="h-b-e-a-style"
                                      :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key 或者 key1-key2-key3">
                                        </el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.value" size="mini"
                                                  placeholder='["value1", "value2] 或者 [["v1", "v2", "v3"],["v11","v22", "v33"]]'>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="delTableRow('parameterized',scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="setup_hooks" name="third">
                            <el-table :data="apiMsgData.setupHooks" size="mini" stripe :show-header="false"
                                      class="h-b-e-a-style"
                                      :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="delTableRow('setupHooks',scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="teardown_hooks" name="fourth">
                            <el-table :data="apiMsgData.teardownHooks" size="mini" stripe :show-header="false"
                                      class="h-b-e-a-style"
                                      :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                                <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column property="value" label="操作" header-align="center" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="delTableRow('teardownHooks',scope.$index)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                </el-tab-pane>
            </el-tabs>

            <el-row>
                <el-col :span="2">
                    <el-button type="primary" @click="onSubmit()">提交</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="resetForm('form')">取消</el-button>
                </el-col>
            </el-row>
        </div>

        <v-contextmenu ref="contextmenu">
            <v-contextmenu-item @click="handleClick">clear</v-contextmenu-item>
        </v-contextmenu>

        <!-- 编辑弹出框 -->
        <el-dialog title="创建配置" :visible.sync="editVisible" width="28%" center>
            <el-form label-width="120px">
                <el-form-item label="配置名称" required>
                    <el-input v-model="configure_name" clearable></el-input>
                </el-form-item>

                <el-form-item label="编写人员" required>
                    <el-input v-model="author" clearable></el-input>
                </el-form-item>

                <el-form-item label="选择项目" required>
                    <el-select v-model="selected_project_id" placeholder="请选择"
                               @change="getInterfacesByProjectID(selected_project_id)">
                        <el-option v-for="(item, key) in project_names" :key="key"
                                   :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择接口" required>
                    <el-select v-model="selected_interface_id" placeholder="请选择">
                        <el-option v-for="(item, key) in interfaces" :key="key" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        projects_names,
        interfaces_by_project_id,
        configures_by_interface_id,
        add_configure
    } from '../../api/api';

    export default {
        name: 'baseform',
        data: function () {
            return {
                editVisible: false,   // 新增配置弹框是否显示标识
                types: ['data', 'json', 'params'],  // 请求类型
                apiMsgData: {
                    id: null,
                    name: "",
                    choiceType: 'data',
                    param: [{key: null, value: null}],
                    header: [{key: null, value: null}],
                    variable: [{key: null, value: null, param_type: 'string'}],
                    jsonVariable: '',

                    globalVar: [{key: null, value: null, param_type: 'string'}],
                    parameterized: [{key: null, value: null}],
                    setupHooks: [{key: null}],
                    teardownHooks: [{key: null}],
                },
                bodyShow: 'second',
                otherShow: 'first',
                paramTypes: ['string', 'int', 'float', 'boolean'],
                cell: Object(),
                project_names: [],
                selected_project_id: null,
                selected_interface_id: null,
                selected_configure_id: null,
                configure_name: null,  // 配置名称
                author: '',     // 用例编写人员
                interfaces: [],
                configures: [],
            }
        },
        created() {
            this.getProjectNames();
        },
        components: {
            editor: require('vue2-ace-editor'),
        },
        methods: {
            editorInit() {
                require('brace/ext/language_tools');
                require('brace/mode/json');
                require('brace/theme/chrome');
                require('brace/snippets/json')
            },
            onSubmit() {
                this.selected_project_id = null;
                this.selected_interface_id = null;
                this.editVisible = true;
            },
            // 处理数据1, 有param_type
            handleData1(request_data, msg){
                let data_arr = [];
                for(let i = 0; i < request_data.length; i++) {
                    let key = request_data[i].key;
                    if (! key) {
                        this.$message.error(msg + '的key为空!');
                        return []
                    }
                    let param_type = request_data[i].param_type;
                    let value = request_data[i].value;
                    if (param_type === 'int') {
                        if (/^\d+$/.test(value)) {
                            value = Number(value);
                        } else {
                            this.$message.error(msg + '不是整数int类型!');
                            return []
                        }
                    } else if (param_type === 'float') {
                        if (/^[+-]?\d+(\.\d+)?$/.test(value)) {
                            value = Number(value);
                        } else {
                            this.$message.error(msg + '不是小数float类型!');
                            return []
                        }
                    } else if (param_type === 'boolean') {
                        if (/^(true|True|TRUE|1|0)$/.test(value)) {
                            value = true;
                        } else if (/^(false|False|FALSE|0)$/.test(value)) {
                            value = false;
                        } else {
                            this.$message.error(msg + '不是布尔boolean类型!');
                            return []
                        }
                    }
                    let one_data = {};
                    one_data[key] = value;
                    data_arr.push(one_data)
                }

                return data_arr
            },

            // 处理数据2, 无param_type
            handleData2(request_data, msg){
                let data_arr = [];
                for(let i = 0; i < request_data.length; i++) {
                    let key = request_data[i].key;
                    if (! key) {
                        this.$message.error(msg + '的key为空!');
                        return []
                    }
                    let value = request_data[i].value;
                    let one_data = {};
                    one_data[key] = value;
                    data_arr.push(one_data)
                }
                return data_arr
            },

            // 处理数据3, 无value
            handleData3(request_data, msg){
                let data_arr = [];
                for(let i = 0; i < request_data.length; i++) {
                    let key = request_data[i].key;
                    if (! key) {
                        this.$message.error(msg + '的key为空!');
                        return []
                    }
                    data_arr.push(key)
                }
                return data_arr
            },

            // 保存编辑
            saveEdit() {
                if (this.configure_name === null){
                    this.$message.error('配置名称不能为空!');
                    return
                }

                if (this.author === ''){
                    this.$message.error('编写人员名称不能为空!');
                    return
                }

                if (this.selected_project_id === null || this.selected_interface_id === null){
                    this.$message.error('未选择所属项目或者接口!');
                    return
                }

                let datas = {
                    "name": this.configure_name,           // 配置名称
                    "interface": {
                        "pid": this.selected_project_id,      // 项目ID
                        "iid": this.selected_interface_id,      // 接口ID
                    },
                    "author": this.author,         // 配置编写人员
                    "request": {          // 请求信息
                        "config": {
                            "name": this.configure_name,
                            "request": {
                            }
                        }
                    },
                };

                let paramsType = '';
                let request_data = null;
                if (this.apiMsgData.choiceType === 'json'){
                    paramsType = 'json';
                    request_data = this.apiMsgData.jsonVariable;
                    if (request_data.length !== 0) {
                        datas.request.config.request['json'] = request_data
                    }
                }else if(this.apiMsgData.choiceType === 'params'){
                    paramsType = 'params';
                    request_data = this.apiMsgData.param;
                    request_data.splice(-1, 1);
                    if (request_data.length !== 0) {
                        let new_data = this.handleData2(request_data, 'param参数');
                        if (new_data.length === 0) {
                            return
                        }
                        datas.request.config.request['params'] = new_data
                    }
                }else {
                    paramsType = 'data';
                    request_data = this.apiMsgData.variable;
                    request_data.splice(-1, 1);
                    if (request_data.length !== 0) {
                        let new_data = this.handleData1(request_data, 'form-data参数');
                        if (new_data.length === 0) {
                            return
                        }
                        datas.request.config.request['data'] = new_data
                    }
                }

                // 参数化
                let parameterized = this.apiMsgData.parameterized;
                parameterized.splice(-1, 1);
                if (parameterized.length !== 0) {
                    let new_data = this.handleData2(parameterized, '参数化参数');
                    if (new_data.length === 0) {
                        return
                    }
                    datas.request.config['parameters'] = new_data;
                }

                // variables处理
                let variables = this.apiMsgData.globalVar;
                variables.splice(-1, 1);
                if (variables.length !== 0) {
                    let new_data = this.handleData1(variables, '全局变量variables');
                    if (new_data.length === 0) {
                        return
                    }
                    datas.request.config['variables'] = new_data;
                }

                // headers处理
                let headers = this.apiMsgData.header;
                headers.splice(-1, 1);
                if (headers.length !== 0) {
                    let new_data = this.handleData2(headers, '请求头header');
                    if (new_data.length === 0) {
                        return
                    }
                    datas.request.config.request['headers'] = new_data;
                }

                // setup_hooks处理
                let setup_hooks = this.apiMsgData.setupHooks;
                setup_hooks.splice(-1, 1);
                if (setup_hooks.length !== 0) {
                    let new_data = this.handleData3(setup_hooks, '请求钩子setup_hooks');
                    if (new_data.length === 0) {
                        return
                    }
                    datas.request.config['setup_hooks'] = new_data;
                }

                // teardown_hooks处理
                let teardown_hooks = this.apiMsgData.teardownHooks;
                teardown_hooks.splice(-1, 1);
                if (teardown_hooks.length !== 0) {
                    let new_data = this.handleData3(teardown_hooks, '请求钩子teardown_hooks');
                    if (new_data.length === 0) {
                        return
                    }
                    datas.request.config['teardown_hooks'] = new_data;
                }


                datas.include = JSON.stringify(datas.include);
                datas.request = JSON.stringify(datas.request);
                add_configure(datas)
                    .then(response => {
                        this.editVisible = false;
                        let _this = this;
                        this.$message.success(`新增【 ${this.apiMsgData.name} 】成功`);
                        // 1秒钟之后, 执行刷新
                        setInterval(function () {
                            _this.$router.go();
                        }, 1000);
                    })
                    .catch(error => {
                        this.editVisible = false;
                        if (typeof error === 'object' && error.hasOwnProperty('name')) {
                            console.log(error);
                            this.$message.error('配置名称已存在');
                        } else {
                            console.log(error);
                            this.$message.error('服务器错误');
                        }
                    })

            },
            getProjectNames() {
                projects_names()
                    .then((response) => {
                        this.project_names = response.data;
                    })
                    .catch(error => {
                        that.$message.error('服务器错误');
                    });
            },
            getInterfacesByProjectID(pro_id) {
                interfaces_by_project_id(pro_id)
                    .then((response) => {
                        this.interfaces = response.data;
                    })
                    .catch(error => {
                        that.$message.error('服务器错误');
                    });
            },
            getConfTestcaseByInterfaceID(interface_id) {
                configures_by_interface_id(interface_id)
                    .then((response) => {
                        this.configures = response.data;
                    })
                    .catch(error => {
                        that.$message.error('服务器错误');
                    });

            },
            changeResult() {
                let len = this.selected.length;
                let text = "[";
                for (let i = 0; i < len; i++) {
                    if (i === len - 1) {
                        text += this.selected[i].id + "]";
                    } else {
                        text += this.selected[i].id + ", ";
                    }

                }
                if (len === 0) {
                    text = "[]";
                }
                this.selected_testcase_id = eval(text);
            },
            delTableRow(type, i) {
                if (type === 'variable') {
                    this.apiMsgData.variable.splice(i, 1);
                } else if (type === 'header') {
                    this.apiMsgData.header.splice(i, 1);
                } else if (type === 'param') {
                    this.apiMsgData.param.splice(i, 1);
                }else if (type === 'globalVar') {
                    this.apiMsgData.globalVar.splice(i, 1);
                }else if (type === 'parameterized') {
                    this.apiMsgData.parameterized.splice(i, 1);
                }else if (type === 'setupHooks') {
                    this.apiMsgData.setupHooks.splice(i, 1);
                }else if (type === 'teardownHooks') {
                    this.apiMsgData.teardownHooks.splice(i, 1);
                }
            },
            addTableRow(type) {
                if (type === 'variable') {
                    this.apiMsgData.variable.push({key: null, value: null, param_type: 'string'});
                } else if (type === 'header') {
                    this.apiMsgData.header.push({key: null, value: null});
                } else if (type === 'param') {
                    this.apiMsgData.param.push({key: null, value: null});
                } else if (type === 'globalVar') {
                    this.apiMsgData.globalVar.push({key: null, value: null, param_type: 'string'});
                } else if (type === 'parameterized') {
                    this.apiMsgData.parameterized.push({key: null, value: null});
                } else if (type === 'setupHooks') {
                    this.apiMsgData.setupHooks.push({key: null});
                } else if (type === 'teardownHooks') {
                    this.apiMsgData.teardownHooks.push({key: null});
                }
            },
            formatData() {
                // 格式化json字符串
                try {
                    this.apiMsgData.jsonVariable = JSON.parse(this.apiMsgData.jsonVariable);
                    this.apiMsgData.jsonVariable = JSON.stringify(this.apiMsgData.jsonVariable, null, 4);
                } catch (err) {
                    this.$message({
                        showClose: true,
                        message: 'json格式错误',
                        type: 'warning',
                    });
                }
            },
            tempNum(i) {
                this.temp_num = i;
            },
            resetLine() {
                //  重置单元格高度
                this.cell.style.height = '18px';
            },
            showLine(prefix, n) {
                //  获取单元格的滚动条高度，并使单元格为该高度
                this.cell = document.getElementById(prefix + n);
                this.cell.style.height = this.cell.scrollHeight + 'px';
            },
            changeLine() {
                //  当单元格高度和滚动条高度不一致时，改变单元格高度
                if (this.cell.style.height !== this.cell.scrollHeight + 'px') {
                    let i = parseInt(this.cell.style.height.substring(0, this.cell.style.height.length - 2));
                    if (i - this.cell.scrollHeight === 2) {
                        //  为true时，为减少高度操作
                        this.cell.style.height = (i - 18) + 'px'
                    }
                    else {
                        this.cell.style.height = this.cell.scrollHeight + 'px';
                    }

                }
            },
            handleClick() {
                this.apiMsgData.jsonVariable = ''
            },
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
        },
        computed: {
            monitorParam() {
                return this.apiMsgData.param;
            },
            monitorVariable() {
                return this.apiMsgData.variable;
            },
            monitorHeader() {
                return this.apiMsgData.header;
            },

            monitorGlobalVar() {
                return this.apiMsgData.globalVar;
            },
            monitorParameterized() {
                return this.apiMsgData.parameterized;
            },
            monitorSetupHooks() {
                return this.apiMsgData.setupHooks;
            },
            monitorTeardownHooks() {
                return this.apiMsgData.teardownHooks;
            },

        },
        watch: {
            monitorVariable: {
                handler: function () {
                    if (this.apiMsgData.variable.length === 0) {
                        this.addTableRow('variable')
                    }
                    if (this.apiMsgData.variable[this.apiMsgData.variable.length - 1]['key'] || this.apiMsgData.variable[this.apiMsgData.variable.length - 1]['value']) {
                        this.addTableRow('variable')
                    }
                }
                ,
                deep: true
            },
            monitorParam: {
                handler: function () {
                    if (this.apiMsgData.param.length === 0) {
                        this.addTableRow('param')
                    }
                    if (this.apiMsgData.param[this.apiMsgData.param.length - 1]['key'] || this.apiMsgData.param[this.apiMsgData.param.length - 1]['value']) {
                        this.addTableRow('param')
                    }
                }
                ,
                deep: true
            },
            monitorHeader: {
                handler: function () {
                    if (this.apiMsgData.header.length === 0) {
                        this.addTableRow('header')
                    }
                    if (this.apiMsgData.header[this.apiMsgData.header.length - 1]['key'] || this.apiMsgData.header[this.apiMsgData.header.length - 1]['value']) {
                        this.addTableRow('header')
                    }
                }
                ,
                deep: true
            },
            monitorGlobalVar: {
                handler: function () {
                    if (this.apiMsgData.globalVar.length === 0) {
                        this.addTableRow('globalVar')
                    }
                    if (this.apiMsgData.globalVar[this.apiMsgData.globalVar.length - 1]['key'] ||
                        this.apiMsgData.globalVar[this.apiMsgData.globalVar.length - 1]['value']) {
                        this.addTableRow('globalVar')
                    }
                },
                deep: true
            },
            monitorParameterized: {
                handler: function () {
                    if (this.apiMsgData.parameterized.length === 0) {
                        this.addTableRow('parameterized')
                    }
                    if (this.apiMsgData.parameterized[this.apiMsgData.parameterized.length - 1]['key'] ||
                        this.apiMsgData.parameterized[this.apiMsgData.parameterized.length - 1]['value']) {
                        this.addTableRow('parameterized')
                    }
                },
                deep: true
            },
            monitorSetupHooks: {
                handler: function () {
                    if (this.apiMsgData.setupHooks.length === 0) {
                        this.addTableRow('setupHooks')
                    }
                    if (this.apiMsgData.setupHooks[this.apiMsgData.setupHooks.length - 1]['key']) {
                        this.addTableRow('setupHooks')
                    }
                }
                ,
                deep: true
            },
            monitorTeardownHooks: {
                handler: function () {
                    if (this.apiMsgData.teardownHooks.length === 0) {
                        this.addTableRow('teardownHooks')
                    }
                    if (this.apiMsgData.teardownHooks[this.apiMsgData.teardownHooks.length - 1]['key']) {
                        this.addTableRow('teardownHooks')
                    }
                }
                ,
                deep: true
            },

        },
    }
</script>

<style scoped>
    .drag-box {
        display: flex;
        user-select: none;
    }

    .drag-box-item {
        flex: 1;
        /* height: 300px; */
        max-width: 330px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .item-title {
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }

    .item-ul {
        padding: 0 8px 8px;
        height: 300px;
        overflow-y: scroll;
    }

    .item-ul::-webkit-scrollbar {
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

    .ghost-style {
        display: block;
        color: transparent;
        border-style: dashed
    }

    .el-row {
        margin-bottom: 20px;
        margin-top: 20px
    }

    .el-col {
        border-radius: 4px;
    }

    .h-b-e-a-style {
        background-color: rgb(250, 250, 250);
        /*min-height: 430px;*/
    }
</style>
