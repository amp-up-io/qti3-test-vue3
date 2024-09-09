# Amp-up.io QTI 3 Test Component for Vue 3

<div id="top"></div>

[![MIT License][license-shield]][license-url]

<a href="https://site.imsglobal.org/certifications/amp-upio/amp-upio-qti-3-test-player" target="_blank">
<img align="right" src="https://site.imsglobal.org/sites/default/files/media/images/logo_ims/1edtech_trusted-apps-certified.svg" width="187" height="200" border="1" alt="1EdTech Certified">
</a>



The QTI 3 Test Component is a Vue 3 JavaScript component that aims to provide an information model, and a runtime execution model (for Outcome Processing), that encapsulates the best practices and behaviors of the 1EdTech QTI 3 Assessment **Test** specification.

A client application can inject QTI 3 Test XML into QTI 3 Test Component, which parses the QTI 3 Assessment Test XML, thus providing an information model with various methods and properties for inspection back to the client.  QTI 3 Test Component also has methods for injecting item states which can then be used when running Outcome Processing (such as when submission mode is "individual" or "simultaneous").

See the 1EdTech QTI 3 Information Model documentation for more information about the QTI 3 Assessment Test information model and runtime lifecycle.

[IMS Question and Test Interoperability (QTI): Assessment, Section and Item Information Model Version 3.0](https://www.imsglobal.org/sites/default/files/spec/qti/v3/info/index.html)

QTI 3 Test Component is a sub-component of a QTI 3 Test Player Delivery system that has achieved both <a href="https://site.imsglobal.org/certifications/amp-upio/amp-upio-qti-3-test-player" target="_blank">QTI 3 Basic (Level 1) and QTI 3 Advanced (Level 2) "Delivery" Conformance</a> Certification from 1EdTech.



## About The Project

The QTI 3 Test Component has API's, interfaces, and capabilities which encapsulate much of the web component-friendly QTI 3 Assessment Test specification.  Just install the component in your project, inject QTI 3 Assessment Test XML and go!  

<p align="right">(<a href="#top">back to top</a>)</p>



## Getting Started

### 1. Clone the repo
```sh
git clone https://github.com/amp-up-io/qti3-test-vue3.git
```

### 2. Install Node.js >= 20
QTI 3 Test Component for Vue 3 has been built and tested with Node v20.14.0.

### 3. Installation
QTI 3 Test Component for Vue 3 includes a dependency on Vue 3, and a dependency on Vite for bundling.

```sh
npm install
```

### 4. Compiles and hot-reloads for development
```sh
npm run dev
```

### 5. Compiles, minifies, creates package
```sh
npm run build
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage

### 1. Install QTI 3 Test Component into your project

```sh
cd <Project folder where your package.json is located> 
npm install qti3-test-vue3
```

### 2. Import and Use QTI 3 Test Component

```js
import { createApp } from 'vue'
import App from './App.vue'
import Qti3Test from 'qti3-test-vue3'

const app = createApp(App)

app
  .use(Qti3Test)
  .mount('#app')
```

### 3. Load the QTI 3 Test Component into your Page or Template

```html
<Qti3Test
  ref="qti3TestPlayer"
  @notifyQti3TestPlayerReady="handleTestPlayerReady"
  @notifyQti3TestReady="handleTestReady"
  @notifyQti3TestEndAttemptCompleted="handleTestEndAttemptCompleted"
/>
```

<p align="right">(<a href="#top">back to top</a>)</p>


### 4. Listen for the QTI 3 Test Component's 'notifyQti3TestPlayerReady' event

This event signifies that the QTI 3 Test Component is loaded and ready for action.  The following snippet is a sample handler for the `notifyQti3TestPlayerReady` event.  QTI 3 Test Component hands itself as an argument to the `notifyQti3TestPlayerReady` event, thus simplifying further QTI 3 Test Component API calls.

```js
/**
 * @description Event handler for the QTI3TestPlayer component's 'notifyQti3TestPlayerReady'
 * event.  This event is fired upon mounting of the Qti3TestPlayer component.
 *
 * The Qti3TestPlayer is now ready for XML loading.
 * @param {Component} qti3TestPlayer - the Qti3 Test Component itself
 */
handleTestPlayerReady (qti3TestPlayer) {
  // Qti3 Test Component is ready!  Keep a handle on it.
  this.qti3TestPlayer = qti3TestPlayer
},
```

<p align="right">(<a href="#top">back to top</a>)</p>


### 5. Load QTI 3 Assessment Test XML into QTI 3 Test Component

Once QTI 3 Test Component is loaded and ready (see #4 above), QTI 3 Assessment Test XML can be loaded directly into QTI 3 Test Component via the Component's `loadTestFromXML` method which takes two arguments `xml {String}` and `configuration {Object}`.  

```js
// Load QTI 3 Assessment Test XML with a Configuration.  See #5a below for more 
// information about Configurations. Use the 'this.qti3TestPlayer' reference
// saved in the notifyQti3TestPlayerReady event handler.
this.qti3TestPlayer.loadTestFromXml(xml, configuration)
```


#### 5a) About a Configuration

The `configuration` object is used to specify runtime context to QTI 3 Test Component during the test session loaded in `loadTestFromXml`.  A configuration object has the following structure:

```js
configuration: {
  guid: <{String} identifier used to track a test attempt>,
  pnp: <{Object} used to define Personal Needs and Preferences>,
}
```

#### 5b) Constructing a Configuration

The following snippet is an example of how an application can construct a `configuration`.

```js
// Intialize
const configuration = {}

// Stamp an test's tracking guid (if any) onto the configuration
configuration.guid = testAttemptTrackingGuid

// QTI 3 Test Component includes a helper class called 'PnpFactory' which can be used
// to build a Personal Needs and Preferences definition.
// The Default pnp object in the PnpFactory is:
const pnp = {
  textAppearance: {
    colorStyle: 'qti3-player-color-default'
  },
  // Glossary is a universal support turned on (true) by default
  glossaryOnScreen: true,
  // Keyword translation is off ('') by default
  keywordTranslationLanguage: '',
  // Custom SBAC Illustrated Glossary is off (false) by default
  extSbacGlossaryIllustration: false,
  layoutSingleColumn: false // unsupported
}

// Set the configuration's 'pnp' property
configuration.pnp = pnp
 ```

<p align="right">(<a href="#top">back to top</a>)</p>


### 6. Listen for the QTI 3 Test Component's 'notifyQti3TestReady' Event

QTI 3 Test Component triggers a `notifyQti3TestReady` event upon completion of the Component's `loadTestFromXML` method.  The following snippet is a sample handler for the `notifyQti3TestReady` event.

```js
/**
 * @description Event handler for the QTI3 Test Component's 'notifyQti3TestReady'
 * event.  This event is fired upon completion of the qti-assessment-test
 * component's loading of XML.
 * The inner qti-assessment-test component is passed in the event.
 * @param {Component} test - the qti-assessment-test component itself
 */
handleTestReady (test) {
  // The 'test' argument is the qti-assessment-test component
  // with all exposed properties and methods.
  this.test = test
}
```

The same qti-assessment-test component can be retrieved via QTI 3 Test Component's 'getTest()' method: 

```js
/**
 * @description Generate some information about a qti-assessment-test that was
 * loaded from QTI 3 Assessment Test XML.
 * @return {Object} Test information
 */
function getTestInfo () {
  // Get a handle on the inner qti-assessment-test component
  const test = this.qti3TestPlayer.getTest()

  return {
    title: test.getTitle().length === 0 ? '<No Test Title>' : test.getTitle(),
    identifier: test.getIdentifier(),
    parts: test.getTestParts(), // Array of qti-test-parts
    timeLimits: test.getTimeLimits(), // Test qti-time-limits element or null
    rubricBlocks: test.getRubricBlocks() // Array of Test qti-rubric-blocks
  }
}
```

<p align="right">(<a href="#top">back to top</a>)</p>


### 7. Inspect the QTI 3 Assessment Test Information Model

We can visualize any QTI 3 Assessment Test tree of nodes, where the Test encapsulates [1..*] of
Test Parts.  Each Test Part encapsulates [1..*] Sections.  Each Section encapsulates [1..*] of either 
Sub-Sections (**best practice limit** of 1 level depth of Sub-Sections) or Item References.

The following is some sample code which navigates and prints a test's tree structure.

```js
const test = this.qti3TestPlayer.getTest()

// Get the Test's Parts
const parts = test.getTestParts()
parts.forEach((part) => {

  // Print qti-test-part properties
  console.log(
    '[QtiTestPart]', 
    {
      title: part.getTitle().length == 0 ? '<No Test Part Title>' : part.getTitle(),
      identifier: part.getIdentifier(),
      // Part navigation mode
      navigationMode: part.getNavigationMode(),
      // Part submission mode
      submissionMode: part.getSubmissionMode(),
      // Array of qti-assessment-sections
      sections: part.getSections(),
      // Part qti-item-session-control element or null
      sessionControl: part.getItemSessionControl(),
      // Part qti-time-limits element or null
      timeLimits: part.getTimeLimits(),
      // Array of Part qti-rubric-blocks
      rubricBlocks: part.getRubricBlocks()
    }
  )

  // Get the Part's Sections
  const sections = part.getSections()
  sections.forEach((section) => {

    // Print qti-assessment-section properties
    console.log(
      '[QtiAssessmentSection]', 
      {
        title: section.getTitle().length == 0 ? '<No Section Title>' : section.getTitle(),
        identifier: section.getIdentifier(),
        fixed: section.getFixed(),
        visible: section.getVisible(),
        required: section.getRequired(),
        keepTogether: section.getKeepTogether(),
        // Array of RESOLVED (i.e., ordered and selected) item identifiers
        sectionItemIdentifiers: section.getSectionItemIdentifiers(),
        // Map (item identifier is map key) of qti-assessment-item-ref's
        sectionItemsMap: section.getSectionItemsMap(),
        // Section qti-item-session-control element or null
        sessionControl: section.getItemSessionControl(),
        // Section qti-selection element or null
        selection: section.getSelection(),
        // Section qti-ordering element or null
        ordering: section.getOrdering(),
        // Section qti-time-limits element or null
        timeLimits: section.getTimeLimits(),
        // Array of section qti-rubric-blocks
        rubricBlocks: section.getRubricBlocks()
      }
    )

    // Print all of a Section's RESOLVED Item Ref's - in the proper order
    const sectionItemIdentifiers = section.getSectionItemIdentifiers()
    sectionItemIdentifiers.forEach((itemIdentifier) => {

      // Pull the full qti-assessment-item-ref component from the sectionItemsMap
      const itemRef = section.getSectionItemsMap().get(itemIdentifier)
      // Print qti-assessment-item-ref properties
      console.log(
        '[QtiAssessmentItemRef]', 
        {
          identifier: itemRef.getIdentifier(),
          fixed: itemRef.getFixed(),
          required: itemRef.getRequired(),
          href: itemRef.getHref()
          // Item Ref 'category' attribute or null
          category: itemRef.getCategory(),
          // Item Ref qti-item-session-control element or null
          sessionControl: itemRef.getItemSessionControl(),
          // Item Ref qti-time-limits element or null
          timeLimits: itemRef.getTimeLimits(),
        }
      )

    }) // end sectionItemIdentifiers.forEach

  }) // end section.forEach

}) // end part.forEach
```

<p align="right">(<a href="#top">back to top</a>)</p>


### 8. Running Outcome Processing

After Test XML is loaded, and depending on a Test Part's `submission-mode` attribute, a test controller may choose to execute the Test's qti-outcome-processing code (if any).  This is accomplished by invoking QTI 3 Test Component's `endAttempt` method.  For example, when a Test Part's `submission-mode="individual"`, a test controller must call `endAttempt`.  When a Test Part's `submission-mode="simultaneous"`, a test controller must call `endAttempt` only upon completion of the Test Part.

#### 8a) Calling endAttempt and handling the notifyQti3TestEndAttemptCompleted event

Calling `endAttempt` method _executes outcome processing_ with the currently-loaded Part > Section > Item States loaded into QTI 3 Test Component, and produces the state of all test variables.  QTI 3 Test Component supports the _full QTI 3 outcome processing_ expression vocabulary.

See section **9) Loading Part > Section > Item State** below for more information.

The `endAttempt` method may take a considerable amount of time to complete.  QTI 3 Test Component triggers the `notifyQti3TestEndAttemptCompleted` event upon completion of an `endAttempt` method call.

Wire a handler to the `notifyQti3TestEndAttemptCompleted` event.

```html
<Qti3Test
  ref="qti3TestPlayer"
  @notifyQti3TestEndAttemptCompleted="handleTestEndAttemptCompleted"
/>
```

```js
// Call the endAttempt method, passing an optional string/target action that will be
// echoed back in the notifyQti3TestEndAttemptCompleted event payload.  The string/target action
// can be useful to a test controller as a way to track the context for the 
// notifyQti3TestEndAttemptCompleted callback.
this.qti3TestPlayer.endAttempt('navigateNextItem')
```

```js
/**
 * @description Example event handler for the QTI3 Test Component's 'notifyQti3TestEndAttemptCompleted'
 * event.  This event is fired upon completion of the endAttempt method.
 * @param {Object} data - the test's state, including outcomes from outcome processing
 */
handleTestEndAttemptCompleted (data) {
  // 'data' contains the test state in a 'state' property, including outcome variable values.
  // 'data' also has a 'target' property that echos the value (if any) of the target string
  // parameter passed into the originaging endAttempt call.
  // ... do something ...
  console.log('[EndAttempt Completed], Test State:', data.state)
}
```

<p align="right">(<a href="#top">back to top</a>)</p>


### 9. Loading Part > Section > Item State

Prior to calling QTI 3 Test Component's `endAttempt` method, a test controller should load or update Item State.  This is accomplished via QTI 3 Test Component's `setTestStateItemState` method.

```js
/**
 * @description Method to inject an item state by partIdentifier, section identifier, and item identifier.
 * @param {String} partIdentifier - the part identifier
 * @param {String} sectionIdentifier - the section identifier
 * @param {String} itemIdentifier - the item identifier
 * @param {Object} itemState - a state object built
 *                             from an ItemStateFactory
 */
setTestStateItemState(partIdentifier, sectionIdentifier, itemIdentifier, itemState)
```

The following is some sample script that loads two Item States into QTI 3 Test Component.  Then Outcome Processing is executed via QTI 3 Test Component's `endAttempt` method.

```js
/**
 * @description Utility function to load a Part > Section > Item State into QTI 3 Test component.
 */
function setTestState (testPartIdentifier, state) {
  // Load the state into the TestPlayer
  const identifiers = state.guid.split('~~')
  const sectionIdentifier = identifiers[0]
  const itemIdentifier = identifiers[1]
  this.qti3TestPlayer.setTestStateItemState(testPartIdentifier,sectionIdentifier,itemIdentifier,state)
}

// Construct item 1 state
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
      "value": 12,
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

// Load testPart-1 > assessmentSection-1 >  t1-outcome-declaration-item-1 state
setTestState('testPart-1', item1State)

// Construct item 3 state
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
      "value": 5,
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

// Load testPart-1 > assessmentSection-1 >  t1-outcome-declaration-item-3 state
setTestState('testPart-1', item3State)

// Execute Outcome Processing!  The results/outcomes will be passed
// in the notifyQti3TestEndAttemptCompleted handler.
this.qti3TestPlayer.endAttempt()
```

<p align="right">(<a href="#top">back to top</a>)</p>


### 10. Inspect Outcomes

Outcome variable values are passed as a parameter in the `notifyQti3TestEndAttemptCompleted` event.  To inspect
outcome variable values, wire a handler to the `notifyQti3TestEndAttemptCompleted` event.  Then examine the
`state` property of the data passed with the `notifyQti3TestEndAttemptCompleted` event.

```html
<Qti3Test
  ref="qti3TestPlayer"
  @notifyQti3TestEndAttemptCompleted="handleTestEndAttemptCompleted"
/>
```

```js
/**
 * @description Example event handler for the QTI 3 Test Component's 'notifyQti3TestEndAttemptCompleted'
 * event.  This event is fired upon completion of the endAttempt method.
 * @param {Object} data - the test's state, including outcomes from outcome processing
 */
handleTestEndAttemptCompleted (data) {
  // 'data' contains the test state in a 'state' property, including outcome variable values.
  // 'data' also has a 'target' property that echos the value (if any) of the target string
  // parameter passed into the originaging endAttempt call.
  // ... do something ...
  console.log('[EndAttempt Completed], Test State:', data.state)
  const testState = data.state
  const target = data.target
  // Echo all Outcome variables in the Test State
  testState.outcomeVariables.forEach((outcomeVariable) => {
    console.log(`[Outcome][${outcomeVariable.identifier}][Value=${outcomeVariable.value}]`)
  })
}
```

<p align="right">(<a href="#top">back to top</a>)</p>



## Roadmap

The QTI3 Test Component development roadmap includes all features and capabilities included in the QTI 3 Assessment **Test** specification.

- [x] Support for Test, Part, multi-Part, Section, Item-Ref elements
- [x] Support for all Outcome Processing Rules
- [x] Support for all Outcome Processing Expressions
- [x] Support for Section Selection and Ordering elements
- [x] Support for Item Session Control elements at the Part, Section, Item-Ref levels
- [x] Support for Time Limits elements at the Test, Part, Section levels
- [x] Support for Rubric Block elements at the Test, Part, Section levels
- [x] Support for Stylesheet elements
- [ ] Test Feedback
- [ ] Item-Ref Pre-Condition Rules
- [ ] Item-Ref Branch Rules
- [ ] Item-Ref Variable Mapping Support
- [ ] Item-Ref Weight Support
- [ ] Item-Ref Template Default Support
- [ ] Catalog Info Support in Test Feedback and Test Rubric Blocks
- [ ] Printed Variable Support in Test Feedback and Test Rubric Blocks
- [ ] Restore Test State
- [x] Set Item State API Examples


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



## Built With

The QTI3 Test Component is built with the Vue 3.4 (v3.4.34) framework and Vite.

* [Vue.js](https://vuejs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Paul Grudnitski - paul.grudnitski@amp-up.io

Project Link: [https://github.com/amp-up-io/qti3-test-vue3](https://github.com/amp-up-io/qti3-test-vue3)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

This component would not be possible were it not for a fortuitous decision by the aQTI Task Force (the original name of the QTI 3 Working Group) - meeting at CITO headquarters in Arnhem, NE, January 2015 - to make the aQTI / QTI 3 specification "web component friendly".

<p align="right">(<a href="#top">back to top</a>)</p>


[license-shield]: https://img.shields.io/github/license/amp-up-io/qti3-test-vue3?label=License&style=for-the-badge
[license-url]: https://github.com/amp-up-io/qti3-test-vue3/blob/master/LICENSE

