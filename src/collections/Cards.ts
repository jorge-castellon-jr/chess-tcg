import { getSetFolders, importCardsFromSet } from '@/utils/endpoints'
import path from 'path'
import { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Cards: CollectionConfig = {
  slug: 'cards',
  admin: {
    useAsTitle: 'name',
    components: {
      beforeListTable:
        process.env.NODE_ENV !== 'production'
          ? ['src/components/ImportButton.tsx']
          : undefined,
    },
  },
  endpoints: [
    {
      path: '/get-sets',
      method: 'get',
      handler: async () => {
        console.log('get-sets')
        const exportsPath = path.resolve(dirname, '../exports')
        const result = await getSetFolders(exportsPath)
        console.log('result', result)
        console.log('exportsPath', exportsPath)

        if (result.success) {
          return Response.json({ sets: result.folders })
        } else {
          console.error('Error fetching sets:', result.details)
          return Response.json({ error: result.error }, { status: 500 })
        }
      },
    },
    {
      path: '/import-cards',
      method: 'post',
      handler: async (req) => {
        if (process.env.NODE_ENV !== 'development') {
          return Response.json({ error: 'Not found' }, { status: 404 })
        }

        const data = req.data
        if (!data) {
          return Response.json(
            { error: 'setName is required' },
            { status: 400 }
          )
        }
        const { setName } = data

        const exportsPath = path.resolve(dirname, '../exports')
        const logsPath = path.resolve(dirname, '../logs')

        const result = await importCardsFromSet(
          req.payload,
          setName,
          exportsPath,
          logsPath
        )

        if (result.success) {
          return Response.json({
            message: result.message,
            stats: result.stats,
          })
        } else {
          console.error('Error importing set:', result.details)
          return Response.json(
            {
              error: result.error,
              details: result.details,
            },
            { status: 500 }
          )
        }
      },
    },
  ],
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
      name: 'effect',
      type: 'text',
    },
    {
      name: 'keywords',
      type: 'relationship',
      relationTo: 'keywords',
      hasMany: true,
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
    {
      name: 'Cost',
      type: 'number',
    },
    {
      name: 'ATK',
      type: 'number',
    },
    {
      name: 'DEF',
      type: 'number',
    },
    {
      name: 'Material',
      type: 'number',
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
