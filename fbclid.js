const param = 'fbclid';
const pattern = /https:\/\/(?:www|web|mobile).facebook.com\//g;
if (document.referrer.match(pattern) !== null && location.search.indexOf(param + '=') !== -1) {
    const url = new URL(location);
    url.searchParams.delete(param);
    history.replaceState(null, '', url.href);
}
