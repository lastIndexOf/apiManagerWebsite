<template>
  <div id="new">
    <close @back="back"></close>
    <div class="new-wrapper">
      <transition name="fade">
      <div class="doc_infor" v-if="showDoc">
        <div class="head"></div>
        <h1 class="create_title">新增文档</h1>
        <ul>
          <li>
            <span>文档标题：</span>
            <input type="text" name="title" value="" placeholder="输入文档标题" v-model="doc.title">
          </li>
          <li>
            <span>文档类型：</span>
            <span class="group_num">{{resultName[0]}}</span>
            <span class="doc_type">{{resultName[1]}}</span>
          </li>
          <li>
            <span>文档描述：</span>
            <textarea id="editor" class="intro" name="name" rows="8" cols="72" v-model="doc.docIntro"></textarea>
          </li>
          <li>
            <span>一个新的群组：</span>
            <input type="text" name="" v-model="newGroup" value="" placeholder="输入群组名称">
          </li>
          <li style="position: relative;" v-if="docType[0] == '1'">
            <span>群组成员：</span>
            <div class="group-person">
              <span v-for="person in persons">
                {{person.username}}
                <i class="icon iconfont icon-shanchu" @click="removeArray(persons, person.username)"></i>
              </span>
              <input type="text" name="" value="" v-model="newPerson.username" placeholder="输入项目成员，‘enter’键添加" @keydown.13="addPerson()">
            </div>
          </li>
        </ul>
        <div class="ensure">
          <span class="createBtn" @click="createGroup()">创建</span>
          <i class="icon iconfont icon-plumage"></i>
        </div>
      </div>
      </transition>
    </div>
  </div>
</template>

<script>
import router from '../../router'
import close from '../close/close'
import swal from 'sweetalert2'
import { mapMutations, mapState } from 'vuex'
import request from 'superagent'

export default {
  data() {
    return {
      docType: ["0","0"],
      resultName: ["单人文档","web"],
      showDoc: false,
      persons: [],
      newPerson: {
        userid: "",
        username: ""
      },
      newGroup: "",
      newGroupID: "",
      doc: {
        title: "",
        docIntro: "",
      }
    }
  },
  computed: {
    ...mapState([
      'showTabs',
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
    back(e) {
      this.notShowMenu()
      this.cancelBlur()
      this.$emit('cancelBlur')
      router.replace('/home')
    },
    addPerson: function(){
      var self = this
      self.persons.push(self.newPerson)
      self.newPerson = {}
      //获取人物信息
    },
    createDoc: function(){
      var self = this
      swal.setDefaults({
        input: 'select',
        confirmButtonText: '下一步 &rarr;',
        showCancelButton: true,
        animation: true,
        progressSteps: ['1', '2']
      })
      var steps = [
        {
          title: '创建文档',
          text: '多人文档or单人文档',
          inputOptions:{
            '0': '单人群组',
            '1': '多人群组'
          }
        },
        {
          title: '创建文档',
          text: '选择文档类型',
          inputOptions:{
            '0': 'web'
          }
        }
      ]
      swal.queue(steps).then(function (result) {
        swal.resetDefaults()
        self.docType = result
        if(result[0] == 0){
          self.resultName[0] = "单人文档"
        }else{
          self.resultName[0] = "多人文档"
        }
        switch(result[1]){
          case "0": self.resultName[1] = "web";
          default: break;
        }
        swal({
          title: '创建成功',
          html:
            '你的文档类型: <pre>' +
              JSON.stringify(self.resultName) +
            '</pre>',
          confirmButtonText: '确定',
          showCancelButton: false
        }).then(() => {
          self.showDoc = true

          self.$nextTick(() => {
            self.editor = new Editor({
              element: document.getElementById('editor'),
            })
            self.editor.render()
          })
        })
      }).then(function(){
        }, function () {
          swal.resetDefaults()
        })
    },
    removeArray: function(arr, val){
      for (var i = 0; i < arr.length; i ++){
        if (arr[i].username == val){
          arr.splice(i, 1)
          break
        }
      }
    },
    createGroup: function(){
      var self = this
      var ids = []
      ids.push(this.user.id)
      for(i in self.persons){
        ids.push(self.persons[i].id)
      }
      if (self.doc.title == ""){
        swal("文档标题不能为空哦")
      }else if(self.editor.codemirror.getValue() == ""){
        swal("文档描述不能为空哦")
      }else if(self.newGroup == ""){
        swal("必须为文档建立一个群组")
      }else{

        request
          .post('/apiManagerEndCode/src/group.php')
          .send({
            name: self.newGroup,
            // ids: ids.join("+")
            ids: 9
          })
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Accept', 'application/json')
          .end(function(err, response){
            var res = JSON.parse(response.text)
            if(res.result == 1){
              self.newGroupID = res.id
              request
                .post('/apiManagerEndCode/src/docs.php')
                .send({
                  title: self.doc.title,
                  type: self.docType.join(""),
                  desc: self.editor.codemirror.getValue(),
                  groupid: self.newGroupID
                })
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Accept', 'application/json')
                .end(function(err, response){
                  var res = JSON.parse(response.text)
                  if(res.result == 1){
                    swal(
                      '创建成功',
                      '',
                      'success'
                    )
                  }else if(res.result == 0){
                    swal(res.msg)
                  }else{
                    swal(err)
                  }
                })
            }else if(res.result == 0){
              swal("失败了" +　res.msg)
            }else{
              swal("发生了未知的错误")
            }
          })
      }
    }
  },
  created() {
    this.beBlur()
    this.showMenu()
  },
  mounted() {
    this.createDoc();
  },
  components: { close }
}
</script>

<style lang="stylus" scoped>
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p,blockquote,th,td{line-height:1}

#new
  position fixed
  top 0
  left 156px
  bottom 0
  right 156px
  padding 24px
  padding-top 56px
  .new-wrapper
    width 100%
    height 100%
    box-sizing border-box
    background-color #fff
    box-shadow 10px 10px 10px rgba(7, 17 ,27, .5)
    padding-top: 20px
    .doc_infor
      position: relative
      width: 700px
      height: 93%
      margin: 0 auto
      padding: 30px 10px 0 10px
      font-size: 18px
      border: 1px solid rgb(199, 199, 199)
      box-shadow: 3px 3px 5px rgb(142, 142, 142)
      border-bottom-left-radius: 20px 500px
      border-bottom-right-radius: 500px 30px
      border-top-right-radius: 5px 100px
      background: linear-gradient(to bottom,rgb(249, 248, 194), rgb(232, 231, 130) 70%,rgb(238, 237, 129))
      .head
        width: 200px
        height: 30px
        background-color: #ffffff
        opacity: .6
        position: absolute
        top: -10px
        left: 50%
        margin-left: -100px
        box-shadow: 0 0 5px rgb(93, 93, 93)
        transform: rotate(-3deg)
      .create_title
        width: 100%
        font-size: 20px
      ul
        width: 100%
        li
          width: 100%
          text-align: left
          margin-top: 20px
          span
            display: block
          input
            display: block
            width: 100%
            height: 30px
            margin-top: 10px
            border-radius: 5px
            border: 1px solid rgb(122, 135, 172)
            color: rgb(157, 157, 157)
            background-color: rgba(249, 248, 194,0)
            text-indent: 5px
          .group_num
            width: 30%
            display: inline-block
            padding: 5px
            border: 1px solid rgb(122, 135, 172)
            margin-top: 10px
            border-radius: 5px
            color: rgb(157, 157, 157)
          .doc_type
            width: 30%
            display: inline-block
            padding: 5px
            margin-left: 20px
            border: 1px solid rgb(122, 135, 172)
            border-radius: 5px
            color: rgb(157, 157, 157)
          .intro
            margin-top: 10px
            border: 1px solid rgb(122, 135, 172)
            border-radius: 7px
            color: rgb(157, 157, 157)
            font-size: 16px
            background-color: rgba(249, 248, 194,0)
          .group-person
            width: 100%
            height: 30px
            margin-top: 10px
            border-radius: 5px
            border: 1px solid rgb(122, 135, 172)
            color: rgb(157, 157, 157)
            line-height: 30px
            text-indent: 2px
            white-space: nowrap
            overflow: hidden
            span
              display: inline
              padding: 2px
              box-shadow: 0 0 1px rgb(138, 138, 138)
              margin-right: 3px
              .icon-shanchu
                font-size: 5px
            input
              display:inline
              width: 700px
              height: 25px
              margin: 0
              border: none
              color: rgb(157, 157, 157)
      .ensure
        margin-top: 70px
        transform: translateX(230px)
        .createBtn
          margin-top: 30px
          &:hover
            text-decoration: underline
            cursor: pointer
        i
          font-size: 37px
          margin-left: 5px

.fade-enter-active, .fade-leave-active
  transition: all  1s
.fade-enter, .fade-leave-active
  opacity: 0
</style>
