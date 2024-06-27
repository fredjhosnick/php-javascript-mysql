let albumes = [];
let desplegado;
document.querySelector(".mas").addEventListener("click",mas);
document.querySelector(".ampliacion").addEventListener("click",cerrar);
document.querySelector("#album").addEventListener("keydown",teclado);
cargarTodos();

function teclado(e){
    (e.key === "Enter") && mas();
}

function mas(){
    const nombre = document.querySelector("#album").value.trim();
    if(nombre){
        albumes.push({album:nombre, imagenes:[]});
        escribir();
    }
    limpiar();
}

function escribir(){
    document.querySelector(".albumes").innerHTML = "";
    albumes.map((valor,indice) => {
        document.querySelector(".albumes").insertAdjacentHTML("beforeend",`
             <div class="cadaAlbum" onclick ="desplegar(this)" elem="${indice}">

             <div class= "nombreAlbum"
              contenteditable = "true"
              onfocus="activar(this)"
              onblur="desactivar(this)"
              onkeydown="detectarEnter(this,event)">
                
                ${valor.album}

             </div>
             <img src="img/papelera.png" onclick="eliminarAlbum(this,event)"/>
             <div class="numeroImagenes">(${valor.imagenes.length} imagenes)</div>

             </div>
        
        `);
    });
    insertar();
}

function activar(yo){
    yo.style.color="red";

}
function desactivar(yo){
    yo.style.color=null;
    const contenido = yo.innerHTML.trim();
    const indice = encontrar2(yo);
    albumes[indice].album=contenido;
    insertar();
}
function detectarEnter(yo,e){
    const tecla = e.key;
    if(tecla === "Enter"){
        desactivar(yo);
        e.preventDefault();
    }


}
function desplegar(yo){
    document.querySelector(".miAlbum").style.display="block";
    desplegado =(yo.getAttribute("elem"));
    const datos = albumes[desplegado];

    document.querySelector(".miAlbum").innerHTML = `
        <h1>${datos.album}</h1>
        <div class = "imagenes"></div>
        <div class = "caja">
           
          
                <input type="file" name="fichero" id="fichero" accept="image/*" />
                <button type="button"  onclick="enviar(event)">Subir fichero</button>
          

 
        </div>`;
        if(datos.imagenes.length > 0){
            datos.imagenes.map((valor)=>{
                   codigoHTML(valor);
            });
          }
           }

       
    
           function enviar(event) {
            event.preventDefault();
            const fichero = document.querySelector('#fichero');
            if (fichero.files.length > 0) {
                let data = new FormData();
                data.append('fichero', fichero.files[0]);
                
                fetch('http://localhost/UPLOADFILES/php/subir.php', {
                    method: 'POST',
                    body: data
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        albumes[desplegado].imagenes.push(data.file);
                        
                        codigoHTML(data.file);
                     
                        insertar();
                    } else {
                        console.error(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        }
        

function codigoHTML(dato){

    document.querySelector(".imagenes").insertAdjacentHTML("beforeend",`
        <div class="imagen"
             onmouseover = "mostrar(this)"
             onmouseout = "mostrar(this)"
             onclick="ampliar('${dato}')" alt=""/>
             <img src="${dato}" alt=""/>
             <img class = "papelera" src="img/papelera.png"
                   onclick="eliminarImagen(this,'${dato}',event)"/>
        
        </div>`)

}

function mostrar(yo){
    const papelera = yo.querySelector(".papelera");
    papelera.style.display = papelera.style.display === "block" ? "none" : "block";
}
function ampliar(miImagen){
    document.querySelector(".ampliacion").style.display = "block";
    document.querySelector(".imagenGrande").innerHTML=`<img src="${miImagen}"/>`
}

function cerrar(){
    this.style.display = "none";
}

function eliminarImagen(yo,miImagen,e){
    e.stopPropagation();
    yo.parentNode.remove()
    const indice = encontrar(yo);
    albumes[desplegado].imagenes.splice(indice,1);
    fetch('php/borrarFichero.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
        },
        body: `ficheroABorrar=${encodeURIComponent(miImagen)}`,
    })
    .then(response=>response.text())
    .then(data => console.log(data));
    insertar();

}

function encontrar(yo){
    const hijos = yo.parentNode.children;
    for(let k = 0; k < hijos.length; k++){
        if(yo.parentNode === hijos[k]){
            return k;
        }
    }
}
function encontrar2(yo){
    const hijos = yo.parentNode.parentNode.children;
    for(let k = 0; k < hijos.length; k++){
        if(yo.parentNode === hijos[k]){
            return k;
        }
    }
}
function insertar (){
    fetch('http://localhost/UPLOADFILES/php/insertar.php',{
          method:'POST',
          headers:{
                'Content-Type':'application/json'
          },
          body:JSON.stringify({
            aGuardar:albumes
          })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
   
}
function cargarTodos() {
    document.querySelector(".albumes").innerHTML = "";
    fetch("http://localhost/UPLOADFILES/php/cargarTodos.php")
    .then(response => response.text())
    .then(data => {
        console.log("Raw response:", data); // Mensaje de depuración
        if (data) {
            try {
                albumes = JSON.parse(data);
                escribir();
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            console.error("Empty response from server");
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function eliminarAlbum(yo,e){
    document.querySelector(".miAlbum").style.display = "none";
    const indice = encontrar2(yo)
    albumes.splice(indice,1);
    escribir();
    e.stopPropagation();
}

function limpiar(){
    document.querySelector("#album").value = "";
    document.querySelector("#album").focus(); 
}