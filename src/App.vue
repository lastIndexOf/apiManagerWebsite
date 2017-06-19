<template>
  <div id="app">
    <transition mode="out-in"
      enter-active-class="animated zoomInRight"
      leave-active-class="animated zoomOutLeft">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="stylus">
html
  height 100%
body
  height 100%

#app
  width 100%
  min-height 100%
  background linear-gradient(to bottom, rgb(32, 35, 64), rgb(42, 106, 134))
</style>
