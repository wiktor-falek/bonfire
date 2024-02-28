class ProfileSubscriptionStore {
  private profileIdToClientIdsMap: Map<string, Set<string>>;

  constructor() {
    this.profileIdToClientIdsMap = new Map();
  }

  addSubscriptions(clientId: string, profileIds: string[]) {
    for (const profileId of profileIds) {
      const clientIds =
        this.profileIdToClientIdsMap.get(profileId) ?? new Set();
      clientIds.add(clientId);
      this.profileIdToClientIdsMap.set(profileId, clientIds);
    }
  }

  getSubscribers(profileId: string): IterableIterator<string> {
    const subscribers = this.profileIdToClientIdsMap.get(profileId) ?? [];
    return subscribers.values();
  }

  deleteSubscriptions(clientId: string, profileIds: string[]) {
    for (const profileId of profileIds) {
      const clientIdsSet = this.profileIdToClientIdsMap.get(profileId);
      clientIdsSet?.delete(clientId);
    }
  }
}

export default ProfileSubscriptionStore;
