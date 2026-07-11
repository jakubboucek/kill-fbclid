# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Jazyková pravidla

- **Komunikace s uživatelem a tento soubor: česky.**
- **Vše code-related anglicky:** kód, názvy proměnných, komentáře v kódu, commit messages.
- Pozn.: Texty rozšíření jsou lokalizované přes `_locales/` (výchozí `en`, dále `cs`).

## O projektu

Chrome rozšíření **„Kill fbclid"** – minimalistický content script, který po načtení stránky odstraní z URL sledovací parametr `?fbclid=` přidávaný Facebookem. Žádný build systém, žádné závislosti, žádné testy – čistý vanilla JS nasazovaný přímo.

Publikováno v [Chrome Web Store](https://chrome.google.com/webstore/detail/kill-fbclid/jlmdkcaiejonohbmkgickmkgbpceokmn) (id `jlmdkcaiejonohbmkgickmkgbpceokmn`).

> **Stav (červenec 2026):** Upgradováno na **Manifest v3**. Protože rozšíření nemá background script ani `permissions` (jen content script), stačila změna `manifest_version` – formát `content_scripts` je v MV3 beze změny.

Historická poznámka: kdysi existovala i blokující varianta v branchi `plus` (odstranění parametru před navigací) – **deprecated**, žije jen `master` (idle, neblokující varianta).

## Struktura

- `manifest.json` – definice rozšíření (MV3); content script běží `document_idle` na `http://*/*` a `https://*/*`, s výjimkou `https://www.facebook.com/*`
- `fbclid.js` – celá logika (7 řádků): pokud `document.referrer` odpovídá `https://*.facebook.com/` a URL obsahuje `fbclid=`, odstraní parametr přes `url.searchParams.delete()` + `history.replaceState()` (zachovává aktuální `history.state`, viz commit 0fb1fc1)
- `_locales/en|cs/messages.json` – název a popis rozšíření (`__MSG_application_title__`, `__MSG_application_description__`)
- `fbclid_16/48/128.png` – ikony

## Mechanismus

Záměrně **neblokující** přístup: parametr se odstraňuje až po načtení stránky (`document_idle`), pouze kosmeticky přes History API – nedochází k reloadu ani přerušení navigace. Kontrola refereru zajišťuje, že se zasahuje jen do navigace přicházející z Facebooku.

## Testování

Projekt nemá automatické testy. Manuální/agentní testování probíhá přes MCP server `chrome-devtools-ext` (definovaný v `.mcp.json` – chrome-devtools-mcp s `--categoryExtensions=true` a `--isolated=true`):

1. `install_extension` s absolutní cestou k rootu repa (repo = unpacked extension)
2. Ověření vyžaduje navigaci s facebookovým referrerem. Funkční postup: navigovat na `https://www.facebook.com/` a odtud přes `evaluate_script` spustit `location.href = '<test-url-s-fbclid>'` – prohlížeč pošle skutečný referrer `https://www.facebook.com/`. **Pozor:** mock refereru přes `initScript` + `Object.defineProperty(Document.prototype, 'referrer', …)` nefunguje – přepíše jen main world, content script běží v izolovaném worldu s nativním getterem
3. Ověřit: žádné console errors, `location.search` bez `fbclid`, ostatní parametry zachovány, žádný reload stránky
4. Po každé úpravě kódu `reload_extension` a ověřit znovu

Pozn.: Extension tools fungují jen s pipe connection (MCP si spouští vlastní Chrome), ne přes `--browserUrl`.

## Release

1. Zvýšit `version` v `manifest.json` (commit `Version X.Y.Z`)
2. `./deploy.sh` → `dist/release.zip` (soubory v rootu + `_locales/`, bez dotfiles, `*.sh`, `*.md`, `LICENSE`)
3. Ručně nahrát do Chrome Web Store
