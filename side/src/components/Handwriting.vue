<template>
  <div class="handwriting">
    <message :title="question.content.title" :description="question.content.description"></message>
    <message>
      <canvas id="myCanvas" width="460" height="260" @mousemove="draw" @mousedown="beginDrawing" @mouseup="stopDrawing" ></canvas>
        <div id="buttons">
          <button id="trashButton" type="button" v-on:click="trashCanvas"><img src="../assets/Trash.svg" /></button>
          <button id="confirmButton" type="button" v-on:click="confirm">Confirm</button>
        </div>
      
    </message>
  </div>
</template>

<script>
import Message from "./Message.vue";
export default {
  components: { Message },
  props: {
    question: Object,
  },
  data() {
    return {
      canvas: null,
      x: 0,
      y: 0,
      answer: ''
    };
  },
  methods: {

  //retrieve  the canvas element and clear it for redrawing.
   trashCanvas: function(){
    var can = document.getElementsByTagName("canvas");
    const context = can[0].getContext('2d');
    context.clearRect(0, 0, can[0].width, can[0].height);
    },

    drawLine(x1, y1, x2, y2) {
      let ctx = this.canvas;
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    },
    draw(e) {
      if (this.isDrawing) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = e.offsetX;
        this.y = e.offsetY;
      }
    },
    beginDrawing(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.isDrawing = true;
    },


    async stopDrawing(e) {
      if (this.isDrawing) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
      }
      this.answer = this.createAnswerString();
    },

     confirm: async function (){
      console.log("submitted");



      var can = document.getElementsByTagName("canvas");
      var dataURLstring = can[0].toDataURL().split(",")[1];



   var Bbody= {
     imageb64: dataURLstring
   }

      // POST request using fetch with async/await
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body:JSON.stringify(Bbody)
      };

      const response = await fetch("https://us-central1-chrome-sensor-291917.cloudfunctions.net/evaluateWriting", requestOptions)
      //.then(async response => {
     // const data = await response.json();
     // this.postId = data.id;

      console.log("Response text:");
      console.log(response.text);
      const data = await response.json();
      console.log(data);






      // check for error response
     if (!response.ok) {
       console.log("male");
        //get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }

      this.totalVuePackages = data.total;


    /*
    .catch(error => {
      this.errorMessage = error;
      console.error("There was an error!", error);
    });*/

     console.log("Good");
    },

    createAnswerString: function() {
      var can = document.getElementsByTagName("canvas");
      var dataURLstring = can[0].toDataURL().split(",")[1];
      return dataURLstring;
    }
      
  },
  mounted() {
    var c = document.getElementById("myCanvas");
    this.canvas = c.getContext("2d");
  },
  beforeDestroy() {

    console.log(this.answer)

    let result = {
        correctAnswer: this.question.content.correctAnswer,
        questionID: this.question.id,
        type: this.question.type,
        answer: this.answer,
        title: this.question.content.title,
        description: this.question.content.description
      }

    let questions = JSON.parse(localStorage.getItem('questions'));

    if(!questions || questions.length === undefined) {
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
#myCanvas {
  border: 1px solid grey;
}
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

#confirmButton{

  margin-top: -60px;
  font-size: 30px;
  color: rgb(55, 55, 146);
}

#trashButton{
  margin-top: -70px;
  margin-right: 500px;
}


</style>
