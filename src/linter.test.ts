import { describe, it, expect } from 'vitest';
import { lintTypeScript } from './linter.ts';

describe('tsalum Object Calisthenics Linter Rules', () => {
  
  describe('Rule 1: One Level of Indentation per Method', () => {
    it('should pass for flat conditions', () => {
      const code = `
        function test() {
          if (true) {
            doSomething();
          }
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'one-level-nesting');
      expect(diagnostics).toHaveLength(0);
    });

    it('should fail for nested control structures', () => {
      const controlStructures = [
        'if (true) { if (false) {} }',
        'for (let i = 0; i < 10; i++) { if (true) {} }',
        'for (let key in obj) { for (let val of arr) {} }',
        'while (true) { do { } while(false); }',
        'switch(x) { case 1: if (true) {} }'
      ];

      for (const snippet of controlStructures) {
        const code = `function test() { ${snippet} }`;
        const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'one-level-nesting');
        expect(diagnostics.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Rule 2: Don\'t Use the ELSE Keyword', () => {
    it('should pass for simple if statements', () => {
      const code = `
        function test(x) {
          if (x) return 1;
          return 2;
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'no-else');
      expect(diagnostics).toHaveLength(0);
    });

    it('should fail when else keyword is used', () => {
      const code = `
        function test(x) {
          if (x) {
            return 1;
          } else {
            return 2;
          }
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'no-else');
      expect(diagnostics).toHaveLength(1);
    });
  });

  describe('Rule 3: Wrap All Primitives and Strings', () => {
    it('should pass for class with custom wrapped object types', () => {
      const code = `
        class User {
          public email: EmailAddress;
          public name: UserName;
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'wrap-primitives');
      expect(diagnostics).toHaveLength(0);
    });

    it('should fail for raw primitives (string, number, boolean, array, any, unknown)', () => {
      const primitives = ['string', 'number', 'boolean', 'any', 'unknown', 'string[]', 'number[]'];
      for (const prim of primitives) {
        const code = `
          class User {
            public value: ${prim};
          }
        `;
        const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'wrap-primitives');
        expect(diagnostics.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Rule 4: First Class Collections', () => {
    it('should pass for a class wrapping ONLY a collection', () => {
      const code = `
        class Users {
          public list: User[];
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'first-class-collections');
      expect(diagnostics).toHaveLength(0);
    });

    it('should fail if a collection is mixed with other instance properties', () => {
      const code = `
        class Department {
          public name: string;
          public employees: Employee[];
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'first-class-collections');
      expect(diagnostics.length).toBeGreaterThan(0);
    });
  });

  describe('Rule 5: One Dot Per Line (Law of Demeter)', () => {
    it('should pass for 1 or 2 dots', () => {
      const code = `
        const zip = customer.getAddress().zipCode;
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'law-of-demeter');
      expect(diagnostics).toHaveLength(0);
    });

    it('should fail for method chaining with 3 or more dots', () => {
      const code = `
        const zip = customer.getProfile().getAddress().getZipCode();
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'law-of-demeter');
      expect(diagnostics).toHaveLength(1);
    });
  });

  describe('Rule 6: Don\'t Abbreviate', () => {
    it('should pass for names longer than 2 characters and standard loop variables', () => {
      const codes = [
        `const name = "John";`,
        `for (let i = 0; i < 10; i++) {}`,
        `for (let _ = 0; _ < 10; _++) {}`,
        `import { x } from "mod";` // Imports are excluded from abbreviation check
      ];
      for (const code of codes) {
        const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'no-abbreviation');
        expect(diagnostics).toHaveLength(0);
      }
    });

    it('should fail for short declarations (variable, method, class, parameters)', () => {
      const code = `
        class C {
          public p: number;
          public run(u: string) {
            let a = 10;
          }
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'no-abbreviation');
      // Should catch: class 'C', property 'p', parameter 'u', variable 'a'
      expect(diagnostics.length).toBe(4);
    });
  });

  describe('Rule 7: Keep All Entities Small', () => {
    it('should fail for long functions (> 15 lines)', () => {
      const code = `
        function longFunc() {
          console.log(1);
          console.log(2);
          console.log(3);
          console.log(4);
          console.log(5);
          console.log(6);
          console.log(7);
          console.log(8);
          console.log(9);
          console.log(10);
          console.log(11);
          console.log(12);
          console.log(13);
          console.log(14);
          console.log(15);
          console.log(16);
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'small-entities');
      expect(diagnostics).toHaveLength(1);
    });

    it('should fail for long classes (> 60 lines)', () => {
      const code = `
        class LongClass {
          ${Array(62).fill('// line').join('\n')}
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'small-entities');
      expect(diagnostics.length).toBeGreaterThan(0);
    });
  });

  describe('Rule 8: No Classes with More Than Two Instance Variables', () => {
    it('should pass for classes with 1 or 2 properties', () => {
      const code = `
        class Point {
          public x: number;
          public y: number;
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'max-instance-vars');
      expect(diagnostics).toHaveLength(0);
    });

    it('should fail for classes with 3 or more properties', () => {
      const code = `
        class User {
          public firstName: string;
          public lastName: string;
          public age: number;
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'max-instance-vars');
      expect(diagnostics).toHaveLength(1);
    });
  });

  describe('Rule 9: No Getters / Setters', () => {
    it('should fail when getters or setters are defined', () => {
      const code = `
        class BankAccount {
          private balance: number = 0;
          get amount() { return this.balance; }
          set amount(val: number) { this.balance = val; }
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'no-getters-setters');
      expect(diagnostics).toHaveLength(2);
    });
  });

  describe('Boundary and Anonymous Cases', () => {
    it('should handle anonymous classes and functions without bodies', () => {
      const code = `
        export default class {
          public run();
        }
      `;
      const diagnostics = lintTypeScript(code);
      expect(Array.isArray(diagnostics)).toBe(true);
    });

    it('should handle class properties without type annotations', () => {
      const code = `
        class Point {
          public x = 10;
        }
      `;
      const diagnostics = lintTypeScript(code);
      // Property with no type should not crash, and should not trigger wrap-primitives or collection errors
      expect(diagnostics).toHaveLength(0);
    });

    it('should trigger warnings for long anonymous functions and arrow functions', () => {
      const code = `
        const myArrow = () => {
          console.log(1);
          console.log(2);
          console.log(3);
          console.log(4);
          console.log(5);
          console.log(6);
          console.log(7);
          console.log(8);
          console.log(9);
          console.log(10);
          console.log(11);
          console.log(12);
          console.log(13);
          console.log(14);
          console.log(15);
          console.log(16);
        };
        
        export default function() {
          console.log(1);
          console.log(2);
          console.log(3);
          console.log(4);
          console.log(5);
          console.log(6);
          console.log(7);
          console.log(8);
          console.log(9);
          console.log(10);
          console.log(11);
          console.log(12);
          console.log(13);
          console.log(14);
          console.log(15);
          console.log(16);
        }
      `;
      const diagnostics = lintTypeScript(code).filter(d => d.ruleId === 'small-entities');
      expect(diagnostics).toHaveLength(2);
    });

    it('should handle long anonymous classes, anonymous collections, and anonymous instance variable limits', () => {
      const code = `
        export default class {
          public x: string;
          public y: number;
          public z: boolean;
          public list: any[];
          ${Array(65).fill('// line').join('\n')}
        }
      `;
      const diagnostics = lintTypeScript(code);
      
      // Should flag small-entities (>60 lines) using fallback node position
      expect(diagnostics.some(d => d.ruleId === 'small-entities')).toBe(true);
      // Should flag max-instance-vars (>2 vars) using fallback node position
      expect(diagnostics.some(d => d.ruleId === 'max-instance-vars')).toBe(true);
      // Should flag first-class-collections (collection mixed with other vars) using fallback node
      expect(diagnostics.some(d => d.ruleId === 'first-class-collections')).toBe(true);
    });
  });
});
