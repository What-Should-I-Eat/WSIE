"use strict";

var host = 'wsie-b9a65eafeffc.herokuapp.com';

function getUserId(username) {
  var response, data;
  return regeneratorRuntime.async(function getUserId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("http://".concat(host, "/api/v1/users/findUserId?username=").concat(username), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Network response was not ok');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('There was a problem with the fetch operation:', _context.t0);
          return _context.abrupt("return", "");

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

function getUserData(username) {
  var response, data;
  return regeneratorRuntime.async(function getUserData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch("http://".concat(host, "/api/v1//users/findUserData?username=").concat(username), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }));

        case 3:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 6;
            break;
          }

          throw new Error('Network response was not ok');

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context2.sent;
          return _context2.abrupt("return", data);

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error('There was a problem with the fetch operation:', _context2.t0);
          return _context2.abrupt("return", "");

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

function getUsername() {
  var urlString = window.location.href;
  var url = new URL(urlString);
  var username = url.searchParams.get('name');
  console.log(username);
  return username;
}

function getUserObject(username) {
  fetch("http://".concat(host, "/api/v1/users/findUser/").concat(username), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('Cannot find user');
    }

    return response.json();
  }).then(function (user) {
    console.log('User found: ', user);
    return user;
  })["catch"](function (error) {
    console.error('Fetch error: ', error);
  });
}