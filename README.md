# Evolution GO Manager

Interface web moderna para gerenciamento de instâncias WhatsApp através da Evolution GO API.

## 🚀 Features

- ✅ Gerenciamento completo de instâncias WhatsApp
- ✅ QR Code authentication em tempo real
- ✅ Envio de mensagens (texto, mídia, contatos, localização)
- ✅ Configuração de webhooks por instância
- ✅ Monitor de eventos em tempo real via WebSocket
- ✅ Dashboard com métricas e estatísticas

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Evolution GO rodando (API)

## 🔧 Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd evolution-go-manager

# Instale as dependências
npm install
```

## 🏃 Rodando o Projeto

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
npm run lint:fix
```

O projeto estará disponível em `http://localhost:5174`

## 🔐 Autenticação

No primeiro acesso, você precisará fornecer:
- **API URL**: URL da Evolution GO (ex: `http://localhost:8080`)
- **API Key**: O `GLOBAL_API_KEY` configurado no Evolution GO

Essas credenciais são salvas no localStorage do navegador.

## 📁 Estrutura do Projeto

```
evolution-go-manager/
├── src/
│   ├── components/       # Componentes React
│   │   ├── instances/   # Gerenciamento de instâncias
│   │   ├── messages/    # Envio de mensagens
│   │   ├── webhooks/    # Configuração de webhooks
│   │   ├── events/      # Monitor de eventos
│   │   └── base/        # Componentes base (Layout, Header, etc)
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # API clients e WebSocket
│   ├── hooks/           # Custom hooks
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilitários
│   └── styles/          # CSS global
├── public/              # Assets estáticos
└── PLANEJAMENTO.md      # Documentação de planejamento
```

## 🛠️ Stack Tecnológica

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **@evoapi/design-system** - Design system interno
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form + Zod** - Formulários e validação
- **Lucide React** - Ícones

## 🐳 Docker

```bash
# Build da imagem
docker build -t evolution-go-manager:latest .

# Rodar container
docker run -p 5174:80 evolution-go-manager:latest
```

## 🔗 Integração com Evolution GO

**Nota**: A URL da API e a API Key são configuradas dinamicamente na tela de login e armazenadas no localStorage do navegador.

O manager se comunica com a Evolution GO via:

- **REST API**: Todas requisições usam header `apikey`
- **WebSocket**: Para eventos em tempo real (`/ws?token=<apiKey>&instanceId=<instance>`)

### Endpoints principais:
- `POST /instance/create` - Criar instância
- `GET /instance/fetchInstances` - Listar instâncias
- `GET /instance/connect/:instanceName` - Conectar via QR Code
- `POST /message/sendText/:instanceName` - Enviar mensagem
- `POST /webhook/set/:instanceName` - Configurar webhook

Ver documentação completa em [PLANEJAMENTO.md](./PLANEJAMENTO.md)

## 📖 Documentação

- [PLANEJAMENTO.md](./PLANEJAMENTO.md) - Planejamento completo do projeto
- [Evolution GO Docs](../evolution-go/docs/wiki/) - Documentação da API

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Ver arquivo LICENSE no repositório

## 👥 Autores

- Equipe EvoAI Services

---

**Versão**: 1.0.0
**Status**: Em Desenvolvimento 🚧
