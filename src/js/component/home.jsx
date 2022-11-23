import React, { useState } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const [newTasks, setNewTask] = useState("")

  function addTasks(e){
    if(e.code=="Enter" && newTasks!=""){
      setTasks([...tasks, newTasks])
      setNewTask("")
    }
  }
  // Agregar al botón azul la funcionalidad de al hacer click poner color por ser importante

  function removeTask(index){
    tasks.splice(index, 1)
    setNewTask([...newTasks])
  }

  function importantTask(index){
    tasks[index] = className="important"
  }

  return (
    <div className="container w-50 d-flex justify-content-center ">
      <ul className="list-group">
        <li className="font-list list-group-item d-flex justify-content-center align-items-center">
          <div>My tasks list</div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <input
            type="text"
            placeholder="write tasks here"
            className="form-control" onKeyDown={e=>addTasks(e)}
            onChange={e=>setNewTask(e.target.value)}
            value={newTasks}
            aria-label="Text input with dropdown button"
          ></input>
        </li>
        {tasks.map((task, index) => (
          <li key={index} className="list-change list-group-item d-flex justify-content-between align-items-center">
            {task}
            <div className="right-buttons ">
            <button className="badge bg-danger rounded-pill red-button" onClick={()=>removeTask(index)}>X</button>
            <button className="badge bg-primary rounded-pill" onClick={()=>importantTask(index)}>O</button>
            </div>
          </li>
        ))}
        <li className="list-group-item d-flex text-center justify-content-center align-items-center">
          <small>{tasks.length} items</small>
        </li>
      </ul>
    </div>
  );
};

export default Home;
