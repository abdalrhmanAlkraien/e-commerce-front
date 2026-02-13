import { useAuthStore } from '../store/authStore';

const CHANNEL_NAME = 'auth:logout';

/**
 * Initialises a BroadcastChannel listener so that a logout in one tab
 * is propagated to all other open tabs automatically.
 *
 * Returns a cleanup function — call it on app unmount.
 */
export function initAuthBroadcastSync(): () => void {
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);

    channel.onmessage = (event: MessageEvent<{ type: string }>) => {
      if (event.data?.type === 'LOGOUT') {
        useAuthStore.getState().logout();
      }
    };

    return () => channel.close();
  } catch {
    // BroadcastChannel not available (e.g. unsupported environment)
    return () => {};
  }
}
