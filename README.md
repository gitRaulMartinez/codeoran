# Code Oran

![Imagen proyecto Code Oran](https://storage.googleapis.com/cdn-ar/portfolio/codeoran-image-preview-1.webp)

## Descripción General
Code Oran es una plataforma de programación competitiva desarrollada como proyecto final para la obtención del título de Técnico Universitario en Programación. La plataforma está implementada utilizando el stack XAMPP, que incluye Apache como servidor web, PHP como lenguaje de backend y MariaDB como sistema de gestión de base de datos.

## Características Principales

### Sistema de Juez en Línea
- **Evaluación Automática**: Sistema capaz de evaluar soluciones de programación mediante la comparación de entrada/salida
- **Lenguajes Soportados**:
  - C
  - C++
  - Java
  - Python

### Gestión de Usuarios
- **Tipos de Usuarios**:
  - Participantes: Pueden registrarse y participar en torneos
  - Administradores: Tienen acceso a funciones de gestión y creación de contenido

### Funcionalidades del Sistema

#### Para Participantes
- Registro e inicio de sesión
- Participación en torneos activos
- Envío de soluciones a problemas
- Visualización de historial de envíos
- Consulta de ranking y puntuaciones

#### Para Administradores
- Gestión de torneos
  - Creación
  - Edición
  - Programación
  - Finalización
- Gestión de problemas
  - Creación de nuevos problemas
  - Definición de casos de prueba
  - Establecimiento de límites de tiempo y memoria
  - Configuración de puntajes

## Arquitectura Técnica

### Stack Tecnológico
- **Servidor Web**: Apache
- **Backend**: PHP
- **Base de Datos**: MariaDB
- **Frontend**: HTML, CSS, JavaScript

### Componentes Principales
1. **Sistema de Juez**
   - Motor de evaluación de código
   - Sistema de compilación y ejecución
   - Verificador de resultados
   - Gestor de tiempo límite y memoria

2. **Base de Datos**
   - Almacenamiento de usuarios
   - Registro de problemas y casos de prueba
   - Historial de envíos
   - Gestión de torneos

3. **Interfaz de Usuario**
   - Panel de control para administradores
   - Área de participantes
   - Sistema de envío de soluciones
   - Visualización de resultados

## Flujo de Trabajo

### Envío y Evaluación de Soluciones
1. El usuario envía su código fuente
2. El sistema compila el código
3. Se ejecuta la solución con los casos de prueba
4. Se comparan las salidas con las respuestas esperadas
5. Se genera y almacena el veredicto
6. Se actualiza el ranking si corresponde

### Gestión de Torneos
1. El administrador crea un nuevo torneo
2. Se configuran fechas y reglas
3. Se añaden problemas al torneo
4. Se activa el torneo en la fecha programada
5. Los participantes pueden enviar soluciones
6. Se genera un ranking automático
7. El sistema cierra el torneo automáticamente en la fecha establecida

## Requisitos del Sistema

### Servidor
- XAMPP instalado
- PHP 7.0 o superior
- MariaDB 10.0 o superior
- Compiladores para C, C++, Java y Python

### Cliente
- Navegador web moderno
- Conexión a Internet

## Consideraciones de Seguridad
- Validación de entrada de usuarios
- Protección contra inyección SQL
- Sanitización de código enviado
- Sistema de permisos por rol
- Protección contra envíos maliciosos
- Límites de recursos del sistema

## Futuras Mejoras
- Soporte para más lenguajes de programación
- Sistema de práctica fuera de torneos
- Implementación de sistema de discusión
- Mejoras en la interfaz de usuario
- Sistema de reportes y estadísticas
- Integración con IDEs populares

## Conclusión
Code Oran representa una solución completa para la gestión de competencias de programación, proporcionando una plataforma robusta y segura para la evaluación automática de código y la organización de torneos de programación competitiva.
