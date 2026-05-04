import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SubscriptionDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <View>
            <Text>Subscription detail {id}</Text>
            <Link href="/subscriptions" >Go back</Link>
        </View>
    )
}