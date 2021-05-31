<template>
    <div class="dashboard">
        <Sidebar/>
        <div class="content">
            <router-view/>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar'
export default {
    components: {
        Sidebar
    }
}
</script>

<style>
.dashboard {
    display: grid;
    grid-template-columns: 1.5fr 5fr;
    background-color: white;
    height: 100vh;
    width: 80vw;
   
}
.content {
  
    /* padding-left: 120px; */
    background-color: #e9f3fa;
    
}
</style>