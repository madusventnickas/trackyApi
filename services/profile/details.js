'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    // Extrai o email do corpo da solicitação
    const { email } = JSON.parse(event.body);

    // Define o nome do arquivo no S3 com base no email
    const fileName = `${email}.json`;

    // Parâmetros para obter o objeto no S3
    const params = {
      Bucket: 'trackymy',
      Key: fileName,
    };

    // Obtém o objeto do S3
    const data = await s3.getObject(params).promise();

    // Converte o conteúdo do objeto para JSON
    const profileDetails = JSON.parse(data.Body.toString());

    // Retorna os detalhes do perfil como resposta
    return {
      statusCode: 200,
      body: JSON.stringify(profileDetails),
    };
  } catch (error) {
    console.error('Erro ao obter detalhes do perfil:', error);

    // Retorna uma resposta de erro se algo der errado
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor ao obter detalhes do perfil.',
      }),
    };
  }
};
