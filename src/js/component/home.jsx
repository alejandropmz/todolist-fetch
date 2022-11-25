import React, { useState, useEffect } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const [newTasks, setNewTask] = useState("")

  function addTasks(e){
    if(e.code=="Enter" && newTasks!=""){
      setTasks([...tasks, {label: newTasks, done:false}])
      setNewTask("")
    }
  }
  // Agregar al botón azul la funcionalidad de al hacer click poner color por ser importante

  function removeTask(index){
    tasks.splice(index, 1)
    setNewTask([...newTasks])
  }

  useEffect(async()=>{
    
  })


  //indica que es una funcion asincrona con async
  useEffect(async()=>{
    var respuesta = await fetch("https://assets.breatheco.de/apis/fake/todos/user/alejandro2")
    //verificar si la lista existe o no
    if (respuesta.status == 404){
      //si no se consigue toca crear la lista
      respuesta = await fetch("https://assets.breatheco.de/apis/fake/todos/user/alejandro2",{
        method:"POST",
        body:JASON.stringify([]),
        headers:{
          "Content-type":"application/json"
        }
      })
      respuesta = await fetch("https://assets.breatheco.de/apis/fake/todos/user/alejandro2")
    }else if(!respuesta.ok){
      // Hubo un error
      console.error("Error al cargar una lista" + respuesta.statusText)
    }
    // Cargar la data del body
    var data = await respuesta.json()
    //actualiza el estado con la data
    setTasks(data)
  },[])

  // Crear una funcion la cual pueda añadir una clase que genere un background azul para marcar una tarea como importante
  function importantTask(index){
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
            <small>{task.label}</small>
            <div className="right-buttons ">
            <button className="badge bg-primary rounded-pill" onClick={()=>importantTask(index)}>O</button>
            <button className="badge bg-danger rounded-pill red-button {}}" onClick={()=>removeTask(index)}>X</button>
            </div>
          </li>
        ))}
        <li className="list-group-item d-flex text-center justify-content-center align-items-center">
          <small className="font.size" >{tasks.length} items</small>
        </li>
      </ul>
    </div>
  );
};

export default Home;
