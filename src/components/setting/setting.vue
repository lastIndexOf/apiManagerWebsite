<template>
  <div id="setting">
    <div class="close-wrapper">
      <close></close>
    </div>
  </div>
</template>
<script>
import close from '../close/close'

export default {  
  components: { close }
}
</script>
<style lang="stylus">
.close-wrapper
  position relative
</style>