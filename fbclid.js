const param = 'fbclid';
const referrerPattern = /https:\/\/(?:[^/]+\.)?facebook.com\//g;
if (document.referrer.match(referrerPattern) !== null && location.search.indexOf(param + '=') !== -1) {
    const url = new URL(location.href);
    url.searchParams.delete(param);
    history.replaceState(null, '', url.href);
}
