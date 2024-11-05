<a id="readme-top"></a>

<div align="center">
  <a href="https://epayco.com">
    <img src="frontend/src/assets/epayco.png" alt="Logo" width="320" >
  </a>

  <h3 align="center">Monedero virtual</h3>
</div>

Este repositorio contiene el código de una aplicación para una billetera virtual, que incluye un servicio backend de base de datos (service-db) y un servicio API (service-api), así como un frontend en React para la interacción del usuario.


## Pre-requisitos

Asegúrate de tener los siguientes programas instalados:
* Node.js (v14 o superior)
* npm o yarn
* MySQL o MariaDB (para la base de datos)
* Cuenta de Gmail habilitada para enviar correos:
  * [Activar la verificación en dos pasos.](https://myaccount.google.com/signinoptions/twosv)
  * [Generar una contraseña de aplicación](https://myaccount.google.com/apppasswords) en la sección de seguridad de la cuenta de Google para el envío de correos electrónicos con nodemailer.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Instalación

1. Clonar el repositorio:
   ```sh
   git clone https://github.com/marinrangel/epayco-virtual-wallet.git
   cd epayco-virtual-wallet
   ```
2. Ejecutar el archivo "index.sql" en el motod de BD que se encuentra en la carpeta "db", este archivo crea la BD para poder trabajar
3. Instalar dependencias para cada uno de los servicios:
   ```sh
   cd backend/service-api
   npm install
    
   cd ../service-db
   npm install
    
   cd ../../frontend
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Variables de Entorno

Cada servicio requiere de variables de entorno específicas que deben estar configuradas en archivos `.env` dentro de cada carpeta (`service-api`, `service-db`, `frontend`).

### Variables para `service-db`

Estas variables son necesarias para configurar el servicio de base de datos.

```sh
# Configuración del Servidor de BD
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=walletdb
DB_PORT=3306

# Configuración del Servidor
PORT=3001

# Configuración de nodemailer
EMAIL_USER=marinrangeljl@gmail.com
EMAIL_PASSWORD=jvae qptg wukv dhir

# URl sitio frontend
URL_FRONT_SITE=http://localhost:8080/confirm-payment
 ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Variables para `service-api`

Estas variables son necesarias para configurar el servicio que se consume desde el frontend.

```sh
# Configuración del Servicio
PORT=3002

# URL del servicio DB 
SERVICE_DB_URL=http://localhost:3001/api-db/clients
 ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Ejecución de los Servicios

### 1. Ejecutar `service-db` (Base de Datos)

Este servicio es el que gestiona las operaciones directas con la base de datos.
1. Asegúrate de que la base de datos de MySQL esté configurada y en funcionamiento.
2. Luego, ejecuta el siguiente comando desde la carpeta raíz:
  ```sh
    cd backend/service-db
    npm run dev
   ```
  Esto iniciará el servicio en `http://localhost:3001`.


### 2. Ejecutar `service-api` (API)

Este servicio se comunica con el servicio de base de datos y expone los endpoints que utiliza el cliente.
1. En la carpeta raíz en una nueva terminal, ejecuta el siguiente comando:
  ```sh
    cd backend/service-api
    npm run dev
   ```
  Esto iniciará el servicio en `http://localhost:3002`.


### 3. Ejecutar `frontend` (Cliente)
Este servicio proporciona la interfaz gráfica para la interacción del usuario.
1. En la carpeta frontend, ejecuta el siguiente comando:
   ```sh
    cd frontend
    npm run dev
   ```
  Esto iniciará el cliente en `http://localhost:8080`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API Endpoints

### Endpoints de `service-api`
* POST /register: Registra un nuevo cliente.
* POST /add-balance: Añade saldo a la billetera del cliente.
* POST /pay: Inicia el proceso de pago, enviando un token de confirmación al correo del cliente.
* POST /confirm-payment: Confirma el pago utilizando el token enviado.
* GET /check-balance: Consulta el saldo de la billetera.
Para cada endpoint, es necesario enviar los datos en el cuerpo de la solicitud (req.body) en el formato requerido y validar el token para la confirmación de pago.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notas Adicionales

* El correo de confirmación incluye un enlace a la URL de confirmación de pago, que utiliza el sessionId generado en el proceso de pago.
* El frontend incluye modales para registrar clientes, ver su saldo y realizar pagos.
* La documentación en postman esta en el archivo `"postman/index.json"`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contact

José Luis Marín Rangel - marinrangeljl@gmail.com

Project Link: [https://github.com/marinrangel/epayco-virtual-wallet](https://github.com/marinrangel/epayco-virtual-wallet)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
