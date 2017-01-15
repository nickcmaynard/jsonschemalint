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

  // Utility method to create an element and get a reference to its controller, from some injected HTML
  const _createInstance = (html) => {
    let element = $compile(html)($scope);
    $rootScope.$digest();

    let $ctrl = $scope.$$childHead.$ctrl;

    return {element, $ctrl};
  };

  it('mounts the component', function() {
    const {element, $ctrl} = _createInstance("<validator></validator>");

    // Must have compiled and inserted a scope properly - check that $scope has a child scope
    expect($scope.$$childHead.$ctrl).to.be.ok;
  });

  it('accepts a validate function', function() {
    $scope.echo = function(a) {
      return a;
    };

    const {element, $ctrl} = _createInstance("<validator validate=\"echo\"></validator>");

    expect($ctrl).to.be.ok;
    expect($ctrl.validate).to.be.a.function;
    expect($ctrl.validate("foo")).to.eql("foo");
  });

  it('accepts a parse function', function() {
    $scope.echo = function(a) {
      return a;
    };

    const {element, $ctrl} = _createInstance("<validator parse=\"echo\"></validator>");

    expect($ctrl).to.be.ok;
    expect($ctrl.parse).to.be.a.function;
    expect($ctrl.parse("foo")).to.eql("foo");
  });

  it('contains a form with a document text area', function() {
    const {element, $ctrl} = _createInstance("<validator></validator>");

    expect(element[0].querySelector("form textarea.validator-document")).not.to.be.empty;
  });

  it('binds its document textarea to its document model', function() {
    $scope.scopeProp = "foo";

    const {element, $ctrl} = _createInstance("<validator doc='scopeProp'></validator>");

    var textarea = element[0].querySelector("form textarea.validator-document");
    expect(textarea.value).to.eql("foo");
  });

  it('doesn\'t call update when nothing is changed', function() {
    const {element, $ctrl} = _createInstance("<validator></validator>");

    var spy = chai.spy.on($ctrl, "update");

    // Run a digest
    $rootScope.$digest();

    expect(spy).to.not.have.been.called();
  });

  it('calls update when the validate function is changed', function() {
    const {element, $ctrl} = _createInstance("<validator validate='fn'></validator>");

    var spy = chai.spy.on($ctrl, "update");

    // Change the function
    $scope.fn = function() {
      // blah
    };
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
  });

  it('calls update when the parse function is changed', function() {
    const {element, $ctrl} = _createInstance("<validator parse='fn'></validator>");

    var spy = chai.spy.on($ctrl, "update");

    // Change the function
    $scope.fn = function() {
      // blah
    };
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
  });

  it('calls update when the injected document changes', function() {
    const {element, $ctrl} = _createInstance("<validator doc='upperDoc'></validator>");

    var spy = chai.spy.on($ctrl, "update");

    // Change the injected document
    $scope.upperDoc = "flibble!"
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
  });

  it('doesn\'t call update when the injected document changes, but it\'s identical to the internal document', function() {
    const {element, $ctrl} = _createInstance("<validator doc='upperDoc'></validator>");

    // Set up the internal state
    $ctrl.myDoc = "flibble!";
    $ctrl.update($ctrl.myDoc);
    $rootScope.$digest();

    var spy = chai.spy.on($ctrl, "update");

    // Change the injected document
    $scope.upperDoc = "flibble!"
    $rootScope.$digest();

    expect(spy).to.not.have.been.called();
  });

});