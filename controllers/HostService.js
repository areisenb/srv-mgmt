'use strict';

var ping = require('ping');
var wol = require('wake_on_lan');
var fs = require('fs');
var jsyaml = require('js-yaml');
var log = require('log4js').getLogger ("api-host");

var objHosts = {};

cronjob ();

function readConfig () {
  const configFileName = './config/srv-mgmt.yaml';
  try {
    let configFile = fs.readFileSync(configFileName, 'utf8');
    objHosts = jsyaml.safeLoad(configFile).hosts;
  } catch (e) {
    switch (e.name) {
      case 'YAMLException': 
        log.error ("config file " + configFileName + "parsing error - " + e);
        break;
      case 'Error':
      default:
        log.error (e.message);
        break;
    }
  }
}

function discoverState () {
  for (let host in objHosts) {
    ping.sys.probe(objHosts[host].ip, function(isAlive){
      objHosts[host].up = isAlive;
    });
  }
  setTimeout (discoverState, 10000);
}

function cronjob () {
  readConfig ();
  discoverState ();
}

module.exports.getHosts = function getHosts (req, res, next) {
  let aHosts = [];
  for (let host in objHosts) {
    let objHost = objHosts [host];
    objHost.name = host;
    aHosts.push (objHost);
  }
  res.json(aHosts);
};

module.exports.wakeHost = function wakeHost (req, res, next) {
  let params = req.swagger.params;
  var bDone = false;
  if (params.name.value in objHosts) {
    let host = objHosts [params.name.value];
    if ((host.wol) && (host.wol == true) && (host.eth)) {
      log.info ("wake up host: ", host.ip,
          " (", params.name.value, ") - ", host.eth);
      res.sendStatus(200);
      bDone = true;
      wol.wake(host.eth);
    }
  }
  if (bDone == false)
    res.sendStatus(404);
}
