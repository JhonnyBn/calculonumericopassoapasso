// Função para trocar as paginas da index
function abrirPagina(pagina){
	document.querySelectorAll(".sidebar-components > li").forEach((nav)=>{nav.classList.remove('active')})
	document.querySelectorAll(".tab").forEach((tab)=>{tab.style.display = 'none'})
	
	let nav = document.getElementById("nav" + pagina)
	nav.classList.add('active')
	document.getElementById("title").textContent = nav.textContent
	document.getElementById("tab" + pagina).style.display = 'block'
	
	window.pagina = pagina
	if (pagina !== "Principal") {
		document.getElementById("navbarRightButton").style.display = 'block'
	}
	atualizarGrafico()
}

function abrirModal() {
	$("#" + pagina + "Modal").modal('show');
}

function show(elemId) {
	document.getElementById(elemId).style.display = ''
}

function hide(elemId) {
	document.getElementById(elemId).style.display = 'none'
}

function toggle(elemId) {
	if( document.getElementById(elemId).style.display == 'none' )
		show(elemId)
	else
		hide(elemId)
}

function clearZoom() {
	ultimoZoom = {
		"xaxis.autorange": true,
		"yaxis.autorange": true
	}
}

function graficoFx(elemId, expressao, limites, pontos=[], traces=[], expressoes=[]) {
	const plot = document.getElementById(elemId)
	const layout = {
		autosize: true,
		hovermode: 'closest',
		showlegend: false,
		margin: {
			t: 50,
			b: 50,
			l: 50,
			r: 50
		}
	}
	const funcao = math.parse(expressao)
	const f = funcao.compile()
	const valoresX = math.range(limites[0], limites[1], (limites[1] - limites[0]) / 10000, true).toArray()
	const valoresY = valoresX.map(function (x) {
		return f.evaluate({x: x})
	})
	let data = [{
		x: valoresX,
		y: valoresY,
		type: 'scatter',
		name: 'função'
	}]
	
	if(traces) {
		data.push(...traces)
	}

	if(expressoes) {
		for (exp of expressoes) {
			let limites = exp.limites
			let valoresX = math.range(limites[0], limites[1], (limites[1] - limites[0]) / 10000, true).toArray()
			let parsed = math.parse(exp.expressao)
			let compiled = parsed.compile()
			data.push({
				x: valoresX,
				y: valoresX.map((x) => { return compiled.evaluate({x: x}) }),
				type: 'scatter',
				name: exp.nome || ""
			})
		}
	}
	
	if (pontos) {
		data.push({
			x: pontos.map((x) => { return x.x }),
			y: pontos.map((x) => { return f.evaluate({x: x.x}) }),
			type: 'scatter',
			name: 'Pontos de Interesse',
			text: pontos.map((x) => { return x.nome }),
			textposition: 'top',
			mode: 'markers+text',
			marker: {
				color: '#ff7f0e',
				size: 10
			}
		})
	}
	
	// se o plot ja foi criado, atualiza os dados e mantem o nivel de zoom anterior
	if(plot.calcdata) {
		Plotly.react(elemId, data, layout)
		Plotly.relayout(plot, ultimoZoom)
	}
	else {
		const config = {
			responsive: true,
			displayModeBar: true,
			displaylogo: false,
			modeBarButtonsToRemove: ['select2d', 'lasso2d']
		}
		Plotly.newPlot(elemId, data, layout, config)
		plot.on("plotly_relayout", (e) => {
			if(e != ultimoZoom) {
				ultimoZoom = e
			}
		})
	}
}

function eqReta([x0,y0], [x1,y1]) {
	// retorna a equacao da reta entre dois pontos
	return "((" + y1 + "-" + y0 + ")/(" + x1 + "-" + x0 + "))*(x-" + x0 + ")+" + y0
}

function atualizarFuncao() {
	try {
		let expressao = document.getElementById('expr').value
		let funcao = math.parse(expressao)
		let funcaoLatex = funcao.toTex()
		let funcaoElem = document.getElementById('funcao')
		funcaoElem.innerHTML = '$$' + funcaoLatex + '$$'
		MathJax.typeset()

		atualizarDerivada()
		atualizarGrafico()
	}
	catch (err) {}
}

function atualizarDerivada() {
	try {
		let expressao = document.getElementById('expr').value
		let funcao = math.parse(expressao)
		let derivada = math.derivative(funcao, 'x')
		let derivadaLatex = derivada.toTex()
		let derivadaElem = document.getElementById('derivada')
		derivadaElem.innerHTML = '$$' + derivadaLatex + '$$'
		MathJax.typeset()
	}
	catch (err) {
		document.getElementById('derivada').innerHTML = "Erro ao calcular a derivada"
	}
}

function atualizarGrafico() {
	if (pagina !== "Principal") {
		if (document.getElementById("divIteracao" + pagina).style.display === "") {
			// Caso ja algum metodo ja tenha sido calculado,
			// precisa ser calculado novamente
			abrirPagina(pagina)
			return
		}
	}
	let expressao = document.getElementById('expr').value
	let inicio = document.getElementById('inicio').value
	let fim = document.getElementById('fim').value
	clearZoom()
	graficoFx('plot' + pagina, expressao, [inicio, fim])
}

// Prepara o grafico inicial ao abrir a pagina
function graficoInicial() {
	let exprElem = document.getElementById('expr')
	exprElem.value = 'sin(x)+cos(x)'
	atualizarFuncao()
}

function tabela(tableId, title, data, opcoes) {
	let table = document.getElementById(tableId)
	let html = "<table class='table table-striped table-bordered table-hover table-responsive'>"
	if (title) {
			html += "<thead class='thead-dark'><tr>"
			for(d of title) {
					html += "<th>" + d + "</th>"
			}
			if(opcoes) {
				html += "<th>Opções</th>"
			}
			html += "</tr></thead>"
	}
	html += "<tbody>"
	for(row of data) {
			html += "<tr>"
			for(d of row) {
					html += "<td>" + d + "</td>"
			}
			if(opcoes) {
				html += "<td>"
				for(opcao of opcoes) {
					html += "<button class='btn btn-text botao-tabela-opcoes' onclick='" + opcao.action + "'>" + opcao.name + "</button>"
				}
				html += "</td>"
			}
			html += "</tr>"
	}
	html += "</tbody></table>"
	table.innerHTML = html
}

var ultimoZoom;

// Executa ao carregar a pagina
document.addEventListener('DOMContentLoaded', function() {
    window.pagina = "Principal"
	graficoInicial()
	abrirPagina("Principal")

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar, #page').toggleClass('active')
		$('.collapse.in').toggleClass('in')
		$('a[aria-expanded=true]').attr('aria-expanded', 'false')
	})
})
