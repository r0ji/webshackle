#!/usr/bin/env node

const blockedDomains = [
  'news.ycombinator.com', 
  'example.com'
  ];

const blockDurationInMinutes = 5;
const blockIntervalInMinutes = 30;

const blockIP = '0.0.0.0';

function unblockDomains() {
  blockedDomains.forEach((domain) => {
    const entry = `${blockIP} ${domain} # Added by WebShackle`;
    const hostsFile = '/etc/hosts';
    let hosts = require('fs').readFileSync(hostsFile, 'utf8');
    const re = new RegExp(`(\\n){1,}(${blockIP}\\s${domain}.*) # Added by WebShackle(\\n){0,}`, 'g');
    hosts = hosts.replace(re, '');
    require('fs').writeFileSync(hostsFile, hosts);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    console.log(`${timestamp} - ${entry} unblocked`);
  });
}


function blockDomains() {
  blockedDomains.forEach((domain) => {
    const entry = `${blockIP} ${domain} # Added by WebShackle`;
    const hostsFile = '/etc/hosts';
    const hosts = require('fs').readFileSync(hostsFile, 'utf8');
    if (hosts.indexOf(entry) === -1) {
      require('fs').appendFileSync(hostsFile, `\n${entry}`);
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
      console.log(`${timestamp} - ${entry} blocked`);
    }
  });
  setTimeout(() => {
    unblockDomains();
  }, blockDurationInMinutes * 60 * 1000);
}

function scheduleBlock() {
  const currentTime = new Date();
  const minutes = currentTime.getMinutes();
  if (minutes === 0 || minutes === 30) {
    unblockDomains();
    setTimeout(() => {
      blockDomains();
    }, blockDurationInMinutes * 60 * 1000);
  } else {
    const nextBlockTime = new Date(currentTime);
    nextBlockTime.setMinutes((Math.floor(minutes / blockIntervalInMinutes) + 1) * blockIntervalInMinutes);
    nextBlockTime.setSeconds(0);
    nextBlockTime.setMilliseconds(0);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    const nextBlockTimeLog = nextBlockTime.toISOString().replace('T', ' ').slice(0, -5);
    console.log(`${timestamp} - Blocking until ${nextBlockTimeLog}`);
    blockDomains();
    setTimeout(() => {
      unblockDomains();
      scheduleBlock();
    }, nextBlockTime - currentTime);
  }
}

scheduleBlock();
