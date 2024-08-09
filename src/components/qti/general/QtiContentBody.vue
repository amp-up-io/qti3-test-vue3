<template>
  <div ref="root" class="qti-content-body">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'QtiContentBody',

  data () {
    return {
      isQtiValid: true
    }
  },

  mounted () {
  }

}
</script>

<style>
.qti-content-body {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}
</style>
