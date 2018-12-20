'use strict';

const param = 'fbclid';
const eventFilter = {url: [{queryContains: '?fbclid='}, {queryContains: '&fbclid='}]};

chrome.webNavigation.onBeforeNavigate.addListener((tab) => {
    const url = new URL(tab.url);
    url.searchParams.delete(param);
    chrome.tabs.update(tab.id, {url: url.href});
}, eventFilter);
