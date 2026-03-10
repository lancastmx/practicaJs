---
description: Este flujo asegura que cada habilidad en `.agent/skills/` tenga su lógica correspondiente en `scripts/` y que el archivo `AGENTS.md` esté sincronizado.
---

Este proceso valida que la inteligencia del agente (.agent/skills) tenga "músculos" para ejecutar (scripts/).

## 📋 Steps
1. **Inventory**: Lista archivos en `.agent/skills/*.md`.
2. **Match**: Por cada archivo encontrado, busca su pareja en `./scripts/*.js` o `./src/agents/*.js`.
3. **Execution**:
   - Si coinciden: Ejecuta `node scripts/documentador.js "Skill [nombre] verificada y lista"`.
   - Si falta el script: Genera un reporte de error en `AGENTS.md` usando el mismo documentador.

## 🛡️ Validación de Integridad
- **Mapeo de Dependencias**: Antes de ejecutar cualquier skill, el agente DEBE leer la sección `## 📂 Archivos y Activos` del `.md` de la skill.
- **Check Físico**: Ejecutar `ls` o `test -f` para cada archivo listado en 'Lógica' y 'Dependencias'.
- **Protocolo de Error**:
  - SI falta una dependencia: DETENER PROCESO INMEDIATAMENTE.
  - ACCIÓN: Notificar al usuario: "⚠️ Error Crítico: No se encuentra la dependencia [Ruta]. Reinstalando vía SkillFactory..."
  - PROHIBICIÓN: No intentes simular la funcionalidad si el archivo no existe físicamente.

## 🚫 Constraints
- No modifiques archivos dentro de `src/core` sin permiso.
- Solo usa `scripts/documentador.js` para escribir logs.