<template>
  <div ref="testpart" class="qti-test-part">
    <slot></slot>
  </div>
</template>

<script>
/*
 * Each test is divided into one or more parts which may in turn be divided into 
 * sections, sub-sections and so on. A test part represents a major division of 
 * the test and is used to control the basic mode parameters that apply to all 
 * sections and sub-sections within that part.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiTestPart',
  
  props: {
    identifier: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    /*
     * The navigation mode determines the general paths that the candidate may take. 
     * A testPart in linear mode restricts the candidate to attempt each item in turn. 
     * Once the candidate moves on they are not permitted to return. A testPart in 
     * nonlinear mode removes this restriction - the candidate is free to navigate 
     * to any item in the test at any time. Test delivery systems are free to implement 
     * their own user interface elements to facilitate navigation provided they honour 
     * the navigation mode currently in effect. A test delivery system may implement 
     * nonlinear mode simply by providing a method to step forward or backwards through 
     * the test part.
     */
    navigationMode: {
      type: String,
      required: true
    },
    /*
     * The submission mode determines when the candidate's responses are submitted for 
     * response processing. A testPart in individual mode requires the candidate to submit 
     * their responses on an item-by-item basis. In simultaneous mode the candidate's 
     * responses are all submitted together at the end of the testPart. The choice of 
     * submission mode determines the states through which each item's session can pass 
     * during the test. In simultaneous mode, response processing cannot take place until 
     * the testPart is complete so each item session passes between the interacting and 
     * suspended states only. By definition the candidate can take one and only one 
     * attempt at each item and feedback cannot be seen during the test. For this reason, 
     * adaptive items are not compatible with the simultaneous mode. Whether or not the 
     * candidate can return to review their responses and/or any item-level feedback 
     * after the test, is outside the scope of this specification. Simultaneous mode is 
     * typical of paper-based tests. In individual mode response processing may take 
     * place during the test and the item session may pass through any of the states 
     * described in Items, subject to the itemSessionControl settings in force. Care 
     * should be taken when designing user interfaces for systems that support nonlinear 
     * navigation mode in combination with individual submission. With this combination 
     * candidates may change their responses for an item and then leave it in the 
     * suspended state by navigating to a different item in the same part of the test. 
     * Test delivery systems need to make it clear to candidates that there are 
     * unsubmitted responses (akin to unsaved changes in a traditional document 
     * editing system) at the end of the test part. A test delivery system may force 
     * candidates to submit or discard such responses before moving to a different 
     * item in individual mode if this is more appropriate.
     */
    submissionMode: {
      type: String,
      required: true
    }
  },
  
  data () {
    return {
      preConditions: [],
      branchRules: [],
      itemSessionControl: null,
      timeLimits: null,
      rubricBlocks: [],
      sections: [],
      testFeedbacks: [],
      isQtiValid: true
    }
  },
  
  methods: {

    getIdentifier () {
      return this.identifier
    },

    getTitle () {
      return this.title
    },

    getNavigationMode () {
      return this.navigationMode
    },

    getSubmissionMode () {
      return this.submissionMode
    },

    getItemSessionControl () {
      return this.itemSessionControl
    },

    getTimeLimits () {
      return this.timeLimits
    },

    getRubricBlocks () {
      return this.rubricBlocks
    },

    getSections () {
      return this.sections
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
    
    isRubricBlock (tag) {
      if (tag === 'qti-rubric-block') return true
      return false
    },

    isSection (tag) {
      if (tag === 'qti-assessment-section') return true
      // TODO: Support section ref's
      return false
    },

    isTestFeedback (tag) {
      if (tag === 'qti-test-feedback') return true
      return false
    },

    /**
     * Iterate through the child nodes:
     * qti-pre-condition (0-*)
     * qti-branch-rule (0-*)
     * qti-item-session-control (0-1)
     * qti-time-limits (0-1)
     * qti-rubric-block (0-*)
     * qti-assessment-secion (1-*)
     * qti-test-feedback (0-*)
     */
    validateChildren () {

      if (!this.$slots.default) {
        throw new QtiValidationException('Invalid TestPart.  Must contain at least 1 qti-assessment-section or qti-assessment-section-ref child node')
      }

      let countBranchRule = 0
      let countItemSessionControl = 0
      let countTimeLimits = 0
      let countRubricBlock = 0
      let countSection = 0
      let countTestFeedback = 0
      
      this.$slots.default().forEach((slot) => {
        if (qtiAttributeValidation.isValidSlot(slot)) {
          const tag = qtiAttributeValidation.kebabCase(slot.type.name)
          if (this.isPreCondition(tag)) {

            if ((countBranchRule > 0) || 
                (countItemSessionControl > 0) || 
                (countTimeLimits > 0) || 
                (countRubricBlock > 0) || 
                (countSection > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-pre-condition child node.  Must preceed all other qti-test-part child nodes')
            }
  
          } else if (this.isBranchRule(tag)) {
  
            if ((countItemSessionControl > 0) || 
                (countTimeLimits > 0) || 
                (countRubricBlock > 0) || 
                (countSection > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-branch-rule child node.  Must preceed session-control, time-limits, rubric-block, section, and test-feedback child nodes')
            }

            countBranchRule += 1
            
          } else if (this.isItemSessionControl(tag)) {
                
            if ((countTimeLimits > 0) || 
                (countRubricBlock > 0) || 
                (countSection > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-item-session-control child node.  Must preceed time-limits, rubric-block, section, and test-feedback child nodes')
            }

            countItemSessionControl += 1

          } else if (this.isTimeLimits(tag)) {
  
            if ((countRubricBlock > 0) || 
                (countSection > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Must preceed rubric-block, section, and test-feedback child nodes')
            }

            if (countTimeLimits == 1) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Maximum of 1 time limits child node permitted in a test part')
            }

            countTimeLimits += 1

          } else if (this.isRubricBlock(tag)) {
        
            if ((countSection > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-rubric-block child node.  Must preceed section, and test-feedback child nodes')
            }
            
            countRubricBlock += 1

          } else if (this.isSection(tag)) {
        
            if (countTestFeedback > 0) {
              throw new QtiValidationException('Invalid section child node.  Must preceed test-feedback child nodes')
            }
            
            countSection += 1

          } else if (this.isTestFeedback(tag)) {
            
            countTestFeedback += 1

          } else {
            // If it's not a pre-condition, branch-rule, rubric-block, time-limits,
            // section, section-ref, or item-session-control node, it does not 
            // belong here.
            throw new QtiValidationException('Invalid child node: "' + slot.type.name + '"')
          }
  
        }
      })
  
      if (countSection == 0) {
        throw new QtiValidationException('Invalid TestPart.  Must contain at least 1 qti-assessment-section or qti-assessment-section-ref child node')
      }

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
        } else if (this.isRubricBlock(tag)) {
          this.rubricBlocks.push(node.component.proxy)
        } else if (this.isSection(tag)) {
          this.sections.push(node.component.proxy)
        } else if (this.isTestFeedback(tag)) {
          this.testFeedbacks.push(node.component.proxy)
        }
      })
    }
  },
  
  created () {
    try {
      qtiAttributeValidation.validateIdentifierAttribute(this.identifier)
      // Validate submission-mode and navigation-mode
      qtiAttributeValidation.validateSubmissionModeAttribute(this.submissionMode)
      qtiAttributeValidation.validateNavigationModeAttribute(this.navigationMode)
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
        
        // Notify our container that we are loaded.
        this.$parent.$emit('testPartReady', {
            testPart: this,
            identifier: this.identifier
        })
        
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
