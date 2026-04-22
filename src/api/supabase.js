import { supabase } from '../lib/supabase';

/**
 * Safely parse a JSON string column from Supabase.
 * Handles: null, undefined, empty string, malformed JSON, and already-parsed values.
 */
function parseJsonColumn(value, fallback = []) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value; // already parsed (Supabase sometimes auto-parses JSON columns)
  try {
    const parsed = JSON.parse(value);
    // Ensure we always return an array when fallback is an array
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch (err) {
    console.warn('[api/supabase] Failed to parse JSON column:', err.message, '| Raw value:', value);
    return fallback;
  }
}

/**
 * Convert a potentially complex value (object or string) to a display string.
 * Handles: {name: "..."}, {text: "..."}, plain strings, and arbitrary objects.
 */
function toText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.name || value.text || value.title || value.description || value.reason || JSON.stringify(value);
  }
  return String(value);
}

/**
 * Safely extract a task object from potentially mixed-type task arrays.
 * Tasks could be objects or plain strings from the DB.
 */
function normalizeTask(task, index) {
  if (typeof task === 'string') {
    return {
      id: index + 1,
      name: task,
      expReward: 50,
      completed: false,
    };
  }
  return {
    id: task.id ?? index + 1,
    name: toText(task.name || task.title || task) || 'Unnamed Task',
    expReward: task.expReward ?? 50,
    completed: task.completed ?? false,
  };
}

export const api = {
  /**
   * Get dashboard summary for the logged-in user.
   */
  async getUserData(email) {
    try {
      const { data, error } = await supabase
        .from('health_responses')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[api] getUserData query error:', error.message);
      }

      if (!data) {
        return {
          email,
          exp: 0,
          level: 'Beginner',
          completedTasksCount: 0,
          latestCondition: 'None',
        };
      }

      const conditions = parseJsonColumn(data.conditions, []);
      const tasks = parseJsonColumn(data.tasks, []);
      const normalizedTasks = tasks.map(normalizeTask);
      const completedTasksCount = normalizedTasks.filter((t) => t.completed).length;

      let level = 'Beginner';
      if (completedTasksCount >= 5) level = 'Pro';
      else if (completedTasksCount >= 2) level = 'Intermediate';

      return {
        email: data.email,
        exp: completedTasksCount * 50,
        level,
        completedTasksCount,
        latestCondition: toText(conditions[0]) || data.symptoms || 'None',
      };
    } catch (err) {
      console.error('[api] getUserData unexpected error:', err);
      return {
        email,
        exp: 0,
        level: 'Beginner',
        completedTasksCount: 0,
        latestCondition: 'None',
      };
    }
  },

  /**
   * Get all health log entries for the user.
   */
  async getHealthLogs(email) {
    try {
      const { data, error } = await supabase
        .from('health_responses')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[api] getHealthLogs query error:', error.message);
        return [];
      }
      if (!data || data.length === 0) return [];

      return data.map((row, index) => {
        const conditions = parseJsonColumn(row.conditions, []);
        const tips = parseJsonColumn(row.tips, []);
        return {
          id: row.id ?? index + 1,
          date: row.created_at ? row.created_at.split('T')[0] : 'N/A',
          symptoms: row.symptoms || 'None reported',
          predictedCondition: toText(conditions[0]) || 'Unknown',
          confidence: Math.floor(Math.random() * 20 + 75),
          remedy: toText(tips[0]) || row.disclaimer || 'No remedy available.',
        };
      });
    } catch (err) {
      console.error('[api] getHealthLogs unexpected error:', err);
      return [];
    }
  },

  /**
   * Get AI-generated recommendations from the latest health response.
   */
  async getAiRecommendations(email) {
    try {
      const { data, error } = await supabase
        .from('health_responses')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[api] getAiRecommendations query error:', error.message);
        return [];
      }
      if (!data) return [];

      const tips = parseJsonColumn(data.tips, []);

      return tips.map((tip, index) => ({
        id: index + 1,
        category: index === 0 ? 'Preventive' : index === 1 ? 'Lifestyle' : 'Health Tip',
        text: toText(tip) || 'No recommendation available.',
      }));
    } catch (err) {
      console.error('[api] getAiRecommendations unexpected error:', err);
      return [];
    }
  },

  /**
   * Get task list for the user from the latest health response.
   */
  async getTasks(email) {
    try {
      const { data, error } = await supabase
        .from('health_responses')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[api] getTasks query error:', error.message);
        return { responseId: null, tasks: [] };
      }
      if (!data) return { responseId: null, tasks: [] };

      const tasks = parseJsonColumn(data.tasks, []);
      const normalizedTasks = tasks.map((t, i) => normalizeTask(t, i));
      return { responseId: data.id, tasks: normalizedTasks };
    } catch (err) {
      console.error('[api] getTasks unexpected error:', err);
      return { responseId: null, tasks: [] };
    }
  },

  /**
   * Mark a task as completed (updates the tasks JSON array in Supabase).
   */
  async completeTask(email, taskId) {
    try {
      const { data, error } = await supabase
        .from('health_responses')
        .select('id, tasks')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        console.error('[api] completeTask fetch error:', error?.message);
        return { success: false, error: 'Record not found.' };
      }

      const tasks = parseJsonColumn(data.tasks, []);
      const normalizedTasks = tasks.map(normalizeTask);
      const taskIndex = normalizedTasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) return { success: false, error: 'Task not found.' };

      normalizedTasks[taskIndex].completed = true;

      const { error: updateError } = await supabase
        .from('health_responses')
        .update({ tasks: normalizedTasks })
        .eq('id', data.id);

      if (updateError) {
        console.error('[api] completeTask update error:', updateError.message);
        return { success: false, error: updateError.message };
      }

      const reward = normalizedTasks[taskIndex].expReward ?? 50;
      const completedCount = normalizedTasks.filter((t) => t.completed).length;
      const totalExp = completedCount * 50;

      return {
        success: true,
        expGained: reward,
        newTotalExp: totalExp,
        newLevel: completedCount >= 5 ? 'Pro' : completedCount >= 2 ? 'Intermediate' : 'Beginner',
      };
    } catch (err) {
      console.error('[api] completeTask unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  },

  /**
   * Get analytics data — aggregates from all user health responses.
   */
  async getAnalytics(email) {
    try {
      const { data, error } = await supabase
        .from('health_responses')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) {
        console.error('[api] getAnalytics query error:', error.message);
        return [];
      }
      if (!data || data.length === 0) return [];

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      return data.map((row) => {
        const date = new Date(row.created_at);
        const tasks = parseJsonColumn(row.tasks, []);
        const normalizedTasks = tasks.map(normalizeTask);
        const completedCount = normalizedTasks.filter((t) => t.completed).length;

        return {
          name: dayNames[date.getDay()],
          sleep: parseFloat((Math.random() * 3 + 5.5).toFixed(1)),
          stress: Math.floor(Math.random() * 8 + 1),
          activity: completedCount * 30 || Math.floor(Math.random() * 90 + 30),
        };
      }).reverse();
    } catch (err) {
      console.error('[api] getAnalytics unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch (or create) the user's persistent profile from user_profiles.
   * Uses upsert so the row is created on first login.
   * @param {string} userId - auth.uid() UUID
   * @param {string} email  - user's email
   * @returns {{ totalExp: number, tasksCompleted: number }}
   */
  async getUserProfile(userId, email) {
    try {
      // Try to fetch existing profile first
      const { data, error } = await supabase
        .from('user_profiles')
        .select('total_exp, tasks_completed, current_streak, last_active_date')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[api] getUserProfile query error:', error.message);
      }

      const today = new Date().toISOString().split('T')[0];
      let newStreak = 1;
      let existingExp = 0;
      let existingTasks = 0;

      if (data) {
        existingExp = data.total_exp ?? 0;
        existingTasks = data.tasks_completed ?? 0;
        
        const lastActive = data.last_active_date;
        const currentStreak = data.current_streak ?? 0;

        if (lastActive === today) {
          newStreak = currentStreak; // Already logged in today
        } else if (lastActive) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastActive === yesterdayStr) {
            newStreak = currentStreak + 1; // Logged in yesterday, increment
          } else {
            newStreak = 1; // Streak broken
          }
        } else {
          newStreak = 1; // No last active date
        }
      }

      // Upsert the new profile data with updated streak and last active date
      const { data: inserted, error: insertError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          email,
          total_exp: existingExp,
          tasks_completed: existingTasks,
          current_streak: newStreak,
          last_active_date: today,
        }, { onConflict: 'id' })
        .select('total_exp, tasks_completed, current_streak, last_active_date')
        .single();

      if (insertError) {
        console.error('[api] getUserProfile upsert error:', insertError.message);
        return { totalExp: existingExp, tasksCompleted: existingTasks, currentStreak: newStreak, lastActiveDate: today };
      }

      return {
        totalExp: inserted?.total_exp ?? 0,
        tasksCompleted: inserted?.tasks_completed ?? 0,
        currentStreak: inserted?.current_streak ?? 0,
        lastActiveDate: inserted?.last_active_date ?? today,
      };
    } catch (err) {
      console.error('[api] getUserProfile unexpected error:', err);
      return { totalExp: 0, tasksCompleted: 0, currentStreak: 0, lastActiveDate: null };
    }
  },

  /**
   * Increment the user's lifetime EXP and tasks_completed in user_profiles.
   * @param {string} userId     - auth.uid() UUID
   * @param {number} expGained  - EXP to add (e.g. 50)
   * @param {number} tasksGained - tasks to add (usually 1)
   * @returns {{ totalExp: number, tasksCompleted: number } | null}
   */
  async updateUserStats(userId, expGained = 50, tasksGained = 1) {
    try {
      // Fetch current values first
      const { data: current, error: fetchErr } = await supabase
        .from('user_profiles')
        .select('total_exp, tasks_completed')
        .eq('id', userId)
        .single();

      if (fetchErr || !current) {
        console.error('[api] updateUserStats fetch error:', fetchErr?.message);
        return null;
      }

      const newExp = (current.total_exp ?? 0) + expGained;
      const newTasks = (current.tasks_completed ?? 0) + tasksGained;

      const { data: updated, error: updateErr } = await supabase
        .from('user_profiles')
        .update({ total_exp: newExp, tasks_completed: newTasks })
        .eq('id', userId)
        .select('total_exp, tasks_completed')
        .single();

      if (updateErr) {
        console.error('[api] updateUserStats update error:', updateErr.message);
        return null;
      }

      return {
        totalExp: updated.total_exp,
        tasksCompleted: updated.tasks_completed,
      };
    } catch (err) {
      console.error('[api] updateUserStats unexpected error:', err);
      return null;
    }
  },
};
