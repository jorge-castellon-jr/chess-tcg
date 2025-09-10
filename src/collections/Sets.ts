import { CollectionConfig } from 'payload'

export const Sets: CollectionConfig = {
  slug: 'sets',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'releaseDate',
      type: 'date',
      required: true,
    },
    {
      name: 'preview',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

