export const validateAlunoNome = (text) => {
  
  if (!text || !text.length) {
    return 'O Nome é Obrigatório';
  }

  if (text.length < 3 || text.length > 100) {
    return 'O Nome deve ter entre 3 e 200 caracteres';
  }


  return undefined;
};


export const validateAlunoSexo = (text) => {
  
  if (!text || !text.length) {
    return 'O Campo Sexo é Obrigatório';
  }

  if (text.length != 1) {
    return 'O Campo Sexo deve ter apenas 1 caracter';
  }

  if (!text != 'F' || !text != 'M') {
    return 'O Campo Sexo deve Ser F ou M';
  }

  return undefined;
};

export const validateAlunoDataNasc = (text) => {
  
  if (!text || !text.length) {
    return 'A Data de Nascimento Sexo é Obrigatório';
  }
  
  return undefined;
};

