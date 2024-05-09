<template>
  <el-upload class="upload" drag action="/api/common/upload" multiple :before-upload="beforeUpload" :file-list="fileList"
    :on-change="handleChange" :on-success="handleSuccess" :auto-upload="true" show-file-list="false">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传(可多选)</em></div>
    <div slot="tip" class="el-upload__tip"> 最多一次可上传5个文件若上传多个会自动保留前5个文件。</div>
  </el-upload>
</template>

<script lang="js">
import Vue from 'vue';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
  path,
} from '../api/submit'
import { insertFile, findFiles } from '../api/download.ts'
Vue.prototype.$message = Message;
export default Vue.extend({
  props: {
    uploadAllowed: {
      type: Boolean,
      default: false // 默认值，可以根据你的实际需要调整
    },
    value: {
      // ["何梦婷", "艺术会"]
      type: [String, Array], // 允许 value 是字符串或数组
      default: '' // 默认值，如果是数组可能需要调整
    },
    suffix: {
      type: String,
      default: ''
    },
    file_rule: String,
    student_id: String,
    name: String,
  },
  data() {
    return {
      fileList: [],
      fileNum: 0,
      isUploading: false,
      totalUploadCount: 0,
      successUploadCount: 0,
      hasWarned: false,
      newPath: '',
      folderName: '',
      tableData: [],
      success: false,
    }
  },
  methods: {
    beforeUpload(file) {
      if (!this.uploadAllowed) {
        // 判断是否已经显示过提示
        if (!this.hasWarned) {
          this.$message.warning({
            message: '请先填写姓名和选择目标文件夹！',
            showClose: true
          });
          this.hasWarned = true;
          // 设置延时来重置提示标志
          setTimeout(() => {
            this.hasWarned = false;
          }, 3000);
        }
        return false;
      }
      // 获取文件后缀名
      const extension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
      // 假设value是一个允许的后缀名列表（字符串数组形式），则需要根据实际情况调整此处
      if (!this.suffix.includes(extension)) {
        if (!this.hasWarned) {
          this.$message.warning({
            message: '文件理性错误,要求后缀:' + ' ' + this.suffix,
            showClose: true
          });
          this.hasWarned = true;
          // 设置延时来重置提示标志
          setTimeout(() => {
            this.hasWarned = false;
          }, 3000);
        }
        return false; // 阻止文件上传
      }
      //文件大小校验
      if (!(file.size / 1024 / 1024 < 100)) {
        this.$message.error('上传文件大小不能超过 100MB!');
        return false;
      }
      //上传文件不能为空
      if (this.fileList.length === 0) {
        this.$message.error('请上传文件');
        return false;
      }
      //上传文件数量
      if (this.fileList.length > 5) {
        return false; // 阻止文件上传
      }
      // 开始上传前的逻辑，适时重置计数器
      if (!this.isUploading) {
        this.totalUploadCount = 0;
        this.successUploadCount = 0;
        this.isUploading = true;
      }
      this.totalUploadCount++;
      //提取原始文件名的后缀
      const fileExtension = file.name.split('.').pop();
      //文件夹名
      const processedFolder = this.value.join('/') + '/';
      this.folderName = processedFolder;
      let fileNameWithoutExtension = '';
      // 根据file_rule生成新的文件名（不含后缀）
      if (this.file_rule === '学号+姓名') {
        fileNameWithoutExtension = this.student_id + this.name;
      }
      if (this.file_rule === '姓名+学号') {
        fileNameWithoutExtension = this.name + this.student_id;
      }
      if (this.file_rule === '其他') {
        fileNameWithoutExtension = file.name;
      }
      // 将folder, 新文件名（基于file_rule），以及文件后缀拼接在一起，生成完整路径
      const newPath = processedFolder + fileNameWithoutExtension + '.' + fileExtension;
      this.newPath = newPath;
      //将新生成的文件路径发送给后端
      path(newPath);
      return true;
    },
    handleChange(file, fileList) {
      // 如果没有超过限制，则正常更新 fileList
      this.fileList = fileList;
      this.$emit('update:fileList', this.fileList);
    },
    handleSuccess() {
      this.successUploadCount++;
      // 判断所有文件是否上传完成
      if (this.successUploadCount === this.totalUploadCount) {
        this.$message.success('您的提交已更新');
        this.isUploading = false;
      }
      this.success = true;
      this.$emit('update:success', this.success);
      var params = {
        submiter: this.name,
        folderName: this.folderName,
        fileSuffix: this.suffix,
        fileRule: this.file_rule,
        filePath: this.newPath,
      }
      //调用后端接口将文件信息插入数据库
      insertFile(params);
    },
    clearFileList() {
      this.fileList = [];
    },
  }

});
</script>

<style>
.el-upload__tip {
  margin-bottom: -30px;
  /* 向上移动文字 */
  /* display: inline-block; 或者block，取决于布局需求 */
  transform: translate(23px, -30px);
  /* 向上移动文字 */
}





</style>