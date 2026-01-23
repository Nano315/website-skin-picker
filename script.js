/**
 * SkinPicker Landing Page Script
 * Gère la récupération dynamique de la dernière release GitHub
 */

// --- CONFIGURATION ---
// Modifiez ces constantes selon votre repo réel
const REPO_OWNER = 'nano315'; 
const REPO_NAME = 'lol-skin-picker';

document.addEventListener('DOMContentLoaded', () => {
    fetchLatestRelease();

    // GA4 Tracking for Download Button
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Send custom event to GA4
             if (typeof gtag === 'function') {
                gtag('event', 'download_click', { 
                    'event_category': 'conversion', 
                    'event_label': 'windows_app' 
                });
             }
        });
    }
});

/**
 * Récupère les infos de la dernière release via l'API GitHub
 */
async function fetchLatestRelease() {
    const btn = document.getElementById('download-btn');
    const versionSpan = document.getElementById('version-tag');
    const defaultUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

    // Met à jour le lien par défaut immédiatement au cas où le JS plante plus tard
    btn.href = defaultUrl;

    try {
        console.log(`Fetching latest release for ${REPO_OWNER}/${REPO_NAME}...`);
        
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // 1. Mise à jour du numéro de version
        if (data.tag_name) {
            versionSpan.textContent = `Version ${data.tag_name}`;
        } else {
            versionSpan.textContent = "Latest version";
        }

        // 2. Recherche de l'asset .exe
        // On cherche un fichier qui finit par .exe dans la liste des assets
        const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));

        if (exeAsset && exeAsset.browser_download_url) {
            btn.href = exeAsset.browser_download_url;
            console.log("Download URL updated:", exeAsset.browser_download_url);
        } else {
            console.warn("Aucun fichier .exe trouvé dans la dernière release.");
            // Le lien reste celui de la page release par défaut défini au début
        }

    } catch (error) {
        console.error("Erreur lors du fetch GitHub:", error);
        // Fallback visuel
        versionSpan.textContent = "Download via GitHub";
        // Le lien est déjà set sur defaultUrl
    }
}
