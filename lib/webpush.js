import webpush from "web-push";

// ✅ Configure VAPID keys (set these in .env.local)
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

/**
 * Send a push notification to a single subscription
 * @param {Object} subscription - The push subscription object { endpoint, keys }
 * @param {Object} payload - Notification payload { title, body, url, icon }
 */
export async function sendPushNotification(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    // Subscription expired or invalid — return error code so caller can remove it
    return { success: false, statusCode: error.statusCode, error };
  }
}

/**
 * Send a push notification to ALL subscriptions
 * @param {Array} subscriptions - Array of subscription documents from DB
 * @param {Object} payload - Notification payload { title, body, url, icon }
 * @returns {Object} { sent, failed, expiredEndpoints }
 */
export async function broadcastPushNotification(subscriptions, payload) {
  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      sendPushNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload),
    ),
  );

  const expiredEndpoints = [];
  let sent = 0;
  let failed = 0;

  results.forEach((result, i) => {
    const outcome = result.value || {};
    if (result.status === "fulfilled" && outcome.success) {
      sent++;
    } else {
      failed++;
      // 404 or 410 = subscription no longer valid
      if (outcome.statusCode === 404 || outcome.statusCode === 410) {
        expiredEndpoints.push(subscriptions[i].endpoint);
      }
    }
  });

  return { sent, failed, expiredEndpoints };
}

export default webpush;
