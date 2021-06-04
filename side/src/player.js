import Vue from 'vue'
import bus from './bus'
// import api from './api';

let player = new Vue({
    data() {
        return {
            audioChunks: [],
            audioBlob: null,
            outputSource: null,
            playing: false
        }
    },
    methods: {
        playMessage: async(arrayBuffer) => {
            let buffer = new Uint8Array(arrayBuffer).buffer;            
            let audioContext = new AudioContext();
            try {
                if(buffer.byteLength > 0){
                    audioContext.decodeAudioData(
                        buffer,
                        function(buffer){
                            audioContext.resume();
                            player.outputSource = audioContext.createBufferSource();
                            player.outputSource.connect(audioContext.destination);
                            player.outputSource.buffer = buffer;
                            let endHandler = function() {
                                this.playing = false;
                                bus.$emit('stopped-playing');
                            }
                            player.outputSource.onended = endHandler ;
                            
                            bus.$emit('start-playing');
                            player.outputSource.start(0);

                            this.playing = true;
                        },
                        function(...args) {
                            console.error(args);
                        }
                    );
                }
            } catch(e) {
                console.error(e);
            }
        },
        stopPlayingMessage: () => {
            player.outputSource.stop();
        },
        isPlaying: function() {
            return this.playing;
        }
    }
});

export default player;
