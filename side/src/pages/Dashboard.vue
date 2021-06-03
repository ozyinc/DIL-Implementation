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
    height: 100%;
}
.content {
  
    /* padding-left: 120px; */
    background-color: #F4F6FB;
    
}
</style>