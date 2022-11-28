import React, { useState, useEffect } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  const [newTasks, setNewTask] = useState("")

  const myUrl = "https://assets.breatheco.de/apis/fake/todos/user/alejandro"

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
          method:"POST", // método POST para crear
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
  
  
/*   useEffect(async()=>{
    if (tasks.length>0){ // Se condiciona para que indique que cuando el tamaño de el array del estado tasks sea mayor que 0 se ejecute. Sin esta condición genera un error 400 en consola ya que postman no permite un arreglo vacío
      var replys = await fetch(myUrl,{
        method:"PUT", // el método de actualización (el cual se aplica para agregar o eliminar ya que de igual manera se actualiza)
        body:JSON.stringify(tasks), //Como se va a actualizar, ya no va un arreglo vacío si no el valor que se encuentre en el estado tasks
        headers:{
          "Content-Type": "application/json"
        }
      })
      if (replys.ok){
        console.info("update list")
      }
    }else{
      //si queremos agregar un delete ponerlo aquí
    }
      // si la respuesta es correcta entonces que imprima la información de lista actualizada
  },[tasks])
  //NO ME ESTÁ GENERANDO EL CAMBIO CUANDO ELIMINO ALGÚN ELEMENTO DE LA LISTA, AL DARLE EL GET EN POSTMAN NO ME TOMA LOS CAMBIOS CUANDO ELIMINO, SOLO LOS TOMA CUANDO AGREGO//
   */

  // componentDidMount donde se genera la carga de los datos al crear el primer elemento desde la API
  // Este es el GET de postman, ya que no es necesario para traer la lista hacer el GET desde allá.
  useEffect(async()=>{
    let replyes = await fetch(myUrl)
    if(replyes.ok){
      let data = await replyes.json()
    setTasks(data)
    }else{
      console.error(replyes.statusText)
    }
    
  },[]) // se ejecuta cuando se renderiza el componente

  // componentDidUpdate Donde se generan los cambios en la lista ya creada (estado tasks), cada vez que se generen cambios en ese estado
  useEffect(async()=>{
    if (tasks.length == 0){ //Que solo se ejecute si el estado es diferente de cero, si es cero entonces que se salga y no ejecute nada
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
    
  },[tasks]) // Se ejecuta cuando se genera un cambio en el estado de tasks



  //importante añadir tanto en las funciones de añadir y eliminar las peticiones fetch para actualizar el listado
  //como toca generar el cambio en ambas funciones a las cuales comparten el mismo parametro para el cambio que es newTasks
  //entonces se crea un useEffect que ampare el cambio en el estado de ese mismo newTasks que sería entonces tasks.

  async function addTasks(e){
    if(e.code=="Enter" && newTasks!=""){
      if (tasks.length == 0){
        //Si la lista está vacía que se agregue una nueva lista, que se crea en la API
        let reply = await fetch(myUrl,{
          method:"POST",
          body:JSON.stringify([]),
          headers:{
            "Content-Type":"application/json"
          }
        })
        if (reply.ok){ //Si se crea correctamente la lista entonces mostrar el msj
          console.log("created list")
        }else{
          console.error(reply.statusText) //Si no se crea entonces mostrar el error
          return // y se interrumpe la ejecución de la función con un return
        }
      }
      setTasks([...tasks, {label: newTasks, done: false}]) // los 3 puntos indican que despliegue las tasks y agregue la newTasks 
      setNewTask("")
    }
  }
  // Agregar al botón azul la funcionalidad de al hacer click poner color por ser importante

  async function removeTask(index){
    let newTask = [...tasks]
    newTask.splice(index, 1)
    if (newTasks == 0){
      // si el arreglo queda vacío entonces eliminarlo e imprimir "deleted list"
      let reply = await fetch(myUrl, {
        method:"DELETE"
      })
      if (reply.ok){
        console.log("deleted list")
      }
    }
    setTasks(newTask)
  }

  // Crear una funcion la cual pueda añadir una clase que genere un background azul para marcar una tarea como importante
  function checkTasks(index){
    //Actualiza el check de la tarea
    let newTasks=[...tasks]
     newTasks[index]={...newTasks[index], done:!newTasks[index].done} // aquí se deconstruyen los objetos para anexar uno nuevo dejando los demás
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
            className="form-control" onKeyDown={e=>addTasks(e)} //e es el evento que hace que se le pase el parametro a addtasks
            onChange={e=>setNewTask(e.target.value)}
            value={newTasks}
          ></input>
        </li>
        {tasks.map((task, index) => (
          <li key={index} className="list-change list-group-item d-flex justify-content-between align-items-center">
            <input className="form-check-input" type="checkbox" defaultChecked={task.done} onChange={()=>checkTasks(index)} id="defaultCheck1" />
            <small>{task.label+(task.done?" (Completado)":" (Pendiente)")}</small> {/* Aquí condicionamos a que si el estado de task.done es true indique completado de lo contrario pendiente*/}
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
