#!/usr/bin/env node

const blockedDomains = [
  'news.ycombinator.com', 
  'example.com'
  ];

const blockIP = '0.0.0.0';

function unblockDomains() {
  blockedDomains.forEach((domain) => {
    const hostsFile = '/etc/hosts';
    let hosts = require('fs').readFileSync(hostsFile, 'utf8');
    const re = new RegExp(`(^|\\n)${blockIP}\\s${domain}(\\s+# Added by WebShackle)?`, 'g');
    hosts = hosts.replace(re, '');
    require('fs').writeFileSync(hostsFile, hosts);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    console.log(`${timestamp} - UNBLOCKED: ${domain}`);
  });
}

function blockDomains() {
  blockedDomains.forEach((domain) => {
    const entry = `${blockIP} ${domain}`;
    const hostsFile = '/etc/hosts';
    const hosts = require('fs').readFileSync(hostsFile, 'utf8');
    if (!hosts.includes(entry)) {
      require('fs').appendFileSync(hostsFile, `\n${entry} # Added by WebShackle`);
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
      console.log(`${timestamp} - BLOCKED: ${domain}`);
    }
  });
}

function checkCurrentTime() {
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();
  
  if ((currentMinutes >= 0 && currentMinutes < 5) || (currentMinutes >= 30 && currentMinutes < 35)) {
    unblockDomains();
  } else {
    blockDomains();
  }
}

function onTimeChange() {
  const currentTime = new Date();
  const currentMinutes = currentTime.getMinutes();

  if (currentMinutes === 0 || currentMinutes === 30) {
    unblockDomains();
  } else if (currentMinutes === 5 || currentMinutes === 35) {
    blockDomains();
  }

  // Wait for the next minute
  setTimeout(onTimeChange, (60 - currentTime.getSeconds()) * 1000);
}

// Initial check and application of the correct state
checkCurrentTime();

// Start listening for time changes
onTimeChange();
