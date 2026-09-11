// Keep route flag positions and UI value metadata together so new options can
// be added without duplicating dropdown markup.
export const validatorOptions = [
  {
    name: 'strictMode',
    position: 0,
    label: 'STRICT_MODE',
    help: 'STRICT_MODE_HELP',
    values: [
      { value: '_', label: 'DEFAULT', labelParams: { behavior: 'ON' } },
      { value: '0', label: 'OFF' },
      { value: '1', label: 'ON' },
    ],
  },
  {
    name: 'allowUnknownFormats',
    position: 1,
    label: 'ALLOW_UNKNOWN_FORMATS',
    help: 'ALLOW_UNKNOWN_FORMATS_HELP',
    values: [
      { value: '_', label: 'DEFAULT', labelParams: { behavior: 'OFF' } },
      { value: '0', label: 'OFF' },
      { value: '1', label: 'ON' },
    ],
  },
]
