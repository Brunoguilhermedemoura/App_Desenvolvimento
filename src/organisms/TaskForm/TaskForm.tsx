import { ThemedView } from '@/components/ThemedView';
import { Button, Input } from '@/src/atoms';
import { PrioritySelector } from '@/src/molecules';
import { CreateTaskData, TaskPriority } from '@/src/types';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
export interface TaskFormProps {
  onSubmit: (taskData: CreateTaskData) => Promise<void>;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onSuccess,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('média');
  const [titleError, setTitleError] = useState('');

  const validateForm = (): boolean => {
    setTitleError('');
    
    if (!title.trim()) {
      setTitleError('O título da tarefa é obrigatório!');
      return false;
    }
    
    return true;
  };

  const navigation = useNavigation();
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
  
      // Limpar formulário
      setTitle('');
      setDescription('');
      setPriority('média');
  
      onSuccess?.();
      navigation.goBack();

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a tarefa. Tente novamente.');
    }
  };
  
  // const handleSubmit = async () => {
  //   if (!validateForm()) {
  //     return;
  //   }

  //   try {
  //     await onSubmit({
  //       title: title.trim(),
  //       description: description.trim(),
  //       priority,
  //     });

  //     // Limpar formulário após sucesso
  //     setTitle('');
  //     setDescription('');
  //     setPriority('média');
      
  //     onSuccess?.();

  //   } catch (error) {
  //     console.error('Erro ao criar tarefa:', error);
  //     Alert.alert('Erro', 'Não foi possível criar a tarefa. Tente novamente.');
  //   }
  // };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setPriority('média');
    setTitleError('');
  };

  return (
    <ThemedView style={styles.container}>
      <Input
        label="Título *"
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Estudar React Native"
        maxLength={100}
        showCharCount
        error={titleError}
      />

      <Input
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva sua tarefa em detalhes (opcional)"
        maxLength={500}
        showCharCount
        multiline
      />

      <PrioritySelector
        selectedPriority={priority}
        onPriorityChange={setPriority}
      />

      <ThemedView style={styles.actions}>
        <Button
          title="Limpar"
          variant="secondary"
          onPress={handleClear}
          style={styles.clearButton}
        />
        
        <Button
          title={isLoading ? 'Criando...' : 'Criar Tarefa'}
          variant="primary"
          onPress={handleSubmit}
          disabled={isLoading}
          style={styles.submitButton}
        />
      </ThemedView>
    </ThemedView>
  );

  
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100, // Espaço extra para evitar sobreposição com tabs
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20, // Margem extra
  },
  clearButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
