import { NowRequest, NowResponse } from "@now/node";
import { ApolloServer } from "apollo-server-micro";
import graphQLSchema from "swagger-to-graphql";

const proxyUrl = "https://esi.evetech.net/latest";
const pathToSwaggerSchema = `${__dirname}/swagger.json`;

interface Headers {
  authorization?: string;
  "User-Agent": string;
}

let server = undefined;

const createServer = async (headers: Headers) => {
  if (server) return server;
  server = new ApolloServer({
    schema: graphQLSchema(pathToSwaggerSchema, proxyUrl, headers),
    playground: true,
    introspection: true,
    engine: {
      apiKey: process.env.ENGINE_API_KEY
    }
  });
  return server;
};

export default async function(req: NowRequest, res: NowResponse) {
  const headers: Headers = {
    "User-Agent": "eveql - https://eveql.xyz"
  };
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }
  const server = await createServer(headers);
  const handler = server.createHandler({ path: "/api/" });
  return handler(req, res);
}
