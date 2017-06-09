<template>
  <div id="text-wrapper">
    <div class="left-wrapper">
      <h2 class="title">个人备忘录</h2>

      <div class="content-wrapper">
        <div class="main-content">
          <ul class="text-list">
            <li class="text" v-for="item of data" :data-time="item.time">
              <h3 class="text-title">{{ item.title }}</h3>
              <span class="m-title">{{ item.m_title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="right-wrapper">

    </div>
  </div>
</template>
<script>
import swal from 'sweetalert2'

export default {
  data() {
    return {
      data: [
        {
          title: '测试标题1测试标题1测试标题1测试标题1测试标题1测试标题1',
          m_title: '测试注释1测试注释1测试注释1测试注释1测试注释1测试注释1',
          content: '测试内容1测试内容1测试内容1测试内容1测试内容1测试内容1',
          time: '2017-06-09 12:15:85'
        },
        {
          title: '测试标题2',
          m_title: '测试注释2',
          content: '测试内容2',
          time: '2017-06-09 12:15:85'
        },
        {
          title: '测试标题3',
          m_title: '测试注释3',
          content: '测试内容3',
          time: '2017-06-09 12:15:85'
        },
        {
          title: '测试标题4',
          m_title: '测试注释4',
          content: '测试内容4',
          time: '2017-06-09 12:15:85'
        },
      ]
    }
  },
  mounted() {

  }
}
</script>
<style lang="stylus">
#text-wrapper
  width 100%
  height 100%
  font-size 0
  .left-wrapper
  .right-wrapper
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
        padding 24px 41px 24px 24px
        right -17px
        width 100%
        height 90%
        box-sizing border-box
        overflow-y auto
        background-color rgb(250, 255, 189)
        box-shadow -5px 5px 10px #ddd
        .text-list
          width 100%
          height 100%
          .text
            position relative
            width 100%
            height 24px
            cursor pointer
            padding 12px 6px
            text-align left
            &:first-of-type::after
              bottom -42px
              top inherit
            &:first-of-type::before
              bottom -10px
              border 12px solid transparent
              border-bottom 12px solid orange
              top inherit
            &:hover::after, &:hover::before
              opacity 1
              visibility visible
            &::before
              content ''
              position absolute
              top -10px
              right 24px
              width 0
              height 0
              border 12px solid transparent
              border-top 12px solid orange
              visibility hidden
            &::after
              content attr(data-time)
              position absolute
              top -42px
              right 0
              border-radius 12px
              background-color orange
              color #fff
              padding 6px 24px
              box-sizing border-box
              visibility hidden
            &:hover
              background-color #ddd
            .text-title
              display inline-block
              max-width 120px
              margin 0
              padding 0 12px
              line-height 24px
              font-size 18px
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
              @media screen and (min-width: 1440px)
                max-width 180px
            .m-title
              display inline-block
              font-size 12px
              line-height 24px
              max-width 150px
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
              @media screen and (min-width: 1440px)
                max-width 240px
</style>
