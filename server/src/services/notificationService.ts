import EventEmitter from "events";

type Events = {
  "friend-invite": { from: string };
};

type Key<Events> = Extract<keyof Events, string>;

class NotificationService {
  private eventEmitter: EventEmitter;
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  notify<K extends Key<Events>>(userId: string, event: K, data: Events[K]) {
    this.eventEmitter.emit(`${userId}-${event}`, data);
  }

  subscribe<K extends Key<Events>>(
    userId: string,
    event: K,
    cb: (data: Events[K]) => void
  ) {
    this.eventEmitter.on(`${userId}-${event}`, cb);
    return cb;
  }

  unsubscribe<K extends Key<Events>>(
    userId: string,
    event: K,
    handle: (...args: any[]) => void
  ) {
    this.eventEmitter.off(`${userId}-${event}`, handle);
  }

  unsubscribeFromAll(userId: string) {
    const userEvents = this.eventEmitter
      .eventNames()
      .filter((e) => e.toString().startsWith(`${userId}-`));

    const length = userEvents.length;
    for (let i = 0; i < length; i++) {
      const event = userEvents[i]!;
      this.eventEmitter.removeAllListeners(event);
    }
  }
}

export default NotificationService;
