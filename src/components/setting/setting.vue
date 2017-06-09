<template>
  <div id="setting">
    <div class="close-wrapper">
      <close :top="top" @back="back"></close>
    </div>
    
    <div class="main-content-wrapper">
      <div class="left">
        <div class="avatar">
          <img :src="user.avatar" :alt="user.username" width="150" height="150">
          <input class="select-file" type="file">
        </div>
        <ul class="tabs-wrapper">
          <li class="tab personal" :class="{active: pageIndex === 0}" @click="pageIndex = 0">个人信息</li>
          <li class="tab" :class="{active: pageIndex === 1}" @click="pageIndex = 1">待定</li>
          <li class="tab" :class="{active: pageIndex === 2}" @click="pageIndex = 2">待定</li>
          <li class="tab" :class="{active: pageIndex === 3}" @click="pageIndex = 3">待定</li>
        </ul>

        <a class="signout" href="javascript:;" @click="signout">退出登录</a>
      </div>
      <div class="right">
        <div class="personal" v-if="pageIndex===0">
          <h3 class="title">个人信息</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import close from '../close/close'
import router from '../../router'
import request from 'superagent'
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      pageIndex: 0
    }
  },
  props: {
    top: {
      default: '64px'
    }
  },
  computed: {
    ...mapState([
      'user',
      'isBlur'
    ])
  },
  methods: {
    ...mapMutations([
      'cancelBlur'
    ]),
    back() {
      this.cancelBlur()
      this.$emit('cancelSetting')
    },
    signout() {
      request.get('/apiManagerEndCode/src/user.php?type=3')
        .end((err, res) => {
          if (err)
            console.error(err)
          else {
            if (JSON.parse(res.text).result === 1)
              window.location.href = '/'
          }
        })
    }
  },
  components: { close }
}
</script>
<style lang="stylus">
$flexWidth = 300px

#setting
  .main-content-wrapper
    display flex
    flex-flow row nowrap
    .left
      flex 0 0 $flexWidth
      width $flexWidth
      margin-top 96px
      text-align center
      border-right 1px solid #ddd
      .avatar
        position relative
        width 150px
        margin 0 auto
        &:hover::after
          opacity 1
          visibilety visible
        &::after
          content '更换头像'
          position absolute
          top 0
          left 0
          width 150px
          height 150px
          color #fff
          line-height 150px
          border-radius 50%
          opacity 0
          visibilety hidden
          transition all .3s
          background-color rgba(7, 17, 27, .5)
        .select-file
          position absolute
          width 150px
          height 150px
          top 0
          left 0
          cursor pointer
          opacity 0
          z-index 9999
        img
          border-radius 50%
      .tabs-wrapper
        padding 24px 96px
        .tab
          font-size 18px
          padding 12px
          border-bottom 1px solid #ddd
          cursor pointer
          &.active
            color #fa3140
          &:hover
            color #fa3140
      .signout
        display inline-block
        margin-top 128px
        padding 6px 18px
        background-color #fa3140
        color #fff
        cursor pointer
        &:hover
          opacity .8
    .right 
      flex 1
      width 100%
      height 100%
      padding-left 32px
</style>