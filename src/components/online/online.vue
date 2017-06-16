<template>
  <div id="online">
    <close @back="back" color="white" top="12px" left="16px"></close>
    <div class="online-wrapper">
      <div class="online">
        <div class="left">
          <div class="heading">
            <div class="avatar-wrapper">
              <img :src="user.avatar" :alt="user.name" width="90" height="90">
            </div>
            <div class="name-wrapper">
              <div class="desc">
                <p class="name">{{ user.name }}</p>
                <p class="job">{{ user.job }}</p>
              </div>
            </div>
            <div class="search-group">
              <input type="text" placeholder="search group..." v-model="searchKey">
            </div>
          </div>
          <div class="group-wrapper">
            <transition-group name="group" tag="ul" class="groups">
              <li class="group" 
                v-for="group of groups" 
                @click="select(group)" 
                :class="{active: indexPage==group.id}"
                :key="group.name"
                v-show="group.name.indexOf(searchKey) !== -1"> 
                <div class="img-wrapper">
                  <img src="/apiManagerEndCode/imgs/avatar/default.jpg" width="80" height="80">
                </div>
                <div class="name-wrapper">
                  <p class="name">{{ group.name }}</p>
                </div>
                <div class="chat-sum" v-show="group.sum > 0">{{ group.sum }}</div>
              </li>
            </transition-group>
          </div>
        </div>
        <div class="right">
          <div class="nothing-wrapper" v-if="indexPage === -1">
            请点击群组查看通讯详情
          </div>
          <div class="chat-content-wrapper" v-if="indexPage !== -1">
            <div class="top-wrapper" ref="topWrapper">
              <ul class="message-wrapper">
                <li class="message" :class="{mine: info.user.id == user.id}" v-for="info of infos">
                  <div class="time-wrapper">
                    <div class="time">{{ info.time | filterTime }}</div>
                  </div>
                  <div class="chat-content-wrapper">
                    <div class="avatar">
                      <img :src="info.user.avatar" :title="info.user.name + ' ' + info.user.job ">
                    </div>
                    <div class="content">
                      <div class="main">
                        {{ info.content }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="footer-wrapper">
              <textarea placeholder="按ctrl+Enter发送消息" @keydown.ctrl.enter.stop.prevent="sendText" v-model="message"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../../router'
import close from '../close/close'
import swal from 'sweetalert2'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      indexPage: -1,
      message: '',
      searchKey: '',
      infos: []
    }
  },
  props: [ 'newMessage' ],
  computed: {
    ...mapState([
      'showTabs',
      'socket',
      'user',
      'groups'
    ])
  },
  methods: {
    ...mapMutations([
      'beBlur',
      'showMenu',
      'notShowMenu',
      'cancelBlur',
      'removeSum'
    ]),
    sendText() {
      if (!this.message) return swal('', '请不要输入空信息', 'error') 

      this.socket.emit('create-new-message', this.message, this.indexPage)
    },
    select(group) {
      if (this.indexPage === group.id) return

      this.indexPage = group.id

      group.sum = 0
      group.page = 1
      this.infos = []

      this.socket.emit('get-message', this.indexPage, group.page)
    },
    back(e) {
      this.notShowMenu()
      this.cancelBlur()
      this.$emit('cancelBlur')
      router.replace('/home')
    }
  },
  watch: {
    newMessage(n, old) {
      if (n.group_id === this.indexPage) {
        this.infos.push(n)
        this.$nextTick(() => {
          this.$refs.topWrapper.scrollTop = 99999
        })
      }
      if (n.group_id === this.indexPage) {
        this.removeSum()
      }
    }
  },
  created() {
    this.beBlur()
    this.showMenu()

    this.sendMessage = result => {
      this.infos = result
      this.$nextTick(() => {
        this.$refs.topWrapper.scrollTop = 99999 
      }) 
    }

    this.created = result => {
      if (result.code == 200) {
        this.infos.push({
          content: this.message,
          user: this.user,
          time: Date.now(),
          user_id: this.user.id,
          group_id: this.indexPage
        })
        this.message = ''
        this.$nextTick(() => {
          this.$refs.topWrapper.scrollTop = 99999 
        })
      } else {
        swal('', result.msg, 'error')
      }
    }

    this.socket.on('send-message', this.sendMessage)
    this.socket.on('created', this.created)
  },
  destroyed() {
    this.socket.removeListener('send-message', this.sendMessage)
    this.socket.removeListener('created', this.created)
  },
  filters: {
    filterTime(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  components: { close }
}
</script>

<style lang="stylus">
.group-move
  transition all .5s

.group-leave-active, .group-enter
  opacity 0
  transform translate3d(0, 50%, 0)
.group-enter-active, .group-leave-active
  transition all .5s

#online
  position fixed
  top 0
  left 156px
  bottom 0
  right 156px
  padding 24px
  padding-top 56px
  .online-wrapper
    width 100%
    height 100%
    box-sizing border-box
    background-color #fff
    box-shadow 10px 10px 10px rgba(7, 17 ,27, .5)
    .online
      display flex
      flex-flow row nowrap
      width 100%
      height 100%
      .left
        flex 0 0 360px
        width 360px
        background-color rgb(46, 50, 56)
        .group-wrapper
          .groups
            .group
              position relative
              padding 12px 24px 6px
              text-align left
              cursor pointer
              border-bottom 1px solid rgb(38, 41, 46)
              &:hover
                background-color rgb(52, 56, 61)
              &.active
                background-color rgb(67, 70, 76)
              .chat-sum
                position absolute
                top 30px
                right 15px
                color #fff
                width 30px
                height 30px
                font-size 12px
                line-height 20px
                border-radius 50%
                padding 6px
                text-align center
                box-sizing border-box
                background-color #fa3140
              .img-wrapper
                display inline-block
                vertical-align middle
              .name-wrapper
                display inline-block
                .name
                  color #fff
        .heading
          padding 64px 24px 24px
          text-align left
          border-bottom 1px solid rgb(38, 41, 46)
          .avatar-wrapper
            display inline-block
            padding 0 24px 0 0
            vertical-align middle
          .name-wrapper
            display inline-block
            .desc
              color #fff
              font-weight normal
              .name
                font-size 18px
              .job
                padding-top 12px
                font-size 12px
          .search-group
            padding-top 24px
            text-align center
            width 100%
            input
              width 90%
              border 0
              color #fff
              padding 12px
              background-color rgb(38, 41, 46)
      .right
        flex 1
        position relative
        .chat-content-wrapper
          height 100%
          .top-wrapper
            height 70%
            overflow auto
            background-color rgb(238, 238, 238)
            .message-wrapper
              .message
                width 100%
                padding 12px 24px
                min-height 150px
                box-sizing border-box
                .time-wrapper
                  display inline-block
                  color #fff
                  text-align center
                  padding 2px 12px
                  background-color rgb(220, 220, 220)
                .chat-content-wrapper
                  padding-top 12px
                  display flex
                  flex-flow row nowrap
                  .avatar
                    flex 0 0 80px
                    width 80px
                    text-align left
                    img
                      width 60px
                      height 60px
                      cursor pointer
                  .content
                    flex 1
                    text-align left
                    .main
                      position relative
                      display inline-block
                      padding 6px 12px
                      min-height 24px
                      font-size 18px
                      line-height 24px
                      border-radius 6px
                      background-color rgb(250, 250, 250)
                      &::after
                        content ''
                        position absolute
                        left -20px
                        top 10px
                        height 0
                        width 0
                        border 10px solid transparent
                        border-right 10px solid rgb(250, 250, 250)
                &.mine
                  .chat-content-wrapper
                    flex-flow row-reverse nowrap
                    .avatar
                      text-align right
                    .content
                      text-align right
                      .main
                        position relative
                        background-color rgb(178, 226, 129)
                        &::after
                          content ''
                          position absolute
                          left inherit
                          right -20px
                          top 10px
                          height 0
                          width 0
                          border 10px solid transparent
                          border-left 10px solid rgb(178, 226, 129)
          .footer-wrapper
            height 30%
            padding 12px
            box-sizing border-box
            textarea
              border 0
              width 100%
              height 100%
        .nothing-wrapper
          position absolute
          top 50%
          left 50%
          font-size 18px
          font-weight 700
          cursor pointer
          transform translate3d(-50%, -100%, 0)
          &::after
            content ''
            position absolute
            width 120%
            height 100%
            left -16px
            top 36px
            transform rotateZ(-6deg)
            border-top 1px solid #ddd
</style>
