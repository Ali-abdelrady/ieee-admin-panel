// utils/broadcast.ts
export const broadcast = new BroadcastChannel("rtk-query-sync");

export const broadcastInvalidation = (tag: string, id?: string | number) => {
  broadcast.postMessage({ type: "invalidate", tag, id });
};
