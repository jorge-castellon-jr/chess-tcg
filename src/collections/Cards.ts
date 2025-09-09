import { CollectionConfig } from 'payload'

export const Cards: CollectionConfig = {
  slug: 'cards',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'suit',
      type: 'select',
      options: ['Hearts', 'Diamonds', 'Clubs', 'Spades', 'Neutral'],
    },
    {
      name: 'type',
      type: 'select',
      options: ['Piece', 'Tactic', 'Queen', 'King'],
    },
    {
      name: 'set',
      type: 'relationship',
      relationTo: 'sets',
    },
    // {
    //   name: 'materialValue',
    //   type: 'number',
    //   admin: {
    //     condition: (data) => data.cardType === 'Piece',
    //   },
    // },
    // {
    //   name: 'cost',
    //   type: 'number',
    // },
    // {
    //   name: 'attack',
    //   type: 'number',
    //   admin: {
    //     condition: (data) => data.cardType === 'Piece',
    //   },
    // },
    // {
    //   name: 'health',
    //   type: 'number',
    //   admin: {
    //     condition: (data) =>
    //       data.cardType === 'Piece' || data.cardType === 'King',
    //   },
    // },
    // {
    //   name: 'effects',
    //   type: 'richText',
    // },
    // {
    //   name: 'tacticType',
    //   type: 'select',
    //   options: ['Equip', 'Static', 'Action'],
    //   admin: {
    //     condition: (data) => data.cardType === 'Tactic',
    //   },
    // },
  ],
}
