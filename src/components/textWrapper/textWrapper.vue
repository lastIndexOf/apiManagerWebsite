<template>
  <div id="text-wrapper">
    <div class="left-wrapper">

      <h2 class="title">
        个人备忘录 
        <span
          class="add-new-text" 
          title="新增备忘信息"
          @click="addText"> 
          <i class="iconfont icon-xinzeng1"></i>
        </span>
      </h2>

      <div class="content-wrapper">
        <div class="main-content">
          <ul class="text-list">
            <li class="text"
              v-for="item of data"
              :data-time="item.time"
              @click.stop.prevent="enterText(item)"
              :class="{active: activeId == item.id}">
              <div class="item-wrapper">
                <h3 class="text-title">{{ item.title }}</h3>
                <p class="desc">
                  <time class="time">{{ item.time }}</time>
                  <span class="m-title">{{ item.mtitle }}</span>
                </p>
                <div class="remove-text" @click="removeText(item.id)" title="删除"><i class="iconfont icon-shanchu"></i></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="nothing-wrapper" v-if="showAddText">
        请点击备忘信息查看详情
      </div>
      <transition name="fade">
        <div class="text-content" v-if="showText">
          <h3 class="title">
            <span class="icon">标题: </span> 
            <input type="text" v-model="oldText.title" :title="oldText.title" ref="title" >
          </h3>
          <h4 class="m-title" v-if="submitType!=='POST'">
            <time>修改时间: {{ oldText.time }}</time>
          </h4>
          <h4 class="m-title">
            <span class="icon">注释: </span>
            <input type="text"
              v-model="oldText.mtitle" 
              :title="oldText.mtitle" 
              ref="mTitle"
              placeholder="注释信息">
          </h4>
          <div class="desc">
            <div class="content">
              <textarea id="editor" v-model="oldText.content" ref="text" >{{ oldText.content }}</textarea>
              <div class="group-share" @click="shareGroup" title="分享到群组"><i class="iconfont icon-qunzu"></i></div>
            </div>
          </div>
          <div @click="editText" class="edit" title="修改"><i class="iconfont icon-bianji"></i></div>
        </div>
      </transition>
    </div>

    <div class="group-wrapper" v-show="showGroup">
      <ul class="groups">
        <li class="group" v-for="group of groups" @click="share(group.id)"> 
          {{ group.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import request from 'superagent'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      editType: 0,
      data: [],
      activeId: 0,
      showText: false,
      showAddText: true,
      text: {},
      oldText: {},
      submitType: 'GET',
      showGroup: false
    }
  },
  computed: {
    ...mapState([
      'user',
      'groups',
      'socket'
    ])
  },
  methods: {
    refresh(func) {
      this.data = []

      request.get('/apiManagerEndCode/src/note.php')
        .type('form')
        .query({
          type: 5,
          page: 1,
          pagesize: 9999
        })
        .end((err, res) => {
          if (err)
            console.error(err)
          else {
            this.data = JSON.parse(res.text).notes.reverse()

            func && func()
          }
        })
    },
    addText() {
      this.submitType = 'POST'

      this.showAddText = false
      this.showText = false

      this.editType = 0
      this.oldText = {}
      this.$nextTick(() => {
        this.showText = true
        this.$nextTick(() => {
          this.editor = new Editor({
            element: document.querySelector('#editor')
          })
        })
      })

    },
    removeText(id) {
      request.del('/apiManagerEndCode/src/note.php')
        .type('form')
        .send({
          type: 1,
          id
        })
        .end((err, res) => {
          if (err)
            console.error(err)
          else {
            const result = JSON.parse(res.text)

            if (result.result == 1) {
              swal('', '删除成功', 'success')
              this.oldText = {}
              this.refresh()
            }
            else {
              swal('', result.msg, 'error')
            }
          }
        })
    },
    shareGroup() {
      this.showGroup = !this.showGroup
    },
    share(id) {
      this.socket.emit('create-new-message', this.oldText.preview, id, 1)
    },
    enterText(item) {
      this.activeId = item.id

      this.editType = 1
      this.submitType = 'PUT'
      this.showAddText = false

      this.text = item

      for (let key in item) {
        this.oldText[key] = item[key]
      }
      this.showText = false
      this.$nextTick(() => {
        this.showText = true
        this.$nextTick(() => {
          this.editor = new Editor({
            element: document.querySelector('#editor')
          })
        })
      })
    },
    editText() {
      console.log(this.oldText)
      if (this.editType === 0) {
        this.editor.togglePreview()

        request.post('/apiManagerEndCode/src/note.php')
          .type('form')
          .send({
            userid: this.user.id,
            content: this.editor.codemirror.getValue(),
            title: this.oldText.title,
            m_title: this.oldText.mtitle,
            preview: document.querySelector('.editor-preview').innerHTML
          })
          .end((err, res) => {
            if (err)
              console.error(er)
            else {
              if (JSON.parse(res.text).result == 1) {
                const self = this

                this.refresh(function() {
                  self.enterText(self.data[0])
                })
              }
            }
          })
      } else {
        this.editor.togglePreview()

        request.put('/apiManagerEndCode/src/note.php')
          .type('form')
          .send({
            id: this.oldText.id,
            content: this.editor.codemirror.getValue(),
            title: this.oldText.title,
            m_title: this.oldText.mtitle,
            preview: document.querySelector('.editor-preview').innerHTML
          })
          .end((err, res) => {
            if (err)
              console.error(err)
            else {
              console.log(res)
              this.refresh()
            }
          })
      }
    }
  },
  created() {
    this.refresh()
  },
  mounted() {

  }
}
</script>
<style lang="stylus">
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p,blockquote,th,td{line-height:1}


.fade-enter-active
  transition all .6s
  transform translate3d(0, 0, 0)
  opacity 1
.fade-enter
  opacity 0
  transform translate3d(120px, 0, 0)

#text-wrapper
  width 100%
  height 100%
  font-size 0
  .group-wrapper
    position fixed
    top 60%
    bottom 20%
    left 70%
    right 15%
    overflow auto
    z-index 9999
    background-color #fff
    box-shadow 2px 2px 10px #ddd, -2px -2px 10px #ddd
    .groups
      height 100%
      .group
        padding 12px
        font-size 14px
        cursor pointer
        box-shadow 0 0 5px #ddd inset, -2px -2px 5px #ddd  inset 
  .CodeMirror.cm-s-paper
    max-height 100%
  .left-wrapper, .right-wrapper
    vertical-align top
    display inline-block
    width 50%
    height 100%
    font-size 14px
    box-sizing border-box
  .left-wrapper
    padding 64px 32px 32px
    box-shadow -4px -10px 100px #ddd inset
    .title
      margin 0 64px
      padding 24px
      font-size 18px
      text-align left
      border-bottom 1px solid #ddd
      .add-new-text
        float right
        cursor pointer
        .iconfont
          font-size 24px
    .content-wrapper
      position relative
      width 60%
      height 80%
      dispaly inline-block
      margin 24px auto 12px
      padding 12px 64px
      overflow hidden
      box-shadow 2px 2px 10px #ddd, -2px -2px 10px #ddd
      .main-content
        position absolute
        margin-top 24px
        right -17px
        width 100%
        height 90%
        padding-right 17px
        overflow hidden
        box-sizing border-box
        overflow-y auto
        background-color #fff
        box-shadow -5px 5px 10px #ddd
        .text-list
          width 100%
          height 100%
          .text
            position relative
            width 100%
            cursor pointer
            padding 18px 18px 0 32px
            text-align left
            &:hover
              background-color rgb(250, 255, 189)
            &.active
              background-color rgb(250, 255, 189)
            .item-wrapper
              position relative
              border-bottom 1px solid #ddd
              .text-title
                max-width 120px
                margin 0
                padding 0 12px
                font-size 20px
                font-weight normal
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
                padding-bottom 12px
                @media screen and (min-width: 1440px)
                  max-width 180px
              .remove-text
                position absolute
                right 36px 
                top 0
                padding 12px
                &:hover
                  .iconfont
                    color #fa3140
              .desc
                padding-left 12px
                .time
                  font-size 12px
                .m-title
                  display inline-block
                  font-size 12px
                  color #999
                  line-height 24px
                  max-width 150px
                  white-space nowrap
                  vertical-align bottom
                  overflow hidden
                  text-overflow ellipsis
                  @media screen and (min-width: 1440px)
                    max-width 240px
  .right-wrapper
    padding 36px
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
    .text-content
      position relative
      text-align left
      height 100%
      .title
        display flex
        flex-flow row nowrap
        .icon
          flex 0 0 48px
          width 48px
          line-height 48px
        input
          flex 1
          width 100%
          padding 0 12px
          border 0
          font-size 24px
          font-weight 700
          box-sizing border-box
          border-bottom 1px solid #ddd
      .m-title
        display flex
        flex-flow row nowrap
        width 100%
        padding-top 12px 18px 0
        .icon
          flex 0 0 48px
          width 48px
          line-height 28px
        time
          display inline-block
          vertical-align top
          line-height 28px
        input
          flex 1
          display inline-block
          border 0
          padding 6px 6px 6px 0
          line-height 1
          border-bottom 1px solid #ddd
      .desc
        padding 8px
        height 90%
        .content
          position relative
          height 90%
          padding 12px
          box-shadow 2px 2px 10px #ddd inset, 2px 2px 10px #ddd 
          textarea
            border 0  
            width 100%
            height 100%
            font-size 20px
          .group-share
            position absolute
            bottom 10%
            right 5%
            cursor pointer
            .iconfont
              font-size 24px
      .edit
        position absolute
        top -24px
        right -12px
        cursor pointer
        .iconfont
          font-size 24px
    // background-color rgb(250, 255, 189)
</style>