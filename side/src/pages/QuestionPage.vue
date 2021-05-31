<template>
  <div class="question-page" v-if="question">

    <Sidebar/>
    <div class="content">
    
     <router-view/>
    </div>
    
  
  </div>
</template>
 
<script>
import db from '../firestore'
//import Handwriting from '../components/Handwriting'
//import MultipleChoice from '../components/MultipleChoice'
import Sidebar from '../components/Sidebar'

export default {
  data() {
    return {
      isShown: false,
      componentContent: {},
      componentParam: {},
      questions: []
    }; 
     
  },
  computed: {
    question() {
      return this.questions[this.$route.params.index] || 0;
    }
  },
  methods: {
    getQuestions: function() {
      
      db.collection("exercises").onSnapshot(snapshot => {
        let exercises = []

        snapshot.forEach(doc => {
          let q = JSON.parse(JSON.stringify(doc.data()))
          q.id = doc.id
          exercises.push(q)
        })
        console.log(exercises)
        
        this.questions = exercises;
      })
    },
    addNewExercise: function() {
      // db.collection("exercises").add({
      //     id: 1,
      //     difficulty: 1,
      //     subjectID: 's5okQn6LqUNj1gMIHXES',
      //     type:'HANDWRITTEN',
      //     content: {
      //       title:'question1',
      //       description: 'blabla',
      //       image: 'URL',
      //       correctAnswer: 'ciao'
      //     }
      //   }).then((docRef) => {
      //     console.log("Document written with ID: ", docRef.id);
      // })
    }
  },
  created() {
    this.getQuestions();
  },

  name: 'home',

  components: {
  //  Handwriting,
   // MultipleChoice, 
    Sidebar
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 40px 0 0;
  color: red
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.question-page{
  display: grid;
  grid-template-columns: 1fr 5fr;
  background-color: teal;
  height: 100vh;
  width: 100vh;
}

.content{
  background-color: white;
  border-radius: 20px;
  margin: 6px 6px 6px 0px;
}
</style>
