<template>
  <div class="sidebar">
      <div class="title">
          Sidebar
      </div>
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
               Question number 3  
               </div>

                <div class="arrow">
                   <!-- <img src="../assets/Rarrow.svg" >-->
                </div>
            </div>
          </router-link>  
      </div>
  </div>
</template>

<script>

export default {
}
</script>

<style>
.title{
    color:white;
    font-size: 24px;
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
    background-color: rgb(55, 55, 146);;
    color: white;
    font-weight: 500;
}

.side-btn{
    width:100%;
    margin: 0;
    font-size: 25px;
    border: none;
    padding: 20px 0px;
    cursor: pointer;
    color:rgb(55, 55, 146);
    background-color: transparent;
}

.link-container{
    display: flex;
}

.text{
    margin-left: 2vh;
}

.arrow{
    margin-left: 10vh;
}

</style>
