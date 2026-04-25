# Nouveaux_sur_le_site

Hub local : `index.html` racine = menu central des galeries / templates / experimentations stockes dans `Les_Index_Magique/`. Genere automatiquement par PowerShell.

## Contenu

```
.
├── index.html                  # Menu central genere (cartes -> Les_Index_Magique/...)
├── .gitignore                  # Exclut images/videos/musiques/archives
└── Les_Index_Magique/
    ├── *.html                  # Pages racine (Claude, Compteurs, L'Arbre, Le Monde Farfelu, ...)
    ├── <tiroir>/*.html         # Tiroirs : sous-dossiers contenant des .html (templates, gabarits)
    ├── update_index.ps1        # Generateur de ../index.html (UTF-8 BOM obligatoire)
    └── update_index.bat        # Lanceur double-clic du generateur
```

## index.html (menu central)

Page racine **regeneree** par `Les_Index_Magique\update_index.bat`.

**Comportement du generateur :**
- Scanne `Les_Index_Magique\*.html` (sauf `index.html` eventuel) -> 1 carte par fichier
- Scanne sous-dossiers de `Les_Index_Magique` (1 niveau) :
  - Tous les `*.html` deviennent des cartes
  - Si `index.html` -> titre = nom du tiroir seul (ex: `dist`, `html5up-multiverse`)
  - Sinon -> titre = `Tiroir / Fichier` (ex: `Horreur Super / index-1`)
  - Tag bas-droite = nom du tiroir
- Sous-dossiers IGNORES : `assets`, `images`, `css`, `js`, `fonts`, `vendor`
  (modifiable via `$skipDirs` dans `update_index.ps1`)
- Tiroirs sans `.html` -> auto-skippes (ex: `*_files` exports HTML complet)
- Tri alphabetique global
- Hrefs prefixees par `Les_Index_Magique/` (car `index.html` est un cran au-dessus)
- Vignettes = degrade HSL calcule par hash du titre (pas d'image requise)

**Snippet impose (integre tel quel a chaque regeneration) :**
- `<head>` : `canonical`, favicons png+ico, `style.css`, `script.js`, `menu.js` (defer), `basedusite.css`, `couleurs.js` (tous depuis `https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h/Site_Web/`)
- `<body>` : `<nav class="social-menu">` (Pinterest / Flickr / Tumblr / X / YouTube) + `<header></header>` rempli par `menu.js`

**Mode sombre / clair :**
- Bouton fixe haut-droite (`Mode sombre` / `Mode clair`)
- CSS vars (`:root` clair, `html[data-theme="dark"]` sombre)
- Persistance `localStorage`
- Pre-application inline en `<head>` -> pas de flash blanc au chargement en mode sombre

**Style cartes :** pellicule cafe (rotation 3deg, bord rose inset, animation film roll au hover), reprise du style original de VideosLoom.

## Generation / mise a jour

```
double-clic : Les_Index_Magique\update_index.bat
   |
   +-> powershell -File update_index.ps1
         |
         +-> ecrit Nouveaux_sur_le_site\index.html
```

**Important :**
- `update_index.ps1` doit rester encode en **UTF-8 avec BOM** (sinon PowerShell 5.1 casse les accents francais : `injecte` -> `injectA(c)`).
- La regeneration **ecrase** `index.html` -> toute edition manuelle est perdue. Customisations a faire dans `update_index.ps1` (template HTML inline, vars `$pageTitle`, `$assetsRoot`, `$canonicalUrl`, `$skipDirs`).

## .gitignore

Exclut tous les binaires multimedia / archives :
- Images : `*.jpg`, `*.png`, `*.gif`, `*.webp`, `*.bmp`, `*.avif`, `*.svg`, `*.ico`, `*.tif`, `*.heic`, `*.psd`, `*.ai`, `*.eps`, `*.raw`
- Videos : `*.mp4`, `*.mov`, `*.avi`, `*.mkv`, `*.webm`, `*.wmv`, `*.flv`, `*.m4v`, `*.mpg`, `*.3gp`, `*.ts`, `*.vob`
- Audio : `*.mp3`, `*.wav`, `*.ogg`, `*.flac`, `*.aac`, `*.m4a`, `*.wma`, `*.opus`, `*.aiff`, `*.mid`
- Archives : `*.rar`, `*.7z`, `*.zip`
- Garde la structure des tiroirs vides via `!.gitkeep`

Pour preserver un dossier vide dans git : creer un fichier `.gitkeep` dedans.

## Prerequis

- Windows + PowerShell 5.1+ (pour `update_index.bat` / `update_index.ps1`)
- Navigateur moderne (CSS vars + `localStorage` + `aspect-ratio`)

## Direction

> Penser **outil personnel interactif**, pas site web classique.
> Priorites : interaction · automatisation · experimentation.
