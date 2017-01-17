import { Assignment } from './config.interface.techassignment';


export const Assignments = [
  { "clntCmpny": "HALLIBURTON", "locPrimry": "BROWNFIELD" , "locScndry": "PMPSHOP", "userClass": "M-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "HALLIBURTON", "locPrimry": "BROWNFIELD" , "locScndry": ""       , "userClass": "M-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "HALLIBURTON", "locPrimry": "BROWNFIELD" , "locScndry": ""       , "userClass": "E-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "HALLIBURTON", "locPrimry": "ODESSA BASE", "locScndry": ""       , "userClass": "E-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "HALLIBURTON", "locPrimry": "ODESSA BASE", "locScndry": ""       , "userClass": "M-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "HALLIBURTON", "locPrimry": "ODESSA BASE", "locScndry": ""       , "userClass": "TOPPER", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "KEANE"      , "locPrimry": "SHAWNEE"    , "locScndry": ""       , "userClass": "M-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "KEANE"      , "locPrimry": "SPRINGTOWN" , "locScndry": ""       , "userClass": "E-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "KEANE"      , "locPrimry": "SPRINGTOWN" , "locScndry": ""       , "userClass": "M-TECH", "pyrlClass": "BILLABLE"  }, 
  { "clntCmpny": "SESA"       , "locPrimry": "WESLACO"    , "locScndry": "SHOP"   , "userClass": "M-TECH", "pyrlClass": "EXPNSLABOR"}, 
  { "clntCmpny": "SESA"       , "locPrimry": "WESLACO"    , "locScndry": "OFFICE" , "userClass": "ADMIN" , "pyrlClass": "EXPNSLABOR"}, 
  { "clntCmpny": "SESA"       , "locPrimry": "LAS CUATAS" , "locScndry": ""       , "userClass": "M-TECH", "pyrlClass": "EXPNSLABOR"} 
]

export const ClassX = {
  "workSite": [
    {
      "HALLIBUTTON": {
        "BROWNFIELD": {
          "PMPSHOP": Boolean,
          "techClass": ["MTECH", "E-TECH", "TOPPER"],
          "pyrlClass": "BILLABLE"
        }
      }
    },
    {
      "ODESSA BASE": {
        "techClass": ["MTECH", "E-TECH", "TOPPER"],
        "pyrlClass": "BILLABLE"
      }
    },
    {
      "KEANE": [
        {
          "SHAWNEE": {
            "techClass": ["MTECH", "E-TECH", "TOPPER"],
            "pyrlClass": "BILLABLE"
          }
        },
        {
          "SPRINGTOWN": {
            "techClass": ["MTECH", "E-TECH", "TOPPER"],
            "pyrlClass": "BILLABLE"
          }
        }
      ]
    },
    {
      "SESA": {
        "LOCATION": [{ "WESLACO": { "SHOP": Boolean } }, "LAS  CUATAS"],
        "techClass": ["MTECH", "ADMIN", "CONTRACT"],
        "pyrlClass": "EXPNSLABOR"
      }
    }
  ]
}