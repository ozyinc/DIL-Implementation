<template>

  <div id="app">
    <app-header></app-header>
    <router-view> </router-view>
  </div>


</template>

<script>

import AppHeader from "./components/AppHeader"

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4c4c4c;
  height: 100%;
  width: 100%;
  position: absolute;
}

body{
  margin:0;
  padding:0;
  margin-top: 50px;
  box-sizing: border-box;
  background-color:#F4F6FB;
}


</style>
