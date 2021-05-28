<template>
  <div class="message" align="left"> 


<slot>  </slot>
<button type="button">read</button>

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
  float:right;
  vertical-align: top;
  display:inline-block;
  background-color: grey;
  border-color: grey;
  border-radius: 6px;
  color: white;
  padding: 6px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
slot{
    display:inline-block;
}

.message > *{

display:inline-block;
}

.message{
  border-radius: 6px;
  background-color: white;
  height: 300px;
  width: 300px;
  border: 0px solid green;
  padding: 50px;
  margin: 20px;
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
