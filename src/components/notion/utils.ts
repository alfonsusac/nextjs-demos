import { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"




export function validateBlock(unknownblock: PartialBlockObjectResponse | BlockObjectResponse) {
  
  if (
    'type' in unknownblock === false
    || unknownblock.object !== 'block'
  ) {
    console.log("Unknown object type: " + unknownblock)
    throw "Partial/Invalid Block"
  }


  return unknownblock as BlockObjectResponse
}