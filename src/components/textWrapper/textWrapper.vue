<template>
  <div id="text-wrapper">
    <div class="left-wrapper">

      <h2 class="title">个人备忘录 <span class="add-new-text" title="新增备忘信息"><i class="iconfont icon-xinzeng1"></i></span></h2>

      <div class="content-wrapper">
        <div class="main-content">
          <ul class="text-list">
            <li class="text"
              v-for="item of data"
              :data-time="item.time"
              @click.stop.prevent="enterText(item.id)"
              :class="{active: activeId == item.id}">
              <div class="item-wrapper">
                <h3 class="text-title">{{ item.title }}</h3>
                <p class="desc">
                  <time class="time">{{ item.time }}</time>
                  <span class="m-title">{{ item.m_title }}</span>
                </p>
              </div>
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
          id: 1,
          title: '测试标题1测试标题1测试标题1测试标题1测试标题1测试标题1',
          m_title: '测试注释1测试注释1测试注释1测试注释1测试注释1测试注释1测试注释1',
          content: '测试内容1测试内容1测试内容1测试内容1测试内容1测试内容1',
          time: '2017-06-09 12:15:85'
        },
        {
          id: 2,
          title: '测试标题2',
          m_title: '测试注释2',
          content: '测试内容2',
          time: '2017-06-09 12:15:85'
        },
        {
          id: 3,
          title: '测试标题3',
          m_title: '测试注释3',
          content: '测试内容3',
          time: '2017-06-09 12:15:85'
        },
        {
          id: 4,
          title: '测试标题4',
          m_title: '测试注释4',
          content: '测试内容4',
          time: '2017-06-09 12:15:85'
        },
      ],
      activeId: 0
    }
  },
  methods: {
    enterText(id) {
      this.activeId = id
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
</style>
