import { CreateTaskData, Task, UpdateTaskData } from '@/src/types';
import { addSampleData } from '@/src/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar tarefas do AsyncStorage
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      
      // Adicionar dados de exemplo se for a primeira vez
      await addSampleData();
      
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar tarefas no AsyncStorage
  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  // Carregar tarefas na inicialização
  useEffect(() => {
    loadTasks();
  }, []);

  // Salvar tarefas sempre que a lista mudar
  useEffect(() => {
    // Só salva se não for o carregamento inicial (quando tasks ainda está vazio)
    if (tasks.length > 0 || (tasks.length === 0 && isLoading === false)) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  // Criar nova tarefa
  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: taskData.priority,
    };

    setTasks(prevTasks => {
      const newTasks = [newTask, ...prevTasks];
      
      // Salvar imediatamente no AsyncStorage
      saveTasks(newTasks);
      
      return newTasks;
    });
    
    return newTask;
  };

  // Atualizar tarefa existente
  const updateTask = async (taskId: string, updates: UpdateTaskData): Promise<void> => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  // Alternar status de conclusão
  const toggleTaskCompletion = async (taskId: string): Promise<void> => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Deletar tarefa
  const deleteTask = async (taskId: string): Promise<void> => {
    console.log('[deleteTask] Tentando deletar tarefa com id:', taskId);
  
    setTasks(prevTasks => {
      console.log('[deleteTask] Tasks antes de deletar:', prevTasks);
      const newTasks = prevTasks.filter(task => task.id !== taskId);
      console.log('[deleteTask] Tasks após deletar:', newTasks);
  
      // Salvar no AsyncStorage com as tarefas atualizadas
      saveTasks(newTasks).catch(err => {
        console.error('[deleteTask] Erro ao salvar tarefas:', err);
      });
  
      return newTasks;
    });
  };
  
  
  

  // Buscar tarefa por ID
  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  // Função de refresh
  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  // Estatísticas das tarefas
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
    };
  };

  return {
    tasks,
    isLoading,
    refreshing,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    getTaskById,
    onRefresh,
    getTaskStats,
  };
};
