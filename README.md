# Desafio 02

## Regras da aplicação

- Deve ser possível criar um usuário
- Deve ser possível identificar o usuário entre as requisições
- Deve ser possível registrar uma refeição feita, com as seguintes informações:
  > _As refeições devem ser relacionadas a um usuário._
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- Deve ser possível listar todas as refeições de um usuário
- Deve ser possível visualizar uma única refeição
- Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- Deve ser possível apagar uma refeição
- Deve ser possível recuperar as métricas de um usuário
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta
- O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

## Rotas

<details>
  <summary>
    <code>POST - /create-user</code>
  </summary>

Deve ser possível criar um usuário no banco de dados enviando `name` e `e-mail` por meio do `body` da requisição. Ao criar uma task o campo `session_id` e `user_id` devem ser preenchidos automaticamente.

</details>

<details>
  <summary>
    <code>POST - /meals</code>
  </summary>

Deve ser possível registrar uma refeição com os seguintes dados `name`, `description`, `date`, `time` e `Boolean` para se está dentro ou não da dieta. `user_id` deve ser preenchido automaticamente e deve retornar um erro caso o usuário não exita.

</details>

<details>
  <summary>
    <code>GET - /meals</code>
  </summary>

Deve ser possível listar todas as refeições de um usuário.

</details>

<details>
  <summary>
    <code>GET - /meals:id</code>
  </summary>

Deve ser possível visualizar uma única refeição de um usuário.

</details>

<details>
  <summary>
    <code>PUT - /meals:id</code>
  </summary>

Deve ser possível editar uma refeição pelo `id`.
Node `body` pode ser possivel receber os dados `name`, `description`, `date`, `time` e `boolean` para se está ou não dentro da dieta.

</details>

<details>
  <summary>
    <code>DELETE - /meals:id</code>
  </summary>

Deve ser possível deletar uma refeição pelo `id`.

</details>

<details>
  <summary>
    <code>GET - /meals/summary</code>
  </summary>

Deve retornar os seguintes dados total de refeições registradas de um usuário, total de refeições dentro da dieta, total de refeições fora da dieta e melhor sequencia de refeições dentro da dieta.

</details>
