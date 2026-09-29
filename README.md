# Neon District — VS Code Theme Pack

A high-contrast cyberpunk theme for VS Code. The editor is near-black, the Explorer uses muted purple-gray, and orange neon highlights the active tab and keywords. Cyan functions, lime strings, lavender properties, blue-violet types, and pink numbers stay distinct in code. The status bar is dark with a thin orange border.

The **Laptop** color theme has lighter editor and sidebar surfaces for displays where the original appears too dark. Both variants use the same syntax colors and muted status bar.

The **Cyberpunk+** variant gives the active tab a brighter violet surface and cyan label, with a hot-pink upper edge on classic tabs. Both classic and modern VS Code tab styles are colored. Inactive tabs are dimmer so the selected file stands apart. It also adds a cyan Explorer focus outline and a darker purple terminal while keeping the syntax palette and muted status bar.

This repository disables the VS Code error-line audio cue in its workspace settings.

Plain HTML text inside elements is white in all three color themes, while tag names keep their pink accent.

## Included packages

| Package | What it contains |
| --- | --- |
| `neon-district-theme-0.1.9.vsix` | Three color themes: **Purple Dashboard**, **Laptop**, and **Cyberpunk+**. It also includes the original Neon District file icon theme. |
| `material-neon-icons/material-neon-icons-0.1.0.vsix` | Philipp Kief's Material file icons, with distinct project folders and custom Markdown and CSV icons. The upstream MIT license is included. |

Install both VSIX files from VS Code's Extensions view with **Install from VSIX...**. Then choose **Neon District — Cyberpunk+** under **Preferences: Color Theme** and **Material Neon Icons** under **Preferences: File Icon Theme**.

## Build

Run these commands from the repository root in PowerShell:

```powershell
.\build-vsix.ps1
.\material-neon-icons\build-vsix.ps1
```

The Material icon build uses Material Icon Theme 5.38.1 by Philipp Kief, which must be installed in the local VS Code extensions folder. The ready-to-install VSIX is included in the repository.

## Color themes

1. In VS Code, open **Extensions** (`Ctrl+Shift+X`).
2. Open the `...` menu and choose **Install from VSIX...**.
3. Select the newest `neon-district-theme-*.vsix` from this folder.
4. Open **Preferences: Color Theme** (`Ctrl+K`, then `Ctrl+T`) and choose **Neon District — Purple Dashboard**.

Your previous theme stays available in the theme picker.

## Icon themes

The Material Neon Icons package keeps the Material file icons and associations, recolors eleven project folder types, and supplies custom Markdown and CSV icons. The color theme VSIX also contains **Neon District Icons**, a separate original icon set for JavaScript, TypeScript, JSON, tests, HTML, CSS, images, and folders.

If colors look different from this theme, check `workbench.colorCustomizations` and `editor.tokenColorCustomizations` in your User or Workspace settings: those overrides take precedence over theme colors.
