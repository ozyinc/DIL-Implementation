<template>
  <div class="multiple-choice">
    <message
      :title="question.content.title"
      :description="question.content.description"
      :image="question.content.image"
    >
    </message>

    <message>
      <div
        v-for="(q, index) in question.content.options"
        :key="index"
        align="left"
      >
        <input type="checkbox" :name="q" v-model="answers[index]"/>
        <label :for="q"> {{ q }} </label>
      </div>
    </message>
  </div>
</template>

<script>
import Message from "./Message";

export default {
  name: "MultipleChoice",
  data() {
    return {
      answers: []
    }
  },
  components: {
    Message,
  },
  props: {
    question: Object,
  },
  methods: {
    createAnswerString: function() {
      
      let result = '';
      for(let i=0; i<this.answers.length; i++) {
        if(this.answers[i]) {
          result = result + this.question.content.options[i] + ', ';
        }
      }
      result = result.slice(0, -2);
      return result;
    }
  },
  created() {
    //TODO: TAKE FROM LOCALSTORAGE
    for(let i=0; i< this.question.content.options.length; i++){
      this.answers.push(false);
    }
  },
  mounted() {
    console.log("this is the question:", this.question.content);
  },
  beforeDestroy() {
    console.log(this.answers)

    let answer = this.createAnswerString();

    console.log(answer)

    let result = {
        correctAnswer: this.question.content.correctAnswer,
        questionID: this.question.id,
        type: this.question.type,
        answer: answer,
        title: this.question.content.title,
        description: this.question.content.description
      }

    let questions = JSON.parse(localStorage.getItem('questions'));

    if(!questions) {
      localStorage.setItem('questions', JSON.stringify([ result ]));
    } else {

      let indexOfQuestion = (questions.map(q => q.questionID)).indexOf(this.question.id)
      if(indexOfQuestion > -1) {
        questions.splice(indexOfQuestion, 1);
      }
      questions.push(result);
      localStorage.setItem('questions', JSON.stringify(questions));
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 40px 0 0;
  color: red;
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
</style>
