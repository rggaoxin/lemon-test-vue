<template>
    <div class="reportShow">
        <h1>Test Report: {{html_report_name}}</h1>

        <h2>Summary</h2>
        <table id="summary">

            <tr>
                <th>START AT</th>
                <td colspan="4">{{time.start_datetime}}</td>
            </tr>
            <tr>
                <th>DURATION</th>
                <td colspan="4">{{ time.duration }} seconds</td>
            </tr>
            <tr>
                <th>PLATFORM</th>
                <td>HttpRunner {{ platform.httprunner_version }} </td>
                <td>{{ platform.python_version }} </td>
                <td colspan="2">{{ platform.platform }}</td>
            </tr>
            <tr>
                <th>TOTAL</th>
                <th>SUCCESS</th>
                <th>FAILED</th>
                <th>ERROR</th>
                <th>SKIPPED</th>
                <!-- <th>ExpectedFailure</th>
                <th>UnexpectedSuccess</th> -->
            </tr>
            <tr>
                <td>{{stat.testsRun}}</td>
                <td>{{stat.successes}}</td>
                <td>{{stat.failures}}</td>
                <td>{{stat.errors}}</td>
                <td>{{stat.skipped}}</td>
                <!-- <td>{{stat.expectedFailures}}</td>
                <td>{{stat.unexpectedSuccesses}}</td> -->
            </tr>
        </table>

        <h2>Details</h2>

        <template v-for="(test_suite_summary, suite_index) in details">
            <h3>{{test_suite_summary.name}}</h3>
            <table :id="'suite_' + suite_index" class="details">
                <tr>
                    <th>base_url</th>
                    <td colspan="2">{{test_suite_summary.base_url}}</td>
                    <td colspan="2" class="detail">
                        <a class="button" :href="'#suite_output_' + suite_index">parameters & output</a>
                        <div :id="'suite_output_' + suite_index" class="overlay">
                            <div class="popup">
                                <h2>Parameters and Output</h2>
                                <a class="close" :href="'#suite_' + suite_index">&times;</a>
                                <div class="content">
                                    <div style="overflow: auto">
                                        <table>
                                            <tr>
                                                <th>variables</th>
                                                <th>output</th>
                                            </tr>

                                            <tr v-for="(in_out, key) in test_suite_summary.output">
                                                <td>{{in_out.in}}</td>
                                                <td>{{in_out.out}}</td>
                                            </tr>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>TOTAL: {{test_suite_summary.stat.testsRun}}</td>
                    <td>SUCCESS: {{test_suite_summary.stat.successes}}</td>
                    <td>FAILED: {{test_suite_summary.stat.failures}}</td>
                    <td>ERROR: {{test_suite_summary.stat.errors}}</td>
                    <td>SKIPPED: {{test_suite_summary.stat.skipped}}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <th colspan="2">Name</th>
                    <th>Response Time</th>
                    <th>Detail</th>
                </tr>

                <tr v-for="(record, key) in test_suite_summary.records" :id="'record_' + suite_index + '_' + key">
                    <th :class="record.status" style="width:5em;">{{record.status}}</th>
                    <td colspan="2">{{record.name}}</td>
                    <td style="text-align:center;width:6em;">{{ record.meta_data.response.response_time_ms }} ms</td>
                    <td class="detail">
                        <a class="button" :href="'#popup_log_' + suite_index + '_' + key">log</a>
                        <div :id="'popup_log_' + suite_index + '_' + key" class="overlay">
                            <div class="popup">
                                <h2>Request and Response data</h2>
                                <a class="close" :href="'#record_' + suite_index + '_' + key">&times;</a>

                                <div class="content">
                                    <h3>Request:</h3>
                                    <div style="overflow: auto">
                                        <table>

                                            <template v-for="(value, key) in record.meta_data.request">
                                                <tr>
                                                    <th>{{key}}</th>
                                                    <td>
                                                        <template v-if="key === 'headers'">
                                                            <div v-for="(header_value, header_key) in record.meta_data.request.headers">
                                                                <strong>{{ header_key }}</strong>: {{ header_value }}
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            {{value}}
                                                        </template>
                                                    </td>
                                                </tr>
                                            </template>
                                        </table>
                                    </div>

                                    <h3>Response:</h3>
                                    <div style="overflow: auto">
                                        <table>
                                            <template v-for="(value, key) in record.meta_data.response">
                                                <tr>
                                                    <th>{{key}}</th>
                                                    <td>
                                                        <template v-if="key === 'headers'">
                                                            <template v-for="(header_value, header_key) in record.meta_data.request.headers">
                                                                <div>
                                                                    <strong>{{ header_key }}</strong>: {{ header_value }}
                                                                </div>
                                                            </template>
                                                        </template>
                                                        <template v-else-if="key === 'content_type'">
                                                            <template v-if="value === 'image'">
                                                                <img :src="record.meta_data.response.body" />
                                                            </template>
                                                            <template v-else>
                                                                <pre>{{ record.meta_data.response.body }}</pre>
                                                            </template>
                                                        </template>
                                                        <template v-else>
                                                            {{value}}
                                                        </template>
                                                    </td>
                                                </tr>
                                            </template>
                                        </table>
                                    </div>

                                    <h3>Validators:</h3>
                                    <div style="overflow: auto">
                                        <table>
                                            <tr>
                                                <th>check</th>
                                                <th>comparator</th>
                                                <th>expect value</th>
                                                <th>actual value</th>
                                            </tr>
                                            <tr v-for="validator in record.meta_data.validators">
                                                <td v-if="validator.check_result === 'pass'"
                                                    class="passed">{{validator.check}}</td>
                                                <td v-else-if="validator.check_result === 'fail'"
                                                    class="failed">{{validator.check}}</td>
                                                <td v-else-if="validator.check_result === 'unchecked'"
                                                    class="unchecked">{{validator.check}}</td>

                                                <td>{{ validator.comparator }}</td>
                                                <td>{{ validator.expect }}</td>
                                                <td>{{ validator.check_value }}</td>

                                            </tr>
                                        </table>
                                    </div>

                                    <h3>Statistics:</h3>
                                    <div style="overflow: auto">
                                        <table>
                                            <tr>
                                                <th>content_size(bytes)</th>
                                                <td>{{ record.meta_data.response.content_size }}</td>
                                            </tr>
                                            <tr>
                                                <th>response_time(ms)</th>
                                                <td>{{ record.meta_data.response.response_time_ms }}</td>
                                            </tr>
                                            <tr>
                                                <th>elapsed(ms)</th>
                                                <td>{{ record.meta_data.response.elapsed_ms }}</td>
                                            </tr>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <template v-if="record.attachment">
                            <a class="button" :href="'#popup_attachment_' + suite_index + '_' + key">traceback</a>
                            <div :id="'popup_attachment_' + suite_index + '_' + key" class="overlay">
                                <div class="popup">
                                    <h2>Traceback Message</h2>
                                    <a class="close" :href="'#record_' + + suite_index + '_' + key">&times;</a>
                                    <div class="content"><pre>{{ record.attachment }}</pre></div>
                                </div>
                            </div>
                        </template>


                    </td>
                </tr>
            </table>
        </template>

    </div>
</template>

<script>
    import { report_view } from '../../api/api';
    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.report_id = vm.$route.params.id;
                vm.getData();
            });
            next()
        },
        beforeRouteUpdate (to, from, next) {
            this.report_id = to.params.id;
            this.getData();
            next()
        },
        name: 'reportShow',
        data() {
            return {
                report_id: null,
                html_report_name: '',
                time: Object,
                stat: Object,
                platform: Object,
                details: Array,
            }
        },
        methods: {
            getData() {
                report_view(this.report_id)
                    .then(response => {
                        this.html_report_name = response.data.summary.html_report_name;
                        this.time = response.data.summary.time;
                        this.stat = response.data.summary.stat;
                        this.platform = response.data.summary.platform;
                        this.details = response.data.summary.details;
                    })
                    .catch(error => {
                        if (typeof error === 'object' && error.hasOwnProperty('status_code')) {
                            if (error.status_code === 404) {
                                this.$router.push({ name: '404' })
                            }
                        } else {
                            this.$message.error('服务器错误');
                        }
                    })
            },
        },
        mounted() {
            // this.showData();
        }
    };

</script>

<style scoped>
    .reportShow {
        background-color: #f2f2f2;
        color: #333;
        margin: 20px auto;
        width: 960px;
    }
    #summary {
        width: 960px;
        margin-bottom: 20px;
    }
    #summary th {
        background-color: skyblue;
        padding: 5px 12px;
    }
    #summary td {
        background-color: lightblue;
        text-align: center;
        padding: 4px 8px;
    }
    .details {
        width: 960px;
        margin-bottom: 20px;
    }
    .details th {
        background-color: skyblue;
        padding: 5px 12px;
    }
    .details tr .passed {
        background-color: lightgreen;
    }
    .details tr .failed {
        background-color: red;
    }
    .details tr .unchecked {
        background-color: gray;
    }
    .details td {
        background-color: lightblue;
        padding: 5px 12px;
    }
    .details .detail {
        background-color: lightgrey;
        font-size: smaller;
        padding: 5px 10px;
        text-align: center;
    }
    .details .success {
        background-color: greenyellow;
    }
    .details .error {
        background-color: red;
    }
    .details .failure {
        background-color: salmon;
    }
    .details .skipped {
        background-color: gray;
    }

    .button {
        font-size: 1em;
        padding: 6px;
        width: 4em;
        text-align: center;
        background-color: #06d85f;
        border-radius: 20px/50px;
        cursor: pointer;
        transition: all 0.3s ease-out;
    }
    a.button{
        color: gray;
        text-decoration: none;
    }
    .button:hover {
        background: #2cffbd;
    }

    .overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        transition: opacity 500ms;
        visibility: hidden;
        opacity: 0;
    }
    .overlay:target {
        visibility: visible;
        opacity: 1;
        overflow: scroll;
    }

    .popup {
        margin: 70px auto;
        padding: 20px;
        background: #fff;
        border-radius: 10px;
        width: 50%;
        position: relative;
        transition: all 3s ease-in-out;
    }

    .popup h2 {
        margin-top: 0;
        color: #333;
        font-family: Tahoma, Arial, sans-serif;
    }
    .popup .close {
        position: absolute;
        top: 20px;
        right: 30px;
        transition: all 200ms;
        font-size: 30px;
        font-weight: bold;
        text-decoration: none;
        color: #333;
    }
    .popup .close:hover {
        color: #06d85f;
    }
    .popup .content {
        max-height: 80%;
        overflow: auto;
        text-align: left;
        padding-bottom: 20px;
    }

    @media screen and (max-width: 700px) {
        .box {
            width: 70%;
        }
        .popup {
            width: 70%;
        }
    }

</style>