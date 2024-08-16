<template>
  <section>
    <header>
      <TopBar
        ref="topbar"
        @initiateEndAttempt="handleInitiateTestEndAttempt"
      />
    </header>
    
    <main id="main" class="test-controller-container container-fluid">
      <div class="test-controller-content">
      </div>
    </main>

    <div>
      <Qti3Test
        ref="qti3TestPlayer"
        @notifyQti3TestPlayerReady="handleTestPlayerReady"
        @notifyQti3TestReady="handleTestReady"
        @notifyQti3TestEndAttemptCompleted="handleTestEndAttemptCompleted"
      />
    </div>

  </section>
</template>

<script>
import TopBar from '@/shared/components/TopBar.vue'
import Qti3Test from '@/components/Qti3Test.vue'
import { ItemFactory } from '@/shared/helpers/ItemFactory'
import { PnpFactory } from '@/shared/helpers/PnpFactory'
import { SessionControlFactory } from '@/shared/helpers/SessionControlFactory'

export default {
  name: 'App',

  components: {
    TopBar,
    Qti3Test
  },

  inject: ['$VUE_APP_CONTEXT'],

  data () {
    return {
      /*
       * The test context loaded by the webpage
       */
      appContext: {
        // Base URL for making api calls
        baseUrl: '',
        // Api prefix string for content api calls
        apiPrefix: '',
        // Api jwt
        token: '',
        // Project containing the test
        projectGuid: '',
        // Tracking session guid
        sessionGuid: '0',
        // Test identifier
        identifier: '',
        // Test QTI 3 xml
        xml: '',
      },
      /*
       * Initial player chrome settings
       */
      containerClass: 'qti3-player-container-fluid',
      colorClass: 'qti3-player-color-default',
      containerPaddingClass: 'qti3-player-container-padding-2',

      /*
       * The currently displayed Panel
       */
      currentPanel: '',

      /*
       * Instance of the QTI 3 Test Player
       */
      qti3TestPlayer: null,

      /*
       * State info for currently loaded Test
       */
      testTitle: 'Loading Test...',
      testIdentifier: '',
      testParts: [],
      countTestParts: 0,
      currentPartIndex: 0,

      /*
       * State info for currently loaded Test Part
       */
      partTitle: '',
      partIdentifier: '',
      partNavigationMode: '',
      partSubmissionMode: '',
      partSections: [],
      countPartSections: 0,
      currentSectionIndex: 0,

      /*
       * State info for currently loaded Section
       */
      sectionTitle: '',
      sectionIdentifier: '',
      sectionRequired: '',
      sectionFixed: '',
      sectionVisible: '',
      sectionKeepTogether: '',
      sectionItemIdentifiers: [],
      countSectionItems: 0,
      currentItemIndex: 0,

      // Usually the same as countSectionItems, but may be overriden
      countSectionMaxItems: 0,

      /*
       * Item Factory
       */
      itemFactory: null,
      /*
       * Save/Restore a candidate's item state here
       */
      itemStates: null,
      /*
       * Context configuration
       */
      cfg: null,
      /*
       * Test's Item Session Control Factory
       */
      sessionControl: null,
      /*
       * Test's Pnp Factory
       */
      pnp: null,
      /*
       * PCI configuration default
       */
      pciContext: { renderer2p0: './assets/pci/pci.html' }
    }
  },

  methods: {

    initialize () {
      // Initialize item factory
      this.itemFactory = new ItemFactory(this.appContext)
      // Initialize item state hashmap
      this.itemStates = new Map()
    },

    loadTestFromXml (sessionGuid, xml) {
      if (xml === null) return

      // Build a configuration
      const configuration = this.getTestConfiguration(sessionGuid)

      // Load the test with the configuration
      this.qti3TestPlayer.loadTestFromXml(xml, configuration)
    },

    getAppContext () {
      console.log('$VUE_APP_CONTEXT',this.$VUE_APP_CONTEXT)
      if (this.$VUE_APP_CONTEXT === null) {
        return
      }

      const context = this.$VUE_APP_CONTEXT
      this.appContext.baseUrl = context?.summary?.baseUrl || ''
      this.appContext.apiPrefix = context?.summary?.apiPrefix || ''
      this.appContext.token = context?.summary?.token || ''
      this.appContext.xml = context?.summary?.xml || ''
      this.appContext.sessionGuid = context?.summary?.sessionGuid || '0'
      this.appContext.projectGuid = context?.summary?.projectGuid || ''
      this.appContext.identifier = context?.summary?.identifier || ''

      // Save the context configuration
      this.cfg = context?.cfg || null
      
      // Save the pci context
      this.pciContext.renderer2p0 = context?.cfg?.pciContext?.renderer2p0 || './assets/pci/pci.html'

      // Load pnp
      this.pnp = new PnpFactory()
      // Load sessionControl
      this.sessionControl = new SessionControlFactory()
    },

    getTestConfiguration (sessionGuid) {
      const configuration = {}

      // IMPORTANT: Stamp the test's tracking session onto the configuration
      configuration.guid = sessionGuid
      configuration.pnp = this.pnp.getPnp()

      return configuration
    },

    /**
     * @description Event handler for the QTI3TestPlayer component's 'notifyQti3TestPlayerReady'
     * event.  This event is fired upon mounting of the Qti3TestPlayer component.
     *
     * The Qti3TestPlayer is now ready for XML loading.
     * @param {Component} qti3TestPlayer - the Qti3TestPlayer component itself
     */
    handleTestPlayerReady (qti3TestPlayer) {
      this.qti3TestPlayer = qti3TestPlayer

      // Load the test
      this.loadTestFromXml(this.appContext.sessionGuid, this.appContext.xml)
    },

    /**
     * @description Event handler for the QTI3TestPlayer component's 'notifyQti3TestReady'
     * event.  This event is fired upon completion of the qti-assessment-test
     * component's loading of XML.
     */
    handleTestReady () {
      const assessmentTest = this.qti3TestPlayer.getTest()
      this.testTitle = assessmentTest.getTitle().length == 0 ? '<No Test Title>' : assessmentTest.getTitle()
      this.testIdentifier = assessmentTest.getIdentifier()
      this.testParts = assessmentTest.getTestParts()
      this.countTestParts = this.testParts.length
      this.currentPartIndex = 0
    },

    handleInitiateTestEndAttempt () {
      
      const item1State = {
        "identifier": "t1-outcome-declaration-item-1",
        "guid": "assessmentSection-1~~t1-outcome-declaration-item-1",
        "contextVariables": [
          {
            "identifier": "QTI_CONTEXT",
            "cardinality": "record",
            "baseType": null,
            "value": {}
          }
        ],
        "responseVariables": [
          {
            "identifier": "numAttempts",
            "cardinality": "single",
            "baseType": "integer",
            "value": 1,
            "state": null
          },
          {
            "identifier": "duration",
            "cardinality": "single",
            "baseType": "time",
            "value": 0,
            "state": null
          },
          {
            "identifier": "RESPONSE",
            "cardinality": "single",
            "baseType": "identifier",
            "value": "correct",
            "state": {
                "order": [
                    "correct",
                    "incorrect"
                ]
            },
            "correctResponse": "correct"
          }
        ],
        "outcomeVariables": [
          {
            "identifier": "SCORE",
            "cardinality": "single",
            "baseType": "float",
            "value": 1
          },
          {
            "identifier": "MAXSCORE",
            "cardinality": "single",
            "baseType": "float",
            "value": 1
          },
          {
            "identifier": "completionStatus",
            "cardinality": "single",
            "value": "not_attempted"
          }
        ],
        "templateVariables": [],
        "validationMessages": []
      }

      this.setTestState ('testPart-1', item1State)

      const item3State = {
        "identifier": "t1-outcome-declaration-item-3",
        "guid": "assessmentSection-1~~t1-outcome-declaration-item-3",
        "contextVariables": [
          {
            "identifier": "QTI_CONTEXT",
            "cardinality": "record",
            "baseType": null,
            "value": {}
          }
        ],
        "responseVariables": [
          {
            "identifier": "numAttempts",
            "cardinality": "single",
            "baseType": "integer",
            "value": 1,
            "state": null
          },
          {
            "identifier": "duration",
            "cardinality": "single",
            "baseType": "time",
            "value": 0,
            "state": null
          },
          {
            "identifier": "RESPONSE",
            "cardinality": "single",
            "baseType": "identifier",
            "value": "correct",
            "state": {
                "order": [
                    "correct",
                    "incorrect"
                ]
            },
            "correctResponse": "correct"
          }
        ],
        "outcomeVariables": [
          {
            "identifier": "SCORE",
            "cardinality": "single",
            "baseType": "float",
            "value": 1
          },
          {
            "identifier": "MAXSCORE",
            "cardinality": "single",
            "baseType": "float",
            "value": 1
          },
          {
            "identifier": "completionStatus",
            "cardinality": "single",
            "value": "not_attempted"
          }
        ],
        "templateVariables": [],
        "validationMessages": []
      }

      this.setTestState ('testPart-1', item3State)

      this.qti3TestPlayer.endAttempt()
    },

    handleTestEndAttemptCompleted () {
      // NOOP
    },

    setTestState (testPartIdentifier, state) {
      // Load the state into the TestPlayer
      const identifiers = state.guid.split('~~')
      const sectionIdentifier = identifiers[0]
      const itemIdentifier = identifiers[1]
      console.log(`[Controller][SetTestStateItemState][${testPartIdentifier}][${sectionIdentifier}][${itemIdentifier}]`)
      
      this.qti3TestPlayer
        .setTestStateItemState(
          testPartIdentifier,
          sectionIdentifier,
          itemIdentifier, 
          state)
    },

    setTestPlayerSectionItemState(state) {
      const identifiers = state.guid.split('~~')
      const sectionIdentifier = identifiers[0]
      const itemIdentifier = identifiers[1]
      console.log(`[Controller][SetTestStateItemState][${sectionIdentifier}][${itemIdentifier}]`)
    },

    setTestStateItemState (state) {
      console.log('[Controller][SetItemState][' + state.guid + ']', state)
      this.itemStates.set(state.guid, state)
    },

    getTestStateItemState (guid) {
      console.log('[Controller][GetItemState][' + guid + ']', this.itemStates.get(guid))
      return this.itemStates.get(guid)
    },

    getItemStateTrackingGuid (sectionIdentifier, itemIdentifier) {
      return `${sectionIdentifier}~~${itemIdentifier}`
    },

    computeItemSubmissionMode () {
      // Return the current part's submission mode
      return this.partSubmissionMode
    },

    getItemConfiguration (guid) {
      const configuration = {}

      // Fetch prior state from Test State
      const state = this.getTestStateItemState(guid)
      if (typeof state !== 'undefined') configuration.state = state

      // IMPORTANT: Stamp the item's tracking guid onto the configuration
      configuration.guid = guid
      configuration.pnp = this.pnp.getPnp()
      configuration.sessionControl = this.sessionControl.getSessionControl()

      // Add pciContext to configuration
      configuration.pciContext = this.pciContext

      return configuration
    },

    isSubmissionModeIndividual () {
      return this.partSubmissionMode === 'individual'
    },

    isNavigationModeLinear () {
      return this.partNavigationMode === 'linear'
    },

    displayTestAlertEvent (event) {
      console.log('displayTestAlertEvent, event:', event)
    },

  },

  created () {
    this.getAppContext()
  },

  mounted () {
    this.initialize()
  }

}
</script>

<style>
</style>
