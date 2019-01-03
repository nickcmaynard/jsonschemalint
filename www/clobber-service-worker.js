// UNregister all service workers
// This created more work (random breaking behaviour) than it solved with
// offline capability.  Rip it out.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    if (!registrations.length) {
      console.info('No serviceWorker registrations found.')
      return
    }
    for(let registration of registrations) {
      registration.unregister().then(function (boolean) {
        console.debug(
          (boolean ? 'Successfully unregistered' : 'Failed to unregister'), 'ServiceWorkerRegistration\n' +
          (registration.installing ? '  .installing.scriptURL = ' + registration.installing.scriptURL + '\n' : '') +
          (registration.waiting ? '  .waiting.scriptURL = ' + registration.waiting.scriptURL + '\n' : '') +
          (registration.active ? '  .active.scriptURL = ' + registration.active.scriptURL + '\n' : '') +
          '  .scope: ' + registration.scope + '\n'
        )
      })
    }
  })
}