/* eslint-disable no-continue */
/* eslint-disable array-callback-return */
// import { useSelector } from 'react-redux';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  // office
  officeList: [],
  managerList: [],
  // team
  teamList: []
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET OFFICES
    getOfficeListSuccess(state, action) {
      state.isLoading = false;
      state.officeList = action.payload;
    },

    // GET MANAGE USERS
    getManagerListSuccess(state, action) {
      state.isLoading = false;
      state.managerList = action.payload;
    },

    // GET TEAMS
    getTeamListSuccess(state, action) {
      state.isLoading = false;
      state.teamList = action.payload;
    },

    // DELETE OFFICE
    getDeletedOfficeList(state, action) {
      const getDeletedOfficeList = filter(
        state.officeList,
        (office) => office.id !== action.payload.officeId
      );
      state.officeList = getDeletedOfficeList;
    },

    // DELETE TEAM
    getDeletedTeamList(state, action) {
      const getDeletedTeamList = filter(
        state.teamList,
        (team) => team.id !== action.payload.teamId
      );
      state.teamList = getDeletedTeamList;
    },

    // ON TOGGLE FOLLOW
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  onToggleFollow,
  getDeletedOfficeList,
  getDeletedTeamList
} = slice.actions;

// ----------------------------------------------------------------------
// Getting the Data
// ----------------------------------------------------------------------

export function getOfficeList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/office/offices');
      dispatch(slice.actions.getOfficeListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTeamList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/team/teams');
      dispatch(slice.actions.getTeamListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------

export function getManagerList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/office/office-managers');
      dispatch(slice.actions.getManagerListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// Update
// ----------------------------------------------------------------------

export function updateOfficeList({ updatedOfficeList }) {
  const data = updatedOfficeList;
  return async () => {
    await axios.post('/api/office/updateOfficeList', data);
  };
}

export function updateTeamList({ updatedTeamList }) {
  console.log('Here is redux:', updatedTeamList);
  const data = updatedTeamList;
  return async () => {
    await axios.post('/api/team/updateTeamList', data);
  };
}

// ----------------------------------------------------------------------
// Delete
// ----------------------------------------------------------------------

export function deleteOffice({ officeId }) {
  const data = {
    officeId
  };
  return async (dispatch) => {
    await axios.post('/api/office/deleteOffice', data);
    dispatch(slice.actions.getDeletedOfficeList(data));
  };
}

export function deleteTeam({ teamId }) {
  const data = {
    teamId
  };
  return async (dispatch) => {
    await axios.post('/api/team/deleteTeam', data);
    dispatch(slice.actions.getDeletedTeamList(data));
  };
}

// ----------------------------------------------------------------------
// Add
// ----------------------------------------------------------------------

export function addOffice() {
  return async () => {
    const response = await axios.post('/api/office/addOffice');
    const { id } = response.data;
    return id;
  };
}

export function addTeam() {
  return async () => {
    const response = await axios.post('/api/team/addTeam');
    const { id } = response.data;
    return id;
  };
}
