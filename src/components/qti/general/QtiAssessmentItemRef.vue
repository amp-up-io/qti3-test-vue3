<template>
  <div ref="item" class="qti-assessment-item-ref">
    <slot></slot>
  </div>
</template>

<script>
/*
 * Items are incorporated into the test by reference and not by direct aggregation. 
 * Note that the identifier of the reference need not have any meaning outside the 
 * test. In particular it is not required to be unique in the context of any catalog, 
 * or be represented in the item's metadata.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiAssessmentItemRef',
  
  props: {
    identifier: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    /*
     * If a child element is required it must appear (at least once) in the selection. 
     * It is in error if a section contains a selection rule that selects fewer child 
     * elements than the number of required elements it contains.
     */
    required: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * If a child element is fixed it must never be shuffled. When used in combination 
     * with a selection rule fixed elements do not have their position fixed until 
     * after selection has taken place. For example, selecting 3 elements from {A,B,C,D} 
     * without replacement might result in the selection {A,B,C}. If the section is 
     * subject to shuffling but B is fixed then permutations such as {A,C,B} are not 
     * allowed whereas permutations like {C,B,A} are permitted.
     */
    fixed: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * Items can optionally be assigned to one or more categories. Categories are used 
     * to allow custom sets of item outcomes to be aggregated during outcomes processing.
     */
    category: {
      type: String,
      required: false,
      default: null
    }
  },
  
  data () {
    return {
      // attributes converted to booleans
      isRequired: false,
      isFixed: false,

      // child elements
      preConditions: [],
      branchRules: [],
      itemSessionControl: null,
      timeLimits: null,
      variableMappings: [],
      weights: [],
      templateDefaults: [],
      isQtiValid: true,
    }
  },
  
  methods: {

    getIdentifier () {
      return this.identifier
    },

    getHref () {
      return this.href
    },

    getRequired () {
      return this.required
    },

    getFixed () {
      return this.fixed
    },

    getCategory () {
      return this.category
    },

    getPreConditions () {
      return this.preConditions
    },

    getBranchRules () {
      return this.branchRules
    },

    getItemSessionControl () {
      return this.itemSessionControl
    },

    getTimeLimits () {
      return this.timeLimits
    },

    getVariableMappings () {
      return this.variableMappings
    },

    getWeights () {
      return this.weights
    },

    getTemplateDefaults () {
      return this.templateDefaults
    },

    isPreCondition (tag) {
      if (tag === 'qti-pre-condition') return true
      return false
    },

    isBranchRule (tag) {
      if (tag === 'qti-branch-rule') return true
      return false
    },
    
    isItemSessionControl (tag) {
      if (tag === 'qti-item-session-control') return true
      return false
    },

    isTimeLimits (tag) {
      if (tag === 'qti-time-limits') return true
      return false
    },
    
    isVariableMapping (tag) {
      if (tag === 'qti-variable-mapping') return true
      return false
    },

    isWeight (tag) {
      if (tag === 'qti-weight') return true
      return false
    },

    isTemplateDefault (tag) {
      if (tag === 'qti-template-default') return true
      return false
    },

    getIsRequired () {
      return this.isRequired
    },

    getIsFixed () {
      return this.isFixed
    },

    /**
     * Iterate through the child nodes:
     * qti-pre-condition (0-*)
     * qti-branch-rule (0-*)
     * qti-item-session-control (0-1)
     * qti-time-limits (0-1)
     * qti-variable-mapping (0-*)
     * qti-weight (0-*)
     * qti-template-default (0-*)
     */
    validateChildren () {
      
      if (!this.$slots.default) return

      let countBranchRule = 0
      let countItemSessionControl = 0
      let countTimeLimits = 0
      let countVariableMapping = 0
      let countWeight = 0
      let countTemplateDefault = 0
      
      this.$slots.default().forEach((slot) => {

        if (qtiAttributeValidation.isValidSlot(slot)) {
          const tag = qtiAttributeValidation.kebabCase(slot.type.name)
          if (this.isPreCondition(tag)) {

            if ((countBranchRule > 0) || 
                (countItemSessionControl > 0) || 
                (countTimeLimits > 0) || 
                (countVariableMapping > 0) || 
                (countWeight > 0) ||
                (countTemplateDefault> 0)) {
              throw new QtiValidationException('Invalid qti-pre-condition child node.  Must preceed all other item-ref child nodes')
            }
  
          } else if (this.isBranchRule(tag)) {
  
            if ((countItemSessionControl > 0) || 
                (countTimeLimits > 0) || 
                (countVariableMapping > 0) || 
                (countWeight > 0) ||
                (countTemplateDefault > 0)) {
              throw new QtiValidationException('Invalid qti-branch-rule child node.  Must preceed session-control, time-limits, rubric-block, weight, and template-default child nodes')
            }

            countBranchRule += 1
            
          } else if (this.isItemSessionControl(tag)) {
                
            if ((countTimeLimits > 0) || 
                (countVariableMapping > 0) || 
                (countWeight > 0) ||
                (countTemplateDefault > 0)) {
              throw new QtiValidationException('Invalid qti-item-session-control child node.  Must preceed time-limits, rubric-block, weight, and template-default child nodes')
            }

            if (countItemSessionControl == 1) {
              throw new QtiValidationException('Invalid qti-item-session-control child node.  Maximum of 1 item session control child node permitted in an item-ref node')
            }

            countItemSessionControl += 1

          } else if (this.isTimeLimits(tag)) {
  
            if ((countVariableMapping > 0) || 
                (countWeight > 0) ||
                (countTemplateDefault > 0)) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Must preceed rubric-block, weight, and template-default child nodes')
            }

            if (countTimeLimits == 1) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Maximum of 1 time limits child node permitted in an item-ref node')
            }

            countTimeLimits += 1

          } else if (this.isVariableMapping(tag)) {
        
            if ((countWeight > 0) ||
                (countTemplateDefault > 0)) {
              throw new QtiValidationException('Invalid qti-variable-mapping child node.  Must preceed section, and item-ref child nodes')
            }
            
            countVariableMapping += 1

          } else if (this.isWeight(tag)) {
            
            countWeight += 1

          } else if (this.isTemplateDefault(tag)) {
            
            countTemplateDefault += 1

          } else {
            // If it's not a pre-condition, branch-rule, template-default, time-limits,
            // variable-mapping, weight, or item-session-control node, it does not 
            // belong here.
            throw new QtiValidationException('Invalid child node: "' + tag + '"')
          }
  
        }
      })

      // All good.  Save off our children.
      this.processChildren()
    },

    processChildren () {
      const children = this.$.subTree.children[0].children

      children.forEach((node) => {
        if (node.component === null) return
        const tag = qtiAttributeValidation.kebabCase(node.type.name)
        if (this.isPreCondition(tag)) {
          this.preConditions.push(node.component.proxy)
        } else if (this.isBranchRule(tag)) {
          this.branchRules.push(node.component.proxy)
        } else if (this.isItemSessionControl(tag)) {
          this.itemSessionControl = node.component.proxy
        } else if (this.isTimeLimits(tag)) {
          this.timeLimits = node.component.proxy
        } else if (this.isVariableMapping(tag)) {
          this.variableMappings.push(node.component.proxy)
        } else if (this.isWeight(tag)) {
          this.weights.push(node.component.proxy)
        } else if (this.isTemplateDefault(tag)) {
          this.templateDefaults.push(node.component.proxy)
        }
      })
    }
    
  },
  
  created () {
    try {
      qtiAttributeValidation.validateIdentifierAttribute(this.identifier)
      // Validate required, fixed
      this.isRequired = qtiAttributeValidation.validateBooleanAttribute ('required', this.required, false, false)
      this.isFixed = qtiAttributeValidation.validateBooleanAttribute ('fixed', this.fixed, false, false)
    } catch (err) {
      this.isQtiValid = false
      if (err.name === 'QtiValidationException') {
        throw new QtiValidationException(err.message)
      } else if (err.name === 'QtiParseException') {
        throw new QtiParseException(err.message)
      } else {
        throw new Error(err.message)
      }
    }
  },
  
  mounted () {
    if (this.isQtiValid) {
      try {
        this.validateChildren()

        console.log('[' + this.$options.name + '][Identifier]', this.identifier)
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
  
}
</script>

<style>
</style>
