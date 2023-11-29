'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    // Extrai o nome do local do corpo da solicitação
    const { locationName } = JSON.parse(event.body);

    // Define o nome do arquivo no S3 com base no nome do local
    const fileName = `${locationName}.json`;

    // Parâmetros para obter o objeto no S3
    const params = {
      Bucket: 'trackymy',
      Key: fileName,
    };

    // Obtém o objeto do S3
    const data = await s3.getObject(params).promise();

    // Converte o conteúdo do objeto para JSON
    const locationDetails = JSON.parse(data.Body.toString());

    // Retorna os detalhes do local como resposta
    return {
      statusCode: 200,
      body: JSON.stringify(locationDetails),
    };
  } catch (error) {
    console.error('Erro ao obter detalhes do local:', error);

    // Retorna uma resposta de erro se algo der errado
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor ao obter detalhes do local.',
      }),
    };
  }
};
