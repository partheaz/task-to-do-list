interface Subscriber<T> {
  next: (value: T) => void;
  complete: () => void;
}

class SimpleObservable<T> {
  constructor(private executor: (subscriber: Subscriber<T>) => void) {}

  subscribe(observer: Subscriber<T>) {
    this.executor(observer);
    return {
      unsubscribe: () => {}
    };
  }
}

export const SchemaQueryListener = (query: any, token: string): SimpleObservable<any> => {
  return new SimpleObservable((subscriber) => {
    // This is a mock implementation since we don't have the actual FreeSchema backend
    setTimeout(() => {
      subscriber.next({
        items: [
          { id: 1, title: 'Complete documentation', status: 'pending' },
          { id: 2, title: 'Review code', status: 'completed' },
          { id: 3, title: 'Write tests', status: 'pending' },
        ]
      });
      subscriber.complete();
    }, 500);
  });
};