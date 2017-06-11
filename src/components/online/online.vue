<template>
  <div id="online">
    <close @back="back"></close>
    <div class="online-wrapper">
      {{ message }}
      <button type="button" @click="send">click me</button>
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
      message: ''
    }
  },
  computed: {
    ...mapState([
      'showTabs',
      'socket'
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
    send() {
      this.socket.emit('send', 'hello, world')
    }
  },
  created() {
    this.beBlur()
    this.showMenu()

    this.socket.on('emit', msg => {
      this.message += msg
    })
  },
  components: { close }
}
</script>

<style lang="stylus">
#online
  position fixed
  top 0
  left 156px
  bottom 0
  right 156px
  padding 24px
  padding-top 56px
  .online-wrapper
    width 100%
    height 100%
    box-sizing border-box
    background-color #fff
    box-shadow 10px 10px 10px rgba(7, 17 ,27, .5)
</style>
