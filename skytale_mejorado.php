<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cifrado Escítala</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: #0f1117;
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .container {
            width: 100%;
            max-width: 700px;
        }

        h1 {
            text-align: center;
            font-size: 1.8rem;
            font-weight: 700;
            color: #a78bfa;
            margin-bottom: 0.4rem;
            letter-spacing: 0.05em;
        }

        .subtitle {
            text-align: center;
            font-size: 0.85rem;
            color: #64748b;
            margin-bottom: 2rem;
        }

        .card {
            background: #1e2130;
            border: 1px solid #2d3148;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 1.5rem;
        }

        .form-row {
            display: flex;
            gap: 1rem;
            align-items: flex-end;
            flex-wrap: wrap;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        .form-group.grow { flex: 1; min-width: 200px; }

        label {
            font-size: 0.8rem;
            font-weight: 600;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        input[type="text"],
        input[type="number"] {
            background: #0f1117;
            border: 1px solid #2d3148;
            border-radius: 8px;
            color: #e2e8f0;
            font-size: 1rem;
            padding: 0.65rem 0.9rem;
            outline: none;
            transition: border-color 0.2s;
            width: 100%;
        }

        input[type="text"]:focus,
        input[type="number"]:focus {
            border-color: #7c3aed;
        }

        input[type="number"] { width: 90px; }

        button[type="submit"] {
            background: #7c3aed;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0.65rem 1.6rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
            white-space: nowrap;
        }

        button[type="submit"]:hover  { background: #6d28d9; }
        button[type="submit"]:active { transform: scale(0.97); }

        .section-title {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
            margin-bottom: 1rem;
        }

        .matrix-wrapper { overflow-x: auto; margin-bottom: 0.5rem; }

        .matrix {
            display: inline-flex;
            flex-direction: column;
            gap: 4px;
            font-family: 'Courier New', monospace;
        }

        .matrix-row { display: flex; gap: 4px; }

        .cell {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 700;
            border: 1px solid #2d3148;
            background: #0f1117;
            color: #e2e8f0;
        }

        .cell.pad { color: #3f4a6b; border-color: #1e2535; }

        .col-0 { border-color: #7c3aed44; color: #c4b5fd; }
        .col-1 { border-color: #0ea5e944; color: #7dd3fc; }
        .col-2 { border-color: #10b98144; color: #6ee7b7; }
        .col-3 { border-color: #f59e0b44; color: #fcd34d; }
        .col-4 { border-color: #ef444444; color: #fca5a5; }
        .col-5 { border-color: #ec489944; color: #f9a8d4; }

        .result-box {
            background: #0f1117;
            border: 1px solid #2d3148;
            border-radius: 8px;
            padding: 1rem 1.2rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .result-label {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
            flex-shrink: 0;
        }

        .result-value {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            font-weight: 700;
            word-break: break-all;
        }

        .result-value.cipher { color: #a78bfa; }
        .result-value.plain  { color: #34d399; }

        .copy-btn {
            background: #2d3148;
            color: #94a3b8;
            border: none;
            border-radius: 6px;
            padding: 0.3rem 0.7rem;
            font-size: 0.78rem;
            cursor: pointer;
            flex-shrink: 0;
            transition: background 0.2s, color 0.2s;
        }
        .copy-btn:hover { background: #3d4268; color: #e2e8f0; }

        .note {
            font-size: 0.78rem;
            color: #475569;
            margin-top: 0.5rem;
        }

        .divider {
            border: none;
            border-top: 1px solid #2d3148;
            margin: 1.5rem 0;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Cifrado Escítala</h1>
    <p class="subtitle">Cifrado de transposición por columnas — técnica clásica espartana</p>

    <div class="card">
        <form method="POST">
            <div class="form-row">
                <div class="form-group grow">
                    <label for="frase">Mensaje</label>
                    <input type="text" id="frase" name="frase" placeholder="Escribe el mensaje a cifrar..."
                           value="<?= isset($_POST['frase']) ? htmlspecialchars($_POST['frase']) : '' ?>" required>
                </div>
                <div class="form-group">
                    <label for="colm">Columnas (clave)</label>
                    <input type="number" id="colm" name="colm" min="2" max="10"
                           value="<?= isset($_POST['colm']) ? (int)$_POST['colm'] : 4 ?>">
                </div>
                <div class="form-group">
                    <button type="submit">Cifrar</button>
                </div>
            </div>
        </form>
    </div>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $frase = trim($_POST['frase']);
        $colm  = max(2, min(10, (int)($_POST['colm'] ?? 4)));

        if ($frase === '') {
            echo '<div class="card"><p style="color:#f87171">El mensaje no puede estar vacío.</p></div>';
        } else {
            $original = $frase;

            $pad   = ($colm - (strlen($frase) % $colm)) % $colm;
            $frase .= str_repeat('*', $pad);

            $filas     = strlen($frase) / $colm;
            $fraseChar = str_split($frase, $colm);

            $cifrado = '';
            for ($i = 0; $i < $colm; $i++) {
                for ($j = 0; $j < $filas; $j++) {
                    $cifrado .= $fraseChar[$j][$i];
                }
            }

            $descifrado  = '';
            $cifradoChar = str_split($cifrado, $filas);
            for ($i = 0; $i < $filas; $i++) {
                for ($j = 0; $j < $colm; $j++) {
                    $descifrado .= $cifradoChar[$j][$i];
                }
            }
            $descifrado = rtrim($descifrado, '*');
    ?>

    <div class="card">
        <p class="section-title">Matriz de transposición (<?= $filas ?> filas × <?= $colm ?> columnas)</p>
        <div class="matrix-wrapper">
            <div class="matrix">
                <?php foreach ($fraseChar as $fila): ?>
                <div class="matrix-row">
                    <?php for ($c = 0; $c < $colm; $c++):
                        $char    = $fila[$c];
                        $isPad   = ($char === '*');
                        $colClass = $isPad ? 'pad' : 'col-' . ($c % 6);
                    ?>
                    <div class="cell <?= $colClass ?>"><?= htmlspecialchars($char) ?></div>
                    <?php endfor; ?>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php if ($pad > 0): ?>
        <p class="note">Se añadieron <?= $pad ?> carácter(es) de relleno (*) para completar la matriz.</p>
        <?php endif; ?>

        <hr class="divider">

        <p class="section-title">Resultados</p>

        <div class="result-box">
            <span class="result-label">Original</span>
            <span class="result-value"><?= htmlspecialchars($original) ?></span>
        </div>

        <div class="result-box">
            <span class="result-label">Cifrado</span>
            <span class="result-value cipher" id="cifrado-val"><?= htmlspecialchars($cifrado) ?></span>
            <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('cifrado-val').textContent)">Copiar</button>
        </div>

        <div class="result-box">
            <span class="result-label">Descifrado</span>
            <span class="result-value plain"><?= htmlspecialchars($descifrado) ?></span>
        </div>
    </div>

    <?php
        }
    }
    ?>
</div>
</body>
</html>
