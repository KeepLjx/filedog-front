<template>
  <div class="submit">

    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
    <el-container class="container">
      <el-header class="header">
        <template>
          <img class="img-bg" src="../assets/top.png" style="width:200px" alt="logo">
          <el-select class="index-select" v-model="selectValue" size="mini" @change="handleChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>


    </el-container>
  </div>
</template>
  
<script lang="js">
import Vue from 'vue';
export default Vue.extend({
  name: 'HomeView',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      activeIndex: '1',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',

      },
      options: [{
        value: '文件提交',
        label: '文件提交'
      }, {
        value: '发布收集',
        label: '发布收集'
      }, {
        value: '文件管理',
        label: '文件管理'
      },
      ],
    };
  },

  computed: {
    currentValue() {
      return this.$store.state.value;
    },
    selectValue: {
      get() {
        return this.$store.state.value;
      },
      set(newValue) {
        this.$store.commit('setValue', newValue);
      }
    }
  },

  methods: {


    handleChange(value) {
      if (value === '文件提交') {
        if (this.$route.path !== '/index')
          this.$router.push('/index');
      }
      if (value === '发布收集') {
        if (this.$route.path !== '/gather')
          this.$router.push('/gather');
      }
      if (value === '文件管理') {
        if (this.$route.path !== '/download')
          this.$router.push('/download');
      }
    },
  },

});
</script>
  
<style>
#index {
  color: #fff;
  text-align: left;
  font-size: larger;
}


.submit {
  background-image: url('../assets/background.jpg');
  background-size: cover;
  margin: 0;
  padding: 0;
}

#form {

  /* 设置内容最大宽度 */
  max-width: 800px;
  /* 设置内边距 */
  padding: 50px 80px;
  /* 设置边框 */
  border: 1px solid #ccc;
  /* 设置圆角 */
  border-radius: 10px;
  /* 设置阴影 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);


}


.el-header {
  background-color: #4444d0;
  text-align: left;
  line-height: 62px;
  height: 62px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  /* 确保顶栏在其他内容上方 */
  margin: 0;
  padding: 0;
}

.main {
  height: 100%;
  display: flex;
  height: 102vh;
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;
}

.submit {
  flex-direction: column;
  flex-direction: column;
  height: 100vh;
  /* 设置整个页面高度为视口高度 */
  min-height: 100vh;
  /* 限制最大高度 */
  /* 设置main高度为100%，填满容器 */
}

.el-menu {
  margin: 0;
  padding: 0;
}

.container {
  flex: 1;
  /* 设置容器占用剩余空间 */
}

.img-bg {
  transform: translate(10px, 10px)
}


.index-select {
  transform: translate(30px, -4.5px);
  width: 95.5px;
}
</style>
  