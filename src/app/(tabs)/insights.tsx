import { Link } from "expo-router";
import { styled } from "nativewind";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../../constants/icons";

const SafeAreaView = styled(RNSafeAreaView)

export default function Insides() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-5 pt-5">
                <View className="flex-row items-center justify-between mb-5">
                    <Link href={"/"} asChild>
                        <Pressable className='rounded-full p-2 border'>
                            <Image source={icons.back} className="back-icon" />
                        </Pressable>
                    </Link>
                    <Text className="text-3xl font-bold text-dark">Monthly Insights</Text>
                    <Pressable className='rounded-full p-2 border'>
                        <Image source={icons.menu} className="menu-icon" />
                    </Pressable>
                </View>
            </View>

            <Text>
                Insights...
            </Text>
        </SafeAreaView>
    )
}