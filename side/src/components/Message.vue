<template>
  <div class="message">

<button type="button">Read</button>
<slot>  </slot>

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
button {
    background: grey;
  border: ;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 160px;
  margin: 4px 2px;
  cursor: pointer;
}

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
