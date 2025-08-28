import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/src/atoms/Button';
import { Icon } from '@/src/atoms/Icon';
import { Input } from '@/src/atoms/Input';
import { PriorityIndicator } from '@/src/atoms/PriorityIndicator';
import { useTaskContext } from '@/src/hooks';
import { PrioritySelector } from '@/src/molecules/PrioritySelector';
import { Task, TaskPriority } from '@/src/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export const TaskDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { getTaskById, updateTask, toggleTaskCompletion, deleteTask } = useTaskContext();
  
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('média');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const foundTask = getTaskById(id);
      if (foundTask) {
        setTask(foundTask);
        setTitle(foundTask.title);
        setDescription(foundTask.description);
        setPriority(foundTask.priority);
      } else {
        Alert.alert('Erro', 'Tarefa não encontrada!');
        router.back();
      }
    }
  }, [id]);

  const handleSaveChanges = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório!');
      return;
    }

    if (!task) return;

    setIsLoading(true);
    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      // Atualizar estado local
      const updatedTask = { ...task, title: title.trim(), description: description.trim(), priority };
      setTask(updatedTask);
      setIsEditing(false);
      Alert.alert('Sucesso!', 'Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleToggleCompletion = async () => {
    if (!task) return;
  
    try {
      await toggleTaskCompletion(task.id);
      
      const newCompleted = !task.completed;
      const completedAt = newCompleted ? new Date().toISOString() : null;
  
      setTask({ ...task, completed: newCompleted, completedAt });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };
  
  // const handleToggleCompletion = async () => {
  //   if (!task) return;

  //   try {
  //     await toggleTaskCompletion(task.id);
  //     setTask({ ...task, completed: !task.completed });
  //   } catch (error) {
  //     console.error('Erro ao atualizar status:', error);
  //   }
  // };

  const handleDeleteTask = async () => {
    if (!task) return;
  
    console.log('Deletando tarefa diretamente:', task);
  
    try {
      await deleteTask(task.id);
      console.log('Tarefa deletada com sucesso:', task.id);
      router.back();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível deletar a tarefa.');
    }
  };
  
  
  const cancelEdit = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!task) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Carregando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        
        <ThemedText type="title" style={styles.headerTitle}>
          {isEditing ? 'Editar Tarefa' : 'Detalhes'}
        </ThemedText>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon 
            name={isEditing ? "xmark" : "pencil"} 
            size={20} 
            color={isEditing ? "#FF6B6B" : "#333"} 
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Status da Tarefa */}
        <ThemedView style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.completed && styles.completedStatusButton
            ]}
            onPress={handleToggleCompletion}
          >
            <Icon
              name={task.completed ? 'checkmark.circle.fill' : 'circle'}
              size={24}
              color={task.completed ? '#4CAF50' : '#666'}
            />
            <ThemedText style={[
              styles.statusText,
              task.completed && styles.completedStatusText
            ]}>
              {task.completed ? 'Concluída' : 'Pendente'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Conteúdo da Tarefa */}
        <ThemedView style={styles.taskContent}>
          {isEditing ? (
            <>
              <Input
                label="Título"
                value={title}
                onChangeText={setTitle}
                placeholder="Título da tarefa"
                maxLength={100}
                showCharCount
              />

              <Input
                label="Descrição"
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição da tarefa"
                maxLength={500}
                showCharCount
                multiline
              />

              <PrioritySelector
                selectedPriority={priority}
                onPriorityChange={setPriority}
              />
            </>
          ) : (
            <>
              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Título</ThemedText>
                <ThemedText style={[
                  styles.taskTitle,
                  task.completed && styles.completedText
                ]}>
                  {task.title}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Descrição</ThemedText>
                <ThemedText style={[
                  styles.taskDescription,
                  task.completed && styles.completedText
                ]}>
                  {task.description || 'Sem descrição'}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Prioridade</ThemedText>
                <ThemedView style={styles.priorityDisplay}>
                  <PriorityIndicator priority={task.priority} />
                  <ThemedText style={styles.priorityText}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Criada em</ThemedText>
                <ThemedText style={styles.dateText}>
                  {formatDate(task.createdAt)}
                </ThemedText>
              </ThemedView>

              {task.completedAt && (
  <ThemedView style={styles.section}>
    <ThemedText style={styles.sectionLabel}>Finalizada em</ThemedText>
    <ThemedText style={styles.dateText}>
      {formatDate(task.completedAt)}
    </ThemedText>
  </ThemedView>
)}
            </>
          )}
        </ThemedView>
      </ScrollView>

      {/* Botões de Ação */}
      <ThemedView style={styles.actionButtons}>
        {isEditing ? (
          <>
            <ThemedView style={styles.cancelButtonContainer}>
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={cancelEdit}
                fullWidth
              />
            </ThemedView>
            
            <ThemedView style={styles.saveButtonContainer}>
              <Button
                title={isLoading ? 'Salvando...' : 'Salvar'}
                variant="primary"
                onPress={handleSaveChanges}
                disabled={!title.trim() || isLoading}
                fullWidth
              />
            </ThemedView>
          </>
           
        ) : (
          <Button
            title="Deletar Tarefa"
            variant="danger"
            onPress={handleDeleteTask}
            fullWidth
          />
          
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120, // Espaço para os botões
  },
  statusContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  completedStatusButton: {
    backgroundColor: '#e8f5e8',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  completedStatusText: {
    color: '#4CAF50',
  },
  taskContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    lineHeight: 32,
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cancelButtonContainer: {
    width: '40%',
    marginRight: 6,
  },
  saveButtonContainer: {
    width: '56%',
    marginLeft: 6,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
