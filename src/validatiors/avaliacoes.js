
export const validateAvaliacaoData = (text) => {

  if (!text || !text.length) {
    return 'O Nome é Obrigatório';
  }

  if (text.length < 3 || text.length > 100) {
    return 'O Nome deve ter entre 3 e 200 caracteres';
  }


  return undefined;
};

export const validateAvaliacaoFloat = (text, label) => {

   if (!text || !text.length) {
     return 'O Campo ', label, ' é Obrigatório';
   }

   if (text.value < 0) {
     return 'O Campo', label, 'deve ser Maior que ZERO';
   } 

  return undefined;
};

export const validateAvaliacaoInt = (text, label) => {

  if (!text || !text.length) {
    return 'O Campo ', label, ' é Obrigatório';
  }

  if (text.value < 0) {
    return 'O Campo', label, 'deve ser Maior que ZERO';
  } 

 return undefined;
};

