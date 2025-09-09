import { CollectionConfig } from 'payload'

export const Decks: CollectionConfig = {
  slug: 'decks',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'cards',
      type: 'relationship',
      relationTo: 'cards',
      hasMany: true,
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}