<template>


  <div id="app">
    <router-link to="/questions/0">QuestionsPage</router-link>
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
  background-color:#e9f3fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  height: 900px;
}

body{
  margin:0 px;
  padding:0 px;
  box-sizing: border-box;
}
</style>
