
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
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
} from "react-native";

import { api } from "../services/api";
import { GitHubRepo } from "../types/github";

const STORAGE_KEY = "@github_repos";

export default function AddRepoScreen() {
  const router = useRouter();

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
      const response = await api.get(
        `/repos/${encodeURIComponent(ownerId)}/${encodeURIComponent(repoId)}`
      );

      const data = response.data;

      const newRepo: GitHubRepo = {
        id: data.id,
        repoName: data.name,
        stars: data.stargazers_count,
        language: data.language,
        ownerName: data.owner.login,
        ownerAvatar: data.owner.avatar_url,
        ownerUrl: data.owner.html_url,
      };

      const savedData = await AsyncStorage.getItem(STORAGE_KEY);

      const currentRepos: GitHubRepo[] = savedData
        ? JSON.parse(savedData)
        : [];

      const alreadyExists = currentRepos.some(
        (item) => item.id === newRepo.id
      );

      if (alreadyExists) {
        showMessage(
          "Repositório duplicado",
          "Este repositório já está na sua lista."
        );
        return;
      }

      const updatedRepos = [newRepo, ...currentRepos];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRepos)
      );

      showMessage("Sucesso", "Repositório salvo com sucesso!");

      router.back();
    } catch (error: any) {
      console.error("Erro ao buscar repositório:", error);

      if (error.response?.status === 404) {
        showMessage(
          "Não encontrado",
          "Verifique o ownerid e o repoid. O repositório pode ser privado ou inexistente."
        );
      } else if (error.response?.status === 403) {
        showMessage(
          "Limite de consultas",
          "O GitHub pode ter limitado temporariamente as requisições. Tente novamente mais tarde."
        );
      } else if (error.response) {
        showMessage(
          "Erro na consulta",
          `O GitHub retornou o erro HTTP ${error.response.status}.`
        );
      } else {
        showMessage(
          "Erro de conexão",
          "Não foi possível acessar o GitHub. Verifique sua conexão com a internet."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: "Adicionar repositório" }} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Novo repositório</Text>

        <Text style={styles.description}>
          Informe o proprietário e o nome do repositório do GitHub.
        </Text>

        <Text style={styles.label}>Owner ID (dono)</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: facebook"
          value={owner}
          onChangeText={setOwner}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          accessibilityLabel="Owner ID"
        />

        <Text style={styles.label}>Repo ID (repositório)</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: react"
          value={repo}
          onChangeText={setRepo}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          accessibilityLabel="Repo ID"
        />

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0366d6" />
            <Text style={styles.loadingText}>
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
              <Button
                title="Adicionar"
                color="#28a745"
                onPress={handleAdd}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0366d6",
  },
  description: {
    fontSize: 15,
    color: "#666",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#222",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 30,
  },
  buttonWrapper: {
    flex: 1,
  },
  loading: {
    alignItems: "center",
    marginTop: 30,
    gap: 10,
  },
  loadingText: {
    color: "#555",
  },
});
