<template>
  <div class="multiple-choice">
    {{question.title}}
    <p> {{question.description}}</p>
     <div v-for="(q, index) in question.options" :key="index">
        <input type="checkbox"   :name="q">
        <label :for="q">  {{q}} </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: Object
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
