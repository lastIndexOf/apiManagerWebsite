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
                v-for="(group, i) of groups" 
                @click="select(i)" 
                :class="{active: indexPage==i}"
                :key="group.name"
                v-show="group.name.indexOf(searchKey) !== -1"> 
                <div class="img-wrapper">
                  <img src="/apiManagerEndCode/imgs/avatar/default.jpg" width="80" height="80">
                </div>
                <div class="name-wrapper">
                  <p class="name">{{ group.name }}</p>
                </div>
                <div class="chat-sum">{{ group.sum }}</div>
              </li>
            </transition-group>
          </div>
        </div>
        <div class="right">
          <div class="nothing-wrapper" v-if="indexPage === -1">
            请点击群组查看通讯详情
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

export default {
  data() {
    return {
      indexPage: -1,
      message: '',
      searchKey: '',
      groups: [
        {
          id: 1,
          name: '日韩xx交流小组',
          headman: 1,
          sum: 48
        },
        {
          id: 2,
          name: '日韩xx交流小组2',
          headman: 2,
          sum: '99+'
        },
        {
          id: 3,
          name: '日韩xx交流小组3',
          headman: 3,
          sum: 77
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'showTabs',
      'socket',
      'user'
    ])
  },
  methods: {
    ...mapMutations([
      'beBlur',
      'showMenu',
      'notShowMenu',
      'cancelBlur'
    ]),
    select(index) {
      this.indexPage = index

    },
    back(e) {
      this.notShowMenu()
      this.cancelBlur()
      this.$emit('cancelBlur')
      router.replace('/home')
    },
    send() {
      this.socket.emit('send', 'hello, world')
    }
  },
  created() {
    this.beBlur()
    this.showMenu()

    this.socket.on('emit', msg => {
      this.message += msg
    })
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
