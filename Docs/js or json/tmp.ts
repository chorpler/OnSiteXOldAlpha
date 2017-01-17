export class someClass {
  var1: number = 17;
  var2: number;
  var3: string = '1';

  constructor() {
    this.somClassMeth(this.var1);
  }
  somClassMeth(var1): number {
    const someCodeLogic = (): number => { 
      // lots of crazy logic here
      return this.var1 = 42 
    };
    this.var2 = this.var1 * parseInt(this.var3);
    return this.var2;
  }
}


