<template>
  <div class="qti-outcome-if">
    <slot></slot>
  </div>
</template>

<script>
/*
 * This provides the 'If' clause of the 'If..Then..Else' for the outcome processing functionality.
 * An outcomeIf part consists of an expression which must have an effective base-type of boolean and single 
 * cardinality. It also contains a set of sub-rules. If the expression is true then the sub-rules are 
 * processed, otherwise they are skipped (including if the expression is NULL) and the following 
 * outcomeElseIf or outcomeElse parts (if any) are considered instead.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiEvaluationException from '@/components/qti/exceptions/QtiEvaluationException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'
import QtiExitProcessingException from '@/components/qti/exceptions/QtiExitProcessingException'
import QtiProcessing from '@/components/qti/processing/utils/QtiProcessing'

const qtiAttributeValidation = new QtiAttributeValidation()
const qtiProcessing = new QtiProcessing()

export default {
  name: 'QtiOutcomeIf',

  data () {
    return {
      expression: null,
      outcomeRules: [],
      isQtiValid: true
    }
  },

  methods: {

    /**
     * Iterate through the child nodes:
     * expression (1)
     * outcomeRule (*)
     */
    validateChildren () {
      let countExpression = 0

      if (!this.$slots.default) {
        throw new QtiValidationException('Must have exactly one Expression node')
      }

      this.$slots.default().forEach((slot) => {
        if (qtiAttributeValidation.isValidSlot(slot)) {
          const tag = qtiAttributeValidation.kebabCase(slot.type.name)
          // Detect an expression
          if (qtiProcessing.isExpressionNode(tag)) {
            if (countExpression === 0) {
                countExpression = 1
            } else {
              throw new QtiValidationException('Multiple Expression nodes: "' + slot.type.name + '"')
            }
          }
          // Detect * Outcome Rules after the Expression
          else if (qtiProcessing.isOutcomeRuleNode(tag)) {
            if (countExpression === 0) {
              throw new QtiValidationException('Outcome Rules must follow an Expression node: "' + slot.type.name + '"')
            }
          } else {
            throw new QtiValidationException('Node is not an Expression or an Outcome Rule: "' + slot.type.name + '"')
          }
        }
      })
      if (countExpression === 0) {
        throw new QtiValidationException('Must have exactly one Expression node')
      }
    },
    /**
     * Iterate through the child nodes:
     * expression (1)
     * outcomeRule (*)
     */
    processChildren () {
      const children = this.$.subTree.children[0].children

      let firstRule = true
      children.forEach((rule) => {
        if (rule.component === null) return
        const node = rule.component.proxy
        if (firstRule) {
          firstRule = false
          this.expression = node
        } else {
          this.outcomeRules.push(node)
        }
      })
    },

    evaluate () {
      try {
        if (this.expression.evaluate()) {
          this.outcomeRules.forEach((rule) => {
            rule.evaluate()
          })
          return true
        }
        return false
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
