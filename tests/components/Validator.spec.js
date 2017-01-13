describe('Validator', function() {
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
    var element = $compile("<validator></validator>")($scope);
    $rootScope.$digest();

    // Must have compiled and inserted a scope properly - check that $scope has a child scope
    expect($scope.$$childHead.$ctrl).to.be.ok;
  });

  it('accepts a validate function', function() {
    $scope.echo = function(a) {
      return a;
    };

    var element = $compile("<validator validate=\"echo\"></validator>")($scope);
    $rootScope.$digest();

    var $ctrl = $scope.$$childHead.$ctrl;

    expect($ctrl).to.be.ok;
    expect($ctrl.validate).to.be.a.function;
    expect($ctrl.validate("foo")).to.eql("foo");
  });

  it('accepts a parse function', function() {
    $scope.echo = function(a) {
      return a;
    };

    var element = $compile("<validator parse=\"echo\"></validator>")($scope);
    $rootScope.$digest();

    var $ctrl = $scope.$$childHead.$ctrl;

    expect($ctrl).to.be.ok;
    expect($ctrl.parse).to.be.a.function;
    expect($ctrl.parse("foo")).to.eql("foo");
  });

  it('contains a form with a document text area', function() {
    var element = $compile("<validator></validator>")($scope);
    $rootScope.$digest();

    expect(element[0].querySelector("form textarea.validator-document")).not.to.be.empty;
  });

  it('binds its document textarea to its document model', function() {
    var element = $compile("<validator doc='scopeProp'></validator>")($scope);
    $rootScope.$digest();

    var $ctrl = $scope.$$childHead.$ctrl;
    $scope.scopeProp = "foo";
    $rootScope.$digest();

    var textarea = element[0].querySelector("form textarea.validator-document");
    expect(textarea.value).to.eql("foo");
  });

  it('calls update when the validate function is changed', function() {
    var element = $compile("<validator validate='fn'></validator>")($scope);
    $rootScope.$digest();

    var $ctrl = $scope.$$childHead.$ctrl;
    var spy = chai.spy.on($ctrl, "update");

    // Change the function
    $scope.fn = function() {
      // blah
    };
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
  });

  it('calls update when the parse function is changed', function() {
    var element = $compile("<validator parse='fn'></validator>")($scope);
    $rootScope.$digest();

    var $ctrl = $scope.$$childHead.$ctrl;
    var spy = chai.spy.on($ctrl, "update");

    // Change the function
    $scope.fn = function() {
      // blah
    };
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
  });

});