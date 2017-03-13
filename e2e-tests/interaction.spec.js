'use strict';

var lib = require('./lib');

describe('document/spec interaction', function() {

  it('should show an explanatory error in the document errors when the schema is invalid', function() {
    browser.get('#/version/draft-04/markup/json');

    var invalidSchema = `{
      "type": "object",
      "properties": {
        "fooMin": {
          "type": "number",
          "minimum": "foo"
        }
      }
    }`;

    // Reset
    element(by.buttonText('Reset')).click();

    // Type the invalid schema in the schema element
    var schemaElement = element(by.css('validator[identifier=schema] textarea'));
    schemaElement.sendKeys(invalidSchema);
    expect(schemaElement.evaluate('$ctrl.myDoc')).toEqual(invalidSchema);

    // And a basically valid JSON document
    var documentElement = element(by.css('validator[identifier=document] textarea'));
    documentElement.sendKeys('{}');

    browser.wait(lib.isDoneWorking, 2500);

    var documentErrors = element.all(by.css('validator[identifier=document] validation-messages tbody tr'));

    expect(documentErrors.count()).toBeGreaterThan(0);

  });

});