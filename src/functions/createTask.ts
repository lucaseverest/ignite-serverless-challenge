import { document } from "src/utils/dynamodbClient";

const { v4: uuidv4 } = require("uuid");

interface ICreateTask {
  title: string;
  deadline: string;
}

export const handle = async (event) => {
  const { userid } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateTask;

  await document
    .put({
      TableName: "users_tasks",
      Item: {
        id: uuidv4(),
        user_id: userid,
        title,
        done: false,
        deadline: new Date(deadline).toUTCString(),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Task created!",
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
