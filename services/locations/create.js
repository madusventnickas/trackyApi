'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    // Extrai os dados do corpo da solicitação
    const { locationName, description, latitude, longitude } = JSON.parse(event.body);

    // Define o nome do arquivo no S3 com base no nome do local
    const fileName = `${locationName}.json`;

    // Verifica se o arquivo já existe no S3
    const headParams = {
      Bucket: 'seu-bucket-s3',
      Key: fileName,
    };

    try {
      await s3.headObject(headParams).promise();
      
      // Se o arquivo já existir, retorna um erro
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Local já existe. Escolha outro nome para o local.',
        }),
      };
    } catch (headErr) {
      // Se o arquivo não existir, continua com a criação do local
    }

    // Cria um objeto JSON com os dados recebidos
    const locationData = {
      locationName,
      description,
      latitude,
      longitude,
    };

    // Parâmetros para salvar o objeto no S3
    const putParams = {
      Bucket: 'trackymy',
      Key: fileName,
      Body: JSON.stringify(locationData),
      ContentType: 'application/json',
    };

    // Salva o objeto no S3
    await s3.putObject(putParams).promise();

    // Retorna uma resposta de sucesso
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Local criado com sucesso!',
      }),
    };
  } catch (error) {
    console.error('Erro ao criar local:', error);

    // Retorna uma resposta de erro se algo der errado
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor ao criar local.',
      }),
    };
  }
};
