<template>
  <div id="back">
    <div class="back-wrapper" @click.stop="goBack" :style="{top: top}">
      <i class="iconfont icon-houtui" :style="{color: color}"></i>
    </div>
  </div>
</template>

<script>
import router from '../../router/index'
import { mapMutations } from 'vuex'

export default {
  props: {
    top: {},
    color: {
      default: '#333'
    }
  },
  methods: {
    ...mapMutations([
      'back',
      'cancelBlur'
    ]),
    goBack() {
      this.$emit('back')
    }
  }
}
</script>

<style lang="stylus">
#back
  .back-wrapper
    position absolute
    top 64px
    left 36px
    padding 6px
    color rgba(42, 42, 42, .6)
    cursor pointer
    .iconfont
      font-size 32px
</style>
