<template>
  <div ref="root" class="qti-selection">
    <slot></slot>
  </div>
</template>

<script>
/*
 * The rules used to select which children of the section are to be used for each 
 * instance of the test. Each child section has its own selection and ordering rules 
 * followed before those of its parent. A child section may shuffle the order of its 
 * own children while still requiring that they are kept together when shuffling the 
 * parent section.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiSelection',

  props: {
    /*
     * [1] multiplicity
     * The number of child elements to be selected. Sub-sections always count as 1, 
     * regardless of how many child elements they have and whether or not they are visible.
     * The number of children to select may exceed the number of child elements defined 
     * only if with-replacement is true.
     */
    select: {
      type: String,
      required: true
    },
    /*
     * [0..1] multiplicity
     * When selecting child elements each element is normally eligible for selection once 
     * only. In other words, when selecting 3 elements from {A,B,C,D} the possible 
     * outcomes are {A,B,C}, {A,B,D}, {A,C,D}, and {B,C,D}. By setting 'with-replacement' 
     * to 'true' each element becomes eligible for selection multiple times. Selecting 3 
     * nodes from {A,B,C,D} can then result in combinations such as {A,A,A}, {A,A,B} etc.
     */    
    withReplacement: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * [0..1] multiplicity
     * This is an extension point. It allows new proprietary characteristics to be defined 
     * and used for the ordering. The extension mechanism is dependent on the form of 
     * binding.
     */
    extension: {
      type: String,
      required: false,
      default: null
    }
  },

  data () {
    return {
      selectValue: null,
      withReplacementValue: null,
      isQtiValid: true
    }
  },

  methods: {

    getSelect () {
      return this.selectValue
    },

    getWithReplacement () {
      return this.withReplacementValue
    },

    getExtension () {
      return this.extension
    },
    
    validateChildren () {
      // noop
    }
  },

  created() {
    try {
      // Validate select and withReplacement
      this.selectValue = qtiAttributeValidation.validateIntegerAttribute('select', this.select, true)
      this.withReplacementValue = qtiAttributeValidation.validateBooleanAttribute('with-replacement', this.withReplacement, false, false)
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

      console.log('[' + this.$options.name + '][select=' + this.select + ']')
    } catch (err) {
      this.isQtiValid = false
      throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
