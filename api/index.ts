import { ApolloServer } from "apollo-server-micro";
import graphQLSchema from "swagger-to-graphql";

const proxyUrl = "https://esi.evetech.net/latest";
const pathToSwaggerSchema = `${__dirname}/swagger.json`;
console.log(pathToSwaggerSchema);

let server = undefined;

const createServer = async () => {
  if (server) return server;
  server = new ApolloServer({
    schema: graphQLSchema(pathToSwaggerSchema, proxyUrl),
    playground: true
  });
  return server;
};

export default async function(req, res) {
  const server = await createServer();
  const handler = server.createHandler({ path: "/api/" });
  return handler(req, res);
}
