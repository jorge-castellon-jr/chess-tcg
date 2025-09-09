import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { GlobalConfig } from 'payload'

export const Rules: GlobalConfig = {
  slug: 'rules',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
    },
  ],
}

