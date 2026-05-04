import { Image, Text, View } from "react-native";
import { formatCurrency } from "../lib/utils";

export default function UpcomingSubscriptionCard ({ data: { name, price, daysLeft, icon, currency } }: { data: UpcomingSubscription }) {
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                <Image source={icon} className="upcoming-icon"/>
                <View>
                    <Text className="upcoming-price">{formatCurrency(price, currency)}</Text>
                    <Text className="upcoming-meta" numberOfLines={1}>{daysLeft > 1 ? `${daysLeft}` : `Last day`}</Text>
                </View>
            </View>

            <Text className="upcoming-name" numberOfLines={1}>{name}</Text>
        </View>
    )
}