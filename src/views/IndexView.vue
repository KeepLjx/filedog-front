<template>
  <div class="index_container">
    <el-form id="form" ref="form" :model="form">
      <el-form-item label="姓名" class="index_name">
        <el-input v-model="form.name" @change="handleChange"></el-input>
      </el-form-item>
      <el-form-item label="请选择目标文件夹" class="CascadeSelection"><br>
        <CascadeSelection @update:value="handleCascadeUpdate" @update:suffix="handleSuffixUpdate"
          @update:file_rule="handleFileRuleUpdate"></CascadeSelection>
      </el-form-item>
      <el-form-item label="文件提交" class="FileUpload">
        <FileUpload :upload-allowed="uploadAllowed" :value="value" :suffix="suffix" :file_rule="file_rule"
          :student_id="student_id" :name="form.name" @update:fileList="handleFileListUpdate"
          @update:success="handleSuccessUpdate" ref="fileUploadComponent">
        </FileUpload>
      </el-form-item>
      <el-form-item class="index_submit">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>

    <el-footer>
      <div class="record-info">
        © 版权所有:keepl<span> | </span>
        <a href="https://beian.miit.gov.cn" class="record-link">陕ICP备2024027134号-1</a>
        <span> | </span>

        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=61048102000201" class="record-link" rel="noreferrer"
          target="_blank">
          <img class="record-icon" src="../assets/备案图标.png"> 陕公网安备61048102000201
        </a>
      </div>
    </el-footer>
  </div>
</template>
                                                             
<script lang="js">
import Vue from 'vue';
import FileUpload from '@/components/FileUpload.vue';
import CascadeSelection from '@/components/CascadeSelection.vue';
import {
  getId,
  submit,
} from '@/api/submit';
export default Vue.extend({
  components: {
    FileUpload,
    CascadeSelection,
  },
  data() {
    return {
      activeIndex: '1',
      form: {
        name: '',
        type: [],
      },
      fileList: [],
      // 级联选择器内容
      suffix: '',
      value: '',
      file_rule: '',
      student_id: '',
      success: false,
      hasWarned: false,
    };
  },
  computed: {
    // 计算属性来确定是否允许上传
    uploadAllowed() {
      return this.form.name.trim() !== '' && this.value !== '';
    },
  },
  methods: {
    handleSelect(index) {
      const path = this.resolvePath(index);
      if (this.$route.path !== path) {
        this.$router.replace(path).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
          // 否则错误是 NavigationDuplicated，可以忽略
        });
      }
    },
    resolvePath(index) {
      switch (index) {
        case '1':
          return '/';
        case '2':
          return '/gather';
        case '3':
          return '/login';
        default:
          return '/';
      }
    },
    handleFileListUpdate(fileList) {
      this.fileList = fileList;
    },
    handleSuccessUpdate(success) {
      this.success = success;
    },
    handleCascadeUpdate(value) {
      this.value = value;
    },
    handleSuffixUpdate(suffix) {
      this.suffix = suffix;
    },
    handleFileRuleUpdate(file_rule) {
      this.file_rule = file_rule;
    },
    onSubmit() {
      if (this.form.name === '' || this.value === '' || this.fileList.length === 0) {
        if (!this.hasWarned) {
          this.$message.warning({
            message: '信息或文件不完整！',
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
      if (this.success === false) {
        if (!this.hasWarned) {
          this.$message.warning({
            message: '文件正在上传，请耐心等候',
            showClose: true
          });
          this.hasWarned = true;
          // 设置延时来重置提示标志
          setTimeout(() => {
            this.hasWarned = false;
          }, 3000);
        }
      } else {
        const uniqueFileNames = Array.from(new Set(this.fileList.map(file => file.name)));
        if (this.file_rule == '其他') {
          this.$message.success('提交成功');
        } else {
          this.$message.success("提交成功,文件名已自动修改。");
        }
        this.fileList = [];
        if (this.$refs.fileUploadComponent) {
          //将子组件FileUpload中的fileList清空
          this.$refs.fileUploadComponent.clearFileList();
        }
      }
    },
    handleChange() {
      var params = this.form.name;
      //将改变后的姓名发射出去
      this.$emit('nameChange', this.form.name);
      getId(params).then(res => {
        if (res.data.data === null) {
          this.form.name = ''
          this.$message.warning(res.data.msg)
        }
        this.student_id = res.data.data;
      })
    }
  }


});
</script>

<style>
.index_container {
  display: flex;
  /* 启用 flex 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100vh;
  width: 100%;
  /* 使容器高度充满整个视口高度 */
  /* background-color: #fff; */
  /* 背景颜色 */
}

#form {
  max-width: 400px;
  /* 设置最大宽度，可根据实际需要调整 */
  padding-top: -10px;
  padding: 10px;
  /* 设置内边距，增加一些空间 */

  border: 1px solid #ccc;
  /* 设置边框 */
  border-radius: 10px;
  /* 设置圆角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 设置阴影 */
  background-color: rgba(255, 255, 255, 0.95);
  /* 设置背景颜色，稍微透明 */
}

/* 调整其他相关样式以确保与新布局兼容 */
.CascadeSelection,
.FileUpload,
.index_submit,
.index_name {
  margin: 5px 0;
  /* 增加一些外边距，使表单项之间有间距 */
}

/* Footer样式调整，使其始终位于底部 */
.el-footer {
  background-color: rgba(228, 229, 237, 0.8);
  color: #333;
  text-align: center;
  line-height: 60px;
  position: fixed;
  /* 固定位置 */
  bottom: 0;
  /* 放置在底部 */
  left: 0;
  /* 从左侧开始 */
  width: 100%;
  /* 宽度扩展至100% */
  height: 30px;
  /* 设置高度为60px */
}

.record-link {
  color: inherit;
  /* 继承父元素的字体颜色 */
  text-decoration: none;
  /* 去除下划线 */
}

.record-info {
  display: inline-block;
  /* 或根据需要调整布局 */
}

.security-record-link img {
  vertical-align: middle;
  /* 图标与文字垂直居中 */
  margin-right: 4px;
  /* 图标和文字之间的间距 */
}

.record-icon {
  /* 根据需要调整图标大小 */
  width: 20px;
  /* 示例宽度 */
  height: 20px;
  /* 示例高度 */
  margin-bottom: -4px;
}
</style>
