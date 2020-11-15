import { listActiveTasks, ListActiveTasksResponse } from "../api";
import { Dispatch } from "redux";

// List of tasks related action types.
export const LIST_ACTIVE_TASKS_BEGIN = "LIST_ACTIVE_TASKS_BEGIN";
export const LIST_ACTIVE_TASKS_SUCCESS = "LIST_ACTIVE_TASKS_SUCCESS";
export const LIST_ACTIVE_TASKS_ERROR = "LIST_ACTIVE_TASKS_ERROR";

interface ListActiveTasksBeginAction {
  type: typeof LIST_ACTIVE_TASKS_BEGIN;
  queue: string;
}

interface ListActiveTasksSuccessAction {
  type: typeof LIST_ACTIVE_TASKS_SUCCESS;
  queue: string;
  payload: ListActiveTasksResponse;
}

interface ListActiveTasksErrorAction {
  type: typeof LIST_ACTIVE_TASKS_ERROR;
  queue: string;
  error: string; // error description
}

// Union of all tasks related action types.
export type TasksActionTypes =
  | ListActiveTasksBeginAction
  | ListActiveTasksSuccessAction
  | ListActiveTasksErrorAction;

export function listActiveTasksAsync(qname: string) {
  return async (dispatch: Dispatch<TasksActionTypes>) => {
    dispatch({ type: LIST_ACTIVE_TASKS_BEGIN, queue: qname });
    try {
      const response = await listActiveTasks(qname);
      dispatch({
        type: LIST_ACTIVE_TASKS_SUCCESS,
        queue: qname,
        payload: response,
      });
    } catch {
      dispatch({
        type: LIST_ACTIVE_TASKS_ERROR,
        queue: qname,
        error: `Could not retreive active tasks data for queue: ${qname}`,
      });
    }
  };
}
