export type Locale = "en" | "sv" | "es";

export interface Translations {
  appName: string;
  setup: {
    title: string;
    addPersonsLabel: string;
    addPersonsPlaceholder: string;
    addButton: string;
    noNamesError: string;
    startCheckin: string;
    peopleList: string;
    removePerson: string;
    noPeople: string;
    noPeopleHint: string;
    resetConfirm: string;
  };
  checkin: {
    title: string;
    hereButton: string;
    notHereButton: string;
    previous: string;
    next: string;
    progressOf: string;
    done: string;
    goToCheckout: string;
    backToSetup: string;
    allDone: string;
    allDoneHint: string;
    pending: string;
    resetConfirm: string;
  };
  checkout: {
    title: string;
    hereLabel: string;
    leftLabel: string;
    noOneLeft: string;
    everyoneLeft: string;
    everyoneLeftHint: string;
    backToCheckin: string;
    notHereLabel: string;
    restart: string;
    tapToMarkLeft: string;
    resetConfirm: string;
  };
  reset: {
    confirmTitle: string;
    cancel: string;
    confirmYes: string;
  };
  common: {
    person: string;
    persons: string;
  };
}

const en: Translations = {
  appName: "Is Everyone Here",
  setup: {
    title: "Add Participants",
    addPersonsLabel: "Add persons",
    addPersonsPlaceholder: "Type a name, or paste a list (one name per line)",
    addButton: "Add",
    noNamesError: "Please enter at least one name.",
    startCheckin: "Start Check-In",
    peopleList: "Participants",
    removePerson: "Remove",
    noPeople: "No participants yet.",
    noPeopleHint: "Add names above to get started.",
    resetConfirm: "This will clear the entire participants list. This cannot be undone.",
  },
  checkin: {
    title: "Check-In",
    hereButton: "HERE",
    notHereButton: "NOT HERE",
    previous: "Previous",
    next: "Next",
    progressOf: "of",
    done: "Done",
    goToCheckout: "Proceed to Check-Out",
    backToSetup: "Back to Setup",
    allDone: "All done!",
    allDoneHint: "Everyone has been marked.",
    pending: "pending",
    resetConfirm: "This will reset all check-in statuses back to pending. Names will be kept.",
  },
  checkout: {
    title: "Check-Out",
    hereLabel: "Still here",
    leftLabel: "Left",
    noOneLeft: "No one has left yet.",
    everyoneLeft: "Everyone has left!",
    everyoneLeftHint: "All participants have been checked out.",
    backToCheckin: "Back to Check-In",
    notHereLabel: "Not here",
    restart: "Restart",
    tapToMarkLeft: "Tap a name to mark them as left",
    resetConfirm: "This will move everyone back to 'still here'. The left list will be cleared.",
  },
  reset: {
    confirmTitle: "Are you sure?",
    cancel: "Cancel",
    confirmYes: "Yes, reset",
  },
  common: {
    person: "person",
    persons: "persons",
  },
};

const sv: Translations = {
  appName: "Är alla här",
  setup: {
    title: "Lägg till deltagare",
    addPersonsLabel: "Lägg till personer",
    addPersonsPlaceholder: "Skriv ett namn, eller klistra in en lista (ett namn per rad)",
    addButton: "Lägg till",
    noNamesError: "Ange minst ett namn.",
    startCheckin: "Starta incheckning",
    peopleList: "Deltagare",
    removePerson: "Ta bort",
    noPeople: "Inga deltagare ännu.",
    noPeopleHint: "Lägg till namn ovan för att komma igång.",
    resetConfirm: "Detta raderar hela deltagarlistan. Det går inte att ångra.",
  },
  checkin: {
    title: "Incheckning",
    hereButton: "HÄR",
    notHereButton: "INTE HÄR",
    previous: "Föregående",
    next: "Nästa",
    progressOf: "av",
    done: "Klar",
    goToCheckout: "Gå till utcheckning",
    backToSetup: "Tillbaka till inställningar",
    allDone: "Alla klara!",
    allDoneHint: "Alla har markerats.",
    pending: "väntande",
    resetConfirm: "Detta återställer alla incheckningsstatus till väntande. Namnen behålls.",
  },
  checkout: {
    title: "Utcheckning",
    hereLabel: "Fortfarande här",
    leftLabel: "Har lämnat",
    noOneLeft: "Ingen har lämnat ännu.",
    everyoneLeft: "Alla har lämnat!",
    everyoneLeftHint: "Alla deltagare har checkats ut.",
    backToCheckin: "Tillbaka till incheckning",
    notHereLabel: "Inte här",
    restart: "Starta om",
    tapToMarkLeft: "Tryck på ett namn för att markera som lämnat",
    resetConfirm: "Detta flyttar alla tillbaka till 'fortfarande här'. Lämnat-listan rensas.",
  },
  reset: {
    confirmTitle: "Är du säker?",
    cancel: "Avbryt",
    confirmYes: "Ja, återställ",
  },
  common: {
    person: "person",
    persons: "personer",
  },
};

const es: Translations = {
  appName: "¿Están todos aquí?",
  setup: {
    title: "Agregar participantes",
    addPersonsLabel: "Agregar personas",
    addPersonsPlaceholder: "Escribe un nombre, o pega una lista (un nombre por línea)",
    addButton: "Agregar",
    noNamesError: "Por favor ingresa al menos un nombre.",
    startCheckin: "Iniciar registro",
    peopleList: "Participantes",
    removePerson: "Eliminar",
    noPeople: "Aún no hay participantes.",
    noPeopleHint: "Agrega nombres arriba para comenzar.",
    resetConfirm: "Esto eliminará toda la lista de participantes. No se puede deshacer.",
  },
  checkin: {
    title: "Registro",
    hereButton: "PRESENTE",
    notHereButton: "AUSENTE",
    previous: "Anterior",
    next: "Siguiente",
    progressOf: "de",
    done: "Listo",
    goToCheckout: "Ir a salida",
    backToSetup: "Volver a configuración",
    allDone: "¡Todos listos!",
    allDoneHint: "Todos han sido marcados.",
    pending: "pendiente",
    resetConfirm: "Esto restablecerá todos los estados de registro a pendiente. Los nombres se conservarán.",
  },
  checkout: {
    title: "Salida",
    hereLabel: "Todavía aquí",
    leftLabel: "Se fue",
    noOneLeft: "Nadie se ha ido aún.",
    everyoneLeft: "¡Todos se fueron!",
    everyoneLeftHint: "Todos los participantes han salido.",
    backToCheckin: "Volver al registro",
    notHereLabel: "No estuvo",
    restart: "Reiniciar",
    tapToMarkLeft: "Toca un nombre para marcarlo como salido",
    resetConfirm: "Esto moverá a todos de vuelta a 'todavía aquí'. La lista de salidos se borrará.",
  },
  reset: {
    confirmTitle: "¿Estás seguro?",
    cancel: "Cancelar",
    confirmYes: "Sí, restablecer",
  },
  common: {
    person: "persona",
    persons: "personas",
  },
};

export const translations: Record<Locale, Translations> = { en, sv, es };

export function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() ?? "en";
  if (lang.startsWith("sv")) return "sv";
  if (lang.startsWith("es")) return "es";
  return "en";
}
