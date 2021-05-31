<template>
  <div class="sidebar">
      <div class="title">
          Sidebar
      </div>
      <div class="menu-items"> 
          <router-link to ="/questions/0" active-class="active" tag="button" class="side-btn">
           <div class="link-container">
               Quetstion 1
           </div>
          </router-link>   
          <router-link to ="/questions/1" active-class="active" tag="button" class="side-btn">
           <div class="link-container">
               Question 2
           </div>
          </router-link> 
          <router-link to ="/" active-class="active" tag="button" class="side-btn">
           <div class="link-container">
               Question 3
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
    background-color: white;
    color: teal;
    font-weight: 500;
}
.side-btn{
    border: none;
    padding: 20px 0px;
    cursor: pointer;
    color: white;
}

</style>
