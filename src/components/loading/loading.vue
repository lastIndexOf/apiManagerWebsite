<template>
  <div id="loading">
    <div class="loading-wrapper">
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
      <span class="point" :style="{width: tWidth, height: tHeight}"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: 'normal'
    }
  },
  computed: {
    tWidth() {
      switch(this.size) {
        case 'normal':
          return '2px'
        case 'mini':
          return '1px'
      }
    },
    tHeight() {
      switch(this.size) {
        case 'normal':
          return '10px'
        case 'mini':
          return '6px'
      }
    }
  }
}
</script>
<style lang="stylus">

@keyframes loading
  from 
    opacity 1
  50%
    opacity .5
  to 
    opacity 1

#loading
  position relative
  width 100%
  height 100%
  .loading-wrapper
    position absolute
    top 50%
    left 50%
    width 60px
    height 60px
    text-align center
    transform translate3d(-50%, -50%, 0)
    .point
      position absolute
      width 1px
      height 6px
      transform-origin 50% 150%
      background-color #999
      for i in 1 2 3 4 5 6 7 8 9 10 11 12
        &:nth-of-type({i})
          transform rotateZ(i * 30 deg)
          animation loading .6s ((i*.05) s) infinite
</style>