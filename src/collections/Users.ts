import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: true,
  fields: [
    {
      name: 'id',
      type: 'text',
      unique: true,
    },
    {
      name: 'username',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
    },
  ],
}
