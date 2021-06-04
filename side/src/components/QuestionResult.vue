<template>
  <div class="question-result">
      <div class="overview" @click="toggleExpand">
        <h3>{{question.title}}</h3>
        <div :class="['evaluation', {'correct': question.evaluation}, {'incorrect': !question.evaluation}]">
          <strong>{{question.evaluation ? 'Correct': 'Incorrect'}}</strong>
          <img v-if="question.evaluation" src="../assets/icon-correct.svg">
          <img v-else src="../assets/icon-incorrect.svg">

        </div>
      </div>
      <div class="detail" v-if="expand">
        <p>{{question.description}} </p>
        <div class="result">
          <div class="evaluation">
            <h4>The answer provided is <strong><span :class="question.evaluation ? 'correct': 'incorrect'"> {{question.evaluation ? 'Correct': 'Incorrect'}}</span> </strong>.</h4>
          </div>
          <div class="answer-box">
            <h4>Your answer:</h4>

              <div v-html="parseAnswer(question.answer)" class="answer" ></div>
            
          </div>
        </div>
        <div class="correct-answer">
          <h4>Correct answers</h4>
             
          <div class="answer" > {{question.correctAnswer}} </div>

        </div>
      </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      expand: false
    }
  },
  props: {
    question: Object,
  },
  methods: {
    toggleExpand: function() {
      this.expand = !this.expand;
    },
    parseAnswer(answer) {
      switch(this.question.type) {
        case 'MultipleChoice':
          return `<p>${answer}</p>`;
        case 'Handwriting': 
          return `<img src="data:image/png;base64,${answer}">`;
        default:
          return 'No Answer';
      }
    },
  },
  computed: {

  },
  mounted() {
  }
};
</script>

<style scoped>
h4 {
  color: #40437D;
}
.message {
  width: auto;
}

.overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F4F6FB;
  padding: 0px 20px;
  border-bottom: 1px solid #40437D;
  margin-bottom: 10px;
  color: #40437D;
}

.overview > * {
  display: inline-block
}
.overview .evaluation > *{
  vertical-align: middle;
  margin-left: 5px;
}
.overview .evaluation.correct,
.result .evaluation .correct {
  color: #71D2A6;
}
.overview .evaluation.incorrect,
.result .evaluation .incorrect {
  color: #C20000;
}

.question-result .result {
  background-color: #f5f5f5;

}

.question-result .result > * {
  display: inline-block;
  width: 45%;
  margin-left:20px;
  vertical-align: top;
  margin-bottom: 20px;
}

.question-result .result .answer-box .answer,
.question-result .correct-answer .answer {
  background-color: white;
  min-height: 50px;
  padding: 10px;
}
</style>
