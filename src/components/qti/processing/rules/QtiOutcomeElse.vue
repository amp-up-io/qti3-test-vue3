<template>
  <div class="qti-outcome-else">
    <slot></slot>
  </div>
</template>

<script>
/*
 * This provides the 'Else' clause of the 'If..Then..Else' for the outcome processing
 * functionality. If the expression given in an outcomeIf or outcomeElseIf evaluates
 * to 'true' then the sub-rules contained within it are followed and any following
 * outcomeElseIf or outcomeElse parts are ignored for this outcome condition. If the
 * expression given in an outcomeIf or outcomeElseIf does not evaluate to 'true' then
 * consideration passes to the next outcomeElseIf or, if there are no more outcomeElseIf
 * parts then the sub-rules of the outcomeElse are followed (if specified).
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiEvaluationException from '@/components/qti/exceptions/QtiEvaluationException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'
import QtiExitProcessingException from '@/components/qti/exceptions/QtiExitProcessingException'
import QtiProcessing from '@/components/qti/processing/utils/QtiProcessing'

const qtiAttributeValidation = new QtiAttributeValidation()
const qtiProcessing = new QtiProcessing()

export default {
  name: 'QtiOutcomeElse',

  data () {
    return {
      outcomeRules: [],
      isQtiValid: true
    }
  },

  methods: {

    /**
     * Iterate through the child nodes:
     * outcomeRule (*)
     */
    validateChildren () {
      this.$slots.default.forEach((slot) => {
        if (qtiAttributeValidation.isValidSlot(slot)) {
          // Detect an expression
          if (qtiProcessing.isExpressionNode(slot.componentOptions.tag)) {
            throw new QtiValidationException('Expression nodes not permitted: "' + slot.componentOptions.tag + '"')
          }
          // Detect * Outcome Rules
          if (!qtiProcessing.isOutcomeRuleNode(slot.componentOptions.tag)) {
            throw new QtiValidationException('Invalid Outcome Rule node: "' + slot.componentOptions.tag + '"')
          }
        }
      })
      // All good.  Save off our children.
      this.processChildren()
    },

    processChildren () {
      this.$children.forEach((rule) => {
        this.outcomeRules.push(rule)
      })
    },

    evaluate () {
      try {
        this.outcomeRules.forEach((rule) => {
          rule.evaluate()
        })
        return true
      } catch (err) {
        if (err.name === 'QtiValidationException') {
          throw new QtiValidationException(err.message)
        } else if (err.name === 'QtiEvaluationException') {
          throw new QtiEvaluationException(err.message)
        } else if (err.name === 'QtiExitProcessingException') {
          throw new QtiExitProcessingException(err.message)
        } else {
          throw new Error(err.message)
        }
      }
    }
  },

  mounted () {
    if (this.isQtiValid) {
      try {
        this.validateChildren()
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
