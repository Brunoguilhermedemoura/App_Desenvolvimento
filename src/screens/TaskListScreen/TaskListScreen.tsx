import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTaskContext } from '@/src/hooks';
import { TaskList } from '@/src/organisms';
import { PageTemplate } from '@/src/templates';

import { useTripleClick } from '@/src/hooks/easter';

export const TaskListScreen: React.FC = () => {
  const {
    tasks,
    refreshing,
    toggleTaskCompletion,
    deleteTask,
    onRefresh,
    getTaskStats,
  } = useTaskContext();

  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
    }, [])
  );

  const stats = getTaskStats();

  const handleTripleClick = useTripleClick(() => {
    setModalVisible(true);
  });

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🐣 Easter Egg!</Text>
            <Text style={styles.modalText}>
              Você descobriu algo escondido. Parabéns!
            </Text>

            <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <PageTemplate
        title={
          <Pressable onPress={handleTripleClick}>
          <Text style={styles.titleText}>Minhas Tarefas</Text>
        </Pressable>
        
        }
        subtitle={`${stats.pending} pendentes de ${stats.total}`}
      >
        <TaskList
          tasks={tasks}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onToggleComplete={toggleTaskCompletion}
          onDeleteTask={deleteTask}
        />
      </PageTemplate>
    </>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
