import {
  LIST_ACTIVE_TASKS_BEGIN,
  LIST_ACTIVE_TASKS_SUCCESS,
  LIST_ACTIVE_TASKS_ERROR,
  TasksActionTypes,
} from "../actions/tasksActions";
import { ActiveTask } from "../api";

interface TasksState {
  activeTasks: {
    loading: boolean;
    error: string;
    data: ActiveTask[];
  };
}

const initialState: TasksState = {
  activeTasks: {
    loading: false,
    error: "",
    data: [],
  },
};

function tasksReducer(
  state = initialState,
  action: TasksActionTypes
): TasksState {
  switch (action.type) {
    case LIST_ACTIVE_TASKS_BEGIN:
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          error: "",
          loading: true,
        },
      };

    case LIST_ACTIVE_TASKS_SUCCESS:
      return {
        ...state,
        activeTasks: {
          loading: false,
          error: "",
          data: action.payload.tasks,
        },
      };

    case LIST_ACTIVE_TASKS_ERROR:
      return {
        ...state,
        activeTasks: {
          ...state.activeTasks,
          loading: false,
          error: action.error,
        },
      };

    default:
      return state;
  }
}

export default tasksReducer;
