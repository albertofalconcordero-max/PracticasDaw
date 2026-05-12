'use strict';
const PDFDocument = require('pdfkit');
const fs = require('fs');

const OUT = 'C:\\Users\\alber\\Documents\\oracle_plsql_guide.pdf';
const doc = new PDFDocument({ size: 'A4', margins: { top: 60, bottom: 60, left: 56, right: 56 } });
doc.pipe(fs.createWriteStream(OUT));

const NAVY   = '#1a237e';
const BLUE   = '#1565c0';
const LBLUE  = '#e3f2fd';
const ORANGE = '#e65100';
const CODEBG = '#f5f5f5';
const GREEN  = '#1b5e20';
const GREENBG= '#f1f8e9';
const RED    = '#c62828';
const REDBG  = '#ffebee';
const GRAY   = '#546e7a';
const BODY   = '#212121';

const PW = doc.page.width - 112;
const LH = 14.5;   // line height for flow()

// ── Helpers ────────────────────────────────────────────────────────────────────
function resetFont(sz = 9.5) { doc.font('Helvetica').fontSize(sz).fillColor(BODY); }

function hr(color = BLUE, thick = 1) {
  const y = doc.y;
  doc.moveTo(56, y).lineTo(56 + PW, y).lineWidth(thick).strokeColor(color).stroke();
  doc.y = y + 8;
}

// Flow renderer: segments = [{text, bold, underline, color, mono, size}]
// Handles word-wrap with explicit coordinates — avoids pdfkit continued+underline bug
function flow(segments, opts = {}) {
  const x0 = opts.x || 56;
  const maxW = opts.width || PW;
  const sz = opts.size || 9.5;
  const lh  = opts.lh || LH;
  let x = x0;
  let y = doc.y;

  for (const seg of segments) {
    const fn  = seg.mono ? 'Courier' : (seg.bold ? 'Helvetica-Bold' : 'Helvetica');
    const fsz = seg.size || sz;
    const fc  = seg.color || BODY;
    doc.font(fn).fontSize(fsz).fillColor(fc);

    // tokenize keeping trailing whitespace
    const tokens = seg.text.match(/\S+\s*/g) || [seg.text];
    for (const tok of tokens) {
      const tw = doc.widthOfString(tok);
      const trimW = doc.widthOfString(tok.trimEnd());

      if (x + trimW > x0 + maxW + 2 && x > x0) {
        x = x0;
        y += lh;
      }

      doc.text(tok, x, y, { lineBreak: false });

      if (seg.underline && trimW > 0) {
        const uy = y + fsz + 0.5;
        doc.save()
          .moveTo(x, uy).lineTo(x + trimW, uy)
          .lineWidth(0.6).strokeColor(fc).stroke()
          .restore();
      }
      x += tw;
    }
  }
  doc.y = y + lh + 1;
  resetFont(sz);
}

// Simple body paragraph (no inline style needed)
function body(text, opts = {}) {
  resetFont(9.5);
  doc.text(text, { align: 'justify', ...opts });
}

// Bullet
function bullet(text, indent = 12) {
  resetFont(9.5);
  doc.text('• ' + text, 56 + indent, doc.y, { width: PW - indent });
}

// Code block
function codeBlock(text) {
  const lines = text.split('\n');
  const padV = 6, padH = 10, clh = 13;
  const bh = lines.length * clh + padV * 2;
  const y = doc.y + 4;
  doc.rect(56, y, PW, bh).fill(CODEBG);
  doc.rect(56, y, PW, bh).lineWidth(0.4).strokeColor('#90caf9').stroke();
  doc.font('Courier').fontSize(8.5).fillColor(NAVY);
  lines.forEach((ln, i) => {
    doc.text(ln, 56 + padH, y + padV + i * clh, { lineBreak: false, width: PW - padH * 2 });
  });
  doc.y = y + bh + 6;
  resetFont();
}

// Colored box for notes / warnings
function box(text, bg, textColor, bold = false) {
  resetFont(9);
  doc.font(bold ? 'Helvetica-Bold' : 'Helvetica-Oblique').fontSize(9).fillColor(textColor);
  const h = doc.heightOfString(text, { width: PW - 20 }) + 14;
  const y = doc.y + 4;
  doc.rect(56, y, PW, h).fill(bg);
  doc.text(text, 66, y + 7, { width: PW - 20 });
  doc.y += 6;
  resetFont();
}

// Table row
function tableRow(cols, widths, bg, header = false) {
  const y = doc.y;
  const rh = 22;
  let x = 56;
  widths.forEach((w, i) => {
    doc.rect(x, y, w, rh).fill(bg);
    doc.rect(x, y, w, rh).lineWidth(0.4).strokeColor('#90caf9').stroke();
    doc.font(header ? 'Helvetica-Bold' : 'Helvetica').fontSize(9)
      .fillColor(header ? 'white' : BODY)
      .text(cols[i], x + 6, y + 6, { width: w - 12, lineBreak: false });
    x += w;
  });
  doc.y = y + rh;
}

function secHeader(num, title) {
  doc.moveDown(0.5);
  const y = doc.y;
  doc.rect(56, y, PW, 26).fill(BLUE);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('white')
    .text(`  ${num}. ${title}`, 64, y + 7, { lineBreak: false });
  doc.y = y + 34;
  resetFont();
}

function sub(title) {
  doc.moveDown(0.35);
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(ORANGE).text(title);
  resetFont();
}

function lbl(text) {
  doc.font('Helvetica-Oblique').fontSize(8).fillColor(GRAY).text(text);
}

// ══════════════════════════════════════════════════════════════════════════════
// DOCUMENT
// ══════════════════════════════════════════════════════════════════════════════

// TITLE
doc.moveDown(2);
doc.font('Helvetica-Bold').fontSize(22).fillColor(NAVY)
  .text('Guía Integral de Oracle PL/SQL', { align: 'center' });
doc.font('Helvetica-Oblique').fontSize(11).fillColor(GRAY)
  .text('Estudio Técnico y Referencia Rápida', { align: 'center' });
doc.moveDown(0.5);
hr(NAVY, 3);
doc.moveDown(0.3);

// Intro paragraph — inline underlines via flow()
flow([
  { text: 'Como Ingeniero Senior de Software, el dominio de PL/SQL no se limita a conocer la sintaxis, sino a comprender la ' },
  { text: 'gestión eficiente de recursos', underline: true },
  { text: ', la ' },
  { text: 'modularidad', underline: true },
  { text: ' y la ' },
  { text: 'resiliencia del código ante cambios en el esquema', underline: true },
  { text: '. PL/SQL es la extensión procedimental de Oracle para SQL, permitiendo el envío de bloques de código completos al servidor para ' },
  { text: 'minimizar el tráfico de red', underline: true },
  { text: ' y ' },
  { text: 'maximizar el rendimiento', underline: true },
  { text: '.' },
]);
hr();

// ── 1. INTRODUCCIÓN ───────────────────────────────────────────────────────────
secHeader(1, 'Introducción y Configuración del Entorno');
body('Para trabajar profesionalmente, el entorno debe ser consistente. El uso de contenedores permite aislar la base de datos de la máquina local.');
sub('Configuración con Docker (Oracle XE)');
body('A diferencia de otras imágenes, las oficiales de Oracle suelen residir en el registro de contenedores de Oracle.');
bullet('1. Descarga de imagen:');
codeBlock('docker pull container-registry.oracle.com/database/express:21.3.0-xe');
bullet('2. Despliegue del contenedor:');
bullet('Puerto 1521: Listener estándar de Oracle.', 24);
bullet('ORACLE_PWD: Clave para usuarios SYS y SYSTEM.', 24);

sub('Configuración en SQL Developer y SQL*Plus');
bullet('Conexión inicial: Use el usuario system, puerto 1521 y el SID XE.');
bullet('Habilitación de salida: En PL/SQL, para visualizar resultados de DBMS_OUTPUT, es obligatorio ejecutar:');
codeBlock('SET SERVEROUTPUT ON;');
bullet('Creación de usuario de desarrollo.');
box('Nota Técnica: Al ejecutar bloques anónimos en consolas (SQL*Plus), debe añadir una barra inclinada (/) al final del bloque para que el motor procese la entrada.', GREENBG, GREEN);

// ── 2. FUNDAMENTOS ────────────────────────────────────────────────────────────
secHeader(2, 'Fundamentos de PL/SQL: Estructura y Variables');
sub('Anatomía del Bloque');
body('Un bloque PL/SQL se divide en:');
flow([{ text: '• DECLARE:', bold: true }, { text: ' (Opcional) Declaración de tipos, variables y cursores.' }], { x: 68 });
flow([{ text: '• BEGIN:', bold: true },    { text: ' (Obligatorio) Lógica de ejecución.' }], { x: 68 });
flow([{ text: '• EXCEPTION:', bold: true },{ text: ' (Opcional) Manejo de errores.' }], { x: 68 });
flow([{ text: '• END;:', bold: true },     { text: ' (Obligatorio) Cierre del bloque.' }], { x: 68 });

sub('Variables, Subtipos y Eficiencia');
body('Un Senior Engineer prioriza el uso de tipos optimizados:');
bullet('Escalares: NUMBER, VARCHAR2, DATE, BOOLEAN.');
flow([
  { text: '• Optimización aritmética: Para cálculos pesados, utilice ', x: 68 },
  { text: 'PLS_INTEGER', bold: true, underline: true },
  { text: ' o ' },
  { text: 'BINARY_INTEGER', bold: true, underline: true },
  { text: '. Estos tipos requieren menos almacenamiento y son más rápidos que NUMBER ya que utilizan aritmética de enteros de hardware.' },
], { x: 68 });
flow([
  { text: '• ' },
  { text: 'SUBTYPE:', bold: true, underline: true },
  { text: ' Crucial para la mantenibilidad. Permite crear alias de tipos existentes:' },
], { x: 68 });
codeBlock('SUBTYPE t_nombre IS VARCHAR2(100);');

sub('Entrada de datos y Literales');
body("Para interactuar mediante prompts, se usa el ampersand (&).");
box("Gotcha: Si el input es una cadena, debe envolverse en comillas simples: v_nombre := '&input_usuario';", GREENBG, GREEN);

// ── 3. OPERADORES ─────────────────────────────────────────────────────────────
secHeader(3, 'Operadores y Expresiones');
sub('Precedencia de Operadores (Jerarquía de Evaluación)');
body('Es vital conocer el orden para evitar errores lógicos:');
['1. Exponenciación: **',
 '2. Identidad/Negación: +, -',
 '3. Multiplicación/División: *, /',
 '4. Adición/Sustracción/Concatenación: +, -, ||',
 '5. Comparación: =, !=, <>, <, >, <=, >=, IS NULL, LIKE, BETWEEN, IN.',
].forEach(t => bullet(t));
sub('La Tabla DUAL');
body('En Oracle, para evaluar funciones o literales fuera de una tabla física, usamos DUAL:');
codeBlock('SELECT sysdate FROM dual;');

// ── 4. CONTROL DE FLUJO ───────────────────────────────────────────────────────
secHeader(4, 'Estructuras de Control de Flujo');
sub('Bifurcaciones Condicionales');
flow([
  { text: '• IF-THEN-ELSIF-ELSE:', bold: true },
  { text: ' Estructura clásica. Recuerde terminar siempre con ' },
  { text: 'END IF;', bold: true, underline: true },
  { text: '.' },
], { x: 68 });
bullet('CASE:');
bullet('Con selector: Compara una variable contra valores fijos.', 24);
flow([
  { text: '  • De búsqueda (Searched): Permite evaluar condiciones complejas en cada WHEN. Termina con ' },
  { text: 'END CASE;', bold: true, underline: true },
  { text: '.' },
], { x: 68 });

// ── 5. BUCLES ─────────────────────────────────────────────────────────────────
secHeader(5, 'Bucles y Estructuras Iterativas');
flow([
  { text: '• 1. LOOP Básico: Requiere ' },
  { text: 'EXIT WHEN', bold: true, underline: true },
  { text: ' para evitar bucles infinitos.' },
], { x: 68 });
bullet('2. WHILE LOOP: Evalúa la condición al inicio.');
bullet('3. FOR Numérico: Itera un rango definido. La palabra REVERSE invierte el sentido.');
flow([
  { text: '• 4. FOR de Cursor: La forma más ' },
  { text: 'eficiente y limpia', underline: true },
  { text: ' de recorrer registros de base de datos; Oracle gestiona la apertura, el fetch y el cierre automáticamente.' },
], { x: 68 });

// ── 6. INTERACCIÓN CON BD ─────────────────────────────────────────────────────
secHeader(6, 'Interacción con la Base de Datos y Atributos de Tipo');
sub('Atributos de Anclaje (%TYPE y %ROWTYPE)');
flow([
  { text: 'Esta es la ' },
  { text: 'mejor práctica', bold: true, underline: true },
  { text: ' para evitar que el código se rompa si cambia el esquema:' },
]);
flow([
  { text: '• v_precio producto.precio', mono: true },
  { text: '%TYPE', bold: true, underline: true, mono: true },
  { text: '; — Vincula la variable al tipo exacto de la columna.' },
], { x: 68 });
flow([
  { text: '• v_prod_rec producto', mono: true },
  { text: '%ROWTYPE', bold: true, underline: true, mono: true },
  { text: '; — Crea un registro que mapea toda la fila de la tabla.' },
], { x: 68 });

sub('SELECT INTO');
flow([
  { text: 'Asigna resultados de SQL a variables. ' },
  { text: 'Restricción: La consulta debe devolver exactamente una fila.', bold: true, underline: true },
  { text: ' De lo contrario, lanzará ' },
  { text: 'NO_DATA_FOUND', bold: true, color: RED },
  { text: ' o ' },
  { text: 'TOO_MANY_ROWS', bold: true, color: RED },
  { text: '.' },
]);

// ── 7. MODULARIDAD ────────────────────────────────────────────────────────────
secHeader(7, 'Modularidad: Procedimientos, Funciones y Paquetes');
sub('Subprogramas');
bullet('Procedimientos: Ejecutan una lógica (acción).');
flow([
  { text: '• Funciones: Calculan y retornan un valor obligatorio (' },
  { text: 'RETURN', bold: true, underline: true },
  { text: ').' },
], { x: 68 });

sub('Parámetros');
flow([{ text: '• IN:', bold: true }, { text: ' Solo lectura.' }], { x: 68 });
flow([{ text: '• OUT:', bold: true }, { text: ' Permite «retornar» múltiples valores desde un procedimiento asignándolos a las variables del llamador.' }], { x: 68 });
flow([{ text: '• IN OUT:', bold: true }, { text: ' El valor entra, se modifica y sale.' }], { x: 68 });

sub('Paquetes (Encapsulación)');
body('Los paquetes permiten agrupar lógica relacionada y ocultar la implementación:');
flow([{ text: '• Especificación (Spec):', bold: true }, { text: ' Interfaz pública (firmas de métodos).' }], { x: 68 });
flow([{ text: '• Cuerpo (Body):', bold: true }, { text: ' Implementación privada. Permite declarar variables y subprogramas privados no visibles desde fuera del paquete.' }], { x: 68 });

// ── 8. CURSORES Y TRIGGERS ────────────────────────────────────────────────────
secHeader(8, 'Gestión Avanzada de Datos: Cursores y Triggers');
sub('Ciclo de Vida del Cursor Explícito');
flow([{ text: '• DECLARE:', bold: true }, { text: ' Define la consulta.' }], { x: 68 });
flow([{ text: '• OPEN:', bold: true },    { text: ' Ejecuta la consulta y posiciona el puntero.' }], { x: 68 });
flow([{ text: '• FETCH:', bold: true },   { text: ' Extrae la fila actual hacia variables.' }], { x: 68 });
flow([
  { text: '• ' },
  { text: 'CLOSE: Obligatorio.', bold: true, underline: true },
  { text: ' Libera el área de contexto en memoria para evitar fugas (memory leaks).' },
], { x: 68 });

sub('Triggers (Disparadores)');
body('Ejecución automática ante eventos DML.');
flow([
  { text: '• Nivel de Fila (FOR EACH ROW): Permite usar pseudoregistros ' },
  { text: ':OLD', bold: true, underline: true },
  { text: ' (valor previo) y ' },
  { text: ':NEW', bold: true, underline: true },
  { text: ' (valor nuevo).' },
], { x: 68 });
box('Tablas Mutantes (ORA-04091): Ocurre cuando un Trigger de fila intenta consultar la misma tabla que está siendo modificada. Se soluciona rediseñando la lógica a nivel de sentencia o mediante paquetes.', REDBG, RED, true);

// ── 9. EXCEPCIONES ────────────────────────────────────────────────────────────
secHeader(9, 'Manejo de Excepciones y Errores');
sub('Gestión de Errores de Aplicación');
flow([
  { text: 'Para lógica de negocio, se utilizan códigos personalizados en el rango ' },
  { text: '-20000 a -20999', bold: true, underline: true },
  { text: ':' },
]);
codeBlock("RAISE_APPLICATION_ERROR(-20001, 'Precio no puede ser superior a 5000');");

sub('PRAGMA EXCEPTION_INIT');
body('Asocia un nombre de excepción a un código de error de Oracle para una captura legible:');
codeBlock('DECLARE\n   e_fk_error EXCEPTION;\n   PRAGMA EXCEPTION_INIT(e_fk_error, -2292); -- Error de integridad referencial');

// ── 10. PL/SQL VS T-SQL ───────────────────────────────────────────────────────
secHeader(10, 'Pro-Tips: Comparativa PL/SQL vs. T-SQL');
doc.moveDown(0.3);
const cw = [PW * 0.27, PW * 0.36, PW * 0.37];
[
  ['Característica', 'T-SQL (SQL Server)', 'PL/SQL (Oracle)'],
  ['Concatenación', '+', '||'],
  ['Nulos', 'ISNULL(val, 0)', 'NVL(val, 0)'],
  ["Literales", "SELECT 'texto'", "SELECT 'texto' FROM dual"],
  ['Impresión', "PRINT 'msg'", "DBMS_OUTPUT.PUT_LINE('msg')"],
  ['Asignación', 'SET @v = 1', 'v := 1;'],
].forEach((row, i) => {
  tableRow(row, cw, i === 0 ? BLUE : (i % 2 === 1 ? LBLUE : 'white'), i === 0);
});
doc.moveDown(0.5);

// ── 11. CHEAT SHEET ───────────────────────────────────────────────────────────
secHeader(11, 'Chuleta de Referencia Rápida (Cheat Sheet)');

sub('1. Bloque PL/SQL Estándar');
lbl('Sintaxis Básica:');
codeBlock('SET SERVEROUTPUT ON;\nDECLARE\n  -- Declaraciones\nBEGIN\n  -- Lógica\nEXCEPTION\n  WHEN OTHERS THEN -- Manejo\nEND;\n/');
lbl('Ejemplo Práctico:');
codeBlock("SET SERVEROUTPUT ON;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE('Iniciando proceso de productos...');\nEND;\n/");

sub('2. Declaración con %TYPE y %ROWTYPE');
lbl('Sintaxis Básica:');
codeBlock('variable tabla.columna%TYPE;\nregistro tabla%ROWTYPE;');
lbl('Ejemplo Práctico:');
codeBlock('DECLARE\n  v_nombre_prod producto.nombre%TYPE;\n  v_item producto%ROWTYPE;\nBEGIN\n  SELECT * INTO v_item FROM producto WHERE codigo = 1;\nEND;');

sub('3. Operadores');
const ow = [PW * 0.30, PW * 0.70];
[
  ['Categoría', 'Operadores'],
  ['Aritméticos', '+, -, *, /, **'],
  ['Lógicos', 'AND, OR, NOT'],
  ['Comparación', '=, !=, <>, IS NULL, LIKE'],
  ['Concatenación', '||'],
].forEach((row, i) => {
  tableRow(row, ow, i === 0 ? BLUE : (i % 2 === 1 ? LBLUE : 'white'), i === 0);
});
doc.moveDown(0.3);

sub('4. Estructuras de Control');
lbl('Sintaxis Básica:');
codeBlock('IF condicion THEN ... ELSIF condicion THEN ... ELSE ... END IF;\nCASE variable WHEN valor THEN ... ELSE ... END CASE;');
lbl('Ejemplo Práctico:');
codeBlock("IF v_precio > 100 THEN\n  DBMS_OUTPUT.PUT_LINE('Caro');\nELSE\n  DBMS_OUTPUT.PUT_LINE('Asequible');\nEND IF;");

sub('5. Bucles');
lbl('Sintaxis Básica:');
codeBlock('FOR i IN [REVERSE] inicio..fin LOOP ... END LOOP;\nFOR reg IN cursor_name LOOP ... END LOOP;');
lbl('Ejemplo Práctico:');
codeBlock("FOR r_prod IN (SELECT nombre FROM producto) LOOP\n  DBMS_OUTPUT.PUT_LINE('Producto: ' || r_prod.nombre);\nEND LOOP;");

sub('6. Procedimientos y Funciones');
lbl('Sintaxis Básica:');
codeBlock('CREATE OR REPLACE PROCEDURE p (param IN OUT tipo) AS BEGIN ... END;\nCREATE OR REPLACE FUNCTION f RETURN tipo AS BEGIN RETURN val; END;');
lbl('Ejemplo Práctico:');
codeBlock('CREATE OR REPLACE PROCEDURE ajuste_precio (p_cod IN NUMBER, p_incremento IN NUMBER) AS\nBEGIN\n  UPDATE producto SET precio = precio + p_incremento WHERE codigo = p_cod;\nEND;');

sub('7. Cursores');
lbl('Sintaxis Básica:');
codeBlock('CURSOR c_nom IS SELECT ...;\nOPEN c_nom; FETCH c_nom INTO var; CLOSE c_nom;');
lbl('Ejemplo Práctico:');
codeBlock('DECLARE\n  CURSOR c_prods IS SELECT nombre FROM producto;\n  v_nom producto.nombre%TYPE;\nBEGIN\n  OPEN c_prods;\n  FETCH c_prods INTO v_nom;\n  CLOSE c_prods;\nEND;');

sub('8. Triggers');
lbl('Sintaxis Básica:');
codeBlock('CREATE OR REPLACE TRIGGER trg_name\nBEFORE|AFTER INSERT|UPDATE|DELETE ON tabla\nFOR EACH ROW BEGIN ... END;');
lbl('Ejemplo Práctico:');
codeBlock("CREATE OR REPLACE TRIGGER trg_log_precio\nBEFORE UPDATE OF precio ON producto\nFOR EACH ROW\nBEGIN\n  IF :NEW.precio < :OLD.precio THEN\n    RAISE_APPLICATION_ERROR(-20001, 'No se permite rebajar precios');\n  END IF;\nEND;");

sub('9. Gestión de Excepciones');
lbl('Sintaxis Básica:');
codeBlock('EXCEPTION\n  WHEN NO_DATA_FOUND THEN ...\n  WHEN OTHERS THEN RAISE_APPLICATION_ERROR(codigo, mensaje);');
lbl('Ejemplo Práctico:');
codeBlock("EXCEPTION\n  WHEN NO_DATA_FOUND THEN\n    DBMS_OUTPUT.PUT_LINE('El fabricante no existe.');\n  WHEN OTHERS THEN\n    RAISE_APPLICATION_ERROR(-20002, 'Error inesperado en BD');");

doc.end();
console.log('PDF generado: ' + OUT);
