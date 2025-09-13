import { CollectionConfig } from 'payload'

export const Decks: CollectionConfig = {
  slug: 'decks',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false, // Allow decks without users since you mentioned no users for now
    },
    {
      name: 'deckCards',
      type: 'array',
      label: 'Deck Cards',
      fields: [
        {
          name: 'card',
          type: 'relationship',
          relationTo: 'cards',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          max: 3,
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
