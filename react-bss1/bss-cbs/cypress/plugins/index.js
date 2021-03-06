// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const os = require('os');
const addChromeForWindows = os.platform() !== 'darwin';

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  if (addChromeForWindows) {
    config.browsers.push({
      name: 'windowsChrome',
      family: 'chromium',
      channel: 'stable',
      displayName: 'Chrome for Windows',
      version: '90.0.4430.93',
      path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      majorVersion: '90'
    });
  }

  return config;
};
