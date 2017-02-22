module.exports = {
  // Check if the validator controllers have finished work
  isDoneWorking: function() {
    return element.all(by.css('validator > div')).evaluate('$ctrl.working').then(function(workingArr) {
      return workingArr.indexOf(true) === -1;
    });
  }
}