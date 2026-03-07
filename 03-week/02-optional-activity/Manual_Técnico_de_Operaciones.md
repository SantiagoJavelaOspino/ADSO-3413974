# Manual Técnico de Operaciones en Terminal: Git y Comandos de Sistema

**Autor:** Análisis y Desarrollo de Software / Control de Versiones  
**Versión:** 1.0  
**Fecha:** 7 de marzo de 2026

---

## 1. Control de Versiones con Git (CLI)

El uso de la interfaz de línea de comandos (CLI) para Git permite una gestión atómica y precisa del historial de cambios de un proyecto. A diferencia de las interfaces gráficas, la terminal ofrece un control total sobre el índice y los metadatos de los commits.

### 1.1 El Ciclo de Vida del Archivo en Git

Para comprender el proceso de un commit, es fundamental distinguir los tres estados principales de un archivo en el flujo de trabajo:

1. **Working Directory (Directorio de Trabajo):** Archivos modificados que aún no han sido registrados.
2. **Staging Area (Índice):** Espacio donde se preparan los cambios que formarán parte del próximo commit.
3. **Local Repository (Repositorio Local):** Donde se almacenan permanentemente las versiones (snapshots) del proyecto.

### 1.2 Procedimiento Estándar para Realizar un Commit

Para registrar cambios de manera profesional, siga esta secuencia de comandos:

1. **Auditoría de cambios:**  
   `git status`  
   *Objetivo: Identificar archivos modificados o sin seguimiento (untracked).*

2. **Preparación de archivos (Staging):**  
   `git add <archivo>` o `git add .` para incluir todo.  
   *Objetivo: Mover los cambios al área de preparación.*

3. **Registro del Snapshot (Commit):**  
   `git commit -m "<tipo>: <descripción corta y concisa>"`  
   *Estándar recomendado: [Conventional Commits](https://www.conventionalcommits.org/).*

4. **Sincronización Remota:**  
   `git push origin <nombre_de_rama>`  
   *Objetivo: Actualizar el servidor remoto (GitHub/GitLab) con el historial local.*

---

## 2. Investigación: Comandos Esenciales de la Shell

La eficiencia de un ingeniero depende de su capacidad para navegar y manipular el sistema operativo mediante comandos base.

### 2.1 Tabla de Referencia Rápida: Navegación y Gestión

| Comando | Descripción Técnica | Caso de Uso |
| :--- | :--- | :--- |
| `pwd` | Print Working Directory. | Localizar la ruta absoluta actual. |
| `ls -la` | Listado detallado con archivos ocultos. | Revisar permisos de archivos `.env` o `.git`. |
| `mkdir -p` | Creación de directorios parentales. | Estructurar carpetas anidadas en un solo paso. |
| `rm -rf` | Eliminación recursiva y forzada. | Limpiar directorios de dependencias (ej. `node_modules`). |
| `grep` | Búsqueda global de expresiones regulares. | Localizar una cadena de texto dentro de logs extensos. |

### 2.2 Diagnóstico y Monitoreo de Recursos

Para garantizar la estabilidad de los entornos de desarrollo o producción, se utilizan los siguientes comandos:

- **`top` / `htop`**: Visualización de procesos activos, consumo de CPU y memoria RAM.
- **`df -h`**: Muestra el espacio disponible en las particiones del disco en formato legible (Gigabytes/Megabytes).
- **`chmod`**: Modificación de permisos de acceso.  
  *Ejemplo:* `chmod 400 key.pem` (Protege una llave privada para que solo sea legible por el dueño).

---

## 3. Ejemplo de Flujo Integral (Scripting)

Suponga que desea inicializar un proyecto y realizar el primer commit de forma secuencial:

```bash
# Crear estructura
mkdir mi-nuevo-proyecto && cd mi-nuevo-proyecto

# Inicializar Git y crear archivo
git init
echo "# Mi Proyecto" > README.md

# Flujo de commit
git add README.md
git commit -m "docs: inicializar repositorio con README"

# Verificar historial
git log --oneline
```
