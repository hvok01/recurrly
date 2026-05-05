import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import images from "../../constants/images";

export default function Onboarding() {
    return (
        <View className="flex-1 items-center justify-center bg-accent">
            <Image source={images.splashPattern} className=""/>
            <Text className="p-4 mt-8 text-white text-5xl font-sans-bold">Gain Financial Clarity</Text>
            <Text className="mb-4 text-white text-xl font-sans-light">Track, analize and cancel with ease</Text>
            <Link href="/(auth)/sign-up" asChild>
                <Pressable className="bg-white w-120 p-4 rounded-full">
                    <Text className="font-sans-bold text-center">
                        Get Started
                    </Text>
                </Pressable>
            </Link>
        </View>
    )
}