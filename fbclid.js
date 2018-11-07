const param = 'fbclid';
if (document.referrer === "https://www.facebook.com/" && location.search.indexOf(param + '=') !== -1) {
    const url = new URL(location);
    url.searchParams.delete(param);
    history.replaceState(null, '', url.href);
}