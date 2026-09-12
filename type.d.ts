import type { ImageSourcePropType } from "react-native";

declare global {
  interface AppTab {
    name: string;
    title: string;
    icon: ImageSourcePropType;
  }

  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface Subscription {
    id: string;
    imageUrl: string;
    name: string;
    price: number;
    plan?: string;
    billing: string;
    category?: string;
    paymentMethod?: string;
    status?: string;
    startDate?: string;
    currency?: string;
    renewalDate?: string;
    color?: string;
  }

  interface SubscriptionCardProps extends Omit<Subscription, "id"> {
    expanded: boolean;
    onPress: () => void;
    onCancelPress?: () => void;
    isCancelling?: boolean;
    onEdit?: () => void;
  }

  interface UpcomingSubscription {
    id: string;
    imageUrl: string;
    name: string;
    price: number;
    currency?: string;
    daysLeft: number;
  }

  interface UpcomingSubscriptionCardProps extends Omit<
    UpcomingSubscription,
    "id"
  > {}

  interface ListHeadingProps {
    title: string;
    url: RelativePathString;
  }
}

export { };

