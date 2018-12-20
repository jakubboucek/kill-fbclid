document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener('click', () => {
            chrome.tabs.create({active: true, url: link.href});
        });
    });

    document.querySelectorAll("[data-locale-text]").forEach((element) => {
        const key = element.getAttribute("data-locale-text");
        const text = chrome.i18n.getMessage(key);
        if (text === "") {
            return;
        }
        element.textContent = text;
    });
});
