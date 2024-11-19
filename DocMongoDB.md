1. Cart (Carrinho)
Estrutura
userEmail (String, Obrigatório): Email do usuário que criou o carrinho.
items (Array de objetos):
productId (ObjectId, Referência a Product, Obrigatório): ID do produto no carrinho.
quantity (Number, Obrigatório): Quantidade do produto no carrinho.
createdAt (Date, Padrão: Data atual): Data de criação do carrinho.

{
  "userEmail": "usuario@email.com",
  "items": [
    {
      "productId": "648dfb6c298c1d129b8b4567",
      "quantity": 3
    }
  ],
  "createdAt": "2024-11-18T22:30:00.000Z"
}

1. Order (Pedido)
Estrutura
userEmail (String, Obrigatório): Email do usuário que realizou o pedido.
items (Array de objetos):
productId (ObjectId, Referência a Product, Obrigatório): ID do produto no pedido.
quantity (Number, Obrigatório): Quantidade do produto no pedido.
address (Objeto): Endereço de entrega do pedido.
street (String): Rua.
number (String): Número.
city (String): Cidade.
state (String): Estado.
postalCode (String): Código postal.
status (String, Padrão: "Pendente"): Status do pedido (ex.: "Pendente", "Enviado", "Concluído").
createdAt (Date, Padrão: Data atual): Data de criação do pedido.

{
  "userEmail": "usuario@email.com",
  "items": [
    {
      "productId": "648dfb6c298c1d129b8b4567",
      "quantity": 2
    }
  ],
  "address": {
    "street": "Rua Exemplo",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "postalCode": "12345678"
  },
  "status": "Pendente",
  "createdAt": "2024-11-18T22:30:00.000Z"
}

1. Product (Produto)
Estrutura
name (String, Obrigatório): Nome do produto.
description (String): Descrição do produto.
price (Number, Obrigatório): Preço do produto.
stock (Number, Padrão: 0): Quantidade em estoque.
category (String, Obrigatório): Categoria do produto. Valores permitidos:
"PICOLES DE FRUTA"
"PICOLES DE CREME"
"POTES"
"POTINHOS"
image (String): URL da imagem do produto.
createdAt e updatedAt (Gerados automaticamente): Datas de criação e atualização do documento.

{
  "name": "Picolé de Morango",
  "description": "Feito com frutas naturais.",
  "price": 5.50,
  "stock": 100,
  "category": "PICOLES DE FRUTA",
  "image": "https://example.com/images/picole-morango.jpg",
  "createdAt": "2024-11-18T22:30:00.000Z",
  "updatedAt": "2024-11-18T22:30:00.000Z"
}

1. User (Usuário)
Estrutura
name (String, Obrigatório): Nome do usuário.
email (String, Obrigatório, Único): Email do usuário. Validação de email integrada.
password (String, Obrigatório, Min. 6 caracteres): Senha do usuário, armazenada com hash.
cpf (String, Obrigatório, Único): CPF do usuário. Deve conter 11 dígitos numéricos.
phone (String, Obrigatório): Telefone do usuário. Deve conter 10 ou 11 dígitos numéricos.
role (String, Padrão: "user"): Função do usuário. Valores permitidos:
"user"
"admin"
createdAt (Date, Padrão: Data atual): Data de criação do usuário.
Métodos e Hooks
userSchema.pre('save'):
Remove caracteres não numéricos de CPF e telefone antes de salvar.
Gera hash para a senha, caso tenha sido modificada.
userSchema.methods.matchPassword: Compara a senha inserida com o hash armazenado.


{
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "password": "hashed_password",
  "cpf": "12345678901",
  "phone": "11987654321",
  "role": "user",
  "createdAt": "2024-11-18T22:30:00.000Z"
}
