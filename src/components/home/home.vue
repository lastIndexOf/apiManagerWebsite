<template>
  <div id="home">
    <homeheader></homeheader>
    <div class="left-menu-tabs" 
      v-show="showTabs">
      <div class="tabs-wrapper" 
        :class="{active: isActive}"
        @mouseover="openTab"
        @mouseleave="closeTab">
        <ul class="tabs">
          <li class="tab">
            <router-link to="/home/new">
              <div class="icon-wrapper" >
                <i class="iconfont icon-new-document"></i>
              </div>
            </router-link>
          </li>
          <li class="tab">
            <router-link to="/home/doc">
              <div class="icon-wrapper" >
                <i class="iconfont icon-chakanwendangjilu"></i>
              </div>
            </router-link>
          </li>
          <li class="tab">
            <router-link to="/home/text">
              <div class="icon-wrapper" >
                <i class="iconfont icon-beiwanglu"></i>
              </div>
            </router-link>
          </li>
          <li class="tab">
            <router-link to="/home/online">
              <div class="icon-wrapper" >
                <i class="iconfont icon-zaixian"></i>
                <span v-if="sum > 0" class="information-sum">{{ sum }}</span>
              </div>
            </router-link>
          </li>
        </ul>
        <div class="open-btn">
          <i class="iconfont icon-zhankai" :class="{active: isActive}"></i>
        </div>
      </div>
    </div>
    <section class="main-content" :class="{ filter: isBlur }">
      <div class="content-wrapper">
        <div class="content">
          <router-link to="/home/new">
            <div class="icon-wrapper" >
              <i class="iconfont icon-new-document"></i>
            </div>
            <p class="desc">新建文档</p>
          </router-link>
        </div>
        <div class="content">
          <router-link to="/home/doc">
            <div class="icon-wrapper" >
              <i class="iconfont icon-chakanwendangjilu"></i>
            </div>
            <p class="desc">查看文档</p>
          </router-link>
        </div>
        <div class="content">
          <router-link to="/home/text">
            <div class="icon-wrapper" >
              <i class="iconfont icon-beiwanglu"></i>
            </div>
            <p class="desc">备忘信息</p>
          </router-link>
        </div>
        <div class="content">
          <router-link to="/home/online">
            <div class="icon-wrapper">
              <i class="iconfont icon-zaixian"></i>
              <span v-if="sum > 0" class="information-sum">{{ sum }}</span>
            </div>
            <p class="desc">在线通讯</p>
          </router-link>
        </div>
      </div>
    </section>
    <transition name="scaleIn">
      <router-view :newMessage="newMessage"></router-view>
    </transition>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import homeheader from '../homeHeader/homeHeader'
import { mapState, mapActions, mapMutations } from 'vuex'
import io from 'socket.io-client'

export default {
  data() {
    return {
      isActive: false,
      newMessage: {}
    }
  },
  computed: {
    ...mapState([
      'isBlur',
      'showTabs',
      'socket',
      'user',
      'groups'
    ]),
    sum() {
      let sum = 0

      for (let group of this.groups) {
        sum += group.sum
      }

      return sum
    }
  },
  methods: {
    ...mapMutations([
      'cancelBlur',
      'setSocket',
      'setGroups',
      'setGroupSum'
    ]),
    openTab() {
      this.isActive = true
    },
    closeTab() {
      this.isActive = false
    }
  },
  created() {
    this.setSocket(io('http://localhost:4040'))

    this.socket.emit('signin', this.user.id, this.user.logouttime)
    this.socket.on('error', err => {
      swal('', err, 'error')
    })
    this.socket.on('accept-sum', groups => {

      this.setGroups(groups)
    })
    this.socket.on('get-new-message', result => {
      for (let group of this.groups) {
        if (group.id == result.group_id)
          this.setGroupSum(group.id)
      }

      this.newMessage = result
    })
    this.socket.on('inserted', result => {
      if (result.code == 200)
        swal('', '分享成功', 'success')
    })
  },
  destroyed() {
    this.socket.removeAllListeners()
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
  text-align center
  .left-menu-tabs
    position fixed
    left 0
    top 10%
    .tabs-wrapper
      position relative
      height 720px
      width 128px
      text-align center
      background-color rgb(20, 45, 59)
      opacity .8
      transition transform .3s
      transform translate3d(-128px, 0, 0)
      z-index 9999
      &.active
        transform translate3d(0, 0, 0)
      .tabs
        .tab
          text-align center
          padding 20px
          .icon-wrapper
            position relative
            display table-cell
            width 80px
            height 80px
            color #fff
            text-align center
            border-radius 50%
            vertical-align middle
            cursor pointer
            transition transform .2s 
            z-index 9999
            .information-sum
              position absolute
              right 0
              top -12px
              border-radius 12px
              background-color red
              padding 2px 8px
              font-size 12px
            &:hover
              transform scale(1.2)
              & + .desc
                transform scale(1.2)
            .iconfont
              font-size 32px
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
      .open-btn
        position absolute
        right -44px
        top 50%
        cursor pointer
        z-index 9999
        .iconfont
          display inline-block
          color #ddd
          line-height 48px
          height 48px
          padding 12px
          font-size 32px
          font-weight 700
          transition transform .3s
          background-color rgb(20, 45, 59)
          &.active
            transform rotateZ(180deg)
  .main-content
    display inline-block
    width 756px
    transition filter .6s
    &.filter
      filter blur(10px)
    margin-top 180px
    .content-wrapper
      display flex
      flex-flow wrap row
      width 756px
      // margin 0 auto
      box-sizing border-box
      justify-content center
      .content
        flex 0 0 125px
        width 125px
        margin-right 64px
        &:last-of-type
          margin-right 0
        .icon-wrapper
          position relative
          display table-cell
          width 125px
          height 125px
          color #fff
          text-align center
          border-radius 36px
          vertical-align middle
          cursor pointer
          transition transform .2s 
          .information-sum
            position absolute
            right 0
            top -12px
            border-radius 12px
            background-color red
            padding 4px 18px
          &:hover
            transform scale(1.2)
            & + .desc
              transform scale(1.2)
          .iconfont
            font-size 56px
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