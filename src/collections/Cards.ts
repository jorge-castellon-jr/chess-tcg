import { CollectionConfig } from 'payload'

export const Cards: CollectionConfig = {
  slug: 'cards',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'class',
      type: 'select',
      options: ['Neutral', 'Hearts', 'Diamonds', 'Clubs', 'Spades'],
      defaultValue: 'Neutral',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: ['Piece', 'Tactic'],
      defaultValue: 'Piece',
      required: true,
    },
    {
      name: 'pieceType',
      type: 'select',
      options: ['Basic', 'Queen', 'King'],
      defaultValue: 'Basic',
      admin: {
        condition: (data) => data.type === 'Piece',
      },
    },
    {
      name: 'customLimit',
      type: 'checkbox',
    },
    {
      name: 'limit',
      type: 'radio',
      options: ['1', '2', '3'],
      admin: {
        condition: (data) => data.customLimit,
      },
    },
    {
      name: 'set',
      type: 'relationship',
      relationTo: 'sets',
      required: true,
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
