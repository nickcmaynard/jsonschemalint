describe('ValidationMessages', function() {
  var $compile,
      $rootScope,
      $scope;

  // Load the app module, which contains the component
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  it('mounts the component', function() {
    var element = $compile("<validation-messages></validation-messages>")($scope);
    $rootScope.$digest();

    // Must have compiled and inserted a scope properly - check that $scope has a child scope
    expect($scope.$$childHead.$ctrl).to.be.ok;
  });

  it('doesn\'t mount a misnamed component', function() {
    var element = $compile("<validation-messages-are-us></validation-messages-are-us>")($scope);
    $rootScope.$digest();

    // Should not have compiled and inserted a scope properly
    expect($scope.$$childHead).not.to.be.ok;
  });

  it('is empty when given no data', function() {
    var element = $compile("<validation-messages></validation-messages>")($scope);
    $rootScope.$digest();

    expect(element[0].querySelectorAll("*")).to.have.length(0);
  });

  it('has a row for each message', function() {
    var element = $compile("<validation-messages messages='scopeProp'></validation-messages>")($scope);
    $rootScope.$digest();

    var $ctrl = $scope.$$childHead.$ctrl;

    // Simple messages
    $scope.scopeProp = [ { "message":"foo" }, { "message":"foo" } ];
    $rootScope.$digest();

    expect(element[0].querySelectorAll("tbody tr")).to.have.length(2);

    // Complex messages
    $scope.scopeProp = [ { "message":"foo", "dataPath": "bar" }, { "message":"foo", "dataPath": "bar2" }, { "message":"foo", "dataPath": "bar3" } ];
    $rootScope.$digest();

    expect(element[0].querySelectorAll("tbody tr")).to.have.length(3);

  });
});