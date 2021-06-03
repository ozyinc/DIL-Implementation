  
<template>
  <div class="result-page">
    <h2> Click here to submit your test: </h2>
    <router-link to="/result">
    <button id="submitButton" type="button" v-on:click="submit">
        Submit
    </button>
  </router-link>
  </div>
</template>
 
<script>
import bus from  '../bus'

export default {
  methods: {
      submit: async function () {
      //HERE CODE FOR SUBMITTING THE ANSWERS AND SHOW RESULTS

        let questions = JSON.parse(localStorage.getItem('questions'));

        // POST request using fetch with async/await
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(questions)
        };

        const response = await fetch("https://us-central1-chrome-sensor-291917.cloudfunctions.net/submitLevelAssessment", requestOptions)

        // check for error response
        if (!response.ok) {
        console.log("male");
            //get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        console.log("Response text:");
        const data = await response.json();
        console.log(data);

        bus.$emit('results-arrived', data);


    },
  },
  mounted() {
    bus.$emit('update-title', 'Level Assessment Test') 
  },

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#submitButton {
  font-size: 30px;
  color: white;
  cursor: pointer;
}

#submitButton:hover {
  background-color: rgb(55, 55, 146);
}

#submitButton:active {
  background-color: rgb(37, 37, 121);
  box-shadow: 0 5px #666;
  transform: translateY(4px);
  transition: all 0.1s;
}

</style>
