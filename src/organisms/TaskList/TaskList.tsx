import { EmptyState, TaskItem } from '@/src/molecules';
import { Task } from '@/src/types';
import { router } from 'expo-router';
import React from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet } from 'react-native';

export interface TaskListProps {
  tasks: Task[];
  refreshing?: boolean;
  onRefresh?: () => void;
  onToggleComplete?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  refreshing = false,
  onRefresh,
  onToggleComplete,
  onDeleteTask,
}) => {
  const handleTaskPress = (task: Task) => {
    router.push(`/task-details?id=${task.id}`);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Deletar Taref1234a',
      'Tem certeza que deseja deletar esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => onDeleteTask?.(taskId),
        },
      ]
    );
  };

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="checklist"
        title="Nenhuma tarefa ainda!"
        subtitle="Vá para a aba 'Adicionar' para criar sua primeira tarefa"
      />
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onPress={handleTaskPress}
          onToggleComplete={onToggleComplete}
          onDelete={handleDeleteTask}
        />
      )}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
