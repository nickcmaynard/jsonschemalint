'use strict';

var app = angular.module('app', false);

var base = "https://api.github.com/gists";

app.service('gist', function ($q, $http) {

  // Save the schema and document as a secret anonymous gist
  this.save = function(schema, doc) {
    return $http({
      method: "POST",
      url: base,
      data: {
        "description": "jsonschemalint.com " + (new Date().toISOString()),
        "public": false,
        "files": {
          "schema": {
            "content": schema
          },
          "document": {
            "content": doc
          }
        }
      }
    }).then(function(result) {
      console.info("Saved gist successfully with ID", result.data.id);
      return result.data.id;
    }, function(error) {
      console.error("Could not save gist", error);
      throw error.statusText;
    });
  };

  // Get the schema and document
  this.retrieve = function(gistId) {
    return $http({
      method: "GET",
      url: base + "/" + gistId
    }).then(function(result) {
      // Sanity check!
      if(!result || !result.data || !result.data.files || !result.data.files["schema"] || !result.data.files["document"]) {
        throw "Gist is not in jsonschemalint.com format";
      }
      return {
        "schema": result.data.files["schema"].content,
        "document": result.data.files["document"].content
      };
    }, function(error) {
      console.error("Could not retrieve gist", error);
      throw error.statusText;
    });
  };

});