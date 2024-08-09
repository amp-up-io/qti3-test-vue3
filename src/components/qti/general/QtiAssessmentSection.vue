<template>
  <div ref="section" class="qti-assessment-section">
    <slot></slot>
  </div>
</template>

<script>
/*
 * An assessment section groups together individual item references and/or sub-sections. 
 * A section can be composed of any hierarchy/combination of items and sections. A section
 * can only reference an item using a qti-assessment-item-ref object but it may contain 
 * or reference other sections. The grouping of the sections/items depends upon the 
 * nature of the parent section i.e. each section can be used for different grouping 
 * criteria e.g. organizational, pedagogic, etc.
 */
import QtiValidationException from '@/components/qti/exceptions/QtiValidationException'
import QtiParseException from '@/components/qti/exceptions/QtiParseException'
import QtiAttributeValidation from '@/components/qti/validation/QtiAttributeValidation'

const qtiAttributeValidation = new QtiAttributeValidation()

export default {
  name: 'QtiAssessmentSection',
  
  props: {
    identifier: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    /*
     * If a child element is required it must appear (at least once) in the selection. 
     * It is an error if a section contains a selection rule that selects fewer child 
     * elements than the number of required elements it contains.
     */
    required: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * If a child element is fixed it must never be shuffled. When used in combination 
     * with a selection rule fixed elements do not have their position fixed until after 
     * selection has taken place. For example, selecting 3 elements from {A,B,C,D} without
     * replacement might result in the selection {A,B,C}. If the section is subject to 
     * shuffling but B is fixed then permutations such as {A,C,B} are not allowed 
     * whereas permutations like {C,B,A} are.
     */
    fixed: {
      type: String,
      required: false,
      default: 'false'
    },
    /*
     * A visible section is one that is identifiable by the candidate. For example, 
     * delivery engines might provide a hierarchical view of the test to aid navigation. 
     * In such a view, a visible section would be a visible node in the hierarchy. 
     * Conversely, an invisible section is one that is not visible to the 
     * candidate - the child elements of an invisible section appear to the candidate 
     * as if they were part of the parent section (or testPart). The visibility of a 
     * section does not affect the visibility of its child elements. The visibility 
     * of each section is determined solely by the value of its own visible attribute.
     */
    visible: {
      type: String,
      required: true
    },
    /*
     * An invisible section with a parent that is subject to shuffling can specify 
     * whether or not its children, which will appear to the candidate as if they 
     * were part of the parent, are shuffled as a block or mixed up with the other 
     * children of the parent section.
     */
    keepTogether: {
      type: String,
      required: false,
      default: 'true'
    }
  },
  
  data () {
    return {
      // attributes converted to booleans
      isRequired: false,
      isFixed: false,
      isVisible: true,
      isKeepTogeteher: true,

      // child elements
      preConditions: [],
      branchRules: [],
      itemSessionControl: null,
      timeLimits: null,
      adaptiveSelection: null,
      selection: null,
      ordering: null,
      rubricBlocks: [],
      sectionParts: [],

      // keep a list of all item identifiers
      itemIdentifiers: [],

      // keep a handle on the items
      itemsMap: new Map(),

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

    getRequired () {
      return this.required
    },

    getFixed () {
      return this.fixed
    },

    getVisible () {
      return this.visible
    },

    getKeepTogether () {
      return this.keepTogether
    },

    getSections () {
      return this.sections
    },

    getPreConditions () {
      return this.preConditions
    },

    getBranchRules () {
      return this.branchRules
    },

    getItemSessionControl () {
      return this.itemSessionControl
    },

    getTimeLimits () {
      return this.timeLimits
    },

    getAdaptiveSelection () {
      return this.adaptiveSelection
    },

    getSelection () {
      return this.selection
    },

    getOrdering () {
      return this.ordering
    },

    getRubricBlocks () {
      return this.rubricBlocks
    },

    getSectionParts () {
      return this.sectionParts
    },

    getSectionItemIdentifiers () {
      return this.itemIdentifiers
    },

    getSectionItemsMap () {
      return this.itemsMap
    },

    setSectionItemIdentifiers (itemIdentifiers) {
      this.itemIdentifiers = itemIdentifiers
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

    isAdaptiveSelection (tag) {
      if (tag === 'qti-adaptive-selection') return true
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

    isItemRef (tag) {
      if (tag === 'qti-assessment-item-ref') return true
      return false
    },

    isSelection (tag) {
      if (tag === 'qti-selection') return true
      return false
    },

    isOrdering (tag) {
      if (tag === 'qti-ordering') return true
      return false
    },

    getIsRequired () {
      return this.isRequired
    },

    getIsFixed () {
      return this.isFixed
    },

    getIsVisible () {
      return this.isVisible
    },

    selectItems () {
			let selectionCount = this.getSelectionCount()
      const isShuffle = this.getOrderingShuffle()

			const requiredItems = []
			const optionalItems = []
			
			if (selectionCount > 0)	{

        // Explicit selection count
				// Get all required items first.

        this.sectionParts.forEach((sectionPart) => {
          const tag = qtiAttributeValidation.kebabCase(sectionPart.$options.name)
          if (this.isItemRef(tag)) {

            const identifier = sectionPart.getIdentifier()

            // Add the required item, decrement selectionCount
            if (sectionPart.getIsRequired()) {

              // Only add to requiredItems if selectionCount remains greater than 0
              if (selectionCount > 0) {
                requiredItems.push(identifier)
                selectionCount--
              }

            } else {
              // Optional item
              optionalItems.push(identifier)
            }

          } else if (this.isSection(tag)) {
            sectionPart.getSectionItemIdentifiers().forEach((identifier) => {
              requiredItems.push(identifier)
            })
          }
        })
        
        // Now select random items from optional pool up until we have reached 
        // our selection count
        for (let r = 0; r < selectionCount; r++) {
          let item = this.getRandomItem(optionalItems)
          requiredItems.push(item)
          optionalItems.splice(optionalItems.indexOf(item), 1)
        }
				
			} else {

        // SelectionCount == 0  - Select ALL
        this.sectionParts.forEach((sectionPart) => {
          const tag = qtiAttributeValidation.kebabCase(sectionPart.$options.name)
          if (this.isItemRef(tag)) {
            requiredItems.push(sectionPart.getIdentifier())
          } else if (this.isSection(tag)) {

            // TODO: Check the Section's visible attribute
            // For now, just add the nested Section's items
            sectionPart.getSectionItemIdentifiers().forEach((identifier) => {
              requiredItems.push(identifier)
            })

          }
        })

      }

      this.setSectionItemIdentifiers(
        isShuffle
          ? this.shuffleItemIdentifiers(requiredItems)
          : requiredItems)
    },

    /**
     * @description Build a section's itemsMap from an array of item identifiers.
     * @param {*} identifierArray the array of item identifiers
     */
    createSectionItemsMap (identifierArray) {
      for (let i=0; i <= identifierArray.length; i++) {

        const identifier = identifierArray[i]

        // sectionParts may be an item ref or a nested section
        this.sectionParts.forEach((sectionPart) => {
          const tag = qtiAttributeValidation.kebabCase(sectionPart.$options.name)
          if (this.isItemRef(tag)) {
            
            // sectionPart is an item
            if (sectionPart.getIdentifier() === identifier) {
              this.itemsMap.set(identifier, sectionPart)
            }

          } else if (this.isSection(tag)) {
            
            // sectionPart is a nested section.  Search for the current identifier in
            // in the section's itemMap.
            const sectionItem = sectionPart.getSectionItemsMap().get(identifier)
            if (typeof sectionItem !== 'undefined') {
              this.itemsMap.set(identifier, sectionItem)
            }

          }
        })
      }
    },
    
    getRandomItem (itemArray) {
      if (itemArray.length === 0) return null
      return itemArray[Math.floor(Math.random() * itemArray.length)]
    },

    shuffleItemIdentifiers (itemIdentifierArray) {
      const shuffledItems = []

      for (let i=0; i <= itemIdentifierArray.length; i++) {
        const itemIdentifier = this.getRandomItem(itemIdentifierArray)
        shuffledItems.push(itemIdentifier)
        itemIdentifierArray.splice(itemIdentifierArray.indexOf(itemIdentifier), 1)
      }

      return shuffledItems
    },

    getSelectionCount () {
      if (this.getSelection() === null) return 0
      return this.getSelection().getSelect()
    },

    getOrderingShuffle () {
      if (this.getOrdering() === null) return false
      return this.getOrdering().getShuffle()
    },

    /**
     * Iterate through the child nodes:
     * qti-pre-condition (0-*)
     * qti-branch-rule (0-*)
     * qti-item-session-control (0-1)
     * qti-time-limits (0-1)
     * qti-adaptive-selection (0-1)
     * qti-selection (0-1)
     * qti-ordering (0-1)
     * qti-rubric-block (0-*)
     * qti-assessment-section (0-*)
     * qti-assessment-item-ref (0-*)
     */
    validateChildren () {
        
      if (!this.$slots.default) return

      let countBranchRule = 0
      let countItemSessionControl = 0
      let countTimeLimits = 0
      let countAdaptiveSelection = 0
      let countSelection = 0
      let countOrdering = 0
      let countRubricBlock = 0
      let countSection = 0
      let countItemRef = 0
      
      this.$slots.default().forEach((slot) => {

        if (qtiAttributeValidation.isValidSlot(slot)) {
          const tag = qtiAttributeValidation.kebabCase(slot.type.name)
          if (this.isPreCondition(tag)) {

            if ((countBranchRule > 0) ||
                (countItemSessionControl > 0) ||
                (countTimeLimits > 0) ||
                (countAdaptiveSelection > 0) ||
                (countSelection > 0) ||
                (countOrdering > 0) ||
                (countRubricBlock > 0) ||
                (countSection > 0) ||
                (countItemRef > 0)) {
              throw new QtiValidationException('Invalid qti-pre-condition child node.  Must preceed all other qti-assessment-section child nodes')
            }
  
          } else if (this.isBranchRule(tag)) {
  
            if ((countItemSessionControl > 0) ||
                (countTimeLimits > 0) ||
                (countAdaptiveSelection > 0) ||
                (countSelection > 0) ||
                (countOrdering > 0) ||
                (countRubricBlock > 0) ||
                (countSection > 0) ||
                (countItemRef > 0)) {
              throw new QtiValidationException('Invalid qti-branch-rule child node.  Must preceed session-control, time-limits, adaptive-selection, selection, ordering, rubric-block, section, and item-ref child nodes')
            }

            countBranchRule += 1
            
          } else if (this.isItemSessionControl(tag)) {
                
            if ((countTimeLimits > 0) ||
                (countAdaptiveSelection > 0) ||
                (countSelection > 0) ||
                (countOrdering > 0) ||
                (countRubricBlock > 0) ||
                (countSection > 0) ||
                (countItemRef > 0)) {
              throw new QtiValidationException('Invalid qti-item-session-control child node.  Must preceed time-limits, adaptive-selection, selection, ordering, rubric-block, section, and item-ref child nodes')
            }

            countItemSessionControl += 1

          } else if (this.isTimeLimits(tag)) {
  
            if ((countAdaptiveSelection > 0) ||
                (countSelection > 0) ||
                (countOrdering > 0) ||
                (countRubricBlock > 0) || 
                (countSection > 0) ||
                (countItemRef > 0)) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Must preceed adaptive-selection, selection, ordering, rubric-block, section, and item-ref child nodes')
            }

            if (countTimeLimits == 1) {
              throw new QtiValidationException('Invalid qti-time-limits child node.  Maximum of 1 time limits child node permitted in a section')
            }

            countTimeLimits += 1

          } else if (this.isAdaptiveSelection(tag)) {
            
            if ((countSelection > 0) ||
                (countOrdering > 0) ||
                (countRubricBlock > 0) ||
                (countSection > 0) ||
                (countItemRef > 0)) {
                throw new QtiValidationException('Invalid qti-adaptive-selection child node.  Must preceed selection, ordering, rubric-block, section, and item-ref child nodes')
            }
            
            if (countAdaptiveSelection == 1) {
              throw new QtiValidationException('Invalid qti-adaptive-selection child node.  Maximum of 1 adaptive selection child node permitted in a section')
            }
            
            countAdaptiveSelection += 1

          } else if (this.isSelection(tag)) {
            
            if ((countOrdering > 0) ||
                (countRubricBlock > 0) ||
                (countSection > 0) ||
                (countItemRef > 0)) {
                throw new QtiValidationException('Invalid qti-selection child node.  Must preceed ordering, rubric-block, section, and item-ref child nodes')
            }
            
            if (countAdaptiveSelection == 1) {
              throw new QtiValidationException('Invalid qti-selection child node.  Maximum of 1 selection child node permitted in a section')
            }
            
            countSelection += 1

          } else if (this.isOrdering(tag)) {
            
            if ((countRubricBlock > 0) ||
                (countSection > 0) ||
                (countItemRef > 0)) {
                throw new QtiValidationException('Invalid qti-ordering child node.  Must preceed rubric-block, section, and item-ref child nodes')
            }
            
            if (countAdaptiveSelection == 1) {
              throw new QtiValidationException('Invalid qti-ordering child node.  Maximum of 1 ordering child node permitted in a section')
            }
            
            countOrdering += 1

          } else if (this.isRubricBlock(tag)) {
        
            if ((countSection > 0) ||
                (countItemRef > 0)) {
              throw new QtiValidationException('Invalid qti-rubric-block child node.  Must preceed section, and item-ref child nodes')
            }
            
            countRubricBlock += 1

          } else if (this.isSection(tag)) {
            
            countSection += 1

          } else if (this.isItemRef(tag)) {
            
            countItemRef += 1

          } else {
            // If it's not a pre-condition, branch-rule, rubric-block, time-limits,
            // section, section-ref, or item-session-control node, it does not 
            // belong here.
            throw new QtiValidationException('Invalid child node: "' + tag + '"')
          }
  
        }

      })

      // All good.  Save off our children.
      this.processChildren()

      // Compute this section's items
      this.selectItems()

      // Build the final section items map
      this.createSectionItemsMap(this.getSectionItemIdentifiers())
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
        } else if (this.isAdaptiveSelection(tag)) {
          this.adaptiveSelection = node.component.proxy
        } else if (this.isSelection(tag)) {
          this.selection = node.component.proxy
        } else if (this.isOrdering(tag)) {
          this.ordering = node.component.proxy
        } else if (this.isRubricBlock(tag)) {
          this.rubricBlocks.push(node.component.proxy)
        } else if (this.isSection(tag) || this.isItemRef(tag)) {
          this.sectionParts.push(node.component.proxy)
        }
      })
    }
    
  },
  
  created () {
    try {
      qtiAttributeValidation.validateIdentifierAttribute(this.identifier)
      // Validate required, fixed, visible, keepTogether
      this.isRequired = qtiAttributeValidation.validateBooleanAttribute ('required', this.required, false, false)
      this.isFixed = qtiAttributeValidation.validateBooleanAttribute ('fixed', this.fixed, false, false)
      this.isVisible = qtiAttributeValidation.validateBooleanAttribute ('visible', this.visible, true, true)
      this.isKeepTogether = qtiAttributeValidation.validateBooleanAttribute ('keep-together', this.keepTogether, false, true)
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

        console.log('[' + this.$options.name + '][Items]', this.getSectionItemIdentifiers())
        console.log('[' + this.$options.name + '][ItemsMap]', this.getSectionItemsMap())
        console.log('[' + this.$options.name + '][Identifier]', this.identifier)
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
