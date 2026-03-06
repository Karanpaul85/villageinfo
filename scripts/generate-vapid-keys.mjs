// scripts/generate-vapid-keys.mjs
// Run: node scripts/generate-vapid-keys.mjs

import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("\n✅ VAPID Keys generated! Add these to your .env.local:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_EMAIL=your-email@example.com`);
console.log(
  "\n⚠️  Keep VAPID_PRIVATE_KEY secret. Never expose it to the client.\n",
);
