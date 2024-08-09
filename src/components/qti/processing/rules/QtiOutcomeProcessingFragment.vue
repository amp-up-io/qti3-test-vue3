<template>
  <div class="qti-outcome-processing-fragment">
    <slot></slot>
  </div>
</template>

<script>
/*
 * A simple, transparent, group of Outcome Processing rules.  There are no semantics
 * associated with the execution properties of rules in an outcomeProcessingFragment.
 */
export default {
  name: 'QtiOutcomeProcessingFragment',

  mounted () {
    console.log('[QtiOutcomeProcessingFragment]')
  }
}
</script>
