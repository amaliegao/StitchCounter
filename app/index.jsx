import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";

import FloatingAddButton from "../src/ui/FloatingAddButton";
import { loadProjects, saveProjects, makeId } from "../src/storage";

function SwipeDeleteAction({ onDelete }) {
  return (
    <Pressable
      onPress={onDelete}
      style={{
        width: 96,
        backgroundColor: "#FF3B30",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        marginBottom: 10,
      }}
    >
      <Text style={{ color: "white", fontWeight: "700" }}>Delete</Text>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => setProjects(await loadProjects()))();
  }, []);

  async function createProject() {
    const id = makeId();
    const newProject = {
      id,
      name: `Project ${projects.length + 1}`,
      counters: [{ id: makeId(), name: "Main counter", value: 0 }],
      createdAt: Date.now(),
    };

    const next = [newProject, ...projects];
    setProjects(next);
    await saveProjects(next);

    router.push(`/project/${id}`);
  }

  function openProject(id) {
    router.push(`/project/${id}`);
  }

  async function deleteProject(projectId) {
    const next = projects.filter((p) => p.id !== projectId);
    setProjects(next);
    await saveProjects(next);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        ListEmptyComponent={
          <Text style={{ marginTop: 24, color: "#666" }}>
            No projects yet. Tap + to create one.
          </Text>
        }
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <SwipeDeleteAction
                onDelete={() =>
                  Alert.alert("Delete project?", `Delete "${item.name}"?`, [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteProject(item.id),
                    },
                  ])
                }
              />
            )}
            overshootRight={false}
          >
            <Pressable
              onPress={() => openProject(item.id)}
              style={{
                padding: 14,
                borderRadius: 16,
                backgroundColor: "#F2F2F7",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {item.name}
              </Text>
              <Text style={{ color: "#666", marginTop: 4 }}>
                Counters: {item.counters.length}
              </Text>
            </Pressable>
          </Swipeable>
        )}
      />

      <FloatingAddButton onPress={createProject} />
    </View>
  );
}