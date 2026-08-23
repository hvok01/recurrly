import dayjs from "dayjs";
import { icons } from "./icons";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
  { name: "insights", title: "Insights", icon: icons.activity },
  { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
  name: "Leonel Gomez",
};

export const homeBalanceCalculation = (subscriptions: Subscription[]) => {
  const now = new Date();
  const nextRenewalDateCalculation =
    subscriptions && subscriptions.length > 0
      ? [...subscriptions]
          .sort(
            (a: Subscription, b: Subscription) =>
              new Date(a.renewalDate ?? 0).getTime() -
              new Date(b.renewalDate ?? 0).getTime(),
          )
          .find((sub) => sub.renewalDate && new Date(sub.renewalDate) > now)
      : null;

  return {
    amount: subscriptions.reduce((prev, curr) => prev + curr.price, 0),
    nextRenewalDate: nextRenewalDateCalculation
      ? nextRenewalDateCalculation.renewalDate
      : null,
  };
};

export const getUpcomingSubscriptions = (subscriptions: Subscription[]) => {
  if (subscriptions && subscriptions.length > 0) {
    const dataToReturn = [...subscriptions].map((sub) => {
      return {
        id: sub.id,
        imageUrl: sub.imageUrl,
        name: sub.name,
        price: sub.price,
        currency: sub.currency,
        daysLeft: dayjs(sub.renewalDate).diff(dayjs(), "day"),
      };
    });

    return dataToReturn;
  } else {
    return [];
  }
};
