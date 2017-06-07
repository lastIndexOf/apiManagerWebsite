<template>
  <div id="sign">
    <div class="main-wrapper">
      <div class="signin-wrapper">
        <h1 class="title">登录</h1>
        <form>
          <div class="form-control" :class="{yellow: isYellow}">
            <input class="username" :class="{yellow: isYellow}" type="text" placeholder="用户名/邮箱" v-model="username">
          </div>
          <div class="form-control" :class="{yellow: isYellowt}">
            <input class="password" :class="{yellow: isYellowt}" type="password" placeholder="密码" v-model="password">
            <span class="enter">
              <i class="iconfont icon-denglu" @click="signin" v-show="!isSigned"></i>
              <div class="loading-wrapper" v-show="isSigned">
                <loading :size="'mini'"></loading>
              </div>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import loading from '../loading/loading'
import router from '../../router'

export default {
  data() {
    return {
      username: '',
      password: '',
      isSigned: false
    }
  },
  computed: {
    isYellow() {
      if (this.username)
        return true
      return false
    },
    isYellowt() {
      if (this.password)
        return true
      return false
    }
  },
  methods: {
    signin() {
      this.isSigned = true

      setTimeout(() => {
        this.isSigned = false

        router.push('/home')
      }, 1000)
    }
  },
  components: { loading } 
}
</script>
<style lang="stylus">
#sign
  width 100%
  height 100%
  text-align center
  .main-wrapper
    .signin-wrapper
      padding-top 15%
      .title
        color #fff
        padding-bottom 48px
        text-align center
        font-size 18px
        font-weight normal
      form
        .form-control
          display table
          width 320px
          margin 0 auto
          background-color #fff
          text-align left
          padding 6px 0
          box-sizing border-box
          &.yellow
            background-color rgb(250, 255, 189)
          &:first-of-type
            border-top-left-radius 6px
            border-top-right-radius 6px
            border-bottom 1px solid #ddd
          &:nth-of-type(2)
            border-bottom-left-radius 6px
            border-bottom-right-radius 6px
          .username
            width 320px
            border 0
            padding 0 6px
            box-sizing border-box
            &.yellow
              background-color rgb(250, 255, 189)
          .password
            width 290px
            border 0
            padding 0 6px
            box-sizing border-box
            &.yellow
              background-color rgb(250, 255, 189)
          .enter
            display inline-block
            position relative
            width 30px
            box-sizing border-box
            text-align center
            cursor pointer
            .iconfont
              line-height 24px
              font-size 24px
            .loading-wrapper
              position absolute
              bottom -24px
              right 0
              width 38px
              height 38px
              z-index 999
</style>