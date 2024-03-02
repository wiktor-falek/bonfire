class ProfileSubscriptionStore {
  private subscriberClientIdToSubscriptions: Map<string, Set<string>>;
  private profileToSubscriberClientIds: Map<string, Set<string>>;

  constructor() {
    this.subscriberClientIdToSubscriptions = new Map();
    this.profileToSubscriberClientIds = new Map();
  }

  /**
   * Adds subscriptions for a client to the array of profiles.
   * @param clientId id of the client that subscribes to profile changes
   * @param profileIds ids of profiles that the client subscribes to
   */
  addSubscriptions(clientId: string, profileIds: string[]) {
    const profileIdsSet =
      this.subscriberClientIdToSubscriptions.get(clientId) ?? new Set();

    const length = profileIds.length;
    for (let i = 0; i < length; i++) {
      const profileId = profileIds[i]!;

      profileIdsSet.add(profileId);
      this.subscriberClientIdToSubscriptions.set(clientId, profileIdsSet);

      const subscriberClientIdsSet =
        this.profileToSubscriberClientIds.get(profileId) ?? new Set();

      subscriberClientIdsSet.add(clientId);
      this.profileToSubscriberClientIds.set(profileId, subscriberClientIdsSet);
    }

    return profileIdsSet;
  }

  /**
   * Retrieves profile ids that the client is subscribed to.
   * @param clientId id of the subscriber
   */
  getSubscriptions(clientId: string) {
    const subscriptions =
      this.subscriberClientIdToSubscriptions.get(clientId) ?? [];
    return Array.from(subscriptions);
  }

  /**
   * Retrieves client ids of all clients that subscribe to a profile
   * @param profileId id of the target profile
   */
  getSubscribers(profileId: string) {
    const subscribers = this.profileToSubscriberClientIds.get(profileId) ?? [];
    return Array.from(subscribers);
  }

  /**
   * Deletes client subscriptions from the array.
   * @param clientId
   * @param profileIds
   */
  deleteSubscriptions(clientId: string, profileIds: string[]) {
    // retrieve the subscriptions set of the user
    const profileIdsSet = this.subscriberClientIdToSubscriptions.get(clientId);

    // delete each profile subscription

    const length = profileIds.length;
    for (let i = 0; i < length; i++) {
      const profileId = profileIds[i]!;

      profileIdsSet?.delete(profileId);

      // delete profile to subscribers mapping
      this.profileToSubscriberClientIds.delete(profileId);
    }
  }

  clearSubscriptions(clientId: string) {
    // TODO: deleteAllSubscriptions if possible, if not possible make it possible
  }
}

export default ProfileSubscriptionStore;
