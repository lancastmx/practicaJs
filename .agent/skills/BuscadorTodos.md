# Skill: BuscadorTodos
> Busca y lista todos los TODO (tareas pendientes) en los archivos de todo el proyecto.

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: "BuscadorTodos"
- Ante la necesidad de: Busca y lista todos los TODO (tareas pendientes) en los archivos de todo el proyecto.

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
{ "action": "execute", "params": { "path": "opcional/ruta/relativa" } }
```