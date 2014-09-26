'use strict';

app.service('Session', function() {
  this.create = function(token, userId, userRole) {
    this.id = token;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function() {
    this.token = null;
    this.userId = null;
    this.userRole = null;
  };
  return this;
});