<h1 align="center">
  <a href="[https://github.com/Tokyo1703/OpenQuizzer]">
    <picture>
    <img alt="Logo OpenQuizzer" src="Front/public/img/Logo.png" width="350">
    </picture>
  </a>
  
  OpenQuizzer
</h1>


## Descripción
OpenQuizzer es una aplicación de cuestionarios interactivos con una base de datos MySQL, backend usando Node.js y el frontend con el framework de Angular.



## Instalación y uso
Seguir las instrucciones de instalación de Docker Engine en https://docs.docker.com/engine/install/ubuntu/.

También es posible la instalación de Docker Desktop desde https://www.docker.com/products/docker-desktop/. Será necesario abrir la aplicación de Docker siempre antes de iniciar OpenQuizzer.

##Descargar repositorio
```sh
#Descargar repositorio
  $ git clone https://github.com/Tokyo1703/OpenQuizzer.git
  $ cd OpenQuizzer

#Introduzca la siguiente linea en la terminal si desea cargar datos de ejemplo
  $ sed -i 's|\.\/sql:\/docker-entrypoint-initdb\.d|\.\/sql_example:\/docker-entrypoint-initdb\.d|' docker-compose.yaml

#Lanzamiento app
  $ sudo docker compose up

```
Para usar la aplicación será necesario abrir cualquier navegador e introducir en la barra de búsqueda http://localhost:4200.


Los usuarios de ejemplo son los siguientes:  

**Nombre de usuario**: CarlaCreadora  
**Contraseña**: c87654321  

**Nombre de usuario**: CarlaParticipante  
**Contraseña**: c87654321 

## Licencia
OpenQuizzer © 2025 by Carla Bravo Maestre is licensed under CC BY 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
