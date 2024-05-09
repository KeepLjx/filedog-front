<template>
  <div class="gather">
    <el-form id="form" ref="form" :model="form" :rules="rules">
      <el-form-item label="密钥" prop="pass" class="bottom">
        <el-input v-model="form.pass" placeholder="请输入密钥" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="收集人" prop="collector" class="bottom">
        <el-input v-model="form.collector" placeholder="用于保存文件"></el-input>
      </el-form-item>
      <el-form-item label="文件夹名称" prop="folders" class="bottom">
        <el-input v-model="form.folders" placeholder="用于保存文件"></el-input>
      </el-form-item>

      <el-form-item label="命名规则" prop="file_rule" class="bottom"><br>
        <el-select v-model="form.file_rule" placeholder="请选择命名规则">
          <el-option label="学号+姓名" value="学号+姓名"></el-option>
          <el-option label="姓名+学号" value="姓名+学号"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件后缀" class="bottom" size="mini"><br>
        <el-radio-group v-model="file_suffix">
          <el-radio-button label="pdf"></el-radio-button>
          <el-radio-button label="word"></el-radio-button>
          <el-radio-button label="图片"></el-radio-button>
          <el-radio-button label="表格"></el-radio-button>
          <el-radio-button label="ppt"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <!-- 当form.pass不等于123456时，显示完整的popover -->
        <el-popover v-if="form.pass !== getPass" placement="top-start" title="提示：" width="200" trigger="hover"
          content="填入正确密钥，并填写完整信息后才可提交。">
          <template v-slot:reference>
            <el-button type="primary" @click="onSubmit" :disabled="form.pass !== getPass">提交</el-button>
          </template>
        </el-popover>

        <!-- 当form.pass等于123456时，显示无title和content的popover或不显示popover -->
        <el-button v-else type="primary" @click="onSubmit" :disabled="form.pass !== getPass">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import {
  gather,
} from '@/api/gather'
import { deleteFolder } from '../api/download.ts'

export default Vue.extend({
  computed: {
    //使用mapGetters
    ...mapGetters(['getPass']),
  },
  components: {

    // HelloWorld,
  },
  data() {
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密钥'));
      } else if (value !== this.getPass) {
        callback(new Error('密钥不正确'));
      } else {
        callback();
      }
    };
    return {
      activeIndex: '1',
      form: {
        pass: '',
        file_rule: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        visible: false,
        folders: '',
        collector: '',
      },
      file_suffix: '',
      rules: {
        pass: [
          { validator: checkPass, trigger: 'blur' }
        ],
        collector: [
          { required: true, message: '请输入收集人名称', trigger: 'blur' }
        ],
        folders: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' }
        ],
        file_rule: [
          { required: true, message: '请选择命名规则', trigger: 'change' }
        ],
        file_suffix: [
          { required: true, message: '请选择文件后缀', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    onSubmit() {
      if (this.file_suffix == '') {
        this.$message.warning('请选择文件后缀');
        return false;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          var params = {
            collector: this.form.collector,
            folderName: this.form.folders,
            fileRule: this.form.file_rule,
            fileSuffix: this.file_suffix // 如果需要以字符串形式提交
          }
          gather(params).then(res => {
            if (res.data.msg === '创建成功') {
              this.$message.success(res.data.msg)
            } else {
              //todo 加一个弹窗
              this.$confirm('该文件夹已存在，是否删除其中内容后重新创建?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'custom-prompt-size'
              }).then(() => {
                deleteFolder(params).then(res => {
                  gather(params);
                })
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });
              });
            }
            // 重置整个表单的校验状态
            this.$refs.form.resetFields();
          })
        } else {
          console.log("表单校验失败");
          return false;
        }
      });
    }
  }
});
</script>

<style>
#index {
  color: #fff;
  text-align: left;
  font-size: larger;
}

.gather {
  margin-top: 2% 2%;
  padding: 0;
  height: 100%;
  display: flex;
  width:100%;
  justify-content: center;
  align-items: center;
}

.gather #form {

  /* 设置内容最大宽度 */
  /* max-width: 800px; */
  /* 设置内边距 */
  padding: 0.8% 2%;
  /* 设置边框 */
  border: 1px solid #ccc;
  /* 设置圆角 */
  border-radius: 10px;
  /* 设置阴影 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);

}

.bottom {
  margin-bottom: 10px
}
</style>