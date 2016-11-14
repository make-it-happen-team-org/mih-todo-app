import { AlgorithmServerController  as algorithm } from '../controllers/algorithm.server.controller';

export default app => {
  app.route('/algorithm/free-time').get(algorithm.getFreeTime);
  app.route('/algorithm/occupied-time').get(algorithm.getOccupiedTime);
};
