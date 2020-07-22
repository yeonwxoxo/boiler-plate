import { combineReducers } from "redux";
import user from "./user_reducer";
// reducer가 여러개 있을 수 있음
// reducer는 state가 변하는걸 보고 그것을 return 해주느 ㄴ것이 reducer
// 여러개의 reducer 를 combinReducer가 합쳐줌

const rootReducer = combineReducers({
  user,
});

export default rootReducer;