# Config
appDir="desktop-dev/.";
appName="Project L.U.M.E.N";
appIcon="desktop-dev/img/icon.png"
appCompany="Elanis";
appBuildDir="desktop-build";
appDesc="";

# Remove old folders
rm -rf desktop-build/*

# Build cmds
electron-packager "$appDir" "$appName" --production -–asar=true --prune=true --overwrite --platform=win32 --arch=all --icon="$appIcon" --out="$appBuildDir" --version-string.CompanyName="$appCompany" --version-string.FileDescription="$appDesc" --version-string.ProductName="$appName"