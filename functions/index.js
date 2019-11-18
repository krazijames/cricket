const functions = require('firebase-functions');
const firebase_tools = require('firebase-tools');

exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .firestore.document('{collectionId}/{documentId}')
  .onDelete(async (snapshot) => {
    await firebase_tools.firestore.delete(snapshot.ref.path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
    });
  });
