/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import fastify, { FastifyRequest, FastifyInstance } from 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    fastify?: FastifyInstance;
  }

  export interface FastifyReply {
    fromCache?: boolean;
  }
}
