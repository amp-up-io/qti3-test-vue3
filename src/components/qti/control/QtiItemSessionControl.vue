<template>
  <div ref="root" class="qti-item-session-control">
    <slot></slot>
  </div>
</template>

<script>
/*
 * When items are referenced as part of a test, the test may impose constraints on how 
 * many attempts, and which states are allowed. These constraints can be specified for 
 * individual items, for whole sections or for an entire qti-test-part. By default, a 
 * setting at qti-test-part level affects all items in that part unless the setting is 
 * overridden at the qti-assessment-section level or ultimately at the individual 
 * qti-assessment-item-ref. The defaults for an qti-Item-session-control are used only 
 * in the absence of any applicable constraint.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiItemSessionControl',

  props: {
    /*
     * [0..1] multiplicity
     */
    maxAttempts: {
      type: String,
      required: false,
      default: '0'
    },
    /*
     * [0..1] multiplicity
     */
    showFeedback: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * [0..1] multiplicity
     */
    allowReview: {
      type: String,
      required: false,
      default: 'true'
    },
    /*
     * [0..1] multiplicity
     */
    showSolution: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * [0..1] multiplicity
     */
    allowComment: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * [0..1] multiplicity
     */
    allowSkipping: {
      type: String,
      required: false,
      default: 'true'
    },
    /*
     * [0..1] multiplicity
     */
    validateResponses: {
      type: String,
      required: false,
      default: 'false'
    }
  },

  data () {
    return {
      maxAttemptsValue: null,
      showFeedbackValue: null,
      allowReviewValue: null,
      showSolutionValue: null,
      allowCommentValue: null,
      allowSkippingValue: null,
      validateResponsesValue: null,
      isQtiValid: true
    }
  },

  methods: {

    getItemSessionControlObject () {
      return {
        maxAttempts: this.maxAttemptsValue,
        showFeedback: this.showFeedbackValue,
        allowReview: this.allowReviewValue,
        showSolution: this.showSolutionValue,
        allowComment: this.allowCommentValue,
        allowSkipping: this.allowSkippingValue,
        validateResponses: this.validateResponsesValue
      }
    },

    validateChildren () {
      // noop
    }
    
  },

  created() {
    try {
      // Validate max-attempts, show-feedback, allow-review, show-solution,
      // allow-comment, allow-skipping, validate-responses
      this.maxAttemptsValue = qtiAttributeValidation.validateIntegerAttribute('max-attempts', this.maxAttempts, false, 0)
      this.showFeedbackValue = qtiAttributeValidation.BooleanValueOf(this.showFeedback)
      this.allowReviewValue = qtiAttributeValidation.BooleanValueOf(this.allowReview)
      this.showSolutionValue = qtiAttributeValidation.BooleanValueOf(this.showSolution)
      this.allowCommentValue = qtiAttributeValidation.BooleanValueOf(this.allowComment)
      this.allowSkippingValue = qtiAttributeValidation.BooleanValueOf(this.allowSkipping)
      this.validateResponsesValue = qtiAttributeValidation.BooleanValueOf(this.validateResponses)
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
        
        console.log('[' + this.$options.name + ']', this.getItemSessionControlObject())
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
