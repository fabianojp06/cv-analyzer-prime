

# Formulario de Envio de Curriculo (PDF via Webhook)

## Resumo
Criar uma nova tela "Enviar Curriculo" acessivel pela sidebar, com um formulario contendo input de arquivo PDF e botao de envio. O arquivo sera enviado via POST (FormData com chave `data`) para o webhook `http://localhost:5678/webhook/analisar-cv`.

---

## Mudancas

### 1. Novo componente: `src/components/ResumeUploadView.tsx`
- Formulario com:
  - Input `type="file"` com `accept=".pdf,application/pdf"`
  - Validacao: arquivo obrigatorio e deve ser PDF
  - Botao "Enviar" com estado de loading (spinner + texto "Enviando...")
  - Ao submeter: cria `FormData`, anexa o arquivo com chave **`data`**, faz `fetch` POST para `http://localhost:5678/webhook/analisar-cv`
  - Sucesso (`response.ok`): exibe alerta de sucesso usando componente `Alert` do shadcn (verde, com icone CheckCircle)
  - Erro: exibe alerta de erro com mensagem
  - Apos sucesso, limpa o input de arquivo

### 2. Sidebar (`src/components/AppSidebar.tsx`)
- Adicionar novo item de menu: "Enviar CV" com icone `Upload` (lucide-react)
- URL: `/upload`

### 3. Rotas (`src/App.tsx`)
- Adicionar rota `<Route path="upload" element={<ResumeUploadView />} />`

---

## Detalhes Tecnicos

### Logica de envio
```text
const formData = new FormData();
formData.append("data", selectedFile);

const response = await fetch("http://localhost:5678/webhook/analisar-cv", {
  method: "POST",
  body: formData,
});
```

### Estados do componente
- `file: File | null` -- arquivo selecionado
- `isLoading: boolean` -- controla o spinner do botao
- `status: "idle" | "success" | "error"` -- controla exibicao dos alertas
- `errorMessage: string` -- mensagem de erro caso o envio falhe

### Validacoes
- Arquivo obrigatorio (botao desabilitado se nenhum arquivo selecionado)
- Apenas PDF aceito (validacao no `accept` do input + verificacao do tipo MIME no submit)
- Tamanho maximo de 20MB

### UI
- Card centralizado com titulo "Enviar Curriculo", descricao e area de upload
- Input estilizado com label clicavel
- Botao com `disabled` durante loading e quando nenhum arquivo esta selecionado
- Alertas de sucesso/erro abaixo do formulario
