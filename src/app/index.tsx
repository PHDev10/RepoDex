import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GitHubRepo } from "@/types/github";

const STORAGE_KEY = "@github_repos";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedRepos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : [];

      if (!Array.isArray(parsed)) {
        throw new Error("Formato inválido dos dados salvos.");
      }

      setRepos(parsed as GitHubRepo[]);
    } catch (error) {
      console.error("Erro ao carregar repositórios:", error);
      Alert.alert("Erro", "Não foi possível carregar os repositórios salvos.");
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
    <View
      style={[
        styles.container,
        isDark && styles.containerDark,
        { paddingTop: Math.max(insets.top, 16) },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Repositórios
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => {
              if (repos.length === 0) {
                Alert.alert(
                  "Aviso",
                  "Ainda não há repositórios salvos para apagar.",
                );
              } else {
                router.push("/remove-repo");
              }
            }}
            style={[
              styles.iconButton,
              isDark ? styles.deleteButtonDark : styles.deleteButtonLight,
            ]}
          >
            <Text style={[styles.iconText, isDark && styles.iconTextDark]}>
              −
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/add-repo")}
            style={[
              styles.iconButton,
              isDark ? styles.addButtonDark : styles.addButtonLight,
            ]}
          >
            <Text style={[styles.iconText, isDark && styles.iconTextDark]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={isDark ? "#58a6ff" : "#0366d6"}
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
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
              Nenhum repositório salvo.
              {"\n"}Toque em + para adicionar um.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, isDark && styles.cardDark]}>
              <TouchableOpacity onPress={() => Linking.openURL(item.repoUrl)}>
                <Text style={[styles.title, isDark && styles.titleDark]}>
                  {item.repoName}
                </Text>
              </TouchableOpacity>

              <View style={styles.repoInfo}>
                <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
                  ⭐ Estrelas: {item.stars}
                </Text>
                <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
                  Linguagem: {item.language || "Não informada"}
                </Text>
              </View>

              <View style={[styles.divider, isDark && styles.dividerDark]} />

              <View style={styles.ownerContainer}>
                <Image
                  source={{ uri: item.ownerAvatar }}
                  style={[styles.avatar, isDark && styles.avatarDark]}
                />
                <View style={styles.ownerInfo}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(item.ownerUrl)}
                  >
                    <Text
                      style={[
                        styles.ownerTitle,
                        isDark && styles.ownerTitleDark,
                      ]}
                    >
                      Dono: {item.ownerName}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[styles.infoText, isDark && styles.infoTextDark]}
                  >
                    📦 Projetos: {item.ownerReposCount}
                  </Text>

                  <Text
                    style={[styles.bioText, isDark && styles.bioTextDark]}
                    numberOfLines={3}
                  >
                    {item.ownerBio ||
                      "Este usuário não possui resumo de perfil."}
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
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#f5f5f5" },
  containerDark: { backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#0366d6" },
  headerTitleDark: { color: "#58a6ff" },
  headerButtons: { flexDirection: "row", gap: 10 },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 2,
  },
  deleteButtonLight: { backgroundColor: "#ffebee" },
  deleteButtonDark: { backgroundColor: "#4a1922" },
  addButtonLight: { backgroundColor: "#e8f5e9" },
  addButtonDark: { backgroundColor: "#1e3b28" },
  iconText: { fontSize: 24, fontWeight: "bold", color: "#333", lineHeight: 28 },
  iconTextDark: { color: "#e0e0e0" },
  loader: { marginTop: 40 },
  list: { paddingBottom: 20 },
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
  emptyTextDark: { color: "#aaa" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  cardDark: { backgroundColor: "#1e1e1e", borderColor: "#333" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0366d6",
    textDecorationLine: "underline",
  },
  titleDark: { color: "#58a6ff" },
  repoInfo: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12 },
  infoText: { fontSize: 14, color: "#444" },
  infoTextDark: { color: "#bbb" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },
  dividerDark: { backgroundColor: "#333" },
  ownerContainer: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eee",
    marginTop: 4,
  },
  avatarDark: { backgroundColor: "#333" },
  ownerInfo: { flex: 1, gap: 4, justifyContent: "center" },
  ownerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0366d6",
    textDecorationLine: "underline",
  },
  ownerTitleDark: { color: "#58a6ff" },
  bioText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginTop: 2,
    lineHeight: 18,
  },
  bioTextDark: { color: "#999" },
});
