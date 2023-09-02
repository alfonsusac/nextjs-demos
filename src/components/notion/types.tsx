import { BulletedListItemBlockObjectResponse, NumberedListItemBlockObjectResponse, ToDoBlockObjectResponse, Heading1BlockObjectResponse, Heading2BlockObjectResponse, Heading3BlockObjectResponse, ParagraphBlockObjectResponse, CodeBlockObjectResponse, ToggleBlockObjectResponse, QuoteBlockObjectResponse, DividerBlockObjectResponse, EquationBlockObjectResponse, CalloutBlockObjectResponse, ColumnListBlockObjectResponse, ColumnBlockObjectResponse, TableBlockObjectResponse, TableRowBlockObjectResponse, BookmarkBlockObjectResponse, ImageBlockObjectResponse, VideoBlockObjectResponse, PdfBlockObjectResponse, AudioBlockObjectResponse, FileBlockObjectResponse, EmbedBlockObjectResponse, LinkPreviewBlockObjectResponse, SyncedBlockBlockObjectResponse, ChildPageBlockObjectResponse, ChildDatabaseBlockObjectResponse, BreadcrumbBlockObjectResponse, TableOfContentsBlockObjectResponse, LinkToPageBlockObjectResponse, TemplateBlockObjectResponse, UnsupportedBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { NotionASTNode } from "./parser/node"

type OmitRichText<T> = Omit<T, 'rich_text'>

export type NodeTypes = {
  'root': NotionASTNode & {
    type: 'root'
    props: {}
  }

  'list_item': NotionASTNode & {
    type: 'list_item'
    props:
    & OmitRichText<BulletedListItemBlockObjectResponse['bulleted_list_item']>
    & OmitRichText<NumberedListItemBlockObjectResponse['numbered_list_item']>
    & OmitRichText<ToDoBlockObjectResponse['to_do']>
  }
  'bulleted_list_item': NotionASTNode & {
    type: 'bulleted_list_item'
    props: {}
  }
  'numbered_list_item': NotionASTNode & {
    type: 'numbered_list_item'
    props: {}
  }
  'to_do': NotionASTNode & {
    type: 'to_do'
    props: {}
  }
  'heading_1': NotionASTNode & {
    type: 'heading_1'
    props: OmitRichText<Heading1BlockObjectResponse['heading_1']> & { is_toggleable: boolean }
  }
  'heading_2': NotionASTNode & {
    type: 'heading_2'
    props: OmitRichText<Heading2BlockObjectResponse['heading_2']> & { is_toggleable: boolean }
  }
  'heading_3': NotionASTNode & {
    type: 'heading_3'
    props: OmitRichText<Heading3BlockObjectResponse['heading_3']> & { is_toggleable: boolean }
  }
  'paragraph': NotionASTNode & {
    type: 'paragraph'
    props: OmitRichText<ParagraphBlockObjectResponse['paragraph']>
  }
  'code': NotionASTNode & {
    type: 'code'
    props: OmitRichText<CodeBlockObjectResponse['code']>
  }
  'toggle': NotionASTNode & {
    type: 'toggle'
    props: OmitRichText<ToggleBlockObjectResponse['toggle']>
  }
  'quote': NotionASTNode & {
    type: 'quote'
    props: OmitRichText<QuoteBlockObjectResponse['quote']>
  }
  'divider': NotionASTNode & {
    type: 'divider'
    props: OmitRichText<DividerBlockObjectResponse['divider']>
  }

  'equation': NotionASTNode & {
    type: 'equation'
    props: OmitRichText<EquationBlockObjectResponse['equation']>
  }
  'callout': NotionASTNode & {
    type: 'callout'
    props: OmitRichText<CalloutBlockObjectResponse['callout']>
  }
  'column_list': NotionASTNode & {
    type: 'column_list'
    props: OmitRichText<ColumnListBlockObjectResponse['column_list']>
  }
  'column': NotionASTNode & {
    type: 'column'
    props: OmitRichText<ColumnBlockObjectResponse['column']>
  }
  'table': NotionASTNode & {
    type: 'table'
    props: OmitRichText<TableBlockObjectResponse['table']>
  }
  'table_row': NotionASTNode & {
    type: 'table_row'
    props: OmitRichText<TableRowBlockObjectResponse['table_row']>
  }
  'bookmark': NotionASTNode & {
    type: 'bookmark'
    props: OmitRichText<BookmarkBlockObjectResponse['bookmark']>
  }

  'image': NotionASTNode & {
    type: 'image'
    props: OmitRichText<ImageBlockObjectResponse['image']>
  }
  'video': NotionASTNode & {
    type: 'video'
    props: OmitRichText<VideoBlockObjectResponse['video']>
  }
  'pdf': NotionASTNode & {
    type: 'pdf'
    props: OmitRichText<PdfBlockObjectResponse['pdf']>
  }
  'audio': NotionASTNode & {
    type: 'audio'
    props: OmitRichText<AudioBlockObjectResponse['audio']>
  }

  'file': NotionASTNode & {
    type: 'file'
    props: OmitRichText<FileBlockObjectResponse['file']>
  }
  'embed': NotionASTNode & {
    type: 'embed'
    props: OmitRichText<EmbedBlockObjectResponse['embed']>
  }
  'link_preview': NotionASTNode & {
    type: 'link_preview'
    props: OmitRichText<LinkPreviewBlockObjectResponse['link_preview']>
  }


  'synced_block': NotionASTNode & {
    type: 'synced_block'
    props: OmitRichText<SyncedBlockBlockObjectResponse['synced_block']>
  }
  'child_page': NotionASTNode & {
    type: 'child_page'
    props: OmitRichText<ChildPageBlockObjectResponse['child_page']>
  }
  'child_database': NotionASTNode & {
    type: 'child_database'
    props: OmitRichText<ChildDatabaseBlockObjectResponse['child_database']>
  }
  'breadcrumb': NotionASTNode & {
    type: 'breadcrumb'
    props: OmitRichText<BreadcrumbBlockObjectResponse['breadcrumb']>
  }
  'table_of_contents': NotionASTNode & {
    type: 'table_of_contents'
    props: OmitRichText<TableOfContentsBlockObjectResponse['table_of_contents']>
  }
  'link_to_page': NotionASTNode & {
    type: 'link_to_page'
    props: OmitRichText<LinkToPageBlockObjectResponse['link_to_page']>
  }
  'template': NotionASTNode & {
    type: 'template'
    props: OmitRichText<TemplateBlockObjectResponse['template']>
  }
  'unsupported': NotionASTNode & {
    type: 'unsupported'
    props: OmitRichText<UnsupportedBlockObjectResponse['unsupported']>
  }

}

