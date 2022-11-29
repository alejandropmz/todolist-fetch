import React, { useState, useEffect } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const [newTasks, setNewTask] = useState("")

  const myUrl = "https://assets.breatheco.de/apis/fake/todos/user/alejandro"

    useEffect(async()=>{
      var reply = await fetch(myUrl)
      if (reply.status == 404){
        reply = await fetch(myUrl, {
          method:"POST",
          body:JSON.stringify([]), 
          headers:{
            "Content-Type":"application/json" 
          }
        })
        reply = await fetch(myUrl)
      }else if (!reply.ok){
        console.error("error in load page")
        console.error(reply.statusText)
      }
      var data = await reply.json()
      setTasks(data)
    },[]);
  
  

  useEffect(async()=>{
    let replyes = await fetch(myUrl)
    if(replyes.ok){
      let data = await replyes.json()
    setTasks(data)
    }else{
      console.error(replyes.statusText)
    }
    
  },[])

  useEffect(async()=>{
    if (tasks.length == 0){
      return
    }
      let reply = await fetch(myUrl,{
        method:"PUT",
        body:JSON.stringify(tasks),
        headers:{
          "Content-Type":"application/json"
        }
      })
      if (reply.ok){
        console.log("update list")
      }
    
  },[tasks]) 
  

  async function addTasks(e){
    if(e.code=="Enter" && newTasks!=""){
      if (tasks.length == 0){
        let reply = await fetch(myUrl,{
          method:"POST",
          body:JSON.stringify([]),
          headers:{
            "Content-Type":"application/json"
          }
        })
        if (reply.ok){
          console.log("created list")
        }else{
          console.error(reply.statusText)
          return
        }
      }
      setTasks([...tasks, {label: newTasks, done: false}])
      setNewTask("")
    }
  }

  async function removeTask(index){
    let newTask = [...tasks]
    newTask.splice(index, 1)
    if (newTasks == 0){
      let reply = await fetch(myUrl, {
        method:"DELETE"
      })
      if (reply.ok){
        console.log("deleted list")
      }
    }
    setTasks(newTask)
  }

  function checkTasks(index){
    //Actualiza el check de la tarea
    let newTasks=[...tasks]
     newTasks[index]={...newTasks[index], done:!newTasks[index].done}
    setTasks(newTasks)
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
          ></input>
        </li>
        {tasks.map((task, index) => (
          <li key={index} className="list-change list-group-item d-flex justify-content-between align-items-center">
            <input className="form-check-input" type="checkbox" defaultChecked={task.done} onChange={()=>checkTasks(index)} id="defaultCheck1" />
            <small>{task.label+(task.done?" (Completado)":" (Pendiente)")}</small>
            <div className="right-buttons ">
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
