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
    },
    {
      name: 'releaseDate',
      type: 'date',
    },
  ],
}