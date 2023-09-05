import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

export function flattenRichText(rt: RichTextItemResponse[]) {
  return rt.map(r => r.plain_text).join('')
}