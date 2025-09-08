import { CollectionConfig } from 'payload/types'

export const Tournaments: CollectionConfig = {
  slug: 'tournaments',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'date',
      type: 'date',
    },
    {
      name: 'results',
      type: 'array',
      fields: [
        {
          name: 'rank',
          type: 'number',
        },
        {
          name: 'playerName',
          type: 'text',
        },
        {
          name: 'deck',
          type: 'relationship',
          relationTo: 'decks',
        },
      ],
    },
  ],
}