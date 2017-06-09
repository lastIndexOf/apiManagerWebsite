<template>
  <div id="sign">
    <div class="main-wrapper">
      <div class="signin-wrapper">
        <h1 class="title">登录</h1>
        <form>
          <div class="form-control" :class="{yellow: isYellow}">
            <input class="username" :class="{yellow: isYellow}" type="text" placeholder="用户名/邮箱/手机号" v-model="username">
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
        <div class="signup" @click="signup">注册新账号</div>
      </div>
    </div>
  </div>
</template>
<script>
import loading from '../loading/loading'
import router from '../../router'
import swal from 'sweetalert2'
import request from 'superagent'

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
    _getType() {
      if (/^1[0-9]{10}$/.test(this.username))
        return 1
      
      if (/^[\w\W]+@[\w\W]+.com$/.test(this.username))
        return 2
      
      return 0
    },
    signin() {
      this.isSigned = true

      const type = this._getType()
      request.post('/apiManagerEndCode/src/user.php')
        .type('form')
        .query({
          type: 1
        })
        .send({
          type,
          username: this.username,
          password: this.password
        })
        .end((err, res) => {
          if (err) {
            this.isSigned = false
            swal('', '出错了:(', 'error')
          }
          else {
            const data = JSON.parse(res.text)

            if (data.result == 1) {
              setTimeout(() => {
                this.isSigned = false
                router.replace('/home')
              }, 1000)
            } else if (data.result == 0) {
              setTimeout(() => {
                this.isSigned = false
                swal('', data.msg, 'error')
              }, 1000)
            }
          }
        })
    },
    _valiInput(data) {
      if (!/^([a-zA-Z])[^@]{7,}/.test(data.username.value)) {
        swal('', '请输入以字母开头，至少为7位且不包含@的用户名', 'warning')
        return false
      }

      if (data.repeat.value !== data.password.value) {
        swal('', '请确保两次输入密码相同', 'warning')
        return false
      }

      if (!/[\w\W]{7,}/.test(data.password.value)) {
        swal('', '请输入至少为7为的密码', 'warning')
        return false
      }

      if (!/^[\w\W]+@[\w\W]+.com$/.test(data.email.value)) {
        swal('', '请输入正确的邮箱地址', 'warning')
        return false
      }

      if (!/^1[0-9]{10}$/.test(data.phone.value)) {
        swal('', '请输入正确的11位电话号码', 'warning')
        return false
      }

      return true
    },
    signup() {
      const self = this

      swal({
        title: '新账号注册',
        html:
          '<form id="signup-form">' +
            '<input type="text" name="username" class="swal2-input" placeholder="用户名"/>' + 
            '<input type="password" name="password" class="swal2-input" placeholder="密码"/>' + 
            '<input type="password" name="repeat" class="swal2-input" placeholder="重复密码"/>' + 
            '<input type="email" name="email" class="swal2-input" placeholder="邮箱"/>' +
            '<input type="text" name="phone" class="swal2-input" placeholder="电话"/>' +
          '</form>',
        confirmButtonText: '注册',
        showLoaderOnConfirm: true,
        preConfirm() {
          return new Promise((resolve, reject) => {
            const form = document.querySelector('#signup-form').elements

            if (self._valiInput(form))
              request.post('/apiManagerEndCode/src/user.php')
                .type('form')
                .query({
                  type: 0
                })
                .send({
                  username: form.username.value,
                  password: form.password.value,
                  email: form.email.value,
                  phone: form.phone.value
                })
                .end((err, res) => {
                  if (err)
                    console.error(err)

                  else {
                    const data = JSON.parse(res.text)

                    if (data.result == 1) {
                      resolve()
                    } else {
                      reject(data.msg)
                    }
                  }
                })
            else
              reject()
          })
        }
      }).then(() => {
        swal('', '注册成功！:)', 'success')
      }).catch(msg => {
        if (msg === 'signup wrong')
          swal('', '注册失败:(, 请稍后再试', 'wrong')
      })
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
      .signup
        margin-top 24px
        display inline-block
        color #fff
        padding 12px 24px
        cursor pointer
        &:hover
          color #fa3140
</style>