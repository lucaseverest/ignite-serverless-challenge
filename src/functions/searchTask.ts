import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "src/utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  //fazer a busca no dynamo de todas as tasks com o userid = userid
  const response = await document
    .scan({
      TableName: "users_tasks",
      FilterExpression: "user_id =:user_id",
      ExpressionAttributeValues: {
        ":user_id": userid,
      },
    })
    .promise();

  const userTasks = response.Items;

  if (userTasks[0]) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        userTasks,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Não há tarefas para esse usuário.",
    }),
  };
};
