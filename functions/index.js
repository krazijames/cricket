const functions = require('firebase-functions');
const firebase_tools = require('firebase-tools');

exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(({ path }) => {
    return firebase_tools.firestore.delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
    });
  });