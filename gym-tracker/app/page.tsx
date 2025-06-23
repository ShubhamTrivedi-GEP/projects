"use client"
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Trash2, Edit, Save, Clock, TrendingUp, Check, X, ChevronDown, ChevronLeft, Dumbbell, User, LineChart, Calendar, Menu, Home, ArrowDown, ArrowUp, Minus, ArrowDownRight, ArrowUpRight } from 'lucide-react';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
  completed: boolean;
  date: string;
};

type Client = {
  id: string;
  name: string;
  age: number;
  goal: string;
  workouts: Workout[];
  progress: ProgressData[];
};

type ProgressData = {
  date: string;
  weight: number;
  bodyFat?: number;
};
const initialClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 32,
    goal: 'Build muscle',
    workouts: [
      {
        id: 'w1',
        name: 'Upper Body Strength',
        exercises: [
          { id: 'e1', name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
          { id: 'e2', name: 'Pull Ups', sets: 3, reps: 10, weight: 0 },
          { id: 'e3', name: 'Shoulder Press', sets: 3, reps: 10, weight: 25 },
        ],
        completed: false,
        date: '2025-05-20',
      }
    ],
    progress: [
      { date: '2025-04-18', weight: 75, bodyFat: 18 },
      { date: '2025-05-01', weight: 74, bodyFat: 17.5 },
      { date: '2025-05-15', weight: 73.5, bodyFat: 17 },
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 28,
    goal: 'Weight loss',
    workouts: [
      {
        id: 'w2',
        name: 'HIIT Cardio',
        exercises: [
          { id: 'e4', name: 'Burpees', sets: 3, reps: 15, weight: 0 },
          { id: 'e5', name: 'Mountain Climbers', sets: 3, reps: 20, weight: 0 },
          { id: 'e6', name: 'Jump Squats', sets: 4, reps: 12, weight: 0 },
        ],
        completed: true,
        date: '2025-05-15',
      }
    ],
    progress: [
      { date: '2025-04-18', weight: 68, bodyFat: 24 },
      { date: '2025-05-01', weight: 67, bodyFat: 23.5 },
      { date: '2025-05-15', weight: 65.5, bodyFat: 22.8 },
    ]
  }
];

const App = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [view, setView] = useState<'dashboard' | 'clients' | 'analytics' | 'schedule' | 'workouts' | 'all-workouts' | 'progress' | 'workout-detail'>('dashboard');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({ name: '', sets: 3, reps: 10, weight: 0 });
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({ name: '', exercises: [], completed: false, date: new Date().toISOString().split('T')[0] });
  const [newClient, setNewClient] = useState<Partial<Client>>({ name: '', age: 30, goal: '', workouts: [], progress: [] });
  const [isAddingClient, setIsAddingClient] = useState<boolean>(false);
  const [isAddingWorkout, setIsAddingWorkout] = useState<boolean>(false);
  const [isAddingExercise, setIsAddingExercise] = useState<boolean>(false);
  const [isAddingProgress, setIsAddingProgress] = useState<boolean>(false);
  const [newProgress, setNewProgress] = useState<Partial<ProgressData>>({ 
    date: new Date().toISOString().split('T')[0], 
    weight: undefined, 
    bodyFat: undefined 
  });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [simulationResults, setSimulationResults] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'exercise' | 'rest' | 'completed'>('idle');
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setView('workouts');
  };
  const handleAddClient = () => {
    if (!newClient.name || !newClient.goal) return;
    
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      age: newClient.age || 30,
      goal: newClient.goal,
      workouts: [],
      progress: []
    };
    
    setClients([...clients, client]);
    setNewClient({ name: '', age: 30, goal: '', workouts: [], progress: [] });
    setIsAddingClient(false);
  };
  
  const handleAddWorkout = () => {
    if (!selectedClient || !newWorkout.name) return;
    
    const workout: Workout = {
      id: Date.now().toString(),
      name: newWorkout.name,
      exercises: [],
      completed: false,
      date: newWorkout.date || new Date().toISOString().split('T')[0]
    };
    
    const updatedClient = {
      ...selectedClient,
      workouts: [...selectedClient.workouts, workout]
    };
    
    setClients(
      clients.map(client => 
        client.id === selectedClient.id ? updatedClient : client
      )
    );
    
    setSelectedClient(updatedClient);
    setNewWorkout({ name: '', exercises: [], completed: false, date: new Date().toISOString().split('T')[0] });
    setIsAddingWorkout(false);
  };
  
  const handleAddExercise = () => {
    if (!selectedWorkout || !newExercise.name) return;
    
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      sets: newExercise.sets || 3,
      reps: newExercise.reps || 10,
      weight: newExercise.weight || 0
    };
    
    const updatedWorkout = {
      ...selectedWorkout,
      exercises: [...selectedWorkout.exercises, exercise]
    };
    
    updateWorkout(updatedWorkout);
    
    setSelectedWorkout(updatedWorkout);
    setNewExercise({ name: '', sets: 3, reps: 10, weight: 0 });
    setIsAddingExercise(false);
  };
  
  const handleAddProgress = () => {
    if (!selectedClient || !newProgress.date || newProgress.weight === undefined) return;
    
    const progress: ProgressData = {
      date: newProgress.date,
      weight: newProgress.weight,
      bodyFat: newProgress.bodyFat
    };
    
    const updatedClient = {
      ...selectedClient,
      progress: [...selectedClient.progress, progress].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    };
    
    setClients(
      clients.map(client => 
        client.id === selectedClient.id ? updatedClient : client
      )
    );
    
    setSelectedClient(updatedClient);
    setNewProgress({ 
      date: new Date().toISOString().split('T')[0], 
      weight: undefined, 
      bodyFat: undefined 
    });
    setIsAddingProgress(false);
  };
  
  const updateWorkout = (workout: Workout) => {
    if (!selectedClient) return;
    
    const updatedClient = {
      ...selectedClient,
      workouts: selectedClient.workouts.map(w => 
        w.id === workout.id ? workout : w
      )
    };
    
    setClients(
      clients.map(client => 
        client.id === selectedClient.id ? updatedClient : client
      )
    );
    
    setSelectedClient(updatedClient);
  };
  
  const handleDeleteExercise = (exerciseId: string) => {
    if (!selectedWorkout) return;
    
    const updatedWorkout = {
      ...selectedWorkout,
      exercises: selectedWorkout.exercises.filter(e => e.id !== exerciseId)
    };
    
    updateWorkout(updatedWorkout);
    setSelectedWorkout(updatedWorkout);
  };
  
  const handleDeleteWorkout = (workoutId: string) => {
    if (!selectedClient) return;
    
    const updatedClient = {
      ...selectedClient,
      workouts: selectedClient.workouts.filter(w => w.id !== workoutId)
    };
    
    setClients(
      clients.map(client => 
        client.id === selectedClient.id ? updatedClient : client
      )
    );
    
    setSelectedClient(updatedClient);
  };
  
  const toggleWorkoutCompletion = (workoutId: string) => {
    if (!selectedClient) return;
    
    const updatedClient = {
      ...selectedClient,
      workouts: selectedClient.workouts.map(w => 
        w.id === workoutId ? { ...w, completed: !w.completed } : w
      )
    };
    
    setClients(
      clients.map(client => 
        client.id === selectedClient.id ? updatedClient : client
      )
    );
    
    setSelectedClient(updatedClient);
  };
  
  const startEditExercise = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    setEditedExercise({...exercise});
  };
  
  const saveEditedExercise = () => {
    if (!selectedWorkout || !editedExercise) return;
    
    const updatedWorkout = {
      ...selectedWorkout,
      exercises: selectedWorkout.exercises.map(e => 
        e.id === editedExercise.id ? editedExercise : e
      )
    };
    
    updateWorkout(updatedWorkout);
    setSelectedWorkout(updatedWorkout);
    setEditingExerciseId(null);
    setEditedExercise(null);
  };
  
  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setView('workout-detail');
  };
  
  const simulateWorkout = () => {
    if (!selectedWorkout) return;
    
    setIsSimulating(true);
    setSimulationProgress(0);
    setSimulationResults(null);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setTimeRemaining(30);
    setSimulationStatus('exercise');
  };
  
  const handleSkip = () => {
    if (simulationStatus === 'exercise') {
      setIsResting(true);
      setTimeRemaining(30);
      setSimulationStatus('rest');
    } else if (simulationStatus === 'rest') {
      moveToNextExerciseOrSet();
    }
  };
  
  const completeSimulation = () => {
    if (!selectedWorkout) return;
    
    const totalVolume = selectedWorkout.exercises.reduce(
      (sum, ex) => sum + ex.sets * ex.reps * ex.weight, 0
    );
    
    const caloriesBurned = Math.round(totalVolume * 0.075);
    const muscleImpact = selectedWorkout.exercises.reduce((impact, ex) => {
      const muscle = getMuscleGroup(ex.name);
      return { ...impact, [muscle]: (impact[muscle] || 0) + (ex.sets * ex.reps * (ex.weight > 0 ? ex.weight : 5)) };
    }, {} as Record<string, number>);
    
    const results = `Simulation Complete:\n
    • Estimated calories burned: ${caloriesBurned}\n
    • Workout duration: ${Math.round(45 + (totalVolume / 1000))} minutes\n
    • Total volume: ${totalVolume} kg\n
    • Muscle impact: ${Object.entries(muscleImpact).map(([muscle, impact]) => 
        `${muscle}: ${impact > 1000 ? 'High' : impact > 500 ? 'Medium' : 'Low'}`
      ).join(', ')}`;
    
    setSimulationResults(results);
    setIsSimulating(false);
    setSimulationStatus('completed');
    setSimulationProgress(100);
  };

  const moveToNextExerciseOrSet = () => {
    if (!selectedWorkout) return;
    const totalSets = selectedWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSets = (currentExerciseIndex * selectedWorkout.exercises[currentExerciseIndex].sets) + currentSet;
    const progressPercentage = Math.min(Math.round((completedSets / totalSets) * 100), 99);
    setSimulationProgress(progressPercentage);
    
    if (currentSet < selectedWorkout.exercises[currentExerciseIndex].sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(false);
      setTimeRemaining(30);
      setSimulationStatus('exercise');
    } else if (currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setSimulationStatus('exercise');
    } else {
      completeSimulation();
    }
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    
    if (isSimulating && simulationStatus !== 'completed' && simulationStatus !== 'idle') {
      timerId = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            if (simulationStatus === 'exercise') {
              setIsResting(true);
              setSimulationStatus('rest');
              return 30; 
            } else if (simulationStatus === 'rest') {
              if (currentSet < selectedWorkout!.exercises[currentExerciseIndex].sets) {
                setCurrentSet(prev => prev + 1);
                setIsResting(false);
                setSimulationStatus('exercise');
                return 30;
              } else if (currentExerciseIndex < selectedWorkout!.exercises.length - 1) {
                setCurrentExerciseIndex(prev => prev + 1);
                setCurrentSet(1);
                setIsResting(false);
                setSimulationStatus('exercise');
                return 30;
              } else {
                completeSimulation();
                return 0;
              }
            }
          }
          return prevTime - 1;
        });
        
        if (selectedWorkout) {
          const totalSets = selectedWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
          const completedSets = ((currentExerciseIndex) * selectedWorkout.exercises[currentExerciseIndex].sets) + (currentSet - 1) + (simulationStatus === 'rest' ? 0.5 : 0);
          const progressPercentage = Math.min(Math.round((completedSets / totalSets) * 100), 99);
          setSimulationProgress(progressPercentage);
        }
      }, 1000 / simulationSpeed);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isSimulating, simulationStatus, simulationSpeed, currentSet, currentExerciseIndex, selectedWorkout, timeRemaining]);

  const getMuscleGroup = (exerciseName: string): string => {
    const lowerName = exerciseName.toLowerCase();
    
    if (lowerName.includes('bench') || lowerName.includes('push') || lowerName.includes('chest') || lowerName.includes('fly')) {
      return 'Chest';
    } else if (lowerName.includes('squat') || lowerName.includes('lunge') || lowerName.includes('leg')) {
      return 'Legs';
    } else if (lowerName.includes('pull') || lowerName.includes('row') || lowerName.includes('lat')) {
      return 'Back';
    } else if (lowerName.includes('curl') || lowerName.includes('bicep')) {
      return 'Biceps';
    } else if (lowerName.includes('tricep') || lowerName.includes('extension') || lowerName.includes('dip')) {
      return 'Triceps';
    } else if (lowerName.includes('shoulder') || lowerName.includes('press') || lowerName.includes('delt')) {
      return 'Shoulders';
    } else if (lowerName.includes('ab') || lowerName.includes('crunch') || lowerName.includes('plank')) {
      return 'Core';
    } else {
      return 'Full Body';
    }
  };
  
  const calculateProgress = () => {
    if (!selectedClient || selectedClient.progress.length < 2) return null;
    
    const first = selectedClient.progress[0];
    const last = selectedClient.progress[selectedClient.progress.length - 1];
    const weightDiff = last.weight - first.weight;
    const weightPercent = (weightDiff / first.weight) * 100;
    
    let bodyFatDiff = 0;
    let bodyFatPercent = 0;
    
    if (first.bodyFat !== undefined && last.bodyFat !== undefined) {
      bodyFatDiff = last.bodyFat - first.bodyFat;
      bodyFatPercent = (bodyFatDiff / first.bodyFat) * 100;
    }
    
    const daysDiff = Math.round((new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      weightDiff,
      weightPercent,
      bodyFatDiff,
      bodyFatPercent,
      daysDiff
    };
  };
  
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <header className={`px-4 py-3 flex items-center justify-between ${darkMode ? 'bg-gray-800/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'} shadow-lg sticky top-0 z-30`}>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
            <Dumbbell size={20} />
          </div>
          <h1 className="text-xl font-bold font-poppins tracking-tight">FitTrack Pro</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex cursor-pointer items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
              view === 'dashboard' 
                ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                : (darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
              } font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => {setView('clients'); setSelectedClient(null);}}
            className={`flex cursor-pointer items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
              view === 'clients' 
                ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                : (darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
              } font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <User size={18} />
            <span>Clients</span>
          </button>
          <button 
            onClick={() => setView('analytics')}
            className={`flex cursor-pointer items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
              view === 'analytics' 
                ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                : (darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
              } font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <LineChart size={18} />
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => setView('schedule')}
            className={`flex cursor-pointer items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
              view === 'schedule' 
                ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                : (darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
              } font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <Calendar size={18} />
            <span>Schedule</span>
          </button>
          <button 
            onClick={toggleDarkMode}
            className={`ml-4  cursor-pointer p-2 rounded-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
        
        <div className="flex cursor-pointer items-center space-x-3 md:hidden">
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <Menu size={18} />
          </button>
        </div>
      </header>
      
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black opacity-25" onClick={() => setMobileMenuOpen(false)}></div>
          <nav className={`fixed right-0 top-0 bottom-0 flex flex-col w-64 max-w-sm py-6 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-l ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium font-poppins">Menu</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className={`p-1 cursor-pointer rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {setView('dashboard'); setMobileMenuOpen(false);}}
                className={`flex cursor-pointer items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  view === 'dashboard' 
                    ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                    : (darkMode ? 'hover:bg-gray-700/50 hover:text-gray-200' : 'hover:bg-gray-100 hover:text-gray-900')
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full text-left`}
              >
                <Home size={18} className="mr-3" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => {setView('clients'); setSelectedClient(null); setMobileMenuOpen(false);}} 
                className={`flex cursor-pointer items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  view === 'clients' 
                    ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                    : (darkMode ? 'hover:bg-gray-700/50 hover:text-gray-200' : 'hover:bg-gray-100 hover:text-gray-900')
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full text-left`}
              >
                <User size={18} className="mr-3" />
                <span>Clients</span>
              </button>
              <button 
                onClick={() => {setView('analytics'); setMobileMenuOpen(false);}}
                className={`flex cursor-pointer items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  view === 'analytics' 
                    ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                    : (darkMode ? 'hover:bg-gray-700/50 hover:text-gray-200' : 'hover:bg-gray-100 hover:text-gray-900')
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full text-left`}
              >
                <LineChart size={18} className="mr-3" />
                <span>Analytics</span>
              </button>
              <button 
                onClick={() => {setView('schedule'); setMobileMenuOpen(false);}}
                className={`flex cursor-pointer items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  view === 'schedule' 
                    ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600') 
                    : (darkMode ? 'hover:bg-gray-700/50 hover:text-gray-200' : 'hover:bg-gray-100 hover:text-gray-900')
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full text-left`}
              >
                <Calendar size={18} className="mr-3" />
                <span>Schedule</span>
              </button>
            </div>
          </nav>
        </div>
      )}
      
      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-poppins">Dashboard</h2>
              <div className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Clients</p>
                <p className="text-2xl font-bold mt-1">{clients.length}</p>
                <div className={`h-1 w-full mt-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Workouts</p>
                <p className="text-2xl font-bold mt-1">
                  {clients.reduce((sum, client) => sum + client.workouts.filter(w => !w.completed).length, 0)}
                </p>
                <div className={`h-1 w-full mt-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {(() => {
                    const totalWorkouts = clients.reduce((sum, client) => sum + client.workouts.length, 0);
                    const completedWorkouts = clients.reduce((sum, client) => sum + client.workouts.filter(w => w.completed).length, 0);
                    return totalWorkouts > 0 ? `${Math.round((completedWorkouts / totalWorkouts) * 100)}%` : '0%';
                  })()}
                </p>
                <div className={`h-1 w-full mt-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-orange-500 rounded-full" style={{ 
                    width: `${(() => {
                      const totalWorkouts = clients.reduce((sum, client) => sum + client.workouts.length, 0);
                      const completedWorkouts = clients.reduce((sum, client) => sum + client.workouts.filter(w => w.completed).length, 0);
                      return totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
                    })()}%` 
                  }}></div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Recent Workouts</h3>
              <div className="space-y-3">
                {(() => {
                  const allWorkouts = clients.flatMap(client => 
                    client.workouts.map(workout => ({
                      ...workout,
                      clientName: client.name,
                      clientId: client.id
                    }))
                  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
                  
                  return allWorkouts.length > 0 ? allWorkouts.map((workout, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-10 rounded-full ${workout.completed ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {workout.clientName} • {workout.date}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${workout.completed 
                          ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                          : darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {workout.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No workouts available.
                    </p>
                  );
                })()}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Client Highlights</h3>
                <button 
                  onClick={() => setView('clients')}
                  className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className={`text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <th className="pb-2 font-medium">Client</th>
                      <th className="pb-2 font-medium">Goal</th>
                      <th className="pb-2 font-medium">Workouts</th>
                      <th className="pb-2 font-medium">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr 
                        key={client.id} 
                        className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t cursor-pointer hover:bg-opacity-50 ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        } transition-colors duration-200`}
                        onClick={() => handleSelectClient(client)}
                      >
                        <td className="py-3 font-medium text-blue-500 hover:text-blue-600">{client.name}</td>
                        <td className="py-3">{client.goal}</td>
                        <td className="py-3">{client.workouts.length} ({client.workouts.filter(w => w.completed).length} completed)</td>
                        <td className="py-3">
                          {client.progress.length > 0 ? (
                            <div className="flex items-center space-x-1">
                              <span>{client.progress[client.progress.length - 1].weight} kg</span>
                              {client.progress.length > 1 && (
                                <span className={
                                  client.progress[client.progress.length - 1].weight < client.progress[0].weight 
                                    ? 'text-green-500' 
                                    : client.progress[client.progress.length - 1].weight > client.progress[0].weight
                                      ? 'text-red-500'
                                      : ''
                                }>
                                  {client.progress[client.progress.length - 1].weight < client.progress[0].weight ? '↓' : 
                                   client.progress[client.progress.length - 1].weight > client.progress[0].weight ? '↑' : '−'}
                                </span>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {view === 'clients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Clients</h2>
              <button 
                onClick={() => setIsAddingClient(true)}
                className={`p-2 cursor-pointer rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {clients.map(client => (
                <div 
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  className={`p-4 rounded-lg shadow cursor-pointer ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <h3 className="text-lg font-medium">{client.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age: {client.age}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal: {client.goal}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>{client.workouts.length} workouts</span>
                    <span>{client.workouts.filter(w => w.completed).length} completed</span>
                  </div>
                </div>
              ))}
            </div>
            
            {isAddingClient && (
              <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
                <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="text-lg font-semibold mb-4">Add New Client</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                      <input
                        type="text"
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                        className={`w-full px-3 py-2 rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Age</label>
                      <input
                        type="number"
                        value={newClient.age}
                        onChange={(e) => setNewClient({...newClient, age: parseInt(e.target.value)})}
                        className={`w-full px-3 py-2 rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Goal</label>
                      <input
                        type="text"
                        value={newClient.goal}
                        onChange={(e) => setNewClient({...newClient, goal: e.target.value})}
                        className={`w-full px-3 py-2 rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsAddingClient(false)}
                        className={`px-4 py-2 rounded ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddClient}
                        className={`px-4 py-2 rounded ${
                          darkMode 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                        disabled={!newClient.name || !newClient.goal}
                      >
                        Add Client
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {view === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-poppins">Analytics Dashboard</h2>
            
            <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Workout Completion Rate</h4>
                  <div className="relative h-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold">
                          {(() => {
                            const totalWorkouts = clients.reduce((sum, client) => sum + client.workouts.length, 0);
                            const completedWorkouts = clients.reduce((sum, client) => sum + client.workouts.filter(w => w.completed).length, 0);
                            return totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
                          })()}%
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completion Rate</p>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        strokeWidth="10"
                        stroke={darkMode ? '#374151' : '#E5E7EB'}
                      />
                      <circle 
                        cx="50" cy="50" r="40"
                        fill="none"
                        strokeWidth="10"
                        stroke={darkMode ? '#3B82F6' : '#2563EB'}
                        strokeDasharray="251.2"
                        strokeDashoffset={(() => {
                          const totalWorkouts = clients.reduce((sum, client) => sum + client.workouts.length, 0);
                          const completedWorkouts = clients.reduce((sum, client) => sum + client.workouts.filter(w => w.completed).length, 0);
                          const percentage = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) : 0;
                          return 251.2 * (1 - percentage);
                        })()}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Weight Progress Trends</h4>
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute bottom-0 inset-x-0 h-full flex items-end">
                      {clients.map((client, clientIndex) => {
                        if (client.progress.length < 2) return null;
                        
                        const weightDiff = client.progress[client.progress.length - 1].weight - client.progress[0].weight;
                        const isLoss = weightDiff < 0;
                        const percentage = Math.min(Math.abs(weightDiff) / client.progress[0].weight * 100, 20);
                        const barHeight = `${percentage * 5}%`;
                        
                        return (
                          <div key={client.id} className="flex flex-col items-center mx-2" style={{width: `${80 / clients.length}%`}}>
                            <div 
                              className={`w-full ${isLoss ? 'bg-green-500' : 'bg-red-500'} rounded-t`} 
                              style={{height: barHeight}}
                            ></div>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate w-full text-center`}>
                              {client.name.split(' ')[0]}
                            </p>
                            <p className={`text-xs ${isLoss ? 'text-green-500' : 'text-red-500'}`}>
                              {isLoss ? '↓' : '↑'}{Math.abs(weightDiff).toFixed(1)}kg
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Workout Distribution</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm">
                      <th className="pb-3 font-medium">Muscle Group</th>
                      <th className="pb-3 font-medium">Frequency</th>
                      <th className="pb-3 font-medium">Average Volume</th>
                      <th className="pb-3 font-medium">Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const muscleGroups: Record<string, {count: number, volume: number}> = {};
                      
                      clients.forEach(client => {
                        client.workouts.forEach(workout => {
                          workout.exercises.forEach(exercise => {
                            const muscle = getMuscleGroup(exercise.name);
                            if (!muscleGroups[muscle]) {
                              muscleGroups[muscle] = {count: 0, volume: 0};
                            }
                            muscleGroups[muscle].count += 1;
                            muscleGroups[muscle].volume += exercise.sets * exercise.reps * (exercise.weight || 5);
                          });
                        });
                      });
                      
                      const totalCount = Object.values(muscleGroups).reduce((sum, {count}) => sum + count, 0);
                      
                      return Object.entries(muscleGroups)
                        .sort((a, b) => b[1].count - a[1].count)
                        .map(([muscle, {count, volume}]) => {
                          const percentage = Math.round((count / totalCount) * 100);
                          const avgVolume = Math.round(volume / count);
                          
                          return (
                            <tr key={muscle} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                              <td className="py-3">{muscle}</td>
                              <td className="py-3">{count}x</td>
                              <td className="py-3">{avgVolume} kg</td>
                              <td className="py-3 w-1/3">
                                <div className="flex items-center">
                                  <div className={`h-2 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`} style={{width: `${percentage}%`}}></div>
                                  <span className="ml-2 text-xs">{percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Client Progress Summary</h3>
                <button 
                  onClick={() => setView('clients')}
                  className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  Manage Clients
                </button>
              </div>
              
              <div className="space-y-4">
                {clients.map(client => {
                  let weightChange = 0;
                  let bodyFatChange = 0;
                  
                  if (client.progress.length >= 2) {
                    const first = client.progress[0];
                    const last = client.progress[client.progress.length - 1];
                    weightChange = last.weight - first.weight;
                    
                    if (first.bodyFat !== undefined && last.bodyFat !== undefined) {
                      bodyFatChange = last.bodyFat - first.bodyFat;
                    }
                  }
                  
                  return (
                    <div 
                      key={client.id}
                      className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                      onClick={() => handleSelectClient(client)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{client.name}</h4>
                        <span className={`text-sm ${client.workouts.filter(w => w.completed).length > 0 ? darkMode ? 'text-green-400' : 'text-green-600' : darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          {client.workouts.filter(w => w.completed).length}/{client.workouts.length} workouts completed
                        </span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight Change</p>
                          <p className={`${weightChange < 0 ? 'text-green-500' : weightChange > 0 ? 'text-red-500' : ''}`}>
                            {weightChange === 0 ? 'No change' : `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Body Fat Change</p>
                          <p className={`${bodyFatChange < 0 ? 'text-green-500' : bodyFatChange > 0 ? 'text-red-500' : ''}`}>
                            {bodyFatChange === 0 ? 'No change' : `${bodyFatChange > 0 ? '+' : ''}${bodyFatChange.toFixed(1)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {view === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold font-poppins">Training Schedule</h2>
            
            <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">May 2025</h3>
                <div className="flex space-x-2">
                  <button className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                    <ChevronDown size={16} />
                  </button>
                  <button className={`p-1.5 cursor-pointer rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={i} className="p-2 text-center text-sm font-medium">
                    {day}
                  </div>
                ))}
                
                {Array(3).fill(0).map((_, i) => (
                  <div key={`empty-${i}`} className="p-3 min-h-[80px]"></div>
                ))}
                
                {Array(31).fill(0).map((_, i) => {
                  const day = i + 1;
                  const date = `2025-05-${day.toString().padStart(2, '0')}`;
                  const workouts = clients.flatMap(client => 
                    client.workouts
                      .filter(w => w.date === date)
                      .map(w => ({ ...w, clientName: client.name }))
                  );
                  
                  return (
                    <div 
                      key={`day-${day}`}
                      className={`p-1 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} min-h-[80px] relative ${
                        day === 18 ? (darkMode ? 'bg-blue-900/20' : 'bg-blue-100') : ''
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${day === 18 ? (darkMode ? 'text-blue-400' : 'text-blue-700') : ''}`}>
                          {day}
                        </span>
                        {day === 18 && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/20 text-blue-800'}`}>
                            Today
                          </span>
                        )}
                      </div>
                      
                      {workouts.length > 0 && (
                        <div className="space-y-1">
                          {workouts.slice(0, 2).map((workout, i) => (
                            <div 
                              key={i}
                              className={`text-xs p-1 rounded truncate ${workout.completed 
                                ? (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800')
                                : (darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800')
                              }`}
                            >
                              {workout.name}
                            </div>
                          ))}
                          {workouts.length > 2 && (
                            <div className="text-xs text-center text-gray-500">+{workouts.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className={`p-5 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Upcoming Sessions</h3>
              
              <div className="space-y-3">
                {(() => {
                  const today = new Date();
                  const todayString = today.toISOString().split('T')[0];
                  
                  const upcomingWorkouts = clients.flatMap(client => 
                    client.workouts
                      .filter(w => w.date >= todayString && !w.completed)
                      .map(w => ({ ...w, clientName: client.name, clientId: client.id }))
                  )
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5);
                  
                  return upcomingWorkouts.length > 0 ? (
                    upcomingWorkouts.map((workout, i) => (
                      <div 
                        key={i}
                        className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}
                        onClick={() => {
                          const client = clients.find(c => c.id === workout.clientId);
                          if (client) {
                            setSelectedClient(client);
                            setSelectedWorkout(workout);
                            setView('workout-detail');
                          }
                        }}
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                            <p className="font-medium">{workout.name}</p>
                          </div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {workout.clientName} • {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">
                          {workout.exercises.length} exercises
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No upcoming sessions scheduled.
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
        
        {view === 'workouts' && selectedClient && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {setView('clients'); setSelectedClient(null);}}
                  className={`p-2 cursor-pointer rounded-full ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-xl font-semibold">{selectedClient.name}'s Dashboard</h2>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setView('progress')}
                  className={`p-2 cursor-pointer rounded ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  } flex items-center space-x-1`}
                >
                  <TrendingUp size={16} />
                  <span className="hidden sm:inline">Progress</span>
                </button>
                <button 
                  onClick={() => setIsAddingWorkout(true)}
                  className={`p-2 cursor-pointer rounded ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white flex items-center space-x-1`}
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Workout</span>
                </button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age</p>
                  <p className="font-medium">{selectedClient.age} years</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal</p>
                  <p className="font-medium">{selectedClient.goal}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</p>
                  <p className="font-medium">
                    {selectedClient.workouts.length > 0 
                      ? `${Math.round((selectedClient.workouts.filter(w => w.completed).length / selectedClient.workouts.length) * 100)}%` 
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Workouts</h3>
              {selectedClient.workouts.length === 0 && (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No workouts yet. Create your first workout!
                </p>
              )}
              <div className="space-y-3">
                {selectedClient.workouts.map(workout => (
                  <div 
                    key={workout.id}
                    className={`p-4 rounded-lg shadow ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleWorkoutCompletion(workout.id)}
                          className={`p-1 rounded-full ${
                            workout.completed 
                              ? darkMode ? 'bg-green-600' : 'bg-green-500'
                              : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}
                        >
                          {workout.completed ? <Check size={16} className="text-white" /> : <Clock size={16} />}
                        </button>
                        <div>
                          <h4 
                            className="font-medium cursor-pointer"
                            onClick={() => handleSelectWorkout(workout)}
                          >
                            {workout.name}
                          </h4>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {workout.date} • {workout.exercises.length} exercises
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className={`p-1 cursor-pointer rounded-full ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                      >
                        <Trash2 size={16} className={darkMode ? 'text-red-400' : 'text-red-500'} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isAddingWorkout && (
              <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
                <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="text-lg font-semibold mb-4">Add New Workout</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={newWorkout.name}
                        onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                        className={`w-full px-3 py-2 rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                        placeholder="e.g., Leg Day"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={newWorkout.date}
                        onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                        className={`w-full px-3 py-2 rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsAddingWorkout(false)}
                        className={`px-4 py-2 rounded ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddWorkout}
                        className={`px-4 py-2 rounded ${
                          darkMode 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                        disabled={!newWorkout.name}
                      >
                        Add Workout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {view === 'progress' && selectedClient && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setView('workouts')}
                  className={`p-2 cursor-pointer rounded-full ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-xl font-semibold">{selectedClient.name}'s Progress</h2>
              </div>
              <button 
                onClick={() => setIsAddingProgress(true)}
                className={`p-2 cursor-pointer rounded ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white flex items-center space-x-1`}
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Progress</span>
              </button>
            </div>
            
            {selectedClient.progress.length >= 2 && (
              <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {(() => {
                  const progress = calculateProgress();
                  if (!progress) return null;
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Weight Change</p>
                        <div className="flex items-baseline mt-1 space-x-2">
                          <p className={`text-xl font-bold ${progress.weightDiff < 0 ? 'text-green-500' : progress.weightDiff > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {progress.weightDiff > 0 ? '+' : ''}{progress.weightDiff.toFixed(1)} kg
                          </p>
                          <p className={`text-sm ${progress.weightDiff < 0 ? 'text-green-400' : progress.weightDiff > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            ({progress.weightPercent > 0 ? '+' : ''}{progress.weightPercent.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                      
                      {progress.bodyFatDiff !== 0 && (
                        <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Body Fat Change</p>
                          <div className="flex items-baseline mt-1 space-x-2">
                            <p className={`text-xl font-bold ${progress.bodyFatDiff < 0 ? 'text-green-500' : progress.bodyFatDiff > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                              {progress.bodyFatDiff > 0 ? '+' : ''}{progress.bodyFatDiff.toFixed(1)}%
                            </p>
                            <p className={`text-sm ${progress.bodyFatDiff < 0 ? 'text-green-400' : progress.bodyFatDiff > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                              ({progress.bodyFatPercent > 0 ? '+' : ''}{progress.bodyFatPercent.toFixed(1)}%)
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tracking Period</p>
                        <div className="flex items-baseline mt-1">
                          <p className="text-xl font-bold">{progress.daysDiff} days</p>
                          <p className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ({Math.floor(progress.daysDiff/7)} weeks)
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Progress History</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Weight</span>
                  </div>
                  {selectedClient.progress.some(p => p.bodyFat !== undefined) && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Body Fat</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedClient.progress.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp size={48} className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-3`} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-xs`}>
                    No progress data recorded yet. Add your first entry to start tracking progress.
                  </p>
                  <button 
                    onClick={() => setIsAddingProgress(true)}
                    className={`mt-4 cursor-pointer px-4 py-2 rounded ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white text-sm flex items-center`}
                  >
                    <Plus size={16} className="mr-1" />
                    Add First Progress Entry
                  </button>
                </div>
              ) : (
                <>
                  <div className="h-72 mb-10">
                    <div className="relative h-full w-full">
                      <div className="absolute -left-10 top-1/2 -rotate-90 transform whitespace-nowrap text-xs opacity-70">
                        Weight (kg) / Body Fat (%)
                      </div>
                      
                      {[0, 20, 40, 60, 80, 100].map((percent) => {
                        const maxWeight = Math.max(...selectedClient.progress.map(p => p.weight));
                        const minWeight = Math.min(...selectedClient.progress.map(p => p.weight)) * 0.95;
                        const range = maxWeight - minWeight || 1;
                        const weightValue = minWeight + (range * (100 - percent) / 100);
                        
                        return (
                          <div 
                            key={percent} 
                            className={`absolute w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} 
                            style={{ bottom: `${percent}%` }}
                          >
                            <span className="absolute -top-2 -left-8 text-right w-6">
                              {weightValue.toFixed(1)}
                            </span>
                          </div>
                        );
                      })}
                      
                      <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={darkMode ? '#3B82F650' : '#2563EB20'} />
                            <stop offset="100%" stopColor={darkMode ? '#3B82F600' : '#2563EB00'} />
                          </linearGradient>
                        </defs>
                        
                        <path
                          d={(() => {
                            if (selectedClient.progress.length === 0) return '';
                            if (selectedClient.progress.length === 1) {
                              const p = selectedClient.progress[0];
                              const y = 100 - ((p.weight - p.weight * 0.95) / (p.weight * 0.05)) * 100;
                              return `M50,${y} L50,100 L50,100 Z`;
                            }
                            
                            const points = selectedClient.progress.map((p, i, arr) => {
                              const maxWeight = Math.max(...arr.map(p => p.weight));
                              const minWeight = Math.min(...arr.map(p => p.weight)) * 0.95;
                              const range = maxWeight - minWeight || 1;
                              const x = (i / (arr.length - 1)) * 100;
                              const y = 100 - ((p.weight - minWeight) / range) * 100;
                              return [x, y];
                            });
                            
                            let path = `M${points[0][0]},${points[0][1]} `;
                            path += points.slice(1).map(([x, y]) => `L${x},${y}`).join(' ');
                            path += ` L100,100 L0,100 Z`;
                            return path;
                          })()}
                          fill="url(#weightGradient)"
                          strokeLinejoin="round"
                        />
                        
                        <path
                          d={(() => {
                            if (selectedClient.progress.length === 0) return '';
                            if (selectedClient.progress.length === 1) {
                              const p = selectedClient.progress[0];
                              const y = 100 - ((p.weight - p.weight * 0.95) / (p.weight * 0.05)) * 100;
                              return `M50,${y}`;
                            }
                            
                            const points = selectedClient.progress.map((p, i, arr) => {
                              const maxWeight = Math.max(...arr.map(p => p.weight));
                              const minWeight = Math.min(...arr.map(p => p.weight)) * 0.95;
                              const range = maxWeight - minWeight || 1;
                              const x = (i / (arr.length - 1)) * 100;
                              const y = 100 - ((p.weight - minWeight) / range) * 100;
                              return [x, y];
                            });
                            
                            return `M${points[0][0]},${points[0][1]} ${points.slice(1).map(([x, y]) => `L${x},${y}`).join(' ')}`;
                          })()}
                          fill="none"
                          stroke={darkMode ? '#3B82F6' : '#2563EB'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-sm"
                        />
                        
                        {selectedClient.progress.map((p, i, arr) => {
                          const maxWeight = Math.max(...arr.map(p => p.weight));
                          const minWeight = Math.min(...arr.map(p => p.weight)) * 0.95;
                          const range = maxWeight - minWeight || 1;
                          const x = (i / (arr.length - 1)) * 100;
                          const y = 100 - ((p.weight - minWeight) / range) * 100;
                          
                          return (
                            <g key={`weight-${i}`} className="group cursor-pointer">
                              <circle
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="8"
                                fill="transparent"
                                className="cursor-pointer"
                              />
                              
                              <circle
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="4"
                                fill={darkMode ? '#3B82F6' : '#2563EB'}
                                stroke={darkMode ? '#1E3A8A' : '#DBEAFE'}
                                strokeWidth="2"
                                className="transition-all duration-200 group-hover:r-5"
                              />
                              
                              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <rect 
                                  x={`${x}%`} 
                                  y={`${y - 12}%`} 
                                  width="80" 
                                  height="35" 
                                  fill={darkMode ? '#1E293B' : '#F8FAFC'} 
                                  stroke={darkMode ? '#475569' : '#E2E8F0'}
                                  rx="4"
                                  ry="4"
                                  transform="translate(-40, -45)"
                                  className="drop-shadow-md"
                                />
                                <text 
                                  x={`${x}%`} 
                                  y={`${y - 12}%`}
                                  transform="translate(-40, -35)"
                                  className={`text-xs ${darkMode ? 'fill-white' : 'fill-gray-800'}`}
                                >
                                  <tspan x={`${x}%`} dy="0">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</tspan>
                                  <tspan x={`${x}%`} dy="14" fontWeight="bold">{p.weight.toFixed(1)} kg</tspan>
                                </text>
                              </g>
                            </g>
                          );
                        })}
                        
                        {selectedClient.progress.some(p => p.bodyFat !== undefined) && (
                          <>
                            <path
                              d={(() => {
                                const validEntries = selectedClient.progress.filter(p => p.bodyFat !== undefined);
                                if (validEntries.length === 0) return '';
                                if (validEntries.length === 1) {
                                  const p = validEntries[0];
                                  const y = 100 - ((p.bodyFat! - p.bodyFat! * 0.9) / (p.bodyFat! * 0.1)) * 100;
                                  return `M50,${y}`;
                                }
                                
                                const sortedEntries = [...validEntries].sort((a, b) => 
                                  new Date(a.date).getTime() - new Date(b.date).getTime()
                                );
                                
                                const points = sortedEntries.map((p, idx, arr) => {
                                  const maxBodyFat = Math.max(...validEntries.map(p => p.bodyFat!));
                                  const minBodyFat = Math.min(...validEntries.map(p => p.bodyFat!)) * 0.9;
                                  const range = maxBodyFat - minBodyFat || 1;
                                  
                                  const originalIndex = selectedClient.progress.findIndex(entry => entry.date === p.date);
                                  const totalEntries = selectedClient.progress.length;
                                  const x = totalEntries > 1 ? (originalIndex / (totalEntries - 1)) * 100 : 50;
                                  const y = 100 - ((p.bodyFat! - minBodyFat) / range) * 100;
                                  return [x, y];
                                });
                                
                                if (points.length === 0) return '';
                                return `M${points[0][0]},${points[0][1]} ${points.slice(1).map(([x, y]) => `L${x},${y}`).join(' ')}`;
                              })()}
                              fill="none"
                              stroke={darkMode ? '#10B981' : '#059669'}
                              strokeWidth="2"
                              strokeDasharray="3,3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {selectedClient.progress
                              .filter(p => p.bodyFat !== undefined)
                              .map((p, i) => {
                                const validBodyFatEntries = selectedClient.progress.filter(p => p.bodyFat !== undefined);
                                const maxBodyFat = Math.max(...validBodyFatEntries.map(p => p.bodyFat!));
                                const minBodyFat = Math.min(...validBodyFatEntries.map(p => p.bodyFat!)) * 0.9;
                                const range = maxBodyFat - minBodyFat || 1; 
                                
                                const originalIndex = selectedClient.progress.findIndex(entry => entry.date === p.date);
                                const totalEntries = selectedClient.progress.length;
                                const x = (originalIndex / (totalEntries - 1)) * 100;
                                const y = 100 - ((p.bodyFat! - minBodyFat) / range) * 100;
                                
                                return (
                                  <g key={`fat-${i}`} className="group cursor-pointer">
                                    <circle
                                      cx={`${x}%`}
                                      cy={`${y}%`}
                                      r="8"
                                      fill="transparent"
                                    />
                                    
                                    <circle
                                      cx={`${x}%`}
                                      cy={`${y}%`}
                                      r="3.5"
                                      fill={darkMode ? '#10B981' : '#059669'}
                                      stroke={darkMode ? '#064E3B' : '#D1FAE5'}
                                      strokeWidth="2"
                                      className="transition-all duration-200 group-hover:r-4.5"
                                    />
                                    
                                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <rect 
                                        x={`${x}%`} 
                                        y={`${y - 12}%`} 
                                        width="80" 
                                        height="35" 
                                        fill={darkMode ? '#1E293B' : '#F8FAFC'} 
                                        stroke={darkMode ? '#475569' : '#E2E8F0'}
                                        rx="4"
                                        ry="4"
                                        transform="translate(-40, -45)"
                                        className="drop-shadow-md"
                                      />
                                      <text 
                                        x={`${x}%`} 
                                        y={`${y - 12}%`}
                                        transform="translate(-40, -35)"
                                        className={`text-xs ${darkMode ? 'fill-white' : 'fill-gray-800'}`}
                                      >
                                        <tspan x={`${x}%`} dy="0">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</tspan>
                                        <tspan x={`${x}%`} dy="14" fontWeight="bold">{p.bodyFat}% body fat</tspan>
                                      </text>
                                    </g>
                                  </g>
                                );
                              })
                            }
                          </>
                        )}
                      </svg>
                      
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between border-t pt-2 mt-2 border-gray-200 dark:border-gray-700">
                        {selectedClient.progress.map((p, i) => {
                          if (selectedClient.progress.length > 6 && 
                             i !== 0 && i !== selectedClient.progress.length-1 && 
                             i % Math.ceil(selectedClient.progress.length / 5) !== 0) {
                             return null;
                          }
                          
                          return (
                            <div key={i} className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                              {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} flex flex-col`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Starting Weight</span>
                        <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {new Date(selectedClient.progress[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-2xl font-bold mt-2 flex items-end">
                        {selectedClient.progress[0].weight} 
                        <span className="ml-1 text-sm font-normal opacity-70">kg</span>
                      </div>
                      {selectedClient.progress[0].bodyFat !== undefined && (
                        <div className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Body fat: {selectedClient.progress[0].bodyFat}%
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} flex flex-col`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Weight</span>
                        <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {new Date(selectedClient.progress[selectedClient.progress.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-2xl font-bold mt-2 flex items-end">
                        {selectedClient.progress[selectedClient.progress.length - 1].weight}
                        <span className="ml-1 text-sm font-normal opacity-70">kg</span>
                      </div>
                      {selectedClient.progress[selectedClient.progress.length - 1].bodyFat !== undefined && (
                        <div className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Body fat: {selectedClient.progress[selectedClient.progress.length - 1].bodyFat}%
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} flex flex-col`}>
                      {(() => {
                        const first = selectedClient.progress[0];
                        const last = selectedClient.progress[selectedClient.progress.length - 1];
                        const diff = last.weight - first.weight;
                        const diffPercent = (diff / first.weight) * 100;
                        const diffColor = diff < 0 
                          ? darkMode ? 'text-green-400' : 'text-green-600' 
                          : diff > 0 
                            ? darkMode ? 'text-red-400' : 'text-red-500' 
                            : 'text-gray-500';
                        
                        return (
                          <>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Change</span>
                              <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                {selectedClient.progress.length} entries
                              </span>
                            </div>
                            <div className={`text-2xl font-bold mt-2 flex items-end ${diffColor}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                              <span className="ml-1 text-sm font-normal opacity-90">kg</span>
                              <span className={`ml-2 text-sm ${diffColor} opacity-80`}>
                                ({diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%)
                              </span>
                            </div>
                            
                            <div className="mt-auto pt-2">
                              <div className="flex items-center">
                                {diff < 0 ? (
                                  <ArrowDown size={16} className="text-green-500 mr-1" />
                                ) : diff > 0 ? (
                                  <ArrowUp size={16} className="text-red-500 mr-1" />
                                ) : (
                                  <Minus size={16} className="text-gray-500 mr-1" />
                                )}
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {Math.abs(diff) > 0 
                                    ? `${Math.abs(diff).toFixed(1)} kg ${diff < 0 ? 'lost' : 'gained'}`
                                    : 'No change'}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  <div className={`overflow-x-auto rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <table className="w-full">
                      <thead className={`text-left ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                        <tr className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <th className="p-3 font-medium text-sm">Date</th>
                          <th className="p-3 font-medium text-sm">Weight (kg)</th>
                          <th className="p-3 font-medium text-sm">Body Fat (%)</th>
                          <th className="p-3 font-medium text-sm">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClient.progress.map((p, i) => {
                          const prevEntry = i > 0 ? selectedClient.progress[i-1] : null;
                          const weightChange = prevEntry ? p.weight - prevEntry.weight : 0;
                          const fatChange = prevEntry && prevEntry.bodyFat !== undefined && p.bodyFat !== undefined 
                            ? p.bodyFat - prevEntry.bodyFat 
                            : null;
                          
                          return (
                            <tr 
                              key={i} 
                              className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                              <td className="p-3">
                                {new Date(p.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </td>
                              <td className="p-3 font-medium">{p.weight}</td>
                              <td className="p-3">{p.bodyFat !== undefined ? p.bodyFat : '-'}</td>
                              <td className="p-3">
                                {i > 0 && (
                                  <div className="flex flex-col">
                                    <span className={`font-medium flex items-center ${
                                      weightChange < 0 
                                        ? 'text-green-500' 
                                        : weightChange > 0 
                                          ? 'text-red-500' 
                                          : 'text-gray-500'
                                    }`}>
                                      {weightChange < 0 ? (
                                        <ArrowDownRight size={14} className="mr-1" />
                                      ) : weightChange > 0 ? (
                                        <ArrowUpRight size={14} className="mr-1" />
                                      ) : (
                                        <Minus size={14} className="mr-1" />
                                      )}
                                      {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                                    </span>
                                    {fatChange !== null && (
                                      <span className={`text-xs mt-1 flex items-center ${
                                        fatChange < 0 
                                          ? 'text-green-500' 
                                          : fatChange > 0 
                                            ? 'text-red-500' 
                                            : 'text-gray-500'
                                      }`}>
                                        {fatChange < 0 ? (
                                          <ArrowDownRight size={12} className="mr-1" />
                                        ) : fatChange > 0 ? (
                                          <ArrowUpRight size={12} className="mr-1" />
                                        ) : (
                                          <Minus size={12} className="mr-1" />
                                        )}
                                        {fatChange > 0 ? '+' : ''}{fatChange.toFixed(1)}% bf
                                      </span>
                                    )}
                                  </div>
                                )}
                                {i === 0 && (
                                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    Initial
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            
            {isAddingProgress && (
              <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4`}>
                <div 
                  className={`p-6 rounded-lg shadow-xl max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  style={{ maxHeight: '90vh', overflowY: 'auto' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg cursor-pointer font-semibold">Add Progress Data</h3>
                    <button 
                      onClick={() => setIsAddingProgress(false)}
                      className={`p-1 cursor-pointer rounded-full hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={newProgress.date}
                        onChange={(e) => setNewProgress({...newProgress, date: e.target.value})}
                        className={`w-full px-3 py-2.5 rounded-md border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 focus:border-blue-400'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Select the date of this progress record
                      </p>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={newProgress.weight === undefined ? '' : newProgress.weight}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                            setNewProgress({...newProgress, weight: value === undefined || isNaN(value) ? undefined : value});
                          }}
                          placeholder="Enter weight"
                          className={`w-full px-3 py-2.5 rounded-md border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-400'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        />
                        <span className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          kg
                        </span>
                      </div>
                      
                      {selectedClient && selectedClient.progress.length > 0 && (
                        <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last recorded: {selectedClient.progress[selectedClient.progress.length-1].weight} kg
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span>Body Fat % (optional)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="50"
                          value={newProgress.bodyFat === undefined ? '' : newProgress.bodyFat}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                            setNewProgress({...newProgress, bodyFat: value === undefined || isNaN(value) ? undefined : value});
                          }}
                          placeholder="Enter body fat percentage"
                          className={`w-full px-3 py-2.5 rounded-md border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'bg-white border-gray-300 focus:border-blue-400'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        />
                        <span className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          %
                        </span>
                      </div>
                      
                      {selectedClient && 
                       selectedClient.progress.length > 0 && 
                       selectedClient.progress[selectedClient.progress.length-1].bodyFat !== undefined && (
                        <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last recorded: {selectedClient.progress[selectedClient.progress.length-1].bodyFat}%
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-3">
                      <button
                        onClick={() => setIsAddingProgress(false)}
                        className={`px-4 py-2 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        } transition-colors`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddProgress}
                        className={`px-4 py-2 cursor-pointer rounded-md flex items-center ${
                          (!newProgress.date || newProgress.weight === undefined) 
                            ? `opacity-50 cursor-not-allowed ${darkMode ? 'bg-blue-800' : 'bg-blue-400'}`
                            : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`
                        } text-white transition-colors`}
                        disabled={!newProgress.date || newProgress.weight === undefined}
                      >
                        <Save size={16} className="mr-1.5" />
                        Save Progress
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {view === 'workout-detail' && selectedWorkout && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {setView('workouts'); setSelectedWorkout(null);}}
                  className={`p-2 cursor-pointer rounded-full ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-xl font-semibold">{selectedWorkout.name}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedWorkout.date}
                </span>
                <button
                  onClick={() => toggleWorkoutCompletion(selectedWorkout.id)}
                  className={`p-1 rounded-full ${
                    selectedWorkout.completed 
                      ? darkMode ? 'bg-green-600' : 'bg-green-500'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  {selectedWorkout.completed ? <Check size={16} className="text-white" /> : <Clock size={16} />}
                </button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Exercises</h3>
                <button 
                  onClick={() => setIsAddingExercise(true)}
                  className={`p-2 cursor-pointer rounded ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              {selectedWorkout.exercises.length === 0 ? (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No exercises added yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedWorkout.exercises.map(exercise => (
                    <div 
                      key={exercise.id}
                      className={`p-3 cursor-pointer rounded ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      } flex justify-between items-center`}
                    >
                      {editingExerciseId === exercise.id ? (
                        <div className="w-full grid grid-cols-6 gap-2">
                          <input
                            className={`col-span-2 px-2 py-1 rounded border ${
                              darkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-300'
                            } text-sm`}
                            value={editedExercise?.name}
                            onChange={(e) => setEditedExercise({...editedExercise!, name: e.target.value})}
                          />
                          <input
                            type="number"
                            className={`col-span-1 px-2 py-1 rounded border ${
                              darkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-300'
                            } text-sm`}
                            value={editedExercise?.sets === undefined ? '' : editedExercise?.sets}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                              setEditedExercise({...editedExercise!, sets: value === undefined || isNaN(value) ? 1 : value});
                            }}
                          />
                          <input
                            type="number"
                            className={`col-span-1 px-2 py-1 rounded border ${
                              darkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-300'
                            } text-sm`}
                            value={editedExercise?.reps === undefined ? '' : editedExercise?.reps}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                              setEditedExercise({...editedExercise!, reps: value === undefined || isNaN(value) ? 1 : value});
                            }}
                          />
                          <input
                            type="number"
                            className={`col-span-1 px-2 py-1 rounded border ${
                              darkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-300'
                            } text-sm`}
                            value={editedExercise?.weight === undefined ? '' : editedExercise?.weight}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                              setEditedExercise({...editedExercise!, weight: value === undefined || isNaN(value) ? 0 : value});
                            }}
                          />
                          <button
                            onClick={saveEditedExercise}
                            className={`col-span-1 cursor-pointer p-1 rounded ${
                              darkMode ? 'bg-green-600' : 'bg-green-500'
                            } text-white flex justify-center`}
                          >
                            <Save size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {exercise.sets} sets × {exercise.reps} reps {exercise.weight > 0 ? `× ${exercise.weight} kg` : ''}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditExercise(exercise)}
                              className={`p-1 cursor-pointer rounded-full ${
                                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                              }`}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteExercise(exercise.id)}
                              className={`p-1 cursor-pointer rounded-full ${
                                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                              }`}
                            >
                              <Trash2 size={16} className={darkMode ? 'text-red-400' : 'text-red-500'} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedWorkout.exercises.length > 0 && (
              <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-lg font-medium mb-4">Workout Simulation</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Speed:
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.5"
                      value={simulationSpeed}
                      onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {simulationSpeed}x
                    </span>
                    <button
                      onClick={simulateWorkout}
                      disabled={isSimulating}
                      className={`px-4 cursor-pointer py-2 rounded ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </button>
                  </div>
                  
                  {isSimulating && simulationStatus !== 'completed' && (
                    <div className={`p-4 rounded-lg border ${
                      darkMode 
                        ? (simulationStatus === 'exercise' ? 'border-green-600 bg-gray-700' : 'border-blue-600 bg-gray-700')
                        : (simulationStatus === 'exercise' ? 'border-green-500 bg-gray-50' : 'border-blue-500 bg-gray-50')
                    }`}>
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${
                            simulationStatus === 'exercise' 
                              ? (darkMode ? 'text-green-400' : 'text-green-600') 
                              : (darkMode ? 'text-blue-400' : 'text-blue-600')
                          }`}>
                            {simulationStatus === 'exercise' ? 'EXERCISE' : 'REST'}
                          </span>
                          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {timeRemaining}s
                          </div>
                        </div>
                        
                        {selectedWorkout && (
                          <div className="space-y-1">
                            <h4 className="font-medium">
                              {selectedWorkout.exercises[currentExerciseIndex].name}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Set {currentSet} of {selectedWorkout.exercises[currentExerciseIndex].sets}
                              </span>
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>•</span>
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {selectedWorkout.exercises[currentExerciseIndex].reps} reps
                              </span>
                              {selectedWorkout.exercises[currentExerciseIndex].weight > 0 && (
                                <>
                                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>•</span>
                                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {selectedWorkout.exercises[currentExerciseIndex].weight} kg
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-500">
                          Exercise {currentExerciseIndex + 1} of {selectedWorkout.exercises.length}
                        </div>
                        
                        <button
                          onClick={handleSkip}
                          className={`w-full cursor-pointer py-2 rounded mt-2 ${
                            darkMode 
                              ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                        >
                          Skip {simulationStatus === 'exercise' ? 'Exercise' : 'Rest'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {isSimulating && (
                    <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
                        style={{ width: `${simulationProgress}%` }}
                      />
                    </div>
                  )}
                  
                  {simulationResults && (
                    <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {simulationResults}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {isAddingExercise && (
              <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
                <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className="text-lg font-semibold mb-4">Add Exercise</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                        className={`w-full px-3 py-2 rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                        placeholder="e.g., Bench Press"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Sets
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newExercise.sets === undefined ? '' : newExercise.sets}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                            setNewExercise({...newExercise, sets: value === undefined || isNaN(value) ? 1 : value});
                          }}
                          className={`w-full px-3 py-2 rounded border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Reps
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newExercise.reps === undefined ? '' : newExercise.reps}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                            setNewExercise({...newExercise, reps: value === undefined || isNaN(value) ? 1 : value});
                          }}
                          className={`w-full px-3 py-2 rounded border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={newExercise.weight === undefined ? '' : newExercise.weight}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                            setNewExercise({...newExercise, weight: value === undefined || isNaN(value) ? 0 : value});
                          }}
                          className={`w-full px-3 py-2 rounded border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsAddingExercise(false)}
                        className={`px-4 py-2 rounded ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddExercise}
                        className={`px-4 py-2 rounded ${
                          darkMode 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                        disabled={!newExercise.name}
                      >
                        Add Exercise
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className={`px-4 py-6 ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-gray-100'} shadow-inner`}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                <Dumbbell size={16} />
              </div>
              <h3 className="font-bold font-poppins tracking-tight">FitTrack Pro</h3>
            </div>
            <p className="text-sm">Tracking your fitness journey with precision and insight. Stay motivated, stay strong.</p>
          </div>
          
          <div>
            <h4 className="font-medium font-poppins mb-3">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <button 
                onClick={() => setView('dashboard')} 
                className="text-left cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
              >
                Dashboard
              </button>
              <button 
                onClick={() => {setView('clients'); setSelectedClient(null);}} 
                className="text-left cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
              >
                Clients
              </button>
              <button 
                onClick={() => setView('analytics')} 
                className="text-left cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
              >
                Analytics
              </button>
              <button 
                onClick={() => setView('schedule')} 
                className="text-left cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
              >
                Schedule
              </button>
            </nav>
          </div>
          
          <div>
            <h4 className="font-medium font-poppins mb-3">Connect With Us</h4>
            <div className="flex space-x-4 mb-3">
              <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm">Fitness Tracker App © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;