// Compatibility hook for the five strict-canon quizzes.
// Also loads the shared Hebrew completion layer used by the diary and games.
import('./he-complete.js').then(()=>window.MariaLanguage?.refresh?.()).catch(()=>{});
