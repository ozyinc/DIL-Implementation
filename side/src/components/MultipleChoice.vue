<template>
  <div class="multiple-choice" v-if="question">
    <message>{{question.content.title}}
    <p> {{question.content.description}}</p></message>

    <canvas id="myCanvas" width="240" height="80"
style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.
</canvas>

<message>
     <div v-for="(q, index) in question.content.options" :key="index" align="left">
        <input type="checkbox"    :name="q">
        <label :for="q">  {{q}} </label>
    </div></message>
  </div>
</template>

<script>


export default {
  name: 'MultipleChoice',
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
