
const form = document.getElementById("form");
const lista = document.getElementById("lista");
const url = "http://localhost:3000/sabores";

let sabores = [];

function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function render() {
  lista.innerHTML = "";
  sabores.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${s.nome}</strong>
        <span class="tipo-badge">${s.tipo}</span>
      </div>
      <div>
        <span class="valor">${formatarValor(s.valor)}</span>
        <button onclick="editar(${s.id})">✏️</button>
        <button onclick="deletar(${s.id})">🗑️</button>
      </div>`;
    lista.appendChild(li);
  });
}

form.onsubmit = async e => {
  e.preventDefault();
  const data = {
    nome: form.nome.value,
    tipo: form.tipo.value,
    valor: parseFloat(form.valor.value)
  };
  if (form.dataset.editando) {
    await fetch(`${url}/${form.dataset.editando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    form.dataset.editando = "";
  } else {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }
  form.reset();
  carregar();
};

async function editar(id) {
  const s = sabores.find(s => s.id === id);
  form.nome.value = s.nome;
  form.tipo.value = s.tipo;
  form.valor.value = s.valor;
  form.dataset.editando = id;
}

async function deletar(id) {
  if (confirm('Tem certeza que deseja excluir este sabor?')) {
    await fetch(`${url}/${id}`, { method: "DELETE" });
    carregar();
  }
}

async function carregar() {
  const res = await fetch(url);
  sabores = await res.json();
  render();
}

carregar();
