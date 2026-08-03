const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

const auth = getAuth();
const db = getFirestore();

const email = 'testuser@onlineresuai.co';
const password = '123456';

async function createUser() {
  try {
    // Delete existing user if it already exists to avoid conflict
    try {
      const existingUser = await auth.getUserByEmail(email);
      await auth.deleteUser(existingUser.uid);
      console.log('Deleted existing test user.');
    } catch (e) {
      // User doesn't exist, proceed
    }

    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: 'Test User',
    });
    
    // Create firestore document for this user
    await db.collection('users').doc(userRecord.uid).set({
      name: 'Test User',
      email: email,
      isPro: false,
      createdAt: FieldValue.serverTimestamp()
    });

    console.log('Successfully created test user in Auth and Firestore:', userRecord.uid);
    process.exit(0);
  } catch (error) {
    console.error('Error creating new user:', error);
    process.exit(1);
  }
}

createUser();
