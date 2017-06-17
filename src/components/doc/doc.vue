<template>
  <div id="doc">
    <close @back="back" top="0px" left="0px"></close>
    <div class="doc-wrapper">
      <div class="container-group" v-if="!showApi">
        <div class="group-head">
          <span>群组列表</span>
        </div>
        <div class="group-cont">
          <div class="group-list">
            <ul>
              <li v-for="group in groupList" @click="getDocs(group.id, group.name)">
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
          <i class="icon iconfont icon-tianjia" @click="createDoc()"></i>
        </div>
        <div class="doc-cont">
          <div class="doc-list">
            <ul>
              <li v-for="doc,index in docList" @click="getDocInfor(doc.id,index)">
                <span>{{doc.title}}</span>
                <span style="float: right; margin-right: 15px">{{doc.public_time}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container-api" v-if="showApi">
        <div class="back-group">
          <span @click="showApi = false">返回</span>
        </div>
        <div class="api-cont">
          <div class="head"></div>
          <div class="api-heads">
            <ul>
              <li :class="apiPage==0?'active':''" @click="apiPage = 0; getCommit(1)">群组概况</li>
              <li :class="apiPage==1?'active':''" @click="gotoApiPage()">文档信息</li>
              <li :class="apiPage==2?'active':''" @click="apiPage = 2">api详情</li>
            </ul>
          </div>
          <div class="api-body">
            <transition name="apibodyslide">
            <div class="api-body-group api-infor" v-if="apiPage == 0">
              <div class="group-left">
                <div class="group-title">
                  <i class="icon iconfont icon-qunzu"></i>
                  <span>{{group.name}}</span>
                  <span style="font-size: 17px;float: right;font-weight: 400;margin-right: 10px">群组ID:{{group.id}}</span>
                </div>
                <div class="group-persons">
                  <div class="group-header">
                    <span>组长： {{group.headman}}</span>
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
                      <li v-for="commit in commits">
                        <i></i>
                        <span>{{commit.content}}</span>
                        <span style="margin-left: 10px">{{commit.name}}</span>
                        <span class="commitor">{{commit.time}}</span>
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
                  <span class="type">{{ docType[0] }}</span>
                  <span class="type">{{ docType[1] }}</span>
                </div>
                <div class="doc-desc">
                  <div class="doc-desc-cont">
                    <textarea id="editor3" name="name" rows="20" cols="80">{{ doc.desc }}</textarea>
                  </div>
                </div>
              </div>
              <div class="doc-right">
                <div class="doc-apis">
                  <div class="doc-apis-title">
                    <span>接口列表</span>
                    <i class="icon iconfont icon-tianjia"
                    style="float: right;cursor: pointer"
                      @click="Apidialog = true"
                    ></i>
                  </div>
                  <div class="doc-apis-body">
                    <tr>
                      <th>接口功能</th>
                      <th style="width: 50%;">接口路径</th>
                      <th style="width: 15%;margin-left: 5px;">操作</th>
                    </tr>
                    <div class="doc-api-list">
                      <tr v-for="Api,index in apis"
                          @click="getApiInfor(index, Api.id)"
                          style="cursor: pointer">
                        <td>{{Api.desc}}</td>
                        <td style="width: 50%;"><span class="apiType">{{Api.type}}</span>{{Api.url}}</td>
                        <td style="width: 15%;cursor: pointer"><span @click="deleteApi(index, Api.id)">删除</span></td>
                      </tr>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="api-body-api api-infor" v-if="apiPage == 2 && activeapi">
              <div class="api-title">
                <span class="test">测试</span>
                <div class="api-title-cont">
                  <div class="api-url">
                    <span class="green-back">{{docType[1]}}</span>
                    <span>{{api.url}}</span>
                    <i class="icon iconfont icon-plumage" style="float: left;margin-left: 15px;cursor: pointer" @click="changeApiUrl(api.id)"></i>
                  </div>
                  <div class="api-desc">
                    <span class="green-back">{{api.type}}</span>
                    <span>{{api.desc}}</span>
                    <i class="icon iconfont icon-plumage" style="float: left;margin-left: 15px;cursor: pointer" @click="changeApiName(api.desc)"></i>
                  </div>
                </div>
              </div>
              <div class="api-head" type="table">
                <tr @click="showApiHead = !showApiHead">
                  <th class="col-1" style="font-weight: bold">
                    <i class="icon iconfont icon-zhankai1" v-if="!showApiHead"></i>
                    <i class="icon iconfont icon-shouqi" v-if="showApiHead"></i>
                    头部
                  </th>
                  <th class="col-2">标签</th>
                  <th class="col-2">内容</th>
                  <th class="col-1">操作
                    <i class="icon iconfont icon-xinzeng" style="float: right;font-size: 20px;" @click="addHead()"></i>
                  </th>
                </tr>
                <div class="api-head-shadow" v-if="showApiHead">
                  <tr v-for="apihead, index in apiHeads">
                    <td class="col-1"><span style="margin-left: 15px">{{index+1}}</span></td>
                    <td class="col-2"><select class="" name="" v-model="apihead.head">
                      <option value="0">Accept</option>
                      <option value="1">Accept-Charset</option>
                      <option value="2">Accept-Encoding</option>
                      <option value="3">Accept-Language</option>
                      <option value="4">Accept-Ranges</option>
                      <option value="5">Content-Type</option>
                    </select></td>
                    <td class="col-2"><input type="text" name="" value="" v-model="apihead.name"></td>
                    <td class="col-1"><span style="cursor: pointer" @click="removeHead(index)">删除</span></td>
                  </tr>
                </div>
              </div>
              <div class="api-request">
                <tr @click="showApiRequest = !showApiRequest">
                  <th class="col-1" style="font-weight: bold">
                    <i class="icon iconfont icon-zhankai1" v-if="!showApiRequest"></i>
                    <i class="icon iconfont icon-shouqi" v-if="showApiRequest"></i>请求
                  </th>
                  <th class="col-1">参数</th>
                  <th class="col-1">父参</th>
                  <th class="col-2">类型</th>
                  <th class="col-5">描述</th>
                  <th class="col-2">操作
                    <i class="icon iconfont icon-xinzeng" style="float: right;font-size: 20px;" @click="addRequest()"></i>
                  </th>
                </tr>
                <div class="api-request-shadow" v-if="showApiRequest">
                  <tr v-for="request,index in apiRequests">
                    <td class="col-1">{{index+1}}
                      <span style="padding: 0 5px;background: rgb(88, 219, 77);color:#ffffff;border-radius: 5px;margin-left: 3px"
                      @click="request.required = !request.required">{{request.required}}</span>
                    </td>
                    <td class="col-1"><input type="text" v-model="request.key" style="max-width: 75px"></td>
                    <td class="col-1">{{ request.parent.key }}</td>
                    <td class="col-2">
                      <select class="" name="" v-model="request.type">
                        <option value="0">String</option>
                        <option value="1">Number</option>
                        <option value="2">Object</option>
                        <option value="3">Array</option>
                        <option value="4">Date</option>
                      </select>
                    </td>
                    <td class="col-5"><input type="text" name="" value="" v-model="request.desc"></td>
                    <td class="col-2">
                      <span  @click="removeRequest(index)" style="cursor: pointer">删除</span>
                      <i class="icon iconfont icon-tianjia"
                          style="float: right;margin-right: 20px"
                          @click="addChildRequest(request)"
                          v-if="judgeType(request.type)">
                      </i>
                    </td>
                  </tr>
                </div>
              </div>
              <div class="api-response">
                <tr @click="showApiResponse = !showApiResponse">
                  <th class="col-1" style="font-weight: bold">
                    <i class="icon iconfont icon-zhankai1" v-if="!showApiResponse"></i>
                    <i class="icon iconfont icon-shouqi" v-if="showApiResponse"></i>
                    返回
                  </th>
                  <th class="col-1">参数</th>
                  <th class="col-1">父参</th>
                  <th class="col-2">类型</th>
                  <th class="col-5">描述</th>
                  <th class="col-2">操作
                    <i class="icon iconfont icon-xinzeng" style="float: right;font-size: 20px;" @click="addResponse()"></i>
                  </th>
                </tr>
                <div class="api-response-shadow" v-if="showApiResponse">
                  <tr v-for="response,index in apiResponses">
                    <td class="col-1">{{index+1}}
                      <span style="padding: 0 5px;background: rgb(88, 219, 77);color:#ffffff;border-radius: 5px;margin-left: 3px"
                      @click="response.required = !response.required">{{response.required}}</span>
                    </td>
                    <td class="col-1"><input type="text" name="" value="" v-model="response.key" style="max-width: 150px"></td>
                    <td class="col-1">{{ response.parent.key }}</td>
                    <td class="col-2"><select class="" name="" v-model="response.type">
                      <option value="0">String</option>
                      <option value="1">Number</option>
                      <option value="2">Object</option>
                      <option value="3">Array</option>
                      <option value="4">Date</option>
                    </select></td>
                    <td class="col-5"><input type="text" name="" value="" v-model="response.desc"></td>
                    <td class="col-2">
                      <span @click="removeResponse(index)">删除</span>
                      <i class="icon iconfont icon-tianjia"
                          style="float: right;margin-right: 20px"
                          @click="addChildResponse(response)"
                          v-if="judgeType(response.type)">
                      </i>
                    </td>
                  </tr>
                </div>
              </div>
              <div class="api-foot">
                <span @click="saveParam()">保存参数</span>
                <i class="icon iconfont icon-plumage"></i>
              </div>
            </div>
            <div v-if="apiPage == 2 && !activeapi">
              <p style="padding-top: 100px;font-size: 20px">请先在文档信息页面选择接口（API）</p>
            </div>
          </transition>
            <div class="api-comment" v-if="apiPage == 1">
              <div class="api-comment-head" @click="showCommentPanel()">
                <i class="icon iconfont icon-zhankai-left" v-if="!showComment"></i>
                <i class="icon iconfont icon-zhankai" v-if="showComment"></i>
              </div>
              <transition name="comment-slide" v-if="showComment">
              <div class="api-comment-cont">
                <div class="comment-head-nav">
                  <h4>【评论】</h4>
                </div>
                <div class="api-comment-body">
                  <div class="comment-body-shadow">
                    <ul>
                      <li v-for="comment,index in comments" @click="responseForComment(index, comment.id)">
                        <div class="comment-head">
                          <i>{{index+1}}楼</i>
                          <ul>
                            <li>{{ comment.name }}</li>
                            <li>{{ comment.time }}</li>
                          </ul>
                        </div>
                        <div class="comment-content" v-html="comment.preview">
                        </div>
                        <div class="comment-foot">
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="api-comment-foot">
                  <textarea id="commentEditor" name="name" rows="8" cols="80"></textarea>
                  <div class="comment-foot-commit">
                    <span @click="addComment()">发送</span>
                  </div>
                </div>
              </div>
            </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="dialog">
    <div class="addApiDialog" v-if="Apidialog">
      <div class="dialog-shadow"></div>
      <div class="dialog-content">
        <div class="dialog-title">
          创建接口
          <i class="icon iconfont icon-shanchu" @click="Apidialog = false"></i>
        </div>
        <ul>
          <li>
            <span>类型:</span>
            <select v-model="newApi.type">
              <option value="post">post</option>
              <option value="put">put</option>
              <option value="get">get</option>
              <option value="delete">delete</option>
              <option value="update">update</option>
            </select>
          </li>
          <li>
            <span>路径:</span>
            <input type="text" v-model="newApi.url">
          </li>
          <li>
            <span>描述:</span>
            <input type="text" v-model="newApi.desc">
          </li>
        </ul>
        <div class="dialog-foot">
          <span @click="addApi()">确定</span>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import router from '../../router'
import close from '../close/close'
import swal from 'sweetalert2'
import { mapMutations, mapState } from 'vuex'
import request from 'superagent'
import Vue from 'vue'

export default {
  data() {
    return {
      test: "",
      groupList:[],
      docList: [],
      showApi: false,
      apiPage: 0,
      group: {},
      groupPersons: [],
      commits: [],
      doc: {},
      docType: ["",""],
      apis: [],
      api: {
        desc: "",
        id: "",
        type: "",
        url: ""
      },
      newApi: {
        docsid: "",
        type: "post",
        url: "",
        desc: ""
      },
      apiHeads:[],
      showApiHead: true,
      apiRequests:[],
      showApiRequest: true,
      apiResponses:[],
      showApiResponse: true,
      showComment: false,
      Apidialog: false,
      commentto: "",
      comments: [],
      floor: '',
      activeapi: false,
      key: true
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
    judgeType(type){
      if(type == 2||type == 3){
        return true
      }else{
        return false
      }
    },
    createDoc: function(){
      window.location = "/localhost:8080/#/home/new?id=" + this.group.id + "&name=" + this.group.name
    },
    addHead: function(){
      var self = this
      self.showApiHead = false
      self.apiHeads.push({
        head: 0,
        name: "",
        api_id: self.api.id
      })
    },
    removeHead: function(index){
      var self = this
      self.apiHeads.splice(index,1)
    },
    addRequest: function(){
      var self = this
      self.showApiRequest = false
      self.apiRequests.push({
        api_id: self.api.id,
        parent: "",
        key: "",
        required: true,
        type: 0,
        values: [],
        desc: "",
        children: []
      })
    },
    addChildRequest: function(param){
      var self = this
      self.apiRequests.push({
        parent: param,
        key: "",
        requested: true,
        type: 0,
        values: [],
        desc: "",
        children: []
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
        api_id: self.api.id,
        parent: "",
        key: "",
        required: true,
        type: 0,
        values: [],
        desc: "",
        children: []
      })
    },
    addChildResponse: function(param){
      var self = this
      self.apiResponses.push({
        parent: param,
        key: "",
        responsed: true,
        type: 0,
        values: [],
        desc: "",
        children: []
      })
    },
    removeResponse: function(index){
      var self = this
      self.apiResponses.splice(index,1)
    },
    addApi: function(){
      var self = this
      self.newApi.docsid = self.doc.id
      request
        .post('/apiManagerEndCode/src/apis.php')
        .send(self.newApi)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            self.newApi.id = res.id
            self.apis.push(self.newApi)
            self.newApi = {
              docsid: "",
              type: "post",
              url: "",
              desc: ""
            }
            swal(
              '添加成功',
              '',
              'success'
            )
            self.Apidialog = false
          }
        })
    },
    deleteApi: function(index, id){
      var self = this
      request
        .del('/apiManagerEndCode/src/apis.php')
        .send({
          apisid: id
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            swal(
              '删除成功',
              '',
              'success'
            )
            self.apis.splice(index,1)
          }
        })
    },
    getGroups: function(){
      var self = this
      request
        .get("/apiManagerEndCode/src/group.php")
        .query({
          type: 3,
          page: 1,
          pagesize: 20
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            self.groupList = res.resultList
          }
        })
    },
    getDocs: function(id, name){
      var self = this
      self.group.id = id
      self.group.name = name
      request
        .get("/apiManagerEndCode/src/docs.php")
        .query({
          groupid: id,
          page: 1,
          pagesize: 20
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            self.docList = res.resultList
          }
        })
    },
    getDocInfor: function(id, index){
      var self = this
      request
        .get('/apiManagerEndCode/src/group.php')
        .query({
          type: 1,
          id: self.group.id
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            self.group = res.group
            self.showApi = true
          }
        })
      self.doc = self.docList[index]
      switch(self.doc.type){
        case "00":
          self.docType[0] = "单人文档"
          self.docType[1] = "Web"
          break
        case "10":
          self.docType[0] = "多人文档"
          self.docType[1] = "Web"
      }
      request
        .get('/apiManagerEndCode/src/apis.php')
        .query({
          docsid: id
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            self.apis = res.resultList
            self.showApi = true
          }
        })
      self.getCommit(1)
      self.activeapi = false
      self.apiPage = 0
    },
    gotoApiPage: function(){
      var self = this
      self.apiPage = 1
      self.getComment(1)
      if(self.key){
        this.$nextTick(() => {
          self.editor = new Editor({
            element: document.getElementById('editor3'),
          })
          self.editor.render()
          self.editor.togglePreview()
        })
      }
      self.key = false
    },
    getCommit(page){
      var self = this
      request
        .get('/apiManagerEndCode/src/commit.php')
        .query({
          docsid: self.doc.id,
          page: page,
          pagesize: 20
        })
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(err.msg)
          }else{
            self.commits = res.resultList
          }
        })
    },
    getComment: function(page){
      var self = this
      request
        .get('/apiManagerEndCode/src/comment.php')
        .query({
          docsid: self.doc.id,
          page: page,
          pagesize: 20
        })
        .set('Accept', 'application/x-www-form-urlencoded')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            self.comments = res.resultList
          }
        })
    },
    saveParam: function(){
      var self = this
      var heads = self.apiHeads
      var requests = self.apiRequests
      var responses = self.apiResponses
      var hash = {}
      //头部查重
      for (var i in heads){
        if(hash[heads[i].head]){
          var j = Number(i) + 1
          swal("第"+j+"行头部信息出现重复哦")
          break
        }else{
          hash[heads[i].head] = true
        }
      }
      //参数查重
      if(!self.findRepeat(requests)){
        swal("请仔细检查请求避免出现重复哦")
      }else if(!self.findRepeat(responses)){
        swal("请仔细检查响应避免出现重复哦")
      }else{
        //请求参数数据
        var reqchildren = []
        for (var i in requests){
          var key = 0
          requests[i].children = []
          for (var index = 0; index < i; index ++){
            if(requests[i].parent == requests[index]){
              requests[i].parent = ""
              requests[index].children.push(requests[i])
              key = 1
              break
            }
          }
          if(key == 0){
            requests[i].parent = ""
            reqchildren.push(requests[i])
          }
        }
        //响应参数数据
        var reschildren = []

        for (var i in responses){
          var key = 0
          responses[i].children = []
          for (var index = 0; index < i; index ++){
            if(responses[i].parent == responses[index]){
              responses[i].parent = ""
              responses[index].children.push(responses[i])
              key = 1
            }
          }
          if(key == 0){
            responses[i].parent = ""
            reschildren.push(responses[i])
          }
        }
        swal({
          title: '提交一份修改信息',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: '确定',
          showLoaderOnConfirm: true,
          preConfirm: function (text) {
            return new Promise(function (resolve, reject) {
              setTimeout(function() {
                if (text != '') {
                  request
                    .post('/apiManagerEndCode/src/request_head.php')
                    .send({
                      heads: JSON.stringify(self.apiHeads)
                    })
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .set('Accept', 'application/json')
                    .end(function(err, response){
                      var res = JSON.parse(response.text)
                      if(res.result == 0){
                        swal(res.msg)
                      }else{
                      }
                    })
                  request
                    .post('/apiManagerEndCode/src/api_info.php')
                    .send({
                      children: JSON.stringify(reqchildren)
                    })
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .set('Accept', 'application/json')
                    .end(function(err, response){
                      var res = JSON.parse(response.text)
                      if(res.result == 0){
                        swal(res.msg)
                      }else{
                        swal('添加成功')
                      }
                    })
                  request
                    .post('/apiManagerEndCode/src/response_api.php')
                    .send({
                      children: JSON.stringify(reschildren)
                    })
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .set('Accept', 'application/json')
                    .end(function(err, response){
                      var res = JSON.parse(response.text)
                      if(res.result == 0){
                        swal(res.msg)
                      }else{
                      }
                    })
                  request
                    .post('/apiManagerEndCode/src/commit.php')
                    .send({
                      docsid: self.doc.id,
                    	userid: self.user.id,
                    	content: text
                    })
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .end(function(err, response){
                      var res = JSON.parse(response.text)
                      if(res.result == 0){
                        swal(res.msg)
                      }else{
                        swal("修改成功")
                      }
                    })
                } else {
                  resolve()
                }
              }, 2000)
            })
          },
          allowOutsideClick: false
        })
      }
    },
    findRepeat: function(params){
      for(var i in params){
        for (var j = 0; j < i; j++){
          if(params[i].key == params[j].key&&params[i].parent == params[j].parent){
            return false
          }
        }
      }
      return true
    },
    addComment(){
      var self = this
      var content = self.editor2.codemirror.getValue()
      self.editor2.togglePreview()
      var preview = document.querySelectorAll('.editor-preview')[1].innerHTML
      if(this.floor != ""){
        content = "回复"+ self.floor + "楼:" + content
        preview = "<p>回复"+ self.floor + "楼:<p>" + preview
      }
      request
        .post('/apiManagerEndCode/src/comment.php')
        .send({
          docsid: self.doc.id,
          content: content,
          preview: preview,
          from: "",
          comment_id: self.commentto
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            swal(
              '留言成功',
              '',
              'success'
            )
            document.querySelectorAll('.editor-preview')[1].innerHTML = ""
            document.querySelectorAll('.CodeMirror-code')[1].innerText = ""
            self.editor2.togglePreview()
            self.comments.push(res.comment)
            self.commentto = ""
            self.floor = ""
          }
        })
    },
    getApiInfor: function(index,id){
      var self = this
      self.apiPage = 2
      self.api = self.apis[index]
      self.activeapi =true
      request
        .get('/apiManagerEndCode/src/api_info.php')
        .query({
          api_id: id
        })
        .set('Content-Tyoe', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            for(var i in res.resultList){
              if(res.resultList[i].parent != ""){
                for(var j = 0; j < i; j++){
                  if(res.resultList[i].parent == res.resultList[j].id){
                    res.resultList[i].parent = res.resultList[j]
                    self.apiRequests.push(res.resultList[i])
                    break
                  }
                }
              }else{
                self.apiRequests.push(res.resultList[i])
              }
            }
          }
        })
      request
        .get('/apiManagerEndCode/src/request_head.php')
        .query({
          type: 1,
          api_id: id
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            self.apiHeads = res.resultList
          }
        })
      request
        .get('/apiManagerEndCode/src/response_api.php')
        .query({
          api_id: id
        })
        .set('Content-Tyoe', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/json')
        .end(function(err, response){
          var res = JSON.parse(response.text)
          if(res.result == 0){
            swal(res.msg)
          }else{
            for(var i in res.resultList){
              if(res.resultList[i].parent != ""){
                for(var j = 0; j < i; j++){
                  if(res.resultList[i].parent == res.resultList[j].id){
                    res.resultList[i].parent = res.resultList[j]
                    self.apiResponses.push(res.resultList[i])
                    break
                  }
                }
              }else{
                self.apiResponses.push(res.resultList[i])
              }
            }
          }
        })
    },
    responseForComment: function(index, id){
      var floor = Number(index) + 1
      this.editor2.togglePreview()
      document.querySelectorAll('.CodeMirror-code')[1].getElementsByTagName('pre')[0].innerHTML = "@回复"+ floor +"楼:"
      document.querySelectorAll('.editor-preview')[1].innerHTML = "@回复"+ floor +"楼:"
      this.commentto = id
      this.floor = floor
    },
    showCommentPanel: function(){
      var self = this
      this.showComment = !this.showComment
      this.$nextTick(()=>{
        self.editor2 = new Editor({
          element: document.getElementById('commentEditor'),
        })
        self.editor2.render()
        self.editor2.togglePreview()
      })
    }
  },
  created() {
    this.beBlur()
    this.showMenu()
  },
  mounted() {
    var self = this
    self.getGroups()
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
        padding: 5px
        text-align: right
        float: right
        position: absolute
        z-index: 999
        bottom: 30px
        right: 50px
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
            background: #fff
          .active
            border-right: none
            box-shadow: 0 0 5px rgb(189, 189, 189)
        .api-body
          width: 100%
          height: 100%
          // background: linear-gradient(to bottom right,rgb(227, 224, 152), rgb(210, 197, 106), rgb(177, 176, 66))
          border-bottom-right-radius: 20px 300px
          box-shadow: 0 0 5px rgb(0, 0, 0)
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
                height: 90%
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
                text-align: left
                .type
                  padding: 2px 5px
                  font-size: 15px
                  font-weight: 400
                  border-radius: 10px
                  background-color: rgb(111, 252, 82)
                  color: #ffffff
              .doc-desc
                width: 90%
                height: 600px
                margin: 0 auto
                padding: 10px
                text-align: left
                border: 1px solid rgb(185, 185, 185)
                overflow: hidden
                .doc-desc-cont
                  width: 100%
                  height: 100%
                  overflow: auto
                  textarea
                    background: rgba(0,0,0,0)
                    border: none
                    width: 100%
                    height: 100%
                  .CodeMirror.cm-s-paper
                    height: 500px
            .doc-right
              flex: 0 0 50%
              .doc-apis
                width: 95%
                height: 90%
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
                  height: 710px
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
                    height: 100%
                    overflow: auto
        .api-body-api
          padding-top: 10px
          .api-title
            width: 91%
            height: 60px
            line-height: 60px
            border-bottom: 1px solid rgb(120, 120, 120)
            box-shadow: 0 0 2px rgb(69, 139, 163)
            margin: 22px auto
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
              margin-top: 5px
              width: 103%
              height: 100%
              overflow: auto
              height: 130px
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
            .col-5
              width: 40%
          .api-request-shadow
            width: 103%
            height: 100%
            overflow: auto
            margin-top: 5px
            height: 180px
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
              .col-5
                width: 40%
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
            .col-5
              width: 40%
          .api-response-shadow
            width: 103%
            height: 100%
            overflow: auto
            height: 180px
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
              .col-5
                width: 40%
        .api-comment
          background: #ffffff
          position: absolute
          height: 100%
          top: 0
          right: 0
          border-radius: 10px
          .api-comment-head
            width: 30px
            height: 50px
            line-height: 50px
            position: absolute
            left: -30px
            top: 50%
            margin-top: -25px
            border-radius: 50px 0 0 50px
            background: rgba(0, 0, 0, .3)
            text-indent: 5px
            i
              font-size: 25px
              color: #ffffff
          .api-comment-cont
            width: 400px
            height: 100%
            box-shadow: 0 0 5px rgb(88, 88, 88) inset
            text-align: center
            .comment-head-nav
              height: 5%
              background: rgb(77, 77, 77)
              color: #ffffff
              line-height: 280%
            .api-comment-body
              width: 99%
              height: 70%
              margin 0 auto
              overflow: hidden
              box-shadow: 0 0 10px rgb(77, 77, 77) inset
              .comment-body-shadow
                width: 102%
                height: 100%
                overflow-y: auto
                overflow-x: hidden
                ul
                  width: 100%
                  li
                    width: 96%
                    margin: 20px auto
                    .comment-head
                      width: 100%
                      text-align: left
                      width: 100%
                      i
                        width: 40px
                        height: 40px
                        border-radius: 20px
                        background: rgb(123, 178, 238)
                        color: #ffffff
                        display: inline-block
                        line-height: 40px
                        text-align: center
                        float: left
                      ul
                        margin-left: 20px
                        height: 40px
                        li
                          margin: 0
                          margin-left: 30px
                    .comment-content
                      width: 90%
                      margin-left: 20px
                      box-shadow: 0 -2px 3px rgb(150, 150, 150) inset
                      text-align: left
                      padding: 5px 10px
                      border-radius: 15px
            .api-comment-foot
              width: 99%
              height: 25%
              margin: 0 auto
              .CodeMirror.cm-s-paper
                height: 130px
                text-align: left
              .CodeMirror-code
                text-align: left
              .CodeMirror-preview
                text-align: left
              textarea
                width: 100%
                height: 100%
                border: none
                text-align: left
              .comment-foot-commit
                height: 30px
                margin: -33px auto
                line-height: 30px
                text-align: left
                span
                  padding: 10px
                  border-radius: 10px
                  cursor: pointer
      .api-foot
        margin-top: 20px
        width: 90%
        text-align: right
        span
          cursor: pointer
  .addApiDialog
    width: 100%
    height: 100%
    position: relative
    top: -100%
    .dialog-shadow
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, .5)
      z-index: 999
    .dialog-content
      width: 300px
      height: 300px
      position: absolute
      left: 0
      top: 0
      background: #ffffff
      z-index: 999
      left: 50%
      top: 50%
      margin-top: -150px
      margin-left: -150px
      border-radius: 10px
      box-shadow: 0 0 10px rgb(238, 220, 155)
      .dialog-title
        margin-top: 20px
        font-size: 19px
        i
          position: absolute
          right: 15px
          top: 5px
          font-size: 10px
          cursor: pointer
      ul
        margin-top: 20px
        li
          width: 100%
          height: 30px
          margin-top: 10px
          span
            margin-right: 15px
          input
            border-radius: 5px
            border: 1px solid rgb(200, 200, 200)
          select
            width: 172px
            border-radius: 5px
            outline: none
            background: rgba(0, 0, 0, 0)
      .dialog-foot
        width: 100%
        height: 30px
        margin-top: 30px
        span
          padding: 5px 10px
          border: 1px solid rgb(193, 194, 193)
          border-radius: 5px
          cursor: pointer
          &:hover
            background: #fa3140
            color: #ffffff
.comment-slide-enter-active, .comment-slide-leave-active
  transition: all 0s
.comment-slide-enter, .comment-slide-leave-active
  right: -300px
.dialog-enter-active, .dialog-leave-active
  transition: all .5s cubic-bezier(.42,-0.26,.72,1.4)
.dialog-enter, .dialog-leave-active
  transform: scale(0)
  opacity: 0
.apibodyslide-enter-active, .apibodyslide-leave-active
  transition: all .5s
.apibodyslide-enter, .apibodyslide-leave-active
  transform: translateX(100px)
  opacity: 0
</style>
