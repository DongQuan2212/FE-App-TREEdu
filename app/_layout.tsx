import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack>
        {/* Cấu hình riêng cho màn hình index */}
        <Stack.Screen
            name="index"
            options={{ headerShown: false }}
        />
      </Stack>
  );
}
