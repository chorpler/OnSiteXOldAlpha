###CSS UNITS:

####Relative Units:
| Unit        | Description                                                                               |
| ----------  | ----------                                                                                |
| em          | Relative to the font-size of the element (2em means 2 times the size of the current font) |
| ex          | Relative to the x-height of the current font (rarely used)                                |
| ch          | Relative to width of the "0" (zero)                                                       |
| rem         | Relative to font-size of the root element                                                 |
| vw          | Relative to 1% of the width of the viewport*                                              |
| vh          | Relative to 1% of the height of the viewport*                                             |
| vmin        | Relative to 1% of viewport's* smaller dimension                                           |
| vmax        | Relative to 1% of viewport's* larger dimension                                            |
| %           |                                                                                           |

####Absolute Units:
| Unit   | Description                    |
| ------ | ----------                     |
| cm     | centimeters                    |
| mm     | millimeters                    |
| in     | inches `(1in = 96px = 2.54cm)` |
| px *   | pixels `(1px = 1/96th of 1in)` |
| pt     | points `(1pt = 1/72 of 1in)`   |
| pc     | picas `(1pc = 12 pt)`          |


##### Conversion:
`(ColUnit/RowUnit)`

|`Row ↓`| `Col→` | in     | cm      | mm     | in             | px *    | pt      | pc     |
| ----  | ----  :| ----  :| ----   :| ----  :| ----          :| ----   :| ----   :| ----  :|
| cm    |        | 2.54   | 1       | 10     | 0.39370078740  | 37.795  | 28.346 | 340.157 |
| mm    |        | 25.4   | 0.1     | 1      | 0.039          | 3.780   | 2.835  | 34.016  |
| in    |        | 1      | 2.54    | 25.4   | 1              | 96      | 72     | 864     |
| px *  |        | 96     | 0.0265  | 0.265  | 0.010          | 1       | 0.75   | 9       |
| pt    |        | 72     | 0.035   | 0.353  | 0.014          | 1.333   | *`1    | 12      |
| pc    |        | 864    | 0.0029  | 0.029  | 0.001157       | 0.111   | 0.0833 | 1       |


