import { Stack } from 'expo-router';
import { DataProvider } from '../contexts/DataContext'; // adjust if your folder differs

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack />
    </DataProvider>
  );
}
