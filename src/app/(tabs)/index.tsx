import { useAuth, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import CreateSubscriptionModal from "../../../components/CreateSubscriptionModal";
import ListHeading from "../../../components/ListHeading";
import SubscriptionCard from "../../../components/SubscriptionCard";
import UpcomingSubscriptionCard from "../../../components/UpcomingSubscriptionCard";
import { getUpcomingSubscriptions } from "../../../constants/data";
import { icons } from "../../../constants/icons";
import images from "../../../constants/images";
import "../../../global.css";
import { useSubscriptionStore } from "../../../lib/subscriptionStore";
import { formatCurrency } from "../../../lib/utils";

const SafeAreaView = styled(RNSafeAreaView);
const apiUrl = process.env.EXPO_PUBLIC_API_URL!;
const pageSize = 5;

export default function App() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState<{
    amount: number;
    nextRenewalDate: null | Date;
  }>({ amount: 0, nextRenewalDate: null });
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const { subscriptions, addSubscription, setSubscriptions, addSubscriptions } =
    useSubscriptionStore();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get upcoming subscriptions (active subscriptions with renewal date within next 7 days)
  const upcomingSubscriptions = useMemo(() => {
    const now = dayjs();
    const nextWeek = now.add(7, "days");
    return subscriptions
      .filter(
        (sub) =>
          sub.status === "active" &&
          dayjs(sub.renewalDate).isAfter(now) &&
          dayjs(sub.renewalDate).isBefore(nextWeek),
      )
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
  }, [subscriptions]);

  const handleSubscriptionPress = (item: Subscription) => {
    const isExpanding = expandedSubscriptionId !== item.id;
    setExpandedSubscriptionId((currentId) =>
      currentId === item.id ? null : item.id,
    );
  };

  const handleSubscriptionOnPressEdit = (item: Subscription) => {};

  const handleCreateSubscription = (newSubscription: Subscription) => {
    const addNewSubscription = async () => {
      try {
        const token = await getToken();

        const response = await fetch(`${apiUrl}/subscriptions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubscription),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            `POST /subscriptions failed (${response.status}): ${JSON.stringify(responseData)}`,
          );
        }

        if (responseData && responseData.success) {
          if (responseData.data.subscription) {
            addSubscription(responseData.data.subscription);
          }
        }
      } catch (error) {
        console.error("ERROR adding subscription:", error);
      }
    };

    addNewSubscription();
  };

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        if (loading) return;

        setLoading(true);
        const token = await getToken();

        const response = await fetch(
          `${apiUrl}/subscriptions?pageSize=${pageSize}&pageCount=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const fetchedSubscriptions = await response.json();

        if (fetchedSubscriptions.data && fetchedSubscriptions.success) {
          if (
            fetchedSubscriptions.data.subscriptions &&
            fetchedSubscriptions.data.subscriptions.length > 0
          ) {
            setSubscriptions(fetchedSubscriptions.data.subscriptions);
          }
        }
      } catch (error) {
        console.log("ERROR getting subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    const getBalance = async () => {
      try {
        const token = await getToken();

        const responseBalance = await fetch(`${apiUrl}/subscriptions/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedBalance = await responseBalance.json();

        if (fetchedBalance && fetchedBalance.success) {
          if (fetchedBalance.data) {
            setBalanceInfo(fetchedBalance.data);
          }
        }
      } catch (error) {
        console.log("ERROR getting balance:", error);
      }
    };

    getSubscriptions();
    getBalance(); //432.88
  }, []);

  const fetchMoreSubscriptions = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const nextPage = page + 1;
      const token = await getToken();

      const response = await fetch(
        `${apiUrl}/subscriptions?pageSize=${pageSize}&pageCount=${nextPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const fetchedSubscriptions = await response.json();

      if (fetchedSubscriptions.data && fetchedSubscriptions.success) {
        if (
          fetchedSubscriptions.data.subscriptions &&
          fetchedSubscriptions.data.subscriptions.length > 0
        ) {
          addSubscriptions(fetchedSubscriptions.data.subscriptions);

          setPage(nextPage);
        }
      }
    } catch (error) {
      console.log(
        "Error al obtener mas subscripciones: ",
        JSON.stringify(error),
      );
    } finally {
      setLoading(false);
    }
  };

  // Get user display name: firstName, fullName, or email
  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>

              <Pressable
                onPress={() => setIsModalVisible(true)}
                className="rounded-full p-2 border"
              >
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(balanceInfo.amount)}
                </Text>
                <Text className="home-balance-date">
                  {balanceInfo.nextRenewalDate
                    ? dayjs(balanceInfo.nextRenewalDate).format("MM/DD")
                    : "--"}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" url="/(tabs)/insights" />
              <FlatList
                data={getUpcomingSubscriptions(subscriptions)}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard data={item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading
              title="All Subscriptions"
              url="/(tabs)/subscriptions"
            />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          // modify this in a future.
          <Text className="home-empty-state">No subscription yet.</Text>
        }
        contentContainerClassName="pb-30"
        onEndReached={fetchMoreSubscriptions}
      />
      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}
