import { ref } from 'vue'
import { defineStore } from 'pinia'

import MarkupJson from '@/utilities/MarkupJson'
import MarkupYaml from '@/utilities/MarkupYaml'

export const useConfigStore = defineStore('config', () => {
  const markups = {
    json: {
      title: 'JSON',
      service: MarkupJson,
    },
    yaml: {
      title: 'YAML',
      service: MarkupYaml,
    },
  }

  const specs = {
    'draft-01': {
      name: 'draft-01',
      alerts: [
        {
          className: 'alert-danger',
          content_tid: 'WARNING_UNSUPPORTED_SPEC_VERSION',
        },
      ],
      hidden: true,
    },
    'draft-02': {
      name: 'draft-02',
      alerts: [
        {
          className: 'alert-danger',
          content_tid: 'WARNING_UNSUPPORTED_SPEC_VERSION',
        },
      ],
      hidden: true,
    },
    'draft-03': {
      name: 'draft-03',
      alerts: [
        {
          className: 'alert-danger',
          content_tid: 'WARNING_UNSUPPORTED_SPEC_VERSION',
        },
      ],
      hidden: true,
    },
    'draft-04': {
      schema: 'https://json-schema.org/draft-04/schema',
      name: 'draft-04',
    },
    'draft-06': {
      // service: validatorFactoryAJV('draft-06'),
      schema: 'https://json-schema.org/draft-06/schema',
      name: 'draft-06',
    },
    'draft-07': {
      // service: validatorFactoryAJV('draft-07'),
      name: 'draft-07',
      schema: 'https://json-schema.org/draft-07/schema',
    },
    '2019-09': {
      // service: validatorFactoryAJV('2019-09'),
      name: '2019-09',
      schema: 'https://json-schema.org/draft/2019-09/schema',
    },
    '2020-12': {
      // service: validatorFactoryAJV('2020-12'),
      name: '2020-12',
      schema: 'https://json-schema.org/draft/2020-12/schema',
      label: '2020-12 (latest)',
    },
    // RETIRED schema versions
    'v5-unofficial': {
      name: 'v5-unofficial',
      alerts: [
        {
          className: 'alert-danger',
          content_tid: 'WARNING_V5_UNOFFICIAL',
        },
      ],
      hidden: true,
    },
    experimental: {
      name: 'experimental',
      alerts: [
        {
          className: 'alert-danger',
          content_tid: 'WARNING_EXPERIMENTAL',
        },
      ],
      hidden: true,
    },
  }

  const currentMarkup = ref()
  const currentSpec = ref()
  const specDefinesSchema = ref(false)

  return { markups, specs, currentMarkup, currentSpec, specDefinesSchema }
})
