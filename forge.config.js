const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    // icon: './assets/icon', // Add your app icon here
    name: 'MyElectronApp',
    executableName: 'my-electron-app',
    appBundleId: 'com.yourcompany.my-electron-app',
    appCategoryType: 'public.app-category.productivity',
    // Uncomment and configure these for production code signing:
    // osxSign: {
    //   identity: 'Developer ID Application: Your Name (XXXXXXXXXX)',
    //   'hardened-runtime': true,
    //   'gatekeeper-assess': false,
    //   entitlements: 'entitlements.plist',
    //   'entitlements-inherit': 'entitlements.plist',
    // },
    // osxNotarize: {
    //   appleId: process.env.APPLE_ID,
    //   appleIdPassword: process.env.APPLE_ID_PASSWORD,
    // },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'my_electron_app',
        authors: 'Your Name',
        description: 'A modern Electron application',
        setupExe: 'MyElectronAppSetup.exe',
        // setupIcon: './assets/icon.ico', // Add icon when available
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        name: 'MyElectronApp-macOS',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Your Name',
          homepage: 'https://github.com/yourusername/my-electron-app',
          description: 'A modern Electron application',
          productDescription: 'A cross-platform desktop application built with Electron',
          categories: ['Utility'],
          // icon: './assets/icon.png', // Add icon when available
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'Your Name',
          homepage: 'https://github.com/yourusername/my-electron-app',
          description: 'A modern Electron application',
          productDescription: 'A cross-platform desktop application built with Electron',
          categories: ['Utility'],
          // icon: './assets/icon.png', // Add icon when available
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
