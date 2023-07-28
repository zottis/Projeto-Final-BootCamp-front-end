# Trabalho final

- Professores: Douglas Nassif Roma Junior,
               Anderson Burnes 

- Alunos: José Mauricio Barbisan Zottis,
          

    ```
    npm run dev
    ```

### Login de usuários 

> POST /usuarios/login
>
> Body:
> ```json
> {
>   "email": "fulano@email.com",
>   "senha": "12345678"
> }
> ```

## Rotas autenticadas
Todas as rotas autenticadas exigem que o `token jwt` seja passado no cabeçalho (header) chamado `Authorization`.