// This script detects if a page is tagged as being within a melonking.net frame; it then allows page elements linking back to melonking.net to be disabled because they are unnecessary as you are already on that site!

var isInMelonFrame = false;

window.addEventListener("DOMContentLoaded", (e) => {
    let inFrameStyle = "<style>.disableInMelonFrame {display: none !important;}</style>";
    let params = new URLSearchParams(window.location.search);
    isInMelonFrame = params.get("melonframe") != null;
    if (isInMelonFrame) {
        document.head.innerHTML += inFrameStyle;
    }
});
