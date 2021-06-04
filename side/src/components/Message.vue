<template>
  <div class="message-item" >
    <div class="chat-pal"><img src="@/assets/chat-pal.svg"></div>
    <div class="message" ref="message">
      <button type="button"><img src="../assets/Speaker.svg"  @click="playMessage"></button>
      <h2>{{ title }}</h2>
      <h3>{{ description }}</h3>

      <h1 v-if="image">
        <canvas
          id="myCanvas"
          width="240"
          height="80"
          style="border:1px solid #d3d3d3;"
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </h1>

      <slot> </slot>
    </div>
  </div>
</template>

<script>

import player from '../player';

export default {
  props: {
    question: Object,
    title: String,
    description: String,
    image: String,
  },
  methods: {
    async playMessage() {
      const message = this.stripHtml();

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      };

      const response = await fetch('https://us-central1-chrome-sensor-291917.cloudfunctions.net/getSpeechFromText', requestOptions);

      const data = await response.json();

      if (data) {
        player.playMessage(data.audioBuffer.data);
      }
    },
    stripHtml() {
      return this.$refs.message.textContent || this.$refs.message.textContent.innerText || '';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.message-item {
  display: flex;
  align-items: flex-end;
  margin-left: 20px;
}

.message-item > * {
  display:inline-block;

}

h2 {
  font-weight: bold;
  color: rgb(55, 55, 146);
}

h3 {
  color: rgb(55, 55, 146);
}

button {
  float: right;
  vertical-align: top;
  display: inline-block;
  background-color: transparent;
  border-color: transparent;
  border-radius: 6px;
  color: white;
  padding: 6px 15px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  margin: -20px 2px;
  cursor: pointer;
}

button:hover {
  background-color: rgb(226, 224, 224);
}

button:active {
  background-color: rgb(218, 218, 218);
  box-shadow: 0 5px #666;
  transform: translateY(4px);
  transition: all 0.1s;
}

.message {
  border-radius: 6px;
  background-color: white;
  width: 100%;
  padding: 30px;
  margin: 10px;
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
</style>
