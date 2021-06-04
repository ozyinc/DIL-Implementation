  
<template>
  <div class="result-page" v-if="result">
    <div v-if="loading" class="loader">Loading...</div>
    <div v-if="!loading">
        <message>
            <h2> You level is: <div class="level">{{result.level}}</div></h2>
            <p> Check out the questions and the evaluation of your answers to see why you received this level. </p>
        </message>
        <message>
            <br>
            <question-result v-for="(question,index) in questions" :key="index" :question="question"></question-result>

        </message>
    </div>
  </div>
</template>
 
<script>
import bus from  '../bus'
import Message from '../components/Message'
import QuestionResult from '../components/QuestionResult'

export default {
    data() {
        return {
            result: {},
            questions: [],
            loading: true,
            exercises: []
        }; 
        
    },
    components: {
        Message,
        QuestionResult
    },
    methods: {
        mapQuestionsToExercises: function() {
            if(!this.questions || this.result.result) return;

            for(let i=0; i<this.questions.length; i++) {
                let indexFromResult = this.result.results.map(q => q.questionID).indexOf(this.questions[i].questionID)
                if(indexFromResult > -1) {
                    this.questions[i].evaluation = this.result.results[indexFromResult].result
                }
            }
        }

    },
    created() {
        this.loading = true;
        bus.$on('results-arrived', (data) => {
            this.result = data;
            this.loading = false;

            this.mapQuestionsToExercises();
        });
    
        this.questions = JSON.parse(localStorage.getItem('questions')) || [];

    },
    mounted() {
        bus.$emit('update-title', 'Italian - Level Assessment Result') 
    },

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.result-page {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.level {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 15px;
  background-color: #F1A16A;
  display: inline-flex;
  justify-content: center;
  align-items: center;

}

.loader {
  color: #40437D;
  font-size: 90px;
  text-indent: -9999em;
  overflow: hidden;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin: 72px auto;
  position: relative;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
  animation: load6 1.7s infinite ease, round 1.7s infinite ease;
}



@-webkit-keyframes load6 {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}
@keyframes load6 {
  0% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
  }
}
@-webkit-keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}


</style>
