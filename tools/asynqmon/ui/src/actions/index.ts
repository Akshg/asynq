import { listQueues, ListQueuesResponse } from "../api";
import { Dispatch } from "redux";

export const LIST_QUEUES_BEGIN = "LIST_QUEUES_BEGIN";
export const LIST_QUEUES_SUCCESS = "LIST_QUEUES_SUCCESS";

interface ListQueuesBeginAction {
  type: typeof LIST_QUEUES_BEGIN;
}

interface ListQueuesSuccessAction {
  type: typeof LIST_QUEUES_SUCCESS;
  payload: ListQueuesResponse;
}

// Union of all queues related action types.
export type QueuesActionTypes = ListQueuesBeginAction | ListQueuesSuccessAction;

export function listQueuesAsync() {
  return async (dispatch: Dispatch<QueuesActionTypes>) => {
    dispatch({ type: LIST_QUEUES_BEGIN });
    const response = await listQueues();
    dispatch({
      type: LIST_QUEUES_SUCCESS,
      payload: response,
    });
  };
}
