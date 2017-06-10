<template>
  <div id="doc">
    <close @back="back"></close>
    <div class="doc-wrapper">
      <div class="container-group" v-if="!showApi">
        <div class="group-head">
          <span>群组列表</span>
        </div>
        <div class="group-cont">
          <div class="group-list">
            <ul>
              <li v-for="group in groupList">
                <span>{{group.name}}</span>
                <i class="icon iconfont icon-bianji"></i>
                <i>发起人：{{group.headman}}</i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container-doc" v-if="!showApi">
        <div class="doc-head">
          <span>文档列表</span>
          <i class="icon iconfont icon-tianjia"></i>
        </div>
        <div class="doc-cont">
          <div class="doc-list">
            <ul>
              <li v-for="doc in docList">
                <span>{{doc.title}}</span>
                <i></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container-api" v-if="showApi">
        <div class="back-group">
          <span @click="showApi = false">返回群组列表</span>
        </div>
        <div class="api-cont">
          <div class="head"></div>
          <div class="api-head">
            <ul>
              <li :class="apiPage==0?'active':''" @click="apiPage = 0">群组概况</li>
              <li :class="apiPage==1?'active':''" @click="apiPage = 1">文档信息</li>
              <li :class="apiPage==2?'active':''" @click="apiPage = 2">api详情</li>
            </ul>
          </div>
          <div class="api-body">
            <div class="api-body-group api-infor" v-if="apiPage == 0">
              <div class="group-left">
                <div class="group-title">
                  <i class="icon iconfont icon-qunzu"></i>
                  <span>{{group.title}}</span>
                  <span style="font-size: 17px;float: right;font-weight: 400;margin-right: 10px">群组ID:{{group.id}}</span>
                </div>
                <div class="group-persons">
                  <div class="group-header">
                    <span>组长： {{group.groupHeader}}</span>
                  </div>
                  <div class="group-others">
                    <ul>
                      <li v-for="person in groupPersons">成员：{{person}}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="group-right">
                <div class="group-dynamic">
                  <div class="group-dynamic-title">
                    <i class="icon iconfont icon-dongtai"></i>
                    <span>群组动态</span>
                  </div>
                  <div class="group-dynamic-body">
                    <transition name="aslide">
                    <ul>
                      <li v-for="commit in dynamics">
                        <i></i>
                        <span>{{commit.content}}</span>
                        <span class="commitor">{{commit.person}}</span>
                      </li>
                    </ul>
                  </transition>
                  </div>
                </div>
              </div>
            </div>
            <div class="api-body-doc api-infor" v-if="apiPage == 1">
              <div class="doc-left">
                <div class="doc-title">
                  <span>{{doc.title}}</span>
                  <span style="font-size: 17px;float: right;font-weight: 400;margin-right: 10px">文档ID:{{group.id}}</span>
                </div>
                <div class="doc-desc">
                  <div class="doc-desc-shadow">
                    <div class="doc-desc-cont">
                      {{doc.desc}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="doc-right">

              </div>
            </div>
            <div class="api-body-api api-infor" v-if="apiPage == 2">

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


export default {
  data() {
    return {
      groupList:[
        {
          id: 111,
          name: "郑凡凯是..你懂得",
          headman: "zfkss"
        }
      ],
      docList: [
        {
          docsid: "",
          title: "这是测试文档1",
          type: "10"
        }
      ],
      showApi: true,
      apiPage: 0,
      group: {
        id: "11111",
        title: "没脸没皮无敌小组",
        groupHeader: "llx"
      },
      groupPersons: ["lll","lll"],
      dynamics: [
        {
          content: "2017/6/22",
          person: "adasda"
        }
      ],
      doc: {
        id: "1321313212",
        title: "这是测试文档",
        desc: "这是文档的描述",
      }
    }
  },
  computed: {
    ...mapState([
      'showTabs'
    ])
  },
  methods: {
    ...mapMutations([
      'beBlur',
      'showMenu',
      'notShowMenu',
      'cancelBlur'
    ]),
    back(e) {
      this.notShowMenu()
      this.cancelBlur()
      this.$emit('cancelBlur')
      router.replace('/home')
    }
  },
  created() {
    this.beBlur()
    this.showMenu()
  },
  mounted() {

  },
  components: { close }
}
</script>

<style lang="stylus">
#doc
  position fixed
  top 0
  left 156px
  bottom 0
  right 156px
  padding 24px
  padding-top 56px
  .doc-wrapper
    width 100%
    height 100%
    box-sizing border-box
    background-color #fff
    box-shadow 10px 10px 10px rgba(7, 17 ,27, .5)
    display: flex
    flex-flow: row nowrap
    justify-content: center
    .container-group
      flex: 0 0 50%
      box-shadow: 0 0 70px rgb(87, 87, 87) inset
      border-bottom-right-radius: 500px 0px
      border-right: 1px solid rgb(158, 157, 157)
      .group-head
        width: 85%
        margin: 50px auto
        text-align: left
        font-size: 20px
      .group-cont
        width: 80%
        margin: 20px auto
        font-size: 15px
        .group-list
          width: 100%
          height: 640px
          overflow: hidden
          box-shadow: 0 0 5px rgb(255, 255, 255) inset
          ul
            height: 655px
            overflow: auto
            width: 101%
            li
              width: 100%
              text-align: left
              padding: 5px
              border-bottom: 1px solid rgb(195, 195, 195)
              margin-top: 7px
              cursor: pointer
              :hover
                color: rgb(31, 31, 31)
              i
                float: right
                margin-right: 10px
    .container-doc
      flex: 0 0 50%
      box-shadow: 0 0 40px rgb(87, 87, 87) inset
      .doc-head
        width: 85%
        margin: 50px auto
        text-align: left
        font-size: 20px
        i
          float: right
          font-size: 22px
          margin-right: 20px
      .doc-cont
        width: 80%
        margin: 20px auto
        font-size: 15px
        .doc-list
          width: 100%
          height: 640px
          overflow: hidden
          box-shadow: 0 0 5px rgb(255, 255, 255) inset
          ul
            height: 655px
            overflow: auto
            width: 101%
            li
              width: 100%
              text-align: left
              padding: 5px
              border-bottom: 1px solid rgb(195, 195, 195)
              margin-top: 7px
              cursor: pointer
              &:hover
                color: rgb(31, 31, 31)
              i
                float: right
                margin-right: 10px
    .container-api
      flex: 0 0 100%
      .back-group
        width: 90%
        height: 30px
        margin: 30px auto 0
        padding: 5px
        text-align: right
        span
          font-size: 20px
          cursor: pointer
      .api-cont
        width: 90%
        height: 85%
        margin: 15px auto
        position: relative
        .head
          width: 10%
          height: 25px
          background: rgba(255, 255, 255, .5)
          position: absolute
          transform: rotate(-5deg)
          top: -15px
          left: 50%
          margin-left: -5%
          box-shadow: 0 0 5px rgb(119, 119, 119)
        .api-head
          width: 30px
          position: absolute
          left: -30px
          bottom: 0
          font-weight: bold
          font-size: 16px
          background: white
          li
            padding: 5px 0
            border: 1px solid rgb(184, 184, 184)
            cursor: pointer
            border-radius: 5px
          .active
            border-right: none
            box-shadow: 0 0 5px rgb(189, 189, 189)
        .api-body
          width: 100%
          height: 100%
          background: linear-gradient(to bottom right,rgb(227, 224, 152), rgb(210, 197, 106), rgb(177, 176, 66))
          border-bottom-right-radius: 20px 300px
          box-shadow: 0 0 5px rgb(189, 189, 189)
          .api-infor
            width: 100%
            height: 100%
          .api-body-group
            display: flex
            flex-flow: row nowrap
            justify-content: center
            .group-left
              flex: 0 0 50%
              .group-title
                width: 90%
                height: 60px
                margin: 20px auto
                font-size: 20px
                font-weight: bold
                line-height: 60px
                padding: 10px
                border: 1px solid rgb(185, 185, 185)
                text-align: left
                i
                  font-size: 22px
              .group-persons
                width: 90%
                height: 77%
                margin: 10px auto
                border: 1px solid rgb(185, 185, 185)
                text-align: left
                padding: 10px
                .group-header
                  width: 98%
                  height: 30px
                  line-height: 30px
                  margin: 0 auto
                  border-bottom: 1px solid rgb(233, 245, 174)
                .group-others
                  width: 98%
                  height: 500px
                  margin: 20px auto
                  overflow: auto
                  li
                    width: 100%
                    padding: 1px 0
            .group-right
              flex: 0 0 50%
              .group-dynamic
                width: 90%
                height: 94%
                border: 1px solid rgb(185, 185, 185)
                margin: 20px auto
                text-align: left
                .group-dynamic-title
                  width: 95%
                  margin: 10px
                  font-size: 17px
                  border-bottom: 1px solid rgb(187, 169, 70)
                  padding-bottom: 20px
                  i
                    font-size: 20px
                .group-dynamic-body
                  width: 95%
                  font-size: 15px
                  margin: 0 auto
                  li
                    height: 30px
                    line-height: 30px
                    border-left: 2px solid rgb(114, 152, 193)
                    position: relative
                    text-indent: 20px
                    i
                      width: 10px
                      height: 10px
                      border-radius: 10px
                      position: absolute
                      left: -6px
                      bottom: 37%
                      background-color: rgb(143, 210, 83)
                      z-index: 99
                    .commitor
                      float: right
                      margin-right: 20px
          .api-body-doc
            display: flex
            flex-flow: row nowrap
            justify-content: center
            .doc-left
              flex: 0 0 50%
              .doc-title
                width: 90%
                height: 60px
                margin: 20px auto
                font-size: 20px
                font-weight: bold
                line-height: 60px
                padding: 10px
                border: 1px solid rgb(185, 185, 185)
                text-align: left
              .doc-desc
                width: 90%
                height: 300px
                margin: 0 auto
                padding: 10px
                text-align: left
                border: 1px solid rgb(185, 185, 185)
            .doc-right
              flex: 0 0 50%

</style>
