//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListener();
function eventListener() {


  formulario.addEventListener('submit', agregarGastos);
}
document.addEventListener("DOMContentLoaded", () => {
  Swal.fire({
    title: "Presupuesto Semanal",
    input: "text",
    inputPlaceholder: "Ingrese su presupuesto",
  });

  const budgetContainer = document.querySelector(".swal2-container");
  const budgetInput = document.querySelector(".swal2-input");



  budgetContainer.addEventListener("click", (e) => {
    const budgetValue = Number(budgetInput.value);
    if (e.target.classList.contains("swal2-container") || e.target.classList.contains("swal2-confirm")) {
      if (budgetValue === "" || budgetValue <= 0 || isNaN(budgetValue)) {
        window.location.reload();
      }
    }
    presupuesto = new Presupuesto(budgetValue);
    ui.insertarPresupuesto(presupuesto);
    if (e.target.classList.contains("swal2-popup")) {
      return;
    }
  });



});

//Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }
  nuevoGasto(nGasto) {
    this.gastos = [...this.gastos, nGasto];
    this.calcularRestante();
  }
  calcularRestante() {
    const gastado=this.gastos.reduce((total,gasto)=> total+gasto.cantidad,0 );
    this.restante=this.presupuesto-gastado;
  }

  eliminarGasto(id){
    this.gastos=this.gastos.filter(gasto=>gasto.id!==id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    //extrayendo los valores
    const { presupuesto, restante } = cantidad;

    //Agregar al html
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const div = document.createElement('div');
    div.classList.add('text-center', 'alert');

    if (tipo === 'error') {
      div.classList.add('alert-danger');
    } else {
      div.classList.add('alert-success');
    }
    //mensaje
    div.textContent = mensaje;
    //insertar en el html
    document.querySelector('.primario').insertBefore(div, formulario);

    //quitar del html
    setTimeout(() => {
      div.remove();
    }, 3000);
  }
  agregarGastoListado(gastos) {

    this.limpiarHTML();//Elimina el html previo
    //Iterar sobre los gastos
    gastos.forEach(gasto => {

      const { cantidad, nombre, id } = gasto;

      //crear un li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;
      //Agregar el html al gasto
      nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}<span>`;
      //Boton de borrado 
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.textContent = 'Borrar';
      nuevoGasto.appendChild(btnBorrar);

      btnBorrar.onclick=()=>{
        eliminarGasto(id);
      }


      //Agregar al HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }
  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj){
    const {presupuesto,restante}=presupuestoObj;

    const restanteDiv=document.querySelector('.restante');
    //comprobar el 25%
    if ((presupuesto/4)>restante) {
      restanteDiv.classList.remove('alert-success','alert-warning');
      restanteDiv.classList.add('alert-danger');
    }else if ((presupuesto/2)>restante){
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning');
    }else{
      restanteDiv.classList.remove('alert-danger','alert-warning');
      restanteDiv.classList.add('alert-success');
    }

    if (restante<=0) {
      ui.imprimirAlerta('El presupuesto se a agotado','error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}
const ui = new UI();
let presupuesto;

//Funciones
function agregarGastos(e) {
  e.preventDefault();

  //leer los datos del formulario d
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  //validar
  if (nombre === '' || cantidad === '' || isNaN(cantidad) || cantidad <= 0) {
    ui.imprimirAlerta('Asegurese de ingresar bien los datos', 'error');
  }

  //Generar un objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };
  presupuesto.nuevoGasto(gasto);
  //Mensaje de todo bien
  ui.imprimirAlerta('Gasto Agregado Correctamente');

  //imprimir los gastos 
  const { gastos,restante } = presupuesto;
  ui.agregarGastoListado(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
  //reinicia el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);

  //Elimina los gastos del html
  const {gastos,restante}=presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}