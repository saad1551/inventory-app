import { createSlice } from '@reduxjs/toolkit'


// Function to safely get and parse the "name" from localStorage
const getNameFromLocalStorage = () => {
  try {
      const name = localStorage.getItem("name");
      return name ? JSON.parse(name) : "";
  } catch (error) {
      console.error('Error parsing name from localStorage:', error);
      return "";
  }
};

const initialState = {
    isLoggedIn: false,
    name: getNameFromLocalStorage(),
    user: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      photo: ""
    },
    userID: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USER(state, action) {
      const profile = action.payload;
      state.user.name = profile.name;
      state.user.email = profile.email;
      state.user.phone = profile.phone;
      state.user.bio = profile.bio;
      state.user.photo = profile.photo;
    }
  }
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer