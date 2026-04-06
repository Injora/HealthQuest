// Mock data storage to persist state during session
let mockSystemData = {
  exp: 1450,
  level: "Intermediate",
  tasks: [
    { id: 1, name: "Drink 8 glasses of water", expReward: 50, completed: false },
    { id: 2, name: "Take a 15-minute walk", expReward: 100, completed: false },
    { id: 3, name: "Log daily meals", expReward: 30, completed: false },
    { id: 4, name: "8 hours of sleep", expReward: 150, completed: true }
  ],
  logs: [
    { id: 1, date: "2026-04-06", symptoms: "Headache, Fatigue", predictedCondition: "Dehydration", confidence: 85, remedy: "Drink 500ml water immediately." },
    { id: 2, date: "2026-04-05", symptoms: "Slight fever, Cough", predictedCondition: "Mild Viral Infection", confidence: 92, remedy: "Rest, hydrate, and take Vitamin C." },
    { id: 3, date: "2026-04-02", symptoms: "Stomach ache", predictedCondition: "Indigestion", confidence: 75, remedy: "Avoid heavy meals, drink ginger tea." },
    { id: 4, date: "2026-03-30", symptoms: "Muscle soreness", predictedCondition: "Post-workout DOMS", confidence: 98, remedy: "Light stretching and magnesium supplement." },
    { id: 5, date: "2026-03-25", symptoms: "Dry eyes", predictedCondition: "Digital Eye Strain", confidence: 80, remedy: "20-20-20 rule." }
  ],
  recommendations: [
    { id: 1, category: "Preventive", text: "Your recent logs hint at potential dehydration. Consider setting hourly water reminders." },
    { id: 2, category: "Lifestyle", text: "Maintain a consistent sleep schedule to improve morning energy levels." },
    { id: 3, category: "Health Tip", text: "Adding 10 mins of meditation before bed can reduce stress markers by 15%." }
  ],
  analytics: [
    { name: "Mon", sleep: 7.5, stress: 4, activity: 60 },
    { name: "Tue", sleep: 6.0, stress: 7, activity: 45 },
    { name: "Wed", sleep: 8.0, stress: 3, activity: 90 },
    { name: "Thu", sleep: 7.2, stress: 5, activity: 50 },
    { name: "Fri", sleep: 5.5, stress: 8, activity: 30 },
    { name: "Sat", sleep: 8.5, stress: 2, activity: 120 },
    { name: "Sun", sleep: 9.0, stress: 1, activity: 100 }
  ]
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getUserData(email) {
    await delay(500);
    const completedTasksCount = mockSystemData.tasks.filter(t => t.completed).length;
    const latestCondition = mockSystemData.logs[0]?.predictedCondition || "None";
    return {
      email,
      exp: mockSystemData.exp,
      level: mockSystemData.level,
      completedTasksCount,
      latestCondition
    };
  },

  async getHealthLogs(email) {
    await delay(600);
    return [...mockSystemData.logs];
  },

  async getAiRecommendations(email) {
    await delay(700);
    return [...mockSystemData.recommendations];
  },

  async getTasks(email) {
    await delay(400);
    return [...mockSystemData.tasks];
  },

  async completeTask(email, taskId) {
    await delay(300);
    const taskIndex = mockSystemData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && !mockSystemData.tasks[taskIndex].completed) {
      mockSystemData.tasks[taskIndex].completed = true;
      const reward = mockSystemData.tasks[taskIndex].expReward;
      mockSystemData.exp += reward;
      
      // Level up logic simulation
      if (mockSystemData.exp > 2000) {
        mockSystemData.level = "Pro";
      }

      return {
        success: true,
        expGained: reward,
        newTotalExp: mockSystemData.exp,
        newLevel: mockSystemData.level
      };
    }
    return { success: false, error: "Task not found or already completed." };
  },

  async getAnalytics(email) {
    await delay(800);
    return [...mockSystemData.analytics];
  }
};
