<template>
  <div class="sidebar">
    <!-- <div class="title">
          Sidebar
      </div> -->
    <div class="menu-items">
      <router-link v-for="(q, index) in questions" :key="index"
        :to="`/questions/${index}`"
        active-class="active"
        exact
        tag="button"
        class="side-btn"
      >
        <div class="link-container">
          <div class="text">Question {{index + 1}}</div>

          <div class="arrow">
            <!-- <img src="../assets/Rarrow.svg" >-->
          </div>
        </div>
      </router-link>
    
      <router-link
        to="/final"
        active-class="active"
        exact
        tag="button"
        class="side-btn"
      >
        <div class="link-container">
          <div class="text">Finalize test</div>

          <div class="arrow">
            <!-- <img src="../assets/Rarrow.svg" >-->
          </div>
        </div>
      </router-link>
      <router-link
        to="/"
        active-class="active"
        exact
        tag="button"
        class="side-btn"
      >
        <div class="link-container">
          <div class="text">Back</div>

          <div class="arrow">
            <!-- <img src="../assets/Rarrow.svg" >-->
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>

import bus from '../bus'
export default {
  data() {
    return {
        questions: []
    }
  },
  beforeMount() {
        bus.$on('questions-loaded', (questions) => {
            this.questions = questions;
        });
  }
};
</script>

<style scoped>
.title {
  color: white;
  font-size: 16px;
  margin-top: 10px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
}

.menu-items > * {
  margin-top: 60px;
}

.side-btn:focus {
  outline: none;
}

.side-btn.active {
  background-color: rgb(64, 67, 125); /* rgb(55, 55, 146);*/
  color: white;
  font-weight: 500;
}

.side-btn {
  width: 100%;
  margin: 0;
  font-size: 16px;
  border: none;
  /* padding: 20px 0px; */
  padding: 20px;
  cursor: pointer;
  color: rgb(55, 55, 146);
  background-color: transparent;
}

.link-container {
  /* display: flex; */
  width: 200px;
}

.text {
  display: flex;
  /* margin-left: 2vh; */
}

.arrow {
  margin-left: 10vh;
}
</style>
