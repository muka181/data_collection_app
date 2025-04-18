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

  const handleRemoveColumn = (index) => {
    const updatedColumns = [...columns];
    const updatedValues = [...columnValues];
    updatedColumns.splice(index, 1);
    updatedValues.splice(index, 1);
    setColumns(updatedColumns);
    setColumnValues(updatedValues);
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

  // Check if all column values are filled
  const areColumnsFilled = columnValues.every(value => value.trim() !== '');
  const hasColumns = columns.length > 0;  // Ensure at least one column is added

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧪 Research Data Collection</Text>
      <Text style={styles.sectionTitle}>📋 Define Columns:</Text>

      <View style={styles.inputGroup}>
        {columns.map((placeholder, index) => (
          <View key={index} style={styles.columnRow}>
            <TextInput
              placeholder={placeholder}
              placeholderTextColor="#000"
              value={columnValues[index]}
              onChangeText={(text) => handleColumnChange(text, index)}
              style={styles.input}
            />
            <View style={styles.buttonWrapper}>
              <Button
                title="x"
                color="#d9534f"
                onPress={() => handleRemoveColumn(index)}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Add Column" onPress={handleAddColumn} />
      </View>

      {/* Show "Enter Data" button only if columns exist and all columns are filled */}
      {hasColumns && rows.length === 0 && areColumnsFilled && (
        <View style={styles.buttonContainer}>
          <Button title="Enter Data" onPress={goToAddRow} />
        </View>
      )}

      {rows.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button title="Add More Data" onPress={goToAddRow} color="#4CAF50" />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="🧹 Reset " onPress={handleReset} color="#d9534f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#282c34',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  inputGroup: {
    marginBottom: 20,
  },
  columnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    width: 40, // Adjust the width of the button to give it some space
  },
  buttonContainer: {
    marginBottom: 28,
  },
});
