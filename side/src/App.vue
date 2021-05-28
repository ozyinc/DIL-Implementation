<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    <h1> black title </h1>
    <ul>
        <li v-for="(xyz, index) in list" :key="index">{{xyz}}</li>
    </ul>

    <hello-2 msg="Welcome to Your Vue.js App"/>

    <!--<button @click="helloWor(another)"> Click me </button> -->

    <router-link to="/foo"> CIAo </router-link>
    <router-link to="/foo/2" :question='exercise[1]'> CIAo </router-link>
    <router-link :to="{path:  '/foo/2', params:exercise[1]}"
    > CIAo </router-link>



    <router-view> </router-view>
  </div>
</template>

<script>
import Hello2 from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    Hello2
  },
  apollo() {

  },
  data() {
    return {
      variablename: 'iii',
      another: 'rrr',
      list: [1,2,3,4,5,6],

      exercise: [
        {
          id: 1,
          difficulty: 1,
          subID:1,
          type:'HANDWRITTEN',
          content:{
            title:'question1',
            description: 'blabla',
            image: 'URL',
            correctAnswer: 'ciao'
          }
        },

        {
          id: 2,
          difficulty: 2,
          subID:1,
          type:'GRAMMAR',
          content:{
            title:'question2',
            description: 'blablablao',
            image: 'URL2',
            options:['aqua', 'acua', 'acqua', 'aqcua'],
            correctAnswer: 2
          }
        }

      ]


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
