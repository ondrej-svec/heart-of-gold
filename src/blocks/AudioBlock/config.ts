import type { Block } from 'payload'

export const AudioBlock: Block = {
  slug: 'audioBlock',
  interfaceName: 'AudioBlock',
  fields: [
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'audio' },
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        placeholder: 'e.g. Listen to this post',
      },
    },
  ],
}
