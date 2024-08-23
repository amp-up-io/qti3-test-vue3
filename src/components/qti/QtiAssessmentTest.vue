<template>
  <div ref="test" class="qti-assessment-test">
    <event-listener
      ref="eventlistener"
      @testPartReady="handleTestPartReady">
      <div>
        <slot></slot>
      </div>
    </event-listener>
  </div>
</template>

<script>
/*
 * An assessment test is a group of assessmentItems with an associated set of rules that 
 * determine which of the items the candidate sees, in what order, and in what way the 
 * candidate interacts with them. The rules describe the valid paths through the test, 
 * when responses are submitted for response processing and when (if at all) feedback 
 * is to be given. Assessment tests are composed of one or more test parts.
 */
import { teststore } from '@/store/teststore'
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'
import EventListener from '@/shared/components/EventListener.vue'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiAssessmentTest',

  components: {
    EventListener
  },

  emits: [
    'testReady',
    'testEndAttemptReady'
  ],

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
    toolName: {
      type: String,
      required: false,
      default: ''
    },
    toolVersion: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      rubricBlocks: [],
      timeLimits: null,
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

    getToolName () {
      return this.toolName
    },

    getToolVersion () {
      return this.toolVersion
    },

    getTimeLimits () {
      return this.timeLimits
    },

    getRubricBlocks () {
      return this.rubricBlocks
    },

    getTestParts () {
      return teststore.getTestParts()
    },

    isContextDeclaration (tag) {
      if (tag === 'qti-context-declaration') return true
      return false
    },

    isOutcomeDeclaration (tag) {
      if (tag === 'qti-outcome-declaration') return true
      return false
    },

    isTimeLimits (tag) {
      if (tag === 'qti-time-limits') return true
      return false
    },

    isStylesheet (tag) {
      if (tag === 'qti-stylesheet') return true
      return false
    },
    
    isRubricBlock (tag) {
      if (tag === 'QtiRubricBlock') return true
      return false
    },

    isTestPart (tag) {
      if (tag === 'qti-test-part') return true
      return false
    },

    isOutcomeProcessing (tag) {
      if (tag === 'qti-outcome-processing') return true
      return false
    },

    isTestFeedback (tag) {
      if (tag === 'qti-test-feedback') return true
      return false
    },

    /**
     * Iterate through the child nodes:
     * qti-context-declaration (0-*)
     * qti-outcome-declaration (0-*)
     * qti-time-limits (0-1)
     * qti-stylesheet (0-*)
     * qti-rubric-block (0-*)
     * qti-test-part (1-*)
     * qti-outcome-processing (0-1)
     * qti-test-feedback (0-*)
     */
    validateChildren () {

      if (!this.$slots.default) {
        throw new QtiValidationException('Invalid AssessmentTest.  Must contain at least 1 qti-test-part child node')
      }

      let countContextDeclaration = 0
      let countOutcomeDeclaration = 0
      let countTimeLimits = 0
      let countStylesheet = 0
      let countRubricBlock = 0
      let countTestPart = 0
      let countOutcomeProcessing = 0
      let countTestFeedback = 0
      
      this.$slots.default().forEach((slot) => {
        if (qtiAttributeValidation.isValidSlot(slot)) {
          const tag = qtiAttributeValidation.kebabCase(slot.type.name)
          if (this.isContextDeclaration(tag)) {
            
            if ((countOutcomeDeclaration > 0) ||
                (countStylesheet > 0) ||
                (countStylesheet > 0) ||
                (countRubricBlock > 0) || 
                (countTestPart > 0) ||
                (countOutcomeProcessing > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-context-declaration child node.  Must preceed outcome-declaration, time-limits, stylesheet, rubric-block, test-part, outcome-processing, and test-feedback child nodes')
            }
            
            countContextDeclaration += 1

          } else if (this.isOutcomeDeclaration(tag)) {
            
            if ((countContextDeclaration > 0) ||
                (countStylesheet > 0) ||
                (countRubricBlock > 0) || 
                (countTestPart > 0) ||
                (countOutcomeProcessing > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-outcome-declaration child node.  Must preceed time-limits, stylesheet, rubric-block, test-part, outcome-processing, and test-feedback child nodes')
            }
            
            countOutcomeDeclaration += 1

          } else if (this.isTimeLimits(tag)) {
  
            if ((countStylesheet > 0) ||
                (countRubricBlock > 0) || 
                (countTestPart > 0) ||
                (countOutcomeProcessing > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Must preceed stylesheet, rubric-block, test-part, outcome-processing, and test-feedback child nodes')
            }

            if (countTimeLimits == 1) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Maximum of 1 time limits child node permitted in an assessment test')
            }

            countTimeLimits += 1

          } else if (this.isStylesheet(tag)) {

            if ((countRubricBlock > 0) || 
                (countTestPart > 0) ||
                (countOutcomeProcessing > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-stylesheet child node.  Must preceed rubric-block, test-part, outcome-processing, and test-feedback child nodes')
            }
            
            countStylesheet += 1

          } else if (this.isRubricBlock(tag)) {
        
            if ((countTestPart > 0) ||
                (countOutcomeProcessing > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-rubric-block child node.  Must preceed test-part, outcome-processing, and test-feedback child nodes')
            }
            
            countRubricBlock += 1

          } else if (this.isTestPart(tag)) {
        
            if ((countOutcomeProcessing > 0) ||
                (countTestFeedback > 0)) {
              throw new QtiValidationException('Invalid qti-test-part child node.  Must preceed outcome-processing, and test-feedback child nodes')
            }
            
            countTestPart += 1

          } else if (this.isOutcomeProcessing(tag)) {
            
            if (countTestFeedback > 0) {
              throw new QtiValidationException('Invalid qti-outcome-processing child node.  Must preceed test-feedback child nodes')
            }
            
            countOutcomeProcessing += 1

          } else if (this.isTestFeedback(tag)) {

            countTestFeedback += 1

          } else {
            // If it's not a context-declaration, outcome-declaration, time-limits, stylesheet, 
            // rubric-block, test-part, outcome-processing, or test-feedback node, it does not 
            // belong here.
            throw new QtiValidationException('Invalid child node: "' + tag + '"')
          }
  
        }
      })
  
      if (countTestPart == 0) {
        throw new QtiValidationException('Invalid qti-assessment-test.  Must contain at least 1 qti-test-part child node')
      }
    },

    processChildren () {
      const children = this.$refs.eventlistener.$.subTree?.children[0].children[0].children

      children.forEach((child) => {
        if (child.component === null) return

        switch (qtiAttributeValidation.kebabCase(child.type.name)) {
          case 'qti-rubric-block':
            this.rubricBlocks.push(child.component.proxy)
            break
          case 'qti-time-limits':
            this.timeLimits = child.component.proxy
            break
        }
      })
    },

    /**
     * @description This executes upon completion
     * of a qti-test-part $mount
     * @param node - an object containing a testPart node
     *               and the testPart's identifier
     */
    handleTestPartReady (node) {
      // Save the testPart in the teststore
      teststore.defineTestPart({
          testPart: node.testPart,
          identifier: node.identifier
        })
    },

    getEndAttempt () {
      this.endAttempt(this.endAttemptComplete.bind(this))
    },

    endAttempt (callback) {
      console.log('[EndAttempt][Start]')

      // Update test duration before processing outcomes
      teststore.updateTestDuration()

      // Run Outcome Processing
      this.processOutcomes()

      console.log('[EndAttempt][Complete]')

      if (callback) callback()
    },

    endAttemptComplete () {
      this.$parent.$emit('testEndAttemptReady', {
          identifier: this.identifier,
          state: teststore.getSerializedState()
        })
    },

    /**
     * @description Utility method to get the qti-outcome-processing node.
     * @return the outcomeProcessing node, or null
     */
    getOutcomeProcessing () {
      const outcomeProcessing = teststore.getOutcomeProcessing()
      return (outcomeProcessing === null) ? null : outcomeProcessing.node
    },

    processOutcomes () {
      console.log('[ProcessOutcomes][Started]')

      // The values of a test's outcome variables are always reset to their 
      // defaults prior to carrying out the instructions described by the 
      // outcome rules defined in Outcome Processing.
      this.resetOutcomeDeclarations()

      const outcomeProcessing = this.getOutcomeProcessing()
      if (outcomeProcessing !== null) {
        outcomeProcessing.evaluate()
      }

      // For debugging purposes
      this.printTestDuration()
      this.printOutcomeDeclarations()

      //
      // this.evaluatePrintedVariables()
      //
      //
      // TODO: Evaluate qti-test-feedback (atEnd, during) ??
      //

      console.log('[ProcessOutcomes][Completed]')
    },

    resetOutcomeDeclarations () {
      teststore.getOutcomeDeclarations().forEach((od) => {
        this.resetOutcomeDeclaration(od)
      })
    },

    resetOutcomeDeclaration (declaration) {
      // If a variable was declared, it has a reset method.
      if (declaration.node !== undefined) {
        declaration.node.reset()
      }
    },

    /**
     * @description Utility method to display outcome variables.
     */
    printOutcomeDeclarations () {
      teststore.getOutcomeDeclarations().forEach((od) => {
        console.log('[ProcessOutcomes][Outcomes][' + od.identifier + '][Value]', od.value)
      })
    },

    /**
     * @description Utility method to display the built-in 'duration' response variable.
     */
    printTestDuration () {
      const duration  = teststore.getResponseDeclaration('duration')
      // Print this as an outcome even though it is a response variable
      console.log('[ProcessOutcomes][Outcomes][duration][Value]', duration.value)
    }

  },

  /**
   * @description This traps all JS errors that may occur in this component.
   */
  errorCaptured (err, vm) {
    console.log('[' + err.name + '][' + vm.$options.name + '] ' + err.message)
    return false
  },

  created () {
    try {
      qtiAttributeValidation.validateIdentifierAttribute(this.identifier)
      this.validateChildren()
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
        this.processChildren()

        console.log('[QtiAssessmentTest][Identifier]', this.identifier)

        // Notify our container that we are loaded.
        this.$parent.$emit('testReady', {
          test: this,
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
