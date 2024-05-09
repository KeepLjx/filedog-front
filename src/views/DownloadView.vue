<template>
    <div class="table-container">
        <div class="table">
            <div class="tableBar">
                <label style="margin-right: 10px; font-size: smaller; margin-left: 20px">文件查询：</label>
                <CascadeSelection @update:value="handleCascadeUpdate"></CascadeSelection>
                <el-button style="margin-left: 10px" type="info" size="middle" class="normal-btn continue" @click="select">
                    查询
                </el-button>

                <div class="tableLab">
                    <el-button type="primary" size="middle" style="margin-left: 10px" @click="batchDownload('add')">
                        批量下载
                    </el-button>
                    <el-button type="danger" size="middle" style="margin-left: 10px" @click="batchDelete">
                        批量删除
                    </el-button>
                </div>
            </div>
            <el-table :data="tableData" size="mini" @selection-change="handleSelectionChange" height="580">
                <el-table-column type="selection" width="50" align="center">
                </el-table-column>
                <el-table-column fixed prop="studentId" label="学号" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="submiter" label="提交人姓名" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="uploadTime" label="提交时间" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="folderName" label="所属文件夹" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="fileSuffix" label="文件类型" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="fileRule" label="命名规则" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="collector" label="收集人姓名" min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="filePath" label="文件路径" min-width="300" align="center">
                </el-table-column>
                <el-table-column label="操作" min-width="160" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary"
                            @click="handleDownload(scope.$index, scope.row)">下载</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
  
<script lang="js">
import CascadeSelection from '@/components/CascadeSelection.vue';
import { findFiles, deleteFile, deleteBatch } from '../api/download.ts'
import { mapGetters } from 'vuex';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
export default {
    computed: {
        //使用mapGetters
        ...mapGetters(['getPass']),
    },
    components: {
        CascadeSelection,
    },
    data() {
        return {
            tableData: [],
            value: [],
            multipleSelection: [], // 添加此行来存储选中的行
            hasWarned: false,
        }
    },

    created() {
        findFiles('all').then(res => {
            this.tableData = res.data.data;
            this.tableData.sort((a, b) => a.studentId - b.studentId);
        })
    },
    methods: {
        handleCascadeUpdate(value) {
            this.value = value;
        },
        select() {
            const folderName = this.value.join('/') + '/';
            console.log(folderName);
            if (folderName == '/') {
                findFiles('all').then(res => {
                    this.tableData = res.data.data;
                    this.tableData.sort((a, b) => a.studentId - b.studentId);
                })
                return;
            }
            findFiles(folderName).then(res => {
                this.tableData = res.data.data;
                this.tableData.sort((a, b) => a.studentId - b.studentId);
            })
        },
        handleDelete(row, index) {

            // 使用 Vuex 中的 pass 状态构建正则表达式
            const passPattern = new RegExp(`^${this.getPass}$`);

            this.$prompt('请输入密钥,', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: passPattern,
                inputType: 'password',
                inputErrorMessage: '密钥不正确',
                customClass: 'custom-prompt-size',
                closeOnClickModal: false,
            }).then(({ value }) => {
                //发送请求删除文件
                deleteFile(index.filePath).then(() => {
                    findFiles('all').then(res => {
                        this.tableData = res.data.data;
                    })
                })
                this.$message({
                    type: 'success',
                    message: '删除成功，文件夹为空时也将被删除。'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        batchDelete() {
            if (this.multipleSelection.length === 0) {
                if (!this.hasWarned) {
                    this.$message.warning({
                        message: '请至少选择一项进行下载',
                        showClose: true
                    });
                    this.hasWarned = true;
                    // 设置延时来重置提示标志
                    setTimeout(() => {
                        this.hasWarned = false;
                    }, 3000);
                }
                return;
            }

            // 使用 Vuex 中的 pass 状态构建正则表达式
            const passPattern = new RegExp(`^${this.getPass}$`);
            this.$prompt('请输入密钥:', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: passPattern,
                inputType: 'password',
                inputErrorMessage: '密钥不正确',
                customClass: 'custom-prompt-size',
                closeOnClickModal: false,
            }).then(() => {
                // 遍历multipleSelection数组，获取所有选中的文件路径
                const filePaths = this.multipleSelection.map(item => item.filePath);

                // 调用API来删除这些文件
                deleteBatch(filePaths).then(() => {
                    findFiles('all').then(res => {
                        this.tableData = res.data.data;
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功，文件夹为空时也将被删除。'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消操作'
                });
            });
        },
        async handleDownload(row, index) {
            // 使用 Vuex 中的 pass 状态构建正则表达式
            const passPattern = new RegExp(`^${this.getPass}$`);
            const process = await this.$prompt('请输入密钥,', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: passPattern,
                inputType: 'password',
                inputErrorMessage: '密钥不正确',
                customClass: 'custom-prompt-size',
                closeOnClickModal: false,
            }).then(({ value }) => {
                // 假设 `row.ossPath` 包含了文件的 OSS 路径
                const ossPath = this.$store.state.oss + index.filePath;
                // 打开新窗口进行下载，确保 URL 是可以直接访问的
                window.location.href = ossPath;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });

        },
        async batchDownload() {
            if (this.multipleSelection.length === 0) {
                if (!this.hasWarned) {
                    this.$message.warning({
                        message: '请至少选择一项进行下载',
                        showClose: true
                    });
                    this.hasWarned = true;
                    // 设置延时来重置提示标志
                    setTimeout(() => {
                        this.hasWarned = false;
                    }, 3000);
                }
                return;
            }

            // 使用 Vuex 中的 pass 状态构建正则表达式
            const passPattern = new RegExp(`^${this.$store.state.pass}$`);

            this.$prompt('请输入密钥:', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: passPattern,
                inputType: 'password',
                inputErrorMessage: '密钥不正确',
                customClass: 'custom-prompt-size',
                closeOnClickModal: false,
            }).then(async ({ value }) => {
                // 密钥验证通过后，提示用户输入压缩文件的名称
                this.$prompt('请输入压缩文件的名称:', '设置文件名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'custom-prompt-size',
                    closeOnClickModal: false,
                    inputValidator: (inputValue) => {
                        return !!inputValue || '文件名不能为空';
                    },
                    inputErrorMessage: '文件名不能为空'
                }).then(async ({ value: fileName }) => {
                    const zipFileName = fileName.trim();
                    const jszip = new JSZip();
                    for (let item of this.multipleSelection) {
                        try {
                            const filePath = item.filePath;
                            const ossPath = this.$store.state.oss + filePath;
                            const response = await fetch(ossPath);
                            if (response.ok) {
                                const blob = await response.blob();
                                jszip.file(filePath.split('/').pop(), blob); // 假设你想以文件原名保存
                            } else {
                                console.error('文件下载失败: ', filePath);
                                this.$message.error(`文件下载失败: ${filePath}`);
                            }
                        } catch (error) {
                            console.error('请求失败: ', error);
                            this.$message.error('请求失败，请检查网络和文件路径');
                        }
                    }

                    jszip.generateAsync({ type: "blob" })
                        .then(function (content) {
                            saveAs(content, zipFileName); // 使用用户指定的文件名保存文件
                        })
                        .catch((error) => {
                            console.error('ZIP 文件生成失败: ', error);
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消设置文件名'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入或密钥错误'
                });
            });
        }
    }

}






</script>

<style>
.table {
    transform: translate(0px, 80px);
    background-color: rgba(255, 255, 255);
    padding: 10px 0px;
    border-radius: 10px;
    width: 100%;
}

/* 调整表格四个角为圆角 */
.el-table {
    border-radius: 10px;
    margin: 0px 0px;
    width: 100%;
    /* overflow: hidden; */
    /* 确保边框内的内容也遵循圆角规则 */

}

/* 第一行行高降低和居中对齐 */
.el-table thead tr {
    height: 30px;
    /* 或您希望的行高 */
    line-height: 30px;
    /* 与height相同以垂直居中文本 */
}


.tableBar .tableLab {
    display: inline-block;
}

.table-container {
    margin: -25px 5px;
    margin-bottom: 5px;
    width: 96%;
    height: 100%;
    /* 使用视窗高度作为高度，即铺满整个屏幕 */
    /* 可以添加其他样式，例如背景颜色等 */
}

/* 调整弹窗大小 */
.custom-prompt-size {
    width: 300px;
    /* 或者其他你需要的尺寸 */
}

/* 在 <head> 中或一个外部样式表中添加这个样式 */
.body-modal-open {
    overflow-y: scroll;
    padding-right: 10px;
    /* 假设滚动条宽度为10px */
}
</style>
  