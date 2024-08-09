<template>
  <div class="qti-outcome-condition">
    <slot></slot>
  </div>
</template>

<script>
/*
 * This enables the 'If..Then..Else' rules to be defined for the outcome processing. 
 * If the expression given in a outcomeIf or outcomeElseIf evaluates to 'true' then 
 * the sub-rules contained within it are followed and any following outcomeElseIf or 
 * outcomeElse parts are ignored for this outcome condition. If the expression given 
 * in a outcomeIf or outcomeElseIf does not evaluate to 'true' then consideration 
 * passes to the next outcomeElseIf or, if there are no more outcomeElseIf parts 
 * then the sub-rules of the outcomeElse are followed (if specified).
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiEvaluationException from '@/components/qti/exceptions/QtiEvaluationException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'
import QtiExitProcessingException from '@/components/qti/exceptions/QtiExitProcessingException'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiOutcomeCondition',

  data () {
    return {
      outcomeRules: [],
      isQtiValid: true
    }
  },

  methods: {

    isValidSlot (slot) {
      if (typeof slot.componentOptions !== 'undefined') {
        return true
      } else {
        // check if text is something not empty
        if ((typeof slot.text !== 'undefined') && (slot.text.trim().length > 0)) {
          // not an empty text slot.  this is an error.
          throw new QtiValidationException('Invalid Child Node: "' + slot.text.trim() + '"')
        } else {
          // empty text slot.  not a component, but not an error
          return false
        }
      }
    },

    /**
     * Iterate through the child nodes:
     * qti-outcome-if (1)
     * qti-outcome-else-if (*)
     * qti-outcome-else (0..1)
     */
    validateChildren () {
      // Must have at least 1
      let countOutcomeIf = 0
      // Must not have more than 1
      let countOutcomeElse = 0
      this.$slots.default.forEach((slot) => {
        if (qtiAttributeValidation.isValidSlot(slot)) {
          // detect the slot type from the component tag
          switch (slot.componentOptions.tag) {
            case 'qti-outcome-if':
              if (countOutcomeIf === 0) {
                countOutcomeIf = 1
              } else {
                throw new QtiValidationException('Only 1 qti-outcome-if node permitted')
              }
              break

            case 'qti-outcome-else':
              if (countOutcomeIf === 0) {
                throw new QtiValidationException('qti-outcome-else node not permitted before qti-outcome-if')
              }
              if (countOutcomeElse === 0) {
                countOutcomeElse = 1
              } else {
                throw new QtiValidationException('More than one qti-outcome-else node')
              }
              break

            case 'qti-outcome-else-if':
              if (countOutcomeIf === 0) {
                throw new QtiValidationException('qti-outcome-else-if node not permitted before qti-outcome-if')
              }
              if (countOutcomeElse === 1) {
                throw new QtiValidationException('qti-outcome-else-if node not permitted after qti-outcome-else')
              }
              break

            default:
              throw new QtiValidationException('Invalid Child Node: "' + slot.componentOptions.tag + '"')
          }
        }
      })
      if (countOutcomeIf === 0) {
        throw new QtiValidationException('Must have 1 qti-outcome-if node')
      }
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
        this.outcomeRules.every(rule => {
          if (rule.evaluate()) {
            return false
          }
          return true
        })
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
        // Validate children.
        this.validateChildren()
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
