<template>
  <div class="sidebar">
      <!-- <div class="title">
          Sidebar
      </div> -->
      <div class="menu-items"> 
          <router-link to ="/questions/0" active-class="active" exact tag="button" class="side-btn">
           <div class="link-container">
               <div class="text">
               Question number 1   
               </div>

                <div class="arrow">
                   <!-- <img src="../assets/Rarrow.svg" >-->
                </div>
            </div>
          </router-link>   
          <router-link to ="/questions/1" active-class="active" exact tag="button" class="side-btn">
           <div class="link-container">
               <div class="text">
               Question number 2   
               </div>

                <div class="arrow">
                   <!-- <img src="../assets/Rarrow.svg" >-->
                </div>
            </div>
          </router-link> 
          <router-link to ="/" active-class="active" exact tag="button" class="side-btn">
         <div class="link-container">
               <div class="text">
               Back  
               </div>

                <div class="arrow">
                   <!-- <img src="../assets/Rarrow.svg" >-->
                </div>
            </div>
          </router-link>  

           <button id="submitButton" type="button" v-on:click="submit">Submit</button>
      </div>
  </div>
</template>

<script>

export default {

    methods:{
submit:  function (){
    //HERE CODE FOR SUBMITTING THE ANSWERS AND SHOW RESULTS
    console.log("ciao")
}
}
}




</script>

<style scoped>
.title{
    color:white;
    font-size: 16px;
    margin-top: 10px;
}

.menu-items{
    display: flex;
    flex-direction: column;
    margin-top: 40px;
}

.menu-items > * {
    margin-top: 60px;
}

.side-btn:focus{
    outline: none;
}

.side-btn.active{
    background-color: rgb(55, 55, 146);
    color: white;
    font-weight: 500;
}

.side-btn{
    width:100%;
    margin: 0;
    font-size: 16px;
    border: none;
    /* padding: 20px 0px; */
    padding: 20px;
    cursor: pointer;
    color:rgb(55, 55, 146);
    background-color: transparent;
}

.link-container{
    /* display: flex; */
    width: 200px;
}

.text{
    display: flex;
    /* margin-left: 2vh; */
}

.arrow{
    margin-left: 10vh;
}

#submitButton{
  margin-top: 500px;
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
