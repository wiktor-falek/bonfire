class ProfileSubscriptionService {
  private profileIdToClientIdsMap: Map<string, Set<string>>;

  constructor() {
    this.profileIdToClientIdsMap = new Map();
  }

  subscribe(clientId: string, profileIds: string[]) {
    for (const profileId of profileIds) {
      const clientIds =
        this.profileIdToClientIdsMap.get(profileId) ?? new Set();
      clientIds.add(clientId);
      this.profileIdToClientIdsMap.set(profileId, clientIds);
    }
  }

  unsubscribe(clientId: string, profileIds: string[]) {
    for (const profileId of profileIds) {
      const clientIdsSet = this.profileIdToClientIdsMap.get(profileId);
      clientIdsSet?.delete(clientId);
    }
  }

  getProfileSubscribers(profileId: string): IterableIterator<string> {
    const subscribers = this.profileIdToClientIdsMap.get(profileId) ?? [];
    return subscribers.values();
  }
}

export default ProfileSubscriptionService;
