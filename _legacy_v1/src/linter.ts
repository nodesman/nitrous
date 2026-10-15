import * as ts from 'typescript';

export interface BrakeDiagnostic {
  ruleId: string;
  ruleName: string;
  severity: 'warning' | 'error';
  message: string;
  line: number;
  character: number;
  start: number;
  length: number;
  snippet?: string;
}

export function lintTypeScript(code: string): BrakeDiagnostic[] {
  const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest, true);
  const diagnostics: BrakeDiagnostic[] = [];

  function getLineAndChar(pos: number) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
    return { line: line + 1, character: character + 1 };
  }

  function addDiagnostic(
    node: ts.Node,
    ruleId: string,
    ruleName: string,
    message: string
  ) {
    const { line, character } = getLineAndChar(node.getStart());
    diagnostics.push({
      ruleId,
      ruleName,
      severity: 'error',
      message,
      line,
      character,
      start: node.getStart(),
      length: node.getWidth(),
      snippet: node.getText(sourceFile).substring(0, 100)
    });
  }

  // Helper to count lines of a node
  function getNodeLineCount(node: ts.Node): number {
    const start = getLineAndChar(node.getStart()).line;
    const end = getLineAndChar(node.getEnd()).line;
    return Math.max(1, end - start + 1);
  }

  function visit(node: ts.Node) {
    // --- Rule 2: Don't use the 'else' keyword ---
    if (ts.isIfStatement(node) && node.elseStatement) {
      addDiagnostic(
        node.elseStatement,
        'no-else',
        'No Else Keyword',
        'Object Calisthenics: Avoid the "else" keyword. Use guard clauses, early returns, or polymorphism instead.'
      );
    }

    // --- Rule 6: Don't abbreviate ---
    if (
      ts.isIdentifier(node) &&
      !ts.isTypeReferenceNode(node.parent) &&
      !ts.isImportSpecifier(node.parent)
    ) {
      const name = node.text;
      const allowedShortNames = new Set(['i', 'j', 'k', 'x', 'y', 'z', '_']);
      if (name.length < 3 && !allowedShortNames.has(name.toLowerCase())) {
        // Only check variables, parameters, classes, functions, properties
        const isDeclaration =
          ts.isVariableDeclaration(node.parent) ||
          ts.isParameter(node.parent) ||
          ts.isFunctionDeclaration(node.parent) ||
          ts.isMethodDeclaration(node.parent) ||
          ts.isClassDeclaration(node.parent) ||
          ts.isPropertyDeclaration(node.parent) ||
          ts.isPropertySignature(node.parent);

        if (isDeclaration && node.parent.name === node) {
          addDiagnostic(
            node,
            'no-abbreviation',
            "Don't Abbreviate",
            `Variable or entity name "${name}" is too short (${name.length} chars). Keep names descriptive (>2 chars).`
          );
        }
      }
    }

    // --- Rule 7: Keep entities small (Part 1: Functions/Methods) ---
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node)) {
      const lines = getNodeLineCount(node);
      if (lines > 15) {
        const name = ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) 
          ? (node.name ? ` "${node.name.getText()}"` : '') 
          : ' Arrow Function';
        addDiagnostic(
          node,
          'small-entities',
          'Keep Entities Small',
          `Function${name} has ${lines} lines. Keep functions/methods under 15 lines.`
        );
      }

      // --- Rule 1: Only one level of indentation per method ---
      // Traverse the method body to count nesting levels of control structures
      if (node.body) {
        checkNesting(node.body, 0);
      }
    }

    // --- Class-level Rules (Rule 3, 4, 7, 8, 9) ---
    if (ts.isClassDeclaration(node)) {
      // Rule 7: Keep entities small (Part 2: Classes)
      const lines = getNodeLineCount(node);
      if (lines > 60) {
        const name = node.name ? ` "${node.name.text}"` : 'Anonymous Class';
        addDiagnostic(
          node,
          'small-entities',
          'Keep Entities Small',
          `Class${name} has ${lines} lines. Keep classes under 60 lines.`
        );
      }

      const properties = node.members.filter(ts.isPropertyDeclaration);
      
      // Rule 8: No classes with more than two instance variables
      if (properties.length > 2) {
        addDiagnostic(
          node.name || node,
          'max-instance-vars',
          'Max 2 Instance Variables',
          `Class has ${properties.length} instance variables. Object Calisthenics limits classes to at most 2 instance variables to enforce high cohesion.`
        );
      }

      // Rule 3: Wrap all primitives and strings
      properties.forEach(prop => {
        if (prop.type) {
          const typeText = prop.type.getText();
          const primitives = ['string', 'number', 'boolean', 'any', 'unknown'];
          if (primitives.includes(typeText) || (ts.isArrayTypeNode(prop.type) && primitives.includes(prop.type.elementType.getText()))) {
            addDiagnostic(
              prop,
              'wrap-primitives',
              'Wrap Primitives',
              `Property "${prop.name.getText()}" is a raw primitive type (${typeText}). Wrap it in a specific Value Object to increase type safety and domain semantics.`
            );
          }
        }
      });

      // Rule 4: First class collections
      const collections = properties.filter(prop => {
        if (!prop.type) return false;
        const typeText = prop.type.getText();
        return (
          ts.isArrayTypeNode(prop.type) ||
          typeText.startsWith('Array<') ||
          typeText.startsWith('Map<') ||
          typeText.startsWith('Set<')
        );
      });

      if (collections.length > 0 && properties.length > 1) {
        addDiagnostic(
          node.name || node,
          'first-class-collections',
          'First Class Collections',
          'Class contains a collection and other properties. A class wrapping a collection should contain no other properties.'
        );
      }

      // Rule 9: No getters/setters (Tell, Don't Ask)
      node.members.forEach(member => {
        if (ts.isGetAccessor(member) || ts.isSetAccessor(member)) {
          addDiagnostic(
            member.name,
            'no-getters-setters',
            'No Getters or Setters',
            'Avoid getters and setters. Tell the object what to do (behavior) instead of asking for its state.'
          );
        }
      });
    }

    // --- Rule 5: One dot per line (Law of Demeter) ---
    if (ts.isPropertyAccessExpression(node)) {
      let dotCount = 0;
      let curr: ts.Expression = node;
      while (curr) {
        if (ts.isPropertyAccessExpression(curr)) {
          dotCount++;
          curr = curr.expression;
        } else if (ts.isCallExpression(curr)) {
          curr = curr.expression;
        } else {
          break;
        }
      }
      // If dot count > 2 (e.g., a.b.c.d), trigger error
      if (dotCount > 2) {
        addDiagnostic(
          node,
          'law-of-demeter',
          'One Dot Per Line',
          `Method chaining has ${dotCount} dots. Follow the Law of Demeter: only talk to immediate friends (max 1 or 2 dots).`
        );
      }
    }

    ts.forEachChild(node, visit);
  }

  // Indentation/Nesting helper for Rule 1
  function checkNesting(node: ts.Node, currentDepth: number) {
    let newDepth = currentDepth;
    const isControlStructure =
      ts.isIfStatement(node) ||
      ts.isForStatement(node) ||
      ts.isForInStatement(node) ||
      ts.isForOfStatement(node) ||
      ts.isWhileStatement(node) ||
      ts.isDoStatement(node) ||
      ts.isSwitchStatement(node);

    if (isControlStructure) {
      newDepth++;
      if (newDepth > 1) {
        addDiagnostic(
          node,
          'one-level-nesting',
          'One Level of Indentation',
          `Nested control structure found at depth ${newDepth}. Keep code clean by extracting nested blocks into their own methods.`
        );
      }
    }

    ts.forEachChild(node, child => checkNesting(child, newDepth));
  }

  visit(sourceFile);
  return diagnostics;
}
