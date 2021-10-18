// Função para trocar as paginas da index
function abrirPagina(pagina){
	document.querySelectorAll(".sidebar-components > li").forEach((nav)=>{nav.classList.remove('active')})
	document.querySelectorAll(".tab").forEach((tab)=>{tab.style.display = 'none'})
	
	let nav = document.getElementById("nav" + pagina)
	nav.classList.add('active')
	document.getElementById("title").textContent = nav.textContent
	let pag = document.getElementById("tab" + pagina)
	//pag.classList.remove("col-6")
	pag.style.display = 'block'
	
	window.pagina = pagina
	if (pagina === "Comparar") {
		//atualizarComparar()
		return
	}
	atualizarGrafico()
}

// Ativa ou desativa o efeito de loading em botoes 
function botaoCarregando(button, isLoading) {
	btn = document.getElementById(button)
	btn.disabled = isLoading
	if(isLoading) {
		btn.classList.add('running')
	} else {
		btn.classList.remove('running')
	}
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

function graficoFx(elemId, expressao, limites, pontos, traces) {
	let data = []
	if(Array.isArray(expressao)) {
		const xValues = math.range(limites[0], limites[1], (limites[1] - limites[0]) / 10000 ).toArray()
		for (exp of expressao) {
			const funcao = math.parse(exp)
			const f = funcao.compile()
			
			const yValuesFuncao = xValues.map(function (x) {
				return f.evaluate({x: x})
			})

			const trace = {
				x: xValues,
				y: yValuesFuncao,
				type: 'scatter',
				name: 'função'
			}
			data.push(trace)
		}
		
		if (pontos) {
			const funcao = math.parse(expressao[0])
			const f = funcao.compile()
			data.push({
				x: pontos.map((x) => { return x.x }),
				y: pontos.map((x) => { return f.evaluate({x: x.x}) }),
				type: 'scatter',
				mode: 'markers+text',
				marker: {
					size: 10
				},
				text: pontos.map((x) => { return x.nome }),
				textposition: 'top',
				name: 'Pontos de Interesse'
			})
		}
	}
	else {
		const funcao = math.parse(expressao)
		const f = funcao.compile()
		
		const xValues = math.range(limites[0], limites[1], (limites[1] - limites[0]) / 10000 ).toArray()
		const yValuesFuncao = xValues.map(function (x) {
			return f.evaluate({x: x})
		})

		const trace1 = {
			x: xValues,
			y: yValuesFuncao,
			type: 'scatter',
			name: 'função'
		}
		data = [trace1]

		if (pontos) {
			data.push({
				x: pontos.map((x) => { return x.x }),
				y: pontos.map((x) => { return f.evaluate({x: x.x}) }),
				type: 'scatter',
				mode: 'markers+text',
				marker: {
					size: 10
				},
				text: pontos.map((x) => { return x.nome }),
				textposition: 'top',
				name: 'Pontos de Interesse'
			})
		}
	}
	
	layout = {
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
	config = {
		responsive: true,
		displayModeBar: true,
		displaylogo: false,
		modeBarButtonsToRemove: ['select2d', 'lasso2d']
	}
	if(traces)
		data.push(...traces)
	plot = document.getElementById(elemId)
	console.log(data)
	if(plot.calcdata)
		Plotly.react(elemId, data, layout)
	else
		Plotly.newPlot(elemId, data, layout, config)
		//Plotly.relayout(elemId, ultimoZoom)
}

function graficoFxExprId(elemId, exprId, limites, pontos) {
	const expressao = document.getElementById(exprId).value
	graficoFx(elemId, expressao, limites, pontos)
}

function atualizarFuncao() {
	try {
		let expressao = document.getElementById('expr').value
		let funcao = math.parse(expressao)
		let funcaoLatex = funcao.toTex()
		let funcaoElem = document.getElementById('funcao')
		funcaoElem.innerHTML = '$$' + funcaoLatex + '$$'
		MathJax.typeset()
		
		atualizarGrafico()
	}
	catch (err) {}
}

function atualizarGrafico() {
	let expressao = document.getElementById('expr').value
	let inicio = document.getElementById('inicio').value
	let fim = document.getElementById('fim').value
	graficoFx('plot' + pagina, expressao, [inicio, fim])
}

function atualizarComparar() {
	let expressao = document.getElementById('expr').value
	let inicio = document.getElementById('inicio').value
	let fim = document.getElementById('fim').value
	graficoFx('plotComparar1', expressao, [inicio, fim])
	graficoFx('plotComparar2', expressao, [inicio, fim])
}

function compararMetodos(metodo1, metodo2) {
	window.metodo1 = metodo1
	window.metodo2 = metodo2
	let pag1 = document.getElementById("tab" + metodo1)
	pag1.classList.add("col-6")
	pag1.style.display = 'block'
	let pag2 = document.getElementById("tab" + metodo2)
	pag2.classList.add("col-6")
	pag2.style.display = 'block'
}

function atualizarCompararMetodos(elem) {
	let ordem = ["Bisseccao", "Newton"],
	ordemElem = ordem.indexOf(elem.value),
	om1 = ordem.indexOf(window.metodo1 || "Bisseccao"),
	om2 = ordem.indexOf(window.metodo2 || "Newton")
	
	//if (ordemElem == om1 || ordemElem == om2)
		//return
	
	if(ordemElem < om1)
		window.metodo1 = elem.value
	else if (ordemElem > om2)
		window.metodo2 = elem.value
	else
		window.metodo1 = elem.value
	
	document.getElementById("compararMetodo1").value = metodo1
	document.getElementById("compararMetodo2").value = metodo2
	compararMetodos(metodo1,metodo2)
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

var penultimoZoom, ultimoZoom;

// Executa ao carregar a pagina
document.addEventListener('DOMContentLoaded', function() {
    window.pagina = "Principal"
	graficoInicial()
	abrirPagina("Principal")
	//compararMetodos("Bisseccao", "Newton")

	/*
	let plot = document.getElementById("plot")
	plot.on("plotly_relayout", (e) => {
		penultimoZoom = ultimoZoom
		ultimoZoom = e
		console.log(e)
		//Plotly.relayout(plot, update);
	})
	*/
	// Configura a Scrollbar lateral
	$("#sidebar").mCustomScrollbar({
		theme: "minimal",
		scrollInertia: 300
	})

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar, #page').toggleClass('active')
		$('.collapse.in').toggleClass('in')
		$('a[aria-expanded=true]').attr('aria-expanded', 'false')
	})
})
