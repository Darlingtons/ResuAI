const { onRequest } = require("firebase-functions/v2/https");
const app = require("./server");

// Export our Express app as a Firebase Cloud Function
exports.api = onRequest({ cors: true, maxInstances: 10 }, app);
