<template>
  <div id="new">
    <close @back="back"></close>
    <div class="new-wrapper">
      <h1 class="create_title">新增文档</h1>
      <div class="doc_infor">
        <ul>
          <li>
            <span>文档标题：</span>
            <input type="text" name="title" value="" placeholder="输入文档标题">
          </li>
          <li>
            <span>文档类型</span>
            <span class="group_num">{{resultName[0]}}</span>
            <span class="doc_type">{{resultName[1]}}</span>
          </li>
          <li></li>
          <li></li>
        </ul>
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
      docType: ["0","0"],
      resultName: ["单人文档","web"]
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
          resultName[0] = "单人文档"
        }else{
          resultName[0] = "多人文档"
        }
        switch(result[1]){
          case "0": resultName[1] = "web";
          default: break;
        }
        swal({
          title: '创建成功',
          html:
            '你的文档类型: <pre>' +
              JSON.stringify(resultName) +
            '</pre>',
          confirmButtonText: '确定',
          showCancelButton: false
        })
      }, function () {
        swal.resetDefaults()
      })
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

<style lang="stylus">
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
    .create_title
      width: 100%
      font-size: 20px
    .doc_infor
      width: 60%
      height: 93%
      margin: 0 auto
      padding-top: 30px
      font-size: 18px
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
            border: 1px solid rgb(214, 214, 214)
            color: rgb(157, 157, 157)
          .group_num
            width: 50%
            display: inline-block
          .doc_type
            width: 50%
            display: inline-block

</style>
