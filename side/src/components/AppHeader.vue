<template>
  <div class="header">
    <h2>{{ pageTitle }}</h2>
  </div>
</template>

<script>
import bus from '../bus'
export default {
  //   props: {
  //     pageTitle: String
  //   },
  data() {
    return {
      pageTitle: "Side Education",
    };
  },
  mounted() {
    bus.$on('update-title', (newTitle) => {
        this.pageTitle = newTitle;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
    text-align: center;
    position: fixed;
    left:0;
    right:0;
    top:0;
    padding: 10px;
    background-color: white;
    box-shadow: 0px 4px 4px rgba(121, 121, 121, 0.25);
}
h2 {
    margin: 0;
}

</style>
