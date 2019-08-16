import { NowRequest, NowResponse } from "@now/node";
import { ApolloServer } from "apollo-server-micro";
import graphQLSchema from "swagger-to-graphql";

const proxyUrl = "https://esi.evetech.net/latest";
const pathToSwaggerSchema = `${__dirname}/swagger.json`;
console.log(pathToSwaggerSchema);

let server = undefined;

const createServer = async headers => {
  if (server) return server;
  server = new ApolloServer({
    schema: graphQLSchema(pathToSwaggerSchema, proxyUrl, headers),
    playground: true,
    introspection: true
  });
  return server;
};

export default async function(req: NowRequest, res: NowResponse) {
  const headers: {
    authorization?: string;
    "User-Agent": string;
  } = {
    "User-Agent": "eveql - https://eveql.xyz"
  };
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }
  const server = await createServer(headers);
  const handler = server.createHandler({ path: "/api/" });
  return handler(req, res);
}
