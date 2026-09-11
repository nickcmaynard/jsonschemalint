export const validatorOptions = [
  {
    name: 'strictMode',
    position: 0,
    label: 'STRICT_MODE',
    help: 'STRICT_MODE_HELP',
    values: [
      { value: '_', label: 'DEFAULT_ON' },
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
      { value: '_', label: 'DEFAULT_OFF' },
      { value: '0', label: 'OFF' },
      { value: '1', label: 'ON' },
    ],
  },
]
