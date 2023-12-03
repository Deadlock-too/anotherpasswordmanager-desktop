// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

document.getElementById('toggle-dark-mode')?.addEventListener('click', async () => {
    // @ts-ignore
    const isDarkMode = await window.darkMode.toggle()
    let themeSource = document.getElementById('theme-source')
    if (!!themeSource) {
        themeSource.innerHTML = isDarkMode ? 'Dark' : 'Light'
    }
})

document.getElementById('reset-to-system')?.addEventListener('click', async () => {
    // @ts-ignore
    await window.darkMode.system()
    let themeSource = document.getElementById('theme-source')
    if (!!themeSource) {
        themeSource.innerHTML = 'System'
    }
})