<template>
  <div id="setting">
    <div class="close-wrapper">
      <close :top="top" @back="back"></close>
    </div>
    
    <div class="main-content-wrapper">
      <div class="left">
        <div class="avatar">
          <img :src="user.avatar" :alt="user.username" width="150" height="150">
          <input class="select-file" type="file" @change="changeAvatar">
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
          <h3 class="title">个人信息 <span class="edit" @click.stop.prevent="edit">修改</span></h3>

          <div class="personal-wrapper">
            <form>
              <div class="form-control">
                <label for="name">姓名</label>
                <input type="text" name="name" v-model="name" placeholder="例如: 李月辉">
              </div>
              <div class="form-control">
                <label for="job">职位</label>
                <input type="text" name="job" v-model="job" placeholder="例如: java开发工程师">
              </div>
            </form>
          </div>
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
import swal from 'sweetalert2'

export default {
  data() {
    return {
      pageIndex: 0,
      name: '',
      job: ''
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
      'isBlur',
      'user'
    ])
  },
  methods: {
    ...mapMutations([
      'cancelBlur',
      'setAvatar',
      'setInformation'
    ]),
    edit() {
      request.post('/apiManagerEndCode/src/user.php?type=2')
        .type('form')
        .send({
          userid: this.user.id,
          username: this.user.username,
          password: this.user.password,
          email: this.user.email,
          phone: this.user.phone,
          name: this.name,
          job: this.job
        })
        .end((err, res) => {
          if (err)
            console.error(err)
          else {
            const data = JSON.parse(res.text)

            if (data.result == 1) {
              swal({
                target: "#setting",
                text: '修改成功',
                type: 'success'
              })

              this.setInformation([this.name, this.job])
            }
          }
        })
    },
    changeAvatar(e) {
      const self = this

      this.filereader.onload = function() {
        request.post('/apiManagerEndCode/src/user.php?type=5')
          .type('form')
          .send({
            avatar: this.result
          })
          .end((err, res) => {
            if (err)
              console.error(err)
            else {
              const data = JSON.parse(res.text)

              if (data.result == 1) {
                swal({
                  target: "#setting",
                  text: '修改头像成功',
                  type: 'success'
                })
                self.setAvatar(this.result)
              } else {
                swal({
                  target: "#setting",
                  text: data.msg,
                  type: 'error'
                })
              }
            }
          })
      }

      this.filereader.readAsDataURL(e.target.files[0])
    },
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
            if (JSON.parse(res.text).result === 1) {
              this.cancelBlur()
              window.location.href = '/'
            }
          }
        })
    }
  },
  mounted() {
    this.name = this.user.name
    this.job = this.user.job
  },
  created() {
    this.filereader = new FileReader()
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
          z-index 99
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
      padding-top 64px
      .personal
        padding 12px
        .title
          padding 12px
          text-align left
          font-size 20px
          font-weight normal
          .edit
            float right
            font-size 12px
            cursor pointer
            margin-right 32px
            &:hover
              color #fa3140
        .personal-wrapper
          padding 32px
          text-align left
          .form-control
            width 100%
            margin-bottom 24px
            label
              display inline-block
              padding 12px 24px
              background-color rgb(243, 245, 247)
            input
              border 0
              padding 12px
              border-bottom 1px solid #ddd
              min-width 70%
</style>