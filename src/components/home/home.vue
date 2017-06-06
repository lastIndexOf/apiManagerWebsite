<template>
  <div id="home">
    <homeheader></homeheader>
    <section class="main-content" :class="{ filter: isBlur }">
      <div class="content-wrapper">
        <div class="content">
          <div class="icon-wrapper" >
            <i class="iconfont icon-new-document"></i>
          </div>
          <p class="desc">新建文档</p>
        </div>
        <div class="content">
          <div class="icon-wrapper" >
            <i class="iconfont icon-chakanwendangjilu"></i>
          </div>
          <p class="desc">查看文档</p>
        </div>
        <div class="content">
          <div class="icon-wrapper" >
            <i class="iconfont icon-lixian"></i>
          </div>
          <p class="desc">备忘信息</p>
        </div>
        <div class="content">
          <div class="icon-wrapper">
            <i class="iconfont icon-zaixian"></i>
          </div>
          <p class="desc">在线通讯</p>
        </div>
      </div>
    </section>
    <transition name="scaleIn">
      <router-view @cancelBlur="cancelBlur"></router-view>
    </transition>
  </div>
</template>
<script>
import homeheader from '../homeHeader/homeHeader'
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'isBlur'
    ])
  },
  methods: {
    ...mapActions([
      'cancelBlur'
    ])
  },
  components: { homeheader }
}
</script>
<style lang="stylus">
.scaleIn-enter-active
  transform-origin center
  transition all .4s
.scaleIn-leave-active
  transition all .4s
  transform scale(1.2)
  opacity 0
.scaleIn-enter
  opacity 0
  transform scale(0)

#home
  .main-content
    transition filter .6s
    &.filter
      -webkit-filter blur(10px)
    margin-top 180px
    .content-wrapper
      display flex
      flex-flow wrap row
      width 756px
      margin 0 auto
      box-sizing border-box
      justify-content center
      .content
        flex 0 0 125px
        width 125px
        margin-right 64px
        &:last-of-type
          margin-right 0
        .icon-wrapper
          width 125px
          height 125px
          border-radius 36px
          text-align center
          display table-cell
          vertical-align middle
          cursor pointer
          color #fff
          transition transform .2s 
          &:hover
            transform scale(1.2)
            & + .desc
              transform scale(1.2)
          .iconfont
            font-size 48px
        .desc
          margin-top 32px
          color #fff
          font-weight 600
          text-align center
          transition transform .2s
        &:first-of-type
          .icon-wrapper
            background-color rgb(241, 153, 72)
        &:nth-of-type(2)
          .icon-wrapper
            background-color rgb(19, 192, 72)
        &:nth-of-type(3)
          .icon-wrapper
            background-color rgb(43, 141, 208)
        &:nth-of-type(4)
          .icon-wrapper
            background-color rgb(248, 76, 53)
</style>