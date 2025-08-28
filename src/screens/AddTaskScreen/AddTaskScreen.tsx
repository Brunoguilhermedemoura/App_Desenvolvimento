import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTaskContext } from '@/src/hooks';
import { TaskForm } from '@/src/organisms';
import { PageTemplate } from '@/src/templates';
import { CreateTaskData } from '@/src/types';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet } from 'react-native';

export const AddTaskScreen: React.FC = () => {
  const { createTask } = useTaskContext();

  const handleFormSubmit = async (taskData: CreateTaskData) => {
    await createTask(taskData);
  };

  const handleFormSuccess = () => {
    Alert.alert(
      'Sucesso!', 
      'Tarefa criada com sucesso!',
      [
        {
          text: 'Ver Tarefas',
          onPress: () => router.push('App de Tarefas')
        },
        {
          text: 'Criar Outra',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <PageTemplate
      title=""
      scrollable
      keyboardAvoiding
    >
      <ThemedView style={styles.header}>
        
        <ThemedText type="title">Nova Tarefa</ThemedText>
        <ThemedText style={styles.subtitle}>
          Preencha os detalhes da sua nova tarefa
        </ThemedText>
      </ThemedView>

      <TaskForm
        onSubmit={handleFormSubmit}
        onSuccess={handleFormSuccess}
      />
    </PageTemplate>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
