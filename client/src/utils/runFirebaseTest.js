import { testFirebaseConnection } from './firebaseTest';

console.log('🚀 Running Firebase Connection Test\n');

testFirebaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Firebase connection test completed successfully!');
    } else {
      console.log('\n❌ Firebase connection test failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Error running Firebase test:', error);
    process.exit(1);
  }); 