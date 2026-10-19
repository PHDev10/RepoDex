
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GitHubRepo } from "../types/github";

const STORAGE_KEY = "@github_repos";

export default function HomeScreen() {
  const router = useRouter();

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedRepos = useCallback(async () => {
    try {
      setLoading(true);

      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: unknown = data ? JSON.parse(data) : [];

      if (!Array.isArray(parsed)) {
        throw new Error("Formato inválido dos dados salvos.");
      }

      setRepos(parsed as GitHubRepo[]);
    } catch (error) {
      console.error("Erro ao carregar repositórios:", error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os repositórios salvos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSavedRepos();
    }, [fetchSavedRepos]),
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Meus Repositórios",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push('/remove-repo')}
                style={[styles.iconButton, styles.deleteButton]}
                accessibilityLabel="Limpar repositórios"
              >
                <Text style={styles.iconText}>−</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/add-repo")}
                style={[styles.iconButton, styles.addButton]}
                accessibilityLabel="Adicionar repositório"
              >
                <Text style={styles.iconText}>+</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0366d6"
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={repos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            repos.length === 0 ? styles.emptyContainer : styles.list
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum repositório salvo.
              {"\n"}Toque em + para adicionar um.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.repoName}</Text>

              <View style={styles.repoInfo}>
                <Text style={styles.infoText}>
                  ⭐ Estrelas: {item.stars}
                </Text>

                <Text style={styles.infoText}>
                  Linguagem: {item.language || "Não informada"}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.ownerContainer}>
                <Image
                  source={{ uri: item.ownerAvatar }}
                  style={styles.avatar}
                />

                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerTitle}>
                    Dono: {item.ownerName}
                  </Text>

                  <Text style={styles.profileUrl}>
                    Perfil: {item.ownerUrl}
                  </Text>

                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
    marginRight: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#f8d7da",
  },
  addButton: {
    backgroundColor: "#d1e7dd",
  },
  iconText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#222",
    lineHeight: 30,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 26,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0366d6",
  },
  description: {
    marginTop: 8,
    color: "#555",
    fontSize: 14,
  },
  repoInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eee",
  },
  ownerInfo: {
    flex: 1,
    gap: 6,
  },
  ownerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  profileUrl: {
    color: "#555",
    fontSize: 12,
  },
  repoLink: {
    color: "#0366d6",
    fontSize: 12,
  },
});
