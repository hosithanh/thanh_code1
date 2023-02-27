import { applyMiddleware, compose, createStore } from "redux"
import thunk from "redux-thunk"
import rootReducer from "./reducers"
// import rootReducer from "redux/reducer"

const composeEnhancers =
    typeof window === "object" && process.env.NODE_ENV === "development" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose
const enhancer = composeEnhancers(applyMiddleware(thunk))
export const store = createStore(rootReducer, enhancer)
