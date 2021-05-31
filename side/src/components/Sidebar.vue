<template>
  <div class="sidebar">
      <div class="title">
          Sidebar
      </div>
      <div class="menu-items"> 
          <router-link to ="/questions/0" active-class="active" exact tag="button" class="side-btn">
           <div class="link-container">
               Question number 1
           </div>
          </router-link>   
          <router-link to ="/questions/1" active-class="active" exact tag="button" class="side-btn">
           <div class="link-container">
               Question number 2
           </div>
          </router-link> 
          <router-link to ="/" active-class="active" exact tag="button" class="side-btn">
           <div class="link-container">
               Question number 3
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
    font-size: 25px;
    border: none;
    padding: 20px 0px;
    cursor: pointer;
    color:rgb(55, 55, 146);
    background-color: transparent;
}

</style>
