import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { skillContextMap } from '../components/Skills';


interface Skill {
  name: string;
  value: number;
  proficiency: 'Average' | 'Good' | 'Excellent';
  context: string;
}

interface SkillsState {
  skills: Skill[];
  totalPoints: number;
  usedPoints: number;
  isTrackerVisible: boolean;
}

// Initialize with all skills from your context map
const initialSkills = Object.entries(skillContextMap).map(([name, context]) => ({
  name,
  value: 70, // Default starting value
  proficiency: 'Good' as const,
  context
}));

const initialState: SkillsState = {
  skills: initialSkills,
  totalPoints: 10000, // Increased total points
  usedPoints: initialSkills.reduce((sum, skill) => sum + skill.value, 0),
  isTrackerVisible: false
};



export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    updateSkill: (state, action: PayloadAction<{ name: string; value: number }>) => {
      const { name, value } = action.payload;
      const skillIndex = state.skills.findIndex(skill => skill.name === name);
      
      if (skillIndex !== -1) {
        const oldValue = state.skills[skillIndex].value;
        const difference = value - oldValue;
        
        if (state.usedPoints + difference <= state.totalPoints) {
          state.skills[skillIndex].value = value;
          state.usedPoints += difference;
          
          // Update proficiency
          if (value <= 50) state.skills[skillIndex].proficiency = 'Average';
          else if (value <= 70) state.skills[skillIndex].proficiency = 'Good';
          else state.skills[skillIndex].proficiency = 'Excellent';
        }
      }
    },
    addSkill: (state, action: PayloadAction<{ name: string; value: number }>) => {
      const { name, value } = action.payload;
      const exists = state.skills.some(skill => skill.name === name);
      
      if (!exists && state.usedPoints + value <= state.totalPoints) {
        state.skills.push({
          name,
          value,
          proficiency: value <= 50 ? 'Average' : value <= 70 ? 'Good' : 'Excellent',
          context: skillContextMap[name] || `${name} skill` // Fallback context
        });
        state.usedPoints += value;
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      const skillIndex = state.skills.findIndex(skill => skill.name === action.payload);
      if (skillIndex !== -1) {
        state.usedPoints -= state.skills[skillIndex].value;
        state.skills.splice(skillIndex, 1);
      }
    },
    toggleTracker: (state) => {
      state.isTrackerVisible = !state.isTrackerVisible;
    },
    // Ensure all skills from context map are included
    syncWithExistingSkills: (state) => {
      Object.entries(skillContextMap).forEach(([name, context]) => {
        if (!state.skills.some(skill => skill.name === name)) {
          state.skills.push({
            name,
            value: 70,
            proficiency: 'Good',
            context
          });
          state.usedPoints += 70;
        }
      });
    },


  }
});

export const { updateSkill, addSkill, removeSkill, toggleTracker, syncWithExistingSkills } = skillsSlice.actions;
export default skillsSlice.reducer;