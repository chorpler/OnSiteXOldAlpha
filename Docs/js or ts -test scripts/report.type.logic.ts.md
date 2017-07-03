# Report Types

```js
[ "Work Order", "Standby", "Standby: HB DUNCAN", "Training", "Travel", "Sick", "Vacation" ]
```

```html
<ion-item *ngIf="type==='Travel'">
    <ion-label>Travel location </ion-label>
    <ion-select formControlName='trvl-loc'>
        <ion-option *ngFor='let site of job-sites' [value]='site'>{{site}}</ion-option>
    </ion-select>
</ion-item>

<ion-item *ngIf="type==='Training'">
    <ion-label>Training</ion-label>
    <ion-select formControlName='trnType'>
        <ion-option *ngFor='let trng of trngTypes' [value]='trng'>{{trng}}</ion-option>
    </ion-select>
</ion-item>

```

```js

```
