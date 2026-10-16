import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GitHubRepo } from "../types/github";

export default function HomeScreen() {
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  const fetchSavedRepos = async () => {
    try {
      const data = await AsyncStorage.getItem("@github_repos");
      if (data) setRepos(JSON.parse(data));
    } catch (error) {
      console.error("Erro ao carregar repositórios", error);
    }
  };

  const clearRepos = async () => {
    Alert.alert(
      "Limpar Dados",
      "Tem certeza que deseja apagar todos os repositórios salvos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("@github_repos");
            setRepos([]);
          },
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedRepos();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Meus Repositórios",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={clearRepos} style={styles.iconButton}>
                <Text style={styles.iconText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/add-repo")}
                style={styles.iconButton}
              >
                <Text style={styles.iconText}>+</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <FlatList
        data={repos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum repositório salvo.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.repoName}</Text>
            <Text>
              Linguagem: {item.language || "N/A"} | Estrelas: {item.stars}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.ownerTitle}>Dono: {item.ownerName}</Text>
            <Text>Perfil: {item.ownerUrl}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  headerButtons: { flexDirection: "row", gap: 16, marginRight: 10 },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  iconText: { fontSize: 20, fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#0366d6" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  ownerTitle: { fontWeight: "bold", marginTop: 4 },
});
