/**
 * Skill: NarrativaCommit
 *
 * DEPRECADA — ya no se usa el patrón de archivo temp.
 *
 * El agente del IDE ahora lee directamente el diff que devuelve
 * AutoCommitSkill y genera la narrativa en el chat.
 *
 * Este archivo se mantiene solo para no romper imports históricos.
 */
export const run = async (payload) => {
    console.warn('[NarrativaCommitSkill] Esta skill está deprecada. El agente del IDE genera la narrativa directamente.');
    return { success: false, message: 'Skill deprecada. Ver AutoCommitSkill.' };
};
