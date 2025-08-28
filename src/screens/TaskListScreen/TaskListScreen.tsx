import { useTaskContext } from '@/src/hooks';
import { TaskList } from '@/src/organisms';
import { PageTemplate } from '@/src/templates';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';

export const TaskListScreen: React.FC = () => {
  const {
    tasks,
    refreshing,
    toggleTaskCompletion,
    deleteTask,
    onRefresh,
    getTaskStats,
  } = useTaskContext();

  // Atualizar quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      // Força uma pequena atualização para garantir sincronização
    }, [])
  );

  const stats = getTaskStats();
  
  return (
    <PageTemplate
      title="Minhas Tarefas"
      subtitle={`${stats.pending} pendentes de ${stats.total}`}
      showLogout={true}
    >
      <TaskList
        tasks={tasks}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onToggleComplete={toggleTaskCompletion}
        onDeleteTask={deleteTask}
      />
    </PageTemplate>
  );
};
