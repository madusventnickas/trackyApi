'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    // Extrai o nome do local do corpo da solicitação
    const { locationName } = JSON.parse(event.body);

    // Define o nome do arquivo no S3 com base no nome do local
    const fileName = `${locationName}.json`;

    // Parâmetros para excluir o objeto no S3
    const params = {
      Bucket: 'trackymy',
      Key: fileName,
    };

    // Exclui o objeto no S3
    await s3.deleteObject(params).promise();

    // Retorna uma resposta de sucesso
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Local removido com sucesso!',
      }),
    };
  } catch (error) {
    console.error('Erro ao remover local:', error);

    // Retorna uma resposta de erro se algo der errado
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor ao remover local.',
      }),
    };
  }
};
