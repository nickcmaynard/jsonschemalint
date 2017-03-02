describe('Validator', function() {
  var $compile,
    $rootScope,
    $scope,
    $q;

  // Load the app module, which contains the component
  beforeEach(module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _$q_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $q = _$q_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  // // Debug logging logic
  // var $log;
  //
  // // Inject the $log service
  // beforeEach(inject(function(_$log_){
  //   $log = _$log_;
  // }));
  //
  // // Log debug messages in Karma
  // afterEach(function(){
  //   console.log($log.debug.logs);
  // });

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

  it('calls on-update-obj with null when the injected document doesn\'t validate', function() {
    const spy = chai.spy(function(params) {});
    $scope.onUpdateObj = spy;

    const {element, $ctrl} = _createInstance("<validator doc='upperDoc' on-update-obj='onUpdateObj(value)'></validator>");

    // We *must* use $q else the promises don't resolve properly :/
    // Pretend it parses
    $ctrl.parse = () => $q.resolve({});
    // But that it doesn't validate
    $ctrl.validate = () => $q.reject([]);
    $rootScope.$digest();

    // Change the injected document
    $scope.upperDoc = "flibble!"
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
    expect(spy).to.have.been.always.with.exactly(null);
  });

  it('calls on-update-obj with null when the injected document doesn\'t parse', function() {
    const spy = chai.spy(function(params) {});
    $scope.onUpdateObj = spy;

    const {element, $ctrl} = _createInstance("<validator doc='upperDoc' on-update-obj='onUpdateObj(value)'></validator>");

    // We *must* use $q else the promises don't resolve properly :/
    // Pretend it doesn't parse
    $ctrl.parse = () => $q.reject([]);
    // But that it does (somehow! magic!) validate
    $ctrl.validate = () => $q.resolve({});
    $rootScope.$digest();

    // Change the injected document
    $scope.upperDoc = "flibble!"
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
    expect(spy).to.have.been.always.with.exactly(null);
  });

  it('calls on-update-obj with a value when the injected document parses and validates', function() {
    const spy = chai.spy(function(params) {});
    $scope.onUpdateObj = spy;

    const {element, $ctrl} = _createInstance("<validator doc='upperDoc' on-update-obj='onUpdateObj(value)'></validator>");

    // We *must* use $q else the promises don't resolve properly :/
    // Pretend it parses
    $ctrl.parse = () => $q.resolve({foo: "bar"});
    // And that it validates
    $ctrl.validate = () => $q.resolve({});
    $rootScope.$digest();

    // Change the injected document
    $scope.upperDoc = "flibble!"
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
    expect(spy).to.have.been.always.with.exactly({foo: "bar"});
  });

  it('calls on-update-doc with a value when the injected document changes', function() {
    const spy = chai.spy(function(params) {});
    $scope.onUpdateDoc = spy;

    const {element, $ctrl} = _createInstance("<validator doc='upperDoc' on-update-doc='onUpdateDoc(value)'></validator>");
    $rootScope.$digest();

    expect($ctrl.onUpdateDoc).to.be.a.function;

    // Change the injected document
    $scope.upperDoc = "flibble!"
    $rootScope.$digest();

    expect(spy).to.have.been.called.once;
    expect(spy).to.have.been.always.with.exactly("flibble!");
  });

});