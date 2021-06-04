import Vue from 'vue';
import bus from './bus';

const player = new Vue({
  data() {
    return {
      audioChunks: [],
      audioBlob: null,
      outputSource: null,
      playing: false,
    };
  },
  methods: {
    playMessage: async (arrayBuffer) => {
      const { buffer } = new Uint8Array(arrayBuffer);
      const audioContext = new AudioContext();
      try {
        if (buffer.byteLength > 0) {
          audioContext.decodeAudioData(
            buffer,
            function (buffer) {
              audioContext.resume();
              player.outputSource = audioContext.createBufferSource();
              player.outputSource.connect(audioContext.destination);
              player.outputSource.buffer = buffer;
              const endHandler = function () {
                this.playing = false;
                bus.$emit('stopped-playing');
              };
              player.outputSource.onended = endHandler;

              bus.$emit('start-playing');
              player.outputSource.start(0);

              this.playing = true;
            },
            (...args) => {
              console.error(args);
            },
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    stopPlayingMessage: () => {
      player.outputSource.stop();
    },
    isPlaying() {
      return this.playing;
    },
  },
});

export default player;
