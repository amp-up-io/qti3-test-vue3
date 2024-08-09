<template>
  <div ref="root" class="qti-ordering">
  </div>
</template>
  
<script>
/*
 * The ordering class specifies the rule used to arrange the child elements of a section 
 * following selection. If no ordering rule is given, assume that the elements are to be 
 * ordered in the order in which they are defined. A sub-section is always treated as a 
 * single block for selection but the way it is treated when shuffling depends on its 
 * visibility. A visible sub-section is always treated as a single block but an invisible 
 * sub-section is only treated as a single block if its keep-together characteristic is 'true'.
 * Otherwise, the child elements of the invisible sub-section are mixed into the parent's 
 * selection prior to shuffling. The ordering class also provides an opportunity for 
 * extensions to this specification to include support for more complex ordering algorithms. 
 * The selection and ordering rules define a sequence of items for each instance of the 
 * test. The sequence starts with the first item of the first section of the first test 
 * part and continues through to the last item of the last section of the last test part. 
 * This sequence is constant throughout the test. Normally this is the logical sequence 
 * perceived by the candidate but the use of pre-conditions and/or branch-rules can affect 
 * the specific path taken. The use of selection with replacement enables two or more 
 * instances of an item referred to by the same assessment-item-ref to appear in the 
 * sequence of items for a test. It is therefore an error to make such an item the target 
 * of a branch-rule. Furthermore, when reporting test results the sequence number of each 
 * item must also be reported to avoid ambiguity. See QTI Results Reporting [QTI-RR-30]. 
 * The ordering class also provides an opportunity for extensions to this specification to 
 * include support for more complex ordering algorithms.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiOrdering',
  
  props: {
    /*
     * [0..1] multiplicity
     */
    shuffle: {
      type: String,
      required: false,
      default: 'false'
    }
  },
  
  data () {
    return {
      shuffleValue: null,
      isQtiValid: true
    }
  },
  
  methods: {

    getShuffle () {
      return this.shuffleValue
    },
    
    validateChildren () {
      // noop
    }
  },
  
  created() {
    try {
      // Validate shuffle
      this.shuffleValue = qtiAttributeValidation.validateBooleanAttribute('shuffle', this.shuffle, false, false)
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

        console.log('[' + this.$options.name + '][shuffle=' + this.getShuffle() + ']')
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
        }
      }
    }
  }
</script>
