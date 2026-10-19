
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    StyleSheet,
    Text,
    View,
} from "react-native";

const STORAGE_KEY = "@github_repos";

export default function ClearReposScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClear = async () => {
        setLoading(true);

        try {
            await AsyncStorage.removeItem(STORAGE_KEY);

            if (typeof window !== "undefined" && window.alert) {
                // A confirmação já ocorreu nesta tela.
                // Apenas informa que a operação foi concluída.
            }

            router.back();
        } catch (error) {
            console.error("Erro ao limpar repositórios:", error);

            Alert.alert(
                "Erro",
                "Não foi possível apagar os repositórios salvos."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Limpar repositórios" }} />

            <View style={styles.card}>
                <Text style={styles.icon}>⚠️</Text>

                <Text style={styles.title}>Limpar dados salvos</Text>

                <Text style={styles.description}>
                    Tem certeza de que deseja apagar todos os repositórios salvos?
                </Text>

                <Text style={styles.warning}>
                    Essa ação removerá a lista armazenada neste dispositivo e não
                    poderá ser desfeita.
                </Text>

                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color="#d73a49"
                        style={styles.loader}
                    />
                ) : (
                    <View style={styles.buttons}>
                        <View style={styles.buttonWrapper}>
                            <Button
                                title="Cancelar"
                                color="#6c757d"
                                onPress={() => router.back()}
                            />
                        </View>

                        <View style={styles.buttonWrapper}>
                            <Button
                                title="Apagar dados"
                                color="#d73a49"
                                onPress={handleClear}
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    card: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        elevation: 3,
    },
    icon: {
        fontSize: 42,
        textAlign: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 23,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 14,
        color: "#222",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color: "#444",
        lineHeight: 24,
    },
    warning: {
        fontSize: 14,
        textAlign: "center",
        color: "#b02a37",
        marginTop: 16,
        lineHeight: 21,
    },
    buttons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 28,
    },
    buttonWrapper: {
        flex: 1,
    },
    loader: {
        marginTop: 28,
    },
});
