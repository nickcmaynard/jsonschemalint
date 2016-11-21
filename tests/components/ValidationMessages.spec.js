describe('ValidationMessages', function() {
  var $compile,
      $rootScope;

  // Load the app module, which contains the component
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('mounts the component', function() {
    var $scope = $rootScope.$new();
    var element = $compile("<validation-messages></validation-messages>")($scope);
    $rootScope.$digest();

    // Must have compiled and inserted a scope properly - check that $scope has a child scope
    expect($scope.$$childHead).to.be.not.null;
  });

  it('is empty when given no data', function() {
    var $scope = $rootScope.$new();
    var element = $compile("<validation-messages></validation-messages>")($scope);
    $rootScope.$digest();

    expect(element.find("*")).to.have.length(0);
  });
});