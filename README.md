# Nouveaux_sur_le_site

Idées et prototypes pour faire évoluer le site personnel de Pascal (Lab Pascal) vers un **outil créatif interactif** plutôt qu'un simple site vitrine.

## Contenu

```
.
├── index.html                  # Menu central genere (cartes -> Les_Index_Magique/*.html)
├── idee de ChatGpt.txt         # Pistes ChatGPT : interactivite, mini-outils, bac a sable, hub local
├── idee de claude.txt          # Pistes Claude : contenus gratuits, outils webmaster, UX, communaute
├── chatgpt/
│   ├── index.html              # Prototype Lab Pascal (gallery + canvas + drag&drop)
│   └── code.txt                # Copie brute du code
├── claude/                     # (a remplir)
└── Les_Index_Magique/
    ├── *.html                  # Galeries / index varies (Claude, Compteurs, L'Arbre, Le Monde Farfelu, ...)
    ├── update_index.ps1        # Generateur de ../index.html (UTF-8 BOM obligatoire)
    └── update_index.bat        # Lanceur double-clic du generateur
```

## index.html (menu central)

Page racine **regeneree** par `Les_Index_Magique\update_index.bat`.

**Comportement du generateur :**
- Scanne `Les_Index_Magique\*.html` (sauf `index.html` eventuel)
- Scanne sous-dossiers de `Les_Index_Magique` contenant un `index.html` (ex futur : VideosLoom)
- Une carte par entree, tri alphabetique
- Hrefs prefixees par `Les_Index_Magique/` (car index.html est un cran au-dessus)
- Vignettes = degrade HSL calcule par hash du titre (pas d'image requise)
- Tag `page` ou `dossier` en bas-droite de la carte

**Snippet impose (integre tel quel a chaque regeneration) :**
- `<head>` : `canonical`, favicons png+ico, `style.css`, `script.js`, `menu.js` (defer), `basedusite.css`, `couleurs.js` (tous depuis `https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/`)
- `<body>` : `<nav class="social-menu">` (Pinterest / Flickr / Tumblr / X / YouTube) + `<header></header>` rempli par `menu.js`

**Mode sombre / clair :**
- Bouton fixe haut-droite (`Mode sombre` / `Mode clair`)
- CSS vars (`:root` clair, `html[data-theme="dark"]` sombre)
- Persistance `localStorage`
- Pre-application inline en `<head>` -> pas de flash blanc au chargement en mode sombre

**Style cartes :** pellicule cafe (rotation 3deg, bord rose inset, animation film roll au hover), reprise du style original de VideosLoom.

## Generation / mise a jour de index.html

```
double-clic : Les_Index_Magique\update_index.bat
   |
   +-> powershell -File update_index.ps1
         |
         +-> ecrit Nouveaux_sur_le_site\index.html
```

**Important :**
- `update_index.ps1` doit rester encode en **UTF-8 avec BOM** (sinon PowerShell 5.1 casse les accents francais : `injecte` -> `injectA(c)`).
- La regeneration **ecrase** `index.html` -> toute edition manuelle est perdue. Customisations a faire dans `update_index.ps1` (template HTML inline, vars `$pageTitle`, `$assetsRoot`, `$canonicalUrl`).

## Axes explores

### Cote ChatGPT — site comme terrain de jeu
- Interaction immediate : bouton "Surprise", melange auto de textures, filtres temps reel
- Mini-outils perso : generateur palettes, textures repetables, mosaique
- Mode bac a sable : drag & drop images, calques, zoom/rotation
- Dimension sensorielle : ambiance sonore, micro-animations
- Automatisation : "tableau du jour", rotation aleatoire, associations image/son/texture
- Mini-jeux rapides : puzzle, memory, intrus
- Hub local : parcours de disques, lanceur de scripts `.bat`

### Cote Claude — ressources gratuites + outils
- Contenus libres : mockups PSD, templates Canva/Figma, overlays video, LUTs, presets Lightroom, patterns SVG, loops audio, prompts IA, wallpapers, stickers, icones Lottie
- Outils webmaster navigateur : compresseur image, convertisseurs (HEIC/WebP/SVG), fond IA local, favicon, QR, meta SEO, minifier, palette, degrade CSS, contraste WCAG
- UX/Navigation : barre recherche globale, tags/filtres, menu hierarchique, page Nouveautes, mode sombre, PWA, favoris localStorage
- Communaute : soumissions, commentaires, newsletter, tutoriels logiciels libres, challenges mensuels

## Prototype actuel

`chatgpt/index.html` — page HTML autonome :
- Chargement d'un dossier d'images (`webkitdirectory`)
- Galerie cliquable -> rendu sur `<canvas>`
- Mode aleatoire (5 copies alpha variable)
- Drag & drop de fichiers
- Fonction `applyTexture()` (pattern repeat)

Ouvrir directement dans le navigateur, aucune dependance.

## Prerequis

- Windows + PowerShell 5.1+ (pour `update_index.bat` / `update_index.ps1`)
- Navigateur moderne (CSS vars + `localStorage` + `aspect-ratio`)

## Direction

> Penser **outil personnel interactif**, pas site web classique.
> Priorites : interaction · automatisation · experimentation.
