<template>

  <div id="app">
    <!-- <app-header></app-header> -->
    <router-view> </router-view>
  </div>


</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4c4c4c;
}

body{
  margin:0 px;
  padding:0 px;
  box-sizing: border-box;
  background-color:#e9f3fa;
}


</style>
