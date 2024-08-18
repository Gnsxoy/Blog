/**
 * { 结构表示 👇
 *  'key1': [{ fn: fn1, isOnce: false }, { fn: fn2, isOnce: true }],
 *  'key2': [{ fn: fn3, isOnce: false }],
 *  'key3': [{ fn: fn4, isOnce: true }]
 * }
 * @description
 * @class EventBus
 */
class EventBus {
  private events: {
    [key: string]: {
      fn: Function;
      isOnce: boolean;
    }[];
  };
  private static _instance: EventBus;

  private constructor() {
    this.events = {};
  };
  static getInstance(): EventBus {
    if (!this._instance) {
      this._instance = new EventBus();
    }
    return this._instance;
  };

  on(type: string, fn: Function, isOnce: boolean = false): this {
    if (!this.events[type]) {
      this.events[type] = [];
    };
    this.events[type].push({ fn, isOnce });
    return this;
  };

  once(type: string, fn: Function): this {
    return this.on(type, fn, true);
  };

  off(type: string, fn?: Function): this {
    if (!fn) {
      delete this.events[type];
    } else {
      const funList = this.events[type];
      if (funList && funList.length) {
        this.events[type] = funList?.filter((_item) => _item.fn !== fn);
      };
    };
    return this;
  };

  emit(type: string, ...args: any[]): void {
    const funList = this.events[type];
    if (funList && funList.length) {
      this.events[type] = funList?.filter((_item) => {
        const { fn, isOnce } = _item;
        fn(...args);
        return !isOnce;
      });
    }
  };
};

export default EventBus.getInstance();
