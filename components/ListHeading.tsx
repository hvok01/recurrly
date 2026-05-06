import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ListHeading ({ title, url }: ListHeadingProps) {
    return (
        <View className="list-head">
            <Text className="list-title">{title}</Text>

            <Link href={url} asChild>
                <Pressable className="list-action">
                    <Text className="list-action-text">View all</Text>
                </Pressable>
            </Link>
        </View>
    )
}