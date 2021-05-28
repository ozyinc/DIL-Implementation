<template>
  <div class="multiple-choice" v-if="question">
    {{question.content.title}}
    <p> {{question.content.description}}</p>
  </div>
</template>

<script>
export default {
  name: 'Handwriting',
  props: {
    question: Object
  },
  mounted() {
    console.log("this is the question:" , this.question.content)
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
</style>
