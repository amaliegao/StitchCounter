import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "stitchCounter.projects.v1";

export async function loadProjects() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveProjects(projects) {
  await AsyncStorage.setItem(KEY, JSON.stringify(projects));
}

export function makeId() {
  return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}