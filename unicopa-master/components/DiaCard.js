import React from "react";
import { View, Text } from "react-native";
import { formatDateBR } from "../utils/date";

export default function DiaCard({ data, jogos, isToday }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: isToday ? "green" : "black",
        }}
      >
        {formatDateBR(data)}
      </Text>

      {jogos.map((jogo, index) => (
        <View key={index} style={{ marginTop: 5 }}>
          <Text>
            {jogo.time1} x {jogo.time2} - {jogo.hora_brasilia}
          </Text>
        </View>
      ))}
    </View>
  );
}