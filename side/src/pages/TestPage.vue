<template>
  <div class="test-page">
    <br><br>
    <img src="../assets/logo-side.svg" />
    <h1>Level Assessment Test</h1>
    <router-link to="/questions/0">
      <button class="start-test" @click="initiateTest">Start test!</button>
    </router-link>
  </div>
</template>

<script>
export default {
  methods: {
    initiateTest() {
      localStorage.removeItem('questions');
    },
  },
};
</script>

<style>
.test-page {
    text-align: center;
}

.start-test {
  font-size: 24px;
  background-color: #383D9C;
  border: none;
  border-radius: 4px;
  box-shadow: 0px 4px 4px rgba(121, 121, 121, 0.25);
  color: white;
  padding: 10px 16px;

}
</style>
