import React, { useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { DataContext } from '../contexts/DataContext'; // adjust path if needed

export default function HomeScreen() {
  const router = useRouter();
  const {
    columns, setColumns,
    columnValues, setColumnValues,
    rows, setRows,
  } = useContext(DataContext);

  const handleColumnChange = (text, index) => {
    const updated = [...columnValues];
    updated[index] = text;
    setColumnValues(updated);
  };

  const handleAddColumn = () => {
    const newIndex = columns.length + 1;
    setColumns([...columns, `Column ${newIndex}`]);
    setColumnValues([...columnValues, '']);
  };

  const goToAddRow = () => {
    router.push('/add-row');
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Confirmation",
      "Are you sure you want to reset everything?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset", style: "destructive", onPress: () => {
            setColumns(['Column 1', 'Column 2', 'Column 3']);
            setColumnValues(['', '', '']);
            setRows([]);
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧪 Research Data Collection</Text>
      <Text style={styles.sectionTitle}>📋 Define Columns:</Text>

      <View style={styles.inputGroup}>
        {columns.map((placeholder, index) => (
          <TextInput
            key={index}
            placeholder={placeholder}
            value={columnValues[index]}
            onChangeText={(text) => handleColumnChange(text, index)}
            style={styles.input}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Add Another Column" onPress={handleAddColumn} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="➕ Add Row" onPress={goToAddRow} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="🧹 Reset " onPress={handleReset} color="#d9534f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 15,
  },
});
