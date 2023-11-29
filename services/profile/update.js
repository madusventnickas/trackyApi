'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    // Extrai os dados do corpo da solicitação
    const { email, name, password } = JSON.parse(event.body);

    // Define o nome do arquivo no S3 com base no email
    const fileName = `${email}.json`;

    // Verifica se o arquivo já existe no S3
    const headParams = {
      Bucket: 'trackymy',
      Key: fileName,
    };

    try {
      await s3.headObject(headParams).promise();
    } catch (headErr) {
      // Se o arquivo não existir, retorna um erro
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Perfil não encontrado. O arquivo no S3 não existe.',
        }),
      };
    }

    // Cria um objeto JSON com os dados recebidos
    const profileData = {
      email,
      name,
      password,
    };

    // Parâmetros para salvar o objeto no S3
    const putParams = {
      Bucket: 'seu-bucket-s3',
      Key: fileName,
      Body: JSON.stringify(profileData),
      ContentType: 'application/json',
    };

    // Salva o objeto no S3
    await s3.putObject(putParams).promise();

    // Retorna uma resposta de sucesso
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Perfil atualizado com sucesso!',
      }),
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);

    // Retorna uma resposta de erro se algo der errado
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor ao atualizar perfil.',
      }),
    };
  }
};
