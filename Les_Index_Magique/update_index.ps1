# =============================================================================
#  update_index.ps1  (Les_Index_Magique)
# -----------------------------------------------------------------------------
#  Role
#   Regenerer index.html (menu central) PLACE A LA RACINE DU PROJET
#   (Nouveaux_sur_le_site\index.html) a partir du contenu de Les_Index_Magique.
#
#  Comportement
#   - Scanne tous les *.html de Les_Index_Magique (sauf index.html eventuel).
#   - Scanne les sous-dossiers contenant un index.html (ex: VideosLoom).
#   - Une carte ".video" par entree, triee par nom alphabetique.
#   - Titre = nom du fichier (ou du sous-dossier) sans extension.
#   - Cartes = degrade pastel calcule par hash du titre (pas d'image requise).
#   - Tous les liens sont prefixes par "Les_Index_Magique/" car index.html
#     est un cran au-dessus.
#   - <head> integre les ressources externes filedn.eu (CSS/JS/favicons).
#   - <nav class="social-menu"> + <header> (injecte par menu.js) preserves.
#   - Mode sombre / clair via CSS vars + bouton toggle (localStorage).
#
#  Usage
#   Lance via update_index.bat, ou directement :
#     powershell -NoProfile -ExecutionPolicy Bypass -File update_index.ps1
#
#  Sortie
#   Ecrit ..\index.html (parent de Les_Index_Magique), encodage UTF-8 (BOM).
#
#  IMPORTANT
#   Le script DOIT rester encode en UTF-8 avec BOM. Sinon PowerShell 5.1
#   casse les accents francais ("injecte" -> "injectA(c)") dans le HTML.
# =============================================================================

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Chemins : racine = dossier du script
# ---------------------------------------------------------------------------
$dir = $PSScriptRoot
if (-not $dir) { $dir = Split-Path -Parent $MyInvocation.MyCommand.Path }

# Sortie : index.html un cran au-dessus (racine du projet)
$rootDir   = Split-Path -Parent $dir
$outFile   = Join-Path $rootDir 'index.html'

# Prefixe URL pour atteindre Les_Index_Magique depuis la racine
$linkPrefix = (Split-Path -Leaf $dir) + '/'

# ---------------------------------------------------------------------------
# Parametres modifiables
# ---------------------------------------------------------------------------
# Racine des ressources externes (CSS/JS/favicons de Pascal)
$assetsRoot   = 'https://filedn.eu/llN3kr5vmyEBPIWCwFj3O6h'

# Titre de la page
$pageTitle    = 'Les Index Magique - Pascal Delfosse'

# URL canonique (snippet fourni par Pascal pointe vers la racine filedn)
$canonicalUrl = "$assetsRoot/"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function HtmlEncode([string]$s) {
    return ($s -replace '&','&amp;' `
                -replace '<','&lt;' `
                -replace '>','&gt;' `
                -replace '"','&quot;')
}

# Hash deterministe d'un titre -> teinte HSL stable (degrade par carte)
function HueFromString([string]$s) {
    $sum = 0
    foreach ($c in $s.ToCharArray()) { $sum += [int]$c }
    return ($sum * 37) % 360
}

# Culture francaise pour "juin 2010", etc.
$frCulture = [Globalization.CultureInfo]::GetCultureInfo('fr-FR')

# ---------------------------------------------------------------------------
# Collecte des entrees
#   - Fichiers .html (sauf index.html lui-meme)
#   - Sous-dossiers contenant un index.html
# ---------------------------------------------------------------------------
$entries = @()

# Fichiers .html du dossier Les_Index_Magique
Get-ChildItem -LiteralPath $dir -File -Filter '*.html' |
    Where-Object { $_.Name -ne 'index.html' } |
    ForEach-Object {
        $entries += [pscustomobject]@{
            Title = [IO.Path]::GetFileNameWithoutExtension($_.Name)
            Href  = $linkPrefix + [Uri]::EscapeDataString($_.Name)
            Date  = $_.LastWriteTime
            Kind  = 'page'
        }
    }

# Sous-dossiers de Les_Index_Magique contenant un index.html
Get-ChildItem -LiteralPath $dir -Directory |
    ForEach-Object {
        $idx = Join-Path $_.FullName 'index.html'
        if (Test-Path -LiteralPath $idx) {
            $entries += [pscustomobject]@{
                Title = $_.Name
                Href  = $linkPrefix + [Uri]::EscapeDataString($_.Name) + '/index.html'
                Date  = (Get-Item -LiteralPath $idx).LastWriteTime
                Kind  = 'folder'
            }
        }
    }

# Tri alphabetique stable
$entries = $entries | Sort-Object Title

# ---------------------------------------------------------------------------
# Generation des cartes
# ---------------------------------------------------------------------------
$i = 0
$cardBlocks = foreach ($e in $entries) {
    $i++
    $id    = "card-$i"
    $title = HtmlEncode $e.Title
    $href  = $e.Href
    $date  = HtmlEncode ($e.Date.ToString('MMMM yyyy', $frCulture))
    $hue1  = HueFromString $e.Title
    $hue2  = ($hue1 + 40) % 360
    $tag   = if ($e.Kind -eq 'folder') { 'dossier' } else { 'page' }

@"
            <div class="video" id="$id">
                <style>
                    #$id a span {
                        background: linear-gradient(135deg,
                            hsl($hue1, 70%, 65%) 0%,
                            hsl($hue2, 70%, 50%) 100%);
                    }
                </style>
                <a href="$href">
                    <span></span>
                    <h2>$title</h2>
                </a>
                <div class="info">
                    <span>$date</span>
                    <span>$tag</span>
                </div>
            </div>
"@
}

$cardsHtml = ($cardBlocks -join "`r`n        ")

# ---------------------------------------------------------------------------
# Template HTML complet
#
#   Snippet impose par Pascal (integre TEL QUEL aux bons endroits) :
#     - <link rel="canonical">
#     - favicons png + ico
#     - style.css + script.js
#     - menu.js (defer) + basedusite.css
#     - couleurs.js (fondu pastel)
#     - <nav class="social-menu"> avec Pinterest/Flickr/Tumblr/X/YouTube
#     - <header></header> (injecte par menu.js)
#
#   Ajouts :
#     - CSS vars pour mode sombre/clair
#     - Bouton toggle (haut-droite, persistant via localStorage)
# ---------------------------------------------------------------------------
$html = @"
<!DOCTYPE html>
<html lang="fr">
<head>

<title>$pageTitle</title>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow">

<link rel="canonical" href="$canonicalUrl">

<link rel="icon" href="$assetsRoot/Site_Web/favicondepascal.png" type="image/png">
<link rel="icon" href="$assetsRoot/Site_Web/favicondepascal.ico" type="image/x-icon">

<!-- Lier le menu social -->
  <link rel="stylesheet" type="text/css" href="$assetsRoot/Site_Web/style.css">
  <script src="$assetsRoot/Site_Web/script.js"></script>

<!-- Lier le fichier JavaScript du menu -->
<script src="$assetsRoot/Site_Web/menu.js" defer></script>
<link rel="stylesheet" href="$assetsRoot/Site_Web/basedusite.css">

<!-- Le JS pour fondu pastel -->
<script src="$assetsRoot/Site_Web/couleurs.js"></script>

<style>
    /* Variables theme : valeurs par defaut = mode clair */
    :root {
        --bg-color: rgb(238, 238, 238);
        --bg-image: url("https://loom.cafe/images/metal.png");
        --text-color: rgb(47, 0, 74);
        --link-color: rgb(0, 0, 0);
        --info-color: #6e6e6e;
        --header-color: #1f1f1f;
        --shadow-color: rgba(166, 166, 166, 0.524);
        --card-border: rgb(185, 83, 115);
        --toggle-bg: #ffffff;
        --toggle-fg: #1f1f1f;
    }

    /* Mode sombre : surcharge des vars */
    html[data-theme="dark"] {
        --bg-color: #15131c;
        --bg-image: linear-gradient(135deg, #1a1626 0%, #0d0a14 100%);
        --text-color: #f1e8ff;
        --link-color: #f1e8ff;
        --info-color: #b8a8d4;
        --header-color: #f1e8ff;
        --shadow-color: rgba(0, 0, 0, 0.6);
        --card-border: rgb(225, 120, 155);
        --toggle-bg: #2a2438;
        --toggle-fg: #f1e8ff;
    }

    body {
        font-family: "Arial", sans-serif;
        background-color: var(--bg-color);
        color: var(--text-color);
        background-image: var(--bg-image);
        background-size: cover;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    main,
    header,
    footer {
        margin: 40px;
    }

    a:hover {
        text-decoration: none;
    }

    a,
    a:visited {
        color: var(--link-color);
    }

    h1,
    h2 {
        text-shadow: 3px 3px var(--shadow-color);
    }

    header h1 {
        color: var(--header-color);
    }

    main {
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        gap: 25px;
    }

    .video {
        flex: 1 1 250px;
        max-width: 300px;
        min-width: 200px;
    }

    .video a span {
        width: 100%;
        aspect-ratio: 16 / 10;
        background-color: black;
        border: 2px inset var(--card-border);
        border-radius: 8px;
        display: block;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        margin: auto;
        transform: rotate(3deg);
        position: relative;
        overflow: hidden;
        transition: transform 0.2s ease;
    }

    .video a:hover span {
        transform: rotate(-2deg) scale(1.03);
    }

    .video a span::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 15px;
        height: 100%;
        background: radial-gradient(circle, #fcfcfc 30%, black 31%) center 10px/10px 20px repeat-y, black;
    }

    .video a:hover span::before {
        animation: filmRoll 0.3s linear infinite;
    }

    .video h2 {
        font-size: 1em;
        margin: 10px 5px;
    }

    .info {
        font-size: 0.8em;
        color: var(--info-color);
        margin-bottom: 10px;
    }

    .info span:last-of-type {
        float: right;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Bouton toggle theme : haut-droite, fixe */
    .theme-toggle {
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 9999;
        background: var(--toggle-bg);
        color: var(--toggle-fg);
        border: 1px solid var(--card-border);
        border-radius: 999px;
        padding: 8px 14px;
        font-family: inherit;
        font-size: 0.9em;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        transition: background 0.3s ease, color 0.3s ease;
    }

    .theme-toggle:hover {
        opacity: 0.85;
    }

    @media (max-width: 800px) {
        main,
        header,
        footer {
            margin: 20px;
            text-align: center;
            justify-content: center;
        }
    }

    @keyframes filmRoll {
      0% { background-position: center 10px; }
      100% { background-position: center 30px; }
    }
</style>

<script>
    // Pre-applique le theme avant le rendu (evite le flash blanc en mode sombre)
    (function() {
        try {
            var t = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', t);
        } catch (e) {}
    })();
</script>

</head>

<body>

<!-- menu social -->
  <nav class="social-menu">
    <ul>
      <li><a href="https://fr.pinterest.com/pascal509/mes-tableaux-tous-genre/" target="_blank">Pinterest</a></li>
      <li><a href="https://www.flickr.com/photos/delfossepascal" target="_blank">Flickr</a></li>
      <li><a href="https://www.tumblr.com/lestoilesdepascal" target="_blank">Tumblr</a></li>
      <li><a href="https://x.com/PascalDelfossee" target="_blank">X</a></li>
      <li><a href="https://www.youtube.com/c/DelfossePascal" target="_blank">YouTube</a></li>
    </ul>
  </nav>

<!-- Le menu sera injecté ici -->
<header></header>

<!-- Bouton bascule clair / sombre -->
<button class="theme-toggle" id="themeToggle" type="button" aria-label="Basculer mode clair/sombre">
    Mode sombre
</button>

<main>
        $cardsHtml
</main>
<footer></footer>

<script>
    // Bascule clair/sombre + persistance localStorage
    (function() {
        var btn = document.getElementById('themeToggle');
        var root = document.documentElement;

        function syncLabel() {
            var cur = root.getAttribute('data-theme') || 'light';
            btn.textContent = (cur === 'dark') ? 'Mode clair' : 'Mode sombre';
        }
        syncLabel();

        btn.addEventListener('click', function() {
            var cur = root.getAttribute('data-theme') || 'light';
            var next = (cur === 'dark') ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            syncLabel();
        });
    })();
</script>

</body>
</html>
"@

# ---------------------------------------------------------------------------
# Ecriture finale
# ---------------------------------------------------------------------------
Set-Content -LiteralPath $outFile -Value $html -Encoding UTF8
Write-Host ("index.html regenere : {0} entree(s) -> {1}" -f $entries.Count, $outFile) -ForegroundColor Green
