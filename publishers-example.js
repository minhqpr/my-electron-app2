// Example publishers configuration for forge.config.js
// Uncomment and configure the publishers you want to use

module.exports = {
  // ... existing config ...
  
  publishers: [
    // GitHub Releases publisher
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'yourusername',
          name: 'my-electron-app'
        },
        prerelease: false,
        draft: true
      }
    },
    
    // S3 publisher
    // {
    //   name: '@electron-forge/publisher-s3',
    //   config: {
    //     bucket: 'your-bucket-name',
    //     folder: 'releases',
    //     public: true
    //   }
    // },
    
    // Snap Store publisher
    // {
    //   name: '@electron-forge/publisher-snapcraft',
    //   config: {
    //     snapName: 'my-electron-app',
    //     channels: ['stable', 'edge']
    //   }
    // }
  ]
};
