'use strict';

describe('smoke tests', function() {

  it('should automatically redirect to a default version & markup when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getCurrentUrl()).toMatch('/version/.*/markup/.*');
  });

  describe('about dialog', function() {
    it('should display when the button is clicked', function() {
      browser.get('index.html');

      element(by.linkText('About')).click();

      expect(element(by.cssContainingText('h3', 'About')).isDisplayed()).toBeTruthy();
    });
  });

});