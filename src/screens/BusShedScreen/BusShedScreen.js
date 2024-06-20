import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/CustomInput/Index";
import CustomButton from "../../components/CustomButton/Index";
import { useNavigation } from "@react-navigation/native";
import PickerStops from "@/src/components/PickerStops/Index";
import DatePic from "../../components/DatePic/Index";
import axios from "axios";

const BusShedScreen = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const [from, setFrom] = useState(null);
  const [fromOrderIndex, setFromOrderIndex] = useState(null);
  const [to, setTo] = useState(null);
  const [toOrderIndex, setToOrderIndex] = useState(null);
  const [date, setDate] = useState(null);
  const [direction, setDirection] = useState(null);
  const [busSchedules, setBusSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSearchPressed = async () => {
    if (!from || !to || !date) {
      setError("Please fill all the fields");
      return;
    }
    console.log(
      "from",
      from,
      "order index",
      fromOrderIndex,
      "to",
      to,
      "order index",
      toOrderIndex
    );
    const direction = calculateDirection(fromOrderIndex, toOrderIndex);
    setDirection(direction);
    console.log("from", from, "to", to, "direction", direction, "date", date);
    // Add a small delay to ensure states are updated
    setTimeout(async () => {
      try {
        console.log("HAPPENINGGG");
        const response = await axios.get(
          "http://192.168.8.102:8080/bus/search",
          {
            params: {
              from,
              to,
              direction,
              date,
            },
          }
        );
        setBusSchedules(response.data);
        console.log("response data is ", response.data);
        navigation.navigate("BusTimeTable", {
          busSchedules: response.data,
          direction,
          from,
          to,
          date,
        });
      } catch (error) {
        setError("Error fetching bus schedules. Please try again later.");
        console.error("Error fetching bus schedules:", error.message);
      } finally {
        setLoading(false);
      }
    }, 100); // 100ms delay
  };

  const calculateDirection = (fromOrderIndex, toOrderIndex) => {
    return fromOrderIndex < toOrderIndex ? "up" : "down";
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.al}>
        <Image
          source={logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.sec}>
        <Text style={styles.text}>Search Your Destination</Text>
        <PickerStops
          placeholder="From"
          onSelect={(value, orderIndex) => {
            setFrom(value);
            setFromOrderIndex(orderIndex);
          }}
        />
        <PickerStops
          placeholder="To"
          onSelect={(value, orderIndex) => {
            setTo(value);
            setToOrderIndex(orderIndex);
          }}
        />
        <DatePic onDateChange={(selectedDate) => setDate(selectedDate)} />
        <CustomButton text="Search" onPress={onSearchPressed} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  al: { alignItems: "center" },
  logo: {
    width: "70%",
    maxWidth: 500,
    maxHeight: 300,
  },
  sec: {
    backgroundColor: "#bbdfea",
    shadowColor: "#abb6ba",
    borderRadius: 3,
    elevation: 3,
    shadowOpacity: 1,
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
});

export default BusShedScreen;
