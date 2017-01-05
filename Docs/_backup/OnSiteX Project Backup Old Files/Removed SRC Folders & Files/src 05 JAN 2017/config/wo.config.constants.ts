export interface WorkOrder {
  tech                                              :    string          ,  // required, UI Name: "EMPLOYEE NAME AND NUMBER:"    {{ techName, usrClassification }}
  date                                              :    Date            ,  // required, UI Name: "DATE:"                        {{ showDate }}
  woNum                                             :    string          ,  // required, UI Name: "WORK ORDER NUMBER:"           <input   type=  "text"    >
  uNum                                              :    string          ,  // required, UI Name: "EQUIPMENT#:"                  <input   type=  "text"    >
  hrsMeter                                          :    number          ,  // required, UI Name: "HOURS METER:"                 <input   type=  "number"  >
  hubMeter                                          :    number          ,  // required, UI Name: "HUB METER:"                   <input   type=  "number"  >
  mileage                                           :    number          ,  // required, UI Name: "MILEAGE:"                     <input   type=  "number"  >
  trpTckt                                           :    string          ,  // optional, UI Name: "TRIP TICKET#:"                <input   type=  "text"    >
  TechMétier                                        :    TECHMÉTIER      ,  // required, UI Name: (none)                         <input   type=  "radio"   >
  sesaGrp                                           :    SESAGRP         ,  // required, UI Name: "VENDOR NAME AND CONTACT:"     <select> ...  </select>
  mechFrstW                                         :    MECHFRSTW       ,  // req-Mech, UI Name: "MECHANICAL FIRST WORD:"       <input   type=  "radio"   >
  eTechFrst                                         :    ETECHFRST       ,  // req-Elec, UI Name: "ELECTRONIC FIRST WORD:"       <input   type=  "radio"   >
  scndWord                                          :    SCNDWORD        ,  // required, UI Name: "SECOND WORD:"                 <input   type=  "radio"   >
  wOType                                            :    WOTYPE          ,  // required, UI Name: "WORK ORDER TYPE:"             <input   type=  "radio"   >
  pmNum                                             :    string          ,  // required, UI Name: "PM#"                          <input   type=  "text"    >
  pmActvty                                          :    string          ,  // required, UI Name: "PM ACTIVITY TYPE:"            <input   type=  "text"    >
  damgCode                                          :    string          ,  // optional, UI Name: "DAMAGE CODE:"                 <input   type=  "text"    >
  causeCode                                         :    string          ,  // optional, UI Name: "CAUSE CODE:"                  <input   type=  "text"    >
  assmblyObj                                        :    string          ,  // required, UI Name: "MECH/ELE ASSEMBLY OBJECT:"    <input   type=  "text"    >
  ironAssmblyObj                                    :    boolean         ,  // required, UI Name: "IRON ASSEMBLY OBJECT:"        <input   type=  "radio"   >
  flEndAssmblObj                                    :    FLENDASSMBLOBJ  ,  // optional, UI Name: "FLUID END ASSEMBLY OBJECT:"   <input   type=  "radio"   >
  other                                             :    string          ,  // optional, UI Name: "OTHER:"                       <input   type=  "text"    >
  priorWoCorrctn                                    :    string          ,  // optional, UI Name: "PRIOR WORK ORDER CORRECTION:" <input   type=  "text"    >
  woNotes                                           :    string             // required, UI Name: "SHORT DESCRIPTION OF REPAIR:" <input   type=  "text"    >
}
export const enum TECHMÉTIER {
  "Mechanic"                                       =   600               ,  // 684
  "E-TECH"                                         =   601                  // 685
}
export const enum SESAGRP {
  "SESA 1232314"                                   =   786               ,  // 786
  "SESA Keane"                                     =   787                  // 787
}
export const enum MECHFRSTW {
"AC or Heating"                                    =   100               ,  // 100
  "Accessories"                                    =   101               ,  // 101
  "Air System"                                     =   102               ,  // 102
  "Aux Power Unit"                                 =   103               ,  // 103
  "Brakes"                                         =   104               ,  // 104
  "Cab"                                            =   105               ,  // 105
  "Centrifugal Pump"                               =   106               ,  // 106
  "Compressor Blower"                              =   107               ,  // 107
  "Cooling"                                        =   108               ,  // 108
  "Cranking/Charging"                              =   109               ,  // 109
  "Crane"                                          =   110               ,  // 110
  "Driveline"                                      =   111               ,  // 111
  "Engine"                                         =   112               ,  // 112
  "Exhaust"                                        =   113               ,  // 113
  "Fluid End"                                      =   114               ,  // 114
  "Frame Chassis"                                  =   115               ,  // 115
  "Fuel System"                                    =   116               ,  // 116
  "Gearbox"                                        =   117               ,  // 117
  "Hydraulic System"                               =   118               ,  // 118
  "Lights"                                         =   119               ,  // 119
  "Manifold"                                       =   120               ,  // 120
  "Mixing System"                                  =   121               ,  // 121
  "Power End"                                      =   122               ,  // 122
  "Pre Post Inspection"                            =   123               ,  // 123
  "Preparation Group"                              =   124               ,  // 124
  "PSL"                                            =   125               ,  // 125
  "PTO"                                            =   126               ,  // 126
  "Safety Items"                                   =   127               ,  // 127
  "Steering"                                       =   128               ,  // 128
  "Suspension"                                     =   129               ,  // 129
  "Tank Bulk Pneumatic"                            =   130               ,  // 130
  "Tank Haz"                                       =   131               ,  // 131
  "Tank Non Haz"                                   =   132               ,  // 132
  "Tires"                                          =   133               ,  // 133
  "Transmission"                                   =   134               ,  // 134
  "Winch"                                          =   135               ,  // 135
  "Wreck"                                          =   136               ,  // 136
  "Wheels"                                         =   137                  // 137
}
export const enum ETECHFRST {
"AC Electrical"                                    =   240               ,  // 240
  "Communication Equipment"                        =   241               ,  // 241
  "Computer "                                      =   242               ,  // 242
  "Control System "                                =   243               ,  // 243
  "DPM System "                                    =   244               ,  // 244
  "IVMS "                                          =   245               ,  // 245
  "Radioactive Densometer "                        =   246               ,  // 246
  "RTO"                                            =   247               ,  // 247
  "Sensor "                                        =   248               ,  // 248
  "Wiring "                                        =   249                  // 249
}
export const enum SCNDWORD {
"Adjust  "                                         =   350               ,  // 350
  "Change"                                         =   351               ,  // 351
  "Clean "                                         =   352               ,  // 352
  "Diagnose "                                      =   353               ,  // 353
  "Fabricate"                                      =   354               ,  // 354
  "Inspect "                                       =   355               ,  // 355
  "Install "                                       =   356               ,  // 356
  "Missing "                                       =   357               ,  // 357
  "Modify"                                         =   358               ,  // 358
  "Rebuild "                                       =   359               ,  // 359
  "Refurbish "                                     =   360               ,  // 360
  "Regen "                                         =   361               ,  // 361
  "Repack"                                         =   362               ,  // 362
  "Replace "                                       =   363               ,  // 363
  "Repair"                                         =   364               ,  // 364
  "Road Call "                                     =   365               ,  // 365
  "Test"                                           =   366               ,  // 366
  "Upgrade "                                       =   367               ,  // 367
  "Welding Disconnect"                             =   368               ,  // 368
  "Wreck "                                         =   369                  // 369
}
export const enum WOTYPE {
"[ CERT ] Annual Certification-- (iron only)"      =   470               ,  // 470
  "[ MOD] Modification/Upgrade"                    =   471               ,  // 471
  "[ UNSC ] Unscheduled"                           =   472               ,  // 472
  "[ PREV ] Preventive Maintenance "               =   473               ,  // 473
  "[ RPM] Orders from Prev. Maintenance "          =   474                  // 474
}
export const enum FLENDASSMBLOBJ {
"FLUID END GRP "                                   =   580               ,  // 580
  "RPL FLUID END"                                  =   581               ,  // 581
  "RPL REB FLUID END"                              =   582               ,  // 582
  "FLUID END REPACK "                              =   583                  // 583
}
