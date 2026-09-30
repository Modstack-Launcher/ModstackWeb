const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID?.trim() ?? "";
const homeSlotId = import.meta.env.VITE_ADSENSE_HOME_SLOT_ID?.trim() ?? "";
const contentSlotId = import.meta.env.VITE_ADSENSE_CONTENT_SLOT_ID?.trim() ?? "";

const isPublisherId = (value: string) => /^ca-pub-\d+$/.test(value);
const isSlotId = (value: string) => /^\d+$/.test(value);

export const adsenseConfig = {
  publisherId: isPublisherId(publisherId) ? publisherId : "",
  homeSlotId: isSlotId(homeSlotId) ? homeSlotId : "",
  contentSlotId: isSlotId(contentSlotId) ? contentSlotId : "",
} as const;

export const isAdsenseConfigured = Boolean(
  adsenseConfig.publisherId &&
    (adsenseConfig.homeSlotId || adsenseConfig.contentSlotId),
);
