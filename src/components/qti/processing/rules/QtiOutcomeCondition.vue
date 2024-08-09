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

    /**
     * Iterate through the child nodes:
     * qti-outcome-if (1)
     * qti-outcome-else-if (*)
     * qti-outcome-else (0..1)
     */
    validateChildren () {
      // Must have exactly 1
      let countOutcomeIf = 0
      // Must not have more than 1
      let countOutcomeElse = 0

      if (!this.$slots.default) {
        throw new QtiValidationException('Must have 1 qti-outcome-if node')
      }

      this.$slots.default().forEach((slot) => {
        if (qtiAttributeValidation.isValidSlot(slot)) {
          const tag = qtiAttributeValidation.kebabCase(slot.type.name)
          switch (tag) {
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
              throw new QtiValidationException('Invalid Child Node: "' + tag + '"')
          }
        }
      })
      if (countOutcomeIf === 0) {
        throw new QtiValidationException('Must have 1 qti-outcome-if node')
      }
    },

    processChildren () {
      const children = this.$.subTree.children[0].children
      children.forEach((rule) => {
        if (rule.component === null) return
        this.outcomeRules.push(rule.component.proxy)
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

  created () {
    try {
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
        this.processChildren()
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
