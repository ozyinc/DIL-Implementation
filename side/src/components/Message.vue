<template>
  <div class="message" align="left"> 




<button type="button"><img src="../assets/Speaker.svg"></button>
<h2>{{title}}</h2>
<h3>{{description}}</h3>


<!-- CONDITIONAL RENDERING -->
<h1 v-if=image>    <canvas id="myCanvas" width="240" height="80"
style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.
</canvas>
</h1>




<slot>  </slot>


    </div>

</template>

<script>

export default {
  props: {
    question: Object,
    title: String,
    description: String,
    image: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


h2 {
  font-weight: bold;
  color:rgb(55, 55, 146);
}

h3{

  color:rgb(55, 55, 146);
}


button {
  float: right;
  vertical-align: top;
  display:inline-block;
  background-color: transparent;
  border-color: transparent;
  border-radius: 6px;
  color: white;
  padding: 6px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: -20px 2px;
  cursor: pointer;

}

button:hover {background-color: rgb(226, 224, 224)}

button:active {
  background-color: rgb(218, 218, 218);
  box-shadow: 0 5px #666;
  transform: translateY(4px);
  transition: all 0.1s
}

.message{
  border-radius: 6px;
  background-color: white;
  height: 250px;
  width: 550px;
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
