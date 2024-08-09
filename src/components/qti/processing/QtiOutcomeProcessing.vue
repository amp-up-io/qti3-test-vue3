<template>
  <div class="qti-outcome-processing">
    <slot></slot>
  </div>
</template>

<script>
import { teststore } from '@/store/teststore'
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'
import QtiEvaluationException from '@/components/qti/exceptions/QtiEvaluationException'
import QtiProcessing from '@/components/qti/processing/utils/QtiProcessing'

const qtiAttributeValidation = new QtiAttributeValidation()
const qtiProcessing = new QtiProcessing()

export default {
  name: 'QtiOutcomeProcessing',

  props: {
  },

  data () {
    return {
      outcomeRules: [],
      isQtiValid: true
    }
  },

  methods: {

    /**
     * Validate the child nodes:
     * qti-outcome-condition
     * qti-outcome-processing-fragment
     * qti-set-outcome-value
     * qti-lookup-outcome-value
     * qti-exit-test
     */
    validateChildren () {
      if (!this.$slots.default) return

      this.$slots.default().forEach((slot) => {
        if (qtiAttributeValidation.isValidSlot(slot)) {
          if (!qtiProcessing.isOutcomeRuleNode(qtiAttributeValidation.kebabCase(slot.type.name))) {
            throw new QtiValidationException('Invalid Outcome Rule: "' + slot.type.name + '"')
          }
        }
      })
    },

    /**
     * Iterate through the child nodes:
     * qti-response-condition
     * qti-response-processing-fragment
     * qti-set-outcome-value
     * qti-lookup-outcome-value
     * qti-exit-response
     */
     processChildren () {
      const children = this.$.subTree.children[0].children

      children.forEach((rule) => {
        if (rule.component === null) return
        this.outcomeRules.push(rule.component.proxy)
      })
    },

    evaluate () {
      try {
        this.outcomeRules.forEach((rule) => {
          rule.evaluate()
        })
      } catch (err) {
        if (err.name === 'QtiValidationException') {
          throw new QtiValidationException(err.message)
        } else if (err.name === 'QtiEvaluationException') {
          throw new QtiEvaluationException(err.message)
        } else if (err.name === 'QtiExitProcessingException') {
          console.log('[' + err.name + '] ' + err.message)
        } else {
          throw new Error(err.message)
        }
      }
    }

  },

  created () {
    try {
      // Validate the Outcome Rules
      this.validateChildren()
    } catch (err) {
      this.isQtiValid = false
      if (err.name === 'QtiValidationException') {
        throw new QtiValidationException(err.message)
      } else {
        throw new Error(err.message)
      }
    }
  },

  mounted () {
    if (this.isQtiValid) {
      try {
        // Process all Outcome Rules in this OP.
        this.processChildren()

        // Notify teststore of our new model.
        teststore.defineOutcomeProcessing({
            node: this
          })
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
