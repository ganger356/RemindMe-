# Building the RemindMe! Installer

The app is a Vite + React build wrapped in Electron. `electron-builder`
produces the platform installer.

## Windows installer (`.exe`)

```bash
npm install            # installs deps; postinstall applies patches/ automatically
npm run electron:build # -> release/RemindMe! Setup 1.0.0.exe
```

The output is a Windows NSIS installer:

- User-selectable install directory
- Desktop + Start Menu shortcuts
- Bundled uninstaller

### Building on Windows

Nothing special is required — `npm run electron:build` works out of the
box. All native tooling (`rcedit`, `signtool`, the NSIS uninstaller
extraction) runs natively.

### Building on Linux (cross-compiling for Windows)

Cross-building the Windows `.exe` from Linux needs a couple of
workarounds because `electron-builder` normally shells out to 32-bit
Windows helpers via Wine:

1. **Uninstaller extraction** — patched via `patch-package` (see
   `patches/app-builder-lib+26.8.1.patch`). The patch makes
   electron-builder use its built-in pure-JS `UninstallerReader` on
   non-Windows hosts instead of running the installer under `wine32`.
   This applies automatically on `npm install` through the
   `postinstall` script.

2. **`rcedit` (sets exe icon + version metadata)** — electron-builder
   invokes `rcedit-ia32.exe` under Wine. Where 32-bit Wine is
   unavailable, point it at the 64-bit build instead:

   ```bash
   RCEDIT_DIR="$HOME/.cache/electron-builder/winCodeSign/winCodeSign-2.6.0"
   cp "$RCEDIT_DIR/rcedit-x64.exe" "$RCEDIT_DIR/rcedit-ia32.exe"
   ```

   (The cache is populated on the first build attempt.)

3. **Run under 64-bit Wine + disable code signing:**

   ```bash
   CSC_IDENTITY_AUTO_DISCOVERY=false \
   WINEARCH=win64 WINEPREFIX=/tmp/wine64 \
   npm run electron:build
   ```

## Linux installer (`.AppImage`)

```bash
npm run electron:build:linux # -> release/RemindMe!-1.0.0.AppImage
```

## Icons

`public/icon.png` (256×256) and `public/icon512.png` are generated from
`public/favicon.svg`. To regenerate:

```bash
rsvg-convert -w 256 -h 256 public/favicon.svg -o public/icon.png
rsvg-convert -w 512 -h 512 public/favicon.svg -o public/icon512.png
```
