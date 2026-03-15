export type Locale = "en" | "sv";

export interface Translations {
  appName: string;
  setup: {
    title: string;
    pasteLabel: string;
    pastePlaceholder: string;
    addPasteButton: string;
    addOneLabel: string;
    addOnePlaceholder: string;
    addOneButton: string;
    noNamesError: string;
    startCheckin: string;
    peopleList: string;
    removePerson: string;
    noPeople: string;
    noPeopleHint: string;
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
  };
  reset: {
    button: string;
    resetStateButton: string;
    confirmTitle: string;
    confirmFull: string;
    confirmState: string;
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
    pasteLabel: "Paste a list (one name per line)",
    pastePlaceholder: "Alice\nBob\nCharlie\n...",
    addPasteButton: "Add from list",
    addOneLabel: "Add one person",
    addOnePlaceholder: "Name",
    addOneButton: "Add",
    noNamesError: "Please enter at least one name.",
    startCheckin: "Start Check-In",
    peopleList: "Participants",
    removePerson: "Remove",
    noPeople: "No participants yet.",
    noPeopleHint: "Add names above to get started.",
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
  },
  reset: {
    button: "Reset Everything",
    resetStateButton: "Reset Status Only",
    confirmTitle: "Are you sure?",
    confirmFull: "This will clear all participants and all status. You will start fresh. This cannot be undone.",
    confirmState: "This will reset the HERE / NOT HERE / LEFT status for all participants. Names will be kept. This cannot be undone.",
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
    pasteLabel: "Klistra in en lista (ett namn per rad)",
    pastePlaceholder: "Alice\nBob\nCarlos\n...",
    addPasteButton: "Lägg till från lista",
    addOneLabel: "Lägg till en person",
    addOnePlaceholder: "Namn",
    addOneButton: "Lägg till",
    noNamesError: "Ange minst ett namn.",
    startCheckin: "Starta incheckning",
    peopleList: "Deltagare",
    removePerson: "Ta bort",
    noPeople: "Inga deltagare ännu.",
    noPeopleHint: "Lägg till namn ovan för att komma igång.",
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
  },
  reset: {
    button: "Återställ allt",
    resetStateButton: "Återställ status",
    confirmTitle: "Är du säker?",
    confirmFull: "Detta raderar alla deltagare och all status. Du börjar om från början. Det går inte att ångra.",
    confirmState: "Detta återställer HÄR / INTE HÄR / HAR LÄMNAT-status för alla deltagare. Namnen behålls. Det går inte att ångra.",
    cancel: "Avbryt",
    confirmYes: "Ja, återställ",
  },
  common: {
    person: "person",
    persons: "personer",
  },
};

export const translations: Record<Locale, Translations> = { en, sv };

export function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() ?? "en";
  if (lang.startsWith("sv")) return "sv";
  return "en";
}
