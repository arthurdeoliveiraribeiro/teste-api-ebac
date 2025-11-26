/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
    let token;
    let nomeUsuario = faker.person.firstName();
    let email = faker.internet.email();
    let senha = faker.internet.password();
    let idUsuario = "";

    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn;
        });
    });
    before('Cadastrar e capturar ID', () => {
        // Assegure-se de que o comando `cadastrarUsuario` está retornando a resposta
        cy.cadastrarUsuario(token, nomeUsuario, email, senha)
            .then((response) => {
                // Assertivas de cadastro
                expect(response.status).equal(201);
                expect(response.body.message).to.equal("Cadastro realizado com sucesso");
                
                // CAPTURAR o ID da resposta de cadastro!
                idUsuario = response.body._id; 
                cy.log(`ID do Usuário Cadastrado: ${idUsuario}`);
            });
    });
    
    it('Deve validar contrato de usuários', () => {
       cy.request('usuarios').then(response =>{
          return contrato.validateAsync(response.body)
       })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.listarUsuarios().should((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('usuarios');
        });
    });//ok

    it('Deve cadastrar um usuário com sucesso', () => {
        const novoNome = faker.person.firstName();
        const novoEmail = faker.internet.email();
        const novaSenha = faker.internet.password();
        
        cy.cadastrarUsuario(token, novoNome, novoEmail, novaSenha)
          .should((response) => {
            expect(response.status).equal(201);
            expect(response.body.message).to.equal("Cadastro realizado com sucesso");
          });
    });//ok

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastrarUsuario(token, nomeUsuario, "aaaa", senha)
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.email).to.equal("email deve ser um email válido");
          
        });
    });//ok

    it('Deve editar um usuário previamente cadastrado', () => {
        // Novo nome e e-mail para a edição
        const novoNomeEditado = faker.person.fullName();
        const novoEmailEditado = faker.internet.email();

        // O ID usado é o que foi capturado no `before`
        cy.editarUsuario(token, idUsuario, novoNomeEditado, novoEmailEditado, senha)
          .should((response) => {
            expect(response.status).equal(200);
            expect(response.body.message).to.equal("Registro alterado com sucesso");
          });
    });//ok

    it('Deve deletar um usuário previamente cadastrado', () => {
      cy.deletarUsuario(token,idUsuario).should((response) => {
            expect(response.status).equal(200);
            expect(response.body.message).to.equal("Registro excluído com sucesso");
          });
    });//ok

});