// --- 1. Configuración Global de Chart.js ---
// Define estilos base para que todos los gráficos sean consistentes
Chart.defaults.font.family = "'Nunito', sans-serif";
Chart.defaults.maintainAspectRatio = false; // Permite que se adapte al contenedor CSS
Chart.defaults.plugins.legend.display = false; // Oculta leyendas por defecto
Chart.defaults.color = '#777';
Chart.defaults.scale.grid.color = '#f5f5f5';

// --- 2. Fábrica de Gráficos (Funciones Reutilizables) ---
// Estas funciones crean las instancias de Chart.js recibiendo solo los datos y colores necesarios.

// Crea gráficos de Línea (Plot Lineal)
function renderLine(id, labels, data, color) {
    new Chart(document.getElementById(id), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 2,
                tension: 0.1,
                pointBackgroundColor: 'white',
                pointBorderColor: color,
                pointRadius: 4,
                borderDash: [5, 5] // Línea punteada
            }]
        }
    });
}

// Crea Histogramas (Barras verticales unidas)
function renderHist(id, labels, data, color, bgColor) {
    new Chart(document.getElementById(id), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColor,
                borderColor: color,
                borderWidth: 1,
                barPercentage: 1.0, // Ancho total para simular histograma
                categoryPercentage: 1.0
            }]
        }
    });
}

// Crea Gráficos de Barras Horizontales
function renderBarH(id, labels, data, color, bgColor) {
    new Chart(document.getElementById(id), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColor,
                borderColor: color,
                borderWidth: 1
            }]
        },
        options: { indexAxis: 'y' } // Invierte los ejes
    });
}

// Crea Polígono de Frecuencias (Área sombreada)
function renderPoly(id, labels, data, color, bgColor) {
    new Chart(document.getElementById(id), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: color,
                backgroundColor: bgColor,
                fill: true, // Rellena el área bajo la curva
                pointRadius: 3
            }]
        }
    });
}

// Crea Ojiva (Gráfico de línea acumulada)
function renderOgive(id, labels, data, color) {
    // Cálculo matemático de Frecuencia Acumulada
    let cumulative = [];
    data.reduce((a, b, i) => cumulative[i] = a + b, 0);

    new Chart(document.getElementById(id), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: cumulative,
                borderColor: color,
                tension: 0.3,
                pointBackgroundColor: color,
                fill: 'start',
                backgroundColor: color + '20' // Añade transparencia hex
            }]
        }
    });
}

// Crea Gráfico de Pastel
function renderPie(id, labels, data) {
    // Paleta de colores variada
    let colors = ['#e74c3c', '#8e44ad', '#3498db', '#f1c40f', '#2ecc71', '#95a5a6', '#e67e22'];
    
    new Chart(document.getElementById(id), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: 'white'
            }]
        },
        // Habilita la leyenda solo para el pastel
        options: { plugins: { legend: { display: true, position: 'right', labels: { boxWidth: 10, font: {size: 9} } } } }
    });
}


// --- 3. Lógica Principal (Controlador) ---
// Define los datos específicos y orquesta el renderizado en pantalla.

function initApp() {
    
    // >>> SECCIÓN 1: DATOS CUALITATIVOS (Redes Sociales) <<<
    const qApps = ["TikTok", "Instagram", "WhatsApp", "Facebook", "X"];
    const qData = [35, 30, 20, 10, 5];
    const qColor = '#af7ac5';
    const qBg = 'rgba(175, 122, 197, 0.5)';

    // 1.1 Renderizar los 6 gráficos cualitativos
    renderLine('q-line', qApps, qData, qColor);
    renderHist('q-hist', qApps, qData, qColor, qBg);
    renderBarH('q-barh', qApps, qData, qColor, qBg);
    renderPoly('q-poly', qApps, qData, qColor, qBg);
    renderOgive('q-ogive', qApps, qData, qColor);
    renderPie('q-pie', qApps, qData);

    // 1.2 Llenar Tabla y Textos Cualitativos
    document.getElementById('raw-qual').innerText = qApps.join(', ');
    let qTable = document.getElementById('table-qual');
    qApps.forEach((app, i) => {
        let fi = qData[i];
        let w = (fi/35)*100; // Barra visual proporcional al máximo
        qTable.innerHTML += `<tr>
            <td><strong>${app}</strong></td>
            <td>${fi}</td>
            <td><div class="bar-container"><div class="bar-fill" style="width:${w}%; background:${qColor}"></div></div></td>
            <td>${fi}%</td>
        </tr>`;
    });
    document.getElementById('insight-qual').innerText = "La moda es TikTok (35%).";


    // >>> SECCIÓN 2: DATOS DISCRETOS (Hermanos) <<<
    const dLabels = ["0", "1", "2", "3", "4+"];
    const dData = [10, 40, 30, 15, 5];
    const dColor = '#48c9b0';
    const dBg = 'rgba(72, 201, 176, 0.5)';

    // 2.1 Renderizar los 6 gráficos discretos
    renderLine('d-line', dLabels, dData, dColor);
    renderHist('d-hist', dLabels, dData, dColor, dBg);
    renderBarH('d-barh', dLabels, dData, dColor, dBg);
    renderPoly('d-poly', dLabels, dData, dColor, dBg);
    renderOgive('d-ogive', dLabels, dData, dColor);
    renderPie('d-pie', dLabels, dData);

    // 2.2 Llenar Tabla Discreta
    let dRaw = [];
    let dTable = document.getElementById('table-disc');
    let dAcum = 0;
    dLabels.forEach((lab, i) => {
        let fi = dData[i];
        dAcum += fi; // Cálculo acumulado para la tabla
        for(let k=0; k<fi; k++) dRaw.push(lab); // Simulación de datos crudos
        
        dTable.innerHTML += `<tr>
            <td><strong>${lab}</strong></td>
            <td>${fi}</td>
            <td>${dAcum}</td>
            <td>${fi}%</td>
        </tr>`;
    });
    document.getElementById('raw-disc').innerText = dRaw.join(', ');
    document.getElementById('insight-disc').innerText = "Promedio aprox: 1.65 hermanos.";


    // >>> SECCIÓN 3: DATOS CONTINUOS (Estatura) <<<
    // Datos simulados de una distribución normal
    const cLabels = ["150-155", "155-160", "160-165", "165-170", "170-175", "175-180", "180+"];
    const cData = [2, 8, 20, 35, 20, 10, 5];
    const cColor = '#f0b27a';
    const cBg = 'rgba(240, 178, 122, 0.5)';

    // 3.1 Renderizar los 6 gráficos continuos
    renderLine('c-line', cLabels, cData, cColor);
    renderHist('c-hist', cLabels, cData, cColor, cBg);
    renderBarH('c-barh', cLabels, cData, cColor, cBg);
    renderPoly('c-poly', cLabels, cData, cColor, cBg);
    renderOgive('c-ogive', cLabels, cData, cColor);
    renderPie('c-pie', cLabels, cData);

    // 3.2 Llenar Tabla Continua
    let cTable = document.getElementById('table-cont');
    cLabels.forEach((lab, i) => {
        let fi = cData[i];
        let w = (fi/35)*100;
        cTable.innerHTML += `<tr>
            <td>[${lab})</td>
            <td>${(152.5 + i*5)}</td> <td>${fi}</td>
            <td><div class="bar-container"><div class="bar-fill" style="width:${w}%; background:${cColor}"></div></div></td>
        </tr>`;
    });
    document.getElementById('raw-cont').innerText = "Simulación: 100 datos generados con distribución normal (Media 170cm).";
    document.getElementById('stat-mean').innerText = "168.5";
    document.getElementById('stat-range').innerText = "150 - 185";
}

// --- 4. Utilidades ---
// Función para copiar texto al portapapeles
function copyData(id) {
    navigator.clipboard.writeText(document.getElementById(id).innerText);
    alert("Datos copiados!");
}

// Inicializar la aplicación cuando la ventana cargue
window.onload = initApp;