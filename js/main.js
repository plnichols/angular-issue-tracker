var app = angular.module('app', []);


// Controller
// Set model for data binding between issues and inputs
// Functions to reset / update search filters
app.controller('IssueTrackerCtrl', function($scope, Issues) {
    $scope.Issues = Issues;

    // Define the initial state of searchfilters
    // Setting search filter as undefined because:
    //   - when using empty string "", Angular filters out issues with null values
    //   - when using empty array [], Angular filters out all issues when doing a reset all AND input text was not empty
    $scope.searchfilters = {
        category: undefined,
        project: undefined,
        assignee: undefined
    };

    $scope.updateFilters = function(type, string) {
        $scope.searchfilters[type] = string;
    }

    $scope.resetAllFilters = function() {
        for (var key in $scope.searchfilters) {
            $scope.searchfilters[key] = undefined;
        }
    }
});



// Factory
// Return list of issues from ajax call
app.factory('Issues', function($http) {
    var Issues = {};

    $http.get('https://gist.githubusercontent.com/nnnick/d95eda665f92a0f8c55c/raw/8cf6f092866b288c7330644472eb414472587052/issues.json')
        .success(function (data) {
            Issues.bugs = data;
        })
        .error(function (data, status, headers, config) {
            Issues.notfound = true;
        });

    return Issues;
});



// Directive
// Display list of issues from template file
app.directive('list', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'js/templates/list.html'
    };
});



// Directive
// Display multiple filter dropdowns from template file
app.directive('filters', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'js/templates/filters.html'
    };
});



// Filter
// Removes duplicate values in array
// https://stackoverflow.com/questions/20222555/angularjs-remove-duplicate-elements-in-ng-repeat
app.filter('unique', function() {
    return function(collection, keyname) {
        var output = [], 
        keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});