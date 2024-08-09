<template>
  <div
    ref="player">
    <component
      ref="test"
      @testReady="handleTestReady"
      @testEndAttemptReady="handleEndAttemptReady"
      :is="processedXml">
    </component>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, onErrorCaptured } from 'vue'
import { teststore } from '@/store/teststore'
import { XmlFilters } from '@/shared/helpers/XmlFilters'
import QtiAssessmentTest from '@/components/qti/QtiAssessmentTest.vue'
import QtiContextDeclaration from '@/components/qti/declarations/QtiContextDeclaration.vue'
import QtiOutcomeDeclaration from '@/components/qti/declarations/QtiOutcomeDeclaration.vue'
import QtiMapping from '@/components/qti/declarations/QtiMapping.vue'
import QtiMapEntry from '@/components/qti/declarations/QtiMapEntry.vue'
import QtiAreaMapping from '@/components/qti/declarations/QtiAreaMapping.vue'
import QtiInterpolationTable from '@/components/qti/declarations/QtiInterpolationTable.vue'
import QtiInterpolationTableEntry from '@/components/qti/declarations/QtiInterpolationTableEntry.vue'
import QtiMatchTable from '@/components/qti/declarations/QtiMatchTable.vue'
import QtiMatchTableEntry from '@/components/qti/declarations/QtiMatchTableEntry.vue'
import QtiDefaultValue from '@/components/qti/declarations/QtiDefaultValue.vue'
import QtiValue from '@/components/qti/declarations/QtiValue.vue'

import QtiItemSessionControl from '@/components/qti/control/QtiItemSessionControl.vue'
import QtiTimeLimits from '@/components/qti/control/QtiTimeLimits.vue'
import QtiStylesheet from '@/components/qti/general/QtiStylesheet.vue'
import QtiRubricBlock from '@/components/qti/general/QtiRubricBlock.vue'
import QtiContentBody from '@/components/qti/general/QtiContentBody.vue'
import QtiTestPart from '@/components/qti/general/QtiTestPart.vue'
import QtiAssessmentSection from '@/components/qti/general/QtiAssessmentSection.vue'
import QtiAssessmentItemRef from '@/components/qti/general/QtiAssessmentItemRef.vue'
import QtiOrdering from '@/components/qti/selection/QtiOrdering.vue'
import QtiSelection from '@/components/qti/selection/QtiSelection.vue'

import QtiOutcomeProcessing from '@/components/qti/processing/QtiOutcomeProcessing.vue'

// Catalog Elements
import QtiCatalogInfo from '@/components/qti/catalog/QtiCatalogInfo.vue'
import QtiCatalog from '@/components/qti/catalog/QtiCatalog.vue'
import QtiCard from '@/components/qti/catalog/QtiCard.vue'
import QtiCardEntry from '@/components/qti/catalog/QtiCardEntry.vue'
import QtiHtmlContent from '@/components/qti/catalog/QtiHtmlContent.vue'
import QtiFileHref from '@/components/qti/catalog/QtiFileHref.vue'

// Rules
import QtiOutcomeCondition from '@/components/qti/processing/rules/QtiOutcomeCondition.vue'
import QtiOutcomeProcessingFragment from '@/components/qti/processing/rules/QtiOutcomeProcessingFragment.vue'
import QtiExitTest from '@/components/qti/processing/rules/QtiExitTest.vue'
import QtiLookupOutcomeValue from '@/components/qti/processing/rules/QtiLookupOutcomeValue.vue'
import QtiOutcomeIf from '@/components/qti/processing/rules/QtiOutcomeIf.vue'
import QtiOutcomeElse from '@/components/qti/processing/rules/QtiOutcomeElse.vue'
import QtiOutcomeElseIf from '@/components/qti/processing/rules/QtiOutcomeElseIf.vue'
import QtiSetOutcomeValue from '@/components/qti/processing/rules/QtiSetOutcomeValue.vue'
import QtiSetDefaultValue from '@/components/qti/processing/rules/QtiSetDefaultValue.vue'

// Expressions
import QtiBaseValue from '@/components/qti/processing/expressions/QtiBaseValue.vue'
import QtiCorrect from '@/components/qti/processing/expressions/QtiCorrect.vue'
import QtiDefault from '@/components/qti/processing/expressions/QtiDefault.vue'
import QtiVariable from '@/components/qti/processing/expressions/QtiVariable.vue'
import QtiMatch from '@/components/qti/processing/expressions/QtiMatch.vue'
import QtiMapResponse from '@/components/qti/processing/expressions/QtiMapResponse.vue'
import QtiIsNull from '@/components/qti/processing/expressions/QtiIsNull.vue'
import QtiAnd from '@/components/qti/processing/expressions/QtiAnd.vue'
import QtiOr from '@/components/qti/processing/expressions/QtiOr.vue'
import QtiNot from '@/components/qti/processing/expressions/QtiNot.vue'
import QtiSubtract from '@/components/qti/processing/expressions/QtiSubtract.vue'
import QtiSum from '@/components/qti/processing/expressions/QtiSum.vue'
import QtiRandom from '@/components/qti/processing/expressions/QtiRandom.vue'
import QtiMultiple from '@/components/qti/processing/expressions/QtiMultiple.vue'
import QtiOrdered from '@/components/qti/processing/expressions/QtiOrdered.vue'
import QtiEqual from '@/components/qti/processing/expressions/QtiEqual.vue'
import QtiEqualRounded from '@/components/qti/processing/expressions/QtiEqualRounded.vue'
import QtiFieldValue from '@/components/qti/processing/expressions/QtiFieldValue.vue'
import QtiRandomFloat from '@/components/qti/processing/expressions/QtiRandomFloat.vue'
import QtiRandomInteger from '@/components/qti/processing/expressions/QtiRandomInteger.vue'
import QtiIntegerDivide from '@/components/qti/processing/expressions/QtiIntegerDivide.vue'
import QtiIntegerModulus from '@/components/qti/processing/expressions/QtiIntegerModulus.vue'
import QtiIntegerToFloat from '@/components/qti/processing/expressions/QtiIntegerToFloat.vue'
import QtiProduct from '@/components/qti/processing/expressions/QtiProduct.vue'
import QtiIndex from '@/components/qti/processing/expressions/QtiIndex.vue'
import QtiMember from '@/components/qti/processing/expressions/QtiMember.vue'
import QtiDelete from '@/components/qti/processing/expressions/QtiDelete.vue'
import QtiSubstring from '@/components/qti/processing/expressions/QtiSubstring.vue'
import QtiStringMatch from '@/components/qti/processing/expressions/QtiStringMatch.vue'
import QtiPatternMatch from '@/components/qti/processing/expressions/QtiPatternMatch.vue'
import QtiRound from '@/components/qti/processing/expressions/QtiRound.vue'
import QtiRoundTo from '@/components/qti/processing/expressions/QtiRoundTo.vue'
import QtiTruncate from '@/components/qti/processing/expressions/QtiTruncate.vue'
import QtiDivide from '@/components/qti/processing/expressions/QtiDivide.vue'
import QtiGt from '@/components/qti/processing/expressions/QtiGt.vue'
import QtiGte from '@/components/qti/processing/expressions/QtiGte.vue'
import QtiLt from '@/components/qti/processing/expressions/QtiLt.vue'
import QtiLte from '@/components/qti/processing/expressions/QtiLte.vue'
import QtiMax from '@/components/qti/processing/expressions/QtiMax.vue'
import QtiMin from '@/components/qti/processing/expressions/QtiMin.vue'
import QtiCustomOperator from '@/components/qti/processing/expressions/QtiCustomOperator.vue'
import QtiMathOperator from '@/components/qti/processing/expressions/QtiMathOperator.vue'
import QtiMathConstant from '@/components/qti/processing/expressions/QtiMathConstant.vue'
import QtiRepeat from '@/components/qti/processing/expressions/QtiRepeat.vue'
import QtiStatsOperator from '@/components/qti/processing/expressions/QtiStatsOperator.vue'
import QtiGcd from '@/components/qti/processing/expressions/QtiGcd.vue'
import QtiLcm from '@/components/qti/processing/expressions/QtiLcm.vue'
import QtiPower from '@/components/qti/processing/expressions/QtiPower.vue'
import QtiAnyN from '@/components/qti/processing/expressions/QtiAnyN.vue'
import QtiTestVariables from '@/components/qti/processing/expressions/QtiTestVariables.vue'

const xmlFilters = new XmlFilters()

export default {
  name: 'Qti3TestPlayer',

  emits: [
    'notifyQti3TestReady',
    'notifyQti3TestEndAttemptCompleted',
    'notifyQti3TestPlayerReady'
  ],

  props: {
  },

  setup (props, context) {   
    // load all qti-assessment-test components - if they have not already
    // been loaded by some other usage of the Qti3TestPlayer component.
    loadQtiTestComponents(getCurrentInstance().appContext)


      /*
    Vue.component('qti-context-declaration', QtiContextDeclaration)
Vue.component('qti-outcome-declaration', QtiOutcomeDeclaration)
Vue.component('qti-time-limits', QtiTimeLimits)
Vue.component('qti-stylesheet', QtiStylesheet)
Vue.component('qti-rubric-block', QtiRubricBlock)
Vue.component('qti-test-part', QtiTestPart)
Vue.component('qti-outcome-processing', QtiOutcomeProcessing)
*/

    // data
    let testXml = ref('')
    let test = ref(null) // Set to the qti-assessment-test component
    let guid = ref(null)
    let endAttemptTarget = ref(null)

    const processedXml = computed(() => {
      let xml = testXml.value

      // Hack 1: Clean out the <?xml..?> declaration
      xml = xmlFilters.filterXmlDeclaration(xml)
      // Hack 2: Clean out CDATA (not html5)
      xml = xmlFilters.filterCdata(xml)
      // Hack 3: Replace <style> tags with <amp-style>
      xml = xmlFilters.filterStyle(xml)
      // Hack 4: Replace <audio> tags with <amp-audio>
      xml = xmlFilters.filterAudio(xml)

      return {
        template: '<div id="qti-test-container">' + xml + '</div>'
      }
    })

    /**
     * @description Main test loading method for the Qti3TestPlayer.  Accepts
     * a raw QTI 3 xml string and a configuration object.
     * @param {String} xml - string of qti-assessment-test (QTI 3) xml
     * @param {Object} configuration - object of the following schema:
     * {
     *   guid: string (a tracking guid)
     *   pnp: a PnpFactory object
     * }
     */
    function loadTestFromXml (xml, configuration) {
      console.log('[Qti3TestPlayer][LoadTestFromXml][configuration]', configuration)
      // Step 1: clear out the existing store
      teststore.resetAll()
      // Step 2: initialize the built-in variables
      teststore.initializeBuiltInDeclarations()
      // Step 3: set test player context
      loadTestContextFromConfiguration(configuration)
      // Step 4: load the test xml
      testXml.value = xml
    }

    /**
     * @description Event handler for the stimulusReady Event triggered by
     * the qti-assessment-stimulus component when the component is loaded.
     * @param {Object} param - contains a 'test' property that is the QtiAssessmentTest component
     */
    function handleTestReady (param) {
      console.log('[Qti3TestPlayer][TestReady]', param)
      // Keep a handle on the component.
      test.value = param.test
      // Notify listener that the qti-assessment-test component is loaded and ready.
      context.emit('notifyQti3TestReady', test.value)
    }

    /**
     * @description Method for controller to get a handle on the test component.
     * @return {Component} a qti-assessment-test component
     */
    function getTest () {
      return test.value
    }

    function loadTestContextFromConfiguration (configuration) {
      if (typeof configuration === 'undefined') return

      // If the configuration properties exist, Load TestContext from the configuration.
      if ('guid' in configuration) setTestContextGuid(configuration.guid)
      if ('pnp' in configuration) setTestContextPnp(configuration.pnp)
    }

    /**
     * @description Method to set a tracking guid.
     * @param {String} trackingGuid - a tracking guid
     */
    function setTestContextGuid (trackingGuid) {
      guid.value = trackingGuid
    }

    /**
     * @description Method to inject a pnp.
     * @param {Object} pnp - a pnp object built from a PnpFactory
     */
    function setTestContextPnp (pnp) {
      teststore.setTestContextPnp(pnp)
    }

    /**
     * @description Method to inject an item state by partIdentifier, 
     * section identifier, and item identifier
     * @param {String} partIdentifier - the part identifier
     * @param {String} sectionIdentifier - the section identifier
     * @param {String} itemIdentifier - the item identifier
     * @param {Object} itemState - a state object built
     *                             from an ItemStateFactory
     */
    function setTestStateItemState(partIdentifier, sectionIdentifier, itemIdentifier, itemState) {
      teststore
        .setTestStateItemState(
          partIdentifier,
          sectionIdentifier, 
          itemIdentifier,
          itemState)
    }

    function getAllTestStateItemStates () {
      return teststore.getAllTestStateItemStatesMap()
    }

    /**
     * @description  Initiate an getEndAttempt request in the QtiAssessmentTest
     * component.  When the method completes the Test will trigger the
     * 'testEndAttemptReady' event - handled by the 'handleEndAttemptReady' method.
     * @param {String} target - used for tracking the invoker of this method.
     */
    function endAttempt (target) {
      console.log('[Qti3TestPlayer][EndAttempt][' + target + ']')
      endAttemptTarget.value = (typeof target === 'undefined' ? null : target)
      test.value.getEndAttempt()
    }

    /**
     * @description event handler for the endAttemptReady event.
     * @param {Object} testState - object containing a 'state' property.
     */
    function handleEndAttemptReady (testState) {
      // Patch the 'target' property onto the Test State object
      if (testState !== null)
        testState.target = endAttemptTarget.value

      // Notify listener that a Test State object is ready.
      context.emit('notifyQti3TestEndAttemptCompleted', testState)
    }

    /**
     * @description All QTI 3 Assessment Test components are loaded into the 
     * global app context here.
     * @param {*} appContext - the global context
     */
    function loadQtiTestComponents (appContext) {
      // Bail if we have already loaded the item components
      if (typeof appContext.components['qti-assessment-test'] !== 'undefined') return

      const app = appContext.app

      // Top-level Test elements
      app
        .component('qti-assessment-test', QtiAssessmentTest)
        .component('qti-context-declaration', QtiContextDeclaration)
        .component('qti-outcome-declaration', QtiOutcomeDeclaration)
        .component('qti-rubric-block', QtiRubricBlock)
        .component('qti-content-body', QtiContentBody)
        .component('qti-stylesheet', QtiStylesheet)
        .component('qti-time-limits', QtiTimeLimits)
        .component('qti-item-session-control', QtiItemSessionControl)
        .component('qti-test-part', QtiTestPart)
        .component('qti-assessment-section', QtiAssessmentSection)
        .component('qti-assessment-item-ref', QtiAssessmentItemRef)
        .component('qti-ordering', QtiOrdering)
        .component('qti-selection', QtiSelection)
        .component('qti-catalog-info', QtiCatalogInfo)
        .component('qti-outcome-processing', QtiOutcomeProcessing)

      // Declaration elements
      app
        .component('qti-default-value', QtiDefaultValue)
        .component('qti-value', QtiValue)
        .component('qti-mapping', QtiMapping)
        .component('qti-map-entry', QtiMapEntry)
        .component('qti-interpolation-table', QtiInterpolationTable)
        .component('qti-interpolation-table-entry', QtiInterpolationTableEntry)
        .component('qti-match-table', QtiMatchTable)
        .component('qti-match-table-entry', QtiMatchTableEntry)
        .component('qti-area-mapping', QtiAreaMapping)
      
      // Catalog elements
      app
        .component('qti-catalog', QtiCatalog)
        .component('qti-card', QtiCard)
        .component('qti-card-entry', QtiCardEntry)
        .component('qti-html-content', QtiHtmlContent)
        .component('qti-file-href', QtiFileHref)

      // Outcome Processing Rules
      app
        .component('qti-outcome-condition', QtiOutcomeCondition)
        .component('qti-outcome-processing-fragment', QtiOutcomeProcessingFragment)
        .component('qti-set-outcome-value', QtiSetOutcomeValue)
        .component('qti-exit-test', QtiExitTest)
        .component('qti-lookup-outcome-value', QtiLookupOutcomeValue)
        .component('qti-outcome-if', QtiOutcomeIf)
        .component('qti-outcome-else', QtiOutcomeElse)
        .component('qti-outcome-else-if', QtiOutcomeElseIf)
        .component('qti-set-default-value', QtiSetDefaultValue)

      // Expressions
      app
        .component('qti-base-value', QtiBaseValue)
        .component('qti-correct', QtiCorrect)
        .component('qti-default', QtiDefault)
        .component('qti-variable', QtiVariable)
        .component('qti-match', QtiMatch)
        .component('qti-map-response', QtiMapResponse)
        .component('qti-is-null', QtiIsNull)
        .component('qti-and', QtiAnd)
        .component('qti-or', QtiOr)
        .component('qti-not', QtiNot)
        .component('qti-subtract', QtiSubtract)
        .component('qti-sum', QtiSum)
        .component('qti-random', QtiRandom)
        .component('qti-multiple', QtiMultiple)
        .component('qti-ordered', QtiOrdered)
        .component('qti-equal', QtiEqual)
        .component('qti-equal-rounded', QtiEqualRounded)
        .component('qti-field-value', QtiFieldValue)
        .component('qti-random-float', QtiRandomFloat)
        .component('qti-random-integer', QtiRandomInteger)
        .component('qti-integer-divide', QtiIntegerDivide)
        .component('qti-integer-modulus', QtiIntegerModulus)
        .component('qti-integer-to-float', QtiIntegerToFloat)
        .component('qti-product', QtiProduct)
        .component('qti-index', QtiIndex)
        .component('qti-member', QtiMember)
        .component('qti-delete', QtiDelete)
        .component('qti-substring', QtiSubstring)
        .component('qti-string-match', QtiStringMatch)
        .component('qti-pattern-match', QtiPatternMatch)
        .component('qti-round', QtiRound)
        .component('qti-round-to', QtiRoundTo)
        .component('qti-truncate', QtiTruncate)
        .component('qti-divide', QtiDivide)
        .component('qti-gt', QtiGt)
        .component('qti-gte', QtiGte)
        .component('qti-lt', QtiLt)
        .component('qti-lte', QtiLte)
        .component('qti-max', QtiMax)
        .component('qti-min', QtiMin)
        .component('qti-custom-operator', QtiCustomOperator)
        .component('qti-math-operator', QtiMathOperator)
        .component('qti-math-constant', QtiMathConstant)
        .component('qti-repeat', QtiRepeat)
        .component('qti-stats-operator', QtiStatsOperator)
        .component('qti-gcd', QtiGcd)
        .component('qti-lcm', QtiLcm)
        .component('qti-power', QtiPower)
        .component('qti-any-n', QtiAnyN)
        .component('qti-test-variables', QtiTestVariables)
    }

    onErrorCaptured((err, vm) => {
      console.log('[' + err.name + '][' + vm.$options.name + '] ' + err.message)
      return false
    })

    return {
      processedXml,
      loadTestFromXml,
      endAttempt,
      getTest,
      setTestStateItemState,
      getAllTestStateItemStates,
      handleTestReady,
      handleEndAttemptReady
    }

  }, // setup

  mounted () {
    console.log('[Qti3TestPlayer][Ready]')

    teststore.NotifyTestPlayerReady({
        player: this
      })

    this.$emit('notifyQti3TestPlayerReady', this)
  }
}
</script>

<style>
</style>
