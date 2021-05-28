<template>
  <div >
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    <h1> black title {{$route.params.id}}</h1>
    
    <hello-2 msg="IACopois"/>

    

  </div>
</template>

<script>
import Hello2 from './HelloWorld.vue'

export default {
  components: {
    Hello2
  },
  apollo() {

  },
  data() {
    return {
      variablename: 'iii',
      another: 'rrr',
      list: [1,2,3,4,5,6]
    }
  },
  computed: {
    doublelist() {
      return this.list.map(x => x * 2);
    }
  },
  methods: {
    helloWor: function(hghg) {
      console.log(hghg)
      console.log(this.variablename)      

      console.log(this.doublelist)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
