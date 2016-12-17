### Radio button list with `*ngFor`
in the component class create an array of values for the list:

```js
electronicFirstWord = ["AC Electrical", "Communication Equipment", "Computer"," Control System", "DPM System", "IVMS", "Radioactive Densometer", "RTO", "Sensor", "Wiring" ];
```

in the html template for that component:

```html
<div class="radio" *ngFor="let efw of electronicFirstWord" >
  <label>
  <input type="radio"
         name="electronicFirstWord"
         [(ngModel)]="wOrder.electronicFirstWord"
         [value]="efw">
  </label>
</div>
```
