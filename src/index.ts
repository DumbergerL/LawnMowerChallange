import fastify, { FastifyRequest } from 'fastify'
import DefaultGarden from './Garden/Default/DefaultGarden'
import { factory } from './LawnMower/Default/DumbLawnMower'
import Simulation from './Simulation/Simulation'
import NormalGarden from './Garden/Default/NormalGarden'
import { Garden } from './Garden/Garden'
import { LawnMower } from './LawnMower/LawnMower'

const server = fastify()

server.addHook('preHandler', (req, res, done) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "*");
  const isPreflight = /options/i.test(req.method);
  if (isPreflight) {
    return res.send();
  }

  done();
})

let simulation = new Simulation(new NormalGarden(), factory);
simulation.initalize();

server.get('/configuration' , async (request, reply) => {
  return {
    gardens: Garden.getAllGardens().map(gardenRegistry => {
      return {
        id: gardenRegistry.id,
        name: gardenRegistry.garden.constructor.name
      }
    }),
    lawnMowers: LawnMower.getAllLawnMowerFactories().map(lawnMowerRegistry => {
      return {
        id: lawnMowerRegistry.id,
        name: lawnMowerRegistry.factory.constructor.name
      }
    }),
  }
});

server.post('/startSimulation', async (request: FastifyRequest, reply) => {
  const body = request.body as {
    gardenId?: number,
    lawnMowerId?: number
  }

  const gardenId = body.gardenId;
  const lawnMowerId = body.lawnMowerId;
  
  const garden = Garden.getAllGardens().find(gardenRegistry => gardenRegistry.id == gardenId)?.garden ?? new DefaultGarden();
  const lawnMowerFactory = LawnMower.getAllLawnMowerFactories().find(lawnMowerRegistry => lawnMowerRegistry.id == lawnMowerId)?.factory ?? factory;

  simulation = new Simulation(garden, lawnMowerFactory);
  simulation.initalize();

  return {
    status: 'OK'
  };
})

server.get('/garden', async (request, reply) => {
  return {
    boundaryLength: simulation.getBoundaryLength(),
    boundaryNodes: simulation.getBoundaryNodes(),
    lawnResolution: simulation.getLawnResolution(),
    ... simulation.getSimulationStatus()
  };
})

server.post('/step', async (request, reply) => {
  return simulation.step();
})

server.post('/reset', async (request, reply) => {
  simulation.initalize();
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})