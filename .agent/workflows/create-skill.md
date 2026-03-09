---
description: Estandarizar la creación de herramientas para el sistema de agentes.
---

# Workflow: Generación Estricta de Skills

**PROHIBICIÓN:** El agente NO tiene permitido crear archivos .js o .md manualmente para una nueva skill. DEBE usar la SkillFactory existente.

## Pasos Obligatorios:
1. **Identificación:** Extraer `nombreSkill` y `descripcion` del pedido del usuario.
2. **Ejecución Técnica:** Ejecutar el comando:
   `node src/agents/SkillFactory.js [nombreSkill] "[descripcion]"`
3. **Verificación de Registro:** Abrir `AGENTS.md` y confirmar que la línea de auto-registro fue inyectada al final.
4. **Validación de Archivos:** Ejecutar un `ls` en `src/agents/` y `.agent/skills/` para confirmar la existencia física de los archivos.