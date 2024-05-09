<template>
  <div class="border">
    <div class="image-container">
      <img src="../assets/login.png" class="image" alt="Image">
    </div>
   
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <h1>立即注册</h1>
      <el-form-item label="用户名" prop="name" class="bordered-input">
        <el-input v-model="ruleForm.name" placeholder="请输入您的用户名" class="custom-placeholder-size"></el-input>
      </el-form-item>
      <el-form-item label="邮件" prop="email" class="bordered-input">
        <el-input v-model="ruleForm.email" placeholder="请输入您的电子邮件" class="custom-placeholder-size"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass" class="bordered-input">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="输入密码"
          class="custom-placeholder-size"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" class="bordered-input">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="确认密码"
          class="custom-placeholder-size"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="registry__button" type="primary" @click="submitForm('ruleForm')">登录/注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="js">
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'));
      }

      if (value.length > 10) {
        return callback(new Error('用户名长度不能超过10个字符'));
      }
      const reg = /^[A-Za-z0-9_\u4e00-\u9fa5]+$/
      if (!reg.test(value)) {
        return callback(new Error('只能匹配字母、数字、下划线、中文'));
      }
      callback();
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮件'));
      }
      const reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
      if (!reg.test(value)) {
        return callback(new Error('邮件格式不正确'));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: '',
        email: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style>
.ruleForm {
  max-width: 100%; /* 使用百分比确保在小屏幕上也能适应 */
  padding-right: 5%; /* 使用相对单位而非固定像素 */
  padding-top: 10%; /* 使用相对单位而非固定像素 */
  padding-bottom: 10%; /* 使用相对单位而非固定像素 */
  background-color: #fff;
}

.border {
  margin: 0;
  padding: 0;
  height: 90vh; /* 保持这个设置，因为它是相对视口的高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
}

.registry__button {
  max-width: 90%; /* 调整最大宽度为百分比 */
  padding: 5%; /* 使用相对单位 */
  border-radius: 20px;
  width: auto; /* 自适应宽度，而非固定宽度 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.bordered-input {
  position: relative;
  margin-bottom: 25px; /* 保持这个设置 */
}

.border .el-form-item__label {
  position: absolute;
  top: 10px;
  left: 10%; /* 使用百分比 */
  font-size: 1rem; /* 使用可缩放的单位，如 rem */
  line-height: 1;
  text-align: left;
  margin: 5;
}

.border .el-input__inner {
  width: 90%; /* 使用百分比，以提高响应性 */
  height: 50px; /* 可以保持，但要确保不会导致布局问题 */
  padding-top: 20px; /* 根据标签大小调整 */
  padding-left: 15px;
  border: none;
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.1);
}

.custom-placeholder-size .el-input__inner::placeholder {
  font-size: 1rem; /* 使用可缩放的单位 */
  color: #ccc;
}


.ruleForm .el-form-item__error {
  font-size: 0.75rem; /* 使用较小的可缩放单位 */
}

.image-container {
  width: 100%; /* 容器宽度调整为100%，以适应屏幕宽度 */
  max-width: 400px; /* 设置最大宽度以保持设计的完整性 */
  height: auto; /* 高度自适应 */
  border: 1px solid #ccc;
}

.image {
  width: 100%; /* 图片宽度100%以适应其容器 */
  height: auto; /* 高度自动，保持图片比例 */
  top: 50%;
  left: 50%;
  transform: translate(0%, 0%);
}
</style>