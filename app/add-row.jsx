import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, Button, View, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { DataContext } from '../contexts/DataContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function AddRowScreen() {
  const router = useRouter();
  const { columnValues, rows, setRows } = useContext(DataContext);

  const [rowInput, setRowInput] = useState(Array(columnValues.length).fill(''));
  const [editIndex, setEditIndex] = useState(null);
  const [showSnapshot, setShowSnapshot] = useState(rows.length > 0);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    if (rows.length > 0) {
      setShowSnapshot(true);
    }
  }, [rows]);

  const handleRowInputChange = (text, index) => {
    const updated = [...rowInput];
    updated[index] = text;
    setRowInput(updated);
  };

  const handleSaveRow = () => {
    const isEmpty = rowInput.some(cell => cell.trim() === '');
    if (isEmpty) {
      Alert.alert('Incomplete Data', 'Please fill out all fields before saving.');
      return;
    }
  
    if (editIndex !== null) {
      const updatedRows = [...rows];
      updatedRows[editIndex] = rowInput;
      setRows(updatedRows);
      setEditIndex(null);
    } else {
      setRows([...rows, rowInput]);
    }
  
    setRowInput(Array(columnValues.length).fill(''));
  };

  const handleEdit = (index) => {
    setRowInput(rows[index]);
    setEditIndex(index);
    setActionModalVisible(false);
  };

  const handleDelete = (index) => {
    Alert.alert(
      'Delete Row?',
      'Are you sure you want to delete this row?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedRows = rows.filter((_, i) => i !== index);
            setRows(updatedRows);
            setActionModalVisible(false);
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    if (rows.length > 0) {
      Alert.alert(
        'Keep entered data?',
        'You have saved row data. Do you want to keep it before going back?',
        [
          {
            text: 'No, Discard',
            style: 'destructive',
            onPress: () => {
              setRows([]);
              setShowSnapshot(false);
              router.back();
            }
          },
          {
            text: 'Yes, Keep',
            style: 'default',
            onPress: () => router.back()
          }
        ],
        { cancelable: true }
      );
    } else {
      router.back();
    }
  };

  const rowPreview = rows.slice(-2);
  const rowPreviewStartIndex = Math.max(rows.length - 2, 0);

  const handleExportCSV = async () => {
    try {
      const headerRow = columnValues.map((col, idx) => col || `Column ${idx + 1}`).join(',');
      const dataRows = rows.map(row => row.map(cell => `${cell}`).join(','));
      const csvContent = [headerRow, ...dataRows].join('\n');

      const fileUri = FileSystem.documentDirectory + 'data_export.csv';
      await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export CSV Data',
        UTI: 'public.comma-separated-values-text',
      });

      Alert.alert('Success', 'CSV file has been exported successfully and is ready to be shared.', [
        { text: 'OK' },
      ]);
    } catch (error) {
      Alert.alert('Export Failed', `An error occurred while exporting the CSV: ${error.message}`, [
        { text: 'OK' },
      ]);
    }
  };

  return (
    
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
  <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
    <View style={styles.innerContainer}>
       <View style={styles.buttonContainer}>
          <Button title="Back" onPress={handleBackPress} />
        </View>

        <Text style={styles.title}>{editIndex !== null ? '✏️ Edit Row:' : 'Enter Row data:'}</Text>

        {columnValues.map((col, index) => (
          <TextInput
            key={index}
            placeholder={`Enter ${col || `Column ${index + 1}`}`}
            placeholderTextColor="#000"
            value={rowInput[index]}
            onChangeText={(text) => handleRowInputChange(text, index)}
            style={styles.input}
          />
        ))}

        <View style={styles.buttonContainer}>
          <Button title={editIndex !== null ? 'Update Row' : 'Save Data'} onPress={handleSaveRow} />
        </View>

        {showSnapshot && rows.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>📄 Recent Entries (Snapshot):</Text>

            <View style={styles.table}>
              <View style={styles.headerRow}>
              {columnValues.slice(0, 3).map((col, index) => (
                <Text key={index} style={[styles.cell, styles.headerCell]}>
                  {col || `Col ${index + 1}`}
                </Text>
              ))}
                <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
              </View>

              {rowPreview.map((row, rowIndex) => {
                const globalIndex = rowPreviewStartIndex + rowIndex;
                const isEven = globalIndex % 2 === 0;

                return (
                  <View
                    key={globalIndex}
                    style={[styles.dataRow, isEven ? styles.evenRow : styles.oddRow]}
                  >
                    {row.slice(0, 3).map((cell, cellIndex) => (
                        <Text
                          key={cellIndex}
                          style={[styles.cell, isEven ? styles.evenText : styles.oddText]}
                        >
                          {cell}
                        </Text>
                    ))}
                    <View style={[styles.cell, { alignItems: 'center' }]}>  
                    <TouchableOpacity
                     onPress={() => {
                      setSelectedRowIndex(globalIndex);
                      setActionModalVisible(true);
                      }}
                      style={{
                        // backgroundColor: '#03dac6',
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                        marginTop: -4,
                        alignSelf: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFBF00', fontWeight: 'bold', fontSize: 16 }}>☰</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.buttonContainer}>
              <Button title="📤 Export to CSV" onPress={handleExportCSV} color="#03dac6" />
            </View>

            <Modal
              transparent
              animationType="slide"
              visible={actionModalVisible}
              onRequestClose={() => setActionModalVisible(false)}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                  <Text style={{ fontSize: 18, marginBottom: 20 }}>Choose an action</Text>
                  <Button title="Modify" onPress={() => handleEdit(selectedRowIndex)} />
                  <View style={{ height: 10 }} />
                  <Button title="Delete" color="#f44336" onPress={() => handleDelete(selectedRowIndex)} />
                  <View style={{ height: 10 }} />
                  <Button title="Cancel" onPress={() => setActionModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        )}
	
    </View>
  </ScrollView>
</ScrollView>

             
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: '#282c34',
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
    color: 'white',
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
    color: 'white',
  },
  table: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  dataRow: {//height of preview
    flexDirection: 'row',
    paddingVertical: 4,
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
    backgroundColor: '#2e7d32',
  },
  oddRow: {
    backgroundColor: '#333',
  },
  evenText: {
    color: 'white',
  },
  oddText: {
    color: 'white',
  },
});
