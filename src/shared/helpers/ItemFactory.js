import axios from 'axios'

export class ItemFactory {
  
  baseUrl = ''
  apiPrefix = ''
  jwt = ''
  projectGuid = ''
  itemUrl = ''
  items = null

  constructor (context = { baseUrl: '', projectGuid: '', apiPrefix: '', token: '' }) {
    this.baseUrl = context.baseUrl
    this.apiPrefix = context.apiPrefix
    this.jwt = context.token
    this.projectGuid = context.projectGuid
    this.items = new Map()
    return this
  }

  constants = {
  }

  /**
   * @description Get an Item Flavor from cache or via Api call.
   * @param {String} identifier - identifier of an item
   * @param {String} flavor - flavor of an item
   */
  async getItemFlavorXml (identifier, flavor) {

    if (identifier == null) {
      console.log('[ItemFactory][Fetch Error: ' + 'Item identifier is null' + ']')
      return this.responseHandler('Item identifier is null', 400, null)
    }

    const itemFlavorKey = `${identifier}_${flavor}`

    const xml = this.items.get(itemFlavorKey)

    if (xml != null) {
      // Found the item in cache
      console.log('[ItemFactory][Fetch Response Cache]', xml)
      return this.responseHandler('Success', 200, xml)     
    }
   
    try {
      // Item not in cache, fetch it
      const uri = `${this.baseUrl}${this.apiPrefix}/${this.projectGuid}/content/items/identifier/${identifier}/flavor/${flavor}`
      console.log('[ItemFactory][Fetch URI]', uri)
      
      let response = await axios.get(
                              uri, {
                              headers: {
                                'Authorization': `Bearer ${this.jwt}`
                              }})

      // Add flavor to the cache
      this.items.set(itemFlavorKey, response.data.xml)

      // Return the xml in the response data
      return this.responseHandler('Success', 200, response.data.xml)

    } catch(error) {
      return this.responseHandler(this.updateErrorMessage(error.message, identifier), error.response.status, null)
    }
  }

  responseHandler (message, status, data) {
    return {
      status: status, 
      message: message, 
      data: data 
    }
  }

  updateErrorMessage (message, identifier) {
    if (message === null) return message
    return message.replace('Request', `Request for Item Identifier [${identifier}]`)
  }
  
}