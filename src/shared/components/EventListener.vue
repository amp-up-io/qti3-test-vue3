<script>
export default {
  name: 'EventListener',

  emits: [
    'testPartReady'
  ],

  setup(props, context) {
    return () => context.slots.default?.() ?? null
  }
}
</script>
