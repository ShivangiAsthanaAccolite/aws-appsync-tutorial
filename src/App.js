import './App.css';

import ToDoList from './ToDoList';
import logo from './logo.svg';

const App = () => {
  console.log("App")
  return (
    <div style={{ margin: 80 }}>
      {/* <h1>App Component</h1> */}
      <ToDoList />
    </div>
  );
}

export default App;
