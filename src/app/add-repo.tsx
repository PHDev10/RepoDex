import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/services/api";
import { GitHubRepo } from "@/types/github";

const STORAGE_KEY = "@github_repos";

export default function AddRepoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleAdd = async () => {
    const ownerId = owner.trim();
    const repoId = repo.trim();

    if (!ownerId || !repoId) {
      showMessage("Campos obrigatórios", "Preencha o ownerid e o repoid.");
      return;
    }

    setLoading(true);

    try {
      const repoResponse = await api.get(
        `/repos/${encodeURIComponent(ownerId)}/${encodeURIComponent(repoId)}`,
      );
      const repoData = repoResponse.data;

      const userResponse = await api.get(
        `/users/${encodeURIComponent(ownerId)}`,
      );
      const userData = userResponse.data;

      const newRepo: GitHubRepo = {
        id: repoData.id,
        repoName: repoData.name,
        repoUrl: repoData.html_url,
        stars: repoData.stargazers_count,
        language: repoData.language,
        ownerName: repoData.owner.login,
        ownerAvatar: repoData.owner.avatar_url,
        ownerUrl: repoData.owner.html_url,
        ownerBio: userData.bio,
        ownerReposCount: userData.public_repos,
      };

      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      const currentRepos: GitHubRepo[] = savedData ? JSON.parse(savedData) : [];

      const alreadyExists = currentRepos.some((item) => item.id === newRepo.id);
      if (alreadyExists) {
        showMessage(
          "Repositório duplicado",
          "Este repositório já está na sua lista.",
        );
        return;
      }

      const updatedRepos = [newRepo, ...currentRepos];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRepos));

      showMessage("Sucesso", "Repositório salvo com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao buscar repositório ou usuário:", error);

      if (error.response?.status === 404) {
        showMessage(
          "Não encontrado",
          "Verifique o ownerid e o repoid. O repositório ou usuário pode não existir.",
        );
      } else if (error.response?.status === 403) {
        showMessage(
          "Limite de consultas",
          "O GitHub limitou as requisições. Tente novamente mais tarde.",
        );
      } else {
        showMessage(
          "Erro de conexão",
          "Não foi possível acessar a API do GitHub. Verifique sua conexão.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top, 20) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading, isDark && styles.headingDark]}>
          Novo repositório
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          Informe o proprietário e o nome do repositório do GitHub.
        </Text>

        <Text style={[styles.label, isDark && styles.labelDark]}>
          Owner ID (dono)
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Ex.: facebook"
          placeholderTextColor={isDark ? "#888" : "#999"}
          value={owner}
          onChangeText={setOwner}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={[styles.label, isDark && styles.labelDark]}>
          Repo ID (repositório)
        </Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Ex.: react"
          placeholderTextColor={isDark ? "#888" : "#999"}
          value={repo}
          onChangeText={setRepo}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color={isDark ? "#58a6ff" : "#0366d6"}
            />
            <Text
              style={[styles.loadingText, isDark && styles.loadingTextDark]}
            >
              Consultando o GitHub...
            </Text>
          </View>
        ) : (
          <View style={styles.buttons}>
            <View style={styles.buttonWrapper}>
              <Button
                title="Cancelar"
                color="#d73a49"
                onPress={() => router.back()}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Adicionar" color="#28a745" onPress={handleAdd} />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  containerDark: { backgroundColor: "#121212" },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
    paddingBottom: 60,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0366d6",
  },
  headingDark: { color: "#58a6ff" },
  description: { fontSize: 15, color: "#666", marginBottom: 16 },
  descriptionDark: { color: "#aaa" },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
    color: "#000",
  },
  labelDark: { color: "#eee" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fafafa",
  },
  inputDark: {
    backgroundColor: "#1e1e1e",
    borderColor: "#444",
    color: "#fff",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 30,
  },
  buttonWrapper: { flex: 1 },
  loading: { alignItems: "center", marginTop: 30, gap: 10 },
  loadingText: { color: "#555" },
  loadingTextDark: { color: "#aaa" },
});
