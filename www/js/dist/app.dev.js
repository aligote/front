/* eslint-disable no-console */

/* eslint-disable no-alert */

/* eslint-disable no-undef */

/* eslint-disable no-new */
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function bytes(bytes, decimals, kib, maxunit) {
  kib = kib || false;
  if (bytes === 0) return '0 B';
  if (Number.isNaN(parseFloat(bytes)) && !Number.isFinite(bytes)) return 'NaN';
  var k = kib ? 1024 : 1000;
  var dm = decimals != null && !Number.isNaN(decimals) && decimals >= 0 ? decimals : 2;
  var sizes = kib ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB', 'BiB'] : ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));

  if (maxunit !== undefined) {
    var index = sizes.indexOf(maxunit);
    if (index !== -1) i = index;
  } // eslint-disable-next-line no-restricted-properties


  return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), " ").concat(sizes[i]);
}

new Vue({
  el: '#app',
  data: {
    authenticated: null,
    authenticating: false,
    password: null,
    requiresPassword: null,
    clients: null,
    clientsPersist: {},
    clientDelete: null,
    clientCreate: null,
    clientCreateName: '',
    clientSessionEnd: null,
    clientEditName: null,
    clientEditNameId: null,
    clientEditAddress: null,
    clientEditAddressId: null,
    expirationDate: null,
    qrcode: null,
    currentRelease: null,
    latestRelease: null,
    chartOptions: {
      chart: {
        background: 'transparent',
        type: 'bar',
        stacked: false,
        toolbar: {
          show: false
        },
        animations: {
          enabled: false
        }
      },
      colors: ['#DDDDDD', // rx
      '#EEEEEE' // tx
      ],
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true
        }
      },
      yaxis: {
        labels: {
          show: false
        },
        min: 0
      },
      tooltip: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false,
        padding: {
          left: -10,
          right: 0,
          bottom: -15,
          top: -15
        },
        column: {
          opacity: 0
        },
        xaxis: {
          lines: {
            show: false
          }
        }
      }
    }
  },
  methods: {
    dateTime: function dateTime(value) {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(value);
    },
    refresh: function refresh() {
      var _this = this;

      var _ref,
          _ref$updateCharts,
          updateCharts,
          clients,
          _args = arguments;

      return regeneratorRuntime.async(function refresh$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _ref = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref$updateCharts = _ref.updateCharts, updateCharts = _ref$updateCharts === void 0 ? false : _ref$updateCharts;

              if (this.authenticated) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              _context.next = 5;
              return regeneratorRuntime.awrap(this.api.getClients());

            case 5:
              clients = _context.sent;
              this.clients = clients.map(function (client) {
                if (client.name.includes('@') && client.name.includes('.')) {
                  client.avatar = "https://www.gravatar.com/avatar/".concat(md5(client.name), "?d=blank");
                }

                if (!_this.clientsPersist[client.id]) {
                  _this.clientsPersist[client.id] = {};
                  _this.clientsPersist[client.id].transferRxHistory = Array(50).fill(0);
                  _this.clientsPersist[client.id].transferRxPrevious = client.transferRx;
                  _this.clientsPersist[client.id].transferTxHistory = Array(50).fill(0);
                  _this.clientsPersist[client.id].transferTxPrevious = client.transferTx;
                } // Debug
                // client.transferRx = this.clientsPersist[client.id].transferRxPrevious + Math.random() * 1000;
                // client.transferTx = this.clientsPersist[client.id].transferTxPrevious + Math.random() * 1000;


                if (updateCharts) {
                  _this.clientsPersist[client.id].transferRxCurrent = client.transferRx - _this.clientsPersist[client.id].transferRxPrevious;
                  _this.clientsPersist[client.id].transferRxPrevious = client.transferRx;
                  _this.clientsPersist[client.id].transferTxCurrent = client.transferTx - _this.clientsPersist[client.id].transferTxPrevious;
                  _this.clientsPersist[client.id].transferTxPrevious = client.transferTx;

                  _this.clientsPersist[client.id].transferRxHistory.push(_this.clientsPersist[client.id].transferRxCurrent);

                  _this.clientsPersist[client.id].transferRxHistory.shift();

                  _this.clientsPersist[client.id].transferTxHistory.push(_this.clientsPersist[client.id].transferTxCurrent);

                  _this.clientsPersist[client.id].transferTxHistory.shift();
                }

                client.transferTxCurrent = _this.clientsPersist[client.id].transferTxCurrent;
                client.transferRxCurrent = _this.clientsPersist[client.id].transferRxCurrent;
                client.transferTxHistory = _this.clientsPersist[client.id].transferTxHistory;
                client.transferRxHistory = _this.clientsPersist[client.id].transferRxHistory;
                client.transferMax = Math.max.apply(Math, _toConsumableArray(client.transferTxHistory).concat(_toConsumableArray(client.transferRxHistory)));
                client.hoverTx = _this.clientsPersist[client.id].hoverTx;
                client.hoverRx = _this.clientsPersist[client.id].hoverRx;
                return client;
              });

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    },
    login: function login(e) {
      var _this2 = this;

      e.preventDefault();
      if (!this.password) return;
      if (this.authenticating) return;
      this.authenticating = true;
      this.api.createSession({
        password: this.password
      }).then(function _callee() {
        var session;
        return regeneratorRuntime.async(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return regeneratorRuntime.awrap(_this2.api.getSession());

              case 2:
                session = _context2.sent;
                _this2.authenticated = session.authenticated;
                _this2.requiresPassword = session.requiresPassword;
                return _context2.abrupt("return", _this2.refresh());

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        });
      })["catch"](function (err) {
        alert(err.message || err.toString());
      })["finally"](function () {
        _this2.authenticating = false;
        _this2.password = null;
      });
    },
    logout: function logout(e) {
      var _this3 = this;

      e.preventDefault();
      this.api.deleteSession().then(function () {
        _this3.authenticated = false;
        _this3.clients = null;
      })["catch"](function (err) {
        alert(err.message || err.toString());
      });
    },
    createClient: function createClient() {
      var _this4 = this;

      var name = this.clientCreateName;
      if (!name) return;
      var clientEnd = this.clientSessionEnd;
      this.api.createClient({
        name: name,
        clientEnd: clientEnd
      })["catch"](function (err) {
        return alert(err.message || err.toString());
      })["finally"](function () {
        return _this4.refresh()["catch"](console.error);
      });
    },
    deleteClient: function deleteClient(client) {
      var _this5 = this;

      this.api.deleteClient({
        clientId: client.id
      })["catch"](function (err) {
        return alert(err.message || err.toString());
      })["finally"](function () {
        return _this5.refresh()["catch"](console.error);
      });
    },
    enableClient: function enableClient(client) {
      var _this6 = this;

      this.api.enableClient({
        clientId: client.id
      })["catch"](function (err) {
        return alert(err.message || err.toString());
      })["finally"](function () {
        return _this6.refresh()["catch"](console.error);
      });
    },
    disableClient: function disableClient(client) {
      var _this7 = this;

      this.api.disableClient({
        clientId: client.id
      })["catch"](function (err) {
        return alert(err.message || err.toString());
      })["finally"](function () {
        return _this7.refresh()["catch"](console.error);
      });
    },
    updateClientName: function updateClientName(client, name) {
      var _this8 = this;

      this.api.updateClientName({
        clientId: client.id,
        name: name
      })["catch"](function (err) {
        return alert(err.message || err.toString());
      })["finally"](function () {
        return _this8.refresh()["catch"](console.error);
      });
    },
    updateClientAddress: function updateClientAddress(client, address) {
      var _this9 = this;

      this.api.updateClientAddress({
        clientId: client.id,
        address: address
      })["catch"](function (err) {
        return alert(err.message || err.toString());
      })["finally"](function () {
        return _this9.refresh()["catch"](console.error);
      });
    },
    deleteSessionEndClient: function deleteSessionEndClient() {
      var _this10 = this;

      var checkClients;
      return regeneratorRuntime.async(function deleteSessionEndClient$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.api.getClients());

            case 2:
              checkClients = _context3.sent;
              console.log(checkClients);
              checkClients.forEach(function (el) {
                if (el.dataEnd < el.createdAt) {
                  _this10.api.deleteClient({
                    clientId: el.id
                  })["catch"](function (err) {
                    return alert(err.message || err.toString());
                  })["finally"](function () {
                    return _this10.refresh()["catch"](console.error);
                  });
                }
              });

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    },
    setExpirationDate: function setExpirationDate(period) {
      var today = new Date();
      var nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + period);
      var year = nextMonth.getFullYear();
      var month = nextMonth.getMonth() + 1;
      var day = nextMonth.getDate();

      if (month < 10) {
        month = '0' + month;
      }

      if (day < 10) {
        day = '0' + day;
      }

      this.clientSessionEnd = "".concat(year, "-").concat(month, "-").concat(day);
      console.log("\u0421\u0435\u0433\u043E\u0434\u043D\u044F: ".concat(today));
      console.log("\u0414\u0430\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 ".concat(period, ": ").concat(nextMonth));
    }
  },
  filters: {
    bytes: bytes,
    timeago: function (_timeago) {
      function timeago(_x) {
        return _timeago.apply(this, arguments);
      }

      timeago.toString = function () {
        return _timeago.toString();
      };

      return timeago;
    }(function (value) {
      return timeago().format(value);
    })
  },
  mounted: function mounted() {
    var _this11 = this;

    this.$nextTick(function () {
      _this11.deleteSessionEndClient();
    });
    this.api = new API();
    this.api.getSession().then(function (session) {
      _this11.authenticated = session.authenticated;
      _this11.requiresPassword = session.requiresPassword;

      _this11.refresh({
        updateCharts: true
      })["catch"](function (err) {
        alert(err.message || err.toString());
      });
    })["catch"](function (err) {
      alert(err.message || err.toString());
    });
    setInterval(function () {
      _this11.refresh({
        updateCharts: true
      })["catch"](console.error);
    }, 5000);
    /** 
        Promise.resolve().then(async () => {
          const currentRelease = await this.api.getRelease();
          const latestRelease = await fetch('https://weejewel.github.io/wg-easy/changelog.json')
            .then(res => res.json())
            .then(releases => {
              const releasesArray = Object.entries(releases).map(([version, changelog]) => ({
                version: parseInt(version, 10),
                changelog,
              }));
              releasesArray.sort((a, b) => {
                return b.version - a.version;
              });
    
              return releasesArray[0];
            });
    
          console.log(`Current Release: ${currentRelease}`);
          console.log(`Latest Release: ${latestRelease.version}`);
    
          if (currentRelease >= latestRelease.version) return;
    
          this.currentRelease = currentRelease;
          this.latestRelease = latestRelease;
        }).catch(console.error);
        */
  }
});