const API_URL = "https://proweb.leoproti.com.br/alunos"; 
const form = document.getElementById("alunoForm");
const tabela = document.getElementById("tabelaAlunos");
const btnSalvar = document.getElementById("btnSalvar");


document.addEventListener("DOMContentLoaded", carregarAlunos);

async function carregarAlunos() {
  tabela.innerHTML = "";
  try {
    const resposta = await fetch(API_URL);
    const alunos = await resposta.json();

    alunos.forEach(aluno => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${aluno.id}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.turma}</td>
        <td>${aluno.curso}</td>
        <td>${aluno.matricula}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarAluno(${aluno.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deletarAluno(${aluno.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });

  } catch (erro) {
    console.error("Erro ao carregar alunos:", erro);
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluno = {
    nome: nome.value.trim(),
    turma: turma.value.trim(),
    curso: curso.value.trim(),
    matricula: matricula.value.trim()
  };

  if (!aluno.nome || !aluno.turma || !aluno.curso || !aluno.matricula) {
    alert("Preencha todos os campos!");
    return;
  }

  const id = document.getElementById("alunoId").value;
  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno)
    });

    form.reset();
    document.getElementById("alunoId").value = "";
    btnSalvar.textContent = "Salvar";
    carregarAlunos();

  } catch (erro) {
    console.error("Erro ao salvar:", erro);
  }
});


async function editarAluno(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    const aluno = await resposta.json();

    document.getElementById("alunoId").value = aluno.id;
    nome.value = aluno.nome;
    turma.value = aluno.turma;
    curso.value = aluno.curso;
    matricula.value = aluno.matricula;
    btnSalvar.textContent = "Atualizar";

  } catch (erro) {
    console.error("Erro ao buscar aluno:", erro);
  }
}


async function deletarAluno(id) {
  if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    carregarAlunos();
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
  }
}
