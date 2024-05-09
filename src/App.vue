<template>
  <div id="app">
    <router-view />
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */

}

html,
body {
  margin: 0;
  padding: 0 important;
  overflow-y: hidden;
}

body.el-popup-parent--hidden {
  padding-right: 0 !important;
}
</style>