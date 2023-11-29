'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    // Consulta o S3 para obter a lista de locais
    const params = {
      Bucket: 'trackymy',
    };

    const data = await s3.listObjectsV2(params).promise();

    // Extrai os nomes dos locais a partir dos objetos no S3
    const locations = data.Contents.map(obj => obj.Key.replace('.json', ''));

    // Retorna a lista de locais
    return {
      statusCode: 200,
      body: JSON.stringify({
        locations,
      }),
    };
  } catch (error) {
    console.error('Erro ao listar locais:', error);

    // Retorna uma resposta de erro se algo der errado
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor ao listar locais.',
      }),
    };
  }
};
