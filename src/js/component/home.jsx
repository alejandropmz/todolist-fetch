import React, { useState, useEffect } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const [newTasks, setNewTask] = useState("")

  const myUrl = "https://assets.breatheco.de/apis/fake/todos/user/alejandro"

  //importante añadir tanto en las funciones de añadir y eliminar las peticiones fetch para actualizar el listado
  //como toca generar el cambio en ambas funciones a las cuales comparten el mismo parametro para el cambio que es newTasks
  //entonces se crea un useEffect que ampare el cambio en el estado de ese mismo newTasks que sería entonces tasks.

  function addTasks(e){
    if(e.code=="Enter" && newTasks!=""){
      setTasks([...tasks, {label: newTasks, done: false}])
      setNewTask("")
    }
  }
  // Agregar al botón azul la funcionalidad de al hacer click poner color por ser importante

  function removeTask(index){
    tasks.splice(index, 1)
    setNewTask([...newTasks])
  }

  //aquí se aplica el useEffect que que se ejecuta cada vez que se le haga el cambio a tasks y indica como async

useEffect(async()=>{
  if (tasks.length>0){ // Se condiciona para que indique que cuando el tamaño de el array del estado tasks sea mayor que 0 se ejecute. Sin esta condición genera un error 400 en consola ya que postman no permite un arreglo vacío
    var replies = await fetch(myUrl,{
      method:"PUT", // el método de actualización (el cual se aplica para agregar o eliminar ya que de igual manera se actualiza)
      body:JSON.stringify(tasks), //Como se va a actualizar, ya no va un arreglo vacío si no el valor que se encuentre en el estado tasks
      headers:{
        "Content-Type": "application/json"
      }
    })
    // si la respuesta es correcta entonces que imprima la información de lista actualizada
    if (replies.ok){
      console.info("updated list")
    }
  }else{
    //si queremos agregar un delete ponerlo aquí
  }
},[tasks])
//NO ME ESTÁ GENERANDO EL CAMBIO CUANDO ELIMINO ALGÚN ELEMENTO DE LA LISTA, AL DARLE EL GET EN POSTMAN NO ME TOMA LOS CAMBIOS CUANDO ELIMINO, SOLO LOS TOMA CUANDO AGREGO//

    // Este useEffect va a cargar la lista por primera vez, es decir apenas se inicie el componente
    // Por lo que se hace el primer fetch() para traernos la lista
    // Se coloca la palabra async para declarar el useEffect como una función asíncrona y que puede usarse el await dentro de ella
    // Hacemos luego la petición a la url (que la tengo en un variable) para obtener mi respuesta (200 - ok ó 404 - no existe)
    // reply.status es el estado de la respuesta, 404 es que no se encuentra
  useEffect(async()=>{
    var reply = await fetch(myUrl)
    if (reply.status == 404){
      //Si no se consigue la lista entonces crear la lista con otro fetch (como el de arriba)
      // y se sobre escribe la variable ya que la de arriba ya no serviría
      //Se crea un objeto el cual va a tener la información para la creación (documentación API)
      reply = await fetch(myUrl, {
        method:"POST", // método
        body:JSON.stringify([]), //body de arreglo vacío body:"[]" stringify convierte cualquier objeto javascript que estemos usando en el código en texto
        headers:{
          "Content-Type":"application/json" 
        }
      })
      reply = await fetch(myUrl) // Aquí se trae la lista recién creada en caso de que no hubiera
    }else if (!reply.ok){
      //Si la respuesta no es ok indicar error
      console.error("error in load page") //Lo que se imprime si se presenta un error
      console.error(reply.statusText) // información detallada del error
    }
    //Cuando todo pase bien entonces se carga data del body (igual que en postman)
    var data = await reply.json() //retorna el body de reply en formato json()
    // se usa await porque ese .json() retorna una promesa, y para que este espere hasta que la promesa se cumpla se aplica el await
      //por lo que se detiene la ejecución mientras se resuelve el asunto de la data
    setTasks(data) //Una vez que la data esté lista, se llama al estado y se actualiza con la data que tiene la información anteriormente recaudada.
  },[]); //dependencia vacía de useEffect la cual indica que este se ejecuta cada vez que el componente cargue



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
            <small>{task.label+(task.done?" (Completado)":" (Pendiente)")}</small> {/* Aquí condicionamos a que si el estado de task.done es true indique completado de lo contrario pendiente*/}
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
