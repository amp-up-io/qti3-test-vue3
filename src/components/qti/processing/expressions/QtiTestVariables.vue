<template>
  <div class="qti-test-variables">
  </div>
</template>

<script>
/*
 * This expression, which can only be used in outcomes processing, simultaneously looks up the value 
 * of an item variable in a sub-set of the items referred to in a test. Only variables with single 
 * cardinality are considered, all NULL values are ignored. The result has cardinality multiple and 
 * base-type as specified below.
 */
import { teststore } from '@/store/teststore'
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'
import QtiEvaluationException from '@/components/qti/exceptions/QtiEvaluationException'
import QtiProcessing from '@/components/qti/processing/utils/QtiProcessing'

const qtiAttributeValidation = new QtiAttributeValidation()
const qtiProcessing = new QtiProcessing()

export default {
  name: 'QtiTestVariables',

  props: {
    /*
     * [0-1] multiplicity
     * If specified, only variables from items in the qti-assessment-section with matching 
     * identifier are matched. Items in sub-sections are included in this definition.
     */
    sectionIdentifier: {
      type: String,
      required: false,
      default: null
    },
    /*
     * [0-1] multiplicity
     * If specified, only variables from items with a matching category are included.
     */
    includeCategory: {
      type: String,
      required: false,
      default: null
    },
    /*
     * [0-1] multiplicity
     * If specified, only variables from items with no matching category are included.
     */
    excludeCategory: {
      type: String,
      required: false,
      default: null
    },
    /*
     * [1] multiplicity
     * The identifier of the variable to look up in each item. If a test brings together 
     * items with different variable naming conventions variable mappings may be used to 
     * reduce the complexity of outcomes processing and allow a single test variables 
     * expression to be used. Items with no matching variable are ignored.
     */
    variableIdentifier: {
      type: String,
      required: true
    },
    /*
     * [0-1] multiplicity
     * If specified, the defined weight is applied to each variable as described in the 
     * definition of weight-identifier for a single variable. The behaviour of this 
     * characterisic is only defined if the base-type attribute is float or omitted . 
     * When a weighting is specified the result of the expression always has base-type 
     * float. Note that this option is incomptable with base-type integer. This restriction 
     * ensures that the value of the base-type attribute remains consistent with the 
     * resulting container type.
     */
    weightIdentifier: {
      type: String,
      required: false,
      default: null
    },
    /*
     * [0-1] multiplicity
     * If specified, matches only variables declared with this base-type. This also becomes 
     * the base-type of the result (subject to type promotion through weighting, as described below). 
     * If omitted, variables declared with base-type integer or float are matched. The base-type of 
     * the result is integer if all matching values have base-type integer, otherwise it is float 
     * and integer values are subject to type promotion.
     */
    baseType: {
      type: String,
      required: false,
      default: null
    }
  },

  data () {
    return {
      value: null,
      valueBaseType: null,
      valueCardinality: 'multiple',
      isQtiValid: true
    }
  },

  methods: {

    getValue () {
      return this.value
    },

    setValue (value) {
      this.value = value
    },

    isNull () {
      return qtiProcessing.isNullValue(this.value)
    },

    getBaseType () {
      return this.valueBaseType
    },

    setBaseType (baseType) {
      this.valueBaseType = baseType
    },

    getCardinality () {
      return this.valueCardinality
    },

    setCardinality (cardinality) {
      this.valueCardinality = cardinality
    },

    /**
     * Iterate through the child nodes:
     * There should be zero child nodes of this component.
     */
    validateChildren () {
      // TODO: ??
    },

    evaluate () {
      try {
        // Init to an empty array
        let results = []
        let isInteger = 
          ((this.baseType === null) || (this.baseType === 'integer')) 
            ? true 
            : false

        // Retrieve all possible variable values, filtered by Section Identifier,
        // Include Category, and Exclude Category.
        let variableResults = 
          teststore.getAllVariableStatesByFilter(
            this.sectionIdentifier, 
            this.includeCategory,
            this.excludeCategory,
            this.variableIdentifier)

        if (variableResults != null) {
          variableResults.forEach((result) => {
            // Null values are ignored, as are variables that are not single cardinality
            if ((result.value === null) || (result.cardinality !== 'single')) return

            if ((this.baseType === null) || (this.baseType === result.baseType))
              results.push(result.value)

            if (result.baseType !== 'integer')
              isInteger = false
          })
        }

        this.setValue(results)

        // If there are results, and all results are baseType integer, and 
        // baseType is not specified, override the default baseType from 
        // float to integer.
        if (isInteger && (this.baseType === null) && (results.length > 0)) {
          this.setBaseType('integer')
        }

        console.log('[TestVariables][Identifier=' 
          + this.variableIdentifier 
          + '][BaseType=' 
          + this.getBaseType()
          + '] value:', this.getValue())

        return this.getValue()
      } catch (err) {
        this.isQtiValid = false
        if (err.name === 'QtiValidationException') {
          throw new QtiValidationException(err.message)
        } else if (err.name === 'QtiEvaluationException') {
          throw new QtiEvaluationException(err.message)
        } else {
          throw new Error(err.message)
        }
      }
    }

  },

  created () {
    try {
      // If baseType is specified, validate that it conforms to one of the standard base-types.
      // NOTE: The baseType attribute is NOT necessarily the baseType of this expression.
      // See description of the baseType attribute.
      if (this.baseType !== null) {
        qtiAttributeValidation.validateBaseType(this.baseType)
        this.valueBaseType = this.baseType
      } else {
        // For now, set this to float as it must be either integer or float.
        this.valueBaseType = 'float'
      }

      // According to the specification, this expression is always multiple cardinality
      this.valueCardinality = 'multiple'
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
        this.validateChildren()
      } catch (err) {
        this.isQtiValid = false
        throw new QtiValidationException(err.message)
      }
    }
  }
}
</script>
