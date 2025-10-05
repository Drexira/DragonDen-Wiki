# Dragon Den Wiki

A fast, single-page wiki for Dragon Den content (Euphoria, Neon Signs, etc..) built for GitHub Pages.

## Live URL

* [https://drexira.github.io/DragonDen-Wiki/](https://drexira.github.io/DragonDen-Wiki/)

## Some Features

* Guides for Euphoria, Neon Signs, and tools
* Search bar
* Dark theme with option for Dyslexic toggle (Alt+D)
* Code blocks can be copied
* Mobile-friendly design
* Mods section fetched from the [Forge API](https://forge.sp-tarkov.com/docs/index.html)

## Adding a page
1. Create yourpage/index.html with the content fragment.
2. Register the route in `js/router.js`
```
   const routes = new Map([
   // ...
   ['yourpage', 'yourpage/index.html'],
   ]);
```
3. Add to search in js/search.js
```
   const PAGES = [
   // ...
   { id: 'yourpage', url: toAbs('yourpage/index.html'), title: 'Your Page' },
   ];
```
4. Add a sidebar entry in index.html in any of the menu-groups
```
<li class="menu-group">
    // ...
    <ul class="menu-group__list">
        <li data-page="yourpage" tabindex="0">Your Page</li>
```

## Credits
* Dragon Den © Drexira
* Not affiliated with Battlestate Games
* Prism.js for code highlighting
