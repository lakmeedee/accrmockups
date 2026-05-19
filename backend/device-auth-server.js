// Sample Node.js backend for device code authentication with MSAL
const express = require('express');
const cors = require('cors');
const { PublicClientApplication } = require('@azure/msal-node');

const app = express();
app.use(cors());
app.use(express.json());

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID || 'YOUR_CLIENT_ID', // Set CLIENT_ID app setting in Azure
    authority: process.env.AUTHORITY || 'https://login.microsoftonline.com/common',
  },
};
const pca = new PublicClientApplication(msalConfig);

app.post('/device-login', async (req, res) => {
  try {
    const deviceCodeRequest = {
      scopes: ["User.Read"],
      deviceCodeCallback: (response) => {
        // Send device code instructions to frontend
        res.json({
          message: response.message,
          userCode: response.userCode,
          verificationUri: response.verificationUri,
        });
      },
    };
    // Start device code flow
    await pca.acquireTokenByDeviceCode(deviceCodeRequest);
    // After user authenticates, you can issue a session/token to the frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Device auth server running on port ${port}`);
});
