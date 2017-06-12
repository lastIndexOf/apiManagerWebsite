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
          <div class="api-heads">
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
                <div class="doc-type">
                  <div class="doc-type-cont1">
                    <span>{{doc.type[0]}}</span>
                  </div>
                  <div class="doc-type-cont2">
                    <span>{{doc.type[1]}}</span>
                  </div>
                </div>
                <div class="doc-desc">
                  <div class="doc-desc-cont">
                    <textarea id="editor" name="name" rows="20" cols="80">{{doc.desc}}</textarea>
                  </div>
                </div>
              </div>
              <div class="doc-right">
                <div class="doc-apis">
                  <div class="doc-apis-title">
                    <span>接口列表</span>
                  </div>
                  <div class="doc-apis-body">
                    <tr>
                      <th>接口功能</th>
                      <th style="width: 50%;">接口路径</th>
                      <th style="width: 15%;margin-left: 5px;">操作</th>
                    </tr>
                    <div class="doc-api-list">
                      <tr v-for="api in apis">
                        <td>{{api.desc}}</td>
                        <td style="width: 50%;"><span class="apiType">{{api.type}}</span>{{api.url}}</td>
                        <td style="width: 15%;cursor: pointer"><span>删除</span></td>
                      </tr>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="api-body-api api-infor" v-if="apiPage == 2">
              <div class="api-title">
                <span class="test">测试</span>
                <div class="api-title-cont">
                  <div class="api-url">
                    <span class="green-back">{{doc.type[1]}}</span>
                    <span>{{api.url}}</span>
                    <i class="icon iconfont icon-plumage" style="float: left;margin-left: 15px;cursor: pointer"></i>
                  </div>
                  <div class="api-desc">
                    <span class="green-back">{{api.type}}</span>
                    <span>{{api.desc}}</span>
                    <i class="icon iconfont icon-plumage" style="float: left;margin-left: 15px;cursor: pointer"></i>
                  </div>
                </div>
              </div>
              <div class="api-head" type="table">
                <tr  @click="showApiHead = !showApiHead">
                  <th class="col-1"><i class="icon iconfont icon-zhankai1" v-if="!showApiHead"></i><i class="icon iconfont icon-shouqi" v-if="showApiHead"></i>头部</th>
                  <th class="col-2">标签</th>
                  <th class="col-2">内容</th>
                  <th class="col-1">操作 <i class="icon iconfont icon-xinzeng" style="float: right;font-size: 20px;" @click="addHead()"></i></th>
                </tr>
                <div class="api-head-shadow">
                  <tr v-for="apihead, index in apiHeads" v-if="showApiHead">
                    <td class="col-1"><span style="margin-left: 15px">{{index+1}}</span></td>
                    <td class="col-2"><select class="" name="">
                      <option value="">Accept</option>
                      <option value="">Accept-Charset</option>
                      <option value="">Accept-Encoding</option>
                      <option value="">Accept-Language</option>
                      <option value="">Accept-Ranges</option>
                    </select></td>
                    <td class="col-2"><input type="text" name="" value=""></td>
                    <td class="col-1"><span style="cursor: pointer" @click="removeHead(index)">删除</span></td>
                  </tr>
                </div>
              </div>
              <div class="api-request">
                <tr @click="showApiRequest = !showApiRequest">
                  <th class="col-1"><i class="icon iconfont icon-zhankai1" v-if="!showApiRequest"></i><i class="icon iconfont icon-shouqi" v-if="showApiRequest"></i>请求</th>
                  <th class="col-2">参数</th>
                  <th class="col-2">类型</th>
                  <th class="col-2">值域</th>
                  <th class="col-3">描述</th>
                  <th class="col-2">操作 <i class="icon iconfont icon-xinzeng" style="float: right;font-size: 20px;" @click="addRequest()"></i></th>
                </tr>
                <div class="api-request-shadow">
                  <tr v-for="request,index in apiRequests" v-if="showApiRequest">
                    <td class="col-1">{{index+1}}<span style="padding: 0 5px;background: rgb(88, 219, 77);color:#ffffff;border-radius: 5px;margin-left: 3px" @click="request.requested = !request.requested">{{request.requested}}</span></td>
                    <td class="col-2"><input type="text" name="" value="" v-model="request.param" style="max-width: 150px"></td>
                    <td class="col-2"><select class="" name="">
                      <option value="">String</option>
                      <option value="">Number</option>
                      <option value="">Object</option>
                      <option value="">Array</option>
                      <option value="">Date</option>
                    </select></td>
                    <td class="col-2"><input type="text" name="" value="" v-model="values" style="max-width: 150px"></td>
                    <td class="col-3"><input type="text" name="" value="" v-model="request.desc"></td>
                    <td class="col-2"><span  @click="removeRequest(index)">删除</span></td>
                  </tr>
                </div>
              </div>
              <div class="api-response">
                <tr @click="showApiResponse = !showApiResponse">
                  <th class="col-1"><i class="icon iconfont icon-zhankai1" v-if="!showApiResponse"></i><i class="icon iconfont icon-shouqi" v-if="showApiResponse"></i>返回</th>
                  <th class="col-2">参数</th>
                  <th class="col-2">类型</th>
                  <th class="col-2">值域</th>
                  <th class="col-3">描述</th>
                  <th class="col-2">操作 <i class="icon iconfont icon-xinzeng" style="float: right;font-size: 20px;" @click="addResponse()"></i></th>
                </tr>
                <div class="api-response-shadow">
                  <tr v-for="response,index in apiResponses" v-if="showApiResponse">
                    <td class="col-1">{{index+1}}<span style="padding: 0 5px;background: rgb(88, 219, 77);color:#ffffff;border-radius: 5px;margin-left: 3px" @click="response.responsed = !response.responsed">{{response.responsed}}</span></td>
                    <td class="col-2"><input type="text" name="" value="" v-model="response.param" style="max-width: 150px"></td>
                    <td class="col-2"><select class="" name="">
                      <option value="">String</option>
                      <option value="">Number</option>
                      <option value="">Object</option>
                      <option value="">Array</option>
                      <option value="">Date</option>
                    </select></td>
                    <td class="col-2"><input type="text" name="" value="" v-model="values" style="max-width: 150px"></td>
                    <td class="col-3"><input type="text" name="" value="" v-model="response.desc"></td>
                    <td class="col-2"><span @click="removeResponse(index)">删除</span></td>
                  </tr>
                </div>
              </div>
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
        type: ["多人文档","web"]
      },
      apis: [
        {
          desc: "user增",
          id: "121212",
          type: "POST",
          url: "/tourplace/src/user.php"
        }
      ],
      api: {
        desc: "user增加",
        id: "121212",
        type: "POST",
        url: "/tourplace/src/user.php"
      },
      apiHeads:[
        {
          desc: "sdfsd"
        }
      ],
      showApiHead: false,
      apiRequests:[
        {
          param: "id",
          requested: true,
          type: 0,
          values: [],
          desc: "这是个测试参数"
        }
      ],
      showApiRequest: true,
      apiResponses:[
        {
          param: "id",
          responsed: true,
          type: 0,
          values: [],
          desc: "这是个测试返回参数"
        }
      ],
      showApiResponse: true
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
    },
    addHead: function(){
      var self = this
      self.showApiHead = false
      self.apiHeads.push({desc: "dasda"})
    },
    removeHead: function(index){
      var self = this
      self.apiHeads.splice(index,1)
    },
    addRequest: function(){
      var self = this
      self.showApiRequest = false
      self.apiRequests.push({
        param: "",
        requested: true,
        type: 0,
        values: [],
        desc: "这是个测试参数"
      })
    },
    removeRequest: function(index){
      var self = this
      self.apiRequests.splice(index,1)
    },
    addResponse: function(){
      var self = this
      self.showApiResponse = false
      self.apiResponses.push({
        param: "",
        responsed: true,
        type: 0,
        values: [],
        desc: "这是个测试参数"
      })
    },
    removeResponse: function(index){
      var self = this
      self.apiResponses.splice(index,1)
    }
  },
  created() {
    this.beBlur()
    this.showMenu()
  },
  mounted() {
    var self = this
    self.$nextTick(() => {
      self.editor = new Editor({
        element: document.getElementById('editor'),
      })
      self.editor.render()
    })
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
        float: right
        z-index: 999
        span
          font-size: 20px
          cursor: pointer
      .api-cont
        width: 100%
        height: 100%
        margin: 0px auto
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
        .api-heads
          width: 30px
          position: absolute
          left: -30px
          bottom: 0
          font-weight: bold
          font-size: 16px
          background: rgba(0, 0, 0, 0)
          li
            padding: 5px 0
            border: 1px solid rgb(184, 184, 184)
            cursor: pointer
            border-radius: 5px
            background: rgb(236, 221, 123)
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
              .doc-type
                width: 90%
                height: 60px
                margin: 0 auto 10px
                line-height: 60px
                font-size: 17px
                .doc-type-cont1
                  width: 40%
                  height: 30px
                  padding: 5px
                  border: 1px solid rgb(185, 185, 185)
                  float: left
                  line-height: 30px
                .doc-type-cont2
                  width: 40%
                  height: 30px
                  padding: 5px
                  border: 1px solid rgb(185, 185, 185)
                  float: left
                  margin-left: 30px
                  line-height: 30px
              .doc-desc
                width: 90%
                height: 480px
                margin: 0 auto
                padding: 10px
                text-align: left
                border: 1px solid rgb(185, 185, 185)
                overflow: hidden
                .doc-desc-cont
                  width: 101%
                  height: 200px
                  overflow: auto
                  textarea
                    width: 100%
                    height: 200px
            .doc-right
              flex: 0 0 50%
              .doc-apis
                width: 95%
                height: 94%
                border: 1px solid rgb(185, 185, 185)
                margin: 20px auto
                text-align: left
                .doc-apis-title
                  width: 90%
                  margin: 20px auto
                  font-size: 20px
                  padding: 10px
                  border-bottom: 1px solid rgb(185, 185, 185)
                  text-align: left
                .doc-apis-body
                  width: 90%
                  height: 550px
                  margin: 0 auto
                  overflow: hidden
                  tr
                    width: 100%
                    display: block
                    height: 30px
                    th
                      width: 30%
                      display: inline-block
                    td
                      width: 30%
                      display: inline-block
                      overflow: hidden
                      .apiType
                        padding: 2px
                        background-color: rgb(94, 221, 78)
                        color: #ffffff
                        border-radius: 5px
                        font-size: 13px
                  .doc-api-list
                    width: 105%
                    height: 530px
                    overflow: auto
        .api-body-api
          padding-top: 10px
          .api-title
            width: 91%
            height: 60px
            line-height: 60px
            border-bottom: 1px solid rgb(120, 120, 120)
            box-shadow: 0 0 2px rgb(69, 139, 163)
            margin: 10px auto
            .test
              display: block
              height: 55px
              width: 55px
              float: left
              margin-top: 2px
              margin-left: 5px
              border-radius: 5px
              background: linear-gradient(to bottom, rgb(122, 232, 78), rgb(100, 209, 56), rgb(122, 232, 78))
              box-shadow: 0 0 2px rgb(18, 241, 27)
              color: #ffffff
              font-size: 17px
              cursor: pointer
              &:active
                opacity: .5
            .api-title-cont
              width: 85%
              height: 55px
              float: left
              margin-top: 2px
              .api-url
                width: 100%
                height: 50%
                float: left
                line-height: 27px
                span
                  display: block
                  height: 25px
                  float: left
                  margin-left: 5px
                .green-back
                  width: 55px
                  background: rgb(73, 179, 74)
                  border-radius: 5px
                  color: #ffffff
              .api-desc
                width: 100%
                height: 50%
                float: left
                line-height: 27px
                span
                  display: block
                  height: 25px
                  float: left
                  margin-left: 5px
                .green-back
                  width: 55px
                  background: rgb(73, 179, 74)
                  border-radius: 5px
                  color: #ffffff
          .api-head
            width: 90%
            margin: 0 auto
            padding: 5px
            border-bottom: 1px solid rgb(120, 120, 120)
            box-shadow: 0 0 2px rgb(69, 139, 163)
            max-height: 150px
            overflow: hidden
            tr
              width: 100%
              display: block
              text-align: left
              th
                display: inline-block
              .col-1
                width: 16%
              .col-2
                width: 32%
              .col-3
                width: 48%
            .api-head-shadow
              width: 102%
              height: 100%
              overflow: auto
              max-height: 150px
              tr
                width: 100%
                display: block
                text-align: left
                td
                  display: inline-block
                  select
                    background: rgba(0, 0, 0, 0)
                    outline: none
                    border: none
                  input
                    background: rgba(0, 0, 0, 0)
                    outline: none
                    border: none
        .api-request
          width: 90%
          margin: 10px auto
          padding: 5px
          border-bottom: 1px solid rgb(120, 120, 120)
          box-shadow: 0 0 2px rgb(69, 139, 163)
          max-height: 200px
          overflow: hidden
          tr
            display: block
            width: 100%
            text-align: left
            th
              display: inline-block
            .col-1
              width: 8%
            .col-2
              width: 16%
            .col-3
              width: 24%
          .api-request-shadow
            width: 102%
            height: 100%
            overflow: auto
            max-height: 200px
            tr
              display: block
              width: 100%
              text-align: left
              td
                display: inline-block
                input
                  background: rgba(0, 0, 0, 0)
                  border: none
                select
                  background: rgba(0, 0, 0, 0)
                  border: none
                  outline: none
              .col-1
                width: 8%
              .col-2
                width: 16%
              .col-3
                width: 24%
        .api-response
          width: 90%
          margin: 10px auto
          padding: 5px
          border-bottom: 1px solid rgb(120, 120, 120)
          box-shadow: 0 0 2px rgb(69, 139, 163)
          max-height: 200px
          overflow: hidden
          tr
            display: block
            width: 100%
            text-align: left
            th
              display: inline-block
            .col-1
              width: 8%
            .col-2
              width: 16%
            .col-3
              width: 24%
          .api-response-shadow
            width: 102%
            height: 100%
            overflow: auto
            max-height: 200px
            tr
              display: block
              width: 100%
              text-align: left
              td
                display: inline-block
                input
                  background: rgba(0, 0, 0, 0)
                  border: none
                select
                  background: rgba(0, 0, 0, 0)
                  border: none
                  outline: none
              .col-1
                width: 8%
              .col-2
                width: 16%
              .col-3
                width: 24%

</style>
