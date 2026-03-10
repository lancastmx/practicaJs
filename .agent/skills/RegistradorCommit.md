# Skill: RegistradorCommit
> Registra los commits de Git en un archivo llamado BITACORA.md. Soporta modo incremental y modo de reescritura total.

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite registrar, guardar o actualizar la bitácora de commits.
- Cuando se pida extraer el último mensaje de commit de Git o generar el historial completo.

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
// Para modo incremental (solo agrega el último commit si no existe)
{ "action": "execute", "params": {} }

// Para modo reescritura total (borra y regenera toda la bitácora desde Git)
{ "action": "execute", "params": { "forceRewrite": true } }
```