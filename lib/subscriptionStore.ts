import { create } from "zustand";

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  addSubscriptions: (subscriptions: Subscription[]) => void;
  setSubscriptions: (subscriptions: Subscription[]) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscriptions: [],
  addSubscription: (subscription) => {
    set((state) => ({ subscriptions: [subscription, ...state.subscriptions] }));
  },
  addSubscriptions: (newSubscriptions) =>
    set((state) => ({
      subscriptions: [...state.subscriptions, ...newSubscriptions],
    })),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
}));
