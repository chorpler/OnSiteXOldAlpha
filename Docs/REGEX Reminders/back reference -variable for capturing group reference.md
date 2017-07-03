find:

```regex
\n(?=\d{1,5}) replace: \t
```
same as find: 

```regex
\n(\d{1,5})$ replace: \t\1
```

"\1" refers to the first capturing group (\d{1,5}) in this case, so that the "\d{1,5}" is now stored as a variable and is not replaced.  Since the "\n" is not in a group then it is not stored and thus replaced by the "\t".  The "$" refers to EOL so that only lines with only numbers are evaluated.  

Capturing groups are not the same as selected characters (or groups).  Captured groups are stored and can be back-referenced in the replace statement without overwriting that data.  Sublime gives a live preview of the capturing and selected items.  Using parenthesis for capturing groups is safe -but if group constructs are used: positive/negative lookahead/behind one needs to know what is selected vs captured in such cases.  

note: \n and (\n) are not the same: the (\n) is captured and can be back referenced.  
Example: 

string: 
`Line1
line2`
find: \n
replace \t\1 

result: `Line1  Line2`

-vs-

find: (\n)
replace \t\1 

result: 
`Line1  
Line2`
