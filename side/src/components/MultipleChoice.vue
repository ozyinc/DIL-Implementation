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
        <input type="checkbox" :name="q" />
        <label :for="q"> {{ q }} </label>
      </div>
    </message>
  </div>
</template>

<script>
import Message from "./Message";

export default {
  name: "MultipleChoice",
  components: {
    Message,
  },
  props: {
    question: Object,
  },
  mounted() {
    console.log("this is the question:", this.question.content);
  },
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
