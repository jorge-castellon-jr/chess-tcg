import { CollectionConfig } from 'payload/types'

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