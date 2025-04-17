import React, { useContext, useState } from 'react';
import { ScrollView, Text, TextInput, Button, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DataContext } from '../contexts/DataContext';

export default function AddRowScreen() {
  const router = useRouter();
  const { columnValues, rows, setRows } = useContext(DataContext);

  const [rowInput, setRowInput] = useState(Array(columnValues.length).fill(''));

  const handleRowInputChange = (text, index) => {
    const updated = [...rowInput];
    updated[index] = text;
    setRowInput(updated);
  };

  const handleSaveRow = () => {
    setRows([...rows, rowInput]);
    setRowInput(Array(columnValues.length).fill('')); // Reset input after save
  };

  const rowPreview = rows.slice(-4); // Show last 4 rows

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonContainer}>
          <Button title="← Back to Columns" onPress={() => router.back()} />
        </View>

        <Text style={styles.title}>➕ Add New Row:</Text>
        {columnValues.map((col, index) => (
          <TextInput
            key={index}
            placeholder={`Enter ${col || `Column ${index + 1}`}`}
            value={rowInput[index]}
            onChangeText={(text) => handleRowInputChange(text, index)}
            style={styles.input}
          />
        ))}

        <View style={styles.buttonContainer}>
          <Button title="Save Row" onPress={handleSaveRow} />
        </View>

        <Text style={styles.sectionTitle}>📄 Recent Entries (Snapshot):</Text>

        {rows.length > 0 && (
          <View style={styles.table}>
            {/* Column headers */}
            <View style={styles.headerRow}>
              {columnValues.map((col, index) => (
                <Text key={index} style={[styles.cell, styles.headerCell]}>
                  {col || `Col ${index + 1}`}
                </Text>
              ))}
            </View>

            {/* Data rows */}
            {rowPreview.map((row, rowIndex) => {
              const isEven = rowIndex % 2 === 0;
              return (
                <View
                  key={rowIndex}
                  style={[
                    styles.dataRow,
                    isEven ? styles.evenRow : styles.oddRow
                  ]}
                >
                  {row.map((cell, cellIndex) => (
                    <Text
                      key={cellIndex}
                      style={[
                        styles.cell,
                        isEven ? styles.evenText : styles.oddText
                      ]}
                    >
                      {cell}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  innerContainer: {
    width: 344,
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'black',//#333
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  evenRow: {
    backgroundColor: '#2e7d32', // Greenish
  },
  oddRow: {
    backgroundColor: '#333', // Light gray #6495ED
  },
  evenText: {
    color: 'white',
  },
  oddText: {
    color: 'white',
  },
});
