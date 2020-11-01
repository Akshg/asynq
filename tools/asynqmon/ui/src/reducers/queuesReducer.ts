import {
  LIST_QUEUES_SUCCESS,
  LIST_QUEUES_BEGIN,
  QueuesActionTypes,
} from "../actions";
import { DailyStat, Queue } from "../api";

interface QueuesState {
  loading: boolean;
  data: QueueInfo[];
}

interface QueueInfo {
  currentStats: Queue;
  history: DailyStat[];
}

const initialState: QueuesState = { data: [], loading: false };

function queuesReducer(
  state = initialState,
  action: QueuesActionTypes
): QueuesState {
  switch (action.type) {
    case LIST_QUEUES_BEGIN:
      return { ...state, loading: true };

    case LIST_QUEUES_SUCCESS:
      const { queues } = action.payload;
      return {
        ...state,
        loading: false,
        data: queues.map((q: Queue) => ({ currentStats: q, history: [] })),
      };

    default:
      return state;
  }
}

export default queuesReducer;
