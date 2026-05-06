import { Link } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import ListHeading from "../../../components/ListHeading";
import SubscriptionCard from "../../../components/SubscriptionCard";
import { icons } from "../../../constants/icons";
import { useSubscriptionStore } from "../../../lib/subscriptionStore";

const SafeAreaView = styled(RNSafeAreaView);

const dataMocked = [
    {value: 35, label: "Mon", frontColor: "#081126"},
    {value: 27, label: "Tue", frontColor: "#081126"},
    {value: 18, label: "Wed", frontColor: "#081126"},
    {value: 40, label: "Thr", frontColor: "#ea7a53"},
    {value: 35, label: "Fri", frontColor: "#081126"},
    {value: 20, label: "Sat", frontColor: "#081126"},
    {value: 24, label: "Sun", frontColor: "#081126"},
]

export default function Insides() {
    const { subscriptions } = useSubscriptionStore();
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
            ListHeaderComponent={() => (
                <>
                    <View>
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

                    <View>
                        <ListHeading title="Upcoming" url='/(tabs)/subscriptions'/>
                    </View>
                    <View className="bg-muted rounded-2xl p-4">
                        <BarChart 
                            data={dataMocked}
                            height={220}
                            maxValue={45}
                            stepValue={5}
                            rulesType="dashed"
                            yAxisThickness={0}
                            xAxisThickness={0}
                            barBorderRadius={8}
                            barWidth={12}
                            spacing={40}
                            xAxisLabelTextStyle={{
                                color: "#303030",
                            }}
                        />
                    </View>

                    <View className="mt-6 mb-2">
                        <View className="sub-card bg-card">
                            <View className="sub-head">
                                <View className="sub-main">
                                    <View className="sub-copy">
                                        <Text numberOfLines={1} className="sub-title">
                                            Expenses
                                        </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
                                            -$424.63
                                        </Text>
                                    </View>
                                </View>
                                <View className="sub-price-box">
                                    <Text className="sub-price">March 2026</Text>
                                    <Text className="sub-billing">+12%</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="mb-4">
                        <ListHeading title="History" url='/(tabs)/subscriptions'/>
                    </View>
                </>
            )}
            data={subscriptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <SubscriptionCard
                    {...item}
                    expanded={false}
                    onPress={() => alert("Alert")}
                />
            )}
            extraData={null}
            ItemSeparatorComponent={() => <View className="h-4"/>}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text className="home-empty-state">No subscription yet.</Text>}
            contentContainerClassName="pb-30"
            />
        </SafeAreaView>
    )
}