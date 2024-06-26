import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import CheckBox from '@react-native-community/checkbox';  // Importando o CheckBox

const Configuracao = ({ modalVisible, setModalVisible, fill, setFill, selectedBrushSize, setSelectedBrushSize }) => {
  const [checkList, setCheckList] = useState([
    { id: '1', text: 'Auto Preencher', checked: true },
  ]);

  const toggleCheck = (id) => {
    setCheckList(checkList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
    if (id === '1') {
      setFill(!fill);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Configurações</Text>
            <FlatList
              data={checkList}
              renderItem={({ item }) => (
                <View style={styles.checkListItem}>
                  <CheckBox
                    value={item.checked}
                    onValueChange={() => toggleCheck(item.id)}
                  />
                  <Text style={styles.checkListText}>{item.text}</Text>
                </View>
              )}
              keyExtractor={item => item.id}
            />
            <Text style={[styles.modalText, { marginTop: 30 }]}>Escolha a grossura do lapis:</Text>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.brushSizeContainer}>
                <TouchableOpacity
                  style={[
                    styles.brushSizeButton,
                    selectedBrushSize === 10 && styles.selectedBrushSize,
                    { width: 20, height: 20 },
                  ]}
                  onPress={() => setSelectedBrushSize(10)}
                />
                <TouchableOpacity
                  style={[
                    styles.brushSizeButton,
                    selectedBrushSize === 20 && styles.selectedBrushSize,
                    { width: 30, height: 30 },
                  ]}
                  onPress={() => setSelectedBrushSize(20)}
                />
                <TouchableOpacity
                  style={[
                    styles.brushSizeButton,
                    selectedBrushSize === 30 && styles.selectedBrushSize,
                    { width: 40, height: 40 },
                  ]}
                  onPress={() => setSelectedBrushSize(30)}
                />
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'left',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkListText: {
    marginLeft: 10,
    fontSize: 16,
  },
  brushSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    width: '60%',
  },
  brushSizeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
  },
  selectedBrushSize: {
    borderWidth: 3,
    borderColor: 'red',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default Configuracao;
