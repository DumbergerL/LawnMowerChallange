import fastify from 'fastify'
import DefaultGarden from './Garden/Default/DefaultGarden'
import { factory } from './LawnMower/Default/IncidenceEqualsReflectionLawnMower'
import Simulation from './Simulation/Simulation'
import LongGarden from './Garden/Default/LongGarden'
import AngleCrookedGarden from './Garden/Default/AngleCrookedGarden'
import UShapeGarden from './Garden/Default/UShapeGarden'

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

const simulation = new Simulation(new UShapeGarden(), factory);
simulation.initalize();

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

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})