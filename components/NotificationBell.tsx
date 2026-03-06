"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";

/**
 * Drop-in notification bell button.
 * Place this anywhere in your layout (e.g. navbar).
 *
 * <NotificationBell />
 */
export default function NotificationBell() {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  if (!isSupported) return null; // Hide on unsupported browsers

  const handleClick = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      const result = await subscribe();
      if (!result.success && result.error === "Permission denied") {
        alert("Please allow notifications in your browser settings.");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || permission === "denied"}
      title={
        permission === "denied"
          ? "Notifications blocked — enable in browser settings"
          : isSubscribed
            ? "Disable notifications"
            : "Enable notifications"
      }
      className={`relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all ${isLoading ? "cursor-wait opacity-60" : "cursor-pointer"} ${
        isSubscribed
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${permission === "denied" ? "cursor-not-allowed opacity-40" : ""} `}
    >
      {/* Bell icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill={isSubscribed ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
        />
      </svg>

      {isLoading ? (
        <span>...</span>
      ) : isSubscribed ? (
        <span>Notifications On</span>
      ) : (
        <span>Notify Me</span>
      )}

      {/* Green dot when subscribed */}
      {isSubscribed && !isLoading && (
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500" />
      )}
    </button>
  );
}
