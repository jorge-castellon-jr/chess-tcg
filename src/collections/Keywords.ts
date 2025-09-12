import { CollectionConfig } from 'payload'

export const Keywords: CollectionConfig = {
  slug: 'keywords',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'rules',
      type: 'textarea',
    },
  ],
}
