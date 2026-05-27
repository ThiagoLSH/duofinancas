// Barrel exports — single import surface for the Aliança UI kit.
//
// Use like:
//   import { AliancaDashboard, AliancaProfile } from './alianca';
//
// (Adjust the path to wherever you dropped the alianca-export folder.)

export {
  AlIcon,
  AlSidebar,
  AlAreaChart,
  AliancaDashboard,
} from './components/AliancaShared';

export {
  AliancaCBModule,
  AliancaMobile,
  AliancaOnboarding,
} from './screens/AliancaCBModule';

export {
  AliancaProfile,
  AliancaCBConfig,
} from './screens/AliancaProfileCB';

export {
  AliancaFixedExpenses,
  AliancaVariableExpenses,
  AliancaLancamentos,
} from './screens/AliancaExpenses';

export {
  AliancaGoals,
  AliancaSimulator,
  AliancaAnamnesis,
} from './screens/AliancaFeatures';

// Helpers and mock data (replace with your real data sources)
export * from './mockData';
