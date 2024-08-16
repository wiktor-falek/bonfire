import { describe, it, beforeEach, expect } from "vitest";
import { ProfileSubscriptionStore } from "./profileSubscription.js";

describe("subscription store", () => {
  let store: ProfileSubscriptionStore;

  beforeEach(() => {
    store = new ProfileSubscriptionStore();
  });

  it("adds and retrieves subscription", () => {
    const clientId = "clientId-1";
    const profileIds = ["profileId-1", "profileId-2", "profileId-3"];
    store.addSubscriptions(clientId, profileIds);

    for (const profileId of profileIds) {
      const subscribers = [...store.getSubscribers(profileId)];

      expect(subscribers.length).toBe(1);
      expect(subscribers[0]).toBe(clientId);
    }

    const subscriptions = store.getSubscriptions(clientId);

    expect(subscriptions.length).toBe(3);

    for (const profile of profileIds) {
      expect(subscriptions.includes(profile));
    }
  });
});
