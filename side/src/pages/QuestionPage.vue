<template>
  <div class="question-page" v-if="question">
    <component :is="question.type" v-bind="{ question }"></component>
  </div>

</template>

<script>
import db from '../firestore';
import bus from '../bus';
import Handwriting from '../components/Handwriting';
import MultipleChoice from '../components/MultipleChoice';

export default {
  data() {
    return {
      isShown: false,
      componentContent: {},
      componentParam: {},
      questions: [],
    };
  },
  computed: {
    question() {
      return this.questions[this.$route.params.index] || 0;
    },
  },
  methods: {
    getQuestions() {
      db.collection('exercises').onSnapshot((snapshot) => {
        const exercises = [];

        snapshot.forEach((doc) => {
          const q = JSON.parse(JSON.stringify(doc.data()));
          q.id = doc.id;
          exercises.push(q);
        });

        this.questions = exercises;

        bus.$emit('questions-loaded', this.questions);
      });
    },
  },
  created() {
    this.getQuestions();
  },
  mounted() {
    bus.$emit('update-title', 'Level Assessment Test');
  },
  components: {
    Handwriting,
    MultipleChoice,

  },
};

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

</style>
