import { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Alert, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";

import { loadProjects, saveProjects, makeId } from "../../src/storage";
import AnimatedPressable from "../../src/ui/AnimatedPressable";

function SwipeDeleteAction({ onDelete, height }) {
    return (
      <AnimatedPressable
        onPress={onDelete}
        style={{
          width: 96,
          height,
          backgroundColor: "#FF3B30",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Delete</Text>
      </AnimatedPressable>
    );
}

function CounterRow({ counter, onMinus, onPlus, onRename, onDelete }) {
    const [rowHeight, setRowHeight] = useState(0);

  return (

    <Swipeable
        renderRightActions={() => (
            <SwipeDeleteAction onDelete={onDelete} height={rowHeight} />
        )}
        overshootRight={false}
    >
        
        <View
            onLayout={(e) => setRowHeight(e.nativeEvent.layout.height)}
            style={{
                padding: 14,
                borderRadius: 16,
                backgroundColor: "#F2F2F7",
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >

        <View style={{ flex: 1 }}>
          <TextInput
            value={counter.name}
            onChangeText={onRename}
            placeholder="Counter name"
            style={{
              fontSize: 16,
              fontWeight: "600",
              paddingVertical: 2,
            }}
          />
          <Text style={{ fontSize: 28, marginTop: 6 }}>{counter.value}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <AnimatedPressable
            onPress={onMinus}
            hitSlop={10}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: "#ccc",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24, lineHeight: 26, textAlign: "center" }}>
              −
            </Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={onPlus}
            hitSlop={10}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                lineHeight: 24,
                color: "white",
                textAlign: "center",
              }}
            >
              +
            </Text>
          </AnimatedPressable>
        </View>
      </View>
    </Swipeable>
  );
}

export default function ProjectScreen() {
  const { id } = useLocalSearchParams();
  const [projects, setProjects] = useState([]);

  const project = useMemo(
    () => projects.find((p) => p.id === id),
    [projects, id]
  );

  useEffect(() => {
    (async () => setProjects(await loadProjects()))();
  }, []);

  async function updateProject(updater) {
    const next = projects.map((p) => (p.id === id ? updater(p) : p));
    setProjects(next);
    await saveProjects(next);
  }

  async function addCounter() {
    await updateProject((p) => ({
      ...p,
      counters: [
        ...p.counters,
        { id: makeId(), name: `Counter ${p.counters.length + 1}`, value: 0 },
      ],
    }));
  }

  async function deleteCounter(counterId) {
    await updateProject((p) => ({
      ...p,
      counters: p.counters.filter((c) => c.id !== counterId),
    }));
  }

  async function changeCounter(counterId, delta) {
    await updateProject((p) => ({
      ...p,
      counters: p.counters.map((c) =>
        c.id === counterId ? { ...c, value: Math.max(0, c.value + delta) } : c
      ),
    }));
  }

  async function renameCounter(counterId, text) {
    await updateProject((p) => ({
      ...p,
      counters: p.counters.map((c) =>
        c.id === counterId ? { ...c, name: text } : c
      ),
    }));
  }

  if (!project) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "#666" }}>Loading project…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        value={project.name}
        onChangeText={(text) => updateProject((p) => ({ ...p, name: text }))}
        placeholder="Project name"
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 12,
          paddingVertical: 4,
        }}
      />

      <AnimatedPressable
        onPress={addCounter}
        style={{
          padding: 12,
          borderRadius: 12,
          backgroundColor: "#111",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Add counter</Text>
      </AnimatedPressable>

      <FlatList
        data={project.counters}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CounterRow
            counter={item}
            onMinus={() => changeCounter(item.id, -1)}
            onPlus={() => changeCounter(item.id, +1)}
            onRename={(text) => renameCounter(item.id, text)}
            onDelete={() =>
              Alert.alert("Delete counter?", `Delete "${item.name}"?`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteCounter(item.id),
                },
              ])
            }
          />
        )}
      />
    </View>
  );
}