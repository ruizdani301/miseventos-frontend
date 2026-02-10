# 🎫 Mis Eventos - Frontend

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)


**Mis Eventos** 
- Es una web moderna y reactiva para encontrar los eventos que se realizan en tu ciudad. Esta plataforma permite a los usuarios explorar conferencias, talleres y sesiones, mientras proporciona  herramientas administrativas para la organización de los mismos.
En la parte superior se muestra el buscador y los filtros para encontrar eventos por titulo.
---


![interfaz_asistente](/src/assets/interfaz_asistente.png)


- En la seccion administrativa se muestran las diferentes opciones para registrar los eventos,junto con las sesiones relacionadas, horarios y ponente, asi como las descripciones de los mismos.
Facilitando a los potenciales asistentes, tener información clara sobre el evento y poder inscribirse en las sesiones de su interes.

![interfaz_admin](/src/assets/interfaz_admin.png)


## 🚀 Características Principales

-   🔐 **Autenticación de Usuarios**: Sistema seguro de registro e inicio de sesión.
-   🛠️ **Gestión Administrativa**: Panel para la gestión de roles y permisos.
-   📅 **Visualización de Eventos**: Explorador interactivo con detalles completos de cada evento.
-   📝 **Inscripciones**: Formularios personalizados para el registro en sesiones.
-   🎤 **Gestión de Ponentes y Sesiones**: Administración detallada de cronogramas y expositores.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

-   [Node.js](https://nodejs.org/) (Versión 18 o superior)
-   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Recomendado para el ecosistema completo)

---

## 📦 Instalación y Uso

> [!IMPORTANT]
> Este repositorio contiene únicamente el frontend del proyecto. Para que la aplicación funcione correctamente con la base de datos y el backend, **debes utilizar el repositorio principal**.

### Método Recomendado (Ecosistema Completo)

La mejor forma de levantar el proyecto es siguiendo las instrucciones del repositorio principal de Mis Eventos:

🔗 **[Repositorio Principal (Backend + Base de Datos + Frontend)](https://github.com/ruizdani301/eventos)**

Siguiendo los pasos de ese repositorio, podrás levantar todo el ecosistema automáticamente utilizando **Docker Compose**.

### Desarrollo Local (Solo Frontend)

Si deseas trabajar únicamente en el desarrollo de la interfaz:

1.  Clona este repositorio:
    ```bash
    git clone https://github.com/ruizdani301/miseventos-frontend .git
    cd miseventos-frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

## 📜 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con Vite. |
| `npm run build` | Compila la aplicación para producción en la carpeta `dist`. |
| `npm run lint` | Ejecuta ESLint para revisar el estilo del código. |
| `npm run preview` | Previsualiza la compilación de producción localmente. |

---
## Estructura del proyecto 
```
├── App.css
├── App.tsx
├── assets
├── components
│   ├── admin
│   │   ├── CreatedEvent.tsx
│   │   ├── Roles.tsx
│   │   ├── ScheduleForm.tsx
│   │   ├── SessionForm.tsx
│   │   └── SpeakerForm.tsx
│   ├── auth
│   │   └── ProtectedRoute.tsx
│   ├── buttons
│   │   ├── CreateSubmit.tsx
│   │   └── ResetFormat.tsx
│   ├── common
│   │   └── Pagination.tsx
│   ├── home
│   │   └── EventDiscovery.tsx
│   ├── layout
│   │   ├── AdminPage.tsx
│   │   └── Sidebar.tsx
│   ├── login
│   │   └── UserLoginForm.tsx
│   ├── pages
│   │   └── AdminPage.tsx
│   └── register
│       └── UserRegistrationForm.tsx
├── contexts
│   └── AuthContext.tsx
├── index.css
├── main.tsx
├── services
│   ├── authService.ts
│   ├── eventService.ts
│   ├── scheduleService.ts
│   ├── sessionRegisterService.ts
│   ├── sessionService.ts
│   ├── speakerService.ts
│   └── userService.ts

## Futuras mejoras
- Interfaz estadistica que muestre los datos releventes, que permitan tomar decisiones y mejorar los proximos eventos, conocer las preferencias de los asistentes, horarios mas concurridos, etc.


## 👤 Autor

Desarrollado con ❤️ por **Daniel Ruiz**.

-   GitHub: [@ruizdani301](https://github.com/ruizdani301)

---
