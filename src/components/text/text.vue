<template>
  <div id="text">
    <close @back="back"></close>
    <div class="text-wrapper">
    
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
#text
  position fixed
  top 0
  left 156px
  bottom 0
  right 156px
  padding 24px
  padding-top 56px
  .text-wrapper
    width 100%
    height 100%
    box-sizing border-box
    background-color #fff
    box-shadow 10px 10px 10px rgba(7, 17 ,27, .5)
</style>
