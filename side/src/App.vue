<template>
  <div id="app">
 
    <p>ciao</p>
    <multiple-choice :question="exercise[1]"></multiple-choice>
    <message> </message>
    <p>ciao</p>

    <router-view> </router-view>
  </div>
</template>

<script>
import Message from './components/Message.vue';
import MultipleChoice from './components/MultipleChoice.vue';

export default {
  name: 'App',
  components: {
   // Hello2,
    MultipleChoice,
    Message
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
            title:'Question2',
            description: 'Question content',
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
  background-color:#e3ded1;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
