// Función debounce para mejorar el rendimiento al hacer scroll
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        let context = this, args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Función que activa las animaciones en las secciones
function checkScroll() {
    const skills = document.querySelector('.skills-container');
    const experiences = document.querySelector('.experience-container');
    const technologies = document.querySelector('.technology-container');
    const languages = document.querySelector('.languages-container');

    const triggerPoint = window.innerHeight / 1; // Ajustar el trigger point para mayor sensibilidad

    const skillsTop = skills.getBoundingClientRect().top;
    const experiencesTop = experiences.getBoundingClientRect().top;
    const technologiesTop = technologies.getBoundingClientRect().top;
    const languagesTop = languages.getBoundingClientRect().top;

    if (skillsTop < triggerPoint) {
        skills.style.opacity = '1';
        skills.style.transform = 'translateY(0)';
    }

    if (experiencesTop < triggerPoint) {
        experiences.style.opacity = '1';
        experiences.style.transform = 'translateY(0)';
    }

    if (technologiesTop < triggerPoint) {
        technologies.style.opacity = '1';
        technologies.style.transform = 'translateY(0)';
    }

    if (languagesTop < triggerPoint) {
        languages.style.opacity = '1';
        languages.style.transform = 'translateY(0)';
    }
}

// Escuchar el evento scroll con debounce para optimizar el rendimiento
window.addEventListener('scroll', debounce(checkScroll));


// Efecto de aparición al hacer scroll
window.addEventListener('scroll', function() {
    const projects = document.querySelector('.project-container');
    const rect = projects.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
        projects.style.opacity = '1';
        projects.style.transform = 'translateY(0)';
    }
});


// Seleccionar el botón de hamburguesa y el menú
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

// Añadir evento de clic para mostrar u ocultar el menú
hamburger.addEventListener('click', () => {
    menu.classList.toggle('show'); // Cambiar la clase 'show' para alternar el menú
});

//contact form

"use strict"

const db = firebase.firestore();

const coleccionStr = "contact";
const frm = document.querySelector("#frm");


var editStatus = false;
var idSeleccionado = "";

const findAll = () => db.collection(coleccionStr).get();

const findById = paramID => db.collection(coleccionStr).doc(paramID).get();

const onFindAll = callback => db.collection(coleccionStr).onSnapshot(callback);

const onInsert = newObj => db.collection(coleccionStr).doc().set(newObj);

const onUpdate = (paramID, newObj) => db.collection(coleccionStr).doc(paramID).update(newObj);

const onDelete = paramID => db.collection(coleccionStr).doc(paramID).delete();


frm.addEventListener("submit", async(event) =>{
    event.preventDefault();
    console.log(event);

    const estudianteTO = {
        nombre : frm.txtNombre.value.trim(),
        apellidos : frm.txtApellidos.value.trim(),
        correo : frm.txtCorreo.value.trim(),
        asunto : frm.txtAsunto.value.trim(),
        mensaje : frm.txtMensaje.value.trim()
    };
    
    if (
        estudianteTO.nombre === "" ||
        estudianteTO.apellidos === "" ||
        estudianteTO.correo === "" ||
        estudianteTO.asunto === "" ||
        estudianteTO.mensaje === ""
        
    ) {
        alert("Please complete blank spaces.");
        return; 
    }
    const documentos = await findAll();
    const correosExistentes = documentos.docs.map(doc => doc.data().correo);

    if (correosExistentes.includes(estudianteTO.correo)) {
        alert("Email already exists.");
        return;
    }


    if (editStatus){
        await onUpdate(idSeleccionado, estudianteTO);
    }else{
    await onInsert(estudianteTO);
    }
    console.log(estudianteTO);
    limpiar();
   
   
    const mensajeEnviado = document.createElement("p");
    mensajeEnviado.textContent = "¡Form send!";
    frm.appendChild(mensajeEnviado);

});

function limpiar(){
    frm.reset();
    frm.btnGuardar.innerHTML = "Save";
    frm.txtNombre.focus();

    editStatus = false;
    idSeleccionado = "";
    
}

const btnLimpiar = document.querySelector("#btnLimpiar");
btnLimpiar.addEventListener("click", () => {
    console.log(limpiar);
    limpiar();
});


console.log(db);

const btnRegresar = document.querySelector("#btnRegresar");
btnRegresar.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "index.html";
});


