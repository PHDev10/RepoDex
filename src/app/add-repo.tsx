import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { api } from "../services/api";
import { GitHubRepo } from "../types/github";

export default function AddRepoScreen() {
  const router = useRouter();
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!owner || !repo) {
      Alert.alert("Erro", "Preencha os dois campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/repos/${owner.trim()}/${repo.trim()}`);
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

      const savedData = await AsyncStorage.getItem("@github_repos");
      const currentRepos: GitHubRepo[] = savedData ? JSON.parse(savedData) : [];

      const alreadyExists = currentRepos.some((r) => r.id === newRepo.id);
      if (alreadyExists) {
        Alert.alert("Aviso", "Este repositório já está na sua lista.");
        setLoading(false);
        return;
      }

      const updatedRepos = [newRepo, ...currentRepos];
      await AsyncStorage.setItem("@github_repos", JSON.stringify(updatedRepos));

      Alert.alert("Sucesso", "Repositório salvo com sucesso!");
      router.back();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Repositório não encontrado. Verifique o nome do dono e do projeto.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Owner ID (Dono do repositório)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: facebook"
        value={owner}
        onChangeText={setOwner}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Repo ID (Nome do repositório)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: react-native"
        value={repo}
        onChangeText={setRepo}
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0366d6"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.buttonContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 16,
  },
  buttonWrapper: { flex: 1 },
});
