'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.login = async (event) => {
  try {
    // Recebe os dados do app
    const { email, password } = JSON.parse(event.body);

    // Verifica se existe um arquivo no S3 com o email do usuário
    const params = {
      Bucket: 'trackymy',
      Key: `${email}.json`,
    };

    const data = await s3.getObject(params).promise();

    // Os dados dentro do arquivo serão um JSON, então tem que parseá-los
    const userData = JSON.parse(data.Body.toString());

    // Se o password for o mesmo, retorna ok
    if (userData.password === password) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Login bem-sucedido.',
          userData: userData,
        }),
      };
    } else {
      // Se não existir o arquivo ou o password for errado, retorna erro
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Credenciais inválidas.',
        }),
      };
    }
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor.',
      }),
    };
  }
};
