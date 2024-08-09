<template>
  <div ref="root" class="qti-time-limits">
    <slot></slot>
  </div>
</template>

<script>
/*
 * In the context of a specific qti-assessment-test, an item, or group of items, may be 
 * subject to a time constraint. This specification supports both minimum and maximum 
 * time constraints. The controlled time for a single item is simply the duration of the 
 * item session as defined by the builtin response variable duration. For 
 * qti-assessment-sections, qti-test-parts and whole qti-assessment-tests, the time limits 
 * relate to the durations of all the item sessions plus any other time spent navigating 
 * that part of the test. In other words, the time includes time spent in states where no 
 * item is being interacted with, such as dedicated navigation screens. The 
 * allow-late-submission attribute regulates whether a candidate's response that is beyond 
 * the max-time should still be accepted. Minimum times are applicable to 
 * qti-assessment-sections and qti-assessment-items only when linear navigation mode 
 * is in effect.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiTimeLimits',
  
  props: {
    /*
     * [0..1] multiplicity
     * This is the minimum duration, in seconds, allocated to the test. Minimum times are 
     * applicable to qti-assessment-sections and qti-assessment-items only when linear 
     * navigation mode is in effect.
     */
    minTime: {
      type: String,
      required: false
    },
    /*
     * [0..1] multiplicity
     * This is the maximum duration, in seconds, allocated to the test.
     */
     maxTime: {
      type: String,
      required: false
    },
    /*
     * [0..1] multiplicity
     * The allow-late-submission attribute regulates whether a candidate's response that is 
     * beyond the max-time should still be accepted.
     */
    allowLateSubmission: {
      type: String,
      required: false,
      default: 'false'
    }
  },
  
  data () {
    return {
      maxTimeValue: null,
      minTimeValue: null,
      allowLateSubmissionValue: null,
      isQtiValid: true
    }
  },

  methods: {

    getTimeLimitsObject () {
      return {
        maxTime: this.maxTimeValue,
        minTime: this.minTimeValue,
        allowLateSubmission: this.allowLateSubmissionValue
      }
    },

    validateChildren () {
      // noop
    }
    
  },
  
  created() {
    try {
      // Validate max-time, min-time, allow-late-submission
      this.maxTimeValue = qtiAttributeValidation.validateIntegerAttribute('max-time', this.maxTime, false, null)
      this.minTimeValue = qtiAttributeValidation.validateIntegerAttribute('min-time', this.minTime, false, null)
      this.allowLateSubmissionValue = qtiAttributeValidation.BooleanValueOf(this.allowLateSubmission)
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
        
        console.log('[' + this.$options.name + ']', this.getTimeLimitsObject())
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
