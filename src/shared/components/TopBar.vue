<template>
    <nav class="navbar navbar-expand-sm navbar-light bg-light navbar-bottom-shadow">
      <div class="container-fluid">
        <div class="navbar-brand router-link">
            <img src="@/assets/amp-up-io.svg" class="bi me-2" width="32" height="32" alt=""/>
            Test Runner
        </div>
        <button class="btn btn-outline-secondary" @click="handleEndAttemptClick" type="button">
          End Attempt
        </button>
      </div>
    </nav>
</template>
  
<script>
export default {
    name: 'TopBar',
  
    props: {
    },
  
    data () {
      return {
      }
    },
  
    methods: {
      
      handleEndAttemptClick () {
        this.$emit('initiateEndAttempt')
      }

    },
  
    mounted () {
    }
}
</script>
  
<style>
.navbar-bottom-shadow {
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16);
}
  
.navbar-brand.router-link a {
  text-decoration: none;
  color: inherit;
}
</style>